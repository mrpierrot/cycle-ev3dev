const driver = require('./driver');
const _ = require('lodash');

exports.makeEv3devDriver =  function makeEv3devDriver() {

    return function ev3devDriver(events$) {
        events$.addListener({
            next: outgoing => {
                _.each(outgoing.motors,(attrs,motor) => {
                    const path = driver.getMotorPath(motor);
                    driver.writeList(path,attrs);
                });
            },
            error: () => { },
            complete: () => { },
        });
    }
}