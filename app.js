const faker = require('faker');
const mqtt = require('mqtt');
require('dotenv').config();

const client = mqtt.connect(process.env.MQTT_BROKER);

var gnssSensor = null;

client.on('connect', () => {
    client.subscribe('transport/ride/start');
    client.subscribe('transport/ride/stop');
    console.log(`Connected to MQTT broker at ${process.env.MQTT_BROKER}`);
});

client.on('message', (topic, _message) => {
    if (topic === 'transport/ride/start') {
        console.log('Trip has started');
        pushLocation();
    }
    if (topic === 'transport/ride/stop') {
        stopGnssSensor();
        console.log('Trip has ended')
    };
});

const pushLocation = () => {
    gnssSensor = setInterval(() => {
        const location = {
            lat: faker.address.latitude(),
            long: faker.address.longitude()
         }
        client.publish('transport/location', JSON.stringify(location))
        console.log(location);
    }, 2000);
}

const stopGnssSensor = () => {
    clearInterval(gnssSensor);
}