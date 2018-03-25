const Event = require('../models/event');

const showEvents = (req, res) => {
    Event.find({}, (err, events) => {
        if (err) {
            res.status(404);
            res.send('Events not found!');
        }
        res.render('pages/events', {
            events: events,
            success: req.flash('success')
        })
    })
}

const showSingle = (req, res) => {

    Event.findOne({ slug: req.params.slug }, (err, event) => {
        if (err) {
            res.status(404);
            res.send(`Event ${req.params.slug} not found!`);
        }
        res.render('pages/single', {
            event: event,
            success: req.flash('success')
        });
    })

}

const seedEvents = (req, res) => {
    const events = [
        { name: 'Basketball', description: 'Throwing into a basket.' },
        { name: 'Swimming', description: 'Michael Phelps is the fast fish.' },
        { name: 'Weightlifting', description: 'Lifting heavy things up.' },
        { name: 'Ping Pong', description: 'Super fast paddles.' }
    ];

    Event.remove({}, () => {
        for (event of events) {
            var newEvent = new Event(event);
            newEvent.save();
        }
    });

    res.send('DB seeded!');
}

const showCreate = (req, res) => {
    res.render('pages/create', {
        errors: req.flash('errors')
    });
}

const processCreate = (req, res) => {

    req.checkBody('name', 'Name is required.').notEmpty();
    req.checkBody('description', 'Description is required.').notEmpty();

    const errors = req.validationErrors();
    if (errors) {
        req.flash('errors', errors.map(err => err.msg));
        return res.redirect('/events/create');
    }

    const event = new Event({
        name: req.body.name,
        description: req.body.description,
    });

    event.save((err) => {
        if (err)
            throw err;

        req.flash('success', 'Successfuly created event!');
        res.redirect(`/events/${event.slug}`);
    });
}

const showEdit = (req, res) => {

    Event.findOne({ slug: req.params.slug }, (err, event) => {
        if (err) throw err;
        res.render('pages/edit',
            {
                event: event,
                errors: req.flash('errors')
            });
    });

}

const processEdit = (req, res) => {
    req.checkBody('name', 'Name is required.').notEmpty();
    req.checkBody('description', 'Description is required.').notEmpty();

    const errors = req.validationErrors();
    if (errors) {
        req.flash('errors', errors.map(err => err.msg));
        return res.redirect(`/events/${req.params.slug}/edit`);
    }

    Event.findOne({ slug: req.params.slug }, (err, event) => {
        event.name = req.body.name;
        event.description = req.body.description;

        event.save((err) => {
            if (err)
                throw err;

            req.flash('success', 'Successfully updated event.');
            res.redirect('/events');
        });
    });

}

const deleteEvent = (req, res) => {
    Event.remove({ slug: req.params.slug }, (err) => {
        req.flash('success','Event deleted!');
        res.redirect('/events');
    })
}



module.exports = {
    showEvents: showEvents,
    showSingle: showSingle,
    seedEvents: seedEvents,
    showCreate: showCreate,
    processCreate: processCreate,
    showEdit: showEdit,
    processEdit: processEdit,
    deleteEvent: deleteEvent
}