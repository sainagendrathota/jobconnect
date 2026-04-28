

document.addEventListener('DOMContentLoaded', () => {
    const applicantsContainer = document.getElementById('applicants-container');
    const loadingApplicants = document.getElementById('loading-applicants');
    const noApplicantsMessage = document.getElementById('no-applicants-message');

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
     const updateApplicationStatus = async (status, jobseekerEmail, jobId) => {
        try {
            const response = await fetch('http://localhost:5000/recruiter/update-applicant', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                    
                },
                body: JSON.stringify({ jobId,jobseekerEmail, status})
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message); 
                const urlParams = new URLSearchParams(window.location.search);
                const currentJobId = urlParams.get('jobId');
                fetchApplicants(currentJobId);
            } else {
                alert(data.message || 'Failed to update application status.');
            }
        } catch (error) {
            console.error('Error updating application status:', error);
            alert('An unexpected error occurred while updating status.');
        }
    };
 
    const fetchApplicants = async (jobId = '') => {
        applicantsContainer.innerHTML = ''; 
        loadingApplicants.classList.remove('hidden'); 
        noApplicantsMessage.classList.add('hidden'); 
        if (!jobId) {
            noApplicantsMessage.classList.remove('hidden');
            noApplicantsMessage.textContent = 'No job selected. Please go back to the recruiter dashboard and select a job to view applicants.';
            loadingApplicants.classList.add('hidden');
            return; 
        }

        try {
            const response = await fetch('http://localhost:5000/recruiter/get-applicants', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ jobId: jobId }) 
            });

            const data = await response.json();
            const applicants=data.applicants;
            loadingApplicants.classList.add('hidden'); 

            if (applicants.length === 0) {
                noApplicantsMessage.classList.remove('hidden');
                noApplicantsMessage.textContent = 'No applicants found for this job.';
            } else {
                applicants.forEach(applicant => {
                    const applicantCard = `
                        <div class="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
                            <h3 class="text-xl font-semibold text-indigo-700 mb-2">${applicant.jobseekerEmail}</h3>
                            <p class="text-gray-600 mb-1"><strong>Applied For:</strong> ${applicant.jobTitle}</p>
                            <p class="text-gray-600 mb-1"><strong>Application Date:</strong> ${new Date(applicant.appliedAt).toLocaleDateString()}</p>
                            <p class="text-gray-700 mt-3 text-sm leading-relaxed">
                                <strong>Resume:</strong> <a href="${applicant.resumeUrl}" target="_blank" class="text-blue-600 hover:underline">View Resume</a>
                            </p>
                            <p class="text-gray-700 text-sm leading-relaxed">
                                <strong>Cover Letter:</strong> ${applicant.coverLetter || 'N/A'}
                            </p>
                            <div class="mt-4 flex justify-end space-x-2">
                                <button class="shortlist-button px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition duration-300"
                                data-applicant-email="${applicant.jobseekerEmail}"
                                data-job-id="${applicant.jobId}"
                                data-status="shortlisted">Shortlist</button>
                                <button class="reject-button px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50 transition duration-300"
                                 data-applicant-email="${applicant.jobseekerEmail}"
                                 data-job-id="${applicant.jobId}" data-status="rejected" >Reject</button>
                            </div>
                        </div>
                    `;
                    applicantsContainer.insertAdjacentHTML('beforeend', applicantCard);
                });
                     document.querySelectorAll('.shortlist-button').forEach(button => {
                    button.addEventListener('click', (event) => {
                        const status = 'Accepted';
                        const jobseekerEmail = event.target.dataset.applicantEmail; 
                        const jobId = event.target.dataset.jobId; 
                        updateApplicationStatus(status, jobseekerEmail, jobId);
                    });
                });

                document.querySelectorAll('.reject-button').forEach(button => {
                    button.addEventListener('click', (event) => {
                        const status = 'Rejected'
                        const jobseekerEmail = event.target.dataset.applicantEmail; 
                        const jobId = event.target.dataset.jobId; 
                        updateApplicationStatus(status, jobseekerEmail, jobId);
                    });
                });
            }
        } catch (error) {
            console.error('Error fetching applicants:', error);
            loadingApplicants.classList.add('hidden');
            noApplicantsMessage.classList.remove('hidden');
            noApplicantsMessage.textContent = 'Failed to load applicants. Please try again later.';
        }
    };

    const urlParams = new URLSearchParams(window.location.search);
    const initialJobId = urlParams.get('jobId');
     const email = urlParams.get('email');
       document.getElementById('gotorecruiterdash')?.addEventListener('click', () => {
  window.location.href = `./recruiterdash.html?email=${email}`;
});
    console.log(initialJobId);;
    fetchApplicants(initialJobId);
});
