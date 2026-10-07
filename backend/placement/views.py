import json
import csv
import io

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout

from .models import Student, Application, JobOpening


# ==========================================
# GET CURRENT STUDENT
# ==========================================

def get_current_student(request):

    if not request.user.is_authenticated:
        return None

    try:
        return Student.objects.get(
            user=request.user
        )

    except Student.DoesNotExist:
        return None


# ==========================================
# REGISTER
# ==========================================

@csrf_exempt
def register_user(request):

    if request.method != "POST":

        return JsonResponse(
            {
                "error": "Only POST method is allowed."
            },
            status=405
        )

    try:

        data = json.loads(request.body)

        name = data.get(
            "name",
            ""
        ).strip()

        email = data.get(
            "email",
            ""
        ).strip().lower()

        password = data.get(
            "password",
            ""
        )

        confirm_password = data.get(
            "confirm_password",
            ""
        )


        if not name or not email or not password:

            return JsonResponse(
                {
                    "error": "All fields are required."
                },
                status=400
            )


        if password != confirm_password:

            return JsonResponse(
                {
                    "error": "Passwords do not match."
                },
                status=400
            )


        if len(password) < 6:

            return JsonResponse(
                {
                    "error":
                    "Password must contain at least 6 characters."
                },
                status=400
            )


        if User.objects.filter(
            username=email
        ).exists():

            return JsonResponse(
                {
                    "error":
                    "An account with this email already exists."
                },
                status=400
            )


        user = User.objects.create_user(
            username=email,
            email=email,
            password=password
        )


        Student.objects.create(
            user=user,
            name=name,
            email=email
        )


        return JsonResponse(
            {
                "message":
                "Registration successful."
            },
            status=201
        )


    except json.JSONDecodeError:

        return JsonResponse(
            {
                "error": "Invalid JSON data."
            },
            status=400
        )


    except Exception as e:

        return JsonResponse(
            {
                "error": str(e)
            },
            status=500
        )


# ==========================================
# LOGIN
# ==========================================

@csrf_exempt
def login_user(request):

    if request.method != "POST":

        return JsonResponse(
            {
                "error":
                "Only POST method is allowed."
            },
            status=405
        )


    try:

        data = json.loads(request.body)

        email = data.get(
            "email",
            ""
        ).strip().lower()

        password = data.get(
            "password",
            ""
        )


        if not email or not password:

            return JsonResponse(
                {
                    "error":
                    "Email and password are required."
                },
                status=400
            )


        user = authenticate(
            username=email,
            password=password
        )


        if user is None:

            return JsonResponse(
                {
                    "error":
                    "Invalid email or password."
                },
                status=401
            )


        login(
            request,
            user
        )


        return JsonResponse(
            {
                "message":
                "Login successful.",

                "user": {
                    "id": user.id,
                    "email": user.email
                }
            }
        )


    except json.JSONDecodeError:

        return JsonResponse(
            {
                "error":
                "Invalid JSON data."
            },
            status=400
        )


    except Exception as e:

        return JsonResponse(
            {
                "error": str(e)
            },
            status=500
        )


# ==========================================
# LOGOUT
# ==========================================

@csrf_exempt
def logout_user(request):

    if request.method != "POST":

        return JsonResponse(
            {
                "error":
                "Only POST method is allowed."
            },
            status=405
        )


    logout(request)


    return JsonResponse(
        {
            "message":
            "Logout successful."
        }
    )


# ==========================================
# STUDENT PROFILE
# ==========================================

