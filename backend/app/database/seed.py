import datetime
from sqlalchemy.orm import Session
from backend.app.database.session import SessionLocal, engine
from backend.app.database.base import Base
from backend.app.models.models import (
    SchemeCategory,
    Scheme,
    SchemeEligibilityRule,
    SchemeDocument,
    SchemeSource,
    User
)
from backend.app.core.security import hash_password

def seed_database():
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    try:
        # Check if already seeded
        if db.query(SchemeCategory).count() > 0:
            print("Database already contains categories. Skipping seed.")
            return

        print("Seeding initial government categories and schemes...")

        # 1. Categories
        categories_data = [
            {
                "name": "Agriculture & Farmers",
                "name_te": "వ్యవసాయం & రైతులు",
                "slug": "agriculture",
                "description": "Financial aid, crop insurance, irrigation, and subsidies for small and marginal cultivators.",
                "icon": "Wheat"
            },
            {
                "name": "Healthcare & Life",
                "name_te": "ఆరోగ్య సంరక్షణ",
                "slug": "healthcare",
                "description": "Free secondary/tertiary hospital treatment, maternal health, and medical insurance coverage.",
                "icon": "HeartHandshake"
            },
            {
                "name": "Housing & Shelter",
                "name_te": "గృహ నిర్మాణం",
                "slug": "housing",
                "description": "Subsidies and low-interest credit for construction of permanent all-weather pucca homes.",
                "icon": "Home"
            },
            {
                "name": "Financial Inclusion",
                "name_te": "ఆర్థిక సహాయం & రుణాలు",
                "slug": "finance",
                "description": "Collateral-free micro loans, pension schemes, and banking access for unbanked citizens.",
                "icon": "Coins"
            },
            {
                "name": "Women & Child Development",
                "name_te": "మహిళా & శిశు సంక్షేమం",
                "slug": "women-child",
                "description": "High-interest savings, nutrition programs, and institutional delivery incentives.",
                "icon": "Users"
            },
            {
                "name": "Education & Skills",
                "name_te": "విద్య & నైపుణ్యాలు",
                "slug": "education",
                "description": "Scholarships, collateral-free study loans, and vocational training across India.",
                "icon": "GraduationCap"
            },
            {
                "name": "Entrepreneurship & MSME",
                "name_te": "వ్యాపారం & స్వయం ఉపాధి",
                "slug": "entrepreneurship",
                "description": "Capital subsidies and credit support for micro and rural enterprise founders.",
                "icon": "Briefcase"
            }
        ]

        cat_objs = {}
        for c in categories_data:
            cat = SchemeCategory(**c)
            db.add(cat)
            db.flush()
            cat_objs[c["slug"]] = cat

        # 2. Verified Schemes
        schemes_data = [
            {
                "name": "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
                "name_te": "పీఎం కిసాన్ (కిసాన్ సమ్మాన్ నిధి)",
                "slug": "pm-kisan",
                "category_id": cat_objs["agriculture"].id,
                "level": "Central",
                "state": "All India",
                "summary": "Central sector initiative providing guaranteed income support of ₹6,000 annually to all landholding farmer families across India.",
                "summary_te": "భారతదేశంలోని చిన్న మరియు సన్నకారు రైతు కుటుంబాలకు ఏటా ₹6,000 ఆర్థిక చేయూతనిచ్చే కేంద్ర ప్రభుత్వ పథకం.",
                "description": "Under the PM-KISAN scheme, financial assistance of ₹6,000 per annum is provided to all landholding farmer families, subject to certain exclusion criteria related to higher income status. The amount is directly credited in three equal four-monthly installments of ₹2,000 into the Aadhaar-linked bank accounts of beneficiary farmers.",
                "description_te": "పీఎం కిసాన్ పథకం కింద అర్హులైన రైతు కుటుంబాలకు ఏటా ₹6,000 మొత్తం 3 సమాన విడతల్లో నేరుగా ఆధార్ అనుసంధాన బ్యాంక్ ఖాతాల్లోకి జమ చేయబడుతుంది.",
                "benefits": "₹6,000 per year delivered in 3 installments of ₹2,000 directly via Direct Benefit Transfer (DBT).",
                "benefits_te": "ఏడాదికి ₹6,000 నగదు, 3 విడతల్లో (ప్రతీ 4 నెలలకు ₹2,000) నేరుగా బ్యాంకు ఖాతాల్లోకి జమ.",
                "application_procedure": "1. Visit the official PM-KISAN portal (pmkisan.gov.in) -> Farmers Corner.\n2. Click on 'New Farmer Registration'.\n3. Enter Aadhaar Number and select your State.\n4. Fill in land ownership details (Survey / Khata number).\n5. Complete Aadhaar e-KYC via OTP or biometric CSC point.",
                "application_procedure_te": "1. అధికారిక pmkisan.gov.in పోర్టల్‌లో 'Farmers Corner' కు వెళ్లండి.\n2. 'New Farmer Registration' పై క్లిక్ చేయండి.\n3. ఆధార్ నంబర్ మరియు మీ రాష్ట్రాన్ని ఎంచుకోండి.\n4. భూమి పట్టా / సర్వే నంబర్ వివరాలను నమోదు చేయండి.\n5. ఆధార్ OTP లేదా బయోమెట్రిక్ ద్వారా e-KYC పూర్తి చేయండి.",
                "official_website": "https://pmkisan.gov.in",
                "rules": [
                    {"rule_type": "occupation", "rule_operator": "eq", "rule_value": "Farmer", "description": "Applicant or family must be engaged in farming.", "description_te": "దరఖాస్తుదారు లేదా కుటుంబం వ్యవసాయం చేస్తూ ఉండాలి."},
                    {"rule_type": "land_holding", "rule_operator": "gt", "rule_value": "0", "description": "Applicant must hold cultivable land registered in their name.", "description_te": "దరఖాస్తుదారు పేరిట నమోదైన సాగుభూమి ఉండాలి."},
                    {"rule_type": "income_tax_payer", "rule_operator": "eq", "rule_value": "false", "description": "Applicant must not be an institutional landholder or income tax payer.", "description_te": "దరఖాస్తుదారు ఆదాయపు పన్ను చెల్లింపుదారు కాకూడదు."}
                ],
                "documents": [
                    {"document_type": "Aadhaar Card", "document_type_te": "ఆధార్ కార్డు", "description": "Aadhaar number linked to active mobile phone for OTP authentication.", "is_mandatory": True},
                    {"document_type": "Land Ownership Record (Khata/RoR)", "document_type_te": "భూమి పట్టాదారు పాస్ పుస్తకం / 1B అడంగల్", "description": "Revenue department land passbook showing cultivable acreage.", "is_mandatory": True},
                    {"document_type": "Bank Account Passbook", "document_type_te": "బ్యాంక్ ఖాతా పుస్తకం", "description": "Active bank account linked with NPCI / Aadhaar DBT.", "is_mandatory": True}
                ],
                "sources": [
                    {"source_name": "Ministry of Agriculture & Farmers Welfare Gazette", "url": "https://pmkisan.gov.in", "verification_status": "Verified"}
                ]
            },
            {
                "name": "Ayushman Bharat (PM-JAY)",
                "name_te": "ఆయుష్మాన్ భారత్ (పీఎం జేఏవై)",
                "slug": "ayushman-bharat",
                "category_id": cat_objs["healthcare"].id,
                "level": "Central",
                "state": "All India",
                "summary": "Flagship national health protection scheme providing secondary and tertiary hospitalization cover up to ₹5 Lakh per family per year.",
                "summary_te": "పేద కుటుంబాలకు ద్వితీయ మరియు తృతీయ స్థాయి ఆసుపత్రి చికిత్సల కోసం ఏడాదికి ₹5 లక్షల ఉచిత ఆరోగ్య బీమా కల్పించే పథకం.",
                "description": "Ayushman Bharat PM-JAY is completely cashless and paperless at empaneled public and private hospitals. It covers pre-hospitalization, hospitalization, surgeries, medications, and 15 days of post-hospitalization expenses without any cap on family size or age.",
                "description_te": "ఈ పథకం కింద కుటుంబ సభ్యుల సంఖ్యపై ఎటువంటి పరిమితి లేకుండా ₹5 లక్షల వరకు ప్రభుత్వ మరియు ప్రైవేటు నెట్‌వర్క్ ఆసుపత్రులలో ఉచిత నగదు రహిత చికిత్స లభిస్తుంది.",
                "benefits": "Free cashless hospitalization cover up to ₹5,00,000 per family annually for over 1,949 medical packages.",
                "benefits_te": "కుటుంబానికి ఏడాదికి ₹5,00,000 వరకు ఉచిత నగదు రహిత ఆసుపత్రి చికిత్స ప్రయోజనం.",
                "application_procedure": "1. Visit beneficiary.nha.gov.in or nearest Ayushman Mitra kiosk at any government hospital.\n2. Search eligibility using Ration Card, Aadhaar, or PM-JAY Family ID.\n3. Complete instant e-KYC using Aadhaar OTP or facial authentication.\n4. Download your Ayushman PVC Golden Card.",
                "application_procedure_te": "1. beneficiary.nha.gov.in పోర్టల్ లేదా సమీప ప్రభుత్వ ఆసుపత్రిలోని ఆయుష్మాన్ మిత్ర వద్దకు వెళ్లండి.\n2. రేషన్ కార్డు లేదా ఆధార్ ద్వారా మీ అర్హతను పరిశీలించండి.\n3. ఆధార్ e-KYC పూర్తి చేసి ఆయుష్మాన్ గోల్డెన్ కార్డును డౌన్‌లోడ్ చేసుకోండి.",
                "official_website": "https://pmjay.gov.in",
                "rules": [
                    {"rule_type": "annual_income", "rule_operator": "lte", "rule_value": "250000", "description": "Family income generally below ₹2.5 Lakh or listed in SECC deprivation criteria.", "description_te": "వార్షిక కుటుంబ ఆదాయం ₹2.5 లక్షల లోపు ఉండాలి."},
                    {"rule_type": "ration_card", "rule_operator": "eq", "rule_value": "true", "description": "Possession of an active food security/ration card.", "description_te": "చెల్లుబాటు అయ్యే ఆహార భద్రతా / రేషన్ కార్డు కలిగి ఉండాలి."}
                ],
                "documents": [
                    {"document_type": "Aadhaar Card", "document_type_te": "ఆధార్ కార్డు", "description": "For identity and biometric verification.", "is_mandatory": True},
                    {"document_type": "Ration Card", "document_type_te": "రేషన్ కార్డు / ఆహార భద్రతా కార్డు", "description": "Valid family ration card with applicant name listed.", "is_mandatory": True}
                ],
                "sources": [
                    {"source_name": "National Health Authority (NHA)", "url": "https://pmjay.gov.in", "verification_status": "Verified"}
                ]
            },
            {
                "name": "Pradhan Mantri Awas Yojana (PMAY)",
                "name_te": "ప్రధాన మంత్రి ఆవాస్ యోజన (పీఎంఏవై)",
                "slug": "pm-awas-yojana",
                "category_id": cat_objs["housing"].id,
                "level": "Central",
                "state": "All India",
                "summary": "Affordable housing mission enabling homeless and kutcha house dwellers to construct or acquire pucca homes.",
                "summary_te": "సొంత ఇల్లు లేని పేద కుటుంబాలకు శాశ్వత పక్కా గృహాల నిర్మాణం కోసం ఆర్థిక సాయం అందించే పథకం.",
                "description": "PMAY addresses urban and rural housing shortages by offering interest subsidies (CLSS) up to ₹2.67 Lakh for first-time homebuyers or direct financial assistance of ₹1.20 Lakh (plains) to ₹1.30 Lakh (hilly areas) for rural house construction.",
                "description_te": "నగరాలు మరియు గ్రామీణ ప్రాంతాల్లో ఇల్లు లేని పేదలకు పక్కా ఇంటి నిర్మాణానికి అవసరమైన నిధులను రాయితీ రూపంలో ప్రభుత్వం అందిస్తుంది.",
                "benefits": "Direct grant of ₹1.20 - ₹1.30 Lakh in rural areas; interest subsidy up to ₹2.67 Lakh in urban areas.",
                "benefits_te": "గ్రామీణ ప్రాంతంలో ₹1.20 - ₹1.30 లక్షల ప్రత్యక్ష ఆర్థిక సాయం; పట్టణ ప్రాంతంలో ₹2.67 లక్షల వరకు వడ్డీ రాయితీ.",
                "application_procedure": "1. For rural: Enrolment through Gram Sabha priority list under PMAY-G Awaas+.\n2. For urban: Visit pmaymis.gov.in -> Citizen Assessment -> Apply Online.\n3. Enter Aadhaar and family details.\n4. Upload bank account and current shelter status proof.",
                "application_procedure_te": "1. గ్రామీణ ప్రాంతంలో గ్రామసభ ఆవాస్+ జాబితా ద్వారా ఎంపిక జరుగుతుంది.\n2. పట్టణ ప్రాంతంలో pmaymis.gov.in వెబ్‌సైట్‌లో ఆన్‌లైన్ అసెస్‌మెంట్ పూరించాలి.",
                "official_website": "https://pmaymis.gov.in",
                "rules": [
                    {"rule_type": "pucca_house", "rule_operator": "eq", "rule_value": "false", "description": "Family must not own a pucca house anywhere in India.", "description_te": "దేశంలో ఎక్కడా కుటుంబానికి పక్కా ఇల్లు ఉండకూడదు."},
                    {"rule_type": "annual_income", "rule_operator": "lte", "rule_value": "300000", "description": "EWS family income below ₹3 Lakh per annum for maximum grant.", "description_te": "EWS కింద కుటుంబ వార్షిక ఆదాయం ₹3 లక్షల లోపు ఉండాలి."}
                ],
                "documents": [
                    {"document_type": "Aadhaar Card", "document_type_te": "ఆధార్ కార్డు", "description": "Aadhaar of all family members.", "is_mandatory": True},
                    {"document_type": "Income Certificate", "document_type_te": "ఆదాయ ధృవీకరణ పత్రం (మీసేవ)", "description": "Issued by Tahsildar / Revenue Authority.", "is_mandatory": True},
                    {"document_type": "Bank Account Details", "document_type_te": "బ్యాంక్ ఖాతా వివరాలు", "description": "Aadhaar linked account passbook.", "is_mandatory": True}
                ],
                "sources": [
                    {"source_name": "Ministry of Housing and Urban Affairs", "url": "https://pmaymis.gov.in", "verification_status": "Verified"}
                ]
            },
            {
                "name": "Pradhan Mantri Mudra Yojana (PMMY)",
                "name_te": "పీఎం ముద్రా యోజన (పీఎంఎంవై)",
                "slug": "pm-mudra-yojana",
                "category_id": cat_objs["finance"].id,
                "level": "Central",
                "state": "All India",
                "summary": "Collateral-free institutional micro-credit loans up to ₹10 Lakh for small enterprise owners and entrepreneurs.",
                "summary_te": "చిరు వ్యాపారులు మరియు సూక్ష్మ పరిశ్రమల స్థాపనకు ₹10 లక్షల వరకు పూచీకత్తు లేని బ్యాంక్ రుణ పథకం.",
                "description": "PMMY provides loans to micro enterprises in manufacturing, trading, and services across three stages: Shishu (loans up to ₹50,000), Kishore (loans ₹50,000 to ₹5,00,000), and Tarun (loans ₹5,00,000 to ₹10,00,000) with zero processing fees.",
                "description_te": "చిన్న వ్యాపారులు ఎటువంటి హామీ ఇవ్వకుండానే వ్యాపార అభివృద్ధి కోసం తక్కువ వడ్డీతో బ్యాంక్ రుణాలు పొందవచ్చు.",
                "benefits": "Collateral-free institutional loans up to ₹10 Lakh with competitive interest rates and no collateral requirement.",
                "benefits_te": "పూచీకత్తు లేకుండా ₹10 లక్షల వరకు వ్యాపార రుణాలు.",
                "application_procedure": "1. Prepare your business plan and quotation for equipment/stock.\n2. Visit udyamimitra.in portal or any commercial/Gramin bank branch.\n3. Fill in Mudra Loan Application Form.\n4. Submit business identity, GST/Udyam registration, and bank statements.",
                "application_procedure_te": "1. మీ వ్యాపార ప్రణాళికను సిద్ధం చేసుకోండి.\n2. సమీప ప్రభుత్వ లేదా గ్రామీణ బ్యాంక్ శాఖను లేదా udyamimitra.in పోర్టల్‌ను సంప్రదించండి.",
                "official_website": "https://www.mudra.org.in",
                "rules": [
                    {"rule_type": "age", "rule_operator": "gte", "rule_value": "18", "description": "Applicant must be at least 18 years of age.", "description_te": "దరఖాస్తుదారుకు కనీసం 18 సంవత్సరాల వయస్సు ఉండాలి."},
                    {"rule_type": "defaulter", "rule_operator": "eq", "rule_value": "false", "description": "Must not be a defaulter to any bank or financial institution.", "description_te": "ఏ బ్యాంక్‌లోనూ రుణ ఎగవేతదారుగా ఉండకూడదు."}
                ],
                "documents": [
                    {"document_type": "Aadhaar Card", "document_type_te": "ఆధార్ కార్డు", "description": "Government Photo ID.", "is_mandatory": True},
                    {"document_type": "Business Proof / Udyam Certificate", "document_type_te": "వ్యాపార రిజిస్ట్రేషన్ / ఉద్యమ్ సర్టిఫికేట్", "description": "Trade license or MSME registration.", "is_mandatory": False},
                    {"document_type": "Last 6 Months Bank Statement", "document_type_te": "గత 6 నెలల బ్యాంక్ స్టేట్‌మెంట్", "description": "Active operational account.", "is_mandatory": True}
                ],
                "sources": [
                    {"source_name": "MUDRA Ltd / Department of Financial Services", "url": "https://www.mudra.org.in", "verification_status": "Verified"}
                ]
            },
            {
                "name": "Sukanya Samriddhi Yojana (SSY)",
                "name_te": "సుకున్య సమృద్ధి యోజన (ఎస్ఎస్వై)",
                "slug": "sukanya-samriddhi",
                "category_id": cat_objs["women-child"].id,
                "level": "Central",
                "state": "All India",
                "summary": "High-interest, government-backed small savings program to build education and marriage funds for girl children.",
                "summary_te": "ఆడపిల్లల ఉన్నత విద్య మరియు వివాహం కోసం అత్యధిక వడ్డీ అందించే కేంద్ర ప్రభుత్వ చిన్న పొదుపు పథకం.",
                "description": "Opened by parents or legal guardians for a girl child under age 10. Deposits earn a high government-set interest rate (currently 8.2%) with triple tax exemption (EEE) under Section 80C.",
                "description_te": "10 ఏళ్లలోపు ఆడపిల్లల పేరిట పోస్టాఫీసు లేదా బ్యాంకుల్లో ఖాతా తెరవవచ్చు. 8.2% వరకు వార్షిక వడ్డీ లభిస్తుంది.",
                "benefits": "8.2% annual interest compounded yearly, full tax deduction under 80C, tax-free maturity after 21 years.",
                "benefits_te": "8.2% వార్షిక చక్రవడ్డీ, పూర్తి పన్ను మినహాయింపు మరియు 21 ఏళ్ల తర్వాత చేతికి అందే భారీ మొత్తం.",
                "application_procedure": "1. Visit any Post Office or authorized commercial bank branch.\n2. Submit SSY Form-1 along with child birth certificate and guardian KYC.\n3. Initial deposit can be as low as ₹250 (max ₹1.5 Lakh/year).",
                "application_procedure_te": "1. సమీప తపాలా కార్యాలయం (Post Office) లేదా జాతీయ బ్యాంకును సంప్రదించండి.\n2. బాలిక జనన ధ్రువీకరణ పత్రం మరియు తల్లిదండ్రుల ఆధార్ సమర్పించండి.",
                "official_website": "https://www.indiapost.gov.in",
                "rules": [
                    {"rule_type": "age", "rule_operator": "lte", "rule_value": "10", "description": "Girl child must be below 10 years of age at the time of opening.", "description_te": "ఖాతా తెరిచే సమయానికి బాలిక వయస్సు 10 సంవత్సరాల లోపు ఉండాలి."},
                    {"rule_type": "gender", "rule_operator": "eq", "rule_value": "Female", "description": "Beneficiary must be a girl child.", "description_te": "లబ్ధిదారురాలు తప్పనిసరిగా బాలిక అయి ఉండాలి."}
                ],
                "documents": [
                    {"document_type": "Girl Child Birth Certificate", "document_type_te": "బాలిక జనన ధ్రువీకరణ పత్రం (Birth Certificate)", "description": "Issued by municipal authority or registrar.", "is_mandatory": True},
                    {"document_type": "Parents Aadhaar Card", "document_type_te": "తల్లిదండ్రుల ఆధార్ కార్డు", "description": "Guardian identity and address verification.", "is_mandatory": True}
                ],
                "sources": [
                    {"source_name": "India Post / Ministry of Finance", "url": "https://www.indiapost.gov.in", "verification_status": "Verified"}
                ]
            }
        ]

        for s_data in schemes_data:
            rules = s_data.pop("rules")
            docs = s_data.pop("documents")
            sources = s_data.pop("sources")

            scheme = Scheme(**s_data)
            db.add(scheme)
            db.flush()

            for r in rules:
                rule_obj = SchemeEligibilityRule(scheme_id=scheme.id, **r)
                db.add(rule_obj)

            for d in docs:
                doc_obj = SchemeDocument(scheme_id=scheme.id, **d)
                db.add(doc_obj)

            for src in sources:
                src_obj = SchemeSource(scheme_id=scheme.id, **src)
                db.add(src_obj)

        # 3. Create demo synthetic user
        demo_user = User(
            email="citizen@jansathi.gov.in",
            hashed_password=hash_password("JanSathiDemo2026!"),
            full_name="Ananya Sharma",
            preferred_language="en",
            role="citizen"
        )
        db.add(demo_user)

        admin_user = User(
            email="admin@jansathi.gov.in",
            hashed_password=hash_password("AdminJanSathi2026!"),
            full_name="Rajesh Varma (Nodal Officer)",
            preferred_language="te",
            role="admin"
        )
        db.add(admin_user)

        db.commit()
        print("Database seeding completed successfully with 7 categories, 5 detailed schemes, and demo accounts.")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
