const sinon = require('sinon');
const assert = require('assert');
const models = require('../models');
const ProductTagService = require('../services/productTag.service');

describe('ProductTagService', function () {
    afterEach(function () {
        sinon.restore();  
    });

    // create multiple new records in table "productTag"
    describe('createTags', function () {
        it('should create new product tags successfully', async function () {
            const tags = [
                { productId: 1, productTag: '#OnlineShopping' },
                { productId: 1, productTag: '#SmartFinance' }
            ];

            const bulkCreateStub = sinon.stub(models.ProductTag, 'bulkCreate').resolves(tags);

            const result = await ProductTagService.createTags(tags);

            assert.strictEqual(result, tags);
            assert(bulkCreateStub.calledOnceWithExactly(tags, { ignoreDuplicates: true }));
        });

        // delete multiple records from table "productTag" by 'productId'
        it('should throw an error if creation fails', async function () {
            const tags = [
                { productId: 1, productTag: '#OnlineShopping' }
            ];

            const errorMessage = 'Database error';
            sinon.stub(models.ProductTag, 'bulkCreate').throws(new Error(errorMessage));

            try {
                await ProductTagService.createTags(tags);
                assert.fail('Expected error was not thrown');
            } catch (error) {
                assert.strictEqual(error.message, `Internal server error while creating product tags: ${errorMessage}`);
            }
        });
    });

    describe('destroyTags', function () {
        it('should destroy product tags based on productId', async function () {
            const productId = 1;

            const destroyStub = sinon.stub(models.ProductTag, 'destroy').resolves(1);

            await ProductTagService.destroyTags(productId);

            assert(destroyStub.calledOnceWithExactly({ where: { productId } }));
        });

        it('should throw an error if destruction fails', async function () {
            const productId = 1;

            const errorMessage = 'Database error';
            sinon.stub(models.ProductTag, 'destroy').throws(new Error(errorMessage));

            try {
                await ProductTagService.destroyTags(productId);
                assert.fail('Expected error was not thrown');
            } catch (error) {
                assert.strictEqual(error.message, `Internal server error while destroying product tags: ${errorMessage}`);
            }
        });
    });
});
