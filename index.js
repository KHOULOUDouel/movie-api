// File: index.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const authRouter = require('./auth'); // Import authentication routes
const { Movie, User } = require('./models');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware for parsing JSON body
app.use(express.json());

// Connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/movieDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Passport middleware
app.use(passport.initialize());

// Import and use the authRouter from auth.js
app.use(authRouter);

// GET all movies (requires JWT token)
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new movie (requires JWT token)
app.post('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
    // Add logic to create a new movie
});

// GET all users (requires JWT token)
app.get('/users', passport.authenticate('jwt', { session: false }), async (req, res) => {
    // Add logic to retrieve all users
});

// POST a new user (no authentication required)
app.post('/users', async (req, res) => {
    // Add logic to create a new user
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


