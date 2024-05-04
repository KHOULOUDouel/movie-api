const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { Movie, User } = require('./models'); // Importing Mongoose models

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/movieDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// GET all movies
app.get('/movies', async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new movie
app.post('/movies', async (req, res) => {
    const movie = new Movie({
        title: req.body.title,
        genre: req.body.genre,
        director: req.body.director,
        releaseYear: req.body.releaseYear,
        rating: req.body.rating,
        additionalAttributes: req.body.additionalAttributes
    });

    try {
        const newMovie = await movie.save();
        res.status(201).json(newMovie);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// GET all users
app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new user
app.post('/users', async (req, res) => {
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        favoriteMovies: req.body.favoriteMovies
    });

    try {
        const newUser = await user.save();
        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



