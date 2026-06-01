require('dotenv').config();
const express = require('express');
const { connectDB } = require('./db/connect');
const app = express();
const indexRouter = require('./routes/index');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger-output.json');
const passport = require('passport');
const session = require('express-session');
const GitHubStrategy = require('passport-github2').Strategy;
const cors = require('cors');

//Get port from .env file
const port = process.env.PORT || 3000;

//FOR RENDER AND PASSPORTAUTH/SESSIONS
app.set('trust proxy', 1); //helps OAuth to not randomly fail

//MIDDLEWARE: MUST PUT THIS BEFORE ROUTES OR POST WILL NOT WORK
app
    //Rather than using bodyParser, use express.json to do the same thing
    .use(express.json())
    .use(express.urlencoded({ extended: true })) //tells Express to parse incoming form data so it can be accessed in req.body
    //EXPRESS SESSION
    .use(session({
        secret: "secret",
        resave: false,
        saveUninitialized: true
    }))
    //PASSPORT
    .use(passport.initialize())
    .use(passport.session())
    //CORS (allows frontend and backend to run on different ports, acts as a security boundary)
    .use(cors())
    

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
},
    function (accessToken, refreshTOekn, profile, done) {
        //User.findOrCreate({ githubId: profile.id }, function (err, user) {
        return done(null, profile);
        //});
    }
));

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

app.get('/',
    /* #swagger.ignore = true */
    (req, res) => {
    res.send(req.session.user //condition
        ? `Logged in as ${req.session.user.username || req.session.user.login}` //if true
        : "Logged Out") //if false
});

app.get('/github/callback',
    /* #swagger.ignore = true */
    passport.authenticate('github', {
    failureRedirect: '/api-docs', session: false}),
    (req, res) => {
        req.session.user = req.user;
        res.redirect('/');
    }
);


//ROUTES
app.use('/', indexRouter);


//SWAGGER: API DOCUMENTATION
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


//ERRORS
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message });
});


//CONNECT TO DB AND START SERVER
const startServer = async () => {
    try {
        //Connect to database
        await connectDB();
        //Start server on port listed in .env file
        app.listen(port, () => console.log(`Database listening and server running on port ${port}`));

    } catch (err) {
        console.error(err);
    }
}

startServer();