'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
    if (!process.env[name]) {
        throw new Error('You must set the ' + name + ' environment variable');
    }
    return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
    env: process.env.NODE_ENV,

    // Root path of server
    root: path.normalize(__dirname + '/../'),

    // Server port
    port: process.env.PORT || 3000,

    // Should we populate the DB with sample data?
    seedDB: false,

    // Secret for session, you will want to change this and make it an environment variable
    secrets: {
        session: 'anas ffff'
    },

    // List of user roles
    userRoles: ['user', 'owner', 'admin'],

    // MongoDB connection options
    mongo: {
        options: {
            db: {
                safe: true
            }
        }
    },
    host: process.env.HOSTNAME || 'http://localhost:9090',

    sendGridAPI: "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",
    //admin: 'hyldau@engineer.com'
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
    all,
    require('./' + process.env.NODE_ENV + '.js') || {});
