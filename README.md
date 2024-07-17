# Movie API Documentation

## Technologies Used
- Node.js
- Express.js
- MongoDB with Mongoose
- bcrypt
- body-parser
- cors
- express-validator
- jsonwebtoken
- passport
- passport-jwt
- passport-local
- uuid

## Getting Started
1. Install dependencies: `npm install`
2. Start the server: `npm start` or for development with nodemon: `npm run dev`

## API Endpoints

### 1. Get All Movies
**Request:**
- Method: GET
- URL: `/movies`
- Request Body: None

**Response:**
- Format: JSON
- Description: A JSON object containing data on all movies.

### 2. Get All Users
**Request:**
- Method: GET
- URL: `/users`
- Request Body: None

**Response:**
- Format: JSON
- Description: A JSON object containing data on all users.

### 3. Create a User
**Request:**
- Method: POST
- URL: `/users`
- Request Body format: JSON
```json
{ 
  "username": "eva_user", 
  "password": "eva_secure_pass", 
  "email": "eva@email.com", 
  "birthDate": { "$date": "1995-11-28T00:00:00.000Z" }, 
  "favoriteMovies": [ "Inception" ] 
}

 You can find the code for this project at: https://github.com/KHOULOUDouel/movie-api
