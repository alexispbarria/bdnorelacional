const express = require('express');
const router = express.Router();

const User = require('../models/User')

const passport = require('passport');


router.get('/users/signin',  (req, res) => {
    res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {
    successRedirect: '/participantes',
    failureRedirect: '/users/signin',
    failureFlash: true
}));



router.get('/users/signup', (req, res) => {
    res.render('users/signup');
});

// METODO POST, PARA RETENER LOS VALORES INGRESADOS DENTRO DE SIGNUP, JUNTO CON SU RESPECTIVO MANEJO DE ERRORES
router.post('/users/signup', async (req, res) => {
    const { name, email, password, confirm_password } = req.body;
    const errors = [];
    if(name.length <= 0 ){
        errors.push({text: '¡Ingrese un nombre de usuario!'})
    }
    if(email.length <= 0 ){
        errors.push({text: '¡Ingrese un email!'})
    }
    if(password.length <= 0 ){
        errors.push({text: '¡Ingrese una contraseña!'})
    }
    if(confirm_password.length <= 0 ){
        errors.push({text: '¡Confirme su contraseña!'})
    }
    if(password != confirm_password){
        errors.push({text: '¡Las contraseñas no coinciden!'})
    }
    if (password.length < 4) {
        errors.push({text: 'La contraseña debe ser de mínimo 4 caracteres'})
    }
    if(errors.length > 0){
        res.render('users/signup', {errors, name, email, password, confirm_password });
    } else {
        const emailUser = await User.findOne({email: email});
        if(emailUser) {
            req.flash('error_msg', 'El email se encuentra registrado');
            res.redirect('/users/signup');
        }
        const newUser = new User({name, email, password});
        newUser.password = await newUser.encryptPassword(password);
        await newUser.save();
        req.flash('success_msg', 'Cuenta creada satisfactoriamente!');
        res.redirect('/users/signin');
    }
});

// generando un cierre de sesión
router.get('/users/logout', (req, res) => {
    req.logout(req.user, err => {
        if(err) return next(err);
        res.redirect('/');
    });
});

module.exports = router;