// ==========================================
// PLACERA - ANALYSIS
// ==========================================

let applications = [];
let student = null;


// ==========================================
// LOAD ANALYSIS
// ==========================================

async function loadAnalysis() {

    try {

        // Load applications
        const applicationsResponse = await fetch("/api/applications/");

        if (!applicationsResponse.ok) {
            throw new Error("Unable to load applications.");
        }

        applications = await applicationsResponse.json();


        // Load student profile
        const studentResponse = await fetch("/api/student/");

        if (studentResponse.ok) {
            student = await studentResponse.json();
        }


        // Display all analysis
        displayOverview();
        displayPerformance();
        displayWeaknessAnalysis();
        displaySkills();
        displayImprovementSuggestions();
        displayApplicationJourney();


        // Hide loading
        const loading = document.getElementById("loadingMessage");

        if (loading) {
            loading.style.display = "none";
        }

    } catch (error) {

        console.error("Analysis Error:", error);

        const loading = document.getElementById("loadingMessage");

        if (loading) {
            loading.style.display = "none";
        }

        showError("Unable to load analysis data from Django.");
    }
}


// ==========================================
// OVERVIEW
// ==========================================

function displayOverview() {

    const total = applications.length;


    const interviews = applications.filter(function (app) {

        return (
            app.status === "Interview" ||
            app.stage === "Technical" ||
            app.stage === "HR"
        );

    }).length;


    const offers = applications.filter(function (app) {

        return (
            app.status === "Offer" ||
            app.stage === "Offer"
        );

    }).length;


    const rejected = applications.filter(function (app) {

        return app.status === "Rejected";

    }).length;


    const applied = applications.filter(function (app) {

        return app.status === "Applied";

    }).length;


    setText("totalApplications", total);
    setText("totalInterviews", interviews);
    setText("totalOffers", offers);
    setText("totalRejected", rejected);
    setText("appliedCount", applied);
    setText("interviewCount", interviews);
    setText("offerCount", offers);
    setText("rejectedCount", rejected);
}


// ==========================================
// PERFORMANCE
// ==========================================

function displayPerformance() {

    const total = applications.length;


    const interviews = applications.filter(function (app) {

        return (
            app.status === "Interview" ||
            app.stage === "Technical" ||
            app.stage === "HR"
        );

    }).length;


    const offers = applications.filter(function (app) {

        return (
            app.status === "Offer" ||
            app.stage === "Offer"
        );

    }).length;


    const interviewRate = total > 0
        ? Math.round((interviews / total) * 100)
        : 0;


    const offerRate = total > 0
        ? Math.round((offers / total) * 100)
        : 0;


    setText("interviewRate", interviewRate + "%");
    setText("offerRate", offerRate + "%");


    const interviewProgress =
        document.getElementById("interviewProgress");

    const offerProgress =
        document.getElementById("offerProgress");


    if (interviewProgress) {
        interviewProgress.style.width = interviewRate + "%";
    }


    if (offerProgress) {
        offerProgress.style.width = offerRate + "%";
    }
}


// ==========================================
// WEAKNESS ANALYSIS
// ==========================================

