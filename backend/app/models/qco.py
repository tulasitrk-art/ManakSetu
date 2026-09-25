from typing import List, Optional
from pydantic import BaseModel

class ApplicableStandardItem(BaseModel):
    is_code: str
    product_name: str

class QCOItem(BaseModel):
    qco_id: str
    order_title: str
    issuing_ministry: str
    gazette_number: str
    notification_date: str
    effective_date: str
    certification_scheme: str
    applicable_standards: List[ApplicableStandardItem]
    exemption_criteria: Optional[str] = None
    penalty_clause: Optional[str] = None
