// ==========================================
// PLACERA - PROFILE PAGE
// ==========================================


// ==========================================
// DOM ELEMENTS
// ==========================================

const profileForm = document.getElementById("profileForm");

const resumeInput = document.getElementById("resume");
const selectedFileName = document.getElementById("selectedFileName");

const uploadResumeBtn =
    document.getElementById("uploadResumeBtn");

const resumeMessage =
    document.getElementById("resumeMessage");

const resumeLink =
    document.getElementById("resumeLink");


// ==========================================
// LOAD PROFILE WHEN PAGE OPENS
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

    loadProfile();

});


// ==========================================
// LOAD PROFILE
// ==========================================

async function loadProfile() {

    try {

        const response = await fetch(
            "/api/student/",
            {
                method: "GET"
            }
        );


        if (response.status === 401) {

            alert(
                "Your session has expired. Please login again."
            );

            window.location.href = "/login.html";

            return;
        }


        if (!response.ok) {

            throw new Error(
                "Unable to load profile."
            );
        }


        const data = await response.json();


        // ==================================
        // PERSONAL INFORMATION
        // ==================================

        setValue(
            "name",
            data.name
        );

        setValue(
            "email",
            data.email
        );

        setValue(
            "dob",
            data.dob
        );

        setValue(
            "gender",
            data.gender
        );

        setValue(
            "city",
            data.city
        );

        setValue(
            "state",
            data.state
        );


        // ==================================
        // EDUCATION
        // ==================================

        setValue(
            "college",
            data.college
        );

        setValue(
            "degree",
            data.degree
        );

        setValue(
            "branch",
            data.branch
        );

        setValue(
            "current_year",
            data.current_year
        );

        setValue(
            "cgpa",
            data.cgpa
        );

        setValue(
            "graduation_year",
            data.graduation_year
        );


        // ==================================
        // SKILLS
        // ==================================

        setValue(
            "skills",
            data.skills
        );

        setValue(
            "skill_level",
            data.skill_level
        );


        // ==================================
        // LOAD EXISTING RESUME
        // ==================================

        loadExistingResume(data);


    }

    catch (error) {

        console.error(
            "Profile loading error:",
            error
        );

        showResumeMessage(
            "Unable to load your profile.",
            "error"
        );

    }

}


// ==========================================
// SET INPUT VALUE SAFELY
// ==========================================

function setValue(
    elementId,
    value
) {

    const element =
        document.getElementById(elementId);


    if (!element) {

        return;
    }


    if (
        value !== null &&
        value !== undefined
    ) {

        element.value = value;

    }

}


// ==========================================
// LOAD EXISTING RESUME
// ==========================================

function loadExistingResume(data) {

    // No resume uploaded yet

    if (
        !data.resume ||
        !data.resume_name
    ) {

        selectedFileName.textContent =
            "No resume uploaded yet.";

        resumeLink.style.display =
            "none";

        return;
    }


    // ==================================
    // SHOW EXISTING FILE NAME
    // ==================================

    selectedFileName.textContent =
        "Uploaded: " + data.resume_name;


    selectedFileName.classList.add(
        "success"
    );


    // ==================================
    // SHOW VIEW RESUME LINK
    // ==================================

    resumeLink.href =
        data.resume;

    resumeLink.target =
        "_blank";

    resumeLink.style.display =
        "inline-flex";

    resumeLink.textContent =
        "View Uploaded Resume ↗";


    // ==================================
    // SHOW SUCCESS MESSAGE
    // ==================================

    resumeMessage.textContent =
        "Your resume is already uploaded.";

    resumeMessage.className =
        "resume-message success";

}


// ==========================================
// SELECT RESUME FILE
// ==========================================

if (resumeInput) {

    resumeInput.addEventListener(
        "change",
        function () {

            if (
                !this.files ||
                this.files.length === 0
            ) {

                return;
            }


            const file =
                this.files[0];


            // Show selected file name

            selectedFileName.textContent =
                "Selected: " + file.name;


            selectedFileName.classList.remove(
                "success"
            );


            resumeMessage.textContent =
                "";


            resumeMessage.className =
                "resume-message";

        }
    );

}


// ==========================================
// UPLOAD RESUME
// ==========================================

if (uploadResumeBtn) {

    uploadResumeBtn.addEventListener(
        "click",
        uploadResume
    );

}


