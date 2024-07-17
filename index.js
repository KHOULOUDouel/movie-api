require('dotenv').config(); // Load environment variables at the top

const express = require('express');
const { v4: uuidv4 } = require('uuid'); // Correct import for uuid
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const cors = require('cors');
const models = require('./models');
const passport = require('passport');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('./passport');

const { User, Movie } = models;

const app = express();
app.use(bodyParser.json());
app.use(passport.initialize());

// Connect to MongoDB database using environment variable for the URI
mongoose.connect(process.env.CONNECTION_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB Atlas');
});

// Enable CORS for all origins by default
app.use(cors());

// Handle preflight requests 
app.options('*', cors());

/**
 * @fileoverview Entry point for the Movies API server.
 * @module myFlixAPI
 */

// POST route for user registration with data validation
/**
 * @function
 * @name createUser
 * @description Register a new user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
app.post('/users', [
    body('Username').isLength({ min: 5 }).withMessage('Username must be at least 5 characters long'),
    body('Password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('Email').isEmail().withMessage('Invalid email'),
    body('Birthday').isISO8601().withMessage('Invalid date format (YYYY-MM-DD)'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { Username, Password, Email, Birthday } = req.body;
    try {
        const existingUser = await User.findOne({ Username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        const hashedPassword = await bcrypt.hash(Password, 10);
        const newUser = await User.create({
            Username,
            Password: hashedPassword,
            Email,
            Birthday,
        });

        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET all movies (Protected route)
/**
 * @function
 * @name getAllMovies
 * @description Get all movies
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
app.get('/movies', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a single movie by title
/**
 * @function
 * @name getMovieByTitle
 * @description Get a movie by title
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
app.get('/movies/:Title', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const title = req.params.Title;

    try {
        const movie = await Movie.findOne({ Title: title });

        if (movie) {
            return res.json(movie);
        } else {
            res.status(404).json({ message: 'Movie not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET data about a Genre by name
/**
 * @function
 * @name getGenreByName
 * @description Get genre by name
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
app.get('/movies/genre/:Name', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const movie = await Movie.findOne({ 'Genre.Name': req.params.Name });
        if (movie && movie.Genre) {
            const genre = {
                Name: movie.Genre.Name,
                Description: movie.Genre.Description
            };
            return res.json(genre);
        } else {
            res.status(404).json({ message: 'Genre not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET data about a director by name
/**
 * @function
 * @name getDirectorByName
 * @description Get director by name
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
app.get('/movies/director/:Name', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const movie = await Movie.findOne({ 'Director.Name': req.params.Name });

        if (movie && movie.Director) {
            const directorInfo = {
                Name: movie.Director.Name,
                Bio: movie.Director.Bio,
                Birth: movie.Director.Birth,
                Death: movie.Director.Death
            };
            return res.json(directorInfo);
        } else {
            res.status(404).json({ message: 'Director not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET all users
/**
 * @function
 * @name getAllUsers
 * @description Get all users
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
app.get('/users', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET a user by username
/**
 * @function
 * @name getUserByUsername
 * @description Get user by username
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
app.get('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    try {
        const user = await User.findOne({ Username: req.params.Username });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST route to add a movie to user's favorites
/**
 * @function
 * @name addFavoriteMovie
 * @description Add a movie to user's favorites
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { Username, MovieID } = req.params;

    try {
        const updatedUser = await User.findOneAndUpdate(
            { Username },
            { $push: { FavoriteMovies: MovieID } },
            { new: true }
        );

        if (updatedUser) {
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE route to remove a movie from user's favorites
/**
 * @function
 * @name removeFavoriteMovie
 * @description Remove a movie from user's favorites
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { Username, MovieID } = req.params;

    try {
        const updatedUser = await User.findOneAndUpdate(
            { Username },
            { $pull: { FavoriteMovies: MovieID } },
            { new: true }
        );

        if (updatedUser) {
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// UPDATE route to update a user
/**
 * @function
 * @name updateUser
 * @description Update user information
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
app.put('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { Username } = req.params;
    const { Password, Email, Birthday } = req.body;

    let updatedFields = { Email, Birthday };

    if (req.body.Password) {
        const hashedPassword = await bcrypt.hash(Password, 10);
        updatedFields.Password = hashedPassword;
    }

    try {
        const updatedUser = await User.findOneAndUpdate(
            { Username },
            { $set: updatedFields },
            { new: true }
        );

        if (updatedUser) {
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE route to deregister a user
/**
 * @function
 * @name deleteUser
 * @description Deregister a user
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 */
app.delete('/users/:Username', passport.authenticate('jwt', { session: false }), async (req, res) => {
    const { Username } = req.params;

    try {
        const user = await User.findOneAndDelete({ Username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: 'User deregistered successfully', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
/**
 * @function
 * @name startServer
 * @description Start the server
 */
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});
