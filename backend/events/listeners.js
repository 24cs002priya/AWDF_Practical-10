const events = require('./events');
events.on('error', e => console.error('[Event error]', e.message));
events.on('car-created', car => {
    setTimeout(() => {
        try {
            console.log(`[Notification] Car "${car.title}" created for ${car.owner || 'unassigned'} at ${new Date().toISOString()} (after response)`);
        }
        catch (e) {
            events.emit('error', e);
        }
    }, 2000);
});
events.on('car-deleted', car => { setImmediate(() => console.log(`[Notification] Car "${car.title}" deleted at ${new Date().toISOString()}`)); });
