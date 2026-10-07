// ==========================================
// PLACERA - LANDING PAGE JAVASCRIPT
// ==========================================


// ==========================================
// GET STARTED / START NOW
// ==========================================

function goToProfile() {

    console.log("Opening Profile...");

    window.location.href = "/profile.html";

}


// ==========================================
// SMOOTH SCROLLING
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(function (link) {

        link.addEventListener("click", function (event) {

            const targetId = this.getAttribute("href");

            if (targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (target) {

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth"
                });

            }

        });

    });

});