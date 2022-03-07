const Category = require('../models/category');
const slugify = require('slugify');

exports.create = async (req, res) => {
    try {
        const { name } = req.body;
        await res.json(await new Category({ name, slug: slugify(name) }).save());

    } catch (err) {
        res.status(400).send('Create category failed');
    }
};

exports.list = async (req, res) => {
    await res.json(await Category.find({}).sort({ createdAt: -1 }).exec());
};

exports.read = async (req, res) => {
    const category = await Category.findOne({ slug: req.params.slug }).exec();
    await res.json(category);
};

exports.update = async (req, res) => {
    const { name } = req.body;
    try {
        const updated = await Category.findOneAndUpdate(
            { slug: req.params.slug },
            { name, slug: slugify(name) },
            { new: true }
        );
        await res.json(updated);
    } catch (err) {
        res.status(400).send('Update category failed');
    }
};

exports.remove = async (req, res) => {
    try {
        const deleted = await Category.findOneAndDelete({ slug: req.params.slug });
        await res.json(deleted);
    } catch (err) {
        res.status(400).send('Delete category failed');
    }
};
