const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const models = require('./models'); // Importing Mongoose models

const Movies = models.Movie;
const Users = models.User;

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
        const movies = await Movies.find();

        // Return the list of movies as JSON response
        res.json(movies);
    } catch (err) {
        // If an error occurs, send a 500 status code and error message
        res.status(500).json({ message: err.message });
    }
});

// GET a single movie by title
app.get('/movies/:Title', async (req, res) => {
    const Title = req.params.Title;

    try {
        // Find the movie in the database by its Title
        const movie = await Movies.findOne({ Title });

        // If the movie is found, return its data
        if (movie) {
            return res.json(movie)
        } else {
            // If the movie is not found, send a 404 status code and a message
            res.status(404).json({ message: 'Movie not found' });
        }
    } catch (error) {
        // If an error occurs, send a 500 status code and an error message
        res.status(500).json({ error: error.message });
    }
});

// GET data about a Genre by name
app.get('/movies/genre/:Name', async (req, res) => {
    try {
        const movie = await Movies.findOne({ 'Genre.Name': req.params.Name });
        if (movie && movie.Genre) {
            // Extract and return only the genre's information
            const genre = {
                Name: movie.Genre.Name,
                Description: movie.Genre.Description
            }
            return res.json(genre)
        } else {
            res.status(404).json({ message: 'Genre not found' })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

// GET data about a director (Name, Bio, Birth, Death) by name
app.get('/movies/Director/:Name', async (req, res) => {
    try {
        // Search for a movie with the specified director
        const movie = await Movies.findOne({ 'Director.Name': req.params.Name });

        if (movie && movie.Director) {
            // Extract and return only the director's information
            const directorInfo = {
                Name: movie.Director.Name,
                Bio: movie.Director.Bio,
                Birth: movie.Director.Birth,
                Death: movie.Director.Death
            };
            return res.json(directorInfo);
        } else {
            res.status(404).json({ message: 'Genre not found' })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: err.message });
    }
});

// GET all users
app.get('/users', async (req, res) => {
    try {
        const users = await Users.find();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST a new user
app.post('/users', async (req, res) => {
    const { Username, Password, Email, Birthday } = req.body;
    try {

        const user = await Users.findOne({ Username });

        // Check if a user already exists
        if (user) {
            return res.status(400).json({ message: Username + 'already exists' });
        }

        const newUser = await Users.create({
            Username,
            Password,
            Email,
            Birthday,
        })

        res.status(201).json(newUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET a user by username
app.get('/users/:Username', async (req, res) => {
    try {
        const user = await Users.findOne({ Username: req.params.Username });
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
app.post('/users/:Username/movies/:MovieID', async (req, res) => {
    const { Username, MovieID } = req.params;

    try {

        const updatedUser = await Users.findOneAndUpdate(
            { Username },
            { $push: { FavoriteMovies: MovieID } },
            { new: true } // This line ensures that the updated document is returned
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
app.delete('/users/:Username/movies/:MovieID', async (req, res) => {
    const { Username, MovieID } = req.params;

    try {
        // Remove the movie from user's favorites
        const updatedUser = await Users.findOneAndUpdate(
            { Username },
            { $pull: { FavoriteMovies: MovieID } },
            { new: true } // This line ensures that the updated document is returned
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
app.delete('/users/:Username', async (req, res) => {
    const { Username } = req.params;

    try {
        // Delete the user from the database
        const user = await Users.findOneAndDelete({ Username });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

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