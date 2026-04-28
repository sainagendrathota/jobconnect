document.addEventListener('DOMContentLoaded', () => {
    const applicationsContainer = document.getElementById('applications-container');
    const loadingApplications = document.getElementById('loading-applications');
    const noApplicationsMessage = document.getElementById('no-applications-message');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMobileMenuButton = document.getElementById('close-mobile-menu');

    if (mobileMenuButton && mobileMenu && closeMobileMenuButton) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.remove('hidden');
        });

        closeMobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    }

    const logoutButton = document.getElementById('logout-button');
    const logoutButtonMobile = document.getElementById('logout-button-mobile');

    const handleLogout = () => {
        alert('You have been logged out.');
        window.location.href = '/joblink/frontend/landingpage.html';
    };

    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }
    if (logoutButtonMobile) {
        logoutButtonMobile.addEventListener('click', handleLogout);
    }

    const fetchMyApplications = async (jobseekerEmail, jobId = '') => {
        applicationsContainer.innerHTML = '';
        loadingApplications.classList.remove('hidden');
        noApplicationsMessage.classList.add('hidden');

        if (!jobseekerEmail) {
            noApplicationsMessage.classList.remove('hidden');
            noApplicationsMessage.textContent = 'Job seeker email not found. Please log in again.';
            loadingApplications.classList.add('hidden');
            return;
        }

        try {
            const requestBody = {
                jobseekerEmail: jobseekerEmail
            };

            const response = await fetch('http://localhost:5000/jobseeker/my-applications', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();
            const applications = data.applications;
            loadingApplications.classList.add('hidden');

            if (applications.length === 0) {
                noApplicationsMessage.classList.remove('hidden');
                noApplicationsMessage.textContent = 'You haven\'t applied for any jobs yet.';
            } else {
                applications.forEach(app => {
                    const applicationCard = `
                        <div class="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
                            <h3 class="text-xl font-semibold text-indigo-700 mb-2">Applied for: ${app.jobTitle}</h3>
                            <p class="text-gray-600 mb-1"><strong>Company:</strong> ${app.jobCompany || 'N/A'}</p>
                            <p class="text-gray-600 mb-1"><strong>Application Date:</strong> ${new Date(app.applicationDate).toLocaleDateString()}</p>
                            <p class="text-gray-600 mb-1"><strong>Status:</strong> <span class="font-semibold ${app.status === 'Accepted' ? 'text-green-600' : app.status === 'Rejected' ? 'text-red-600' : 'text-yellow-600'}">${app.status.charAt(0).toUpperCase() + app.status.slice(1)}</span></p>
                        </div>
                    `;
                    applicationsContainer.insertAdjacentHTML('beforeend', applicationCard);
                });
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
            loadingApplications.classList.add('hidden');
            noApplicationsMessage.classList.remove('hidden');
            noApplicationsMessage.textContent = 'Failed to load your applications. Please try again later.';
        }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const jobseekerEmail = urlParams.get('email');
    document.getElementById('gotodash')?.addEventListener('click', () => {
        window.location.href = `./jobseekerdash.html?email=${jobseekerEmail}`;
    });

    fetchMyApplications(jobseekerEmail);
});
