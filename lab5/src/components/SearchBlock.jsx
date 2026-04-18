import { useState } from 'react';
import './SearchBlock.css';
function SearchBlock({ filters, onApplyFilters, onSort }) {
    const [localFilters, setLocalFilters] = useState(filters);

    const handleChange = (name, value) => {
        setLocalFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onApplyFilters(localFilters);
    };

    return (
        <section id="search">
            <form onSubmit={handleSubmit}>
                <ul>
                    <li>
                        <label htmlFor="cat-select">Категорія:</label>
                        <select
                            id="cat-select"
                            value={localFilters.category}
                            onChange={(e) => handleChange('category', e.target.value)}
                        >
                            <option value="">Всі</option>
                            <option value="IT">IT</option>
                            <option value="Маркетинг">Маркетинг</option>
                            <option value="Дизайн">Дизайн</option>
                        </select>
                    </li>

                    <li>
                        <label htmlFor="reg-select">Місто:</label>
                        <select
                            id="reg-select"
                            value={localFilters.city}
                            onChange={(e) => handleChange('city', e.target.value)}
                        >
                            <option value="">Всі</option>
                            <option value="Київ">Київ</option>
                            <option value="Львів">Львів</option>
                            <option value="Дніпро">Дніпро</option>
                        </select>
                    </li>

                    <li>
                        <label htmlFor="salary-select">Зарплата від:</label>
                        <input
                            type="range"
                            id="salary-select"
                            min="5000" max="50000" step="500"
                            value={localFilters.salary}
                            onChange={(e) => handleChange('salary', e.target.value)}
                        />
                        <span>{localFilters.salary} грн</span>
                    </li>

                    <li>
                        <button type="submit" className="apply-filters-btn submit-button">
                            Застосувати фільтри
                        </button>
                    </li>

                    <li>
                        <button type="button" className="sort-btn submit-button" onClick={onSort}>
                            Сортувати за датою
                        </button>
                    </li>
                </ul>
            </form>
        </section>
    );
}

export default SearchBlock;