function displayWeaknessAnalysis() {

    const container =
        document.getElementById("rejectionReasons");


    if (!container) {
        return;
    }


    const rejectedApplications =
        applications.filter(function (app) {

            return app.status === "Rejected";

        });


    container.innerHTML = "";


    // No rejection data
    if (rejectedApplications.length === 0) {

        container.innerHTML = `
            <div class="empty-analysis">
                No rejection data available yet.
                Keep tracking your applications.
            </div>
        `;


        setText(
            "weaknessTitle",
            "No major weakness identified yet"
        );


        setText(
            "weaknessDescription",
            "Once you record rejected applications with rejection reasons, PLACERA will identify your common weak areas."
        );


        return;
    }


    // Count rejection reasons
    const reasons = {};


    rejectedApplications.forEach(function (app) {

        const reason =
            app.rejection_reason || "Other";


        reasons[reason] =
            (reasons[reason] || 0) + 1;

    });


    // Sort reasons
    const sortedReasons =
        Object.entries(reasons).sort(function (a, b) {

            return b[1] - a[1];

        });


    const total =
        rejectedApplications.length;


    // Display reasons
    sortedReasons.forEach(function ([reason, count]) {

        const percentage =
            Math.round((count / total) * 100);


        const item =
            document.createElement("div");


        item.className = "weakness-item";


        item.innerHTML = `
            
            <div>
                <strong>${reason}</strong>

                <span>
                    ${count} rejection${count > 1 ? "s" : ""}
                </span>
            </div>

            <div class="weakness-bar">

                <div
                    class="weakness-progress"
                    style="width: ${percentage}%">
                </div>

            </div>

            <small>
                ${percentage}% of your rejections
            </small>

        `;


        container.appendChild(item);

    });


    // Main weakness
    const mainWeakness =
        sortedReasons[0];


    if (mainWeakness) {

        setText(
            "weaknessTitle",
            "Main Focus Area: " + mainWeakness[0]
        );


        setText(
            "weaknessDescription",
            getWeaknessDescription(mainWeakness[0])
        );

    }
}


// ==========================================
// WEAKNESS DESCRIPTION
// ==========================================

function getWeaknessDescription(reason) {

    if (reason === "Coding") {

        return "Your rejection data shows difficulty at the coding stage. Focus on DSA, problem-solving and regular coding practice.";

    }


    if (reason === "Aptitude") {

        return "Practice quantitative, logical and verbal aptitude questions regularly.";

    }


    if (reason === "Technical Interview") {

        return "Revise core technical concepts and practice explaining your projects clearly.";

    }


    if (reason === "HR") {

        return "Work on communication, self-introduction and common HR interview questions.";

    }


    if (reason === "Resume") {

        return "Improve your resume by highlighting relevant projects, skills, internships and achievements.";

    }


    if (reason === "Eligibility") {

        return "Review placement eligibility requirements such as CGPA, degree and graduation year.";

    }


    return "Review your recent rejection and identify what can be improved before your next application.";
}


// ==========================================
// SKILL ANALYSIS
// ==========================================

function displaySkills() {

    const container =
        document.getElementById("skillsList");


    if (!container) {
        return;
    }


    container.innerHTML = "";


    if (!student) {

        container.innerHTML = `
            <div class="empty-analysis">
                Unable to load your skills.
            </div>
        `;

        return;
    }


    // Skill level
    const skillLevel =
        student.skill_level || "Not specified";


    setText("skillLevel", skillLevel);


    // Get skills
    const skillsText =
        student.skills || "";


    if (!skillsText.trim()) {

        container.innerHTML = `
            <div class="empty-analysis">
                No skills added yet.
            </div>
        `;

        return;
    }


    const skills =
        skillsText
            .split(",")
            .map(function (skill) {
                return skill.trim();
            })
            .filter(Boolean);


    skills.forEach(function (skill) {

        const skillItem =
            document.createElement("div");


        skillItem.className = "skill-item";


        skillItem.textContent = skill;


        container.appendChild(skillItem);

    });
}


// ==========================================
// IMPROVEMENT SUGGESTIONS
// ==========================================

