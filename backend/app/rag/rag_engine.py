import os
import re
import math
from typing import List, Dict, Any, Optional
from datetime import datetime

# RAG Knowledge Chunks from official gazettes and portals
OFFICIAL_KNOWLEDGE_BASE = [
    {
        "id": "pm-kisan-overview",
        "scheme_slug": "pm-kisan",
        "title": "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
        "source": "Ministry of Agriculture & Farmers Welfare (pmkisan.gov.in)",
        "source_url": "https://pmkisan.gov.in",
        "keywords": ["pm-kisan", "kisan", "farmer", "agriculture", "income support", "6000", "installment", "dbt", "రైతు", "కిసాన్", "వ్యవసాయం"],
        "content_en": "PM-KISAN is a Central Sector Scheme providing financial assistance of ₹6,000 per year to landholding farmer families across India. The financial benefit is transferred in three equal four-monthly installments of ₹2,000 directly into Aadhaar-linked bank accounts via Direct Benefit Transfer (DBT).",
        "content_te": "పీఎం కిసాన్ పథకం ద్వారా భారతదేశంలోని సాగుభూమి ఉన్న రైతు కుటుంబాలకు ఏడాదికి ₹6,000 ఆర్థిక సహాయం అందుతుంది. ఈ మొత్తం ప్రతీ 4 నెలలకు ₹2,000 చొప్పున 3 విడతల్లో నేరుగా ఆధార్ అనుసంధాన బ్యాంక్ ఖాతాల్లోకి డీబీటీ (DBT) ద్వారా జమ చేయబడుతుంది.",
        "eligibility_en": "Farmer families with cultivable landholding in their name. Excluded: Institutional landholders, constitutional post holders, income tax payers, serving/retired government employees.",
        "eligibility_te": "సొంతంగా సాగుభూమి ఉన్న రైతు కుటుంబాలు అర్హులు. మినహాయింపులు: ఆదాయపు పన్ను చెల్లింపుదారులు, ప్రభుత్వ ఉద్యోగులు, రాజ్యాంగ పదవుల్లో ఉన్నవారు.",
        "documents_en": "Aadhaar Card, Land Ownership Records (Khata/RoR/Patta), Active Bank Account Passbook with Aadhaar linkage.",
        "documents_te": "ఆధార్ కార్డు, పట్టాదారు పాస్ పుస్తకం (RoR/1B), ఆధార్ అనుసంధాన బ్యాంక్ ఖాతా పుస్తకం.",
        "application_en": "Apply online at pmkisan.gov.in under 'Farmers Corner' -> 'New Farmer Registration', or visit the nearest Common Service Centre (CSC) with land records.",
        "application_te": "pmkisan.gov.in పోర్టల్‌లో 'Farmers Corner' -> 'New Farmer Registration' ద్వారా లేదా సమీప మీసేవ / CSC కేంద్రం ద్వారా దరఖాస్తు చేసుకోవచ్చు."
    },
    {
        "id": "ayushman-bharat-overview",
        "scheme_slug": "ayushman-bharat",
        "title": "Ayushman Bharat (PM-JAY - Pradhan Mantri Jan Arogya Yojana)",
        "source": "National Health Authority (pmjay.gov.in)",
        "source_url": "https://pmjay.gov.in",
        "keywords": ["ayushman", "pm-jay", "health", "hospital", "medical", "insurance", "5 lakh", "treatment", "ఆరోగ్య", "ఆయుష్మాన్", "ఆసుపత్రి"],
        "content_en": "Ayushman Bharat PM-JAY is the world's largest health assurance scheme, providing a health cover of up to ₹5,00,000 per family per year for secondary and tertiary care hospitalization across over 27,000 empaneled public and private hospitals.",
        "content_te": "ఆయుష్మాన్ భారత్ పీఎం-జేఏవై పథకం కింద అర్హులైన పేద కుటుంబాలకు ఆసుపత్రి చికిత్సల కోసం ఏడాదికి ₹5,00,000 వరకు ఉచిత నగదు రహిత ఆరోగ్య బీమా లభిస్తుంది. 27,000 పైగా నెట్‌వర్క్ ఆసుపత్రులలో ఇది వర్తిస్తుంది.",
        "eligibility_en": "Households identified under SECC 2011 deprivation criteria, active BPL/Food Security ration card holders. No limitation on family size, gender, or age.",
        "eligibility_te": "SECC 2011 డేటా ప్రకారం పేద కుటుంబాలు మరియు చురుకైన తెల్ల రేషన్ కార్డు / ఆహార భద్రతా కార్డు కలిగిన వారు అర్హులు. కుటుంబ పరిమాణంపై పరిమితి లేదు.",
        "documents_en": "Aadhaar Card, Valid Ration Card, Voter ID, or PM-JAY Identification Letter.",
        "documents_te": "ఆధార్ కార్డు, చెల్లుబాటు అయ్యే రేషన్ కార్డు లేదా ఓటరు గుర్తింపు కార్డు.",
        "application_en": "Check eligibility at beneficiary.nha.gov.in or visit the Ayushman Mitra desk at any empaneled hospital with your Ration Card and Aadhaar for instant e-KYC and PVC Golden Card generation.",
        "application_te": "beneficiary.nha.gov.in వెబ్‌సైట్‌లో అర్హతను పరిశీలించండి లేదా సమీప ప్రభుత్వ ఆసుపత్రిలోని ఆయుష్మాన్ మిత్ర డెస్క్‌ను ఆధార్, రేషన్ కార్డులతో సంప్రదించండి."
    },
    {
        "id": "pmay-housing-overview",
        "scheme_slug": "pm-awas-yojana",
        "title": "Pradhan Mantri Awas Yojana (PMAY - Gramin & Urban)",
        "source": "Ministry of Housing & Urban Affairs / Rural Development (pmaymis.gov.in)",
        "source_url": "https://pmaymis.gov.in",
        "keywords": ["pmay", "awas", "housing", "house", "pucca house", "construction", "subsidy", "గృహ", "ఆవాస్", "ఇల్లు"],
        "content_en": "PMAY aims to provide all-weather pucca houses with basic civic amenities to all eligible homeless households and those living in kutcha/dilapidated homes. Offers direct grants up to ₹1.20 - ₹1.30 Lakh for rural construction and interest subsidy (CLSS) up to ₹2.67 Lakh for urban beneficiaries.",
        "content_te": "సొంత పక్కా ఇల్లు లేని పేద కుటుంబాలకు శాశ్వత గృహ నిర్మాణానికి ఆర్థిక సహాయం అందించే పథకం. గ్రామీణ ప్రాంతాల్లో ₹1.20-₹1.30 లక్షల ఉచిత నిధులు, పట్టణ ప్రాంతాల్లో ₹2.67 లక్షల వరకు వడ్డీ రాయితీ లభిస్తుంది.",
        "eligibility_en": "EWS/LIG families who do not own a pucca house anywhere in India. Annual household income up to ₹3 Lakh for EWS.",
        "eligibility_te": "దేశంలో ఎక్కడా సొంత పక్కా ఇల్లు లేని పేద కుటుంబాలు. కుటుంబ వార్షిక ఆదాయం ₹3 లక్షల లోపు ఉండాలి.",
        "documents_en": "Aadhaar cards of all family members, Income Certificate from Tahsildar, Bank Passbook, Land possession proof or non-encumbrance certificate.",
        "documents_te": "కుటుంబ సభ్యులందరి ఆధార్ కార్డులు, తహసీల్దార్ ఇచ్చిన ఆదాయ ధృవీకరణ పత్రం, బ్యాంక్ ఖాతా పుస్తకం.",
        "application_en": "Urban: Apply online via pmaymis.gov.in under 'Citizen Assessment'. Rural: Beneficiaries are identified and validated through the Gram Sabha priority list under Awaas+.",
        "application_te": "పట్టణ వాసులు pmaymis.gov.in లో 'Citizen Assessment' ద్వారా ఆన్‌లైన్‌లో దరఖాస్తు చేసుకోవచ్చు. గ్రామీణ వాసులు గ్రామ సభ ఆవాస్+ జాబితా ద్వారా ఎంపికవుతారు."
    },
    {
        "id": "pm-mudra-overview",
        "scheme_slug": "pm-mudra-yojana",
        "title": "Pradhan Mantri Mudra Yojana (PMMY)",
        "source": "Department of Financial Services / MUDRA Ltd (mudra.org.in)",
        "source_url": "https://www.mudra.org.in",
        "keywords": ["mudra", "loan", "business", "enterprise", "credit", "10 lakh", "collateral free", "shishu", "kishore", "tarun", "రుణం", "ముద్రా", "వ్యాపారం"],
        "content_en": "PMMY provides collateral-free institutional loans up to ₹10 Lakh to non-farm micro and small enterprises. Divided into three tiers: Shishu (loans up to ₹50,000), Kishore (loans ₹50,000 to ₹5,00,000), and Tarun (loans ₹5,00,000 to ₹10,00,000).",
        "content_te": "చిరు వ్యాపారులు మరియు చిన్న పరిశ్రమలకు ఎటువంటి పూచీకత్తు (Collateral) లేకుండా ₹10 లక్షల వరకు బ్యాంక్ రుణాలు అందించే పథకం. శిశు (₹50,000 వరకు), కిశోర్ (₹50,000 నుండి ₹5 లక్షలు), మరియు తరుణ్ (₹5 లక్షల నుండి ₹10 లక్షలు).",
        "eligibility_en": "Indian citizens aged 18+ with a viable business plan for non-farm income generation (trading, manufacturing, services) and no prior bank default.",
        "eligibility_te": "18 ఏళ్లు నిండిన భారతీయ పౌరులు, వ్యవసాయేతర వ్యాపార ప్రతిపాదన ఉన్నవారు, బ్యాంకు రుణ ఎగవేత రికార్డు లేనివారు అర్హులు.",
        "documents_en": "Identity Proof (Aadhaar/Voter ID), Business Proof (Udyam Registration/Shop Act License), Last 6 months bank statement, Business project report.",
        "documents_te": "ఆధార్ కార్డు, వ్యాపార రిజిస్ట్రేషన్ పత్రం (ఉద్యమ్ సర్టిఫికేట్), గత 6 నెలల బ్యాంక్ ఖాతా స్టేట్‌మెంట్, వ్యాపార ప్రాజెక్ట్ నివేదిక.",
        "application_en": "Apply through any commercial bank, regional rural bank, microfinance institution, or online on the udyamimitra.in portal.",
        "application_te": "ఏదైనా జాతీయ బ్యాంక్ లేదా గ్రామీణ బ్యాంక్ శాఖను సంప్రదించండి లేదా udyamimitra.in పోర్టల్ ద్వారా ఆన్‌లైన్‌లో దరఖాస్తు చేసుకోండి."
    },
    {
        "id": "sukanya-samriddhi-overview",
        "scheme_slug": "sukanya-samriddhi",
        "title": "Sukanya Samriddhi Yojana (SSY)",
        "source": "India Post / Ministry of Finance (indiapost.gov.in)",
        "source_url": "https://www.indiapost.gov.in",
        "keywords": ["sukanya", "girl child", "savings", "education", "daughter", "interest", "tax free", "80c", "బాలిక", "సుకున్య", "పొదుపు"],
        "content_en": "SSY is a government-backed small savings scheme designed for the benefit of girl children. Offers one of the highest sovereign interest rates (currently 8.2% per annum) with triple tax exemption (EEE) under Section 80C. Matures after 21 years or upon marriage after age 18.",
        "content_te": "ఆడపిల్లల ఉన్నత చదువులు మరియు భవిష్యత్తు కోసం అత్యధిక వడ్డీ (8.2%) అందించే కేంద్ర ప్రభుత్వ చిన్న పొదుపు పథకం. సెక్షన్ 80C కింద పూర్తి పన్ను మినహాయింపు లభిస్తుంది.",
        "eligibility_en": "Girl children residing in India below 10 years of age at the time of account opening. Maximum two accounts per family (except in case of twins/triplets).",
        "eligibility_te": "10 సంవత్సరాలలోపు వయస్సు ఉన్న ఆడపిల్లల పేరిట తల్లిదండ్రులు లేదా సంరక్షకులు ఖాతా తెరవవచ్చు. కుటుంబానికి గరిష్టంగా ఇద్దరు ఆడపిల్లలకు మాత్రమే అనుమతి.",
        "documents_en": "Girl child birth certificate, Identity and address proof of guardian (Aadhaar), Passport-size photographs.",
        "documents_te": "బాలిక జనన ధ్రువీకరణ పత్రం (Birth Certificate), తల్లిదండ్రుల ఆధార్ కార్డు, పాస్‌పోర్ట్ సైజు ఫోటోలు.",
        "application_en": "Open an SSY account at any Post Office or authorized public/private commercial bank branch with minimum opening deposit of ₹250.",
        "application_te": "సమీప తపాలా కార్యాలయం (Post Office) లేదా ప్రభుత్వ బ్యాంక్ శాఖలో కనీస డిపాజిట్ ₹250 తో ఖాతా తెరవవచ్చు."
    },
    {
        "id": "pm-vidyalakshmi-overview",
        "scheme_slug": "pm-vidyalakshmi",
        "title": "PM-Vidyalaxmi Education Loan Scheme",
        "source": "Ministry of Education & Department of Financial Services (vidyalakshmi.co.in)",
        "source_url": "https://www.vidyalakshmi.co.in",
        "keywords": ["vidyalakshmi", "education", "student", "college", "loan", "university", "higher education", "విద్యార్థి", "విద్యా లక్ష్మి", "చదువు"],
        "content_en": "PM-Vidyalaxmi provides transparent, collateral-free and guarantor-free educational loans up to ₹7.5 Lakh with government interest subvention for meritorious students pursuing higher education in recognized Indian institutions.",
        "content_te": "పేద విద్యార్థులు ఉన్నత చదువులు అభ్యసించడానికి ఎలాంటి పూచీకత్తు లేదా హామీ లేకుండా ₹7.5 లక్షల వరకు తక్కువ వడ్డీతో బ్యాంక్ రుణాలు అందించే ఏకీకృత పోర్టల్ పథకం.",
        "eligibility_en": "Students who have secured admission to approved Higher Education Institutions (HEIs) through qualifying exams or merit criteria.",
        "eligibility_te": "గుర్తింపు పొందిన కాలేజీలు లేదా యూనివర్సిటీలలో ప్రవేశం పొందిన భారతీయ విద్యార్థులు అర్హులు.",
        "documents_en": "Admission letter with fee schedule, Class 10/12/degree marksheets, Student & parent Aadhaar, Family income certificate.",
        "documents_te": "కాలేజ్ అడ్మిషన్ లెటర్ మరియు ఫీజు వివరాలు, విద్యా మార్కుల సర్టిఫికెట్లు, విద్యార్థి మరియు తల్లిదండ్రుల ఆధార్, ఆదాయ ధృవీకరణ పత్రం.",
        "application_en": "Register on the centralized portal vidyalakshmi.co.in, search loan schemes across banks, and submit a single Common Educational Loan Application Form (CELAF).",
        "application_te": "vidyalakshmi.co.in పోర్టల్‌లో రిజిస్టర్ అయి ఒకే సాధారణ దరఖాస్తు ఫారం (CELAF) ద్వారా పలు బ్యాంకులకు దరఖాస్తు చేసుకోవచ్చు."
    }
]

