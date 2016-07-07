'use strict';

const route = require('express').Router();

const auth = require('../../core/auth/auth.service');
const controller = require('./controller');

route
    .post('/', controller.newPublication)
    .get('/', controller.getPublications)
    .get('/NotAssigned', controller.getPublicationsNotAssigned)
    .get('/count', controller.getPublicationsCount)
    .get('/:publicationId', controller.getPublicationById)
    .get('/authors/:authorId', controller.getPublicationsByAuthor)
    .get('/reviewers/:reviewerId', controller.getPublicationsByReviewer)
    .put('/:publicationId', controller.updatePublication)
    .delete('/:publicationId', controller.deletePublication);

module.exports = route;