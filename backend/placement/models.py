from django.db import models
from django.contrib.auth.models import User


# ==========================================
# STUDENT
# ==========================================

class Student(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="student_profile"
    )

    name = models.CharField(
        max_length=100
    )

    email = models.EmailField(
        blank=True,
        null=True
    )

    dob = models.DateField(
        null=True,
        blank=True
    )

    gender = models.CharField(
        max_length=20,
        blank=True
    )

    city = models.CharField(
        max_length=100,
        blank=True
    )

    state = models.CharField(
        max_length=100,
        blank=True
    )

    college = models.CharField(
        max_length=200,
        blank=True
    )

    degree = models.CharField(
        max_length=100,
        blank=True
    )

    branch = models.CharField(
        max_length=100,
        blank=True
    )

    current_year = models.CharField(
        max_length=50,
        blank=True
    )

    cgpa = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        null=True,
        blank=True
    )

    graduation_year = models.IntegerField(
        null=True,
        blank=True
    )

    skills = models.TextField(
        blank=True
    )

    skill_level = models.CharField(
        max_length=30,
        blank=True
    )

    # Resume upload
    resume = models.FileField(
        upload_to="resumes/",
        null=True,
        blank=True
    )

    def __str__(self):
        return self.name

class JobOpening(models.Model):

    company = models.CharField(
        max_length=150
    )

    role = models.CharField(
        max_length=150
    )

    vacancy_count = models.PositiveIntegerField(
        default=1
    )

    required_skills = models.TextField(
        blank=True,
        default=""
    )

    location = models.CharField(
        max_length=150,
        blank=True
    )

    deadline = models.DateField(
        null=True,
        blank=True
    )

    is_active = models.BooleanField(
        default=True
    )

    def __str__(self):
        return f"{self.company} - {self.role}"

# ==========================================
# APPLICATION
# ==========================================

class Application(models.Model):

    STATUS_CHOICES = [
        ("Applied", "Applied"),
        ("Interview", "Interview"),
        ("Offer", "Offer"),
        ("Rejected", "Rejected"),
    ]

    STAGE_CHOICES = [
        ("Applied", "Applied"),
        ("Shortlisted", "Shortlisted"),
        ("Assessment", "Assessment"),
        ("Technical", "Technical"),
        ("HR", "HR"),
        ("Offer", "Offer"),
    ]

    REJECTION_REASON_CHOICES = [
        ("Aptitude", "Aptitude"),
        ("Coding", "Coding"),
        ("Technical Interview", "Technical Interview"),
        ("HR", "HR"),
        ("Resume", "Resume"),
        ("Eligibility", "Eligibility"),
        ("Other", "Other"),
    ]

    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name="applications"
    )

    company = models.CharField(
        max_length=150
    )

    role = models.CharField(
        max_length=150
    )

    required_skills = models.TextField(
        blank=True,
        default=""
    )

    applied_date = models.DateField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Applied"
    )

    stage = models.CharField(
        max_length=20,
        choices=STAGE_CHOICES,
        default="Applied"
    )

    rejection_reason = models.CharField(
        max_length=50,
        choices=REJECTION_REASON_CHOICES,
        blank=True,
        default=""
    )

    def __str__(self):
        return f"{self.company} - {self.role}"