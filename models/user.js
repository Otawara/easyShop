'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');

var UserSchema = new Schema({
    email: {
        type: String,
        lowercase: true
    },
    role: {
        type: String,
        enum: ['user', 'owner', 'admin'],
        default: 'user'
    },
    active: {
        type: Boolean,
        default: true
    },
    hashedPassword: String,
    salt: String,
    firstName: String,
    lastName: String,
    gender: {
        type: String,
        enum: ['male', 'female']
    },
    location: {
        address: String,
        country: String,
        city: String,
        geo: []
    },
    phone: String,
    avatar_url: String,
    favs: [{
        shopId: {
            type: Schema.Types.ObjectId,
            ref: 'Shop'
        },
        created: Date
    }],
    deleted: {
        type: Boolean,
        default: false
    },
    updated: {
        type: Date,
        default: Date.now
    },
    created: {
        type: Date,
        default: Date.now
    }
});

/**
 * Virtuals
 */
UserSchema
    .virtual('password')
    .set(function(password) {
        this._password = password;
        this.salt = this.makeSalt();
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() {
        return this._password;
    });

// Non-sensitive info we'll be putting in the token
UserSchema
    .virtual('token')
    .get(function() {
        return {
            '_id': this._id,
            'role': this.role
        };
    });

/**
 * Validations
 */

// Validate empty email
UserSchema
    .path('email')
    .validate(function(email) {
        return email.length;
    }, 'Email cannot be blank');

// Validate empty password
UserSchema
    .path('hashedPassword')
    .validate(function(hashedPassword) {
        return hashedPassword.length;
    }, 'Password cannot be blank');

// Validate email is not taken
UserSchema
    .path('email')
    .validate(function(value, respond) {
        var self = this;
        this.constructor.findOne({
            email: value
        }, function(err, user) {
            if (err) throw err;
            if (user) {
                if (self.id === user.id) return respond(true);
                return respond(false);
            }
            respond(true);
        });
    }, 'The specified email address is already in use.');

var validatePresenceOf = function(value) {
    return value && value.length;
};

/**
 * Pre-save hook
 */
UserSchema
    .pre('save', function(next) {
        this.updated = new Date();
        if (!this.isNew) return next();

        if (!validatePresenceOf(this.hashedPassword))
            next(new Error('Invalid password'));
        else
            next();
    });

/**
 * Pre find the user
 */
UserSchema.methods.toJSON = function() {
    var user = this.toObject();
    delete user.hashedPassword;
    delete user.salt;
    delete user.deleted;
    delete user.created;
    return user;
};

/**
 * Methods
 */
UserSchema.methods = {
    /**
     * Authenticate - check if the passwords are the same
     *
     * @param {String} plainText
     * @return {Boolean}
     * @api public
     */
    authenticate: function(plainText) {
        return this.encryptPassword(plainText) === this.hashedPassword;
    },

    /**
     * Make salt
     *
     * @return {String}
     * @api public
     */
    makeSalt: function() {
        return crypto.randomBytes(16).toString('base64');
    },

    /**
     * Encrypt password
     *
     * @param {String} password
     * @return {String}
     * @api public
     */
    encryptPassword: function(password) {
        if (!password || !this.salt) return '';
        var salt = new Buffer(this.salt, 'base64');
        return crypto.pbkdf2Sync(password, salt, 10000, 64).toString('base64');
    }
};

module.exports = mongoose.model('User', UserSchema);
