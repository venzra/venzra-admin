const { defineSupportCode } = require('cucumber');
const nock = require('nock');

defineSupportCode(({ Given, When, Then }) => {

    const prepareMock = (uri, type, status, file) => {
        let mock =  nock(uri).filteringPath(/.*/, '*');

        mock = mock[type.toLowerCase()]('*');

        if(file) {
            mock = mock.replyWithFile(status, file);
        } else {
            mock = mock.reply(status);
        }

        return mock;
    };

    Given(/^There is a "([^"]*)" consumer at "([^"]*)" that will return(?: "([^"]*)" with)? status (\d+)$/, function (type, uri, file, status) {
        return this.addMock(prepareMock(uri, type, status, file));
    });

});
