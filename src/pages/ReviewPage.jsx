import React from 'react';
import { useNavigate } from 'react-router-dom';
import ReviewMode from '../ReviewMode';

const ReviewPage = ({ onOpenDEIC }) => {
  const navigate = useNavigate();
  return <ReviewMode onBack={() => navigate('/')} onOpenDEIC={onOpenDEIC} />;
};

export default ReviewPage;
