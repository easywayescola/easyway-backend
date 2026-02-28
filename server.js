const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'easyway-secret-key-2024';

// Middleware
app.use(cors());
app.use(express.json());

// Database setup
const dbPath = process.env.DB_PATH || path.join('/tmp', 'easyway.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error opening database:', err);
  } else {
    console.log('✅ Database connected at:', dbPath);
    initializeDatabase();
  }
});

// Initialize database with tables and default users
function initializeDatabase() {
  db.serialize(() => {
    // Teachers table
    db.run(`
      CREATE TABLE IF NOT EXISTS teachers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Students table
    db.run(`
      CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        teacher_id INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (teacher_id) REFERENCES teachers(id)
      )
    `);

    // Insert default teacher if not exists
    db.run(
      `INSERT OR IGNORE INTO teachers (name, email, password) VALUES (?, ?, ?)`,
      ['Professor', 'professor@easyway.com', 'senha123']
    );

    // Insert default students if not exist
    db.run(
      `INSERT OR IGNORE INTO students (name, email, password, teacher_id) VALUES (?, ?, ?, 1)`,
      ['Aluno 1', 'aluno1@easyway.com', 'senha123']
    );

    db.run(
      `INSERT OR IGNORE INTO students (name, email, password, teacher_id) VALUES (?, ?, ?, 1)`,
      ['Aluno 2', 'aluno2@easyway.com', 'senha123']
    );

    console.log('✅ Database initialized with default users');
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: '🚀 EasyWay Backend is running!',
    timestamp: new Date().toISOString()
  });
});

// Teacher login
app.post('/api/auth/teacher/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  db.get(
    'SELECT * FROM teachers WHERE email = ? AND password = ?',
    [email, password],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!row) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: row.id, email: row.email, type: 'teacher' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: row.id,
          name: row.name,
          email: row.email,
          type: 'teacher'
        }
      });
    }
  );
});

// Student login
app.post('/api/auth/student/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  db.get(
    'SELECT * FROM students WHERE email = ? AND password = ?',
    [email, password],
    (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (!row) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: row.id, email: row.email, type: 'student' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        token,
        user: {
          id: row.id,
          name: row.name,
          email: row.email,
          type: 'student'
        }
      });
    }
  );
});

// Get teacher info
app.get('/api/teachers/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT id, name, email FROM teachers WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Teacher not found' });
    }

    res.json(row);
  });
});

// Get teacher's students
app.get('/api/teachers/:id/students', (req, res) => {
  const { id } = req.params;

  db.all(
    'SELECT id, name, email FROM students WHERE teacher_id = ?',
    [id],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      res.json(rows || []);
    }
  );
});

// Get student info
app.get('/api/students/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT id, name, email, teacher_id FROM students WHERE id = ?', [id], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(row);
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 EasyWay Backend running on port ${PORT}`);
  console.log(`📍 API: http://localhost:${PORT}/api`);
  console.log(`🏥 Health: http://localhost:${PORT}/api/health`);
  console.log(`\n📋 Default Credentials:`);
  console.log(`   Professor: professor@easyway.com / senha123`);
  console.log(`   Aluno 1: aluno1@easyway.com / senha123`);
  console.log(`   Aluno 2: aluno2@easyway.com / senha123\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing database...');
  db.close();
  process.exit(0);
});
