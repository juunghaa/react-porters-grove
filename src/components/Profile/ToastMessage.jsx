import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import "./ToastMessage.css";

export default function ToastMessage({ message, onClose, duration = 2000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return createPortal(
    <div className="toast-message">
      <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
        <path d="M16.0189 2.66602C8.65488 2.66602 2.68555 8.63534 2.68555 15.9993C2.68555 23.3633 8.65488 29.3326 16.0189 29.3326C23.3829 29.3326 29.3522 23.3633 29.3522 15.9993C29.3522 8.63534 23.3829 2.66602 16.0189 2.66602ZM21.3522 11.9993C21.6935 11.9993 22.0495 12.114 22.3109 12.374C22.8309 12.8953 22.8309 13.77 22.3109 14.2913L17.3109 19.25C15.7762 20.7833 13.4309 20.554 12.2269 18.7487L10.8936 16.7487C10.4856 16.1367 10.6562 15.2833 11.2695 14.874C11.8815 14.466 12.7349 14.6366 13.1442 15.25L14.4775 17.25C14.7469 17.654 15.0922 17.718 15.4349 17.374L20.3936 12.374C20.6549 12.114 21.0109 11.9993 21.3522 11.9993Z" fill="#126431"/>
      </svg>
      <span className="toast-message-text">{message}</span>
    </div>,
    document.body
  );
}