const { defineSupportCode } = require('cucumber');

defineSupportCode(({ Given, When, Then }) => {

    Given(/^The request origin headers are set to "([^"]*)"$/, function(requestOrigin) {
        this.setHeader('Origin', `http://${requestOrigin}`);
        this.setHeader('Referer', `http://${requestOrigin}`);
        this.setHeader('Host', requestOrigin);
    });

    When(/^I make a (GET) request to the API endpoint "([^"]*)" as "([^"]*)"$/, function (requestMethod, requestEndpoint, historyName) {
        return Promise.resolve(this.performGet(requestEndpoint, historyName));
    });

    When(/^I make a (POST) request to the API endpoint "([^"]*)" as "([^"]*)" using:$/, function (requestMethod, requestEndpoint, historyName, requestData) {
        requestData = this.getHashes(requestData);
        return Promise.resolve(this.performPost(requestEndpoint, requestData[0], historyName));
    });

});
