const Event = require('../models/events');
const {body, validationResult} = require('express-validator');




exports.validateID = (req, res, next) => {
    let id = req.params.id;

    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid Event id');
        err.status = 404;
        return next(err);
    }

    Event.findById(id)
    .then(events=>{
        if(events) {
            req.events = events;
            return next();
        } else {
            let err = new Error('Cannot find a Event with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch (err=>next(err))
}






exports.validateLogin = [body('email', 'Email must be vaild').isEmail().trim().escape().normalizeEmail(), 
body('password', 'Password must be at 8 characters and at most 64 characters').isLength({min: 8, max: 64})]

exports.validateSignUp = 
[   body('firstName', 'First name is required').notEmpty().trim().escape(),
    body('lastName', 'Last name is required').notEmpty().trim().escape(),
    body('email', 'Email must be vaild').isEmail().trim().escape().normalizeEmail().notEmpty(), 
    body('password', 'Password must be at 8 characters and at most 64 characters').isLength({min: 8, max: 64})
]


exports.validateResult = (req, res, next)=>{
    let errors = validationResult(req);

    if(!errors.isEmpty()) {
        errors.array().forEach(error=>{
            req.flash('error', error.msg);
        });
        return res.redirect('back');
    } 
        return next();


}


exports.validateEvent = [
    body('category', 'Category is required').trim().escape().custom((value, { req }) => {   
        
        const category =['Music Concert', 'Movie Night', 'Sports Game', 'Food Festival', 'Game Night']

        if(category.includes(req.body.category)) {
            return true;
        }else {
            if(req.body.category == '') {
                throw new Error('Category must not be empty');
            } else {
                throw new Error('Invalid Category');
            }
        }

    }),
    body('title', 'Title is required').notEmpty().trim().escape(),
    body('details', 'Description is required').notEmpty().trim().escape(),
    body('location', 'Location is required').notEmpty().trim().escape(),
    body('eventStart', 'Start Date is required').trim().escape().isISO8601().custom((value, { req }) => {
        const start = new Date(value);
        const now = new Date();
        if (start < now) {
            throw new Error('Start Date must be after todays date');
        }
        return true;
    }).toDate(),
    body('eventEnd', 'End date is required').trim().escape().isISO8601().custom((value, { req }) => {
        const start = new Date(req.body.eventStart);
        const end = new Date(value);
        if (start >= end) {
            throw new Error('End date must be after the start date');
        }
        return true;
    }).toDate(),
]


exports.validateRSVP = [
        
        body('status', 'Status is required').trim().escape().custom((value, { req }) => {   
            
            const status =['Yes', 'No', 'Maybe']

    
            if(status.includes(req.body.status)) {
                return true;
            }else {
                if(req.body.status == '') {
                    throw new Error('Status must not be empty');
                } else {
                    throw new Error('Invalid Status');
                }
            }
    
            
    
        })
]
