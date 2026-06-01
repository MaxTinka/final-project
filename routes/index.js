const express = require("express");
const router = express.Router();
const passport = require('passport');
const bookRouter = require('./bookRoutes');
const patronRouter = require('./patronRoutes');
const locationRouter = require('./locationRoutes');
const copyRouter = require('./copyRoutes');

//Routes for collections
router.use('/book', bookRouter);
router.use('/patron', patronRouter);
router.use('/location', locationRouter);
router.use('/copy', copyRouter);

//Login Route
router.get('/login',
    /* #swagger.ignore = true */
    passport.authenticate('github')
);

//Logout Route
router.get('/logout',
    /* #swagger.ignore = true */
    function (req, res, next) {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.session.destroy(() => { //we are manually storing the user in req.session.user, so even if passport logs out our session still has the user name saved unless this line is included.
            res.redirect('/');
        });        
    });
});

//Export
module.exports = router;