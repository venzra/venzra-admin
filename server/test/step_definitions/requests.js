const { defineSupportCode } = require('cucumber');
const { expect } = require('chai');

defineSupportCode(({ Given, When, Then }) => {

    const checkValues = (expected, actual) => {
        const expectedKeys = Object.keys(expected);
        const actualKeys = Object.keys(actual);

        expect(actualKeys, 'Response keys do not match expectation').to.have.members(expectedKeys);

        expectedKeys.map((key) => {
            switch (expected[key]) {
                case 'OBJECT_ID':
                    expect(actual[key]).to.match(/^[0-9A-F]{24}$/i);
                    break;
                case 'DATE_TIME':
                    expect(actual[key]).to.match(/^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)$/);
                    break;
                default:
                    expect(actual[key]).to.equal(expected[key]);
            }
        });
    };

    When(/^I make a (GET) request to the API endpoint "([^"]*)" as "([^"]*)"$/, function (requestMethod, requestEndpoint, historyName) {
        return Promise.resolve(this.performGet(requestEndpoint, historyName));
    });

    When(/^I make a (POST) request to the API endpoint "([^"]*)" as "([^"]*)" using:$/, function (requestMethod, requestEndpoint, historyName, requestData) {
        requestData = this.getHashes(requestData);
        return Promise.resolve(this.performPost(requestEndpoint, requestData[0], historyName));
    });

    Then(/^The(?: "([^"]*)")? response from the "([^"]*)" request equals "([^"]*)"/, function (responseObject, historyName, expectedResponse) {
        return Promise.resolve(this.getHistory(historyName))
            .then((history) => history.response)
            .then((response) => expect(expectedResponse).to.equal(response));
    });

    Then(/^The response(?: path "([^"]*)")? from the "([^"]*)" request contains:/, function (responseObject, historyName, expectedData) {
        expectedData = this.getHashes(expectedData);

        return Promise.resolve(this.getHistory(historyName))
            .then((history) => history.response)
            .then((response) => {
                response = responseObject ? response[responseObject] : response;
                if (response instanceof Array) {
                    return Promise.all(expectedData.map((expected, idx) => checkValues(expected, response[idx])));
                } else {
                    return checkValues(expectedData[0], response);
                }
            });
    });

    Then(/^The response from the "([^"]*)" request should be a (\d+) error that contains:$/, function(historyName, statusCode, expectedData) {
        expectedData = this.getHashes(expectedData);

        return Promise.resolve(this.getHistory(historyName))
            .then((history) => {
                expect(history.status).to.equal(statusCode);

                return checkValues(expectedData[0], history.response);
            });
    });
});
