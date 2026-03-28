import './JobCard.css';

function JobCard({ job, onApply }) {
    const buttonClass = job.applied ? "used-button" : "apply-btn";
    const buttonText = job.applied ? "Ви подалися" : "Подати заявку";
    const statusText = job.applied ? "Заявку подано" : "Відкрито";

    return (
        <article className="job-card">
            <h3>{job.title}</h3>
            <p><strong>Компанія:</strong> {job.company}</p>
            <p><strong>Місто:</strong> {job.city}</p>
            <p><strong>Дата:</strong> {job.date}</p>
            <p><strong>Зарплата:</strong> {job.salary} грн</p>

            <p className="status">
                <strong>Статус:</strong> {statusText}
            </p>

            <ul>
                {job.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                ))}
            </ul>

            <button
                className={buttonClass}
                onClick={() => !job.applied && onApply(job.id, job.title)}
                disabled={job.applied}
            >
                {buttonText}
            </button>
        </article>
    );
}

export default JobCard;