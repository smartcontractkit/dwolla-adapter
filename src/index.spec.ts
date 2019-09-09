import {GetRequest, JobRequest, Request, requestWrapper, SendRequest} from './index';
import {assert} from 'chai';
import 'mocha';

describe('create request', () => {
    context('requests data', () => {
        const jobID = "278c97ffadb54a5bbb93cfec5f7b5503";
        const req = <JobRequest>{
            id: jobID,
            data: <Request>{}
        };
        const timeout = 5000;

        it('should fail on invalid method', () => {
            // Notice method not set.
            return requestWrapper(req).then((response) => {
                assert.equal(response.statusCode, 400, "status code");
                assert.equal(response.jobRunID, jobID, "job id");
                assert.isUndefined(response.data, "response data");
            });
        });

        let transferId = "";

        it('should send transfer', () => {
            req.data = <SendRequest>{
                method: "sendTransfer",
                amount: process.env.TEST_AMOUNT || "10.00",
                currency: process.env.TEST_CURRENCY || "USD",
                destination: process.env.TEST_DESTINATION || ""
            };
            return requestWrapper(req).then((response) => {
                assert.equal(response.statusCode, 201, "status code");
                assert.equal(response.jobRunID, jobID, "job id");
                assert.isNotEmpty(response.data, "response data");
                assert.isNotEmpty(response.data.result, "transfer id");
                transferId = response.data.result;
            });
        }).timeout(timeout);

        it('should get transfer details', () => {
            req.data = <GetRequest>{
                method: "getTransfer",
                transfer_id: process.env.TEST_TRANSFER_ID || transferId
            };
            return requestWrapper(req).then((response) => {
                assert.equal(response.statusCode, 200, "status code");
                assert.equal(response.jobRunID, jobID, "job id");
                assert.isNotEmpty(response.data, "response data");
                assert.isNotEmpty(response.data.result, "transfer status");
            });
        }).timeout(timeout);

        it('should fail sending transfer without amount', () => {
            req.data = <SendRequest>{
                method: "sendTransfer",
                destination: process.env.TEST_DESTINATION || ""
            };
            return requestWrapper(req).then((response) => {
                assert.equal(response.statusCode, 400, "status code");
                assert.equal(response.jobRunID, jobID, "job id");
                assert.isUndefined(response.data, "response data");
            });
        }).timeout(timeout);

        it('should fail sending transfer without destination', () => {
            req.data = <Request>{
                method: "sendTransfer",
                amount: "10.00"
            };
            return requestWrapper(req).then((response) => {
                assert.equal(response.statusCode, 400, "status code");
                assert.equal(response.jobRunID, jobID, "job id");
                assert.isUndefined(response.data, "response data");
            });
        }).timeout(timeout);

        it('should fail getting transfer details without transfer id', () => {
            req.data = <GetRequest>{
                method: "getTransfer"
            };
            return requestWrapper(req).then((response) => {
                assert.equal(response.statusCode, 400, "status code");
                assert.equal(response.jobRunID, jobID, "job id");
                assert.isUndefined(response.data, "response data");
            });
        }).timeout(timeout);
    })
});
