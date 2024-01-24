const Users = require('../models/users')
const Events = require('../models/events')
const RSVP = require('../models/rsvp')


exports.getNew = (req, res, next) => {
    res.render('./user/new')
}

exports.postNew = (req, res, next) => {
    let user = new Users(req.body);

  

    if (req.file) {
        user.image = "/../profileImage/" + req.file.filename;
    }else {
        user.image = "/../profileImage/stockProfile.png";
    }

    user.save()
    .then(() => {
        req.flash('success', 'You have successfully signed up. Please login');
        res.redirect('/users/login')
    })
    .catch(err => {
        if (err.name === "ValidationError") 
        {
          req.flash("error", "Please fill out all the fields");
          return res.redirect("/users/new");
        }

        if (err.code === 11000)
        {
          req.flash("error", "Email address has been used");
          return res.redirect("/users/new");
        }

        next(err);
    })
    
}

exports.getLogin = (req, res, next) => {
    res.render('./user/login')
}


exports.postLogin = (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;

    Users.findOne({ email: email })
    .then(user => {
        if (!user) {
            req.flash('error', 'Wrong email address');  
            res.redirect('/users/login');
            } else {
            user.comparePassword(password)
            .then(result=>{
                if(result) {
                    req.session.user = { id: user._id, name: user.firstName }
                    req.flash('success', 'You have successfully logged in');
                    res.redirect('/users/profile');
            } else {
                req.flash('error', 'wrong password');      
                res.redirect('/users/login');
            }
            });     
        }     
    })
    .catch(err => next(err));
}

exports.getProfile = (req, res, next) => { 
    let id = req.session.user.id;

    
    Promise.all([Users.findById(id), Events.find({host: id}), RSVP.find({user: id}).populate('event', 'title')]) 
    .then(results=> {
        
        console.log(results);
        const [user, event, rsvp] = results;
        res.render('./user/profile', {user, event, rsvp})
    })
    .catch(err=>next(err));
}

exports.getLogout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            next(err);
        } else {
            res.redirect('/');
        }
    });
};



    




