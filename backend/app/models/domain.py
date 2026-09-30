from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, EmailStr, Field

class PyObjectId(str):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v, *args, **kwargs):
        return str(v)

class User(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    email: Optional[EmailStr] = None
    student_id: Optional[str] = None
    role: str = "STUDENT" # STUDENT or SUPERADMIN
    password_hash: str
    temp_password_active: bool = False
    locked_until: Optional[datetime] = None
    failed_login_attempts: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Question(BaseModel):
    question_text: str
    options: List[str]
    correct_option_index: int

class Test(BaseModel):
    title: str
    pass_mark_percentage: float = 60.0
    max_attempts: int = 3
    questions: List[Question]

class Module(BaseModel):
    id: str
    order: int
    title: str
    content: str
    days_required: int = 30
    test: Test

class Internship(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    title: str
    duration_months: int # 1, 3, or 6
    modules: List[Module]

class Enrollment(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    student_id: str
    internship_id: str
    current_module_id: str
    start_date: datetime = Field(default_factory=datetime.utcnow)
    completed: bool = False

class Attempt(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    student_id: str
    test_id: str
    score_percentage: float
    passed: bool
    attempt_number: int
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class Certificate(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    student_id: str
    internship_id: str
    issue_date: datetime = Field(default_factory=datetime.utcnow)
    verify_hash: str