async function uploadResume() {

    if (
        !resumeInput ||
        !resumeInput.files ||
        resumeInput.files.length === 0
    ) {

        showResumeMessage(
            "Please select a resume first.",
            "error"
        );

        return;
    }


    const file =
        resumeInput.files[0];


    // ==================================
    // FILE SIZE VALIDATION
    // ==================================

    const maxSize =
        5 * 1024 * 1024;


    if (file.size > maxSize) {

        showResumeMessage(
            "Resume must be smaller than 5 MB.",
            "error"
        );

        return;
    }


    // ==================================
    // FILE TYPE VALIDATION
    // ==================================

    const allowedTypes = [
        ".pdf",
        ".doc",
        ".docx"
    ];


    const fileName =
        file.name.toLowerCase();


    const validFile =
        allowedTypes.some(
            extension =>
                fileName.endsWith(extension)
        );


    if (!validFile) {

        showResumeMessage(
            "Only PDF, DOC and DOCX files are allowed.",
            "error"
        );

        return;
    }


    // ==================================
    // FORM DATA
    // ==================================

    const formData =
        new FormData();

    formData.append(
        "resume",
        file
    );


    // ==================================
    // BUTTON STATE
    // ==================================

    uploadResumeBtn.disabled =
        true;

    uploadResumeBtn.textContent =
        "Uploading...";


    try {

        const response =
            await fetch(
                "/api/student/resume/",
                {
                    method: "POST",
                    body: formData
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.error ||
                "Resume upload failed."
            );
        }


        // ==================================
        // SUCCESS
        // ==================================

        showResumeMessage(
            "Resume uploaded successfully!",
            "success"
        );


        selectedFileName.textContent =
            "Uploaded: " + data.resume_name;


        selectedFileName.classList.add(
            "success"
        );


        // ==================================
        // UPDATE VIEW LINK
        // ==================================

        resumeLink.href =
            data.resume;

        resumeLink.target =
            "_blank";

        resumeLink.textContent =
            "View Uploaded Resume ↗";

        resumeLink.style.display =
            "inline-flex";


        // Clear file input

        resumeInput.value = "";


    }

    catch (error) {

        console.error(
            "Resume upload error:",
            error
        );


        showResumeMessage(
            error.message ||
            "Unable to upload resume.",
            "error"
        );

    }

    finally {

        uploadResumeBtn.disabled =
            false;

        uploadResumeBtn.textContent =
            "Upload Resume";

    }

}


// ==========================================
// RESUME MESSAGE
// ==========================================

function showResumeMessage(
    message,
    type
) {

    if (!resumeMessage) {

        return;
    }


    resumeMessage.textContent =
        message;


    resumeMessage.className =
        "resume-message " + type;

}


// ==========================================
// SAVE PROFILE
// ==========================================

if (profileForm) {

    profileForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();


            const data = {

                name:
                    getValue("name"),

                email:
                    getValue("email"),

                dob:
                    getValue("dob"),

                gender:
                    getValue("gender"),

                city:
                    getValue("city"),

                state:
                    getValue("state"),

                college:
                    getValue("college"),

                degree:
                    getValue("degree"),

                branch:
                    getValue("branch"),

                current_year:
                    getValue("current_year"),

                cgpa:
                    getValue("cgpa"),

                graduation_year:
                    getValue("graduation_year"),

                skills:
                    getValue("skills"),

                skill_level:
                    getValue("skill_level")

            };


            try {

                const response =
                    await fetch(
                        "/api/student/",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(data)
                        }
                    );


                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.error ||
                        "Unable to save profile."
                    );
                }


                alert(
                    "Profile saved successfully!"
                );


                window.location.href =
                    "/dashboard.html";


            }

            catch (error) {

                console.error(
                    "Profile save error:",
                    error
                );


                alert(
                    error.message ||
                    "Unable to save profile."
                );

            }

        }
    );

}


// ==========================================
// GET INPUT VALUE
// ==========================================

function getValue(elementId) {

    const element =
        document.getElementById(elementId);


    if (!element) {

        return "";
    }


    return element.value.trim();

}


// ==========================================
// LOGOUT
// ==========================================

const logoutBtn =
    document.getElementById("logoutBtn");


if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        async function () {

            try {

                await fetch(
                    "/api/logout/",
                    {
                        method: "POST"
                    }
                );

            }

            catch (error) {

                console.error(
                    error
                );

            }


            window.location.href =
                "/login.html";

        }
    );

}