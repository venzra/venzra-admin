const { defineSupportCode } = require('cucumber');
const mongoose = require('mongoose');

defineSupportCode(({ Given, When, Then }) => {

    Given(/^there are the following "([^"]*)" records in the database(?: (in series))?$/, function (collection, series, dataset) {
        dataset = this.getHashes(dataset);

        if (mongoose.models[collection]) {
            if (series) {
                return new Promise((resolve) => {
                    const results = [];
                    const insert = dataset.reduce((chain, row) => chain.then(() => new mongoose.models[collection](row).save().then((result) => results.push(result))), Promise.resolve());
                    insert.then(() => resolve(results))
                }).then((records) => this.history[collection] = records);
            } else {
                return Promise
                    .all(dataset.map((row) => {
                        const creation = new mongoose.models[collection](row);
                        return creation.save();
                    }))
                    .then((records) => this.history[collection] = records);
            }
        } else {
            throw new Error(`No model known for collection ${collection}`);
        }

    });

});
