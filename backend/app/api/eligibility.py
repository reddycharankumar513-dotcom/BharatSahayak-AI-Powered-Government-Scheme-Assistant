from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

from backend.app.database.session import get_db
from backend.app.models.models import Scheme, SchemeEligibilityRule, SchemeDocument, User
from backend.app.api.deps import get_current_user_optional

router = APIRouter(prefix="/eligibility", tags=["Eligibility Checker"])

class EligibilityCheckRequest(BaseModel):
    scheme_slug: Optional[str] = None  # None evaluates top schemes
    age: Optional[int] = Field(default=35, ge=0, le=120)
    gender: Optional[str] = "Any"
    state: Optional[str] = "Andhra Pradesh"
    occupation: Optional[str] = "Farmer"
    annual_income: Optional[float] = Field(default=180000, ge=0)
    land_holding_acres: Optional[float] = Field(default=2.5, ge=0)
    has_ration_card: Optional[bool] = True
    owns_pucca_house: Optional[bool] = False
    is_income_tax_payer: Optional[bool] = False
    language: Optional[str] = "en"

class ConditionResult(BaseModel):
    rule_type: str
    description: str
    description_te: Optional[str] = None
    is_satisfied: bool
    is_mandatory: bool
    notes: Optional[str] = None

class SchemeEligibilityReport(BaseModel):
    scheme_id: int
    scheme_name: str
    scheme_name_te: Optional[str] = None
    scheme_slug: str
    status: str  # "Potentially Eligible", "Potentially Ineligible", "More Information Required"
    match_percentage: int
    satisfied_conditions: List[ConditionResult] = []
    unmet_conditions: List[ConditionResult] = []
    required_documents: List[Dict[str, Any]] = []
    official_application_link: str
    explanation: str
    explanation_te: str
    disclaimer: str

