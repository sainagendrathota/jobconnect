
document.addEventListener('DOMContentLoaded', () => {
    const jobListingsContainer = document.getElementById('job-listings-container');
    const searchLocationInput = document.getElementById('search-location');
    const filterCategorySelect = document.getElementById('filter-category');
    const searchButton = document.getElementById('search-button');
    const loadingMessage = document.getElementById('loading-message');
    const noJobsMessage = document.getElementById('no-jobs-message');
  document.getElementById('my-applications')?.addEventListener('click', () => {
  window.location.href = `./MyapplicationsofJobseeker.html?email=${email}`;
});
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
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    console.log(email);
  
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
    const fetchJobs = async () => {
        jobListingsContainer.innerHTML = ''; 
        loadingMessage.classList.remove('hidden'); 
        noJobsMessage.classList.add('hidden');
        const location = searchLocationInput.value.toLowerCase();
        const category = filterCategorySelect.value;

       
try {
    const response = await fetch('http://localhost:5000/jobseeker/getjobs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({location, category })
    });

    const data = await response.json();
    console.log(data);
    const jobs=data.jobs;
    loadingMessage.classList.add('hidden');

    jobListingsContainer.innerHTML = ''; 

    if (!Array.isArray(jobs) || jobs.length === 0) {
        noJobsMessage.classList.remove('hidden');
    } else {
        jobs.forEach(job => {
            const jobCard = `
                <div class="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300 transform hover:-translate-y-1">
                    <h3 class="text-xl font-semibold text-indigo-700 mb-2">${job.jobTitle}</h3>
                    <p class="text-gray-600 mb-1"><strong>Company:</strong> ${job.companyName}</p>
                    <p class="text-gray-700 mt-3 text-sm leading-relaxed">${job.jobDescription.substring(0, 150)}...</p>
                    <div class="mt-4 flex justify-end space-x-2">
                        <button class="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition duration-300"
                        onclick="window.location.href='./applynow.html?email=${email}&jobId=${job.jobId}&jobTitle=${job.jobTitle}'">Apply Now</button>
                    
                    </div>
                </div>
            `;
            jobListingsContainer.insertAdjacentHTML('beforeend', jobCard);
        });
    }
} catch (error) {
            console.error('Error fetching jobs:', error);
            loadingMessage.classList.add('hidden');
            noJobsMessage.classList.remove('hidden');
            noJobsMessage.textContent = 'Failed to load jobs. Please try again later.';
            messageBox.classList.remove('hidden');
            messageText.textContent = 'Failed to load jobs. Please try again later.';
        }
    };
    searchButton.addEventListener('click', fetchJobs);
    fetchJobs();
});

