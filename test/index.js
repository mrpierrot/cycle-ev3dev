const { assert } = require('chai'),
    xs = require('xstream').default,
    { run } = require('@cycle/run'),
    { adapt } = require('@cycle/run/lib/adapt'),
    { makeEv3devDriver } = require('../src/index'),
    { MOTOR_3, SPEED_SP, CMD_RUN_FOREVER, COMMAND, CMD_STOP } = require('../src/constants'),
    { fakeReadDriver } = require('./test-utils');


describe('cycle-ev3dev', function () {
    it('write', function (done) {

        // server part

        function main(sources) {

            const action$ = xs.merge(
                xs.of({
                    motors: {
                        [MOTOR_3]: [
                            { attr: SPEED_SP, value: 500 },
                            { attr: COMMAND, value: CMD_RUN_FOREVER }
                        ]
                    }
                }),
                xs.periodic(1000)
                    .mapTo({
                        motors: {
                            [MOTOR_3]: [
                                { attr: COMMAND, value: CMD_STOP }
                            ]
                        }
                    })
                    .endWhen(xs.periodic(1100).take(1))
            );

            const events$  = xs.periodic(1000).endWhen(xs.periodic(1100).take(1));

            const sinks = {
                ev3dev: action$,
                fake: events$
            };
            return sinks;
        }

        const drivers = {
            ev3dev: makeEv3devDriver(),
            fake: fakeReadDriver((o, i) => {

            }, done, 1)
        };
        run(main, drivers);
    });

});