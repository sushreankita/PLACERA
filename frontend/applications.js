// ==========================================
// PLACERA - APPLICATIONS
// ==========================================

let applications = [];
let editingApplicationId = null;
let studentSkills = [];


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    loadApplications();
    loadStudentSkills();

    // --------------------------------------
    // ADD APPLICATION
    // --------------------------------------

    const addBtn =
        document.getElementById("addApplicationBtn");

    if (addBtn) {
        addBtn.addEventListener(
            "click",
            openModal
        );
    }


    const emptyAddBtn =
        document.getElementById("emptyAddBtn");

    if (emptyAddBtn) {
        emptyAddBtn.addEventListener(
            "click",
            openModal
        );
    }


    // --------------------------------------
    // APPLICATION MODAL
    // --------------------------------------

    const closeModalBtn =
        document.getElementById("closeModalBtn");

    if (closeModalBtn) {
        closeModalBtn.addEventListener(
            "click",
            closeModal
        );
    }


    const cancelBtn =
        document.getElementById("cancelBtn");

    if (cancelBtn) {
        cancelBtn.addEventListener(
            "click",
            closeModal
        );
    }


    const form =
        document.getElementById("applicationForm");

    if (form) {
        form.addEventListener(
            "submit",
            saveApplication
        );
    }


    // --------------------------------------
    // SEARCH
    // --------------------------------------

    const searchInput =
        document.getElementById("searchInput");

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            applyFilters
        );
    }


    // --------------------------------------
    // STATUS FILTER
    // --------------------------------------

    const statusFilter =
        document.getElementById("statusFilter");

    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            applyFilters
        );
    }


    // --------------------------------------
    // STAGE FILTER
    // --------------------------------------

    const stageFilter =
        document.getElementById("stageFilter");

    if (stageFilter) {

        stageFilter.addEventListener(
            "change",
            applyFilters
        );
    }


    // --------------------------------------
    // REFRESH
    // --------------------------------------

    const refreshBtn =
        document.getElementById("refreshBtn");

    if (refreshBtn) {

        refreshBtn.addEventListener(
            "click",
            loadApplications
        );
    }


    // --------------------------------------
    // CSV
    // --------------------------------------

    const csvBtn =
        document.getElementById("csvBtn");

    if (csvBtn) {

        csvBtn.addEventListener(
            "click",
            openCSVModal
        );
    }


    const closeCSVBtn =
        document.getElementById("closeCSVBtn");

    if (closeCSVBtn) {

        closeCSVBtn.addEventListener(
            "click",
            closeCSVModal
        );
    }


    const cancelCSVBtn =
        document.getElementById("cancelCSVBtn");

    if (cancelCSVBtn) {

        cancelCSVBtn.addEventListener(
            "click",
            closeCSVModal
        );
    }


    const importCSVBtn =
        document.getElementById("importCSVBtn");

    if (importCSVBtn) {

        importCSVBtn.addEventListener(
            "click",
            importCSV
        );
    }


    // --------------------------------------
    // SKILL MATCH MODAL
    // --------------------------------------

    const closeSkillMatchBtn =
        document.getElementById(
            "closeSkillMatchBtn"
        );

    if (closeSkillMatchBtn) {

        closeSkillMatchBtn.addEventListener(
            "click",
            closeSkillMatch
        );
    }


    // --------------------------------------
    // JOURNEY MODAL
    // --------------------------------------

    const closeJourneyBtn =
        document.getElementById(
            "closeJourneyBtn"
        );

    if (closeJourneyBtn) {

        closeJourneyBtn.addEventListener(
            "click",
            closeJourneyModal
        );
    }


    // --------------------------------------
    // LOGOUT
    // --------------------------------------

    const logoutBtn =
        document.getElementById("logoutBtn");

    if (logoutBtn) {

        logoutBtn.addEventListener(
            "click",
            logoutUser
        );
    }


    // --------------------------------------
    // COMPANY / ROLE VACANCY CHECK
    // --------------------------------------

    const companyInput =
        document.getElementById("company");

    const roleInput =
        document.getElementById("role");


    if (companyInput) {

        companyInput.addEventListener(
            "blur",
            checkJobVacancy
        );
    }


    if (roleInput) {

        roleInput.addEventListener(
            "blur",
            checkJobVacancy
        );
    }

});


