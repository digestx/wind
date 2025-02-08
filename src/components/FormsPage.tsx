import React from 'react';

interface FormsPageProps {
  type?: 'drafts' | 'archived';
}

const FormsPage: React.FC<FormsPageProps> = ({ type }) => {
  return (
    <div>
      <h2>
        {type === 'drafts' ? 'Draft Forms' : 
         type === 'archived' ? 'Archived Forms' : 'Submitted Forms'}
      </h2>
      {/* Add forms list here */}
    </div>
  );
};

export default FormsPage; 