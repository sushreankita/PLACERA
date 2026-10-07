// ==========================================
// PLACERA EDUCATION
// ==========================================

const educationForm =
    document.getElementById("educationForm");


// ==========================================
// LOAD EXISTING EDUCATION
// ==========================================

async function loadEducation() {

    try {

        const response =
            await fetch("/api/student/");

        if (!response.ok) {
            return;
        }

        const data =
            await response.json();

        if (data) {

            document.getElementById("college").value =
                data.college || "";

            document.getElementById("degree").value =
                data.degree || "";

            document.getElementById("branch").value =
                data.branch || "";

            document.getElementById("currentYear").value =
                data.current_year || "";

            document.getElementById("cgpa").value =
                data.cgpa || "";

            document.getElementById("graduationYear").value =
                data.graduation_year || "";
        }

    } catch (error) {

        console.error(
            "Education loading error:",
            error
        );

    }
}


// ==========================================
// SAVE EDUCATION
// ==========================================

educationForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const college =
            document.getElementById("college").value.trim();

        const degree =
            document.getElementById("degree").value.trim();

        const branch =
            document.getElementById("branch").value.trim();

        const currentYear =
            document.getElementById("currentYear").value;

        const cgpa =
            document.getElementById("cgpa").value;

        const graduationYear =
            document.getElementById("graduationYear").value;


        const message =
            document.getElementById("educationMessage");

        const button =
            document.getElementById("educationButton");


        // ==========================================
        // VALIDATION
        // ==========================================

        if (!college) {

            showEducationMessage(
                "Please enter your college name.",
                "red"
            );

            return;
        }


        if (!degree) {

            showEducationMessage(
                "Please enter your degree.",
                "red"
            );

            return;
        }


        if (!branch) {

            showEducationMessage(
                "Please enter your branch.",
                "red"
            );

            return;
        }


        if (!currentYear) {

            showEducationMessage(
                "Please select your current year.",
                "red"
            );

            return;
        }


        if (!cgpa || cgpa < 0 || cgpa > 10) {

            showEducationMessage(
                "CGPA must be between 0 and 10.",
                "red"
            );

            return;
        }


        if (!graduationYear) {

            showEducationMessage(
                "Please enter your graduation year.",
                "red"
            );

            return;
        }


        // ==========================================
        // BUTTON
        // ==========================================

        button.disabled = true;
        button.textContent = "Saving...";


        try {

            // ==========================================
            // SEND TO DJANGO
            // ==========================================

            const response =
                await fetch("/api/student/", {

                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify({

                        college: college,

                        degree: degree,

                        branch: branch,

                        current_year: currentYear,

                        cgpa: parseFloat(cgpa),

                        graduation_year:
                            parseInt(graduationYear)

                    })

                });


            const data =
                await response.json();


            // ==========================================
            // SUCCESS
            // ==========================================

            if (response.ok) {

                showEducationMessage(
                    "Education details saved successfully!",
                    "green"
                );


                setTimeout(function () {

                    window.location.href =
                        "skills.html";

                }, 800);

            }


            // ==========================================
            // ERROR
            // ==========================================

            else {

                showEducationMessage(
                    data.error ||
                    "Unable to save education details.",
                    "red"
                );

                button.disabled = false;

                button.textContent =
                    "Continue →";
            }


        } catch (error) {

            console.error(
                "Education Error:",
                error
            );

            showEducationMessage(
                "Unable to connect to Django server.",
                "red"
            );

            button.disabled = false;

            button.textContent =
                "Continue →";
        }

    }
);


// ==========================================
// MESSAGE
// ==========================================

function showEducationMessage(text, color) {

    const message =
        document.getElementById("educationMessage");

    message.textContent = text;

    message.style.display = "block";

    message.style.color = color;
}


// ==========================================
// LOAD WHEN PAGE OPENS
// ==========================================

loadEducation();