@csrf_exempt
def student_profile(request):

    student = get_current_student(request)


    if student is None:

        return JsonResponse(
            {
                "error":
                "Authentication required."
            },
            status=401
        )


    # --------------------------------------
    # GET PROFILE
    # --------------------------------------

    if request.method == "GET":

        resume_url = None
        resume_name = None

        if student.resume:

            resume_url = student.resume.url

            resume_name = (
                student.resume.name
                .split("/")[-1]
            )


        return JsonResponse(
            {

                "id":
                student.id,

                "name":
                student.name,

                "email":
                student.email,

                "dob":
                student.dob,

                "gender":
                student.gender,

                "city":
                student.city,

                "state":
                student.state,

                "college":
                student.college,

                "degree":
                student.degree,

                "branch":
                student.branch,

                "current_year":
                student.current_year,

                "cgpa":
                student.cgpa,

                "graduation_year":
                student.graduation_year,

                "skills":
                student.skills,

                "skill_level":
                student.skill_level,

                "resume":
                resume_url,

                "resume_name":
                resume_name
            }
        )


    # --------------------------------------
    # UPDATE PROFILE
    # --------------------------------------

    if request.method == "POST":

        try:

            data = json.loads(
                request.body
            )


            if "name" in data:

                student.name = data.get(
                    "name",
                    ""
                ).strip()


            if "email" in data:

                student.email = data.get(
                    "email",
                    ""
                ).strip()


            if "dob" in data:

                dob = data.get("dob")

                student.dob = (
                    dob if dob else None
                )


            if "gender" in data:

                student.gender = data.get(
                    "gender",
                    ""
                )


            if "city" in data:

                student.city = data.get(
                    "city",
                    ""
                )


            if "state" in data:

                student.state = data.get(
                    "state",
                    ""
                )


            if "college" in data:

                student.college = data.get(
                    "college",
                    ""
                )


            if "degree" in data:

                student.degree = data.get(
                    "degree",
                    ""
                )


            if "branch" in data:

                student.branch = data.get(
                    "branch",
                    ""
                )


            if "current_year" in data:

                student.current_year = data.get(
                    "current_year",
                    ""
                )


            if "cgpa" in data:

                cgpa = data.get("cgpa")

                student.cgpa = (
                    cgpa if cgpa else None
                )


            if "graduation_year" in data:

                graduation_year = data.get(
                    "graduation_year"
                )

                student.graduation_year = (
                    graduation_year
                    if graduation_year
                    else None
                )


            if "skills" in data:

                student.skills = data.get(
                    "skills",
                    ""
                )


            if "skill_level" in data:

                student.skill_level = data.get(
                    "skill_level",
                    ""
                )


            student.save()


            return JsonResponse(
                {
                    "message":
                    "Profile updated successfully."
                }
            )


        except json.JSONDecodeError:

            return JsonResponse(
                {
                    "error":
                    "Invalid JSON data."
                },
                status=400
            )


        except Exception as e:

            return JsonResponse(
                {
                    "error": str(e)
                },
                status=400
            )


    return JsonResponse(
        {
            "error":
            "Method not allowed."
        },
        status=405
    )


# ==========================================
# RESUME UPLOAD
# ==========================================

@csrf_exempt
def upload_resume(request):

    student = get_current_student(request)


    if student is None:

        return JsonResponse(
            {
                "error":
                "Authentication required."
            },
            status=401
        )


    # --------------------------------------
    # GET RESUME
    # --------------------------------------

    if request.method == "GET":

        if student.resume:

            return JsonResponse(
                {
                    "resume":
                    student.resume.url,

                    "resume_name":
                    student.resume.name.split("/")[-1]
                }
            )


        return JsonResponse(
            {
                "resume": None,
                "resume_name": None
            }
        )


    # --------------------------------------
    # UPLOAD RESUME
    # --------------------------------------

    if request.method == "POST":

        if "resume" not in request.FILES:

            return JsonResponse(
                {
                    "error":
                    "Please select a resume."
                },
                status=400
            )


        resume = request.FILES["resume"]


        # Maximum 5 MB

        if resume.size > 5 * 1024 * 1024:

            return JsonResponse(
                {
                    "error":
                    "Resume must be smaller than 5 MB."
                },
                status=400
            )


        # Allowed extensions

        allowed_extensions = [
            ".pdf",
            ".doc",
            ".docx"
        ]


        file_name = resume.name.lower()


        if not any(
            file_name.endswith(extension)
            for extension in allowed_extensions
        ):

            return JsonResponse(
                {
                    "error":
                    "Only PDF, DOC and DOCX files are allowed."
                },
                status=400
            )


        # Save resume

        student.resume = resume

        student.save()


        return JsonResponse(
            {
                "message":
                "Resume uploaded successfully.",

                "resume":
                student.resume.url,

                "resume_name":
                student.resume.name.split("/")[-1]
            }
        )


    return JsonResponse(
        {
            "error":
            "Method not allowed."
        },
        status=405
    )



