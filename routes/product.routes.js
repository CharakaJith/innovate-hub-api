const express = require('express');
const router = express.Router();
const authorize = require('../middleware/auth/authorize');
const ProductController = require('../controllers/product.controller');
const { USER_ROLE } = require('../enum/user');

router.get('/', authorize(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN, USER_ROLE.MEMBER), ProductController.getAllProducts);
router.get('/:id', authorize(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN, USER_ROLE.MEMBER), ProductController.getProductById);
router.post('/', authorize(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN), ProductController.createNewProduct);
router.put('/:id', authorize(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN), ProductController.updateProduct);
router.delete('/:id', authorize(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN), ProductController.disableProduct);

module.exports = router;