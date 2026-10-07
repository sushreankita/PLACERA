// ===============================
// PLACERA DASHBOARD
// ===============================

let applications = [];


// ===============================
// LOAD DASHBOARD
// ===============================

async function loadDashboard() {

    try {

        // Load student profile
        const studentResponse = await fetch("/api/student/");

        if (studentResponse.status === 401) {
            window.location.href = "/login.html";
            return;
        }

        if (studentResponse.ok) {

            const student = await studentResponse.json();

            document.getElementById("studentName").textContent =
                student.name || "Student";
        }


        // Load applications
        const applicationResponse =
            await fetch("/api/applications/");

        if (applicationResponse.status === 401) {
            window.location.href = "/login.html";
            return;
        }

        if (!applicationResponse.ok) {
            throw new Error("Unable to load applications.");
        }

        applications = await applicationResponse.json();

        console.log("Dashboard applications:", applications);


        // Update dashboard
        updateStatistics();
        updateStatusOverview();
        updateProgress();
        displayRecentApplications();

    } catch (error) {

        console.error("Dashboard error:", error);

        showDashboardError();
    }
}


// ===============================
// STATISTICS
// ===============================

function updateStatistics() {

    const total = applications.length;

    const interviews = applications.filter(
        app => app.status === "Interview"
    ).length;

    const offers = applications.filter(
        app => app.status === "Offer"
    ).length;

    const rejected = applications.filter(
        app => app.status === "Rejected"
    ).length;


    document.getElementById("totalApplications").textContent =
        total;

    document.getElementById("totalInterviews").textContent =
        interviews;

    document.getElementById("totalOffers").textContent =
        offers;

    document.getElementById("totalRejected").textContent =
        rejected;
}


// ===============================
// STATUS OVERVIEW
// ===============================

function updateStatusOverview() {

    const applied = applications.filter(
        app => app.status === "Applied"
    ).length;

    const interview = applications.filter(
        app => app.status === "Interview"
    ).length;

    const offer = applications.filter(
        app => app.status === "Offer"
    ).length;

    const rejected = applications.filter(
        app => app.status === "Rejected"
    ).length;


    document.getElementById("appliedCount").textContent =
        applied;

    document.getElementById("interviewCount").textContent =
        interview;

    document.getElementById("offerCount").textContent =
        offer;

    document.getElementById("rejectedCount").textContent =
        rejected;
}


// ===============================
// PLACEMENT PROGRESS
// ===============================

function updateProgress() {

    const total = applications.length;

    const interviews = applications.filter(
        app => app.status === "Interview"
    ).length;

    const offers = applications.filter(
        app => app.status === "Offer"
    ).length;


    document.getElementById("applicationStageCount").textContent =
        `${total} application${total !== 1 ? "s" : ""}`;


    document.getElementById("interviewStageCount").textContent =
        `${interviews} interview${interviews !== 1 ? "s" : ""}`;


    document.getElementById("offerStageCount").textContent =
        `${offers} offer${offers !== 1 ? "s" : ""}`;


    // Progress calculation
    let progress = 0;

    if (total > 0) {

        /*
            Applications = 25%
            Interviews  = 50%
            Offer       = 100%
        */

        if (offers > 0) {

            progress = 100;

        } else if (interviews > 0) {

            progress = 50;

        } else {

            progress = 25;
        }
    }


    document.getElementById("progressPercentage").textContent =
        `${progress}%`;

    document.getElementById("progressFill").style.width =
        `${progress}%`;
}


// ===============================
// RECENT APPLICATIONS
// ===============================

function displayRecentApplications() {

    const container =
        document.getElementById("recentApplications");


    if (!container) {
        return;
    }


    if (applications.length === 0) {

        container.innerHTML = `
            <tr>
                <td colspan="4" class="empty-cell">
                    No applications yet.
                    Start tracking your placement journey!
                </td>
            </tr>
        `;

        return;
    }


    // Sort newest first
    const recentApplications = [...applications]
        .sort(function (a, b) {

            return new Date(b.applied_date || b.date)
                - new Date(a.applied_date || a.date);

        })
        .slice(0, 5);


    container.innerHTML = "";


    recentApplications.forEach(function (application) {

        const row = document.createElement("tr");


        const date =
            application.applied_date ||
            application.date ||
            "-";


        const formattedDate =
            formatDate(date);


        const status =
            application.status || "Applied";


        const statusClass =
            status.toLowerCase();


        row.innerHTML = `

            <td>
                <strong>
                    ${escapeHTML(application.company || "-")}
                </strong>
            </td>

            <td>
                ${escapeHTML(application.role || "-")}
            </td>

            <td>
                ${formattedDate}
            </td>

            <td>

                <span class="status-badge ${statusClass}">
                    ${escapeHTML(status)}
                </span>

            </td>
        `;


        container.appendChild(row);

    });
}


// ===============================
// DATE FORMAT
// ===============================

function formatDate(dateString) {

    if (!dateString) {
        return "-";
    }


    const date = new Date(dateString);


    if (isNaN(date.getTime())) {
        return dateString;
    }


    return date.toLocaleDateString("en-IN", {

        day: "2-digit",

        month: "short",

        year: "numeric"

    });
}


// ===============================
// HTML SAFETY
// ===============================

function escapeHTML(value) {

    const div = document.createElement("div");

    div.textContent = value;

    return div.innerHTML;
}


// ===============================
// ERROR MESSAGE
// ===============================

function showDashboardError() {

    const container =
        document.getElementById("recentApplications");


    if (!container) {
        return;
    }


    container.innerHTML = `
        <tr>
            <td colspan="4" class="empty-cell">
                Unable to load dashboard data.
                Please refresh the page.
            </td>
        </tr>
    `;
}


// ===============================
// LOGOUT
// ===============================

async function logout() {

    try {

        await fetch("/api/logout/", {
            method: "POST"
        });

    } catch (error) {

        console.error("Logout error:", error);

    }


    window.location.href = "/login.html";
}


// ===============================
// START DASHBOARD
// ===============================

document.addEventListener(
    "DOMContentLoaded",
    loadDashboard
);