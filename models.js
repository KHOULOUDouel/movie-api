const mongoose = require('mongoose');

// Define the Movies schema
const movieSchema = new mongoose.Schema({
  Title: { type: String, required: true }, // Title of the movie
  Description: { type: String, required: true }, // Description of the movie
  // Genre of the movie
  Genre: {
    Name: String,
    Description: String
  },
  // Director of the movie
  Director: {
    Name: String,
    Bio: String,
    Birth: String,
    Death: String
  },
  // Link to the movie image
  ImagePath: String,
  Featured: Boolean,
});

// Define the Users schema
const userSchema = new mongoose.Schema({
  Username: { type: String, required: true }, // Username of the user
  Password: { type: String, required: true }, // Password of the user
  Email: { type: String, required: true }, // Email of the user
  Birthday: Date, // Birthday of the user
  FavoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }], // Array of favorite movies for the user
});

// Create models based on the schemas
const Movie = mongoose.model("Movie", movieSchema); // Movie model
const User = mongoose.model("User", userSchema); // User model

module.exports = { Movie, User }; // Export models
