const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { Movie, User } = require('./models'); // Importing Mongoose models

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB database
mongoose.connect('mongodb://localhost:27017/cfDB', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// GET all movies
app.get('/movies', async (req, res) => {
    try {
        // Retrieve all movies from the database
        const movies = await Movie.find();
        
        // Return the list of movies as JSON response
        res.json(movies);
    } catch (err) {
        // If an error occurs, send a 500 status code and error message
        res.status(500).json({ message: err.message });
    }
});

// GET a single movie by title
app.get('/movies/:title', async (req, res) => {
    const title = req.params.title;

    try {
        // Find the movie in the database by its title
        const movie = await Movie.findOne({ title });

        // If the movie is found, return its data
        if (movie) {
            const { title, genre, director, releaseYear, rating, additionalAttributes } = movie;
            res.json({ title, genre, director, releaseYear, rating, additionalAttributes });
        } else {
            // If the movie is not found, send a 404 status code and a message
            res.status(404).json({ message: 'Movie not found' });
        }
    } catch (error) {
        // If an error occurs, send a 500 status code and an error message
        res.status(500).json({ error: error.message });
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

// POST route to register a new user
app.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Check if the email is already registered
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Create a new user
        const newUser = new User({ username, email, password });

        // Save the new user to the database
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST route to add a movie to user's favorites
app.post('/users/:userId/favorites', async (req, res) => {
    const userId = req.params.userId;
    const { movieId } = req.body;

    try {
        // Find the user by ID
        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the movie already exists in user's favorites
        if (user.favoriteMovies.includes(movieId)) {
            return res.status(400).json({ message: 'Movie already in favorites' });
        }

        // Add the movie to user's favorites
        user.favoriteMovies.push(movieId);

        // Save the updated user
        await user.save();

        res.json({ message: 'Movie added to favorites successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE route to remove a movie from user's favorites
app.delete('/users/:userId/favorites/:movieId', async (req, res) => {
    const userId = req.params.userId;
    const movieId = req.params.movieId;

    try {
        // Find the user by ID
        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the movie exists in user's favorites
        if (!user.favoriteMovies.includes(movieId)) {
            return res.status(400).json({ message: 'Movie not found in favorites' });
        }

        // Remove the movie from user's favorites
        user.favoriteMovies = user.favoriteMovies.filter(id => id.toString() !== movieId);

        // Save the updated user
        await user.save();

        res.json({ message: 'Movie removed from favorites successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE route to deregister a user
app.delete('/users/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        // Find the user by ID
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Delete the user from the database
        await User.findByIdAndDelete(userId);

        res.json({ message: 'User deregistered successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
