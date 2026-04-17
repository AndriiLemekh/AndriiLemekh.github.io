import './ToastContainer.css';

function ToastContainer({ toasts }) {
    return (
        <div className="toast-container">
            {toasts.map(toast => (
                <div key={toast.id} className="toast">
                    {toast.text}
                </div>
            ))}
        </div>
    );
}

export default ToastContainer;