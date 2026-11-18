
// JOB DATA

const jobs = [
    {
        title: "Software Developer",
        company: "Google",
        location: "Bangalore",
        salary: "6-10 LPA",
        category: "IT & Software"
    },
    {
        title: "Web Developer",
        company: "Infosys",
        location: "Belagavi",
        salary: "4-6 LPA",
        category: "IT & Software"
    },
    {
        title: "Data Analyst",
        company: "TCS",
        location: "Mumbai",
        salary: "5-8 LPA",
        category: "IT & Software"
    },
    {
        title: "Accountant",
        company: "Deloitte",
        location: "Bangalore",
        salary: "4-6 LPA",
        category: "Finance"
    },
    {
        title: "Graphic Designer",
        company: "Adobe",
        location: "Pune",
        salary: "4-7 LPA",
        category: "Design"
    },
    {
        title: "Marketing Executive",
        company: "Wipro",
        location: "Mumbai",
        salary: "3-5 LPA",
        category: "Marketing"
    }
];


// STORAGE FUNCTIONS

function getData(key) {
    return JSON.parse(localStorage.getItem(key) || "[]");
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}


// DISPLAY JOBS

function displayJobs(search = "") {

    const container = document.getElementById("allJobs");

    if (!container) return;

    const filtered = jobs.filter(job =>
        job.title.toLowerCase().includes(search.toLowerCase()) ||
        job.location.toLowerCase().includes(search.toLowerCase()) ||
        job.category.toLowerCase().includes(search.toLowerCase())
    );

    container.innerHTML = "";

    if (filtered.length === 0) {
        container.innerHTML = "<p>No jobs found.</p>";
        return;
    }

    filtered.forEach(job => {

        container.innerHTML += `
            <div class="job-card">
                <h3>${job.title}</h3>
                <p>Company: ${job.company}</p>
                <p>Location: ${job.location}</p>
                <p>Salary: ${job.salary}</p>
                <p>Category: ${job.category}</p>

                <a href="apply.html?job=${encodeURIComponent(job.title)}">
                    <button>Apply Now</button>
                </a>
            </div>
        `;
    });
}

function searchJobs() {

    const title = document.getElementById("jobTitle").value;
    const location = document.getElementById("jobLocation").value;

    const results = jobs.filter(job =>
        job.title.toLowerCase().includes(title.toLowerCase()) &&
        job.location.toLowerCase().includes(location.toLowerCase())
    );

    const container = document.getElementById("jobResults");

    container.innerHTML = "";

    if (results.length === 0) {
        container.innerHTML = "<p>No matching jobs found.</p>";
        return;
    }

    results.forEach(job => {

        container.innerHTML += `
            <div class="job-card">
                <h3>${job.title}</h3>
                <p>${job.company}</p>
                <p>${job.location}</p>
                <p>${job.salary}</p>
                <a href="apply.html?job=${encodeURIComponent(job.title)}">
                    <button>Apply Now</button>
                </a>
            </div>
        `;
    });
}


// CATEGORY FILTER

function openCategory(category) {
    window.location.href = "jobs.html?category=" +
        encodeURIComponent(category);
}


// JOB PAGE SEARCH

document.addEventListener("DOMContentLoaded", function() {

    const search = document.getElementById("jobSearch");

    if (search) {

        const params = new URLSearchParams(window.location.search);
        const category = params.get("category");

        if (category) {
            search.value = category;
        }

        displayJobs(search.value);
    }

});


// APPLICATION FORM

const applicationForm = document.getElementById("applicationForm");

if (applicationForm) {

    const selectedJob = new URLSearchParams(
        window.location.search
    ).get("job");

    if (selectedJob) {
        document.getElementById("appJob").value = selectedJob;
    }

    applicationForm.addEventListener("submit", function(e) {

        e.preventDefault();

        const resume = document.getElementById("appResume").files[0];

        if (!resume || resume.type !== "application/pdf") {
            alert("Please upload a valid PDF resume.");
            return;
        }

        if (resume.size > 2 * 1024 * 1024) {
            alert("Resume must be smaller than 2 MB.");
            return;
        }

        const reader = new FileReader();

        reader.onload = function() {

            const application = {

                id: Date.now(),

                name: document.getElementById("appName").value,
                email: document.getElementById("appEmail").value,
                phone: document.getElementById("appPhone").value,
                job: document.getElementById("appJob").value,
                qualification: document.getElementById("appQualification").value,
                skills: document.getElementById("appSkills").value,

                resume: reader.result,

                date: new Date().toLocaleDateString(),

                status: "Pending"
            };

            const applications = getData("applications");

            applications.push(application);

            try {
                saveData("applications", applications);
            } catch (error) {
                alert("Storage is full. Please use a smaller resume.");
                return;
            }

            document.getElementById("applicationMessage").innerText =
                "Application submitted successfully!";

            applicationForm.reset();

        };

        reader.readAsDataURL(resume);

    });

}


