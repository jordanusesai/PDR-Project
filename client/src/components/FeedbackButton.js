import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import FeedbackForm from './FeedbackForm';
import './FeedbackButton.css';

const FeedbackButton = ({ triggerLocation, className = '' }) => {
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const openFeedback = () => {
    setIsFeedbackOpen(true);
  };

  const closeFeedback = () => {
    setIsFeedbackOpen(false);
  };

  return (
    <>
      <button
        onClick={openFeedback}
        className={`feedback-button ${className}`}
        aria-label="Send feedback"
        title="Send feedback"
      >
        <MessageSquare size={16} />
        Feedback
      </button>
      
      <FeedbackForm 
        isOpen={isFeedbackOpen}
        onClose={closeFeedback}
        triggerLocation={triggerLocation}
      />
    </>
  );
};

export default FeedbackButton;
