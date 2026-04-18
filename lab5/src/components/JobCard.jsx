import { useNavigate } from 'react-router-dom';
import './JobCard.css';

function JobCard({ job, onApply, user }) {
    const navigate = useNavigate();

    const buttonClass = job.applied && user ? "used-button" : "apply-btn";

    const buttonText = user
        ? (job.applied ? "Ви подалися" : "Подати заявку")
        : "Увійдіть, щоб податися";

    const statusText = job.applied ? "Заявку подано" : "Відкрито";

    const handleClick = () => {
        if (!user) {
            navigate('/auth');
        } else if (!job.applied) {
            onApply(job.id, job.title);
        }
    };

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
                onClick={handleClick}
                disabled={job.applied && user}
            >
                {buttonText}
            </button>
        </article>
    );
}

export default JobCard;