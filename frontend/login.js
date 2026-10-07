// ==========================================
// PLACERA - LOGIN JAVASCRIPT
// ==========================================


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener("DOMContentLoaded", async function () {

    const loginForm = document.getElementById("loginForm");

    if (!loginForm) {
        return;
    }


    // ==========================================
    // LOGIN FORM SUBMIT
    // ==========================================

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        // ==========================================
        // GET FORM VALUES
        // ==========================================

        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");

        const email = emailInput.value.trim();
        const password = passwordInput.value;


        // ==========================================
        // VALIDATION
        // ==========================================

        if (!email) {

            alert("Please enter your email.");

            emailInput.focus();

            return;
        }


        if (!password) {

            alert("Please enter your password.");

            passwordInput.focus();

            return;
        }


        // ==========================================
        // LOGIN REQUEST
        // ==========================================

        try {

            const response = await fetch("/api/login/", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                credentials: "same-origin",

                body: JSON.stringify({
                    email: email,
                    password: password
                })

            });


            // ==========================================
            // READ RESPONSE
            // ==========================================

            let data = {};

            try {

                data = await response.json();

            } catch (error) {

                console.error(
                    "Could not read server response:",
                    error
                );

            }


            // ==========================================
            // LOGIN FAILED
            // ==========================================

            if (!response.ok) {

                alert(
                    data.error ||
                    data.message ||
                    "Invalid email or password."
                );

                return;
            }


            // ==========================================
            // LOGIN SUCCESSFUL
            // ==========================================

            console.log("Login successful.");

            console.log("User session created.");


            // Small delay so Django session cookie
            // is properly stored before navigation

            setTimeout(function () {

                window.location.href = "/profile.html";

            }, 200);


        } catch (error) {

            console.error(
                "Login error:",
                error
            );

            alert(
                "Unable to connect to the server. " +
                "Please make sure Django server is running."
            );

        }

    });

});