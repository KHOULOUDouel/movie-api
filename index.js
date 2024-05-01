const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();

// Use Morgan middleware to log all requests
app.use(morgan('combined'));

// Serve static files from the "public" folder
app.use(express.static('public'));

let topMovies = [
  {
    title: 'Titanic',
    director: 'James Cameron'
  },
  {
    title: 'Twilight',
    director: 'Catherine Hardwicke'
  },
  {
    title: 'Remember me',
    director: 'Allen Coulter'
  },
  {
    title: 'Ghost Ship',
    director: 'Steve Beck'
  },
  {
    title: 'Schindler\'s List',
    director: 'Steven Spielberg'
  },
  {
    title: 'The Lord of the Rings',
    director: 'Peter Jackson'
  },
  {
    title: 'Forrest Gump',
    director: 'Robert Zemeckis'
  },
  {
    title: 'Inception',
    director: 'Christopher Nolan'
  },
  {
    title: 'The Matrix',
    director: 'Lana Wachowski, Lilly Wachowski'
  },
  {
    title: 'Goodfellas',
    director: 'Martin Scorsese'
  }
];

// GET requests
app.get('/', (req, res) => {
  res.send('Welcome to my movie club! Check out our top movies at /movies.');
});

// Endpoint for documentation
app.get('/documentation', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
});

// Endpoint for retrieving all movies
app.get('/movies', (req, res) => {
  res.json(topMovies);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// listen for requests
const port = 8080;
app.listen(port, () => {
  console.log(`Your app is listening on port ${port}.`);
});

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
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

