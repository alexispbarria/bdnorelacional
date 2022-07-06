const mongoose = require('mongoose');
const { Schema } = mongoose;


const ParticipanteSchema = new Schema({
    nombreParticipante: { type: String, required: true },
    arteMarcial: { type: String, required: true },
    edadParticipante: { type: Number, required: true },
    entrenador: { type: String, required: true },
    colorCamiseta: {type: String, required: true },
    paisOrigen: {type: String, required: true },
    fecha: { type: Date, default: Date.now},
    user: { type: String }
});

module.exports = mongoose.model('Participante', ParticipanteSchema)