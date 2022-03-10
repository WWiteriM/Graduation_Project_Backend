const Product = require('../models/product');
const slugify = require('slugify');

exports.create = async (req, res) => {
    try {
        req.body.slug = slugify(req.body.title);
        await res.json(await new Product(req.body).save());

    } catch (err) {
        res.status(400).send('Create product failed');
    }
};
