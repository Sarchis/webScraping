const morgan = require("morgan");
const cors = require("cors");
const express = require('express');

module.exports = (app) => {
    app.use(express.json());
    app.use(cors());
    app.use(express.urlencoded({ extended: true }))
    app.use(morgan('dev'))
} 