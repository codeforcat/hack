module.exports = function () {
    const Envsensor = require('node-omron-envsensor');
    const noble = require('noble');
    const EventEmitter = require('events').EventEmitter;

    const envsensor = new Envsensor({
        'noble': noble
    });

    const eventEmitter = new EventEmitter;
    // Initialize the `Envsensor` object
    let device = null;

    var omron = function (obj) {
        envsensor.init().then(() => {
            // 1分を制限時間としてデバイスを検索する。
            return envsensor.discover({
                duration: 60000,
                idFilter: 'c2fea8da25e24d2594d54f1adb953d58',
                quick: true
            });
        }).then((device_list) => {
            if (device_list.length === 0) {
                throw new Error('No device was found.');
            }
            // `EnvsensorDevice` object representing the found device
            device = device_list[0];
            device.onsensordata = (data) => {
                // let json = JSON.stringify(data);
                // let parsed = JSON.parse(json);
                console.log('temperature: ' + data.temperature)
                if (data.temperature > 25) {
                    eventEmitter.emit('flat');
                } else if (data.temperature < 20) {
                    eventEmitter.emit('round');
                }

                let currentCondition;
                data.temperature = data.temperature > 20.0 ? 1 : 0;
                data.humidity = data.humidity > 50.0 ? 1 : 0;
                data.ambientLight = data.ambientLight > 100 ? 1 : 0;
                data.uvIndex = data.uvIndex > 1 ? 1 : 0;
                data.pressure = data.pressure > 1020 ? 1 : 0;
                data.soundNoise = data.soundNoise > 40 ? 1 : 0;
                data.discomfortIndex = data.discomfortIndex > 10 ? 1 : 0;
                data.heatStroke = data.heatStroke > 30 ?  1 : 0;
                // console.log(JSON.stringify(data, null, '  '));
                eventEmitter.emit('measure', data);

            };
            console.log('IDにゃー：' + device.id)
            return device.connect();
        }).then(() => {
            console.log('Connected.');
            return device.setBasicConfigurations({
                measurementInterval: 1
            });
        }).then(() => {
            return device.startMonitoringData();
        }).then(() => {
            console.log('Start');
        }).catch((error) => {
            console.error(error);
        });
    }

    var _init = function (obj) {
        omron(obj);
    }
    eventEmitter.init = _init;
    return eventEmitter;
};
