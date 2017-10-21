const { defineSupportCode } = require('cucumber');
const nock = require('nock');
const path = require('path');

defineSupportCode(({ Given, When, Then }) => {

    const prepareMock = (uri, target, type, status, file) => {
        let mock = nock(uri);

        if(!target) {
            mock.filteringPath(/.*/, '*');
        }

        mock = mock[type.toLowerCase()](target ? target : '*');

        if (file) {
            mock = mock.replyWithFile(status, path.join(__dirname, '../mocks', file));
        } else {
            mock = mock.reply(status);
        }

        return mock;
    };

    Given(/^there is a (POST|GET) consumer at "([^"]*)"(?: for "([^"]*)")? that will return(?: "([^"]*)" with)? status (\d+)$/, function (type, uri, target, file, status) {
        return this.addMock(prepareMock(uri, target, type, status, file));
    });

});
