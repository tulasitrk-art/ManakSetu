"""
Multilingual & Indic Language Translation Service
Handles translation and semantic normalization of procurement requests in Indian languages
(Telugu, Hindi, Marathi, Tamil, Gujarati, Bengali, Kannada, Malayalam, etc.) into standardized technical English terms.
"""
import re
from typing import Tuple, Dict

class TranslationService:
    def __init__(self):
        # High-coverage multilingual engineering glossary for Indian procurement domains
        self.domain_glossary: Dict[str, str] = {
            # Hindi
            "सड़क की बत्ती": "street lighting luminaire",
            "स्ट्रीट लाइट": "led street light luminaire",
            "एलईडी स्ट्रीट लाइट": "led street light luminaire",
            "राजमार्ग प्रकाश व्यवस्था": "highway illumination luminaire",
            "कंक्रीट": "concrete plain and reinforced",
            "सीमेंट कंक्रीट": "reinforced cement concrete",
            "आरसीसी": "reinforced cement concrete",
            "सरिया": "tmt steel rebar concrete reinforcement",
            "स्टील सरिया": "high strength deformed steel tmt bar",
            "टीएमटी सरिया": "high strength deformed steel tmt bar",
            "पानी का पाइप": "water supply pipe hdpe gi",
            "पीने का पानी": "drinking water potable",
            "एचडीपीई पाइप": "hdpe water supply pipe",
            "बिजली का ट्रांसफार्मर": "outdoor oil immersed distribution transformer",
            "ट्रांसफार्मर": "distribution transformer",
            "सौर पैनल": "crystalline silicon solar photovoltaic pv module",
            "सोलर पैनल": "solar pv module",
            "सौर सेल": "solar pv module",
            "सीसीटीवी कैमरा": "cctv surveillance ip camera it equipment",
            "अग्निशामक यंत्र": "portable fire extinguisher abc powder co2",
            "सुरक्षा हेलमेट": "industrial safety helmet hard hat",
            "सुरक्षा जूते": "industrial safety footwear steel toe",
            "मास्क": "respiratory particulate mask n95 ffp2",
            "बिजली की वायरिंग": "building electrical wiring installation",
            "अर्थिंग": "electrical earthing grounding system",
            
            # Tamil
            "தெரு விளக்கு": "street lighting luminaire",
            "சாலை விளக்கு": "street lighting luminaire",
            "எல்இடி தெரு விளக்கு": "led street light luminaire",
            "நெடுஞ்சாலை விளக்கு": "highway illumination luminaire",
            "கான்கிரீட்": "reinforced cement concrete",
            "சிமெண்ட் கான்கிரீட்": "reinforced cement concrete",
            "கம்பி": "tmt steel rebar reinforcement",
            "டிஎம்டி கம்பி": "high strength deformed steel tmt bar",
            "எஃகு கம்பி": "tmt steel rebar",
            "குடிநீர் குழாய்": "drinking water supply hdpe pipe",
            "தண்ணீர் குழாய்": "drinking water supply pipe",
            "மின்மாற்றி": "distribution transformer",
            "சூரிய மின்தகடு": "solar pv module panel",
            "சோலார் பேனல்": "solar photovoltaic pv module",
            "தீயணைப்பான்": "portable fire extinguisher",
            "பாதுகாப்பு காலணி": "safety footwear boot",
            "பாதுகாப்பு தலைக்கவசம்": "industrial safety helmet",

            # Telugu
            "వీధి దీపం": "street light luminaire",
            "వీధి లైట్లు": "led street light luminaire",
            "రోడ్డు లైట్లు": "street lighting luminaire",
            "కాంక్రీట్": "reinforced concrete",
            "సిమెంట్ కాంక్రీట్": "reinforced cement concrete",
            "ఉక్కు కడ్డీలు": "tmt steel rebar",
            "స్టీల్ కడ్డీలు": "tmt steel rebar concrete reinforcement",
            "టిఎంటి బార్లు": "high strength deformed steel tmt bar",
            "తాగునీటి పైపు": "drinking water supply pipe",
            "నీటి సరఫరా పైపు": "potable water pipe hdpe",
            "హెచ్‌డిపిఇ పైపు": "hdpe water supply pipe",
            "ట్రాన్స్‌ఫార్మర్": "distribution transformer",
            "విద్యుత్ ట్రాన్స్‌ఫార్మర్": "outdoor distribution transformer",
            "సౌర ఫలకం": "solar pv panel module",
            "సౌర ప్యానెల్": "solar photovoltaic pv module",
            "సోలార్ ప్యానెల్": "solar photovoltaic pv module",
            "అగ్నిమాపక యంత్రం": "fire extinguisher",
            "భద్రతా హెల్మెట్": "industrial safety helmet",
            "భద్రతా బూట్లు": "industrial safety footwear",

            # Marathi
            "रस्त्यावरील दिवे": "street light luminaire",
            "स्ट्रीट लाइट": "led street light luminaire",
            "एलईडी स्ट्रीट लाइट": "led street light luminaire",
            "काँक्रीट": "reinforced concrete",
            "सिमेंट काँक्रीट": "reinforced cement concrete",
            "लोखंडी सळई": "tmt steel reinforcement bar",
            "स्टील सळई": "tmt steel reinforcement bar",
            "टीएमटी बार": "high strength deformed steel tmt bar",
            "पिण्याच्या पाण्याचे पाईप": "potable water pipe hdpe",
            "विद्युत ट्रान्सफॉर्मर": "distribution transformer",
            "सौर पॅनेल": "solar photovoltaic pv module",
            "अग्निशामक": "fire extinguisher",
            "अग्निशामक यंत्र": "portable fire extinguisher",
            "सुरक्षा हेल्मेट": "industrial safety helmet",
            "सुरक्षा बूट": "industrial safety footwear",

            # Bengali
            "রাস্তার আলো": "street light luminaire",
            "স্ট্রিট লাইট": "led street light luminaire",
            "এলইডি স্ট্রিট লাইট": "led street light luminaire",
            "কংক্রিট": "reinforced concrete",
            "রড": "tmt steel rebar",
            "টিএমটি বার": "high strength deformed steel tmt bar",
            "ইস্পাতের রড": "steel reinforcement bar",
            "পানীয় জলের পাইপ": "drinking water pipe",
            "ট্রান্সফরমার": "distribution transformer",
            "বৈদ্যুতিক ট্রান্সফরমার": "outdoor distribution transformer",
            "সৌর প্যানেল": "solar pv module",
            "অগ্নিনির্বাপক যন্ত্র": "portable fire extinguisher",
            "নিরাপত্তা হেলমেট": "industrial safety helmet",
            "নিরাপত্তা জুতো": "industrial safety footwear",

            # Gujarati
            "શેરીની લાઇટ": "street light luminaire",
            "સ્ટ્રીટ લાઇટ": "led street light luminaire",
            "એલઇડી સ્ટ્રીટ લાઇટ": "led street light luminaire",
            "કોંક્રિટ": "reinforced concrete",
            "સિમેન્ટ કોંક્રિટ": "reinforced cement concrete",
            "સળિયા": "tmt steel rebar",
            "ટીએમટી સળિયા": "high strength deformed steel tmt bar",
            "પીવાના પાણીની પાઇપ": "drinking water pipe",
            "ટ્રાન્સફોર્મર": "distribution transformer",
            "સોલાર પેનલ": "solar photovoltaic pv module",
            "અગ્નિશામક": "fire extinguisher",
            "અગ્નિશામક યંત્ર": "portable fire extinguisher",
            "સુરક્ષા હેલ્મેટ": "industrial safety helmet",
            "સુરક્ષા બૂટ": "industrial safety footwear",

            # Kannada
            "ಬೀದಿ ದೀಪ": "street lighting luminaire",
            "ಬೀದಿ ದೀಪಗಳು": "led street lighting luminaire",
            "ಎಲ್ಇಡಿ ಬೀದಿ ದೀಪ": "led street light luminaire",
            "ಕಾಂಕ್ರೀಟ್": "concrete plain and reinforced",
            "ಸಿಮೆಂಟ್ ಕಾಂಕ್ರೀಟ್": "reinforced cement concrete",
            "ಉಕ್ಕಿನ ಕಡ್ಡಿಗಳು": "tmt steel rebar concrete reinforcement",
            "ಟಿಎಂಟಿ ಸರಳುಗಳು": "high strength deformed steel tmt bar",
            "ಕುಡಿಯುವ ನೀರಿನ ಪೈಪ್": "potable water supply pipe hdpe gi",
            "ನೀರಿನ ಪೈಪುಗಳು": "water supply pipe hdpe",
            "ಎಚ್‌ಡಿಪಿಇ ಪೈಪ್": "hdpe water supply pipe",
            "ಟ್ರಾನ್ಸ್‌ಫಾರ್ಮರ್": "distribution transformer",
            "ವಿದ್ಯುತ್ ಟ್ರಾನ್ಸ್‌ಫಾರ್ಮರ್": "outdoor distribution transformer",
            "ಸೌರ ಫಲಕ": "solar pv module panel",
            "ಸೌರ ಪ್ಯಾನಲ್": "solar photovoltaic pv module",
            "ಅಗ್ನಿಶಾಮಕ": "portable fire extinguisher",
            "ಸುರಕ್ಷತಾ ಹೆಲ್ಮೆಟ್": "industrial safety helmet",
            "ಸುರಕ್ಷತಾ ಶೂಗಳು": "industrial safety footwear",

            # Malayalam
            "തെരുവ് വിളക്ക്": "street lighting luminaire",
            "തെരുവ് വിളക്കുകൾ": "led street lighting luminaire",
            "എൽഇഡി സ്ട്രീറ്റ് ലൈറ്റ്": "led street light luminaire",
            "കോൺക്രീറ്റ്": "concrete plain and reinforced",
            "സിമന്റ് കോൺക്രീറ്റ്": "reinforced cement concrete",
            "സ്റ്റീൽ ബാർ": "tmt steel rebar concrete reinforcement",
            "കമ്പി": "tmt steel rebar",
            "ടിഎംടി കമ്പി": "high strength deformed steel tmt bar",
            "കുടിവെള്ള പൈപ്പ്": "drinking water supply pipe hdpe",
            "വെള്ള പൈപ്പ്": "potable water supply pipe",
            "ട്രാൻസ്ഫോർമർ": "distribution transformer",
            "വൈദ്യുതി ട്രാൻസ്ഫോർമർ": "outdoor distribution transformer",
            "സൗരോർജ്ജ പാനൽ": "solar pv module panel",
            "സോളാർ പാനൽ": "solar photovoltaic pv module",
            "തീ അണയ്ക്കുന്ന യന്ത്രം": "portable fire extinguisher",
            "അഗ്നിശമന ഉപകരണം": "portable fire extinguisher",
            "സുരക്ഷാ ഹെൽമെറ്റ്": "industrial safety helmet",
            "സുരക്ഷാ ഷൂസ്": "industrial safety footwear"
        }

        # Language script detectors (Unicode blocks)
        self.script_ranges = [
            (0x0900, 0x097F, "hi", "Hindi / Devanagari"),
            (0x0B80, 0x0BFF, "ta", "Tamil"),
            (0x0C00, 0x0C7F, "te", "Telugu"),
            (0x0980, 0x09FF, "bn", "Bengali"),
            (0x0A80, 0x0AFF, "gu", "Gujarati"),
            (0x0C80, 0x0CFF, "kn", "Kannada"),
            (0x0D00, 0x0D7F, "ml", "Malayalam"),
            (0x0A00, 0x0A7F, "pa", "Punjabi"),
            (0x0B00, 0x0B7F, "or", "Odia")
        ]

    def detect_language(self, text: str) -> Tuple[str, str]:
        """Detect language script from Unicode code points."""
        for char in text:
            cp = ord(char)
            for start, end, code, name in self.script_ranges:
                if start <= cp <= end:
                    return code, name
        return "en", "English"

    def translate_to_technical_english(self, query: str) -> Tuple[str, str, str]:
        """
        Translates or enriches query into standardized technical English procurement terms.
        Returns (translated_query, detected_lang_code, detected_lang_name).
        """
        detected_code, detected_name = self.detect_language(query)
        
        if detected_code == "en":
            return query, "en", "English"

        translated = query
        # Perform glossary replacement
        matched_any = False
        for indic_term, en_term in self.domain_glossary.items():
            if indic_term in translated:
                translated = translated.replace(indic_term, f" {en_term} ")
                matched_any = True

        if matched_any:
            cleaned = " ".join(translated.split())
            return cleaned, detected_code, detected_name
        
        # Fallback if no exact dictionary phrase matched:
        # Return cleaned query along with language metadata
        return query, detected_code, detected_name

translation_service = TranslationService()
