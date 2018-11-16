const User = require('../models/User');
const CalendarEvent = require('../models/CalendarEvent');
const checkMethod = require('../utilities/checkMethod');
const UserData = require('../utilities/UserData');
const sendMail = require('../utilities/mailSender');

async function createCalendar(currentUserId, data) {
    if (data.numberOfParticipants < 0) {
        data.numberOfParticipants = 0;
    } else if (data.numberOfParticipants > 15) {
        data.numberOfParticipants = 15;
    }

    try {
        if (data.isPrivate) {
            let event = new CalendarEvent({
                title: data.title,
                description: data.description,
                date: data.date,
                hour: data.hour,
                isPrivate: true,
                numberOfParticipants: Number(data.numberOfParticipants),
                participants: [],
                creator: currentUserId,
                dateCreate : Date.now()
            });

            await event.save();

            let currentUser = await User.findById(currentUserId);

            currentUser.createdEvents.push(event.id);

            await currentUser.save();

            let participants = data.participants;

            for (let participant of participants) {
                let currentParticipant = await User.findById(participant);
                currentParticipant.invitedEvents.push(event.id);

                await currentParticipant.save();
            }

            return event;
        } else {
            let event = new CalendarEvent({
                title: data.title,
                description: data.description,
                date: data.date,
                hour: data.hour,
                isPrivate: false,
                numberOfParticipants: Number(data.numberOfParticipants),
                participants: [],
                creator: currentUserId,
                dateCreate : Date.now()
            });

            await event.save();

            let currentUser = await User.findById(currentUserId);

            currentUser.createdEvents.push(event.id);

            await currentUser.save();

            let participants = data.participants;

            for (let participant of participants) {
                let currentParticipant = await User.findById(participant);
                currentParticipant.invitedEvents.push(event.id);

                await currentParticipant.save();
            }

            return event;
        }
    } catch (error) {
        throw new Error(error);
    }
}

