const { defineSupportCode } = require('cucumber');

const crypto = require('crypto');
const supertest = require('supertest');
const uuid = require('uuid');


let history = {};

class World {

    constructor() {
        this.headers = new Set();
        this.mocks = [];
        this.history = history;
        this.agent = supertest.agent(require(`../../../dist/server/main`));
    }

    setHeader(name, value) {
        this.headers.add({ name, value });
    }

    addMock(mock) {
        this.mocks.push(mock);
    }

    clearMocks() {
        this.mocks = [];
    }

    parseTemplateString(string) {
        let template = string.match(/{{\s?(\S*)\s?}}/);
        if (template !== null) {
            let target = template[1].split('.');
            let request = target.shift();
            let parts = request.match(/\[(\d+)\]/);
            if (parts) {
                let history = this.getHistory(request.replace(parts[0], ''), parts[1] - 1);
                target.forEach((field) => history = history[field]);
                string = string.replace(template[0], history);
            }
            string = this.parseTemplateString(string);
        }
        return string;
    }

    getHashes(data) {
        let cleaned = [];
        let rows = data.hashes();

        for (let row of rows) {
            for (let hash in row) {
                row[hash] = this.parseTemplateString(row[hash]);

                const keywords = row[hash].match(/^(\S*)\((\S*)\)$/);
                const keyword = keywords ? keywords[1] : row[hash];

                switch (keyword) {
                    case'DATETIME':
                        row[hash] = Date.now();
                        break;
                    case'PASSWORD':
                        const salt = crypto.createHash('sha1').update(uuid.v4()).digest('hex');
                        row[hash] = { salt: salt, secure: crypto.pbkdf2Sync(keywords[2], salt, 10000, 256, 'sha512').toString('base64'), created: Date.now() };
                        break;
                }

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

    getHistory(name, row) {
        if (row !== undefined) {
            return this.history[name][row];
        }
        return this.history[name];
    }

    performGet(endpoint, storage) {
        let promise = new Promise((resolve) => {
            let request = this.agent.get(endpoint);

            this.headers.forEach((header) => {
                request.set(header.name, header.value);
            });

            request.expect((res) => {
                if (this.mocks.length > 0) {
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

            this.headers.forEach((header) => {
                request.set(header.name, header.value);
            });

            request.send(data);

            request.expect((res) => {
                if (this.mocks.length > 0) {
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
