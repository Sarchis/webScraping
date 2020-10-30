const { Schema, model } = require('mongoose');

const GaleriaSchema = new Schema({
    label: String,
    title: String,
    img: String
})

module.exports = model('Galeria', GaleriaSchema);