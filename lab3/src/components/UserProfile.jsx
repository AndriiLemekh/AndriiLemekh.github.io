import userPic from '../assets/user_pic.jpg';
import './UserProfile.css';

function UserProfile() {
    const skills = {
        hard: ["Python (основна)", "C/C++", "Java", "SQL (SSMS)", "Git"],
        soft: ["Командна робота", "Вирішення складних алгоритмічних задач"]
    };

    const experience = [
        { title: "Розробка Chess AI", lang: "C++", desc: "Створення штучного інтелекту для гри в шахи." },
        { title: "Sign Language Translator", lang: "Python/ML", desc: "Проєкт перекладача жестів у реальному часі." }
    ];

    return (
        <div className="profile-page">
            <div className="profile-header">
                <img src={userPic} alt="Andrii Lemekh" className="profile-pic" />
                <div className="profile-main-info">
                    <h2>Андрій Лемех</h2>
                    <p className="subtitle">Студент факультету Комп'ютерних наук</p>
                    <p>Спеціалізація: Software Engineering & Machine Learning</p>
                </div>
            </div>

            <div className="profile-grid">
                <section className="profile-section">
                    <h3>Hard Skills</h3>
                    <ul className="skills-list">
                        {skills.hard.map((skill, i) => <li key={i} className="skill-tag">{skill}</li>)}
                    </ul>
                </section>

                <section className="profile-section">
                    <h3>Soft Skills</h3>
                    <ul className="skills-list">
                        {skills.soft.map((skill, i) => <li key={i} className="skill-tag soft">{skill}</li>)}
                    </ul>
                </section>

                <section className="profile-section wide">
                    <h3>Досвід роботи та проєкти</h3>
                    <div className="experience-list">
                        {experience.map((exp, i) => (
                            <div key={i} className="exp-item">
                                <h4>{exp.title} <span>({exp.lang})</span></h4>
                                <p>{exp.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
}

export default UserProfile;