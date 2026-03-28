import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
    return (
        <header>
            <nav>
                <ul>
                    <li><Link to="/">Вакансії</Link></li>
                    <li><Link to="/profile">Мій профіль</Link></li>
                </ul>
            </nav>
        </header>
    );
}

export default Header;