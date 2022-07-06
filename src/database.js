const mongoose = require('mongoose')

//mongoose.connect('mongodb://127.0.0.1/campeonato')
    mongoose.connect('mongodb+srv://alexispbarria:bdnorelacional@inacap.fgu1h.mongodb.net/campeonato?retryWrites=true&w=majority')
    .then(db => console.log('Base de datos conectada'))
    .catch(err => console.error(err));