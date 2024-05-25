const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
const multer = require('multer');

app.use(cors());
app.use('/uploads', express.static('uploads'));

const PORT = process.env.PORT || 3001;
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

app.use(bodyParser.json());

const taskConnection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456789',
    database: 'task_db'
});

taskConnection.connect(err => {
    if (err) {
        console.error('Error connecting to task database:', err);
        return;
    }
    console.log('Connected to task database');
});

// Create Task
app.post('/tasks', upload.single('attachment'), (req, res) => {
    const { username, taskName, taskDescription, date } = req.body;
    const attachmentPath = req.file ? req.file.path : null;
     if (!attachmentPath) {
        return res.status(400).json({ error: 'Attachment file is required' });
    }

    // Handle file upload errors
    if (req.fileValidationError) {
        return res.status(400).json({ error: req.fileValidationError });
    }


    taskConnection.query(
        'INSERT INTO tasks (username, task_name, task_description, date, attachment_path) VALUES (?, ?, ?, ?, ?)',
        [username, taskName, taskDescription, date, attachmentPath],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(201).json({ message: 'Task created successfully' });
        }
    );
});

// Read All Tasks
app.get('/tasks', (req, res) => {
    const { username } = req.query;

    // Check if the username parameter is provided
    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    // Adjust the SQL query to filter tasks by the provided username
    taskConnection.query(
        'SELECT * FROM tasks WHERE username = ? ORDER BY date DESC',
        [username],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({ tasks: results });
        }
    );
});


// Update Task
app.put('/tasks/:id', upload.single('attachment'), (req, res) => {
    const taskId = req.params.id;
    const { taskName, taskDescription, date } = req.body;
    const attachmentPath = req.file ? req.file.path : null;

    // Construct SQL query based on whether attachment is provided or not
    let query, queryParams;
    if (attachmentPath) {
        query = 'UPDATE tasks SET task_name = ?, task_description = ?, date = ?, attachment_path = ? WHERE id = ?';
        queryParams = [taskName, taskDescription, date, attachmentPath, taskId];
    } else {
        query = 'UPDATE tasks SET task_name = ?, task_description = ?, date = ? WHERE id = ?';
        queryParams = [taskName, taskDescription, date, taskId];
    }

    taskConnection.query(
        query,
        queryParams,
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({ message: 'Task updated successfully' });
        }
    );
});

// Delete Task
app.delete('/tasks/:id', (req, res) => {
    const taskId = req.params.id;

    taskConnection.query(
        'DELETE FROM tasks WHERE id = ?',
        [taskId],
        (err, results) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.status(200).json({ message: 'Task deleted successfully' });
        }
    );
});

app.get('/uploads/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, 'uploads', filename);

    // Determine Content-Type based on file extension
    const contentType = getContentType(filename);
    if (!contentType) {
        res.status(400).send('Invalid file type');
        return;
    }

    // Send the file with proper Content-Type header
    res.sendFile(filePath, {
        headers: {
            'Content-Type': contentType
        }
    });
});

// Function to determine Content-Type based on file extension
function getContentType(filename) {
    const ext = path.extname(filename);
    switch (ext.toLowerCase()) {
        case '.pdf':
            return 'application/pdf';
        case '.docx':
            return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        // Add more cases for other file types if needed
        default:
            return null;
    }
}

app.listen(PORT, 'www.todo.com', () => {
  console.log(`Server is running on http://www.todo.com:${PORT}`);
});
