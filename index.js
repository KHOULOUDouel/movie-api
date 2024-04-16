const express = require('express');
const app = express();

const express = require('express');
const app = express();

const bodyParser = require('body-parser');



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

app.get('/documentation', (req, res) => {                  
  res.sendFile('public/documentation.html', { root: __dirname });
});

app.get('/movies', (req, res) => {
  res.json(topMovies);
});


// listen for requests
app.listen(8080, () => {
  console.log('Your app is listening on port 8080.');
});
