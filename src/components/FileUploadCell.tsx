import React, { useState } from 'react';

interface FileUploadCellProps {
    value: File[] | File;
    onFileUpload: (file: File) => void;
}

const FileUploadCell: React.FC<FileUploadCellProps> = ({ value, onFileUpload }) => {
    const [files, setFiles] = useState<File[]>(Array.isArray(value) ? value : value ? [value] : []);
    const [modalOpen, setModalOpen] = useState(false);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFiles = Array.from(event.target.files);
            selectedFiles.forEach(file => {
                setFiles(prevFiles => [...prevFiles, file]);
                onFileUpload(file);
            });
        }
    };

    const removeFile = (fileToRemove: File) => {
        setFiles(files.filter(file => file !== fileToRemove));
    };

    const closeModal = () => {
        setModalOpen(false);
    };

    const triggerFileInput = () => {
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        fileInput.click();
    };

    return (
        <div>
            <input type="file" multiple onChange={handleFileChange} style={{ display: 'none' }} id="file-upload" />
            <label htmlFor="file-upload" style={{ cursor: 'pointer', padding: '10px', backgroundColor: '#007bff', color: '#fff', borderRadius: '5px' }} onClick={triggerFileInput}>Upload Files</label>
            <p>{files.length} file(s) uploaded</p>

            {modalOpen && (
                <div style={{ position: 'fixed', top: '0', left: '0', right: '0', bottom: '0', backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
                    <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '5px', width: '400px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)' }}>
                        <h4>Upload Files</h4>
                        <button onClick={triggerFileInput} style={{ padding: '5px 10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' }}>Select Files</button>
                        <div style={{ display: 'flex', flexDirection: 'column', marginTop: '10px' }}>
                            {files.map((file, index) => (
                                <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                    <span>{file.name}</span>
                                    <button onClick={() => removeFile(file)} style={{ background: 'none', border: 'none', color: 'red', cursor: 'pointer' }}>Delete</button>
                                </div>
                            ))}
                        </div>
                        <button onClick={closeModal} style={{ marginTop: '10px', padding: '5px 10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px' }}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FileUploadCell;