// ==========================================
// LOAD APPLICATIONS
// ==========================================

async function loadApplications() {

    try {

        const response =
            await fetch(
                "/api/applications/",
                {
                    method: "GET",
                    credentials: "same-origin"
                }
            );


        if (response.status === 401) {

            window.location.href =
                "/login.html";

            return;
        }


        if (!response.ok) {

            throw new Error(
                "Unable to load applications."
            );
        }


        applications =
            await response.json();


        updateSummary();


        applyFilters();


    } catch (error) {

        console.error(
            "Load Applications Error:",
            error
        );


        const table =
            document.getElementById(
                "applicationTable"
            );


        if (table) {

            table.innerHTML = `
                <tr>
                    <td
                        colspan="8"
                        style="text-align:center;"
                    >
                        Unable to load applications.
                    </td>
                </tr>
            `;
        }
    }
}


// ==========================================
// LOAD STUDENT SKILLS
// ==========================================

async function loadStudentSkills() {

    try {

        const response =
            await fetch(
                "/api/student/",
                {
                    method: "GET",
                    credentials: "same-origin"
                }
            );


        if (!response.ok) {

            return;
        }


        const data =
            await response.json();


        if (data.skills) {

            studentSkills =
                String(data.skills)
                    .split(",")
                    .map(function (skill) {

                        return skill
                            .trim()
                            .toLowerCase();

                    })
                    .filter(Boolean);


            localStorage.setItem(
                "studentSkills",
                data.skills
            );
        }


    } catch (error) {

        console.error(
            "Student Skills Error:",
            error
        );


        const storedSkills =
            localStorage.getItem(
                "studentSkills"
            );


        if (storedSkills) {

            studentSkills =
                storedSkills
                    .split(",")
                    .map(function (skill) {

                        return skill
                            .trim()
                            .toLowerCase();

                    })
                    .filter(Boolean);
        }
    }
}


// ==========================================
// UPDATE SUMMARY
// ==========================================

function updateSummary() {

    const applicationCount =
        document.getElementById(
            "applicationCount"
        );


    const interviewCount =
        document.getElementById(
            "interviewCount"
        );


    const offerCount =
        document.getElementById(
            "offerCount"
        );


    const rejectedCount =
        document.getElementById(
            "rejectedCount"
        );


    const total =
        applications.length;


    const interviews =
        applications.filter(
            function (app) {

                return (
                    app.status === "Interview" ||
                    app.stage === "Technical" ||
                    app.stage === "HR"
                );

            }
        ).length;


    const offers =
        applications.filter(
            function (app) {

                return app.status === "Offer";

            }
        ).length;


    const rejected =
        applications.filter(
            function (app) {

                return app.status === "Rejected";

            }
        ).length;


    if (applicationCount) {

        applicationCount.textContent =
            total;
    }


    if (interviewCount) {

        interviewCount.textContent =
            interviews;
    }


    if (offerCount) {

        offerCount.textContent =
            offers;
    }


    if (rejectedCount) {

        rejectedCount.textContent =
            rejected;
    }
}


// ==========================================
// SEARCH + STATUS + STAGE FILTER
// ==========================================

function applyFilters() {

    const searchInput =
        document.getElementById(
            "searchInput"
        );


    const statusFilter =
        document.getElementById(
            "statusFilter"
        );


    const stageFilter =
        document.getElementById(
            "stageFilter"
        );


    const search =
        searchInput
            ? searchInput.value
                .trim()
                .toLowerCase()
            : "";


    const selectedStatus =
        statusFilter
            ? statusFilter.value
            : "All";


    const selectedStage =
        stageFilter
            ? stageFilter.value
            : "All";


    const filtered =
        applications.filter(
            function (application) {

                const company =
                    String(
                        application.company || ""
                    ).toLowerCase();


                const role =
                    String(
                        application.role || ""
                    ).toLowerCase();


                const matchesSearch =
                    search === "" ||
                    company.includes(search) ||
                    role.includes(search);


                const matchesStatus =
                    selectedStatus === "All" ||
                    application.status ===
                        selectedStatus;


                const matchesStage =
                    selectedStage === "All" ||
                    application.stage ===
                        selectedStage;


                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesStage
                );

            }
        );


    displayApplications(
        filtered
    );
}


