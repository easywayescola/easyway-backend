const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'easyway-secret-key-2024';

// Middleware
app.use(cors());
app.use(express.json());

// In-memory data storage
const users = {
  teachers: [
    { id: 1, name: 'Professor', email: 'professor@easyway.com', password: '123', type: 'teacher' }
  ],
  students: [
    { id: 1, name: 'Aluno 1', email: 'aluno1@easyway.com', password: '123', type: 'student', teacher_id: 1 },
    { id: 2, name: 'Aluno 2', email: 'aluno2@easyway.com', password: '123', type: 'student', teacher_id: 1 }
  ]
};

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

  const teacher = users.teachers.find(t => t.email === email && t.password === password);

  if (!teacher) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: teacher.id, email: teacher.email, type: 'teacher' },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    token,
    user: {
      id: teacher.id,
      name: teacher.name,
      email: teacher.email,
      type: 'teacher'
    }
  });
});

// Student login
app.post('/api/auth/student/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  const student = users.students.find(s => s.email === email && s.password === password);

  if (!student) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { id: student.id, email: student.email, type: 'student' },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  res.json({
    token,
    user: {
      id: student.id,
      name: student.name,
      email: student.email,
      type: 'student'
    }
  });
});

// Get teacher info
app.get('/api/teachers/:id', (req, res) => {
  const { id } = req.params;
  const teacher = users.teachers.find(t => t.id === parseInt(id));

  if (!teacher) {
    return res.status(404).json({ error: 'Teacher not found' });
  }

  res.json({
    id: teacher.id,
    name: teacher.name,
    email: teacher.email
  });
});

// Get teacher's students
app.get('/api/teachers/:id/students', (req, res) => {
  const { id } = req.params;
  const students = users.students.filter(s => s.teacher_id === parseInt(id));

  res.json(students.map(s => ({
    id: s.id,
    name: s.name,
    email: s.email
  })));
});

// Get student info
app.get('/api/students/:id', (req, res) => {
  const { id } = req.params;
  const student = users.students.find(s => s.id === parseInt(id));

  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }

  res.json({
    id: student.id,
    name: student.name,
    email: student.email,
    teacher_id: student.teacher_id
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
  console.log(`   Professor: professor@easyway.com / 123`);
  console.log(`   Aluno 1: aluno1@easyway.com / 123`);
  console.log(`   Aluno 2: aluno2@easyway.com / 123\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  process.exit(0);
});
