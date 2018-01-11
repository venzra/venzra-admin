const crypto = require('crypto');
const { defineSupportCode } = require('cucumber');

defineSupportCode(({ Given, When, Then }) => {

    Given(/^the request origin headers are set to "([^"]*)"$/, function (requestOrigin) {
        this.setHeader('Origin', `http://${requestOrigin}`);
        this.setHeader('Referer', `http://${requestOrigin}`);
        this.setHeader('Host', requestOrigin);
    });

    Given(/^there is a (stripe|connect) webhook signature for the mock payload "([^"]*)"$/, function (hookType, mockFile) {
        const requestData = this.readMock(mockFile);
        const hook = hookType === 'stripe' ? 'STRIPE_WEBHOOK_KEY' : 'STRIPE_CONNECT_KEY';

        let headerValue = [];

        headerValue.push(`t=${requestData.created}`);
        headerValue.push(`v1=${crypto.createHmac('sha256', process.env[hook]).update(`${requestData.created}.${JSON.stringify(requestData)}`).digest('hex')}`);
        headerValue.push(`v0=${crypto.createHmac('sha256', process.env[hook]).update(JSON.stringify(requestData)).digest('hex')}`);

        this.setHeader('stripe-signature', headerValue.join(','));
    });

    Given(/^I am logged in with the "([^"]*)" account$/, function (userIdentity) {
        return Promise.resolve(this.performPost('/api/identity/login', { identity: userIdentity, password: 'VenzraTest$1' }));
    });

    When(/^I make a (GET) request to the API endpoint "([^"]*)" as "([^"]*)"$/, function (requestMethod, requestEndpoint, historyName) {
        return Promise.resolve(this.performGet(requestEndpoint, historyName));
    });

    When(/^I make an empty (POST) request to the API endpoint "([^"]*)" as "([^"]*)"$/, function (requestMethod, requestEndpoint, historyName) {
        return Promise.resolve(this.performPost(requestEndpoint, null, historyName));
    });

    When(/^I make a (POST) request to the API endpoint "([^"]*)" as "([^"]*)" using:$/, function (requestMethod, requestEndpoint, historyName, requestData) {
        requestData = this.getHashes(requestData);
        return Promise.resolve(this.performPost(requestEndpoint, requestData[0], historyName));
    });

    When(/^I make a (POST) request to the API endpoint "([^"]*)" as "([^"]*)" with the mock "([^"]*)"$/, function (requestMethod, requestEndpoint, historyName, mockFile) {
        const requestData = this.readMock(mockFile);
        return Promise.resolve(this.performPost(requestEndpoint, requestData, historyName));
    });

    When(/^I make an empty (PATCH) request to the API endpoint "([^"]*)" as "([^"]*)"$/, function (requestMethod, requestEndpoint, historyName) {
        return Promise.resolve(this.performPatch(requestEndpoint, null, historyName));
    });

    When(/^I make a (PATCH) request to the API endpoint "([^"]*)" as "([^"]*)" using:$/, function (requestMethod, requestEndpoint, historyName, requestData) {
        requestData = this.getHashes(requestData);
        return Promise.resolve(this.performPatch(requestEndpoint, requestData, historyName));
    });

});
