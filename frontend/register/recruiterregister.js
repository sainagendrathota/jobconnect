document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const companyname = document.getElementById('companyname').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const showMessage = (message, type = 'error') => {
        const messageBox = document.getElementById('message-box');
        const messageText = document.getElementById('message-text');

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

    if (password !== confirmPassword) {
        showMessage('Passwords do not match.', 'error');
        return;
    }

    const data = {
        companyname,
        email,
        password
    };

    try {
        const response = await fetch('http://localhost:5000/auth/recruiterregister', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            showMessage('Successfully registered!', 'success');
            setTimeout(() => {
                window.location.href = '../login/login.html';
            }, 1000);
        } else {
            showMessage(result.msg || 'Registration failed. Please try again.', 'error');
        }

    } catch (error) {
        console.error('Error:', error);
        showMessage('Something went wrong. Please try again later.', 'error');
    }
});
