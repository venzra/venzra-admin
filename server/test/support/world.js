const supertest = require('supertest');

const { defineSupportCode } = require('cucumber');

class World {

    constructor() {
        this.mocks = [];
        this.history = {};
        this.agent = supertest.agent(require(`../../../dist/server/main`));
    }

    addMock(mock) {
        this.mocks.push(mock);
    }

    clearMocks() {
        this.mocks = [];
    }

    getHashes(data) {
        let cleaned = [];
        let rows = data.hashes();
        for (let row of rows) {
            for (let hash in row) {
                try {
                    let parsed = JSON.parse(row[hash]);
                    row[hash] = parsed;
                } catch (ex) {
                }
            }
            cleaned.push(row);
        }
        return cleaned;
    }

    getHistory(name) {
        return this.history[name];
    }

    performGet(endpoint, storage) {
        let promise = new Promise((resolve) => {
            let request = this.agent.get(endpoint);

            request.expect((res) => {
                if(this.mocks.length > 0) {
                    this.mocks.forEach((mock) => {
                        mock.done();
                    })
                }

                let data = {
                    status: res.statusCode,
                    headers: res.headers
                };

                try {
                    data.response = JSON.parse(res.text);
                } catch (ex) {
                    data.response = res.text || res.body;
                }

                this.history[storage] = data;
            });

            request.end(resolve);
        });

        return promise;
    }

    performPost(endpoint, data, storage) {
        let promise = new Promise((resolve) => {
            let request = this.agent.post(endpoint);

            request.send(data);

            request.expect((res) => {
                if(this.mocks.length > 0) {
                    this.mocks.forEach((mock) => {
                        mock.done();
                    })
                }

                let data = {
                    status: res.statusCode,
                    headers: res.headers
                };

                try {
                    data.response = JSON.parse(res.text);
                } catch (ex) {
                    data.response = res.text || res.body;
                }

                this.history[storage] = data;
            });

            request.end(resolve);
        });

        return promise;
    }
}

defineSupportCode(({ setWorldConstructor }) => setWorldConstructor(World));
defineSupportCode(({ setDefaultTimeout }) => setDefaultTimeout(10 * 1000));
