import styles from './DocumentViewer.module.css';
import { FaTimes } from 'react-icons/fa';
import { useState } from 'react';

interface ModalProps {
    onClose: () => void;
    title: string;
    documentoHtml: string;
}

const DocumentViewer = ({ onClose, title, documentoHtml }: ModalProps) => {
    const [isToastVisible, setIsToastVisible] = useState(true);

    const handleCloseToast = () => {
        setIsToastVisible(false); // Fecha apenas o toast
    };

    return (
        <div className={styles.modalBackdrop}>
            <div className={styles.modalContainer}>
                <div className={styles.modalHeader}>
                    <h2>{title}</h2>
                    <button className={styles.closeButton} onClick={onClose}>
                        <FaTimes size={20} />
                    </button>
                </div>
                <div
                    className={styles.modalContent}
                    dangerouslySetInnerHTML={{ __html: documentoHtml }}
                />
            </div>


            {isToastVisible && (
                <div className={styles.toast}>
                    <div className={styles.toastContent}>
                        <p>
                            Lembramos que para uma experiência completa, seu contrato também está disponível no app OnNet Clientes.
                        </p>
                        <button className={styles.toastCloseButton} onClick={handleCloseToast}>
                            <FaTimes size={16} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentViewer;
