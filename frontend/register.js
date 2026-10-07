// ==========================================
// PLACERA - REGISTER JAVASCRIPT
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    const registerForm = document.getElementById("registerForm");

    if (!registerForm) {
        console.error("Register form not found.");
        return;
    }


    // ==========================================
    // REGISTER FORM SUBMIT
    // ==========================================

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();


        // ==========================================
        // GET FORM VALUES
        // ==========================================

        const nameInput =
            document.getElementById("fullName");

        const emailInput =
            document.getElementById("email");

        const passwordInput =
            document.getElementById("password");

        const confirmPasswordInput =
            document.getElementById("confirmPassword");


        const name =
            nameInput.value.trim();

        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value;

        const confirmPassword =
            confirmPasswordInput.value;


        // ==========================================
        // VALIDATION
        // ==========================================

        if (!name) {

            alert("Please enter your full name.");

            nameInput.focus();

            return;
        }


        if (!email) {

            alert("Please enter your email.");

            emailInput.focus();

            return;
        }


        if (!password) {

            alert("Please enter a password.");

            passwordInput.focus();

            return;
        }


        if (password.length < 6) {

            alert(
                "Password must be at least 6 characters."
            );

            passwordInput.focus();

            return;
        }


        if (!confirmPassword) {

            alert(
                "Please confirm your password."
            );

            confirmPasswordInput.focus();

            return;
        }


        if (password !== confirmPassword) {

            alert(
                "Passwords do not match."
            );

            confirmPasswordInput.focus();

            return;
        }


        // ==========================================
        // REGISTER BUTTON
        // ==========================================

        const registerButton =
            document.getElementById("registerButton");


        if (registerButton) {

            registerButton.disabled = true;

            registerButton.textContent =
                "Creating Account...";

        }


        // ==========================================
        // SEND DATA TO DJANGO
        // ==========================================

        try {

            const response = await fetch(
                "/api/register/",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    credentials: "same-origin",

                    body: JSON.stringify({

                        name: name,

                        email: email,

                        password: password,

                        confirm_password:
                            confirmPassword

                    })
                }
            );


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
            // REGISTRATION FAILED
            // ==========================================

            if (!response.ok) {

                alert(
                    data.error ||
                    data.message ||
                    "Registration failed. Please try again."
                );


                if (registerButton) {

                    registerButton.disabled = false;

                    registerButton.textContent =
                        "Create Account →";

                }

                return;
            }


            // ==========================================
            // REGISTRATION SUCCESS
            // ==========================================

            console.log(
                "Registration successful."
            );


            alert(
                data.message ||
                "Account created successfully!"
            );


            // ==========================================
            // GO TO LOGIN
            // ==========================================

            window.location.href =
                "/login.html";

        }


        // ==========================================
        // CONNECTION ERROR
        // ==========================================

        catch (error) {

            console.error(
                "Registration error:",
                error
            );


            alert(
                "Unable to connect to the server. " +
                "Please make sure Django server is running."
            );


            if (registerButton) {

                registerButton.disabled = false;

                registerButton.textContent =
                    "Create Account →";

            }

        }

    });

});