// ==========================================
// DISPLAY APPLICATIONS
// ==========================================

function displayApplications(data) {

    const table =
        document.getElementById(
            "applicationTable"
        );


    const emptyState =
        document.getElementById(
            "emptyState"
        );


    if (!table) {

        return;
    }


    table.innerHTML = "";


    if (data.length === 0) {

        if (emptyState) {

            emptyState.classList.remove(
                "hidden"
            );
        }


        table.innerHTML = `
            <tr>
                <td
                    colspan="8"
                    style="text-align:center;
                           padding:30px;"
                >
                    No applications found.
                </td>
            </tr>
        `;


        return;
    }


    if (emptyState) {

        emptyState.classList.add(
            "hidden"
        );
    }


    data.forEach(
        function (application) {

            const row =
                document.createElement(
                    "tr"
                );


            const skillMatch =
                calculateSkillMatch(
                    application.required_skills
                );


            row.innerHTML = `

                <td>
                    ${escapeHTML(
                        application.company
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        application.role
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        application.required_skills ||
                        "Not specified"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        application.applied_date
                    )}
                </td>

                <td>
                    <span class="status-badge">
                        ${escapeHTML(
                            application.status
                        )}
                    </span>
                </td>

                <td>
                    ${escapeHTML(
                        application.stage
                    )}
                </td>

                <td>
                    <button
                        type="button"
                        onclick="openSkillMatch(${application.id})"
                    >
                        ${skillMatch}%
                    </button>
                </td>

                <td>

                    <button
                        type="button"
                        onclick="editApplication(${application.id})"
                    >
                        ✏️
                    </button>

                    <button
                        type="button"
                        onclick="deleteApplication(${application.id})"
                    >
                        🗑️
                    </button>

                    <button
                        type="button"
                        onclick="openJourney(${application.id})"
                    >
                        🚶
                    </button>

                </td>

            `;


            table.appendChild(
                row
            );

        }
    );
}


// ==========================================
// OPEN ADD APPLICATION MODAL
// ==========================================

function openModal() {

    editingApplicationId =
        null;


    const modal =
        document.getElementById(
            "applicationModal"
        );


    const form =
        document.getElementById(
            "applicationForm"
        );


    const title =
        document.getElementById(
            "modalTitle"
        );


    if (form) {

        form.reset();
    }


    if (title) {

        title.textContent =
            "Add Application";
    }


    if (modal) {

        modal.style.display =
            "block";
    }


    clearVacancyMessage();
}


// ==========================================
// CLOSE APPLICATION MODAL
// ==========================================

function closeModal() {

    const modal =
        document.getElementById(
            "applicationModal"
        );


    if (modal) {

        modal.style.display =
            "none";
    }


    editingApplicationId =
        null;


    clearVacancyMessage();
}


// ==========================================
// CHECK JOB VACANCY
// ==========================================

async function checkJobVacancy() {

    const companyInput =
        document.getElementById(
            "company"
        );


    const roleInput =
        document.getElementById(
            "role"
        );


    const requiredSkillsInput =
        document.getElementById(
            "requiredSkills"
        );


    if (
        !companyInput ||
        !roleInput
    ) {

        return null;
    }


    const company =
        companyInput.value.trim();


    const role =
        roleInput.value.trim();


    if (
        !company ||
        !role
    ) {

        return null;
    }


    try {

        const response =
            await fetch(
                "/api/job-openings/check/?" +
                "company=" +
                encodeURIComponent(
                    company
                ) +
                "&role=" +
                encodeURIComponent(
                    role
                ),
                {
                    method: "GET",
                    credentials: "same-origin"
                }
            );


        const data =
            await response.json();


        // ----------------------------------
        // NO VACANCY
        // ----------------------------------

        if (!data.available) {

            if (requiredSkillsInput) {

                requiredSkillsInput.value =
                    "";
            }


            showVacancyMessage(
                data.message ||
                "No job role vacancy available.",
                false
            );


            return null;
        }


        // ----------------------------------
        // VACANCY AVAILABLE
        // ----------------------------------

        showVacancyMessage(
            "✅ Vacancy available! " +
            data.vacancy_count +
            " position(s) available.",
            true
        );


        // ----------------------------------
        // AUTO-FILL REQUIRED SKILLS
        // ----------------------------------

        if (requiredSkillsInput) {

            requiredSkillsInput.value =
                data.required_skills || "";
        }


        return data;


    } catch (error) {

        console.error(
            "Vacancy Check Error:",
            error
        );


        if (requiredSkillsInput) {

            requiredSkillsInput.value =
                "";
        }


        showVacancyMessage(
            "Unable to check vacancy.",
            false
        );


        return null;
    }
}


