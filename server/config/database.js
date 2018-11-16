const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

require('../models/User');
require('../models/CalendarEvent');
require('../models/Archive');

module.exports = (config) => {
    mongoose.connect(config.connectionString);

    let db = mongoose.connection;

    db.once('open', (err) => {
        if (err) {
            return console.log(err);
        }

        console.log('MongoDB connected successfully!');
    });

    db.on('error', (err) => {
        console.log(err);
    });
};