def evaluate_scheme_rules(scheme: Scheme, payload: EligibilityCheckRequest) -> SchemeEligibilityReport:
    satisfied = []
    unmet = []

    for rule in scheme.eligibility_rules:
        rtype = rule.rule_type.lower()
        roperator = rule.rule_operator.lower()
        rval = rule.rule_value.lower()
        passed = True
        notes = ""

        if rtype == "occupation":
            user_occ = (payload.occupation or "").lower()
            if rval in ["farmer", "రైతు"]:
                passed = any(k in user_occ for k in ["farmer", "agri", "cultivat", "రైతు"])
            elif rval in ["student", "విద్యార్థి"]:
                passed = any(k in user_occ for k in ["student", "study", "విద్యార్థి"])
            elif rval in ["small business", "micro"]:
                passed = any(k in user_occ for k in ["business", "shop", "trade", "kirana", "వ్యాపార"])
            else:
                passed = (rval == user_occ)
            notes = f"User is '{payload.occupation}', Scheme targets '{rule.rule_value}'"

        elif rtype in ["land_holding", "land"]:
            user_land = payload.land_holding_acres or 0.0
            threshold = float(rule.rule_value)
            if roperator == "gt":
                passed = user_land > threshold
            elif roperator == "gte":
                passed = user_land >= threshold
            elif roperator == "lte":
                passed = user_land <= threshold
            notes = f"User holds {user_land} acres (Threshold: {threshold} acres)"

        elif rtype in ["annual_income", "income"]:
            user_inc = payload.annual_income or 0.0
            threshold = float(rule.rule_value)
            if roperator in ["lte", "lt"]:
                passed = user_inc <= threshold
            elif roperator in ["gte", "gt"]:
                passed = user_inc >= threshold
            notes = f"Annual income: ₹{user_inc:,.0f} (Cap: ₹{threshold:,.0f})"

        elif rtype == "age":
            user_age = payload.age or 0
            threshold = int(rule.rule_value)
            if roperator == "gte":
                passed = user_age >= threshold
            elif roperator == "lte":
                passed = user_age <= threshold
            notes = f"User age: {user_age} years (Requirement: {roperator} {threshold})"

        elif rtype in ["income_tax_payer", "tax_payer"]:
            # If scheme requires NOT an income tax payer
            passed = not payload.is_income_tax_payer
            notes = f"Income tax payer status: {'Yes' if payload.is_income_tax_payer else 'No'}"

        elif rtype == "ration_card":
            passed = bool(payload.has_ration_card)
            notes = f"Active Ration Card: {'Yes' if payload.has_ration_card else 'No'}"

        elif rtype in ["pucca_house", "house"]:
            # PMAY requires NOT owning a pucca house
            passed = not payload.owns_pucca_house
            notes = f"Owns Pucca House: {'Yes' if payload.owns_pucca_house else 'No'}"

        elif rtype == "gender":
            user_gender = (payload.gender or "").lower()
            if rval in ["female", "girl", "woman"]:
                passed = user_gender in ["female", "girl", "woman", "any"]
            notes = f"Gender requirement: {rule.rule_value}"

        cond_res = ConditionResult(
            rule_type=rule.rule_type,
            description=rule.description,
            description_te=rule.description_te,
            is_satisfied=passed,
            is_mandatory=rule.is_mandatory,
            notes=notes
        )

        if passed:
            satisfied.append(cond_res)
        else:
            unmet.append(cond_res)

    total_rules = len(scheme.eligibility_rules)
    match_pct = int((len(satisfied) / total_rules) * 100) if total_rules > 0 else 100

    has_mandatory_failure = any(not c.is_satisfied and c.is_mandatory for c in unmet)
    if has_mandatory_failure:
        status_text = "Potentially Ineligible"
    elif match_pct >= 80:
        status_text = "Potentially Eligible"
    else:
        status_text = "More Information Required"

    # Bilingual explanation
    if status_text == "Potentially Eligible":
        exp_en = f"Based on your profile, you satisfy {len(satisfied)} of {total_rules} criteria for {scheme.name}. You appear potentially eligible to receive direct benefits."
        exp_te = f"మీ వివరాల ఆధారంగా, మీరు {scheme.name_te or scheme.name} పథకానికి అవసరమైన {total_rules} నిబంధనలలో {len(satisfied)} నిబంధనలను సంతృప్తిపరిచారు. మీరు ఈ పథకానికి ప్రాథమికంగా అర్హులుగా కనిపిస్తున్నారు."
    else:
        unmet_names = ", ".join([c.description for c in unmet])
        exp_en = f"You may not meet certain mandatory requirements ({unmet_names}). Please review the unmet conditions before applying."
        exp_te = f"మీరు కొన్ని ముఖ్యమైన నిబంధనలను సంతృప్తిపరచలేదు. దరఖాస్తు చేయడానికి ముందు నిబంధనలను ఒకసారి పరిశీలించండి."

    docs = [
        {
            "id": d.id,
            "document_type": d.document_type,
            "document_type_te": d.document_type_te,
            "is_mandatory": d.is_mandatory,
            "description": d.description
        }
        for d in scheme.required_documents
    ]

    return SchemeEligibilityReport(
        scheme_id=scheme.id,
        scheme_name=scheme.name,
        scheme_name_te=scheme.name_te,
        scheme_slug=scheme.slug,
        status=status_text,
        match_percentage=match_pct,
        satisfied_conditions=satisfied,
        unmet_conditions=unmet,
        required_documents=docs,
        official_application_link=scheme.official_website,
        explanation=exp_en,
        explanation_te=exp_te,
        disclaimer="Disclaimer: This assessment is an automated informational estimate based on published criteria and does not constitute official government approval. Formal verification is conducted by respective government departments upon application submission."
    )

@router.post("/check", response_model=List[SchemeEligibilityReport])
def check_eligibility(
    payload: EligibilityCheckRequest,
    db: Session = Depends(get_db)
):
    query = db.query(Scheme).filter(Scheme.is_active == True)
    if payload.scheme_slug and payload.scheme_slug != "all":
        query = query.filter(Scheme.slug == payload.scheme_slug)

    schemes = query.all()
    if not schemes:
        raise HTTPException(status_code=404, detail="No matching schemes found for evaluation")

    reports = []
    for s in schemes:
        report = evaluate_scheme_rules(s, payload)
        reports.append(report)

    # Sort so Potentially Eligible comes first
    reports.sort(key=lambda r: (r.status != "Potentially Eligible", -r.match_percentage))
    return reports
