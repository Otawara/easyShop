'use strict';

const route = require('express').Router();
const auth = require('../../core/auth/auth.service');
const controller = require('./controller');

route
    .post('/', controller.newCategory)
    .put('/:categoryId', controller.updateCategory)
    .delete('/:categoryId', controller.deleteCategory)
    .get('/:categoryId', controller.getCategoryById)
    .get('/shops/:shopId', controller.getCategoriesByShop)
//    .get('/presentations/:presentationId', controller.getPresentationById)
    .get('/:categoryId/products', controller.getProductsByCategory);

module.exports = route;
