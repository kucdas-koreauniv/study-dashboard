import React from "react";

import "./PRInformationModal.css";

interface PRInformationModalProps {
    author: string;
    date: string;
    link: string;
    title: string;
    onClose: () => void;
}

const PRInformationModal: React.FC<PRInformationModalProps> = ({ author, date, link, title, onClose }) => {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="close-button" onClick={onClose}>X</button>
                <h2>{title}</h2>
                <p><strong>작성자:</strong> {author}</p>
                <p><strong>작성 일시:</strong> {date}</p>
                <button className="link-button" onClick={() => window.open(link, "_blank")}>
                    PR 바로가기
                </button>
            </div>
        </div>
    );
};

export default PRInformationModal;