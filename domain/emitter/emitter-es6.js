/**

Write an emitter class that supports the following operations:

Constructor:
```
emitter = new Emitter();
```

Subscription to events:
```
var sub = emitter.subscribe('event_name', callback);
var sub2 = emitter.subscribe('event_name', callback2);
```

Emitting events:
This particular example should lead to the `callback` above being invoked with `foo` and `bar` as parameters.
```
emitter.emit('event_name', foo, bar);
```

Unsubscribing from existing subscriptions by releasing them:
```
sub.release(); // `sub` is the reference returned by `subscribe` above.
```

**/

class Emitter {
    constructor() {
        this.events = {};
    }

    subscribe(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = new Map();
        }
        const events = this.events;
        const subscriber = {
            release: function () {
                events[eventName].delete(this);
                // No more subscriptions for that event. Delete that eventName from events.
                if (!events[eventName].size) {
                    delete events[eventName];
                }
            },
        };
        this.events[eventName].set(subscriber, callback);
        return subscriber;
    }

    emit(eventName, ...parameters) {
        const callbacks = this.events[eventName];
        if (!callbacks) {
            return;
        }
        callbacks.forEach(callback => {
            callback(...parameters);
        });
    }
}

// Testing code.
(function () {
    const assert = require('assert');
    const invokedArgs = [];
    const emitter = new Emitter();

    const sub = emitter.subscribe('add', function (a, b) {
        invokedArgs.push(['add1'].concat([].slice.apply(arguments)));
    });
    const sub2 = emitter.subscribe('add', function (a, b) {
        invokedArgs.push(['add2'].concat([].slice.apply(arguments)));
    });
    emitter.emit('add', 1, 2);
    assert.equal(invokedArgs.length, 2);
    assert.deepEqual(invokedArgs[0], ['add1', 1, 2]);
    assert.deepEqual(invokedArgs[1], ['add2', 1, 2]);
    invokedArgs.length = 0;

    sub2.release();
    const sub3 = emitter.subscribe('add', function (a, b) {
        invokedArgs.push(['add3'].concat([].slice.apply(arguments)));
    });
    emitter.emit('add', 2, 3);
    assert.equal(invokedArgs.length, 2);
    assert.deepEqual(invokedArgs[0], ['add1', 2, 3]);
    assert.deepEqual(invokedArgs[1], ['add3', 2, 3]);
    invokedArgs.length = 0;

    const sub4 = emitter.subscribe('mul', function (a, b) {
        invokedArgs.push(['mul'].concat([].slice.apply(arguments)));
    })
    emitter.emit('mul', 3, 4, 5);
    assert.equal(invokedArgs.length, 1);
    assert.deepEqual(invokedArgs[0], ['mul', 3, 4, 5]);
    invokedArgs.length = 0;
})();
