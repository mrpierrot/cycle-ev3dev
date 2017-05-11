const fs = require('fs');
const _ = require('lodash');
const xs = require('xstream').default;
const { DRIVERS_PATH, TACHO_MOTOR } = require('./constants');

function createWatchProducer(target) {
    let _listener = null;
    return {
        start(listener) {
            if (_listener) this.stop();
            _listener = (data) => listener.next(_.trim(data));
            fs.watch(target, { encoding: 'utf8' }, _listener);
        },
        stop() {
            fs.unwatchFile(target, _listener);
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

exports.watch = function watch(path,attribute) {
    return xs.create(createWatchProducer(path + '/' + attribute));
};

exports.getMotorPath = function getMotorPath(motorName, type = TACHO_MOTOR){
    return DRIVERS_PATH + '/' + type + '/' + motorName;
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
