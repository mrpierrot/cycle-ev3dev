exports.makeEv3devDriver =  function makeEv3devDriver() {

    return function ev3devDriver(events$) {

        events$.addListener({
            next: outgoing => {
                console.log(outgoing);
            },
            error: () => { },
            complete: () => { },
        });
    }
}