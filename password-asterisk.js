// This script replaces the password field with a text field that displays asterisks (*) for each character typed, while keeping the real value hidden in a variable and syncing it on submit.

document.addEventListener('DOMContentLoaded', function () {
    const passwordInput = document.getElementById('password');
    if (!passwordInput) return;

    // Create a hidden input to store the real password
    const realPassword = document.createElement('input');
    realPassword.type = 'hidden';
    realPassword.name = passwordInput.name;
    passwordInput.removeAttribute('name');
    passwordInput.parentNode.insertBefore(realPassword, passwordInput.nextSibling);

    let value = '';

    // Password validation elements
    const lengthCheck = document.getElementById('length-check');
    const numberCheck = document.getElementById('number-check');
    const stacheBtn = document.getElementById('stache-btn');

    let isValidLength = false;
    let hasNumber = false;

    function validatePassword(password) {
        // Check length (12+ characters)
        isValidLength = password.length >= 12;
        if (isValidLength) {
            lengthCheck.classList.add('valid');
        } else {
            lengthCheck.classList.remove('valid');
        }

        // Check for at least one number
        hasNumber = /\d/.test(password);
        if (hasNumber) {
            numberCheck.classList.add('valid');
        } else {
            numberCheck.classList.remove('valid');
        }

        // Update button state
        updateButtonState();
    }

    function updateButtonState() {
        if (isValidLength && hasNumber) {
            stacheBtn.disabled = false;
            stacheBtn.style.opacity = '1';
            stacheBtn.style.cursor = 'pointer';
        } else {
            stacheBtn.disabled = true;
            stacheBtn.style.opacity = '0.5';
            stacheBtn.style.cursor = 'not-allowed';
        }
    }

    // Initial button state
    updateButtonState();

    passwordInput.addEventListener('input', function (e) {
        const input = e.target;
        const newValue = input.value;
        // Figure out what changed
        if (newValue.length < value.length) {
            // Character(s) deleted
            value = value.slice(0, newValue.length);
        } else {
            // Character(s) added
            value += newValue.slice(value.length);
        }
        input.value = '*'.repeat(value.length);
        realPassword.value = value;
        
        // Validate password
        validatePassword(value);
    });

    passwordInput.addEventListener('keydown', function (e) {
        if (e.key === 'Backspace' && value.length > 0) {
            value = value.slice(0, -1);
        }
    });

    // On form submit, copy the real value to the hidden input
    passwordInput.form.addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent default form submission
        
        if (isValidLength && hasNumber) {
            realPassword.value = value;
            // Navigate to about page if validation passes
            window.location.href = 'about.html';
        } else {
            // Optionally show an error message or just do nothing
            console.log('Validation criteria not met');
        }
    });
});