# ==========================================
# APPLICATION LIST
# ==========================================

@csrf_exempt
def application_list(request):

    student = get_current_student(request)


    # --------------------------------------
    # CHECK LOGIN
    # --------------------------------------

    if student is None:

        return JsonResponse(
            {
                "error":
                "Authentication required."
            },
            status=401
        )


    # ======================================
    # GET APPLICATIONS
    # ======================================

    if request.method == "GET":

        applications = (
            Application.objects
            .filter(student=student)
            .order_by("-applied_date")
        )


        application_data = []


        for application in applications:

            application_data.append(
                {

                    "id":
                    application.id,

                    "company":
                    application.company,

                    "role":
                    application.role,

                    "required_skills":
                    application.required_skills,

                    "applied_date":
                    application.applied_date,

                    "status":
                    application.status,

                    "stage":
                    application.stage,

                    "rejection_reason":
                    application.rejection_reason

                }
            )


        return JsonResponse(
            application_data,
            safe=False
        )


    # ======================================
    # CREATE APPLICATION
    # ======================================

    if request.method == "POST":

        try:

            data = json.loads(
                request.body
            )


            # ----------------------------------
            # GET USER INPUT
            # ----------------------------------

            company = data.get(
                "company",
                ""
            ).strip()


            role = data.get(
                "role",
                ""
            ).strip()


            applied_date = data.get(
                "applied_date",
                data.get("date")
            )


            status = data.get(
                "status",
                "Applied"
            )


            stage = data.get(
                "stage",
                "Applied"
            )


            rejection_reason = data.get(
                "rejection_reason",
                ""
            )


            # ----------------------------------
            # BASIC VALIDATION
            # ----------------------------------

            if (
                not company
                or not role
                or not applied_date
            ):

                return JsonResponse(
                    {
                        "error":
                        "Company, role and applied date are required."
                    },
                    status=400
                )


            # ==================================
            # CHECK JOB VACANCY
            # ==================================

            job = JobOpening.objects.filter(

                company__iexact=company,

                role__iexact=role,

                is_active=True,

                vacancy_count__gt=0

            ).first()


            # ==================================
            # NO VACANCY FOUND
            # ==================================

            if not job:

                return JsonResponse(
                    {

                        "available":
                        False,

                        "error":
                        (
                            f"No job role vacancy "
                            f"available in {company}."
                        ),

                        "message":
                        (
                            f"No job role vacancy "
                            f"available in {company}."
                        )

                    },
                    status=400
                )


            # ==================================
            # GET REQUIRED SKILLS
            # FROM JOB OPENING
            # ==================================

            required_skills = (
                job.required_skills
            )


            # ==================================
            # CREATE APPLICATION
            # ==================================

            application = Application.objects.create(

                student=student,

                company=job.company,

                role=job.role,

                required_skills=required_skills,

                applied_date=applied_date,

                status=status,

                stage=stage,

                rejection_reason=rejection_reason

            )


            # ==================================
            # SUCCESS RESPONSE
            # ==================================

            return JsonResponse(
                {

                    "message":
                    "Application created successfully.",

                    "available":
                    True,

                    "id":
                    application.id,

                    "company":
                    job.company,

                    "role":
                    job.role,

                    "required_skills":
                    required_skills,

                    "vacancy_count":
                    job.vacancy_count,

                    "location":
                    job.location,

                    "deadline":
                    (
                        job.deadline.isoformat()
                        if job.deadline
                        else None
                    )

                },
                status=201
            )


        # ----------------------------------
        # INVALID JSON
        # ----------------------------------

        except json.JSONDecodeError:

            return JsonResponse(
                {
                    "error":
                    "Invalid JSON data."
                },
                status=400
            )


        # ----------------------------------
        # OTHER ERROR
        # ----------------------------------

        except Exception as e:

            return JsonResponse(
                {
                    "error":
                    str(e)
                },
                status=400
            )


    # ======================================
    # METHOD NOT ALLOWED
    # ======================================

    return JsonResponse(
        {
            "error":
            "Method not allowed."
        },
        status=405
    )

    # --------------------------------------
    # GET APPLICATIONS
    # --------------------------------------

    if request.method == "GET":

        applications = (
            Application.objects
            .filter(student=student)
            .order_by("-applied_date")
        )


        application_data = []


        for application in applications:

            application_data.append(
                {

                    "id":
                    application.id,

                    "company":
                    application.company,

                    "role":
                    application.role,

                    "required_skills":
                    application.required_skills,

                    "applied_date":
                    application.applied_date,

                    "status":
                    application.status,

                    "stage":
                    application.stage,

                    "rejection_reason":
                    application.rejection_reason
                }
            )


        return JsonResponse(
            application_data,
            safe=False
        )


    # --------------------------------------
    # CREATE APPLICATION
    # --------------------------------------

    if request.method == "POST":

        try:

            data = json.loads(
                request.body
            )


            company = data.get(
                "company",
                ""
            ).strip()


            role = data.get(
                "role",
                ""
            ).strip()


            required_skills = data.get(
                "required_skills",
                ""
            ).strip()


            applied_date = data.get(
                "applied_date",
                data.get("date")
            )


            status = data.get(
                "status",
                "Applied"
            )


            stage = data.get(
                "stage",
                "Applied"
            )


            rejection_reason = data.get(
                "rejection_reason",
                ""
            )


            if (
                not company
                or not role
                or not applied_date
            ):

                return JsonResponse(
                    {
                        "error":
                        "Company, role and applied date are required."
                    },
                    status=400
                )


            application = Application.objects.create(

                student=student,

                company=company,

                role=role,

                required_skills=required_skills,

                applied_date=applied_date,

                status=status,

                stage=stage,

                rejection_reason=rejection_reason
            )


            return JsonResponse(
                {
                    "message":
                    "Application created successfully.",

                    "id":
                    application.id
                },
                status=201
            )


        except json.JSONDecodeError:

            return JsonResponse(
                {
                    "error":
                    "Invalid JSON data."
                },
                status=400
            )


        except Exception as e:

            return JsonResponse(
                {
                    "error": str(e)
                },
                status=400
            )


    return JsonResponse(
        {
            "error":
            "Method not allowed."
        },
        status=405
    )


