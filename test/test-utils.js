const _ = require('lodash'),
    xs = require('xstream').default,
    { run } = require('@cycle/run'),
    { adapt } = require('@cycle/run/lib/adapt');

exports.makeFakeDriver = function makeFakeDriver(callback, done, count = -1) {
    return function fakeReadDriver(events$) {
        let i = 0;
        const obj = {
            next: outgoing => {
                callback(outgoing, i++,complete);
                if(finish)finish();
            },
            error: (e) => { console.warn('fakeDriver::error',e.message) },
            complete: () => { },
        }

        let _listener = null;

        const producer = {
            start(listener) {
                _listener = listener;
            },

            stop() {
                _listener = null;
            }
        }

        const complete = () => {
            events$.removeListener(obj);
            if (_listener) {
                _listener.next(true);
            } else {
                console.warn('No listener found for fake driver')
            }
            if(done)done();
        }
  
        const finish = (count > 0)?_.after(count,complete ):null;
        
        events$.addListener(obj);

        return adapt(xs.create(producer))
    }
}