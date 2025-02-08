const fs = require('fs/promises');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data/templates.json');

const dummyData = [
  {
    id: 1,
    templateNo: "545454",
    name: "Template 1",
    revision: "1",
    createdBy: "N/A",
    department: "N/A",
    reference: "N/A",
    fields: "2 fields",
    createdAt: "Feb 3, 2025 05:51",
    attachments: []
  },
  {
    id: 2,
    templateNo: "8",
    name: "Template 2",
    revision: "1",
    createdBy: "N/A",
    department: "N/A",
    reference: "N/A",
    fields: "2 fields",
    createdAt: "Feb 3, 2025 05:54",
    attachments: []
  }
];

async function initialize() {
  try {
    // Create data directory
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    
    // Write dummy data
    await fs.writeFile(DATA_FILE, JSON.stringify(dummyData, null, 2));
    console.log('Database initialized with dummy data');
    
    // Set proper permissions
    await fs.chmod(DATA_FILE, 0o644);
  } catch (error) {
    console.error('Initialization failed:', error);
    process.exit(1);
  }
}

initialize(); 