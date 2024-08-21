const models = require('../models');
const sequelize = models.sequelize; 

const ProductCategoryService = {
    /**
     * Function to create multiple new records in table "productCategory"
     * 
     * @param {Array} categories: array of product categories 
     * @returns an array of newly created product categories
     */
    createCategories: async (categories) => {
        const transaction = await sequelize.transaction(); 

        try {
            const createdCategories = await models.ProductCategory.bulkCreate(categories, {
                ignoreDuplicates: true,
                transaction 
            });

            await transaction.commit(); 
            return createdCategories;
        } catch (error) {
            await transaction.rollback(); rs
            throw new Error(`Internal server error while creating product categories: ${error.message}`);
        }
    },

    /**
     * Function to delete multiple records from table "productCategory" by 'productId'  
     * 
     * @param {Integer} productId: product id of the product category 
     */
    destroyCategories: async (productId) => {
        try {
            await models.ProductCategory.destroy({
                where: {
                    productId: productId,
                }
            });
        } catch (error) {
            throw new Error(`Internal server error while destroying product categories: ${error.message}`);
        }
    }
};

module.exports = ProductCategoryService;
