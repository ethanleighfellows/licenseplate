// app.js

// Password functionality
function checkPassword() {
    const passwordInput = document.getElementById('password-input');
    const errorMessage = document.getElementById('password-error');
    const correctPassword = 'yourPasswordHere'; // Replace with actual password

    if (passwordInput.value === correctPassword) {
        document.getElementById('password-overlay').style.display = 'none';
        document.body.style.overflow = 'auto'; // Enable scroll
    } else {
        errorMessage.style.display = 'block';
    }
}

// Preloader
window.addEventListener('load', function() {
    const preloader = document.getElementById('preloader');
    preloader.style.display = 'none';
});

// Particles.js Background
particlesJS.load('particles-js', 'particles.json', function() {
    console.log('Particles.js loaded');
});
