const express = require('express');
const router = express.Router();

const Participante = require('../models/Participante'); // LLAMANDO AL ESQUEMA CREADO "PARTICIPANTE.JS"


router.get('/', async (req, res) => {
    const cantidadInscritos = await Participante.aggregate([{$group: {_id: null, edadPromedio: {$avg: edadParticipante}}}, {$project: {_id: 0}}])
    res.render('index', {cantidadInscritos});
});

router.get('/about', (req, res) => {
    res.render('about')
})


module.exports = router;