class RAGEngine:
    def __init__(self):
        self.knowledge_base = OFFICIAL_KNOWLEDGE_BASE
        self.gemini_api_key = os.getenv("GEMINI_API_KEY", "")
        self.has_gemini = bool(self.gemini_api_key and not self.gemini_api_key.startswith("your_"))
        
        if self.has_gemini:
            try:
                import google.generativeai as genai
                genai.configure(api_key=self.gemini_api_key)
                self.gemini_model = genai.GenerativeModel("gemini-1.5-flash")
            except Exception as e:
                print(f"Gemini init note: {e}")
                self.has_gemini = False

    def retrieve_chunks(self, query: str, top_k: int = 3) -> List[Dict[str, Any]]:
        """Retrieve most relevant knowledge chunks using token overlap and keyword matching."""
        q_lower = query.lower()
        scored_chunks = []

        for chunk in self.knowledge_base:
            score = 0
            # Keyword matches
            for kw in chunk["keywords"]:
                if kw in q_lower:
                    score += 3

            # Token overlap in title and summary
            tokens = re.findall(r'\w+', q_lower)
            for t in tokens:
                if len(t) > 2:
                    if t in chunk["title"].lower():
                        score += 2
                    if t in chunk["content_en"].lower():
                        score += 1
                    if t in chunk["content_te"]:
                        score += 2

            scored_chunks.append((score, chunk))

        # Sort descending by score
        scored_chunks.sort(key=lambda x: x[0], reverse=True)
        # Return top_k with at least score > 0, or top 2 default
        top = [c for s, c in scored_chunks if s > 0][:top_k]
        if not top:
            top = [c for _, c in scored_chunks[:2]]
        return top

    def generate_response(
        self,
        query: str,
        language: str = "en",
        conversation_context: Optional[List[Dict[str, str]]] = None
    ) -> Dict[str, Any]:
        """
        Generate grounded response using RAG.
        If Gemini API key is configured, invokes Gemini 1.5 Flash with strict grounding prompt.
        Otherwise, uses the grounded rule synthesizer with zero hallucination.
        """
        retrieved = self.retrieve_chunks(query, top_k=2)
        sources = [
            {"source_name": c["source"], "url": c["source_url"], "scheme": c["title"]}
            for c in retrieved
        ]

        # Check if user asked in Telugu
        is_telugu = language == "te" or any("\u0c00" <= char <= "\u0c7f" for char in query)
        target_lang = "te" if is_telugu else "en"

        if self.has_gemini:
            try:
                # Build context
                context_texts = []
                for idx, c in enumerate(retrieved, 1):
                    ctx = f"Scheme {idx}: {c['title']}\nSource: {c['source']} ({c['source_url']})\n"
                    ctx += f"Summary: {c['content_en']}\nEligibility: {c['eligibility_en']}\nRequired Documents: {c['documents_en']}\nApplication: {c['application_en']}\n"
                    if target_lang == "te":
                        ctx += f"Telugu Summary: {c['content_te']}\nTelugu Eligibility: {c['eligibility_te']}\nTelugu Documents: {c['documents_te']}\nTelugu Application: {c['application_te']}\n"
                    context_texts.append(ctx)

                full_context = "\n---\n".join(context_texts)

                prompt = f"""You are JanSathi AI, an official Indian digital civic assistant.
Your duty is to assist Indian citizens with verified government welfare schemes.

RULES:
1. ONLY use the verified context provided below. NEVER invent or hallucinate benefits, eligibility criteria, or portal links.
2. If unsure or if information is not in the context, explicitly say you do not have sufficient official records.
3. Language: Answer in { 'Telugu (తెలుగు)' if target_lang == 'te' else 'English' }.
4. Format: Use clean bullet points, bold key figures (amounts like ₹6,000, age limits), and cite the official government portal at the end.
5. Clarify that this is informational assistance and official submission occurs on authorized government portals.

VERIFIED SCHEME CONTEXT:
{full_context}

CITIZEN QUESTION:
{query}
"""
                response = self.gemini_model.generate_content(prompt)
                ai_text = response.text.strip()
                return {
                    "response": ai_text,
                    "language": target_lang,
                    "sources": sources,
                    "model_used": "Gemini 1.5 Flash (Grounded RAG)"
                }
            except Exception as e:
                print(f"Gemini generation fallback due to: {e}")

        # Intelligent Grounded Synthesizer Fallback
        c = retrieved[0]
        if target_lang == "te":
            text = f"**{c['title']} గురించి ధృవీకరించబడిన సమాచారం:**\n\n"
            text += f"• **పథకం సారాంశం:** {c['content_te']}\n\n"
            text += f"• **అర్హత నిబంధనలు:** {c['eligibility_te']}\n\n"
            text += f"• **కావలసిన పత్రాలు:** {c['documents_te']}\n\n"
            text += f"• **దరఖాస్తు విధానం:** {c['application_te']}\n\n"
            text += f"🔗 **అధికారిక పోర్టల్:** [{c['source_url']}]({c['source_url']})\n\n"
            text += "*గమనిక: ఇది సమాచార సహాయం మాత్రమే. మీ దరఖాస్తును అధికారిక ప్రభుత్వ పోర్టల్‌లో సమర్పించవలసి ఉంటుంది.*"
        else:
            text = f"**Verified Specifications for {c['title']}:**\n\n"
            text += f"• **Overview & Benefits:** {c['content_en']}\n\n"
            text += f"• **Eligibility Criteria:** {c['eligibility_en']}\n\n"
            text += f"• **Required Documents:** {c['documents_en']}\n\n"
            text += f"• **Application Procedure:** {c['application_en']}\n\n"
            text += f"🔗 **Official Government Source:** [{c['source']}]({c['source_url']})\n\n"
            text += "*Note: JanSathi AI provides informational guidance. Official applications must be submitted on authorized government portals.*"

        return {
            "response": text,
            "language": target_lang,
            "sources": sources,
            "model_used": "JanSathi Grounded Gazette RAG Engine"
        }

rag_engine = RAGEngine()
