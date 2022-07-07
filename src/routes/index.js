const express = require('express');
const router = express.Router();

const Participante = require('../models/Participante'); // LLAMANDO AL ESQUEMA CREADO "PARTICIPANTE.JS"


router.get('/', (req, res) => {
    res.render('index');
});

router.get('/about', (req, res) => {
    res.render('about')
})


module.exports = router;