

document.addEventListener('DOMContentLoaded', () => {
    const postJobForm = document.getElementById('post-job-form');
    const postedJobsContainer = document.getElementById('posted-jobs-container');
    const loadingPostedJobs = document.getElementById('loading-posted-jobs');
    const noPostedJobs = document.getElementById('no-posted-jobs');
    const messageBox = document.getElementById('message-box');
    const messageText = document.getElementById('message-text');

  const params = new URLSearchParams(window.location.search);
  const email = params.get("email");
  console.log("Email:", email);
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

    
    const fetchPostedJobs = async () => {
        postedJobsContainer.innerHTML = ''; 
        loadingPostedJobs.classList.remove('hidden'); 
        noPostedJobs.classList.add('hidden'); 

  try {
   
    const response = await fetch(`http://localhost:5000/recruiter/get-alljobs?email=${encodeURIComponent(email)}`); 
    const data = await response.json();
    const jobs = data.joblist;
    console.log("Received data:", jobs);

    loadingPostedJobs.classList.add('hidden');

    if (jobs.length === 0) {
        noPostedJobs.classList.remove('hidden');
    } else {
        jobs.forEach(job => {
            const jobCard = `
                <div class="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
                    <h3 class="text-xl font-semibold text-purple-700 mb-2">${job.jobTitle}</h3>
                    <p class="text-gray-600 mb-1"><strong>Company:</strong> ${job.companyName}</p>
                    <p class="text-gray-600 mb-1"><strong>Location:</strong> ${job.location}</p>
                    <p class="text-gray-600 mb-1"><strong>Category:</strong> ${job.category}</p>
                    <p class="text-gray-700 mt-3 text-sm leading-relaxed">${job.description?.substring(0, 150) || 'No description'}...</p>
                    <div class="mt-4 flex justify-end space-x-2">
                        <button class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                         onclick="window.location.href='./Applicantsofrecruiter.html?email=${email}&jobId=${job.jobId}'">View Applicants</button>
                    </div>
                </div>
            `;
            postedJobsContainer.insertAdjacentHTML('beforeend', jobCard);
        });
    }

}catch (error) {
            console.error('Error fetching posted jobs:', error);
            loadingPostedJobs.classList.add('hidden');
            noPostedJobs.classList.remove('hidden');
            noPostedJobs.textContent = 'Failed to load your jobs. Please try again later.';
            displayMessage('Failed to load your jobs. Please try again later.');
        }
    };

    postJobForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        messageBox.classList.add('hidden');

        const jobData = {
            jobTitle: document.getElementById('job-title').value,
            companyName: document.getElementById('company-name').value,
            email:email,
            location: document.getElementById('job-location').value,
            category: document.getElementById('job-category').value,
            jobDescription: document.getElementById('job-description').value,
        };
    console.log(jobData);
        if (Object.values(jobData).some(value => !value)) {
            displayMessage('Please fill in all job details.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/recruiter/post-job', { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jobData)
            });

            const data = await response.json();
            console.log(data);
            if (data.success) {
                displayMessage(data.message, 'success');
                alert('Successfully posted the job');
                postJobForm.reset(); 
                fetchPostedJobs(); 
            } else {
                displayMessage(data.message || 'Failed to post job. Please try again.');
            }
        } catch (error) {
            console.error('Error posting job:', error);
            displayMessage('An unexpected error occurred while posting job. Please try again later.');
        }
    });
    fetchPostedJobs();
});
