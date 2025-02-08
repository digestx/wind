import React, { useState } from 'react';
import FileUploadModal from './FileUploadModal';
import { Button } from 'primereact/button';

interface FileData {
    storedName: string;
    originalName: string;
    size: number;
    url: string;
}

interface FileUploadCellProps {
    value: FileData[];
    onUpload: (files: FileData[]) => void;
    onRemove: (file: FileData) => void;
    templateId: number;
}

const FileUploadCell: React.FC<FileUploadCellProps> = ({ value, onUpload, onRemove, templateId }) => {
    const [modalOpen, setModalOpen] = useState(false);

    return (
        <div>
            <Button 
                label={value.length > 0 ? `${value.length} Files` : 'Upload'}
                icon="pi pi-upload"
                className="p-button-sm"
                onClick={() => setModalOpen(true)}
            />
            
            {/* File links display */}
            <div className="mt-2">
                {value.map((file, index) => (
                    <span key={index}>
                        <a
                            href={file.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:underline"
                        >
                            {file.originalName}
                        </a>
                        {index < value.length - 1 ? ', ' : ''}
                    </span>
                ))}
            </div>
            
            <FileUploadModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                onUploadComplete={(files) => {
                    onUpload(files);
                    setModalOpen(false);
                }}
                onRemoveFile={onRemove}
                existingFiles={value}
                templateId={templateId}
            />
        </div>
    );
};

export default FileUploadCell;