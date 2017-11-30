const nock = require('nock');

const { defineSupportCode } = require('cucumber');

defineSupportCode(function ({ BeforeAll, Before }) {

    BeforeAll(function (next) {
        nock.disableNetConnect();
        nock.enableNetConnect(/localhost|127.0.0.1/);
        next();
    });

    Before(function (scenario, next) {
        nock.cleanAll();
        next();
    });

});
