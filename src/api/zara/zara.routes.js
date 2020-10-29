const { Router } = require('express');
const router = new Router();

const zaraCtrl = require('./zara.controller')

router.get('/main', zaraCtrl.indexPage);
router.get('/categorias', zaraCtrl.getCategories);
router.post('/categoria/:categoria', zaraCtrl.categoria);
// router.post('/categoria/:categoria/:subcategoria', zaraCtrl.subcategoria);
router.post('/subcategoria/', zaraCtrl.subcategoria);

module.exports = router;