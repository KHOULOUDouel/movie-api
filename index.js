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
