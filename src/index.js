const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const passport = require('passport')

const app = express();
require('./database');
require('./config/passport');

//configuraciones
app.set('port', process.env.PORT || 3000); // asignando puertos

app.set('views', path.join(__dirname, 'views')); //avisarle la ruta de direccion de la carpeta views

app.engine('.hbs', exphbs.engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    runtimeOptions: {
        allowProtoPropertiesByDefault: true
        //allowProtoMethodsByDefault: true
    },
    extname: '.hbs'
}));
app.set('view engine', '.hbs');


//funciones para ejecutar antes de llegar al servidor
app.use(express.urlencoded({extended: false}));

app.use(methodOverride('_method'));

app.use(session({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true
}));


app.use(passport.initialize());
app.use(passport.session());
app.use(flash());


//variables globales (datos que toda la app tendrá accesibles)
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
})


//rutas
app.use(require('./routes/index'));
app.use(require('./routes/campeonato'));
app.use(require('./routes/users'));


//archivos estaticos (tipo css, html, etc)
app.use(express.static(path.join(__dirname, 'public')));




//inicializacion de servidor
app.listen(app.get('port'), () => {
    console.log('Servidor conectado en el puerto', app.get('port'));
});
