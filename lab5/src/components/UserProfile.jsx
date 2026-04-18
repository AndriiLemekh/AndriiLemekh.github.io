import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc, arrayRemove } from 'firebase/firestore';
import userPic from '../assets/user_pic.jpg';
import './UserProfile.css';

// ДОДАЛИ onJobRemoved сюди:
function UserProfile({ showToast, onJobRemoved }) {
    const [userName, setUserName] = useState("Анонімний користувач");
    const [hardSkills, setHardSkills] = useState("Python, C++, Git");
    const [softSkills, setSoftSkills] = useState("Командна робота");
    const [experience, setExperience] = useState("Напишіть про свій досвід...");
    const [appliedJobs, setAppliedJobs] = useState([]);

    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (auth.currentUser) {
                const uid = auth.currentUser.uid;

                const userRef = doc(db, 'users', uid);
                const docSnap = await getDoc(userRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setUserName(data.userName || "Анонімний користувач");
                    setHardSkills(data.hardSkills || "");
                    setSoftSkills(data.softSkills || "");
                    setExperience(data.experience || "");
                }

                try {
                    const response = await fetch(`https://jobfinder-backend-y338.onrender.com/api/applications/${uid}`);
                    if (response.ok) {
                        const jobs = await response.json();
                        setAppliedJobs(jobs);
                    } else {
                        console.error("Сервер повернув помилку при завантаженні заявок");
                    }
                } catch (error) {
                    console.error("Помилка з'єднання із сервером:", error);
                }

                setIsLoading(false);
            } else {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleSave = async () => {
        if (auth.currentUser) {
            const userRef = doc(db, 'users', auth.currentUser.uid);

            await setDoc(userRef, {
                userName: userName,
                hardSkills: hardSkills,
                softSkills: softSkills,
                experience: experience
            }, { merge: true });

            setIsEditing(false);
            showToast("Профіль успішно збережено!");
        }
    };

    const handleRemoveJob = async (jobToRemove) => {
        if (auth.currentUser) {
            const userRef = doc(db, 'users', auth.currentUser.uid);

            await setDoc(userRef, {
                appliedJobs: arrayRemove(jobToRemove)
            }, { merge: true });

            setAppliedJobs(prev => prev.filter(job => job.id !== jobToRemove.id));
            showToast(`Відгук на "${jobToRemove.title}" скасовано!`);

            if (onJobRemoved) onJobRemoved(jobToRemove.id);
        }
    };

    // ДОДАЛИ: Екран завантаження
    if (isLoading) {
        return (
            <div className="profile-page" style={{ textAlign: 'center', padding: '50px' }}>
                <h2>⏳ Завантаження профілю...</h2>
            </div>
        );
    }

    return (
        <div className="profile-page">
            <div className="profile-header">
                <img src={userPic} alt="User" className="profile-pic" />
                <div className="profile-main-info">
                    {isEditing ? (
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="edit-input"
                            placeholder="Ваше ім'я"
                            style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '10px' }}
                        />
                    ) : (
                        <h2>{userName}</h2>
                    )}

                    <p className="subtitle">{auth.currentUser?.email}</p>

                    <button
                        onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                        className="edit-btn"
                    >
                        {isEditing ? "Зберегти зміни" : "Редагувати профіль"}
                    </button>
                </div>
            </div>

            <div className="profile-grid">
                <section className="profile-section">
                    <h3>Hard Skills </h3>
                    {isEditing ? (
                        <input
                            type="text"
                            value={hardSkills}
                            onChange={(e) => setHardSkills(e.target.value)}
                            className="edit-input"
                        />
                    ) : (
                        <ul className="skills-list">
                            {hardSkills.split(',').map((skill, i) => skill.trim() && (
                                <li key={i} className="skill-tag">{skill.trim()}</li>
                            ))}
                        </ul>
                    )}
                </section>

                <section className="profile-section">
                    <h3>Soft Skills </h3>
                    {isEditing ? (
                        <input
                            type="text"
                            value={softSkills}
                            onChange={(e) => setSoftSkills(e.target.value)}
                            className="edit-input"
                        />
                    ) : (
                        <ul className="skills-list">
                            {softSkills.split(',').map((skill, i) => skill.trim() && (
                                <li key={i} className="skill-tag soft">{skill.trim()}</li>
                            ))}
                        </ul>
                    )}
                </section>

                <section className="profile-section wide">
                    <h3>Досвід роботи</h3>
                    {isEditing ? (
                        <textarea
                            value={experience}
                            onChange={(e) => setExperience(e.target.value)}
                            rows="4"
                            className="edit-textarea"
                        />
                    ) : (
                        <div className="experience-list">
                            <p style={{whiteSpace: 'pre-wrap'}}>{experience}</p>
                        </div>
                    )}
                </section>

                <section className="profile-section wide">
                    <h3>Мої відгуки на вакансії</h3>
                    {appliedJobs.length > 0 ? (
                        <ul className="applied-jobs-list">
                            {appliedJobs.map((job, index) => (
                                <li key={index} className="applied-job-item">
                                    <span className="applied-job-title">{job.title}</span>
                                    <button
                                        onClick={() => handleRemoveJob(job)}
                                        className="remove-job-btn"
                                        title="Скасувати відгук"
                                    >
                                        🗑️ Скасувати
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="empty-jobs-msg">Ви ще не подалися на жодну вакансію.</p>
                    )}
                </section>
            </div>
        </div>
    );
}

export default UserProfile;