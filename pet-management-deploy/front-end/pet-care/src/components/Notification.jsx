import React, { useState, useEffect } from 'react';
import './Notification.css';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

function Notification({ 
  message, 
  type = 'info', 
  duration = 5000, 
  onClose,
  title = ''
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) onClose();
  };

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle size={24} />;
      case 'error':
        return <AlertTriangle size={24} />;
      case 'warning':
        return <AlertCircle size={24} />;
      case 'info':
      default:
        return <Info size={24} />;
    }
  };

  if (!isVisible) return null;

  return (
    <div className={`notification notification-${type} show`}>
      <div className="notification-icon">
        {getIcon()}
      </div>
      <div className="notification-content">
        {title && <h4 className="notification-title">{title}</h4>}
        <p className="notification-message">{message}</p>
      </div>
      <button 
        className="notification-close" 
        onClick={handleClose}
        aria-label="Close notification"
      >
        <X size={20} />
      </button>
      <div className="notification-progress"></div>
    </div>
  );
}

export default Notification;
