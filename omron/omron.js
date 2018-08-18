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

    let condition = null;

    var omron = function (obj) {
        envsensor.init().then(() => {
            // 1分を制限時間としてデバイスを検索する。
            return envsensor.discover({
                duration: 60000,
                quick: true
            });
        }).then((device_list) => {
            if (device_list.length === 0) {
                throw new Error('No device was found.');
            }
            // `EnvsensorDevice` object representing the found device
            device = device_list[0];
            device.onsensordata = (data) => {
                json = JSON.stringify(data);
                obj = JSON.parse(json);
                let currentCondition;
                if (obj['temperature'] > 20.0) {
                    currentCondition = 'high';
                } else {
                    currentCondition = 'low';
                }
                //TODO JSONで取得したデータを全て送る。
                console.log(JSON.stringify(data, null, '  '));
                eventEmitter.emit('measure', () => {
                    return json;
                })

                if (condition !== currentCondition) {
                    condition = currentCondition;
                    //TODO 状態データを送る
                    console.log(condition);
                    eventEmitter.emit('conditionChange', () => {
                        return condition;
                    });
                }
            };
            return device.connect();
        }).then(() => {
            console.log('Connected.');
            return device.setBasicConfigurations({
                measurementInterval: 5
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
