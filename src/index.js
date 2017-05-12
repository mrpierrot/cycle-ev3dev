const driver = require('./driver');
const _ = require('lodash');
const xs = require('xstream').default;

function createSimpleProducer() {
    let _listerner = null;
    return {

        dispatchError(error) {
            if(_listerner)_listerner.error(error);
        },

        dispatchNext(data) {
            if(_listerner)_listerner.next(data);
        },

        dispatchComplete(data) {
            if(_listerner)_listerner.complete(data);
        },

        start(listener) {
            _listerner = listener;
        },
        stop() {
            if(_listerner)_listerner=null;
        }
    }
}

exports.makeEv3devDriver = function makeEv3devDriver() {

    return function ev3devDriver(events$) {

        const producer = createSimpleProducer();

        events$.addListener({
            next: outgoing => {
                _.each(outgoing, (list, type) =>
                    _.each(list, (attrs, name) => {
                        const path = driver.getDriverPath(type, name);
                        try {
                            driver.writeList(path, attrs);
                        }catch(e){
                            producer.dispatchError(e);
                        }
                    })
                );
            },
            error: () => { },
            complete: () => { },
        });

        return {
            messages() {
                return xs.create(producer);
            },
            getDriver(type, name) {
                const path = driver.getDriverPath(type, name);
                return {
                    watch(attribute, interval = 500) {
                        return driver.watch(path, attribute, interval);
                    },
                    read(attribute) {
                        return driver.read(path, attribute);
                    }
                }
            }
        }
    }
}