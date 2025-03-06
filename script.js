function signup() {
    let name = document.getElementById("nameInput").value.trim();
    let email = document.getElementById("emailInput").value.trim();
    let password = document.getElementById("passwordInput").value.trim();
    let recaptchaResponse = grecaptcha.getResponse();

    if (!recaptchaResponse) {
        alert("Please complete the reCAPTCHA to verify you are human.");
        return;
    }

    if (!validateEmail(email) || !validatePassword(password)) {
        alert("Invalid email or password format.");
        return;
    }

    let user = {
        name: name,
        email: email,
        password: password
    };

    localStorage.setItem("user", JSON.stringify(user));
    console.log("User stored:", localStorage.getItem("user"));
    alert("Signup successful! You can now log in.");

    document.getElementById("nameInput").value = "";
    document.getElementById("emailInput").value = "";
    document.getElementById("passwordInput").value = "";
    grecaptcha.reset();

    toggleMode(true);
}

function login() {
    let email = document.getElementById("emailInput").value.trim();
    let password = document.getElementById("passwordInput").value.trim();

    let storedUser = localStorage.getItem("user");

    if (!storedUser) {
        alert("No user found! Please sign up first.");
        return;
    }

    storedUser = JSON.parse(storedUser);

    if (storedUser.email === email && storedUser.password === password) {
        alert("Login successful! Welcome, " + storedUser.name);
        console.log("User logged in:", storedUser);
    } else {
        alert("Invalid credentials!");
    }
}

function validateEmail(email) {
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 8;
}

// Function to toggle between Sign In and Sign Up modes
function toggleMode(isSignIn) {
    let nameField = document.getElementById("nameField");
    let title = document.getElementById("title");
    let signupBtn = document.getElementById("signupBtn");
    let signinBtn = document.getElementById("signinBtn");
    let recaptcha = document.getElementById("recaptcha");

    if (isSignIn) {
        nameField.style.maxHeight = "0";
        title.innerHTML = "Sign In";
        signupBtn.classList.add("disable");
        signinBtn.classList.remove("disable");
        recaptcha.style.display = "none";
    } else {
        nameField.style.maxHeight = "60px";
        title.innerHTML = "Sign Up";
        signupBtn.classList.remove("disable");
        signinBtn.classList.add("disable");
        recaptcha.style.display = "block";
    }
}

// Make sure signup and login functions are not affected
document.getElementById("signupBtn").addEventListener("click", signup);
document.getElementById("signinBtn").addEventListener("click", login);

const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

app.post("/verify-recaptcha", async (req, res) => {
    const secretKey = "6LdBAusqAAAAAOM1YCB3zI7vaj4q4HHqJMpY3Ylh";
    const { recaptchaResponse } = req.body;

    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
        params: {
            secret: secretKey,
            response: recaptchaResponse
        }
    });

    if (response.data.success) {
        res.json({ success: true, message: "reCAPTCHA verified!" });
    } else {
        res.json({ success: false, message: "reCAPTCHA failed!" });
    }
});

app.listen(3000, () => console.log("Server running on port 3000"));
