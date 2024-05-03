// Define the Movies schema
const movieSchema = new mongoose.Schema({
  title: { type: String, required: true }, // Title of the movie
  genre: { type: String, required: true }, // Genre of the movie
  director: { type: String, required: true }, // Director of the movie
  releaseYear: { type: Number, required: true }, // Release year of the movie
  rating: { type: Number, required: true }, // Rating of the movie
  additionalAttributes: { type: Object }, // Additional attributes of the movie
});

// Define the Users schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true }, // Username of the user
  email: { type: String, required: true }, // Email of the user
  favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }], // Array of favorite movies for the user
});

// Create models based on the schemas
const Movie = mongoose.model("Movie", movieSchema); // Movie model
const User = mongoose.model("User", userSchema); // User model

module.exports = { Movie, User }; // Export models

const mongoose = require("mongoose");

// Your application code here
