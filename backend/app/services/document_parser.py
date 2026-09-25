"""
Document & Tender Parsing Service
Extracts text, engineering parameters, referenced standards, and clauses from draft tender documents, PDFs, and text specifications.
"""
import re
from typing import Dict, Any, List

class DocumentParserService:
    @staticmethod
    def extract_text_from_bytes(file_bytes: bytes, filename: str) -> str:
        """
        Extract plain text from uploaded file bytes (TXT, PDF, or Markdown).
        """
        filename_lower = filename.lower()
        if filename_lower.endswith(".pdf"):
            # Simple text extraction or fallback
            try:
                import pypdf
                import io
                reader = pypdf.PdfReader(io.BytesIO(file_bytes))
                text = ""
                for page in reader.pages:
                    extracted = page.extract_text()
                    if extracted:
                        text += extracted + "\n"
                if text.strip():
                    return text
            except Exception:
                pass
            # Fallback byte decoding with string extraction
            decoded = file_bytes.decode("utf-8", errors="ignore")
            cleaned = re.sub(r"[^\x20-\x7E\n\r\t]", " ", decoded)
            return cleaned
        else:
            return file_bytes.decode("utf-8", errors="ignore")

    @staticmethod
    def parse_tender_structure(text: str) -> Dict[str, Any]:
        """
        Analyze extracted tender text to detect:
        1. Referenced IS codes mentioned in text
        2. Key engineering parameters (voltage, strength, efficacy, IP rating, etc.)
        3. Product categories
        4. Sections / clauses
        """
        # Find explicit IS codes like IS 456, IS 10322, IS:1786, IS 10500:2012, etc.
        is_code_pattern = r"\bIS\s*[:/-]?\s*(\d{3,6}(?:\s*\([^)]+\))?(?:\s*[:/]\s*\d{4})?)\b"
        found_codes = re.findall(is_code_pattern, text, re.IGNORECASE)
        cleaned_codes = []
        for code in found_codes:
            cleaned = f"IS {code.strip()}"
            if cleaned not in cleaned_codes:
                cleaned_codes.append(cleaned)

        # Technical parameter extraction
        parameters = []
        param_patterns = [
            (r"\b(\d+\s*(?:lm/W|lumens?|Watts?|W|kV|kA|Hz|Volts?|V))\b", "Electrical / Lighting"),
            (r"\b(IP\s*\d{2})\b", "Ingress Protection"),
            (r"\b(IK\s*\d{2})\b", "Impact Resistance"),
            (r"\b(Fe\s*415|Fe\s*500D?|Fe\s*550D?|Fe\s*600|M\s*25|M\s*30|M\s*35|M\s*40)\b", "Structural Grade"),
            (r"\b(PE\s*63|PE\s*80|PE\s*100|PN\s*6|PN\s*10|PN\s*16)\b", "Piping Grade"),
            (r"\b(FFP1|FFP2|FFP3|N95|N99)\b", "Respiratory PPE"),
            (r"\b(\d+\s*kVA|\d+\s*MVA)\b", "Transformer Rating")
        ]

        for pattern, label in param_patterns:
            matches = re.findall(pattern, text, re.IGNORECASE)
            for m in matches:
                item = f"{label}: {m}"
                if item not in parameters:
                    parameters.append(item)

        # Extract title or tender reference
        tender_ref = "Unknown Reference"
        ref_match = re.search(r"(?:Tender\s*(?:Ref|Reference|Notice|NIT|ID)?(?:\s*(?:No\.?|Number))?\s*[:\-]\s*)([A-Za-z0-9/_-]+)", text, re.IGNORECASE)
        if ref_match:
            tender_ref = ref_match.group(1).strip()

        # Split into key paragraphs / clauses
        paragraphs = [p.strip() for p in text.split("\n\n") if len(p.strip()) > 30]

        return {
            "tender_reference": tender_ref,
            "char_count": len(text),
            "word_count": len(text.split()),
            "detected_is_codes": cleaned_codes,
            "extracted_parameters": parameters[:12],
            "key_clauses_count": len(paragraphs),
            "sample_snippet": text[:400] + ("..." if len(text) > 400 else "")
        }

document_parser = DocumentParserService()
