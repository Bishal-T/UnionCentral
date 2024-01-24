const Events = require('../models/events');
const RSVP = require('../models/rsvp');

exports.isGuest = (req, res, next) => {
    if(!req.session.user)
        return next()
    else {
        req.flash('error', 'You have already logged in');
        res.redirect('/users/profile');
    }
}


// check to see if user is authenticated
exports.isLoggedIn = (req, res, next) => {
    if(req.session.user)
        return next()
    else {
        req.flash('error', 'You need to login first');
        res.redirect('/users/login');
    }
}

// check if user is author of a story
exports.isAuthor = (req, res, next) => {
    let id = req.params.id;

    console.log(id);

    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid story id');
        err.status = 400;
        return next(err);
    }

    Events.findById(id)
    .then(event=>{
      
        if(event) {
            if(event.host == req.session.user.id) {
                return next();
            }else {
                let err = new Error('You are not authorized to access this resource');
                err.status = 401;
                return next(err);
            }
        } else {
            let err = new Error('Cannot find a story with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch (err=>next(err))
    
}



exports.isAuthorRSVP = (req, res, next) => {
    let id = req.params.id;
    let userId = req.session.user.id;

    console.log(id);

    Events.findById(id)
    .then(event=>{
      
        if(event) {
            if(event.host == userId) {
                let err = new Error('You are not authorized to access this resource');
                err.status = 401;
                return next(err);
            }else {
                return next();
            }
        } else {
            let err = new Error('Cannot find a story with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch (err=>next(err))
    
}
