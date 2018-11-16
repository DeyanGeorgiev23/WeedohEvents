const mongoose = require('mongoose');
const encryption = require('../utilities/encryption');

const userSchema = new mongoose.Schema({
    method: { 
        type: String, enum: ['local', 'google', 'facebook'], required: true 
    },
    local: { 
        email: { type: String, lowercase: true, unique: true},
        username: { type: String },
        password: { type: String },
        salt: { type: String }
    },
    google: {
        id: { type: String },
        username: { type: String },
        email: { type: String, lowercase: true }
    },
    facebook: {
        id: { type: String },
        username: { type: String },
        email: { type: String, lowercase: true }
    },
    createdEvents: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'CalendarEvent', default: [] }],
    invitedEvents: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'CalendarEvent', default: [] }],
    friends: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'User', default: [] }],
    requestSend: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'User', default: [] }],
    requestGet: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'User', default: [] }]
});

userSchema.method({
    authenticate: function(password) {
        if (this.method === 'local') {
            const hashedPassword = encryption.generateHashedPassword(this.local.salt, password);
    
            if (hashedPassword === this.local.password) {
                return true;
            }
    
            return false;
        }
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;