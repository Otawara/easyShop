'use strict';
const auth = require('./core/auth/auth.service');

module.exports = (app) => {
    // app
    //     .use('/organizer', require('./organizer-space'))
    //     .use('/program', require('./programm-space'))
    //     .use('/expert', require('./expert-space'))
    //     .use('/author', require('./author-space'))
    //     .use('/', require('./statics'));
    //
    app
    //     .use('/api/v1/auth', require('./core/auth'))
        .use('/api/v1/users', require('./api/user'))
        .use('/api/v1/shops', require('./api/shop'))
    //     .use('/api/v1/publications', require('./api/publication'))
        .use('/api/v1/categories', require('./api/category'));
};