module.exports = {
    create: async (req, res) => {
        let currentUserId = req.user.id;
        let data = req.body;
        let eventId = '';

        if (!data.title || !data.date) {
            return res.status(200).json({ errorMessage: 'Title, date and isPrivate are required!Please send a valid data!' });
        }

        try {
            if (data.numberOfParticipants < data.participants.length) {
                return res.status(200).json({ message: 'Participants are more then a number you choose!' });
            }
            let event = await createCalendar(currentUserId, data);
            eventId = event.id;

            res.status(200).json({ message: 'Event was create successfully!', eventId: eventId});
        } catch (error) {
            res.status(403).json({ error: error });
        }
    },
    editEvent: async (req, res) => {
        let data = req.body.data;
        
        try {
            let event = await CalendarEvent.findById(data.eventId).populate('participants');
            if (!event) {
                return res.status(403).json({ message: 'You have not create a Event!' });
            }

            if (data.title && typeof data.title === 'string') {  event.title = data.title; }

            if (data.description && typeof data.description === 'string') { event.description = data.description; }

            if (data.date && typeof data.date === 'string') { event.date = data.date; }

            if (data.hour && typeof data.hour === 'string') { event.hour = data.hour; }

            if (typeof data.isPrivate === 'boolean') { 
                if (data.isPrivate) {
                    event.isPrivate = true;
                } else {
                    event.isPrivate = false;
                }
            }

            if (data.numberOfParticipants) { event.numberOfParticipants = Number(data.numberOfParticipants); }

            await event.save();

            res.status(200).json({ message: 'Event was successfully edited' });
        } catch (error) {
            res.status(403).json({ error: error });
        }
    },
    getEvents: async (req, res) => {
        let getAllEvents = [];
        let { skip, limit } = req.body;

        if (skip < 0 || !limit) {
            return res.status(200).json({ errorMessage: 'Invalid data!' });
        }

        try {
            let events = await CalendarEvent
                .find()
                .populate('participants')
                .populate('creator')
                .limit(limit)
                .sort({ dateCreate: -1 });


            for (let event of events) {
                let helper = [];
                helper.push(checkMethod(event.creator, UserData));

                let participants = [];
                for (let participant of event.participants) {
                    participants.push(checkMethod(participant, UserData));
                }

                let eventList = {
                    eventId: event.id,
                    title: event.title,
                    description: event.description,
                    date: event.date,
                    hour: event.hour,
                    numberOfParticipants: event.numberOfParticipants,
                    isPrivate: event.isPrivate,
                    creator: helper,
                    participants: participants,
                    dateCreate: event.dateCreate
                };

                getAllEvents.push(eventList);
            }
            res.status(200).json({ getAllEvents });
        } catch (error) {
            res.status(403).json({ error: error });
        }
        
    },
    allEvents: async (req, res) => {
        let currentUserId = req.user.id;
        let allCreatedEvents = [];

        try {
            let currentUser = await User
                .findById(currentUserId)
                .populate('createdEvents');

            for (let event of currentUser.createdEvents) {
                let participants = [];
                for (let participant of event.participants) {
                    let users = await User.findById(participant);
                    participants.push(checkMethod(users, UserData));
                }

                let helper = {
                    eventId: event.id,
                    title: event.title,
                    description: event.description,
                    isPrivate: event.isPrivate,
                    date: event.date,
                    hour: event.hour,
                    numberOfParticipants: event.numberOfParticipants,
                    participants: participants,
                    dateCreate: event.dateCreate
                };

                allCreatedEvents.push(helper);
            }

            res.status(200).json({ allCreatedEvents });
        } catch (error) {
            res.status(403).json({ error: error });
        }
    },
    invitesEvents: async (req, res) => {
        let currentUserId = req.user.id;

        let allInvitedEvents = [];

        try {
            let currentUser = await User
                .findById(currentUserId)
                .populate('invitedEvents');

            for (let event of currentUser.invitedEvents) {
                let helper = [];

                let user = await User.findById(event.creator);
                helper.push(checkMethod(user, UserData));

                let invites = {
                    eventId: event.id,
                    title: event.title,
                    description: event.description,
                    isPrivate: event.isPrivate,
                    date: event.date,
                    hour: event.hour,
                    creator: helper,
                    dateCreate: event.dateCreate
                };
        
                allInvitedEvents.push(invites);
            }

            res.status(200).json({ allInvitedEvents });
        } catch (error) {
            res.status(404).json({ error: error });
        }
    },
    invitesAnswer: async (req, res) => {
        let currentUserId = req.user.id;
        let { eventId, answer } = req.body;

        if (!eventId || !answer) {
            return res.status(200).json({ errorMessage: 'Please send a valid data!' });
        }

        try {
            if (answer) {
                let currentUser = await User
                    .findById(currentUserId);
                
                let index = currentUser.invitedEvents.toString().indexOf(eventId);
                currentUser.invitedEvents.splice(index, 1);

                await currentUser.save();

                let event = await CalendarEvent.findById(eventId);

                event.participants.push(currentUserId);

                await event.save();

                res.status(200).json({ message: 'You are now part of this Event!' });
            } else {
                let currentUser = await User
                    .findById(currentUserId);
                
                let index = currentUser.invitedEvents.toString().indexOf(eventId);
                currentUser.invitedEvents.splice(index, 1);

                await currentUser.save();

                res.status(200).json({ message: 'Event was successfully ignored!' });
            }
        } catch (error) {
            res.status(404).json({ error: error });
        }
    },
    joinEvent: async (req, res) => {
        let currentUserId = req.user.id;
        let eventId = req.body.id;

        if (!eventId)  {
            return res.status(200).json({ errorMessage: 'Please send a valid data!' });
        }
 
        try {
            let event = await CalendarEvent
                .findById(eventId)
                .populate('creator');

            if (!event) {
                return res.status(404).json({ errorMessage: 'Please send a valid data!' });
            }

            if (event.creator.id === currentUserId) {
                return res.status(200).json({ errorMessage: "Creator can't join in his own Event!" });
            }
 
            if (!event.participants.toString().includes(currentUserId)) {
                event.participants.push(currentUserId);
            } else {
                return res.status(200).json({ errorMessage: 'You are part of this Event!' });
            }

            if (event.isPrivate) {
                let creator = await User
                    .findById(event.creator);
                    
                if (!creator.friends.toString().includes(currentUserId)) {
                    return res.status(200).json({ errorMessage: "The Event is Private!You can't join it!" });
                } 
            }

            let currentUser = await User.findById(currentUserId);

            if (currentUser.invitedEvents.toString().includes(eventId)) {
                let index = currentUser.invitedEvents.toString().indexOf(eventId);
                currentUser.invitedEvents.splice(index, 1);
            }

            await currentUser.save();
 
            await event.save();
 
            res.status(200).json({ successMessage: 'Successfully joined to this Event!' });
        } catch (error) {
            res.status(200).json({ error: error });
        }
    },
    leaveEvent: async (req, res) => {
        let currentUserId = req.user.id;
        let eventId = req.body.id;

        if (!eventId) {
            return res.status(200).json({ errorMessage: 'Please send a valid data!' });
        }
 
        try {
            let event = await CalendarEvent
                .findById(eventId);
 
            if (!event.participants.toString().includes(currentUserId)) {
                return res.status(200).json({ errorMessage: 'You are not part of this Event!' });
            }

            let index = event.participants.indexOf(currentUserId);

            event.participants.splice(index, 1);

            await event.save();
            
            res.status(200).json({ successMessage: 'Successfully leaved the Event!' });
        } catch (error) {
            res.status(404).json({ error: error });
        }
    },
    delete: async (req, res) => {
        let eventId = req.body.id;

        if (!eventId) {
            return res.status(200).json({ errorMessage: 'Please send a valid data!' });
        }

        try {
            let event = await CalendarEvent.findById(eventId).populate('participants');
            let creator = await User.findById(event.creator);

            let creatorName = '';
            if (creator.method === 'local') {
                creatorName = creator.local.username;
            } else if (creator.method === 'google') {
                creatorName = creator.google.username;
            } else if (creator.method === 'facebook') {
                creatorName = creator.facebook.username;
            }

            let index = creator.createdEvents.toString().indexOf(eventId);
            creator.createdEvents.splice(index, 1);

            await creator.save();

            let allUsers = await User.find().where('invitedEvents').equals(eventId);

            if (allUsers.length > 0) {
                for (let user of allUsers) {
                    let index = user.invitedEvents.toString().indexOf(eventId);
                    user.invitedEvents.splice(index, 1);

                    await user.save();
                }
            }

            if (event.participants.length > 0) {
                let usersEmails = [];
                
                for (let participant of event.participants) {
                    let options = participant.local.email || participant.google.email || participant.facebook.email;
                    usersEmails.push(options);

                }
                sendMail(usersEmails, `${event.title}`, `The ${event.title} event on ${event.date} witch you have been part of was now deleted by the creator: ${creatorName}!`);
            }
 
            await CalendarEvent.findByIdAndDelete(eventId);

            res.status(200).json({ successMessage: 'Your event was successfully deleted!' });
            
        } catch (error) {
            res.status(404).json({ error: error });
        }
    }
};