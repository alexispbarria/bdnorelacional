const passport = require('passport');
const localStrategy = require('passport-local');

const User = require('../models/User');

// validar si el usuario existe y si coincide su correo con su contraseña.
passport.use(new localStrategy ( {
    usernameField: 'email'
}, async (email, password, done) => {
    const user = await User.findOne({email: email});
    if(!user) {
        return done(null, false, { message: 'Usuario no encontrado. '});
    } else {
        const match = await user.matchPassword(password);
        if(match) {
            return done(null, user);
        } else {
            return done(null, false, { message: 'Contraseña Incorrecta'});
        }
    }
}));

// guardando datos de inicio de sesión
passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});