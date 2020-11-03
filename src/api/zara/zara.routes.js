const { Router } = require('express');
const router = new Router();

const zaraCtrl = require('./zara.controller')

router.get('/main', zaraCtrl.indexPage);
router.get('/categorias', zaraCtrl.getCategories);
router.get('/viewImages', zaraCtrl.resultsImages)
router.post('/categoria/:categoria', zaraCtrl.categoria);
router.post('/subcategoria', zaraCtrl.subcategoria);

module.exports = router;