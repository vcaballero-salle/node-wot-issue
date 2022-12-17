const Servient = require('@node-wot/core').Servient;
const HttpServer = require('@node-wot/binding-http').HttpServer;

const servient = new Servient();
servient.addServer(new HttpServer());

servient.start().then((WoT) => {
    WoT.produce({
        title: "TemperatureController",
        description: "A Thing to control the temperature of the room and also get alerts in too high temperatures",
        properties: {
            temperature: {
                type: "integer",
                description: "Current temperature value",
                observable: true,
                readOnly: true,
                unit: "Celcius"
            }
        },
        actions: {
            increment: {
                description: "Incrementing the temperature of the room with 0 to 5 increments",
                input: {
                    type: "integer",
                    minimum: 0,
                    maximum: 5
                }
            },
            decrement: {
                description: "Decrementing the temperature of the room with 0 to 5 increments",
                input: {
                    type: "integer",
                    minimum: 0,
                    maximum: 5
                }
            }
        },
        events: {
            overheat: {
                description: "Alert sent when the room temperature is too high"
            }
        }
    })
        .then(function (thing) {
            console.log("Produced " + thing.getThingDescription().title);
            console.log(thing)
            // init property values
            thing.writeProperty("temperature", getTemperature());

            thing.setPropertyReadHandler("temperature", function () {
                return new Promise((resolve, reject) => {
                    resolve(getTemperature());
                });
            });

            // set action handlers
            thing.setActionHandler("increment", function (value, options) {
                changeTemperature(getTemperature() + value)
            });

            thing.setActionHandler("decrement", function (value, options) {
                changeTemperature(getTemperature() - value)
            });

            // check the temperature every 5 seconds, alert if temperature too high
            setInterval(() => {
                var curTemp = getTemperature();
                console.log("current temperature is ", curTemp)
                thing.writeProperty("temperature", curTemp)
                if (curTemp > 5) {
                    thing.emitEvent("overheat")
                }
            }, 5000);

            // expose the thing
            thing.expose().then(function () {
                console.info(thing.getThingDescription().title + " ready");
            });

            function getTemperature() {
                // normally, you would call the temperature sensor's function to read the actual temperature value
                // return new Promise((resolve, reject) => {
                return Math.random() * Math.floor(50);
                // resolve(5); //uncomment to test incrementing etc.
                //  });
            }

            function changeTemperature(newValue) {
                // normally, you would do physical action to change the temperature
                //do nothing
                thing.writeProperty("temperature", newValue);
                return;
            }
        })
        .catch(function (e) {
            console.log(e);
        });
});