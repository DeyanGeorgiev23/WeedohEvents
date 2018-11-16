const mongoose = require('mongoose');
const encryption = require('../utilities/encryption');

const archiveModel = new mongoose.Schema({
    id: { type: mongoose.SchemaTypes.ObjectId, required: true },
    key: { type: mongoose.SchemaTypes.String, required: true },
    salt: { type: mongoose.SchemaTypes.String, required: true }
});

archiveModel.method({
    authenticateKey: function(key) {
        const hashedPassword = encryption.generateHashedPassword(this.salt, key);

        if (hashedPassword === this.key) {
            return true;
        }

        return false;
    }
});

const Archive = mongoose.model('Archive', archiveModel);

module.exports = Archive;