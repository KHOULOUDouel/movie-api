const mongoose = require('mongoose');

// Define the Movies schema
const movieSchema = new mongoose.Schema({
    title: { type: String, required: true },
    genre: { type: String, required: true },
    director: { type: String, required: true },
    releaseYear: { type: Number, required: true },
    rating: { type: Number, required: true },
    additionalAttributes: { type: Object }
});

// Define the Users schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }]
});

// Create models based on the schemas
const Movie = mongoose.model('Movie', movieSchema);
const User = mongoose.model('User', userSchema);

module.exports = { Movie, User };
