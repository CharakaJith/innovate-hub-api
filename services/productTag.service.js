const models = require('../models');
const { destroyCategories } = require('./productCategory.service');
const sequelize = models.sequelize; 

const ProductTagService = {
    /**
     * Function to create multiple new records in table "productTag"
     * 
     * @param {Array} tags: array of product tags 
     * @returns an array of newly created product tags
     */
    createTags: async (tags) => {
        try {
            return await models.ProductTag.bulkCreate(tags, {
                ignoreDuplicates: true,
            });
        } catch (error) {
            throw new Error(`Internal server error while creating product tags: ${error.message}`);
        }
    },

    /**
     * Function to delete multiple records from table "productTag" by 'productId'
     * 
     * @param {Integer} productId: product id of the product tag  
     */
    destroyTags: async (productId) => {
        try {
            await models.ProductTag.destroy({
                where: {
                    productId: productId,
                }
            });
        } catch (error) {
            throw new Error(`Internal server error while destroying product tags: ${error.message}`);
        }
    },
};

module.exports = ProductTagService;
