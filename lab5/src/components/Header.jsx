import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import './Header.css';

function Header({ user }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error("Помилка при виході:", error);
        }
    };

    return (
        <header>
            <nav>
                <ul>
                    <li><Link to="/">Вакансії</Link></li>

                    {user ? (
                        <>
                            <li><Link to="/profile">Мій профіль</Link></li>
                            <li><button onClick={handleLogout} className="logout-btn">Вийти</button></li>
                        </>
                    ) : (
                        <li><Link to="/auth">Вхід / Реєстрація</Link></li>
                    )}
                </ul>
            </nav>
        </header>
    );
}

export default Header;