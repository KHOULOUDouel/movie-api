const express = require('express');
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

// Connect to MongoDB database
const dbURI = process.env.DATABASE_URI || 'mongodb+srv://khouloudouelhazi24:8cU07W0WrRkGHXSc@myflixcluster.7ekdmro.mongodb.net/myFlixDB?retryWrites=true&w=majority&appName=myFlixCluster';

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('Connected to MongoDB Atlas');
});

// Define a route for the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the MyFlix API!');
});

// Require and import auth.js file passing the Express app as an argument
let auth = require('./auth')(app);

// Middleware for JWT authentication
const jwtAuth = passport.authenticate('jwt', { session: false });

// CORS configuration allowing specific origins
let allowedOrigins = ['http://localhost:8080', 'http://testsite.com'];

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
            return callback(new Error(message), false);
        }
        return callback(null, true);
    }
}));

// POST route for user registration with data validation
app.post('/users', [
    // Validate username
    body('Username').isLength({ min: 5 }).withMessage('Username must be at least 5 characters long'),

    // Validate password
    body('Password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),

    // Validate email
    body('Email').isEmail().withMessage('Invalid email'),

    // Validate birthday
    body('Birthday').isISO8601().withMessage('Invalid date format (YYYY-MM-DD)'),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // If validation passes, proceed with user creation
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
app.get('/movies', jwtAuth, async (req, res) => {
    try {
        const movies = await Movie.find();
        res.json(movies);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// GET a single movie by title
app.get('/movies/:Title', jwtAuth, async (req, res) => {
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
app.get('/movies/genre/:Name', jwtAuth, async (req, res) => {
    try {
        const movie = await Movie.findOne({ 'Genre.Name': req.params.Name });
        if (movie && movie.Genre) {
            const genre = {
                Name: movie.Genre.Name,
                Description: movie.Genre.Description
            }
            return res.json(genre);
        } else {
            res.status(404).json({ message: 'Genre not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// GET data about a director by name
app.get('/movies/director/:Name', jwtAuth, async (req, res) => {
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
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// GET all users
app.get('/users', jwtAuth, async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST a new user
app.post('/users', async (req, res) => {
    const { Username, Password, Email, Birthday } = req.body;
    try {
        const user = await User.findOne({ Username });

        if (user) {
            return res.status(400).json({ message: Username + ' already exists' });
        }

        const hashedPassword = User.hashPassword(Password);
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

// GET a user by username
app.get('/users/:Username', jwtAuth, async (req, res) => {
    try {
        const user = await User.findOne({ Username: req.params.Username });
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// POST route to add a movie to user's favorites
app.post('/users/:Username/movies/:MovieID', jwtAuth, async (req, res) => {
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
app.delete('/users/:Username/movies/:MovieID', jwtAuth, async (req, res) => {
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
app.put('/users/:Username', jwtAuth, async (req, res) => {
    try {
        const updatedUser = await User.findOneAndUpdate({ Username: req.params.Username },
            {
                $set:
                {
                    Username: req.body.Username,
                    Password: req.body.Password,
                    Email: req.body.Email,
                    Birthday: req.body.Birthday,
                }
            },
            { new: true });
        if (updatedUser) {
            res.json(updatedUser);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: error.message });
    }

});

// DELETE route to deregister a user
app.delete('/users/:Username', jwtAuth, async (req, res) => {
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
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
    console.log('Listening on Port ' + port);
});