function displayImprovementSuggestions() {

    const container =
        document.getElementById("suggestionsContainer");


    if (!container) {
        return;
    }


    const suggestions = [];


    // ==========================================
    // REJECTION BASED SUGGESTIONS
    // ==========================================

    const rejectionReasons =
        applications
            .filter(function (app) {

                return app.status === "Rejected";

            })
            .map(function (app) {

                return app.rejection_reason;

            })
            .filter(Boolean);


    const uniqueReasons =
        [...new Set(rejectionReasons)];


    uniqueReasons.forEach(function (reason) {

        let suggestion = "";


        if (reason === "Coding") {

            suggestion =
                "Practice coding problems, DSA and problem-solving regularly.";

        }


        else if (reason === "Aptitude") {

            suggestion =
                "Practice quantitative, logical and verbal aptitude questions.";

        }


        else if (reason === "Technical Interview") {

            suggestion =
                "Revise core technical concepts and practice explaining your projects.";

        }


        else if (reason === "HR") {

            suggestion =
                "Practice HR questions, communication and self-introduction.";

        }


        else if (reason === "Resume") {

            suggestion =
                "Improve your resume by highlighting relevant projects, skills and internships.";

        }


        else if (reason === "Eligibility") {

            suggestion =
                "Review placement eligibility requirements such as CGPA, degree and graduation year.";

        }


        else {

            suggestion =
                "Review your recent rejection and identify what can be improved before your next application.";

        }


        suggestions.push({
            title: reason,
            text: suggestion
        });

    });


    // ==========================================
    // APPLICATION COUNT
    // ==========================================

    if (applications.length === 0) {

        suggestions.push({

            title: "Start Tracking",

            text:
                "Add your placement applications to start analyzing your performance."

        });

    }


    else if (applications.length < 5) {

        suggestions.push({

            title: "Track More Applications",

            text:
                "Continue adding applications so PLACERA can identify stronger performance patterns."

        });

    }


    // ==========================================
    // INTERVIEW PREPARATION
    // ==========================================

    const interviewCount =
        applications.filter(function (app) {

            return (
                app.status === "Interview" ||
                app.stage === "Technical" ||
                app.stage === "HR"
            );

        }).length;


    if (interviewCount > 0) {

        suggestions.push({

            title: "Interview Preparation",

            text:
                "Prepare technical, coding and HR questions for your upcoming interview stages."

        });

    }


    // ==========================================
    // SKILL SUGGESTION
    // ==========================================

    if (student && !student.skills) {

        suggestions.push({

            title: "Add Your Skills",

            text:
                "Complete your skills section so PLACERA can help identify skill gaps."

        });

    }


    // ==========================================
    // DEFAULT
    // ==========================================

    if (suggestions.length === 0) {

        suggestions.push({

            title: "Keep Improving",

            text:
                "Continue developing your technical skills and tracking your placement journey."

        });

    }


    // ==========================================
    // DISPLAY
    // ==========================================

    container.innerHTML = "";


    suggestions.forEach(function (suggestion) {

        const card =
            document.createElement("div");


        card.className =
            "suggestion-card";


        card.innerHTML = `

            <div class="suggestion-icon">
                💡
            </div>

            <div>

                <h3>
                    ${suggestion.title}
                </h3>

                <p>
                    ${suggestion.text}
                </p>

            </div>

        `;


        container.appendChild(card);

    });
}


// ==========================================
// APPLICATION JOURNEY
// ==========================================

function displayApplicationJourney() {

    const stages = {

        "Applied": 0,

        "Shortlisted": 0,

        "Assessment": 0,

        "Technical": 0,

        "HR": 0,

        "Offer": 0

    };


    applications.forEach(function (app) {

        const stage =
            app.stage || "Applied";


        if (stages.hasOwnProperty(stage)) {

            stages[stage]++;

        }

    });


    setText(
        "journeyApplied",
        stages.Applied
    );


    setText(
        "journeyShortlisted",
        stages.Shortlisted
    );


    setText(
        "journeyAssessment",
        stages.Assessment
    );


    setText(
        "journeyTechnical",
        stages.Technical
    );


    setText(
        "journeyHR",
        stages.HR
    );


    setText(
        "journeyOffer",
        stages.Offer
    );
}


// ==========================================
// SET TEXT HELPER
// ==========================================

function setText(id, value) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent = value;

    }
}


// ==========================================
// ERROR
// ==========================================

function showError(message) {

    const error =
        document.getElementById("errorMessage");


    if (!error) {
        return;
    }


    error.textContent = message;

    error.style.display = "block";
}


// ==========================================
// LOGOUT
// ==========================================

async function logoutUser() {

    try {

        await fetch("/api/logout/", {
            method: "POST"
        });

    } catch (error) {

        console.error("Logout error:", error);

    }


    window.location.href = "/login.html";
}


// ==========================================
// START
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    loadAnalysis
);