const sinon = require('sinon');
const assert = require('assert');
const models = require('../models');
const ProductCategoryService = require('../services/productCategory.service');

describe('ProductCategoryService', function () {
    afterEach(function () {
        sinon.restore();  
    });

    // create multiple new records in table "productCategory"
    describe('createCategories', function () {
        it('should create new categories successfully', async function () {
            const categories = [
                { productId: 1, productCategory: 'AUTOMATION' },
                { productId: 2, productCategory: 'B2B' },
                { productId: 2, productCategory: 'TECHNOLOGY' },
            ];

            const bulkCreateStub = sinon.stub(models.ProductCategory, 'bulkCreate').resolves(categories);

            const result = await ProductCategoryService.createCategories(categories);

            assert.strictEqual(result, categories);
            assert(bulkCreateStub.calledOnceWithExactly(categories, { ignoreDuplicates: true }));
        });

        it('should throw an error if creation fails', async function () {
            const categories = [
                { productId: 1, productCategory: 'AUTOMATION' },
            ];

            const errorMessage = 'Database error';
            sinon.stub(models.ProductCategory, 'bulkCreate').throws(new Error(errorMessage));

            try {
                await ProductCategoryService.createCategories(categories);
                assert.fail('Expected error was not thrown');
            } catch (error) {
                assert.strictEqual(error.message, `Internal server error while creating product categories: ${errorMessage}`);
            }
        });
    });

    // delete multiple records from table "productCategory" by 'productId'  
    describe('destroyCategories', function () {
        it('should destroy categories based on productId', async function () {
            const productId = 1;

            const destroyStub = sinon.stub(models.ProductCategory, 'destroy').resolves(1);

            await ProductCategoryService.destroyCategories(productId);

            assert(destroyStub.calledOnceWithExactly({ where: { productId } }));
        });

        it('should throw an error if destruction fails', async function () {
            const productId = 1;

            const errorMessage = 'Database error';
            sinon.stub(models.ProductCategory, 'destroy').throws(new Error(errorMessage));

            try {
                await ProductCategoryService.destroyCategories(productId);
                assert.fail('Expected error was not thrown');
            } catch (error) {
                assert.strictEqual(error.message, `Internal server error while destroying product categories: ${errorMessage}`);
            }
        });
    });
});
