const express = require('express');
const { restart } = require('nodemon');
const router = express.Router();


const Participante = require('../models/Participante'); // LLAMANDO AL ESQUEMA CREADO "PARTICIPANTE.JS"
const { isAuthenticated } = require('../helpers/auth');


router.get('/participantes/add', isAuthenticated, (req, res) => {
    res.render('participantes/nuevo-participante');
});

// agregar un nuevo participante (CREATE)
router.post('/participantes/nuevo-participante', isAuthenticated, async (req, res) => {
    const { nombreParticipante, arteMarcial, edadParticipante, entrenador, colorCamiseta, paisOrigen }= req.body;
    const errors = []; // CREANDO UN ARREGLO PARA EL MANEJO DE ERRORES, CADA VEZ QUE NO SE ENCUENTRE ALGUNO DE LOS DATOS INGRESADOS, SE INSERTARÁ DENTRO DEL ARREGLO EL TEXTO INDICADO
    if(!nombreParticipante){
        errors.push({text: 'Inserte un nombre de participante'}); // AGREGANDO EL ERROR DENTRO DEL ARREGLO
    }
    if(!arteMarcial){
        errors.push({text: 'Inserte un arte marcial del participante'}); // AGREGANDO EL ERROR DENTRO DEL ARREGLO
    }
    if(!edadParticipante){
        errors.push({text: 'Ingrese la edad del participante'}); // AGREGANDO EL ERROR DENTRO DEL ARREGLO
    }
    if(edadParticipante < 18 || edadParticipante > 40){
        errors.push({text: 'El participante debe tener entre 18 o 40 años, ingreso inválido.'}); // AGREGANDO EL ERROR DENTRO DEL ARREGLO
    }
    if(!entrenador){
        errors.push({text: 'Inserte el nombre del entrenador'}); // AGREGANDO EL ERROR DENTRO DEL ARREGLO
    }
    if(!colorCamiseta){
        errors.push({text: 'Ingrese el color de la indumentaria del participante'}); // AGREGANDO EL ERROR DENTRO DEL ARREGLO
    }
    if(!paisOrigen){
        errors.push({text: 'Ingrese el país de origen del participante'}); // AGREGANDO EL ERROR DENTRO DEL ARREGLO
    }
    if(errors.length > 0) {
        res.render('participantes/nuevo-participante', {
            errors,
            nombreParticipante,
            arteMarcial,
            edadParticipante,
            entrenador,
            colorCamiseta,
            paisOrigen
        })
    } else {
        const nuevoParticipante = new Participante({ nombreParticipante, arteMarcial, edadParticipante, entrenador, colorCamiseta, paisOrigen });
        nuevoParticipante.user = req.user.id;
        await nuevoParticipante.save();
        req.flash('success_msg', 'Participante agregado satisfactoriamente!')
        res.redirect('/participantes')
        
    }
    
});

// metodo get para mostrar toda la base de datos.
router.get('/participantes', isAuthenticated, async (req, res) => {
    const idUsuario = req.user.id;
    const cantidad = await Participante.find({user: idUsuario}).count();
    const participantes = await Participante.find({user: idUsuario}).sort({nombreParticipante: 'asc'}).lean(); // ordenando según el nombre de forma descendente.
    res.render('participantes/all-participantes', { participantes, cantidad});
});


// filtrar ascendentemente por pais
router.get('/participantes/participantespais', isAuthenticated, async (req, res) => {
    const idUsuario = req.user.id;
    const cantidad = await Participante.find({user: idUsuario}).count(); // cantidad de participantes inscritos (dependiendo el usuario)
    const participantes = await Participante.find({user: idUsuario}).sort({paisOrigen:1}).lean(); // ordenar ascendentemente por pais
    res.render('participantes/all-participantes', { participantes, cantidad });
});

// mostrar todos los paises, sin repetir, para posteriormente filtrar.
router.get('/participantes/paises', isAuthenticated, async (req, res) => {
    const paises = await Participante.distinct('paisOrigen'); // filtrando paises sin que se repitan
    res.render('participantes/paises', {paises}); // renderizando archivo hbs que muestra cada uno de los paises inscritos
});

