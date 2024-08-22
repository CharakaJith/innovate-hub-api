const logger = require('../middleware/logger/logger');
const UserService = require('../services/user.service');
const ProductService = require('../services/product.service');
const ProductCategoryService = require('../services/productCategory.service');
const ProductTagService = require('../services/productTag.service');
const ProductMemberService = require('../services/productMember.service');
const field_validator = require('../util/field_validator');
const { PRODUCTE_CATEGORIES } = require('../enum/product');
const { USER_ROLE } = require('../enum/user');
const { LOG_TYPE } = require('../enum/log');
const { MESSAGE } = require('../enum/message');

const ProductController = {
    createNewProduct: async (req, res) => {
        try {
            const { brand, description, members, categories, tags } = req.body;
            const admin = req.user;

            // validate user inputs
            const errorArray = [];
            errorArray.push(await field_validator.check_empty_string(brand, 'brand', 'Product brand'));
            
            // validate categories
            if (categories?.length) {
                for (const category of categories) {
                    if (!Object.values(PRODUCTE_CATEGORIES).includes(category)) {
                        errorArray.push({
                            field: "categories",
                            message: `Invalid category type ${category}!`,
                        });
                    }
                }
            }

            // validate member ids
            if (members?.length) {
                const adminId = admin.role == USER_ROLE.SUPER_ADMIN ? admin.id : admin.adminId;
                const users = await UserService.findUsersByIdAndAdminId(members, adminId);

                const foundIds = users.map(user => user.id);
                const invalidIds = members.filter(id => !foundIds.includes(id));
                
                for (const invalidId of invalidIds) {
                    errorArray.push({
                        field: "members",
                        message: MESSAGE.INVALID_USER_ID(invalidId),
                    });
                }
            }

            // check inputs
            const filteredErrors = errorArray.filter(obj => obj !== 1);
            if (filteredErrors.length !== 0) {
                logger(LOG_TYPE.ERROR, false, 500, filteredErrors, req);

                return res.status(400).json({
                    success: false,
                    error: filteredErrors,
                });
            } 

            // validate brand
            const product = await ProductService.findProductByBrand(brand, admin.id);
            if (product) {
                throw new Error(MESSAGE.BRAND_ALREADY_SAVED(brand));
            } 

            // create new product
            const productDetails = {
                productBrand: brand,
                productDescription: description,
                productAdminId: admin.role == USER_ROLE.SUPER_ADMIN ? admin.id : admin.adminId,
                isActive: true,
            };
            let newProduct = await ProductService.createNewProduct(productDetails);
            
            // create product categories, tags and members
            let producteCategories;
            let productMembers;            
            let productTags;
            if (categories?.length) {
                const categoryArray = categories.map(category => ({
                    productId: newProduct.id,
                    productCategory: category,
                }));
            
                producteCategories = await ProductCategoryService.createCategories(categoryArray);
            }
            if (tags?.length) {
                const tagsArray = tags.map(tag => ({
                    productId: newProduct.id,
                    productTag: tag,
                }));

                productTags = await ProductTagService.createTags(tagsArray);
            }
            if (members?.length) {
                const membersArray = members.map(member => ({
                    productId: newProduct.id,
                    productMemberId: member,
                }));

                productMembers = await ProductMemberService.createMembers(membersArray);
            }

            logger(LOG_TYPE.INFO, true, 200, `New product ${newProduct.id} | ${newProduct.productBrand} created by ${admin.id} | ${admin.email}!`, req);
            return res.status(200).json({
                success: true,
                message: {
                    product: newProduct,
                    producteCategories: producteCategories ? producteCategories : [],
                    productMembers: productMembers ? productMembers : [],
                    productTags: productTags ? productTags : [],
                },
            });
        } catch (error) {
            logger(LOG_TYPE.ERROR, false, 500, `Failed to create a new product: ${error.message}`, req);

            return res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    },

    getAllProducts: async (req, res) => {
        try {
            const admin = req.user;

            // get products
            const adminId = admin.role == USER_ROLE.SUPER_ADMIN ? admin.id : admin.adminId;
            let products = await ProductService.findAllProductsByAdminId(adminId);

            // check request user accesibility
            const userProducts = [];
            if (admin.role == USER_ROLE.MEMBER) {
                for (const product of products) {
                    for (const member of product.productMembers) {
                        if (member.productMemberId === admin.id) {
                            userProducts.push(product);
                        }
                    }
                }
            }
            products = userProducts.length != 0 ? userProducts : products;

            logger(LOG_TYPE.INFO, true, 200, `All products fetched by ${admin.id} | ${admin.email}!`, req);
            return res.status(200).json({
                success: true,
                message: products
            });
        } catch (error) {
            logger(LOG_TYPE.ERROR, false, 500, `Failed to get all products: ${error.message}`, req);

            return res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    },

    getProductById: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const admin = req.user;

            // validate product
            const product = await ProductService.findProductById(id);
            if (!product) {
                throw new Error(MESSAGE.INVALID_PRODUCT_ID(id));
            }

            // check user accessibility
            let isAccessible = true;
            if (admin.role == USER_ROLE.MEMBER)  {
                isAccessible = product.productMembers.some(member => member.productMemberId === admin.id);
            }
            if (!isAccessible) {
                throw new Error(MESSAGE.PERMISSION_DENIED);
            }

            logger(LOG_TYPE.INFO, true, 200, `Product ${product.id} | ${product.productBrand} fetched by ${admin.id} | ${admin.email}!`, req);
            return res.status(200).json({
                success: true,
                message: product,
            });
        } catch (error) {
            logger(LOG_TYPE.ERROR, false, 500, `Failed to get the product by id: ${error.message}`, req);

            return res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    },

    updateProduct: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const { brand, description, members, categories, tags } = req.body;
            const admin = req.user;
            
            // validate categories
            const errorArray = [];
            if (categories?.length) {
                for (const category of categories) {
                    if (!Object.values(PRODUCTE_CATEGORIES).includes(category)) {
                        errorArray.push({
                            field: "categories",
                            message: `Invalid category type ${category}!`,
                        });
                    }
                }
            }

            // validate member ids
            if (members?.length) {
                const adminId = admin.role == USER_ROLE.SUPER_ADMIN ? admin.id : admin.adminId;
                const users = await UserService.findUsersByIdAndAdminId(members, adminId);

                const foundIds = users.map(user => user.id);
                const invalidIds = members.filter(id => !foundIds.includes(id));
                
                for (const invalidId of invalidIds) {
                    errorArray.push({
                        field: "members",
                        message: MESSAGE.INVALID_USER_ID(invalidId),
                    });
                }
            }

            // check inputs
            const filteredErrors = errorArray.filter(obj => obj !== 1);
            if (filteredErrors.length !== 0) {
                logger('error', false, 500, filteredErrors, req);

                return res.status(400).json({
                    success: false,
                    error: filteredErrors,
                });
            } 

            // validate brand
            const product = await ProductService.findProductById(id);
            if (!product) {
                throw new Error(MESSAGE.INVALID_PRODUCT_ID(id));
            }

            // validate product admin
            if (product.productAdminId != admin.id && product.productAdminId != admin.adminId) {
                throw new Error(MESSAGE.PERMISSION_DENIED);
            }

            // update product
            const productDetails = {
                id: product.id,
                productBrand: brand,
                productDescription: description,                
            };
            const updatedProduct = await ProductService.updateProductById(productDetails);

            // create product categories, tags and members
            let producteCategories;
            let productMembers;            
            let productTags;
            if (categories?.length) {
                const categoryArray = categories.map(category => ({
                    productId: id,
                    productCategory: category,
                }));
            
                await ProductCategoryService.destroyCategories(id);
                producteCategories = await ProductCategoryService.createCategories(categoryArray);
            }
            if (tags?.length) {
                const tagsArray = tags.map(tag => ({
                    productId: id,
                    productTag: tag,
                }));
                
                await ProductTagService.destroyTags(id);
                productTags = await ProductTagService.createTags(tagsArray);
            }
            if (members?.length) {
                const membersArray = members.map(member => ({
                    productId: id,
                    productMemberId: member,
                }));

                await ProductMemberService.destroyMembers(id);
                productMembers = await ProductMemberService.createMembers(membersArray);
            }

            logger(LOG_TYPE.INFO, true, 200, `Product ${product.id} | ${product.productBrand} updated by ${admin.id} | ${admin.email}!`, req);
            return res.status(200).json({
                success: true,
                message: {
                    product: updatedProduct[1][0],
                    producteCategories: producteCategories ? producteCategories : product.productCategories,
                    productMembers: productMembers ? productMembers : product.productMembers,
                    productTags: productTags ? productTags : product.productTags,
                },
            });
        } catch (error) {
            logger(LOG_TYPE.ERROR, false, 500, `Failed to update the product: ${error.message}`, req);

            return res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    },

    disableProduct: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const admin = req.user;

            // validate product
            const product = await ProductService.findProductById(id);
            if (!product) {
                throw new Error(MESSAGE.INVALID_PRODUCT_ID(id));
            }

            // check request user accessibility
            if (admin.id != product.productAdminId && admin.adminId != product.productAdminId) {
                throw new Error(MESSAGE.PERMISSION_DENIED);
            }

            // disable product
            const productDetails = {
                id: product.id,
                isActive: false,
            };
            await ProductService.updateProductById(productDetails);

            logger(LOG_TYPE.INFO, true, 200, `Product ${product.id} | ${product.productBrand} is disabled by ${admin.id} | ${admin.email}!`, req);
            return res.status(200).json({
                success: true,
                message: MESSAGE.USER_DISABLED,
            });
        } catch (error) {
            logger(LOG_TYPE.ERROR, false, 500, `Failed to disable the product: ${error.message}`, req);

            return res.status(500).json({
                success: false,
                error: error.message,
            });
        }
    }
};

module.exports = ProductController;