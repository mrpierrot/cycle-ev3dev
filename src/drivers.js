const fs = require('fs');
const _ = require('lodash');
const xs = require('xstream').default;

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

exports.getDriver = function getDriver(path) {

    return {
        write(attribute, value) {
            fs.writeFileSync(path + '/' + attribute, value);
        },
        writeList(list) {
            _.each(list, (item) => {
                fs.writeFileSync(path + '/' + item.attr, item.value);
            })
        },
        read(attribute) {
            return xs.of(_.trim(fs.readFileSync(path + '/' + attribute, { encoding: 'utf8' })))
        },
        watch(attribute) {
            return xs.create(createWatchProducer(path + '/' + attribute));
        }
    }
}