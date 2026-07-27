const passport = require('passport')
const bcrypt = require('bcrypt')
const pool = require('./db.js')
const { Strategy } = require('passport-local')
const GoogleStrategy = require('passport-google-oauth20').Strategy

passport.use(new Strategy((username, password, done) => {
  pool.query('SELECT * FROM users WHERE username = $1', [username], (error, results) => {
    if (error) {
      return done(error);
    }

    if (results.rows.length === 0) {
      return done(null, false, { message: 'Incorrect username' });
    }

    const user = results.rows[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return done(err);
      }

      if (!isMatch) {
        return done(null, false, { message: 'Incorrect password' });
      }

      return done(null, user);
    });
  });
}));

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: 'https://ecommerce-api-uf9s.onrender.com/auth/google/callback'
}, (accessToken, refreshToken, profile, done) => {
  pool.query('SELECT * FROM users WHERE google_id = $1', [profile.id], (error, results) => {
    if (error) {
      return done(error);
    }

    if (results.rows.length > 0) {
      return done(null, results.rows[0]);
    }

    const email = profile.emails[0].value;
    const username = profile.displayName;

    pool.query(
      'INSERT INTO users (username, email, google_id) VALUES ($1, $2, $3) RETURNING *',
      [username, email, profile.id],
      (error, results) => {
        if (error) {
          return done(error);
        }
        return done(null, results.rows[0]);
      }
    );
  });
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  pool.query('SELECT * FROM users WHERE id = $1', [id], (err, results) => {
    if (err) return done(err);
    done(null, results.rows[0]);
  });
});

module.exports = passport;