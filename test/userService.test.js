const sinon = require('sinon');
const assert = require('assert');
const { Op } = require('sequelize');
const models = require('../models');
const UserService = require('../services/user.service');

describe('UserService', function () {
    afterEach(function () {
        sinon.restore();  
    });

    // fetch a record from table "user" by coulmn 'userEmail'
    describe('findUserByEmail', function () {
        it('should fetch user by email successfully', async function () {
            const email = 'a@gmail.com';
            const user = { 
                userEmail: email, 
                isActive: true 
            };
            const findOneStub = sinon.stub(models.User, 'findOne').resolves(user);

            const result = await UserService.findUserByEmail(email);

            assert.strictEqual(result, user);
            assert(findOneStub.calledOnceWithExactly({
                where: { 
                    userEmail: email, 
                    isActive: true
                }
            }));
        });

        it('should throw an error if fetching user by email fails', async function () {
            const email = 'a@gmail.com';
            const errorMessage = 'Database error';
            sinon.stub(models.User, 'findOne').throws(new Error(errorMessage));

            try {
                await UserService.findUserByEmail(email);
                assert.fail('Expected error was not thrown');
            } catch (error) {
                assert.strictEqual(error.message, `Internal server error while fetching the user by email: ${errorMessage}`);
            }
        });
    });

    // fetch a record from table "user" by coulmn 'id'
    describe('findUserById', function () {
        it('should fetch user by id successfully', async function () {
            const id = 1;
            const user = { 
                id: id, 
                isActive: true 
            };
            const findOneStub = sinon.stub(models.User, 'findOne').resolves(user);

            const result = await UserService.findUserById(id);

            assert.strictEqual(result, user);
            assert(findOneStub.calledOnceWithExactly({
                where: { 
                    id: id, 
                    isActive: true 
                }
            }));
        });

        it('should throw an error if fetching user by id fails', async function () {
            const id = 1;
            const errorMessage = 'Database error';
            sinon.stub(models.User, 'findOne').throws(new Error(errorMessage));

            try {
                await UserService.findUserById(id);
                assert.fail('Expected error was not thrown');
            } catch (error) {
                assert.strictEqual(error.message, `Internal server error while fetching the user by id: ${errorMessage}`);
            }
        });
    });

    // fetch a record from table "user" by coulmn 'userAdminId'
    describe('findUsersByAdminId', function () {
        it('should fetch users by admin id successfully', async function () {
            const adminId = 1;
            const users = [{ 
                userAdminId: adminId, 
                isActive: true 
            }];
            const findAllStub = sinon.stub(models.User, 'findAll').resolves(users);

            const result = await UserService.findUsersByAdminId(adminId);

            assert.deepStrictEqual(result, users);
            assert(findAllStub.calledOnceWithExactly({
                where: { 
                    userAdminId: adminId 
                },
                attributes: { 
                    exclude: ['userPassword'] 
                }
            }));
        });

        it('should throw an error if fetching users by admin id fails', async function () {
            const adminId = 1;
            const errorMessage = 'Database error';
            sinon.stub(models.User, 'findAll').throws(new Error(errorMessage));

            try {
                await UserService.findUsersByAdminId(adminId);
                assert.fail('Expected error was not thrown');
            } catch (error) {
                assert.strictEqual(error.message, `Internal server error while fetching the user by admin id: ${errorMessage}`);
            }
        });
    });

    // create a new record in table "user"
    describe('createNewUser', function () {
        it('should create a new user successfully', async function () {
            const userDetails = { 
                userName: 'D',
                userEmail: 'd@gmail.com', 
                userRole: 'ADMIN',
                userTeam: 'DEVELOPMENT',
                userAdminId: 1,
                isActive: true 
            };
            const createStub = sinon.stub(models.User, 'create').resolves(userDetails);

            const result = await UserService.createNewUser(userDetails);

            assert.strictEqual(result, userDetails);
            assert(createStub.calledOnceWithExactly(userDetails));
        });

        it('should throw an error if creating a new user fails', async function () {
            const userDetails = { 
                userName: 'D',
                userEmail: 'd@gmail.com', 
                userRole: 'ADMIN',
                userTeam: 'DEVELOPMENT',
                userAdminId: 1,
                isActive: true 
            };
            const errorMessage = 'Database error';
            sinon.stub(models.User, 'create').throws(new Error(errorMessage));

            try {
                await UserService.createNewUser(userDetails);
                assert.fail('Expected error was not thrown');
            } catch (error) {
                assert.strictEqual(error.message, `Internal server error while creating a new user: ${errorMessage}`);
            }
        });
    });

    // update an existing record in table "user"
    describe('updateUserById', function () {
        it('should update a user by id successfully', async function () {
            const userDetails = {
                id: 2,
                userName: 'updated A',
                userTeam: 'DESIGN',
            };
            const updateStub = sinon.stub(models.User, 'update').resolves([1, [userDetails]]);

            const result = await UserService.updateUserById(userDetails);

            assert.deepStrictEqual(result, [1, [userDetails]]);
            assert(updateStub.calledOnceWithExactly(userDetails, {
                where: { id: userDetails.id },
                returning: true
            }));
        });

        it('should throw an error if updating a user fails', async function () {
            const userDetails = {
                id: 2,
                userName: 'updated A',
                userTeam: 'DESIGN',
            };
            const errorMessage = 'Database error';
            sinon.stub(models.User, 'update').throws(new Error(errorMessage));

            try {
                await UserService.updateUserById(userDetails);
                assert.fail('Expected error was not thrown');
            } catch (error) {
                assert.strictEqual(error.message, `Internal server error while updating user by id: ${errorMessage}`);
            }
        });
    });

    // fetch a record from table "user" by coulmn 'id' and 'userAdminId'
    describe('findUsersByIdAndAdminId', function () {
        it('should fetch users by id array and admin id successfully', async function () {
            const idArray = [1, 2];
            const adminId = 1;
            const users = [{ id: 1, userAdminId: adminId }, { id: 2, userAdminId: adminId }];
            const findAllStub = sinon.stub(models.User, 'findAll').resolves(users);

            const result = await UserService.findUsersByIdAndAdminId(idArray, adminId);

            assert.deepStrictEqual(result, users);
            assert(findAllStub.calledOnceWithExactly({
                where: { id: { [Op.in]: idArray }, userAdminId: adminId }
            }));
        });

        it('should throw an error if fetching users by id array and admin id fails', async function () {
            const idArray = [1, 2];
            const adminId = 1;
            const errorMessage = 'Database error';
            sinon.stub(models.User, 'findAll').throws(new Error(errorMessage));

            try {
                await UserService.findUsersByIdAndAdminId(idArray, adminId);
                assert.fail('Expected error was not thrown');
            } catch (error) {
                assert.strictEqual(error.message, `Internal server error while trying to fetch multiple users by id and adminId: ${errorMessage}`);
            }
        });
    });
});
