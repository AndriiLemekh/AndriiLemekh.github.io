const jobs = [
    { id: 1, title: "Python Developer", company: "TechSol", city: "Київ", category: "IT", salary: 45000,
        applied: false, requirements: ["Знання Python 3.x", "Досвід з Django або Flask", "Англійська B1"]},
    { id: 2, title: "UI/UX Designer", company: "CreativeStudio", city: "Львів", category: "Дизайн", salary: 35000,
        applied: false, requirements: ["Знання Figma", "Портфоліо", "Англійська B1"] },
    { id: 3, title: "Marketing Manager", company: "SkyHigh", city: "Дніпро", category: "Маркетинг", salary: 25000,
        applied: false, requirements: ["SMM", "Google Ads", "Аналітика"] },
    { id: 4, title: "Frontend Developer", company: "WebFlow", city: "Київ", category: "IT", salary: 50000,
        applied: false, requirements: ["React/Vue", "JavaScript ES6", "CSS Grid"] }
];

const slider = document.getElementById("salary-select");
const output = document.getElementById("range-value");
const container = document.querySelector('.jobs-container');

function renderJobs(jobsToDisplay) {
    container.innerHTML = "";

    jobsToDisplay.forEach(job => {
        const article = document.createElement('article');
        article.className = 'job-card';

        const reqHtml = job.requirements.map(req => `<li>${req}</li>`).join('');

        const statusText = job.applied ? "Подано" : "Відкрито";
        const btnClass = job.applied ? "used-button" : "apply-btn";
        const btnText = job.applied ? "Надіслано" : "Подати заявку";
        const statusColor = job.applied ? "style='color: green'" : "";

        article.innerHTML = `
            <h3>${job.title}</h3>
            <p><strong>Компанія:</strong> ${job.company}</p>
            <p><strong>Місто:</strong> ${job.city}</p>
            <p><strong>Зарплата:</strong> ${job.salary} грн</p>
            <p class="status" ${statusColor}><strong>Статус:</strong> ${statusText}</p>
            <p><strong>Вимоги:</strong></p>
            <ul>${reqHtml}</ul>
            <button class="${btnClass}" data-id="${job.id}" ${job.applied ? 'disabled' : ''}>${btnText}</button>
        `;
        container.appendChild(article);
    });
}

container.addEventListener('click', function(event) {
    if (event.target.classList.contains('apply-btn')) {
        const jobId = parseInt(event.target.getAttribute('data-id'));

        const job = jobs.find(j => j.id === jobId);

        if (job && !job.applied) {
            job.applied = true;
            showToast("Ви успішно подали заявку на " + job.title);
            filterJobs();
        }
    }
});

function filterJobs() {
    const category = document.getElementById('cat-select').value;
    const city = document.getElementById('reg-select').value;
    const maxSalary = parseInt(slider.value);

    const filtered = jobs.filter(job => {
        const matchesCategory = (category === job.category || category === "");
        const matchesCity = (city === job.city || city === "");
        const matchesSalary = (job.salary >= maxSalary);
        return matchesCategory && matchesCity && matchesSalary;
    });

    renderJobs(filtered);
}

function showToast(message) {
    const container = document.getElementById('toast-container');

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;

    container.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 3000);
}

document.getElementById('cat-select').addEventListener('change', filterJobs);
document.getElementById('reg-select').addEventListener('change', filterJobs);
slider.addEventListener('input', function() {
    output.textContent = slider.value;
    filterJobs();
});

renderJobs(jobs);