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

// Activities data
const activities = [
  {
    id: 1,
    date: '19/01',
    title: 'Back to English - Lets Review and Play!',
    level: 'A2',
    type: 'Review',
    description: 'Aula de revisao e diversao com atividades ludicas para reativar o vocabulario'
  },
  {
    id: 2,
    date: '21/01',
    title: 'SUPER SKILLS (Lesson 1)',
    level: 'A2',
    type: 'Lesson',
    description: 'Primeira aula sobre Super Skills focando em boas escolhas e resiliencia'
  },
  {
    id: 3,
    date: '26/01',
    title: 'SUPER SKILLS (Lesson 2)',
    level: 'A2',
    type: 'Lesson',
    description: 'Segunda aula sobre Super Skills focando em escuta ativa e amizade'
  },
  {
    id: 4,
    date: '28/01',
    title: 'SUPER SKILLS (Lesson 3)',
    level: 'A2',
    type: 'Lesson',
    description: 'Terceira aula sobre Super Skills focando em responsabilidade e coragem'
  },
  {
    id: 5,
    date: '02/02',
    title: 'Unit 1: Everyday Life',
    level: 'A2',
    type: 'Unit',
    description: 'Primeira unidade focando em atividades do dia a dia'
  },
  {
    id: 6,
    date: '04/02',
    title: 'Unit 2: Out & About',
    level: 'A2',
    type: 'Unit',
    description: 'Segunda unidade focando em lugares e atividades fora de casa'
  },
  {
    id: 7,
    date: '09/02',
    title: 'Unit 3: People & Feelings',
    level: 'A2',
    type: 'Unit',
    description: 'Terceira unidade focando em pessoas e sentimentos'
  },
  {
    id: 8,
    date: '11/02',
    title: 'Unit 4: The World Around Us',
    level: 'A2',
    type: 'Unit',
    description: 'Quarta unidade focando no mundo e natureza ao redor'
  },
  {
    id: 9,
    date: '16/02',
    title: 'Review - Unit 1 & 2',
    level: 'A2',
    type: 'Review',
    description: 'Aula de revisao das unidades 1 e 2'
  },
  {
    id: 10,
    date: '18/02',
    title: 'Review - Unit 3 & 4',
    level: 'A2',
    type: 'Review',
    description: 'Aula de revisao das unidades 3 e 4'
  },
  {
    id: 11,
    date: '23/02',
    title: 'Assessment - Listening & Speaking',
    level: 'A2',
    type: 'Assessment',
    description: 'Avaliacao de listening e speaking'
  },
  {
    id: 12,
    date: '25/02',
    title: 'Assessment - Reading & Writing',
    level: 'A2',
    type: 'Assessment',
    description: 'Avaliacao de reading e writing'
  }
];

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
    teacher: {
      id: teacher.id,
      name: teacher.name,
      email: teacher.email
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
    student: {
      id: student.id,
      name: student.name,
      email: student.email,
      level: 'A2'
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

// Register new student
app.post('/api/students/register', (req, res) => {
  const { name, email, password, teacher_id } = req.body;

  if (!name || !email || !password || !teacher_id) {
    return res.status(400).json({ error: 'Nome, email, senha e teacher_id sao obrigatorios' });
  }

  // Check if email already exists
  if (users.students.find(s => s.email === email)) {
    return res.status(400).json({ error: 'Email ja cadastrado' });
  }

  // Create new student
  const newStudent = {
    id: Math.max(...users.students.map(s => s.id), 0) + 1,
    name,
    email,
    password,
    teacher_id: parseInt(teacher_id),
    type: 'student'
  };

  users.students.push(newStudent);

  res.status(201).json({
    message: 'Aluno cadastrado com sucesso',
    student: {
      id: newStudent.id,
      name: newStudent.name,
      email: newStudent.email
    }
  });
});

// Get all activities
app.get('/api/activities', (req, res) => {
  const level = req.query.level;
  
  if (level) {
    const filtered = activities.filter(a => a.level.toLowerCase() === level.toLowerCase());
    return res.json(filtered);
  }
  
  res.json(activities);
});

// Get activity by ID
app.get('/api/activities/:id', (req, res) => {
  const { id } = req.params;
  const activity = activities.find(a => a.id === parseInt(id));
  
  if (!activity) {
    return res.status(404).json({ error: 'Activity not found' });
  }
  
  res.json(activity);
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
