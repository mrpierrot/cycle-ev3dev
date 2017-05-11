const fs = require('fs');
const _ = require('lodash');
const xs = require('xstream').default;
const { DRIVERS_PATH, TACHO_MOTOR } = require('./constants');

function createWatchProducer(target,interval) {
    let _listener = null;
    let intervalId = null;
    return {
        start(listener) {
            let oldValue = null;
            intervalId = setInterval(() => {
                const value = _.trim(fs.readFileSync(target, { encoding: 'utf8' }));
                if(value != oldValue){
                    return listener.next(_.trim(value));
                }
            },interval);
        },
        stop() {
            clearInterval(intervalId);
        }
    }
}

exports.write = function write(path,attribute, value) {
    fs.writeFileSync(path + '/' + attribute, value);
};

exports.writeList = function writeList(path,list) {
    _.each(list, (item) => {
        fs.writeFileSync(path + '/' + item.attr, item.value);
    })
};

exports.read = function read(path,attribute) {
    return xs.of(_.trim(fs.readFileSync(path + '/' + attribute, { encoding: 'utf8' })))
};

exports.watch = function watch(path,attribute,interval=500) {
    return xs.create(createWatchProducer(path + '/' + attribute,interval));
};

exports.getDriverPath = function getDriverPath(type,driverName){
    return DRIVERS_PATH + '/' + type + '/' + driverName;
}

exports.motorsList = function motorsList(type = TACHO_MOTOR) {
    const motorsDriversPath = DRIVERS_PATH + '/' + type
    return _.map(fs.readdirSync(motorsDriversPath), motor => {
        return {
            base: motor,
            address: _.trim(fs.readFileSync(motorsDriversPath + '/' + motor + '/address', { encoding: 'utf8' }))
        }
    });
}
