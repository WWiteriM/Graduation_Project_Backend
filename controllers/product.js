const Product = require('../models/product');
const slugify = require('slugify');

exports.create = async (req, res) => {
    try {
        req.body.slug = slugify(req.body.title);
        await res.json(await new Product(req.body).save());

    } catch (err) {
        // res.status(400).send('Create product failed');
       await res.status(400).json({
            err: err.message,
        });
    }
};

exports.listAll = async (req, res) => {
    const products = await Product.find({})
        .limit(parseInt(req.params.count))
        .populate('category')
        .populate('subs')
        .sort([['createdAt', 'desc']])
        .exec();
    await res.json(products);
};

exports.remove = async (req, res) => {
    try {
        const deleted = await Product.findOneAndRemove({ slug: req.params.slug }).exec();
        await res.json(deleted);
    } catch (err) {
        res.status(400).send('Delete product failed');
    }
};

exports.read = async (req, res) => {
    const product = await Product.findOne({ slug: req.params.slug })
        .populate('category')
        .populate('subs')
        .exec();
    await res.json(product);
};
