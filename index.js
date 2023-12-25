const express = require('express');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');

const app = express();
const port = 3000;

// Підключення до бази даних (SQLite)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'users.db', // SQLite database file
});

app.get('/', (req, res) => {
  res.send('Welcome to the API!');
});


// Модель користувача
const User = sequelize.define('user', {
  username: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
});

// Створення таблиці у базі даних
sequelize.sync({ force: true }).then(() => {
  console.log('Database and tables created!');
});

app.use(bodyParser.json());

// API для отримання списку користувачів
app.get('/users', async (req, res) => {
  const users = await User.findAll();
  res.json({ users });
});

// API для додавання нового користувача
app.post('/users', async (req, res) => {
  const { username, email } = req.body;
  try {
    const newUser = await User.create({ username, email });
    res.json({ message: 'User added successfully!', user: newUser });
  } catch (error) {
    res.status(400).json({ message: 'Failed to add user.', error: error.message });
  }
});

// Запуск сервера
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
