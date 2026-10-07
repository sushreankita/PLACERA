from django.contrib import admin
from django.urls import path, re_path
from django.http import FileResponse, Http404
from django.conf import settings
from django.conf.urls.static import static

import os
import mimetypes

from placement.views import (
    application_list,
    application_delete,
    application_update,
    student_profile,
    upload_resume,
    import_applications_csv,
    register_user,
    login_user,
    logout_user,
    job_opening_check,
)


# ==========================================
# FRONTEND FILE SERVER
# ==========================================

def frontend_file(request, file_path="index.html"):

    frontend_path = os.path.abspath(
        os.path.join(
            settings.BASE_DIR,
            "..",
            "frontend"
        )
    )

    if not file_path:
        file_path = "index.html"

    full_path = os.path.abspath(
        os.path.join(
            frontend_path,
            file_path
        )
    )

    if not full_path.startswith(frontend_path):
        raise Http404()

    if not os.path.isfile(full_path):
        raise Http404(
            f"File not found: {file_path}"
        )

    content_type, _ = mimetypes.guess_type(
        full_path
    )

    return FileResponse(
        open(full_path, "rb"),
        content_type=(
            content_type
            or "application/octet-stream"
        )
    )


# ==========================================
# URL PATTERNS
# ==========================================

urlpatterns = [

    path(
        "admin/",
        admin.site.urls
    ),

    # Authentication
    path(
        "api/register/",
        register_user,
        name="register_user"
    ),

    path(
        "api/login/",
        login_user,
        name="login_user"
    ),

    path(
        "api/logout/",
        logout_user,
        name="logout_user"
    ),

    # Student
    path(
        "api/student/",
        student_profile,
        name="student_profile"
    ),

    # Resume
    path(
        "api/student/resume/",
        upload_resume,
        name="upload_resume"
    ),

    # Applications
    path(
        "api/applications/",
        application_list,
        name="application_list"
    ),

    path(
        "api/applications/<int:application_id>/",
        application_delete,
        name="application_delete"
    ),

    path(
        "api/applications/<int:application_id>/update/",
        application_update,
        name="application_update"
    ),

    # CSV
    path(
        "api/applications/import/",
        import_applications_csv,
        name="import_applications_csv"
    ),
    path(
        "api/job-openings/check/",
        job_opening_check,
        name="job_opening_check"
    ),
]


# ==========================================
# MEDIA FILES
# ==========================================

urlpatterns += static(
    settings.MEDIA_URL,
    document_root=settings.MEDIA_ROOT
)


# ==========================================
# FRONTEND
# ==========================================

urlpatterns += [

    re_path(
        r"^(?P<file_path>.*)$",
        frontend_file
    )

]