
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const roleSelect = document.getElementById('role');
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
    const urlParams = new URLSearchParams(window.location.search);
    const roleParam = urlParams.get('role');
    if (roleParam) {
        const optionExists = Array.from(roleSelect.options).some(option => option.value === roleParam);
        if (optionExists) {
            roleSelect.value = roleParam;
        }
    }

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); 

        messageBox.classList.add('hidden'); 

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = roleSelect.value;
        if (!email || !password || !role) {
            displayMessage('Please fill in all fields.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password, role })
            });

            const data = await response.json();

            if (response.ok) {
                displayMessage(data.msg, 'Successfullt logged in!');
                setTimeout(() => {
                    if (role === 'jobseeker') {
                        window.location.href = `../dashboard/jobseekerdash.html?email=${encodeURIComponent(email)}`;
                    } else if (role === 'recruiter') {
                    window.location.href=`../dashboard/recruiterdash.html?email=${encodeURIComponent(email)}`;

                    }
                }, 1500);
            } else {
                displayMessage(data.msg || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            displayMessage('An unexpected error occurred. Please try again later.');
        }
    });
});
