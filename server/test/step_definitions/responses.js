const { defineSupportCode } = require('cucumber');
const { expect } = require('chai');

const cookieParser = require('cookie');

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
                case 'ARRAY':
                    expect(actual[key]).to.be.an.instanceof(Array);
                    break;
                case 'OBJECT':
                    expect(actual[key]).to.be.an('object');
                    break;
                default:
                    expect(actual[key]).to.deep.equal(expected[key]);
            }
        });
    };

    Then(/^the response from the "([^"]*)" request should be(?: a)? (\d+)(?: error)?$/, function (historyName, statusCode) {
        return Promise.resolve(this.getHistory(historyName))
            .then((history) => expect(history.status).to.equal(statusCode));
    });

    Then(/^the(?: "([^"]*)")? response from the "([^"]*)" request equals "([^"]*)"/, function (responseObject, historyName, expectedResponse) {
        return Promise.resolve(this.getHistory(historyName))
            .then((history) => history.response)
            .then((response) => expect(expectedResponse).to.equal(response));
    });

    Then(/^the response(?: path "([^"]*)")? from the "([^"]*)" request contains:/, function (responsePath, historyName, expectedData) {
        expectedData = this.getHashes(expectedData);

        return Promise.resolve(this.getHistory(historyName))
            .then((history) => history.response)
            .then((response) => {
                response = responsePath ? responsePath.split('.').reduce((response, pathItem) => response[pathItem], response) : response;
                if (response instanceof Array) {
                    return Promise.all(expectedData.map((expected, idx) => checkValues(expected, response[idx])));
                } else {
                    return checkValues(expectedData[0], response);
                }
            });
    });

    Then(/^the response from the "([^"]*)" request should be(?: a (\d+) error that contains)?:$/, function (historyName, statusCode, expectedData) {
        expectedData = this.getHashes(expectedData);

        return Promise.resolve(this.getHistory(historyName))
            .then((history) => {
                if (statusCode) {
                    expect(history.status).to.equal(statusCode);
                }

                return checkValues(expectedData[0], history.response);
            });
    });

    Then(/^there is a(?: (deleted))? cookie called "([^"]*)" in the "([^"]*)" response header$/, function (negative, cookieName, historyName) {
        return Promise.resolve(this.getHistory(historyName))
            .then((history) => {
                const targetCookie = history.headers['set-cookie']
                    .map((cookie) => cookieParser.parse(cookie))
                    .find((cookie) => cookie[cookieName] !== undefined);

                if (negative) {
                    if(targetCookie) {
                        expect(targetCookie[cookieName], `Cookie called ${cookieName} expected to be empty`).to.equal('');
                        expect(new Date(targetCookie.Expires).getTime()).to.equal(0);
                    }
                } else {
                    expect(targetCookie[cookieName], `Cookie called ${cookieName} not found`).to.not.equal('');
                }
            });
    });

});
