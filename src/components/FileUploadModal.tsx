import React, { useRef, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import axios from 'axios';
import { FormTemplate } from './FormTemplateList';
import { Button } from 'primereact/button';
import { ConfirmDialog } from 'primereact/confirmdialog';

interface FileData {
    storedName: string;
    originalName: string;
    size: number;
    url: string;
}

interface FileUploadModalProps {
    open: boolean;
    onClose: () => void;
    onUploadComplete: (files: FileData[]) => void;
    onRemoveFile: (file: FileData) => void;
    existingFiles: FileData[];
    templateId: number;
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({ 
    open, 
    onClose, 
    onUploadComplete, 
    onRemoveFile,
    existingFiles,
    templateId 
}) => {
    const fileUploadRef = React.useRef<FileUpload>(null);
    const [fileToDelete, setFileToDelete] = useState<FileData | null>(null);

    const uploadHandler = async (event: any) => {
        try {
            const formData = new FormData();
            formData.append('templateId', templateId.toString());
            
            event.files.forEach((file: File) => {
                formData.append('files', file);
            });

            const response = await axios.post('http://localhost:5000/api/upload', formData);
            
            const newFiles = (response.data.files || []).map((file: any) => ({
                storedName: file.storedName,
                originalName: file.originalName,
                size: file.size,
                url: file.url
            }));

            onUploadComplete(newFiles);
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            fileUploadRef.current?.clear();
        }
    };

    const confirmDelete = (file: FileData) => {
        setFileToDelete(file);
    };

    const handleDeleteConfirmation = async () => {
        if (!fileToDelete) return;
        
        try {
            await axios.delete(`http://localhost:5000/api/files/${encodeURIComponent(fileToDelete.storedName)}`);
            onRemoveFile(fileToDelete);
            setFileToDelete(null);
        } catch (error) {
            console.error('Error deleting file:', error);
        }
    };

    return (
        <>
            <ConfirmDialog
                visible={!!fileToDelete}
                onHide={() => setFileToDelete(null)}
                message={`Are you sure you want to delete "${fileToDelete?.originalName}"?`}
                header="Confirm Deletion"
                icon="pi pi-exclamation-triangle"
                accept={handleDeleteConfirmation}
                reject={() => setFileToDelete(null)}
                acceptClassName="p-button-danger"
                rejectClassName="p-button-secondary"
            />

            <Dialog
                header={`Manage Files (Template #${templateId})`}
                visible={open}
                style={{ width: '60vw' }}
                onHide={onClose}
            >
                <div className="p-fluid">
                    <div className="mb-6">
                        <h4 className="mb-3">Existing Files:</h4>
                        <div className="grid gap-2">
                            {existingFiles.map((file, index) => (
                                <div key={index} className="flex items-center justify-between p-2 border rounded">
                                    <div className="flex items-center gap-3">
                                        <i className="pi pi-file text-blue-500" />
                                        <a
                                            href={file.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline"
                                        >
                                            {file.originalName}
                                        </a>
                                        <span className="text-sm text-gray-500">
                                            ({Math.round(file.size / 1024)} KB)
                                        </span>
                                    </div>
                                    <Button
                                        icon="pi pi-trash"
                                        className="p-button-rounded p-button-danger p-button-text"
                                        onClick={() => confirmDelete(file)}
                                    />
                                </div>
                            ))}
                            {existingFiles.length === 0 && (
                                <div className="text-gray-500 p-2">No files attached yet</div>
                            )}
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <h4 className="mb-3">Upload New Files:</h4>
                        <FileUpload
                            ref={fileUploadRef}
                            name="files"
                            url="/api/upload"
                            multiple
                            accept="*"
                            maxFileSize={10000000}
                            chooseLabel="Select Files"
                            uploadLabel="Upload"
                            cancelLabel="Cancel"
                            customUpload
                            uploadHandler={uploadHandler}
                            emptyTemplate={<p className="p-4">Drag and drop files to here to upload.</p>}
                        />
                    </div>
                </div>
            </Dialog>
        </>
    );
};

export default FileUploadModal;
