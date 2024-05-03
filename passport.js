const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const bcrypt = require('bcryptjs'); // If you're using bcrypt for password hashing

const { User } = require('./models'); // Import your User model

// Define the LocalStrategy for username/password authentication
passport.use(new LocalStrategy({
    usernameField: 'email', // Assuming email is used for username
    passwordField: 'password' // Password field in request body
}, async (email, password, done) => {
    try {
        // Find the user by email
        const user = await User.findOne({ email });
        
        // If user not found or password doesn't match, return error
        if (!user || !bcrypt.compareSync(password, user.password)) {
            return done(null, false, { message: 'Incorrect email or password' });
        }
        
        // If user found and password matches, return user
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));

// Define the JWTStrategy for JWT authentication
passport.use(new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'mylife45' // Replace with your JWT secret key
}, async (jwtPayload, done) => {
    try {
        // Find the user by id in JWT payload
        const user = await User.findById(jwtPayload.sub);
        
        // If user not found, return error
        if (!user) {
            return done(null, false, { message: 'User not found' });
        }
        
        // If user found, return user
        return done(null, user);
    } catch (error) {
        return done(error);
    }
}));
