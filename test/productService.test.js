const sinon = require('sinon');
const assert = require('assert');
const models = require('../models');
const ProductService = require('../services/product.service'); 

describe('ProductService', function () {
    afterEach(function () {
        sinon.restore(); 
    });

    // create a new record in table "product"
    describe('createNewProduct', function () {
        it('should create a new product and return the product object', async function () {
            const productDetails = {
                productBrand: 'Wix',
                productDescription: 'Sample wix product',
                productAdminId: 1,
                isActive: true
            };
            const newProduct = { ...productDetails, id: 1 };
            
            const createStub = sinon.stub(models.Product, 'create').resolves(newProduct);
            const result = await ProductService.createNewProduct(productDetails);

            assert.deepStrictEqual(result, newProduct);
            assert(createStub.calledOnceWithExactly(productDetails));
        });

        it('should throw an error if creating a new product fails', async function () {
            const errorMessage = 'Database error';
            sinon.stub(models.Product, 'create').throws(new Error(errorMessage));

            try {
                await ProductService.createNewProduct({});
                assert.fail('Expected error was not thrown');
            } catch (error) {
                assert.strictEqual(error.message, `Internal server error while creating a new product: ${errorMessage}`);
            }
        });
    });

    // fetch a record from table "product" by column 'productBrand', 'productAdminId' and 'isActive'
    describe('findProductByBrand', function () {
        it('should fetch a product by brand and admin id successfully', async function () {
            const brand = 'Wix';
            const adminId = 1;
            const product = {
                id: 1,
                productBrand: 'Wix',
                productDescription: 'Sample wix product',
                productAdminId: 1,
                isActive: true
            };
            const findOneStub = sinon.stub(models.Product, 'findOne').resolves(product);

            const result = await ProductService.findProductByBrand(brand, adminId);

            assert.deepStrictEqual(result, product);
            assert(findOneStub.calledOnceWithExactly({
                where: {
                    productBrand: brand,
                    productAdminId: adminId,
                    isActive: true
                }
            }));
        });

        it('should throw an error if fetching a product by brand fails', async function () {
            const errorMessage = 'Database error';
            sinon.stub(models.Product, 'findOne').throws(new Error(errorMessage));

            try {
                await ProductService.findProductByBrand('Wix', 1);
                assert.fail('Expected error was not thrown');
            } catch (error) {
                assert.strictEqual(error.message, `Internal server error while fetching a product by brand: ${errorMessage}`);
            }
        });
    });

    // fetch a record from table "product" by column 'productAdminId'
    describe('findAllProductsByAdminId', function () {
        it('should fetch all products by admin id successfully', async function () {
            const adminId = 1;
            const products = [{
                id: 1,
                productBrand: 'Wix',
                productDescription: 'Sample wix product',
                productAdminId: 1,
                isActive: true
            }];
            const findAllStub = sinon.stub(models.Product, 'findAll').resolves(products);

            const result = await ProductService.findAllProductsByAdminId(adminId);

            assert.deepStrictEqual(result, products);
            assert(findAllStub.calledOnceWithExactly({
                where: {
                    productAdminId: adminId,
                    isActive: true
                },
                include: [
                    { model: models.ProductCategory, as: 'productCategories' },
                    { model: models.ProductMember, as: 'productMembers' },
                    { model: models.ProductTag, as: 'productTags' }
                ]
            }));
        });

        it('should throw an error if fetching products by admin id fails', async function () {
            const errorMessage = 'Database error';
            sinon.stub(models.Product, 'findAll').throws(new Error(errorMessage));

            try {
                await ProductService.findAllProductsByAdminId(1);
                assert.fail('Expected error was not thrown');
            } catch (error) {
                assert.strictEqual(error.message, `Internal server error while fetching all product by admin id: ${errorMessage}`);
            }
        });
    });

    // fetch a record from table "product" by column 'id'
    describe('findProductById', function () {
        it('should fetch a product by id successfully', async function () {
            const id = 1;
            const product = {
                id: 1,
                productBrand: 'Wix',
                productDescription: 'Sample wix product',
                productAdminId: 1,
                isActive: true
            };
            const findOneStub = sinon.stub(models.Product, 'findOne').resolves(product);

            const result = await ProductService.findProductById(id);

            assert.deepStrictEqual(result, product);
            assert(findOneStub.calledOnceWithExactly({
                where: {
                    id: id,
                    isActive: true
                },
                include: [
                    { model: models.ProductCategory, as: 'productCategories' },
                    { model: models.ProductMember, as: 'productMembers' },
                    { model: models.ProductTag, as: 'productTags' }
                ]
            }));
        });

        it('should throw an error if fetching a product by id fails', async function () {
            const errorMessage = 'Database error';
            sinon.stub(models.Product, 'findOne').throws(new Error(errorMessage));

            try {
                await ProductService.findProductById(1);
                assert.fail('Expected error was not thrown');
            } catch (error) {
                assert.strictEqual(error.message, `Internal server error while fetching a product by id: ${errorMessage}`);
            }
        });
    });

    // update a record in table "product" by column 'id'
    describe('updateProductById', function () {
        it('should update a product by id and return updated details', async function () {
            const productDetails = {
                id: 1,
                productBrand: 'Wix',
                productDescription: 'Sample wix product updated',
                productAdminId: 1,
                isActive: true
            };
            const updatedProduct = [1, [productDetails]]; 
            const updateStub = sinon.stub(models.Product, 'update').resolves(updatedProduct);

            const result = await ProductService.updateProductById(productDetails);

            assert.deepStrictEqual(result, updatedProduct);
            assert(updateStub.calledOnceWithExactly(productDetails, {
                where: { 
                    id: productDetails.id 
                },
                returning: true
            }));
        });

        it('should throw an error if updating a product by id fails', async function () {
            const errorMessage = 'Database error';
            sinon.stub(models.Product, 'update').throws(new Error(errorMessage));

            try {
                await ProductService.updateProductById({ id: 1 });
                assert.fail('Expected error was not thrown');
            } catch (error) {
                assert.strictEqual(error.message, `Internal server error while updating a product by id: ${errorMessage}`);
            }
        });
    });
});
