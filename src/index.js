const driver = require('./driver');
const _ = require('lodash');

exports.makeEv3devDriver =  function makeEv3devDriver() {

    return function ev3devDriver(events$) {
        events$.addListener({
            next: outgoing => {
                _.each(outgoing,(list,type) => 
                    _.each(list,(attrs,name) => {
                        const path = driver.getDriverPath(type,name);
                        driver.writeList(path,attrs);
                    })
                );
            },
            error: () => { },
            complete: () => { },
        });

        return {
            getDriver(type,name){
                const path = driver.getDriverPath(type,name);
                return {
                    watch(attribute,interval=500){
                        return driver.watch(path,attribute,interval);
                    },
                    read(attribute){
                        return driver.read(path,attribute);
                    }
                }
            }
        }
    }
}