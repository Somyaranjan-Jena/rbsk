import React from 'react';
import { AlertCircle } from 'lucide-react';

const QuestionRow = ({ label, name, options = ['Yes', 'No'], formData, setVal }) => {
  const isFlagged = formData[name] === 'Yes' && options.includes('Yes');
  return (
    <div className={`py-4 border-b border-slate-100/60 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors duration-200
      ${isFlagged ? 'bg-red-50/50 -mx-4 px-4 rounded-xl' : ''}`}>
      <span className={`text-sm font-semibold leading-snug ${isFlagged ? 'text-red-700' : 'text-slate-700'}`}>
        {isFlagged && <AlertCircle size={13} className="inline mr-1.5 -mt-0.5" />}
        {label}
      </span>
      <div className="flex gap-2 shrink-0">
        {options.map(opt => (
          <button key={opt} onClick={() => setVal(name, opt)}
            className={`pill-toggle ${
              formData[name] === opt
                ? (isFlagged && opt === 'Yes' ? 'pill-toggle-danger' : 'pill-toggle-active')
                : 'pill-toggle-inactive'
            }`}>
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuestionRow;
