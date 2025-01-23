// ProcessModal.js
import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { FaImage, FaPaperPlane, FaSpinner, FaCheckCircle, FaSave } from 'react-icons/fa';
import './ProcessModal.css';

Modal.setAppElement('#root'); // For accessibility

function ProcessModal({ isOpen, onRequestClose }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    let timer;
    if (isOpen) {
      timer = setTimeout(() => {
        if (step < 4) setStep(step + 1);
      }, 2000); // Change the interval as needed
    }
    return () => clearTimeout(timer);
  }, [step, isOpen]);

  const steps = [
    { icon: <FaImage />, text: 'Select Image' },
    { icon: <FaPaperPlane />, text: 'Post Request' },
    { icon: <FaSpinner />, text: 'Analyzing' },
    { icon: <FaCheckCircle />, text: 'Response Received' },
    { icon: <FaSave />, text: 'Output Saved' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="process-modal"
      overlayClassName="process-overlay"
    >
      <div className="process-content">
        <h2>Process Overview</h2>
        <div className="process-steps">
          {steps.map((stepDetail, index) => (
            <div
              key={index}
              className={`process-step ${index <= step ? 'active' : ''}`}
            >
              <div className="process-icon">{stepDetail.icon}</div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}

export default ProcessModal;