# ==========================================
# DELETE APPLICATION
# ==========================================

@csrf_exempt
def application_delete(
    request,
    application_id
):

    student = get_current_student(request)


    if student is None:

        return JsonResponse(
            {
                "error":
                "Authentication required."
            },
            status=401
        )


    if request.method != "DELETE":

        return JsonResponse(
            {
                "error":
                "Only DELETE method is allowed."
            },
            status=405
        )


    try:

        application = Application.objects.get(

            id=application_id,

            student=student
        )


        application.delete()


        return JsonResponse(
            {
                "message":
                "Application deleted successfully."
            }
        )


    except Application.DoesNotExist:

        return JsonResponse(
            {
                "error":
                "Application not found."
            },
            status=404
        )


# ==========================================
# UPDATE APPLICATION
# ==========================================

@csrf_exempt
def application_update(
    request,
    application_id
):

    student = get_current_student(request)


    if student is None:

        return JsonResponse(
            {
                "error":
                "Authentication required."
            },
            status=401
        )


    if request.method != "PUT":

        return JsonResponse(
            {
                "error":
                "Only PUT method is allowed."
            },
            status=405
        )


    try:

        application = Application.objects.get(

            id=application_id,

            student=student
        )


        data = json.loads(
            request.body
        )


        if "company" in data:

            application.company = data.get(
                "company",
                ""
            )


        if "role" in data:

            application.role = data.get(
                "role",
                ""
            )


        if "required_skills" in data:

            application.required_skills = data.get(
                "required_skills",
                ""
            )


        if "applied_date" in data:

            application.applied_date = data.get(
                "applied_date"
            )

        elif "date" in data:

            application.applied_date = data.get(
                "date"
            )


        if "status" in data:

            application.status = data.get(
                "status"
            )


        if "stage" in data:

            application.stage = data.get(
                "stage"
            )


        if "rejection_reason" in data:

            application.rejection_reason = data.get(
                "rejection_reason"
            )


        application.save()


        return JsonResponse(
            {
                "message":
                "Application updated successfully."
            }
        )


    except Application.DoesNotExist:

        return JsonResponse(
            {
                "error":
                "Application not found."
            },
            status=404
        )


    except json.JSONDecodeError:

        return JsonResponse(
            {
                "error":
                "Invalid JSON data."
            },
            status=400
        )


    except Exception as e:

        return JsonResponse(
            {
                "error": str(e)
            },
            status=400
        )


