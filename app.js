// app.js

// Set a cookie with the specified name, value, and expiration days
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Get the value of a cookie by name
function getCookie(name) {
    const nameEQ = name + "=";
    const cookiesArray = document.cookie.split(';');
    for (let i = 0; i < cookiesArray.length; i++) {
        let cookie = cookiesArray[i].trim();
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
}

// Check password and set cookie if correct
function checkPassword() {
    const passwordInput = document.getElementById('password-input');
    const errorMessage = document.getElementById('password-error');
    const correctPassword = 'yourPasswordHere'; // Replace with actual password

    if (passwordInput.value === correctPassword) {
        setCookie("accessGranted", "true", 7); // Cookie lasts for 7 days
        document.getElementById('password-overlay').style.display = 'none';
        document.body.style.overflow = 'auto'; // Enable scroll
    } else {
        errorMessage.style.display = 'block';
    }
}

// Check if access cookie is set
function checkAccess() {
    const accessGranted = getCookie("accessGranted");
    if (accessGranted === "true") {
        document.getElementById('password-overlay').style.display = 'none';
        document.body.style.overflow = 'auto'; // Enable scroll
    }
}

// Call checkAccess on page load
document.addEventListener("DOMContentLoaded", checkAccess);

// Preloader
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    preloader.style.display = 'none';
});

// Particles.js Background
particlesJS.load('particles-js', 'particles.json', function() {
    console.log('Particles.js loaded');
});