// filtrar solo por el país
router.get('/participantes/paisOrigen/:pais', isAuthenticated, async (req, res) => {
    const idUsuario = req.user.id;
    const cantidad = await Participante.find({$and: [{user: idUsuario}, {paisOrigen: req.params.pais}]}).count(); // contar cantidad de participantes por su país
    const participantes = await Participante.find({$and: [{user: idUsuario}, {paisOrigen: req.params.pais}]}).lean(); // Mostrar los recuadros rependiendo de su pais
    res.render('participantes/all-participantes', {participantes, cantidad});
});

// mostrar todas las artes marciales, sin repetir, para posteriormente filtrar.
router.get('/participantes/artesmarciales', isAuthenticated, async (req, res) => {
    const artesmarciales = await Participante.distinct('arteMarcial'); // filtrando artes marciales sin que estas se repitan
    res.render('participantes/artesmarciales', {artesmarciales}); // renderizando archivo hbs que muestra cada una de las artes marciales inscritas
});


// filtrar participantes por su arte marcial
router.get('/participantes/arteMarcial/:art', isAuthenticated, async (req, res) => {
    const idUsuario = req.user.id; 
    const cantidad = await Participante.find({$and: [{user: idUsuario}, {arteMarcial: req.params.art}]}).count(); // contar cantidad de participantes por arte marcial
    const participantes = await Participante.find({$and: [{user: idUsuario}, {arteMarcial: req.params.art}]}).lean(); // Mostrar los recuadros dependiendo de su arte marcial
    res.render('participantes/all-participantes', {participantes, cantidad});
});

// categoria sub23
router.get('/participantes/sub23', isAuthenticated, async (req, res) => {
    const idUsuario = req.user.id;
    const cantidad = await Participante.find({$and: [{user: idUsuario}, {edadParticipante: {$lte: 23}}]}).count(); // contar cuantos participantes sub-23 existen
    const participantes = await Participante.find({$and: [{user: idUsuario}, {edadParticipante: {$lte: 23}}]}).lean(); // Mostrar en recuadros los participantes sub23
    res.render('participantes/all-participantes', {participantes, cantidad});
});

// categoria adultos
router.get('/participantes/adultos', isAuthenticated, async (req, res) => {
    const idUsuario = req.user.id;
    const cantidad = await Participante.find({$and: [{user: idUsuario}, {edadParticipante: {$gt: 23, $lt: 30}}]}).count(); // contar cuantos participantes adultos existen
    const participantes = await Participante.find({$and: [{user: idUsuario}, {edadParticipante: {$gt: 23, $lt: 30}}]}).lean(); // Mostrar en recuadros los participantes adultos
    res.render('participantes/all-participantes', {participantes, cantidad});
});

// categoria senior
router.get('/participantes/senior', isAuthenticated, async (req, res) => {
    const idUsuario = req.user.id;
    const cantidad = await Participante.find({$and: [{user: idUsuario}, {edadParticipante: {$gte: 30}}]}).count(); // contar cuantos participantes senior existen
    const participantes = await Participante.find({$and: [{user: idUsuario}, {edadParticipante: {$gte: 30}}]}).lean(); // Mostrar en recuadros los participantes senior
    res.render('participantes/all-participantes', {participantes, cantidad});
});






//metodo get para editar el contenido de la base de datos, filtrando a través de su ID.
router.get('/participantes/edit/:id', isAuthenticated, async (req, res) => {
    const participante = await Participante.findById(req.params.id).lean();
    res.render('participantes/edit-participante', {participante});
});

// metodo put para guardar los datos seleccionados a través del ID, esto redirigirá a "participantes", lugar donde se muestran todos los datos ingresados.
router.put('/participantes/edit-participante/:id', isAuthenticated, async (req, res) => {
    const { nombreParticipante, arteMarcial, edadParticipante, entrenador, colorCamiseta, paisOrigen }= req.body;
    await Participante.findByIdAndUpdate(req.params.id, { nombreParticipante, arteMarcial, edadParticipante, entrenador, colorCamiseta, paisOrigen })
    req.flash('success_msg', 'Participante modificado correctamente!');
    res.redirect('/participantes');
});

router.delete('/participantes/delete/:id', isAuthenticated, async (req, res) => {
    await Participante.findByIdAndDelete(req.params.id).lean();
    req.flash('success_msg', 'Participante eliminado correctamente!');
    res.redirect('/participantes');
});


module.exports = router;