import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from '@mui/material';

interface FileUploadDialogProps {
    open: boolean;
    onClose: () => void;
    onFilesChange: (files: File[]) => void;
}

const FileUploadDialog: React.FC<FileUploadDialogProps> = ({ open, onClose, onFilesChange }) => {
    const [files, setFiles] = useState<File[]>([]);

    const handleRemoveFile = (fileToRemove: File) => {
        const updatedFiles = files.filter(file => file !== fileToRemove);
        setFiles(updatedFiles);
        onFilesChange(updatedFiles);
    };

    const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFiles = Array.from(event.target.files);
            selectedFiles.forEach(() => {});
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Upload Files</DialogTitle>
            <DialogContent>
                <ul>
                    {files.map((file, index) => (
                        <li key={index}>
                            {file.name} <Button onClick={() => handleRemoveFile(file)}>Remove</Button>
                        </li>
                    ))}
                </ul>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
};

export default FileUploadDialog;
