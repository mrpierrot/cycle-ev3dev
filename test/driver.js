const { assert } = require('chai'),
    xs = require('xstream').default,
    { run } = require('@cycle/run'),
    { adapt } = require('@cycle/run/lib/adapt'),
    driver = require('./driver'),
    { MOTOR_3,SPEED_SP,CMD_RUN_FOREVER,COMMAND,CMD_STOP } = require('../src/constants');

/*
describe('cycle-ev3dev:motors', function () {
    this.timeout(15000);

    it('motorsList should return a array', function () {
        assert.isArray(motorsList());
    });

    it('write', function (done) {
        const motor = getMotor(MOTOR_3);
        motor.writeList([
            { attr: SPEED_SP, value: 500},
            { attr: COMMAND, value: CMD_RUN_FOREVER}
        ]);
        setTimeout(()=>{
            motor.write(COMMAND,CMD_STOP)
            done();
        },3000)
    });
});*/