// ==========================================
// SHOW VACANCY MESSAGE
// ==========================================

function showVacancyMessage(
    message,
    success
) {

    let messageBox =
        document.getElementById(
            "vacancyMessage"
        );


    if (!messageBox) {

        messageBox =
            document.createElement(
                "div"
            );


        messageBox.id =
            "vacancyMessage";


        messageBox.style.marginTop =
            "10px";


        messageBox.style.padding =
            "10px";


        messageBox.style.borderRadius =
            "8px";


        const roleInput =
            document.getElementById(
                "role"
            );


        if (
            roleInput &&
            roleInput.parentElement
        ) {

            roleInput.parentElement
                .appendChild(
                    messageBox
                );
        }
    }


    messageBox.textContent =
        message;


    if (success) {

        messageBox.style.background =
            "#e8f7ee";

        messageBox.style.color =
            "#16834b";

    } else {

        messageBox.style.background =
            "#fdecec";

        messageBox.style.color =
            "#c62828";
    }
}


// ==========================================
// CLEAR VACANCY MESSAGE
// ==========================================

function clearVacancyMessage() {

    const messageBox =
        document.getElementById(
            "vacancyMessage"
        );


    if (messageBox) {

        messageBox.remove();
    }
}


// ==========================================
// SAVE APPLICATION
// ==========================================

async function saveApplication(event) {

    event.preventDefault();


    const companyInput =
        document.getElementById(
            "company"
        );


    const roleInput =
        document.getElementById(
            "role"
        );


    const requiredSkillsInput =
        document.getElementById(
            "requiredSkills"
        );


    const appliedDateInput =
        document.getElementById(
            "appliedDate"
        );


    const statusInput =
        document.getElementById(
            "status"
        );


    const stageInput =
        document.getElementById(
            "stage"
        );


    const rejectionReasonInput =
        document.getElementById(
            "rejectionReason"
        );


    const company =
        companyInput
            ? companyInput.value.trim()
            : "";


    const role =
        roleInput
            ? roleInput.value.trim()
            : "";


    const appliedDate =
        appliedDateInput
            ? appliedDateInput.value
            : "";


    const status =
        statusInput
            ? statusInput.value
            : "Applied";


    const stage =
        stageInput
            ? stageInput.value
            : "Applied";


    const rejectionReason =
        rejectionReasonInput
            ? rejectionReasonInput.value
            : "";


    if (
        !company ||
        !role ||
        !appliedDate
    ) {

        alert(
            "Please enter company, role and applied date."
        );

        return;
    }


    // --------------------------------------
    // CHECK VACANCY
    // --------------------------------------

    const job =
        await checkJobVacancy();


    if (!job) {

        alert(
            "Application cannot be submitted.\n\n" +
            "No job role vacancy available " +
            "for this company."
        );

        return;
    }


    // --------------------------------------
    // REQUIRED SKILLS FROM DATABASE
    // --------------------------------------

    const requiredSkills =
        job.required_skills || "";


    if (requiredSkillsInput) {

        requiredSkillsInput.value =
            requiredSkills;
    }


    // --------------------------------------
    // PAYLOAD
    // --------------------------------------

    const payload = {

        company:
            company,

        role:
            role,

        required_skills:
            requiredSkills,

        applied_date:
            appliedDate,

        status:
            status || "Applied",

        stage:
            stage || "Applied",

        rejection_reason:
            rejectionReason || ""

    };


    try {

        let url =
            "/api/applications/";


        let method =
            "POST";


        // ----------------------------------
        // EDIT
        // ----------------------------------

        if (editingApplicationId) {

            url =
                "/api/applications/" +
                editingApplicationId +
                "/update/";


            method =
                "PUT";
        }


        const response =
            await fetch(
                url,
                {
                    method:
                        method,

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    credentials:
                        "same-origin",

                    body:
                        JSON.stringify(
                            payload
                        )
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.error ||
                data.message ||
                "Unable to save application."
            );

            return;
        }


        alert(
            data.message ||
            "Application saved successfully."
        );


        closeModal();


        await loadApplications();


    } catch (error) {

        console.error(
            "Save Application Error:",
            error
        );


        alert(
            "Unable to connect to Django server."
        );
    }
}


