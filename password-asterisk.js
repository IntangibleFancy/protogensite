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
    });

    passwordInput.addEventListener('keydown', function (e) {
        if (e.key === 'Backspace' && value.length > 0) {
            value = value.slice(0, -1);
        }
    });

    // On form submit, copy the real value to the hidden input
    passwordInput.form.addEventListener('submit', function () {
        realPassword.value = value;
    });
});
