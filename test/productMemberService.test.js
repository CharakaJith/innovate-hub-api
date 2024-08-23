const sinon = require('sinon');
const assert = require('assert');
const models = require('../models');
const ProductMemberService = require('../services/productMember.service');

describe('ProductMemberService', function () {
    afterEach(function () {
        sinon.restore();  
    });

    // create multiple new records in table "productMember"
    describe('createMembers', function () {
        it('should create new product members successfully', async function () {
            const members = [
                { productId: 1, productMemberId: 2 },
                { productId: 1, productMemberId: 3 }
            ];

            const bulkCreateStub = sinon.stub(models.ProductMember, 'bulkCreate').resolves(members);

            const result = await ProductMemberService.createMembers(members);

            assert.strictEqual(result, members);
            assert(bulkCreateStub.calledOnceWithExactly(members, { ignoreDuplicates: true }));
        });

        it('should throw an error if creation fails', async function () {
            const members = [
                { productId: 1, productMemberId: 2 }
            ];

            const errorMessage = 'Database error';
            sinon.stub(models.ProductMember, 'bulkCreate').throws(new Error(errorMessage));

            try {
                await ProductMemberService.createMembers(members);
                assert.fail('Expected error was not thrown');
            } catch (error) {
                assert.strictEqual(error.message, `Internal server error while creating product members: ${errorMessage}`);
            }
        });
    });

    // delete multiple records from table "productMember" by 'productId'
    describe('destroyMembers', function () {
        it('should destroy product members based on productId', async function () {
            const productId = 1;

            const destroyStub = sinon.stub(models.ProductMember, 'destroy').resolves(1);

            await ProductMemberService.destroyMembers(productId);

            assert(destroyStub.calledOnceWithExactly({ where: { productId } }));
        });

        it('should throw an error if destruction fails', async function () {
            const productId = 1;

            const errorMessage = 'Database error';
            sinon.stub(models.ProductMember, 'destroy').throws(new Error(errorMessage));

            try {
                await ProductMemberService.destroyMembers(productId);
                assert.fail('Expected error was not thrown');
            } catch (error) {
                assert.strictEqual(error.message, `Internal server error while destroying product members: ${errorMessage}`);
            }
        });
    });
});