// ==========================================
// EDIT APPLICATION
// ==========================================

async function editApplication(
    applicationId
) {

    const application =
        applications.find(
            function (item) {

                return (
                    item.id ===
                    applicationId
                );

            }
        );


    if (!application) {

        return;
    }


    editingApplicationId =
        applicationId;


    const company =
        document.getElementById(
            "company"
        );


    const role =
        document.getElementById(
            "role"
        );


    const requiredSkills =
        document.getElementById(
            "requiredSkills"
        );


    const appliedDate =
        document.getElementById(
            "appliedDate"
        );


    const status =
        document.getElementById(
            "status"
        );


    const stage =
        document.getElementById(
            "stage"
        );


    const rejectionReason =
        document.getElementById(
            "rejectionReason"
        );


    if (company) {

        company.value =
            application.company || "";
    }


    if (role) {

        role.value =
            application.role || "";
    }


    if (requiredSkills) {

        requiredSkills.value =
            application.required_skills || "";
    }


    if (appliedDate) {

        appliedDate.value =
            application.applied_date || "";
    }


    if (status) {

        status.value =
            application.status || "Applied";
    }


    if (stage) {

        stage.value =
            application.stage || "Applied";
    }


    if (rejectionReason) {

        rejectionReason.value =
            application.rejection_reason || "";
    }


    const title =
        document.getElementById(
            "modalTitle"
        );


    if (title) {

        title.textContent =
            "Edit Application";
    }


    const modal =
        document.getElementById(
            "applicationModal"
        );


    if (modal) {

        modal.style.display =
            "block";
    }


    clearVacancyMessage();


    await checkJobVacancy();
}


// ==========================================
// DELETE APPLICATION
// ==========================================

