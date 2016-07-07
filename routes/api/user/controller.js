'use strict';

const User = require('../../../models/user');
// const Publication = require('../../../models/publication');


exports.validateUser = (req, res, next) => {
    req.checkBody('firstName', 'The first name is require').notEmpty();
    req.checkBody('lastName', 'The last name is require').notEmpty();
    req.checkBody('email', 'Invalid email').notEmpty().isEmail();
    req.checkBody('gender', 'Invalid gender').notEmpty().matches(/[fe]{0,1}male/);
    req.checkBody('password', 'Invalid password').notEmpty().isLength({
        min: 6,
        max: 16
    });

    let errors = req.validationErrors();

    if (errors) {
        return res.send(500, {
            ok: false,
            message: errors[0].msg,
            errors: errors
        });
    } else {
        next();
    }

};

exports.create = (req, res, next) => {
    let user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        location: req.body.location,
        email: req.body.email,
        phone: req.body.phone,
        gender: req.body.gender,
        role: req.body.role,
        password: req.body.password,
        role: req.body.role,
        created: new Date()
    });
    user.save((err) => {
        if(err) {
            return res.send({
                ok: false,
                message: 'Something went wrong!',
                err: err
            });
        } else {
            //TODO send activation email
            return res.send({
                ok: true,
                data: user,
                message: 'You account has been succefully created!'
            });
        }
    });
};

exports.update = (req, res, next) => {
    let currentUserId = req.params.userId;
    // let currentUserId = req.user._id;
    console.log(req.body);
    User.findById(currentUserId)
        .select('-hashedPassword -salt -__v -deleted -created')
        .exec((err, user) => {
        if(err || !user) {
            return res.send({
                ok: false,
                message: 'User not found'
            });
        }
        user.firstName = req.body.firstName || user.firstName;
        user.lastName = req.body.lastName || user.lastName;
        user.email = req.body.email || user.email;
        user.gender = req.body.gender || user.gender;
        user.location = req.body.location || user.location;
        user.phone = req.body.phone || user.phone;
        user.avatar_url = req.body.avatar_url || user.avatar_url;
        if(req.body.password)
            user.password = req.body.password;
        user.updated = new Date();
        user.save((err) => {
            if(err) {
                return res.send({
                    ok: false,
                    message: 'Error updating profile please try later!'
                });
            }
            return res.send({
                ok: true,
                data: user
            });
        });
    });
};

exports.delete = (req, res, next) => {
    let currentUserId = req.params.userId;

    User.findById(currentUserId)
        .exec((err, user) => {
        if(err || !user) {
            return res.send({
                ok: false,
                message: 'User not found'
            });
        }
        user.updated = new Date();
        user.deleted = true;
        user.save((err) => {
            if(err) {
                return res.send({
                    ok: false,
                    message: 'Error updating profile, please try later!'
                });
            }
            return res.send({
                ok: true,
                data: user
            });
        });
    });
};

exports.getUsersByRole = (req, res, next) => {
    let role = req.params.role;
    User.find({"role" : role, "deleted" : false})
        .exec((err, users) => {
        if(err || !users) {
            return res.send({
                ok: false,
                message: 'Users not found'
            });
        }
        console.log(users);
        return res.send({
            ok: true,
            data: users
        });
    });
};

exports.getUsersCount = (req, res, next) => {
    let role = req.params.role;
    console.log(role);
    User.find({"role" : role, "deleted" : false})
        .count()
        .exec((err, usersCount) => {
        if(err || !usersCount) {
            return res.send({
                ok: false,
                message: 'Users not found'
            });
        }
        console.log(usersCount);
        return res.send({
            ok: true,
            data: usersCount
        });
    });
};

exports.getUsersByCongre = (req, res, next) => {
    let congreId = req.params.congreId;

    User.find({"registrations.congreId" : congreId})
        .exec((err, users) => {
        if(err || !users) {
            return res.send({
                ok: false,
                message: 'Users not found'
            });
        }
        return res.send({
            ok: true,
            data: users
        });
    });
};

// exports.getReviewersByEvaluation = (req, res, next) => {
//     let evaluation = req.params.evaluation;
//
//     console.log(evaluation);
//     Publication.distinct("evaluation.reviewer_id",{"evaluation.value" : evaluation})
//         .exec((err, reviewers_id) => {
//         if(err || !reviewers_id) {
//             return res.send({
//                 ok: false,
//                 message: 'Publications not found'
//             });
//         }
//
//         console.log(reviewers_id);
//
//         User.find({"_id" : {"$in" : reviewers_id}})
//             .exec((err, reviewers) => {
//             if(err || !reviewers) {
//                 return res.send({
//                     ok: false,
//                     message: 'Reviewers not found'
//                 });
//             }
//             return res.send({
//                 ok: true,
//                 data: reviewers
//             });
//         });
//     });
// };

exports.me = (req, res, next) => {
    console.log('me ctrl');
    const currentUserId = req.user._id;
    console.log('req id');
    User.findById(currentUserId)
      .select('-hashedPassword -salt -deleted')
      .exec((err, user) => {
        if(err || !user) {
            return res.send({
                ok: false,
                message: 'User not found!'
            });
        }
        return res.send({
            ok: true,
            data: user
        });
    });
};
