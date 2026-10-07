// ==========================================
// PLACERA SKILLS
// ==========================================

const skillsForm =
    document.getElementById("skillsForm");


// ==========================================
// LOAD EXISTING SKILLS
// ==========================================

async function loadSkills() {

    try {

        const response =
            await fetch("/api/student/");

        if (!response.ok) {
            return;
        }

        const data =
            await response.json();


        if (!data || !data.skills) {
            return;
        }


        // Convert stored string into array

        const storedSkills =
            data.skills
                .split(",")
                .map(skill => skill.trim())
                .filter(skill => skill !== "");


        // Select matching checkboxes

        const checkboxes =
            document.querySelectorAll(
                'input[name="skill"]'
            );


        checkboxes.forEach(function (checkbox) {

            if (
                storedSkills.includes(
                    checkbox.value
                )
            ) {

                checkbox.checked = true;

            }

        });

    } catch (error) {

        console.error(
            "Skills loading error:",
            error
        );

    }
}


// ==========================================
// SAVE SKILLS
// ==========================================

skillsForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();


        const selectedSkills = [];


        // Get selected checkboxes

        const checkboxes =
            document.querySelectorAll(
                'input[name="skill"]:checked'
            );


        checkboxes.forEach(function (checkbox) {

            selectedSkills.push(
                checkbox.value
            );

        });


        // Other skills

        const otherSkills =
            document
                .getElementById("otherSkills")
                .value
                .trim();


        const skillLevel =
            document
                .getElementById("skillLevel")
                .value;


        const message =
            document.getElementById(
                "skillsMessage"
            );

        const button =
            document.getElementById(
                "skillsButton"
            );


        // ==========================================
        // VALIDATION
        // ==========================================

        if (selectedSkills.length === 0) {

            showSkillsMessage(
                "Please select at least one skill.",
                "red"
            );

            return;
        }


        // ==========================================
        // ADD OTHER SKILLS
        // ==========================================

        if (otherSkills) {

            const extraSkills =
                otherSkills
                    .split(",")
                    .map(skill => skill.trim())
                    .filter(skill => skill !== "");


            selectedSkills.push(
                ...extraSkills
            );
        }


        // ==========================================
        // REMOVE DUPLICATES
        // ==========================================

        const uniqueSkills =
            [...new Set(selectedSkills)];


        // ==========================================
        // BUTTON
        // ==========================================

        button.disabled = true;

        button.textContent =
            "Saving...";


        try {

            // ==========================================
            // SEND TO DJANGO
            // ==========================================

            const response =
                await fetch("/api/student/", {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body: JSON.stringify({

                        skills:
                            uniqueSkills.join(", ")

                    })

                });


            const data =
                await response.json();


            // ==========================================
            // SUCCESS
            // ==========================================

            if (response.ok) {

                showSkillsMessage(
                    "Skills saved successfully!",
                    "green"
                );


                setTimeout(function () {

                    window.location.href =
                        "dashboard.html";

                }, 800);

            }


            // ==========================================
            // ERROR
            // ==========================================

            else {

                showSkillsMessage(
                    data.error ||
                    "Unable to save skills.",
                    "red"
                );

                button.disabled = false;

                button.textContent =
                    "Complete Profile →";
            }


        } catch (error) {

            console.error(
                "Skills Error:",
                error
            );


            showSkillsMessage(
                "Unable to connect to Django server.",
                "red"
            );


            button.disabled = false;

            button.textContent =
                "Complete Profile →";
        }

    }
);


// ==========================================
// MESSAGE
// ==========================================

function showSkillsMessage(
    text,
    color
) {

    const message =
        document.getElementById(
            "skillsMessage"
        );


    message.textContent = text;

    message.style.display =
        "block";

    message.style.color =
        color;
}


// ==========================================
// LOAD WHEN PAGE OPENS
// ==========================================

loadSkills();