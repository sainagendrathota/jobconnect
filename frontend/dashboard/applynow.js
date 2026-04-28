
document.addEventListener('DOMContentLoaded', () => {
    const jobTitleDisplay = document.getElementById('job-title-display');
    const applyJobIdInput = document.getElementById('apply-job-id');
    const applyJobTitleInput = document.getElementById('apply-job-title');
    const applicantEmailInput = document.getElementById('applicant-email');
    const resumeUrlInput = document.getElementById('resume-url');
    const coverLetterSnippetInput = document.getElementById('cover-letter-snippet');
    const applyForm = document.getElementById('apply-form');
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
    const jobId = urlParams.get('jobId');
    const email = urlParams.get('email');
    const jobTitle= urlParams.get('jobTitle');
    console.log(jobId);
    console.log(email);
    if (jobId) {    
        jobTitleDisplay.textContent = decodeURIComponent(jobTitle);
        applyJobIdInput.value = jobId;

    } else {
        displayMessage('Job details missing. Please go back to the dashboard and select a job.');
        setTimeout(() => {
            window.location.href = '/jobseeker-dashboard.html';
        }, 3000);
        return; 
    }
    applyForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        messageBox.classList.add('hidden'); 

        const applicationData = {
            jobId: jobId,
            jobTitle: jobTitle,
            jobseekerEmail: email,
            resumeUrl: resumeUrlInput.value,
            coverLetter: coverLetterSnippetInput.value
        };

        if (!applicationData.jobseekerEmail || !applicationData.jobId || !applicationData.jobTitle) {
            displayMessage('Error occured');
            return;
        }
        if (!applicationData.resumeUrl) {
             displayMessage('Please provide a link to your resume.');
             return;
        }

        try {
            const response = await fetch('http://localhost:5000/jobseeker/apply-job', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(applicationData)
            });

            const data = await response.json();

            if (response.ok) {
                displayMessage(data.message, 'success');
                setTimeout(() => {
                    window.location.href = `./jobseekerdash.html?email=${email}`;
                }, 2000); 
            } else {
                displayMessage(data.message || 'Failed to submit application. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting application:', error);
            displayMessage('An unexpected error occurred. Please try again later.');
        }
    });
});
