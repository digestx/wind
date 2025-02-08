const express = require('express');
const cors = require('cors');
const fs = require('fs/promises');
const path = require('path');
const fileUpload = require('express-fileupload');
const fsExtra = require('fs-extra');

const app = express();
const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'data/templates.json');

// Ensure uploads directory exists on startup
fsExtra.ensureDirSync(path.join(__dirname, 'uploads'));

// Ensure the data directory exists on startup
fsExtra.ensureDirSync(path.dirname(DATA_FILE));

app.use(cors());
app.use(express.json());
app.use(fileUpload({}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Get all templates
app.get('/api/templates', async (req, res) => {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        res.json(JSON.parse(data));
    } catch (error) {
        res.status(500).json({ error: 'Error reading templates' });
    }
});

// Update templates
app.put('/api/templates', async (req, res) => {
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify(req.body, null, 2));
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error saving templates' });
    }
});

// Modified upload endpoint
app.post('/api/upload', async (req, res) => {
    try {
        if (!req.files || Object.keys(req.files).length === 0) {
            return res.status(400).json({ error: 'No files uploaded' });
        }

        // Read existing data
        const templates = JSON.parse(await fs.readFile(DATA_FILE, 'utf-8'));
        const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files];
        
        // Process each file
        const uploadedFiles = await Promise.all(files.map(async (file) => {
            // Sanitize filename: replace non-allowed characters with underscores
            const sanitizedName = file.name.replace(/[^\w\s().-]/g, '_');
            const storedName = `${Date.now()}-${sanitizedName}`;
            const uploadPath = path.join(__dirname, 'uploads', storedName);
            
            // Ensure directory exists before moving file
            await fsExtra.ensureDir(path.dirname(uploadPath));
            await file.mv(uploadPath);
            
            return {
                originalName: file.name,  // Keep original for display
                storedName: storedName,
                size: file.size,
                url: `http://localhost:${PORT}/uploads/${storedName}`
            };
        }));

        // Properly update the correct template
        const templateId = parseInt(req.body.templateId);
        const templateIndex = templates.findIndex(t => t.id === templateId);
        
        if (templateIndex === -1) {
            return res.status(404).json({ error: 'Template not found' });
        }

        templates[templateIndex].attachments.push(...uploadedFiles);
        await fs.writeFile(DATA_FILE, JSON.stringify(templates, null, 2));

        console.log('Updated template data:', templates[templateIndex]);
        res.json({ 
            success: true,
            files: uploadedFiles  // Ensure this is always an array
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ 
            success: false,
            error: 'File upload failed'
        });
    }
});

// Delete file endpoint
app.delete('/api/files/:filename', async (req, res) => {
    try {
        const filename = decodeURIComponent(req.params.filename);
        const filePath = path.join(__dirname, 'uploads', filename);

        // Validate filename format
        if (!/^[\w\s().,-]+$/.test(filename)) {
            return res.status(400).json({ error: 'Invalid filename format' });
        }

        // Read templates data with proper error handling
        const templatesPath = path.join(__dirname, 'data/templates.json');
        const templates = JSON.parse(await fs.readFile(templatesPath, 'utf-8'));

        // Check if file exists in templates
        const fileExists = templates.some(template => 
            template.attachments.some(file => file.storedName === filename)
        );

        if (!fileExists) {
            return res.status(404).json({ error: 'File not found in any template' });
        }

        // Delete physical file
        await fs.unlink(filePath);

        // Update templates data
        const updatedTemplates = templates.map(template => ({
            ...template,
            attachments: template.attachments.filter(file => file.storedName !== filename)
        }));

        // Write updated templates
        await fs.writeFile(templatesPath, JSON.stringify(updatedTemplates, null, 2));

        res.json({ success: true });
    } catch (error) {
        console.error('Delete error:', error);
        const status = error.code === 'ENOENT' ? 404 : 500;
        res.status(status).json({ 
            error: 'File deletion failed',
            details: error.message
        });
    }
});

// Modify server initialization
const initializeServer = async () => {
    try {
        await fsExtra.ensureDir(path.dirname(DATA_FILE));
        
        await fs.access(DATA_FILE).catch(async () => {
            // Write with UTF-8 without BOM
            await fs.writeFile(DATA_FILE, '[]', { encoding: 'utf8' });
            console.log('Created new templates file');
        });
        
        console.log('Server initialization complete');
    } catch (error) {
        console.error('Server initialization failed:', error);
        process.exit(1);
    }
};

initializeServer().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}); 