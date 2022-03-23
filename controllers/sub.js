const Sub = require('../models/sub');
const Product = require('../models/product');
const slugify = require('slugify');

exports.create = async (req, res) => {
    try {
        const { name, parent } = req.body;
        await res.json(await new Sub({ name, parent, slug: slugify(name) }).save());

    } catch (err) {
        res.status(400).send('Create sub-category failed');
    }
};

exports.list = async (req, res) => {
    await res.json(await Sub.find({}).sort({ createdAt: -1 }).exec());
};

exports.read = async (req, res) => {
    const sub = await Sub.findOne({ slug: req.params.slug }).exec();
    const products = await Product.find({ subs: sub })
        .populate('category')
        .exec();
    await res.json({
        sub,
        products,
    });
};

exports.update = async (req, res) => {
    const { name, parent } = req.body;
    try {
        const updated = await Sub.findOneAndUpdate(
            { slug: req.params.slug },
            { name, parent, slug: slugify(name) },
            { new: true }
        );
        await res.json(updated);
    } catch (err) {
        res.status(400).send('Update sub-category failed');
    }
};

exports.remove = async (req, res) => {
    try {
        const deleted = await Sub.findOneAndDelete({ slug: req.params.slug });
        await res.json(deleted);
    } catch (err) {
        res.status(400).send('Delete sub-category failed');
    }
};
