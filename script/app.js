// Set a cookie with the specified name, value, and expiration days
function setCookie(name, value, days) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + d.toUTCString();
    document.cookie = `${name}=${value};${expires};path=/`;
}

function showPopup(message) {
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.innerText = message;

    document.body.appendChild(popup);

    setTimeout(() => popup.classList.add('show'), 10); // Show pop-up
    setTimeout(() => popup.classList.remove('show'), 2000); // Fade-out after 2s
    setTimeout(() => popup.remove(), 3000); // Remove from DOM after animation
}

function showPopup(message) {
    // Create pop-up element
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.innerText = message;

    // Add pop-up to the body
    document.body.appendChild(popup);

    // Animate the pop-up fade-in and fade-out
    setTimeout(() => popup.classList.add('show'), 10);  // Delay for CSS transition
    setTimeout(() => popup.classList.remove('show'), 2000); // Show for 2s, then fade-out
    setTimeout(() => popup.remove(), 3000);  // Remove from DOM after animation completes
}

// Example usage: call showPopup() when a point is added
function incrementCounter() {
    // Assume logic to increment the counter here
    showPopup("Point added!");  // Call pop-up with message
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
    const correctPassword = 'password'; // Replace with actual password

    if (passwordInput && passwordInput.value === correctPassword) {
        setCookie("accessGranted", "true", 7); // Cookie lasts for 7 days
        document.getElementById('password-overlay').style.display = 'none';
        document.body.style.overflow = 'auto'; // Enable scroll
    } else if (errorMessage) {
        errorMessage.style.display = 'block';
    }
}

// Check if access cookie is set
function checkAccess() {
    const accessGranted = getCookie("accessGranted");
    const overlay = document.getElementById('password-overlay');
    if (accessGranted === "true" && overlay) {
        overlay.style.display = 'none';
        document.body.style.overflow = 'auto'; // Enable scroll
    }
}

// Call checkAccess on page load
document.addEventListener("DOMContentLoaded", checkAccess);

// Preloader
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        preloader.style.display = 'none';
    }
});

particlesJS.load('particles-js', 'assets/particles.json', function() {
  console.log('callback - particles.js config loaded');
});