// USER REGISTRATION

const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", function(e) {

        e.preventDefault();

        const name = document.getElementById("regName").value;
        const email = document.getElementById("regEmail").value;
        const password = document.getElementById("regPassword").value;
        const confirm = document.getElementById("confirmPassword").value;

        if (password !== confirm) {

            document.getElementById("registerMessage").innerText =
                "Passwords do not match!";

            return;
        }

        const users = getData("users");

        if (users.some(user => user.email.toLowerCase() === email.toLowerCase())) {

            document.getElementById("registerMessage").innerText =
                "Email already registered!";

            return;
        }

        users.push({
            name,
            email,
            password
        });

        saveData("users", users);

        document.getElementById("registerMessage").innerText =
            "Registration successful! Please login.";

        registerForm.reset();

    });

}


// USER LOGIN

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", function(e) {

        e.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        const users = getData("users");

        const user = users.find(u =>
            u.email.toLowerCase() === email.toLowerCase() &&
            u.password === password
        );

        if (user) {

            sessionStorage.setItem("loggedInUser", user.email);

            document.getElementById("loginMessage").innerText =
                "Login successful!";

            setTimeout(() => {
                window.location.href = "jobs.html";
            }, 1000);

        } else {

            document.getElementById("loginMessage").innerText =
                "Invalid email or password.";

        }

    });

}


// ADMIN LOGIN

const adminLoginForm = document.getElementById("adminLoginForm");

if (adminLoginForm) {

    adminLoginForm.addEventListener("submit", function(e) {

        e.preventDefault();

        const username = document.getElementById("adminUsername").value;
        const password = document.getElementById("adminPassword").value;

        if (username === "admin" && password === "admin123") {

            sessionStorage.setItem("adminLoggedIn", "true");

            window.location.href = "admin.html";

        } else {

            document.getElementById("adminLoginMessage").innerText =
                "Invalid admin username or password.";

        }

    });

}


// ADMIN DASHBOARD

function loadAdminDashboard() {

    const table = document.getElementById("applicantTable");

    if (!table) return;

    if (sessionStorage.getItem("adminLoggedIn") !== "true") {
        window.location.href = "admin-login.html";
        return;
    }

    const applications = getData("applications");

    document.getElementById("totalApplicants").innerText =
        applications.length;

    document.getElementById("totalJobs").innerText =
        jobs.length;

    document.getElementById("pendingApplications").innerText =
        applications.filter(a => a.status === "Pending").length;

    document.getElementById("acceptedApplications").innerText =
        applications.filter(a => a.status === "Accepted").length;

    table.innerHTML = "";

    applications.forEach((app, index) => {

        const row = document.createElement("tr");

        const values = [
            app.name,
            app.email,
            app.phone,
            app.job,
            app.qualification,
            app.skills
        ];

        values.forEach(value => {

            const td = document.createElement("td");
            td.textContent = value;
            row.appendChild(td);

        });

        const resumeCell = document.createElement("td");

        const resumeLink = document.createElement("a");
        resumeLink.href = app.resume;
        resumeLink.download = "Resume.pdf";
        resumeLink.textContent = "Download";

        resumeCell.appendChild(resumeLink);
        row.appendChild(resumeCell);

        const statusCell = document.createElement("td");
        statusCell.textContent = app.status;
        row.appendChild(statusCell);

        const actionCell = document.createElement("td");

        const acceptBtn = document.createElement("button");
        acceptBtn.textContent = "Accept";
        acceptBtn.onclick = () => updateStatus(index, "Accepted");

        const rejectBtn = document.createElement("button");
        rejectBtn.textContent = "Reject";
        rejectBtn.onclick = () => updateStatus(index, "Rejected");

        actionCell.appendChild(acceptBtn);
        actionCell.appendChild(rejectBtn);

        row.appendChild(actionCell);

        table.appendChild(row);

    });

}


// UPDATE APPLICATION STATUS

function updateStatus(index, status) {

    const applications = getData("applications");

    applications[index].status = status;

    saveData("applications", applications);

    loadAdminDashboard();

}


// ADMIN LOGOUT

function adminLogout() {

    sessionStorage.removeItem("adminLoggedIn");

    window.location.href = "admin-login.html";

}


// CONTACT FORM

const contactForm = document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", function(e) {

        e.preventDefault();

        const message = {

            name: document.getElementById("contactName").value,
            email: document.getElementById("contactEmail").value,
            subject: document.getElementById("contactSubject").value,
            message: document.getElementById("contactMessage").value

        };

        const messages = getData("contactMessages");

        messages.push(message);

        saveData("contactMessages", messages);

        document.getElementById("contactStatus").innerText =
            "Your message has been submitted successfully!";

        contactForm.reset();

    });

}


// LOAD ADMIN DASHBOARD

document.addEventListener("DOMContentLoaded", function() {
    loadAdminDashboard();
});
