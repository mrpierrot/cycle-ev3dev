const { assert } = require('chai'),
    xs = require('xstream').default,
    { run } = require('@cycle/run'),
    { adapt } = require('@cycle/run/lib/adapt'),
    { makeEv3devDriver } = require('../src/index'),
    { TACHO_MOTOR, MOTOR_3, SPEED_SP, CMD_RUN_FOREVER, COMMAND, CMD_STOP, POSITION } = require('../src/constants'),
    { fakeReadDriver } = require('./test-utils');


describe('cycle-ev3dev', function () {
    it('write', function (done) {

        // server part

        function main(sources) {
            const  { ev3dev } = sources;

            const action$ = xs.merge(
                xs.of({
                    [TACHO_MOTOR]: {
                        [MOTOR_3]: [
                            { attr: SPEED_SP, value: 500 },
                            { attr: COMMAND, value: CMD_RUN_FOREVER }
                        ]
                    }
                }),
                xs.periodic(1000)
                    .mapTo({
                        [TACHO_MOTOR]: {
                            [MOTOR_3]: [
                                { attr: COMMAND, value: CMD_STOP }
                            ]
                        }
                    })
                    .endWhen(xs.periodic(1100).take(1))
            );

            const watch$ = ev3dev.getDriver(TACHO_MOTOR,MOTOR_3).watch(POSITION);

            const events$  = xs.periodic(1000).endWhen(xs.periodic(1100).take(1));

            const sinks = {
                ev3dev: action$,
                fake: watch$
            };
            return sinks;
        }

        const drivers = {
            ev3dev: makeEv3devDriver(),
            fake: fakeReadDriver((o, i, complete) => {
                console.log(o)
            }, done,3)
        };
        run(main, drivers);
    });

});