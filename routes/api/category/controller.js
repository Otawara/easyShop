'use strict';

const Category = require('../../../models/category');
const User = require('../../../models/user');

exports.validateCategory = (req, res, next) => {
    req.checkBody('title', 'title is required').notEmpty();
    req.checkBody('description', 'description is required').notEmpty();
    req.checkBody('thematique', 'thematique is required').notEmpty();
    req.checkBody('start_date', 'start_date is required').notEmpty();
    req.checkBody('end_date', 'end_date is required').notEmpty();

    let errors = req.validationErrors();

    if(errors) {
        return res.send(500, {
            ok: false,
            message: errors[0],
            err: errors
        });
    } else {
        next();
    }
};

exports.newCategory = (req, res, next) => {
    let category = new Category({
        title: req.body.title,
        description: req.body.description,
        shopId: req.body.shopId,
        created: new Date()
    });

    category.save((err) => {
        if(err) {
            return res.send({
                ok: false,
                message: 'Error in creation'
            });
        }
        return res.send({
            ok: true,
            message: 'Category created'
        });
    });
};

exports.updateCategory = (req, res, next) => {
    let categoryId = req.params.categoryId;

    Category.findById(categoryId)
        .exec((err, category) => {
        if(err || !category) {
            return res.send({
                ok: false,
                message: 'Category not found'
            });
        }
        category.title = req.body.title || category.title;
        category.description = req.body.description || category.description;
        category.products = req.body.products || category.products;
        category.updated = new Date();

        category.save((err) => {
            if(err) {
                return res.send({
                    ok: false,
                    message: 'Error while updating'
                });
            }
            return res.send({
                ok: true,
                data: category
            });
        });
    });
};

exports.deleteCategory = (req, res, next) => {
    let categoryId = req.params.categoryId;

    Category.findById(categoryId)
        .exec((err, category) => {
        if(err || !category) {
            return res.send({
                ok: false,
                message: 'Category not found'
            });
        }

        category.deleted = true;
        category.updated = new Date();

        category.save((err) => {
            if(err) {
                return res.send({
                    ok: false,
                    message: 'Error while deleting'
                });
            }
            return res.send({
                ok: true,
                data: category
            });
        });
    });
};

exports.getCategoryById = (req, res, next) => {
    let categoryId = req.params.categoryId;

    Category.findById(categoryId)
        .populate("shopId")
        // .populate({
        //     path: 'presentations.publication_id',
        //     populate: { path: 'author' }
        //   })
        .exec((err, category) => {
        if(err || !category) {
            return res.send({
                ok: false,
                message: 'Category not found'
            });
        }
        return res.send({
            ok: true,
            data: category
        });
    });
};

exports.getCategoriesByShop = (req, res, next) => {
    let shopId = req.params.shopId;

    Category.find({"shopId" : shopId, "deleted" : false})
        // .populate("presentations.speaker")
        // .populate({
        //     path: 'presentations.publication_id',
        //     populate: { path: 'author' }
        //   })
        .exec((err, categories) => {
        if(err || !categories) {
            return res.send({
                ok: false,
                message: 'categories not found'
            });
        }
        return res.send({
            ok: true,
            data: categories
        });
    });
};

exports.getProductsByCategory = (req, res, next) => {
    let categoryId = req.params.categoryId;

    Category.findById(categoryId)
        .select("products")
        .exec((err, products) => {
        if(err || !products) {
            return res.send({
                ok: false,
                message: 'Products not found'
            });
        }
        return res.send({
            ok: true,
            data: products
        });
    });
};
