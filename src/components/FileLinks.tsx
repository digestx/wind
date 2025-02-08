import React from 'react';
import { FileData } from './FormTemplateList';

interface FileLinksProps {
  attachments: FileData[];
}

const FileLinks: React.FC<FileLinksProps> = ({ attachments }) => {
  return (
    <div className="mt-2">
      {attachments.map((file, index) => (
        <span key={index}>
          <a
            href={file.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            {file.originalName}
          </a>
          {index < attachments.length - 1 ? ', ' : ''}
        </span>
      ))}
    </div>
  );
};

export default FileLinks; 