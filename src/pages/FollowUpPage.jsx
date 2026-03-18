import React from 'react';
import { useNavigate } from 'react-router-dom';
import DEICFollowUp from '../DEICFollowUp';

const FollowUpPage = ({ onOpenDEIC }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 pt-8 page-enter">
      <DEICFollowUp onOpenDEIC={onOpenDEIC} />
    </div>
  );
};

export default FollowUpPage;
