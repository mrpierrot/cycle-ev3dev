const fs = require('fs');
const _ = require('lodash');
const { DRIVERS_PATH, TACHO_MOTOR } = require('./constants');
const { getDriver } = require('./drivers');

exports.motorsList = function motorsList(type = TACHO_MOTOR) {
    const motorsDriversPath = DRIVERS_PATH + '/' + type
    return _.map(fs.readdirSync(motorsDriversPath), motor => {
        return {
            base: motor,
            address: _.trim(fs.readFileSync(motorsDriversPath + '/' + motor + '/address', { encoding: 'utf8' }))
        }
    });
}

exports.getMotor = function getMotor(motorName, type = TACHO_MOTOR) {
    return getDriver(DRIVERS_PATH + '/' + type + '/' + motorName)
}