const models = require('../models');
const sequelize = models.sequelize; 

const ProductService = {
    /**
     * Function to create a new record in table "product"
     * 
     * @param {Object} productDetails: product details object 
     * @returns a newly created product object
     */
    createNewProduct: async (productDetails) => {
        try {
            return await models.Product.create(productDetails);
        } catch (error) {
            throw new Error(`Internal server error while creating a new product: ${error.message}`);
        }
    },

    /**
     * Function to fetch a record from table "product" by column 'productBrand', 'productAdminId' and 'isActive'
     * 
     * @param {String} brand: brand of the products
     * @param {Integer} adminId: product admin id
     * @returns a product object if exists, else null
     */
    findProductByBrand: async (brand, adminId) => {
        try {
            return await models.Product.findOne({
                where: {
                    productBrand: brand,
                    productAdminId: adminId,
                    isActive: true,
                }
            });
        } catch (error) {
            throw new Error(`Internal server error while fetching a product by brand: ${error.message}`);
        }
    },

    /**
     * Function to fetch a record from table "product" by column 'productAdminId'
     * 
     * @param {Integer} adminId: id of the product admin 
     * @returns an array of product details
     */
    findAllProductsByAdminId: async (adminId) => {
        try {
            return await models.Product.findAll({
                where: {
                    productAdminId: adminId,
                    isActive: true,
                },
                include: [
                    {
                        model: models.ProductCategory,
                        as: 'productCategories'
                    },
                    {
                        model: models.ProductMember,
                        as: 'productMembers'
                    },
                    {
                        model: models.ProductTag,
                        as: 'productTags'
                    },
                ]
            });
        } catch (error) {
            throw new Error(`Internal server error while fetching all product by admin id: ${error.message}`);
        }
    },
    
    /**
     * Function to fetch a record from table "product" by column 'id'
     * 
     * @param {Integer} id: product id 
     * @returns an object of product details if exists, else null
     */
    findProductById: async (id) => {
        try {
            return await models.Product.findOne({
                where: {
                    id: id,
                    isActive: true,
                },
                include: [
                    {
                        model: models.ProductCategory,
                        as: 'productCategories'
                    },
                    {
                        model: models.ProductMember,
                        as: 'productMembers'
                    },
                    {
                        model: models.ProductTag,
                        as: 'productTags'
                    },
                ]
            });
        } catch (error) {
            throw new Error(`Internal server error while fetching a product by id: ${error.message}`);
        }
    },

    /**
     * Function to update a record in table "product" by column 'id'
     * 
     * @param {Object} productDetails: product detail object 
     * @returns an array of updated product details, else an empty array
     */
    updateProductById: async (productDetails) => {
        try {
            return await models.Product.update(productDetails, {
                where: {
                    id: productDetails.id,
                },
                returning: true,
            });
        } catch (error) {
            throw new Error(`Internal server error while updating a product by id: ${error.message}`);
        }
    }
};

module.exports = ProductService;
