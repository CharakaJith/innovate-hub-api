const assert = require('assert');
const sinon = require('sinon');
const models = require('../models');
const MeetingService = require('../services/meeting.service');

describe('MeetingService', () => {
    afterEach(() => {
        sinon.restore();
    });

    // create a new record in "meeting"
    describe('createNewMeeting', () => {
        it('should create a new meeting and return the meeting object', async () => {
            const meetingDetails = {
                meetingProductId: 2,
                meetingTime: '2024-08-22T16:00:00',
                meetingAdminId: 1,
                isActive: true,
            };
            const createStub = sinon.stub(models.Meeting, 'create').resolves(meetingDetails);

            const result = await MeetingService.createNewMeeting(meetingDetails);
            assert.strictEqual(result, meetingDetails);
            assert(createStub.calledOnceWithExactly(meetingDetails));
        });

        it('should throw an error if there is an issue creating a meeting', async () => {
            const errorMessage = 'Database error';
            sinon.stub(models.Meeting, 'create').throws(new Error(errorMessage));

            try {
                await MeetingService.createNewMeeting({});
                assert.fail('Expected error was not thrown');
            } catch (error) {
                assert.strictEqual(error.message, `Internal server error while creating a new meeting: ${errorMessage}`);
            }
        }); 
    });

    // fetch a record from table "metting" by column 'productId', 'time' and 'adminId'
    describe('findMeetingByTime', function() {
        it('should return a meeting object if found', async function() {
            const meeting = { 
                id: 1, 
                meetingProductId: 3,
                meetingTime: '2024-09-22T11:30:00.000Z',
                meetingAdminId: 1,
                isActive: true,
            };
            const findOneStub = sinon.stub(models.Meeting, 'findOne').resolves(meeting);

            const result = await MeetingService.findMeetingByTime(1, '2024-08-22T16:00:00', 1);
            assert.strictEqual(result, meeting);
            assert(findOneStub.calledOnce);
        });

        it('should throw an error if there is an issue fetching the meeting', async function() {
            const errorMessage = 'Database error';
            sinon.stub(models.Meeting, 'findOne').throws(new Error(errorMessage));

            try {
                await MeetingService.findMeetingByTime(3, '2024-08-22T16:00:00', 1);
                assert.fail('Expected error was not thrown');
            } catch (error) {
                assert.strictEqual(error.message, `Internal server error while fetching a meeting by product id and time: ${errorMessage}`);
            }
        });
    });

    // fetch a record from table "meeting" by column 'adminId'
    describe('findMeetingByAdminId', function() {
        it('should return an array of meetings if found', async function() {
            const meetings = [{ 
                id: 1, 
                meetingProductId: 3,
                meetingTime: '2024-09-22T11:30:00.000Z',
                meetingAdminId: 1,
                isActive: true,
            }];
            const findAllStub = sinon.stub(models.Meeting, 'findAll').resolves(meetings);

            const result = await MeetingService.findMeetingByAdminId(1);
            assert.strictEqual(result, meetings);
            assert(findAllStub.calledOnce);
        });

        it('should throw an error if there is an issue fetching the meetings', async function() {
            const errorMessage = 'Database error';
            sinon.stub(models.Meeting, 'findAll').throws(new Error(errorMessage));

            try {
                await MeetingService.findMeetingByAdminId(1);
                assert.fail('Expected error was not thrown');
            } catch (error) {
                assert.strictEqual(error.message, `Internal server error while fetching a meeting by admin id: ${errorMessage}`);
            }
        });
    });

    // fetch a record from table "meeting" by column 'id' and 'adminId'
    describe('findMeetingById', function() {
        it('should return a meeting object if found', async function() {
            const meeting = { 
                id: 1, 
                meetingProductId: 3,
                meetingTime: '2024-09-22T11:30:00.000Z',
                meetingAdminId: 1,
                isActive: true,
            };
            const findOneStub = sinon.stub(models.Meeting, 'findOne').resolves(meeting);

            const result = await MeetingService.findMeetingById(1, 1);
            assert.strictEqual(result, meeting);
            assert(findOneStub.calledOnce);
        });

        it('should throw an error if there is an issue fetching the meeting by id', async function() {
            const errorMessage = 'Database error';
            sinon.stub(models.Meeting, 'findOne').throws(new Error(errorMessage));

            try {
                await MeetingService.findMeetingById(1, 1);
                assert.fail('Expected error was not thrown');
            } catch (error) {
                assert.strictEqual(error.message, `Internal server error while fetching a meeting by id: ${errorMessage}`);
            }
        });
    });

    // update a record in table "meeting" by column 'id'
    describe('updateMeeting', function() {
        it('should update a meeting and return the updated meeting details', async function() {
            const meetingDetails = { 
                id: 1,
                meetingProductId: 4,
                meetingTime: '2024-08-27T17:30:00',
             };
            const updateStub = sinon.stub(models.Meeting, 'update').resolves([1, [meetingDetails]]);

            const result = await MeetingService.updateMeeting(meetingDetails);
            assert.deepStrictEqual(result, [1, [meetingDetails]]);
            assert(updateStub.calledOnceWithExactly(meetingDetails, { where: { id: meetingDetails.id }, returning: true }));
        });

        it('should throw an error if there is an issue updating the meeting', async function() {
            const errorMessage = 'Database error';
            sinon.stub(models.Meeting, 'update').throws(new Error(errorMessage));

            try {
                await MeetingService.updateMeeting({ id: 1 });
                assert.fail('Expected error was not thrown');
            } catch (error) {
                assert.strictEqual(error.message, `Internal server error while updating a meeting by id: ${errorMessage}`);
            }
        });
    });
});