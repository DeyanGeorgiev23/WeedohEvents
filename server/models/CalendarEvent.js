const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    date: { type: String, required: true },
    hour: { type: String },
    isPrivate: { type: mongoose.SchemaTypes.Boolean, default: false, required: true },
    numberOfParticipants: { type: Number, min: 1 },
    participants: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'User', default: [] }],
    creator: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' },
    dateCreate: { type: mongoose.SchemaTypes.Date, default: Date.now }
});

const CalendarEvent = mongoose.model('CalendarEvent', eventSchema);

module.exports = CalendarEvent;