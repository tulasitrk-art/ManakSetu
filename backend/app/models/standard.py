from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class NormativeReference(BaseModel):
    is_code: str
    title: str
    type: Optional[str] = "NORMATIVE_REFERENCE"

class TestMethod(BaseModel):
    is_code: str
    title: str

class QCODetails(BaseModel):
    order_name: str
    gazette_notification: str
    enforcement_date: str
    certification_scheme: str
    ministry: str
    penal_action: str

class StandardBase(BaseModel):
    is_code: str = Field(..., description="Indian Standard unique code, e.g. IS 10322 (Part 5/Sec 3) : 2012")
    standard_number: str
    part_section: Optional[str] = None
    title: str
    year_published: Optional[int] = None
    reaffirm_year: Optional[int] = None
    status: str = Field(..., description="ACTIVE, SUPERSEDED, WITHDRAWN, REVISED")
    amendments_count: int = 0
    latest_amendment_date: Optional[str] = None
    department_division: str
    section_committee: Optional[str] = None
    ics_code: Optional[str] = None
    scope_description: str
    technical_keywords: List[str] = []
    normative_references: List[NormativeReference] = []
    test_methods: List[TestMethod] = []
    supersedes: Optional[str] = None
    superseded_by: Optional[str] = None
    qco_status: str = Field(..., description="MANDATORY_QCO, CRS_COMPULSORY, HALLMARKING, VOLUNTARY, SUPERSEDED")
    qco_details: Optional[QCODetails] = None
    mandatory_cert_scheme: Optional[str] = None
    testing_parameters: List[str] = []
    recommended_tender_clause: Optional[str] = None

class StandardResponse(StandardBase):
    pass
