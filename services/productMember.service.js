const models = require('../models');
const sequelize = models.sequelize; 

const ProductMemberService = {
    /**
     * Function to create multiple new records in table "productMember"
     * 
     * @param {Array} members: array of product members 
     * @returns an array of newly created product members
     */
    createMembers: async (members) => {
        const transaction = await sequelize.transaction(); 

        try {
            const createdMembers = await models.ProductMember.bulkCreate(members, {
                ignoreDuplicates: true,
                transaction 
            });

            await transaction.commit(); 
            return createdMembers;
        } catch (error) {
            await transaction.rollback(); 
            throw new Error(`Internal server error while creating product members: ${error.message}`);
        }
    },

    /**
     * Function to delete multiple records from table "productMember" by 'productId'
     * 
     * @param {Integer} productId: product id of the product member
     */
    destroyMembers: async (productId) => {
        try {
            await models.ProductMember.destroy({
                where: {
                    productId: productId,
                }
            });
        } catch (error) {
            throw new Error(`Internal server error while destroying product members: ${error.message}`);
        }
    }
};

module.exports = ProductMemberService;