async function deleteApplication(
    applicationId
) {

    const confirmed =
        confirm(
            "Are you sure you want to delete this application?"
        );


    if (!confirmed) {

        return;
    }


    try {

        const response =
            await fetch(
                "/api/applications/" +
                applicationId +
                "/",
                {
                    method:
                        "DELETE",

                    credentials:
                        "same-origin"
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            alert(
                data.error ||
                "Unable to delete application."
            );

            return;
        }


        alert(
            data.message ||
            "Application deleted successfully."
        );


        await loadApplications();


    } catch (error) {

        console.error(
            "Delete Error:",
            error
        );


        alert(
            "Unable to connect to server."
        );
    }
}


// ==========================================
// CALCULATE SKILL MATCH
// ==========================================

function calculateSkillMatch(
    requiredSkills
) {

    if (!requiredSkills) {

        return 0;
    }


    let skills =
        studentSkills;


    if (
        skills.length === 0
    ) {

        const storedSkills =
            localStorage.getItem(
                "studentSkills"
            );


        if (storedSkills) {

            skills =
                storedSkills
                    .split(",")
                    .map(function (skill) {

                        return skill
                            .trim()
                            .toLowerCase();

                    })
                    .filter(Boolean);
        }
    }


    if (
        skills.length === 0
    ) {

        return 0;
    }


    const required =
        String(
            requiredSkills
        )
        .split(",")
        .map(function (skill) {

            return skill
                .trim()
                .toLowerCase();

        })
        .filter(Boolean);


    if (
        required.length === 0
    ) {

        return 0;
    }


    let matched = 0;


    required.forEach(
        function (skill) {

            if (
                skills.includes(skill)
            ) {

                matched++;
            }

        }
    );


    return Math.round(
        (
            matched /
            required.length
        ) * 100
    );
}


// ==========================================
// OPEN SKILL MATCH
// ==========================================

function openSkillMatch(
    applicationId
) {

    const application =
        applications.find(
            function (item) {

                return (
                    item.id ===
                    applicationId
                );

            }
        );


    if (!application) {

        return;
    }


    const modal =
        document.getElementById(
            "skillMatchModal"
        );


    if (!modal) {

        return;
    }


    const title =
        document.getElementById(
            "skillMatchTitle"
        );


    const percentage =
        document.getElementById(
            "skillMatchPercentage"
        );


    const message =
        document.getElementById(
            "skillMatchMessage"
        );


    const studentSkillsBox =
        document.getElementById(
            "studentSkillsMatch"
        );


    const missingSkillsBox =
        document.getElementById(
            "missingSkills"
        );


    let skills =
        studentSkills;


    if (
        skills.length === 0
    ) {

        const storedSkills =
            localStorage.getItem(
                "studentSkills"
            );


        if (storedSkills) {

            skills =
                storedSkills
                    .split(",")
                    .map(function (skill) {

                        return skill
                            .trim()
                            .toLowerCase();

                    })
                    .filter(Boolean);
        }
    }


    const required =
        String(
            application.required_skills ||
            ""
        )
        .split(",")
        .map(function (skill) {

            return skill
                .trim()
                .toLowerCase();

        })
        .filter(Boolean);


    const matched =
        required.filter(
            function (skill) {

                return skills.includes(
                    skill
                );

            }
        );


    const missing =
        required.filter(
            function (skill) {

                return !skills.includes(
                    skill
                );

            }
        );


    const percentageValue =
        required.length > 0
            ? Math.round(
                (
                    matched.length /
                    required.length
                ) * 100
            )
            : 0;


    if (title) {

        title.textContent =
            application.company +
            " - " +
            application.role;
    }


    if (percentage) {

        percentage.textContent =
            percentageValue + "%";
    }


    if (message) {

        if (percentageValue >= 80) {

            message.textContent =
                "Excellent skill match!";

        } else if (
            percentageValue >= 50
        ) {

            message.textContent =
                "Good match, but some skills are missing.";

        } else {

            message.textContent =
                "You should improve your required skills.";
        }
    }


    if (studentSkillsBox) {

        if (matched.length > 0) {

            studentSkillsBox.innerHTML =
                matched.map(
                    function (skill) {

                        return `
                            <span>
                                ${escapeHTML(skill)}
                            </span>
                        `;

                    }
                ).join("");

        } else {

            studentSkillsBox.textContent =
                "No matching skills";
        }
    }


    if (missingSkillsBox) {

        if (missing.length > 0) {

            missingSkillsBox.innerHTML =
                missing.map(
                    function (skill) {

                        return `
                            <span>
                                ${escapeHTML(skill)}
                            </span>
                        `;

                    }
                ).join("");

        } else {

            missingSkillsBox.textContent =
                "No missing skills";
        }
    }


    modal.style.display =
        "block";
}


// ==========================================
// CLOSE SKILL MATCH
// ==========================================

function closeSkillMatch() {

    const modal =
        document.getElementById(
            "skillMatchModal"
        );


    if (modal) {

        modal.style.display =
            "none";
    }
}


// ==========================================
// OPEN JOURNEY
// ==========================================

function openJourney(
    applicationId
) {

    const application =
        applications.find(
            function (item) {

                return (
                    item.id ===
                    applicationId
                );

            }
        );


    if (!application) {

        return;
    }


    const modal =
        document.getElementById(
            "journeyModal"
        );


    if (!modal) {

        return;
    }


    const company =
        document.getElementById(
            "journeyCompany"
        );


    if (company) {

        company.textContent =
            application.company +
            " - " +
            application.role;
    }


    const stages = [

        "Applied",
        "Shortlisted",
        "Assessment",
        "Technical",
        "HR",
        "Offer"

    ];


    const currentIndex =
        stages.indexOf(
            application.stage
        );


    const stageIds = {

        "Applied":
            "journeyApplied",

        "Shortlisted":
            "journeyShortlisted",

        "Assessment":
            "journeyAssessment",

        "Technical":
            "journeyTechnical",

        "HR":
            "journeyHR",

        "Offer":
            "journeyOffer"

    };


    stages.forEach(
        function (
            stage,
            index
        ) {

            const element =
                document.getElementById(
                    stageIds[stage]
                );


            if (!element) {

                return;
            }


            if (
                index <= currentIndex
            ) {

                element.style.opacity =
                    "1";

                element.style.fontWeight =
                    "600";

            } else {

                element.style.opacity =
                    "0.5";

                element.style.fontWeight =
                    "400";
            }

        }
    );


    modal.style.display =
        "block";
}


// ==========================================
// CLOSE JOURNEY
// ==========================================

function closeJourneyModal() {

    const modal =
        document.getElementById(
            "journeyModal"
        );


    if (modal) {

        modal.style.display =
            "none";
    }
}


// ==========================================
// OPEN CSV MODAL
// ==========================================

function openCSVModal() {

    const modal =
        document.getElementById(
            "csvModal"
        );


    if (modal) {

        modal.style.display =
            "block";
    }
}


// ==========================================
// CLOSE CSV MODAL
// ==========================================

function closeCSVModal() {

    const modal =
        document.getElementById(
            "csvModal"
        );


    if (modal) {

        modal.style.display =
            "none";
    }
}


// ==========================================
// IMPORT CSV
// ==========================================

async function importCSV() {

    const fileInput =
        document.getElementById(
            "csvFile"
        );


    const message =
        document.getElementById(
            "csvMessage"
        );


    if (
        !fileInput ||
        !fileInput.files.length
    ) {

        alert(
            "Please select a CSV file."
        );

        return;
    }


    const file =
        fileInput.files[0];


    if (
        !file.name
            .toLowerCase()
            .endsWith(".csv")
    ) {

        alert(
            "Please select a CSV file."
        );

        return;
    }


    const formData =
        new FormData();


    formData.append(
        "file",
        file
    );


    try {

        const response =
            await fetch(
                "/api/applications/import/",
                {
                    method:
                        "POST",

                    credentials:
                        "same-origin",

                    body:
                        formData
                }
            );


        const data =
            await response.json();


        if (message) {

            message.textContent =
                data.message ||
                data.error ||
                "Import completed.";
        }


        if (response.ok) {

            await loadApplications();
        }


    } catch (error) {

        console.error(
            "CSV Error:",
            error
        );


        if (message) {

            message.textContent =
                "Unable to import CSV.";
        }
    }
}


// ==========================================
// LOGOUT
// ==========================================

async function logoutUser() {

    try {

        await fetch(
            "/api/logout/",
            {
                method:
                    "POST",

                credentials:
                    "same-origin"
            }
        );

    } catch (error) {

        console.error(
            "Logout Error:",
            error
        );
    }


    window.location.href =
        "/login.html";
}


// ==========================================
// ESCAPE HTML
// ==========================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";
    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );
}


// ==========================================
// CLOSE MODALS BY CLICKING OUTSIDE
// ==========================================

window.addEventListener(
    "click",
    function (event) {

        const applicationModal =
            document.getElementById(
                "applicationModal"
            );


        const csvModal =
            document.getElementById(
                "csvModal"
            );


        const skillMatchModal =
            document.getElementById(
                "skillMatchModal"
            );


        const journeyModal =
            document.getElementById(
                "journeyModal"
            );


        if (
            event.target ===
            applicationModal
        ) {

            closeModal();
        }


        if (
            event.target ===
            csvModal
        ) {

            closeCSVModal();
        }


        if (
            event.target ===
            skillMatchModal
        ) {

            closeSkillMatch();
        }


        if (
            event.target ===
            journeyModal
        ) {

            closeJourneyModal();
        }

    }
);