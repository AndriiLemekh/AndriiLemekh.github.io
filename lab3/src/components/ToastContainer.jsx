import './ToastContainer.css';
function ToastContainer({ toasts }) {
    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <div key={toast.id} className="toast">
                    Ви успішно подалися на вакансію: {toast.title}
                </div>
            ))}
        </div>
    );
}

export default ToastContainer;