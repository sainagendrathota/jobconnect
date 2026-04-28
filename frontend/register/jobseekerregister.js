

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const username = document.getElementById('username');
    const phonenumber = document.getElementById('phonenumber');
    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message-text');

    const displayMessage = (message, type = 'error') => {
        messageText.textContent = message;
        messageBox.classList.remove('hidden');
        if (type === 'error') {
            messageBox.classList.remove('bg-green-100', 'border-green-400', 'text-green-700');
            messageBox.classList.add('bg-red-100', 'border-red-400', 'text-red-700');
        } else {
            messageBox.classList.remove('bg-red-100', 'border-red-400', 'text-red-700');
            messageBox.classList.add('bg-green-100', 'border-green-400', 'text-green-700');
        }
    };

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        messageBox.classList.add('hidden');

        const name = username.value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value.trim();
        const confirmPassword = document.getElementById('confirm-password').value.trim();
        const phone = phonenumber.value.trim();

        if (!name || !email || !password || !confirmPassword || !phone) {
            displayMessage('Please fill in all fields.');
            return;
        }

        if (password !== confirmPassword) {
            displayMessage('Passwords do not match.');
            return;
        }

        if (password.length < 6) {
            displayMessage('Password must be at least 6 characters long.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/auth/jobregister', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: name, email, password, phonenumber: phone })
            });

            const data = await response.json();

            if (response.ok) {
                displayMessage(data.message || 'Registered successfully!', 'success');
                setTimeout(() => {
                    window.location.href = '../login/login.html';
                }, 2000);
            } else {
                displayMessage(data.msg);
            }
        } catch (error) {
            console.error('Error during registration:', error);
            displayMessage('An unexpected error occurred. Please try again later.');
        }
    });
});