# ==========================================
# CSV IMPORT
# ==========================================

@csrf_exempt
def import_applications_csv(request):

    student = get_current_student(request)

    if student is None:
        return JsonResponse(
            {"error": "Authentication required."},
            status=401
        )

    if request.method != "POST":
        return JsonResponse(
            {"error": "Only POST method is allowed."},
            status=405
        )

    uploaded_file = request.FILES.get("file")

    if not uploaded_file:
        return JsonResponse(
            {"error": "CSV file is required."},
            status=400
        )

    try:
        file_content = uploaded_file.read().decode("utf-8")
        reader = csv.DictReader(io.StringIO(file_content))

        imported = 0
        rejected = 0
        errors = []

        for row_number, row in enumerate(reader, start=2):
            try:
                company = row.get("company", "").strip()
                role = row.get("role", "").strip()

                applied_date = row.get("applied_date", "").strip()
                if not applied_date:
                    applied_date = row.get("date", "").strip()

                status = row.get("status", "Applied").strip()
                stage = row.get("stage", "Applied").strip()
                rejection_reason = row.get("rejection_reason", "").strip()

                if not company or not role or not applied_date:
                    rejected += 1
                    errors.append(
                        f"Row {row_number}: Company, role and applied date are required."
                    )
                    continue

                # Check whether the company + role has an active vacancy.
                job = JobOpening.objects.filter(
                    company__iexact=company,
                    role__iexact=role,
                    is_active=True,
                    vacancy_count__gt=0
                ).first()

                if not job:
                    rejected += 1
                    errors.append(
                        f"Row {row_number}: No job role vacancy available in {company} for {role}."
                    )
                    continue

                # Required skills always come from the JobOpening, not the CSV.
                required_skills = job.required_skills

                Application.objects.create(
                    student=student,
                    company=job.company,
                    role=job.role,
                    required_skills=required_skills,
                    applied_date=applied_date,
                    status=status,
                    stage=stage,
                    rejection_reason=rejection_reason
                )

                imported += 1

            except Exception as e:
                rejected += 1
                errors.append(
                    f"Row {row_number}: {str(e)}"
                )

        return JsonResponse(
            {
                "message": "CSV import completed.",
                "imported": imported,
                "rejected": rejected,
                "errors": errors
            }
        )

    except UnicodeDecodeError:
        return JsonResponse(
            {
                "error": "CSV file must be UTF-8 encoded."
            },
            status=400
        )

    except Exception as e:
        return JsonResponse(
            {
                "error": str(e)
            },
            status=500
        )


@csrf_exempt
def job_opening_check(request):

    if request.method != "GET":
        return JsonResponse(
            {
                "error": "Only GET method is allowed."
            },
            status=405
        )

    company = request.GET.get("company", "").strip()
    role = request.GET.get("role", "").strip()

    if not company or not role:
        return JsonResponse(
            {
                "error": "Company and role are required."
            },
            status=400
        )

    job = JobOpening.objects.filter(
        company__iexact=company,
        role__iexact=role,
        is_active=True,
        vacancy_count__gt=0
    ).first()

    if not job:
        return JsonResponse(
            {
                "available": False,
                "message": (
                    f"No job role vacancy available "
                    f"in {company}."
                )
            },
            status=200
        )

    return JsonResponse(
        {
            "available": True,
            "message": "Vacancy available.",
            "job_id": job.id,
            "company": job.company,
            "role": job.role,
            "vacancy_count": job.vacancy_count,
            "required_skills": job.required_skills,
            "location": job.location,
            "deadline": (
                job.deadline.isoformat()
                if job.deadline
                else None
            )
        },
        status=200
    )