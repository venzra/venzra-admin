const mongoose = require('mongoose');

const { Given, When, Then } = require('cucumber');

Given(/^there are the following "([^"]*)" records in the database(?: (in series))?$/, function (collection, series, dataset) {
    dataset = this.getHashes(dataset);

    if (mongoose.models[collection]) {
        if (series) {
            return new Promise((resolve) => {
                const results = [];
                const insert = dataset.reduce((chain, row) => chain.then(() => new Promise((resolve) => setTimeout(resolve, 5))).then(() => new mongoose.models[collection](row).save().then((result) => results.push(result))), Promise.resolve());
                insert.then(() => resolve(results));
            }).then((records) => this.history[collection] = records);
        } else {
            return Promise
                .all(dataset.map((row) => {
                    Object.keys(row).forEach((key) => (row[key] === null || row[key] === '') && delete row[key]);
                    const creation = new mongoose.models[collection](row);
                    return creation.save();
                }))
                .then((records) => this.history[collection] = records);
        }
    } else {
        throw new Error(`No model known for collection ${collection}`);
    }

});

Given(/^the following "([^"]*)" records are updated in the database$/, function (collection, dataset) {
    dataset = this.getHashes(dataset);

    if (mongoose.models[collection]) {
        return Promise
            .all(dataset.map((row) => mongoose.models[collection].findOne({ _id: row._id })
                .then((record) => {
                    Object.keys(row).forEach((key) => (row[key] == null) && delete row[key]);
                    return record.update(row);
                }))
            );
    } else {
        throw new Error(`No model known for collection ${collection}`);
    }

});
