document.getElementById('thing-1-consume').addEventListener('click', function (e) {
    e.preventDefault()
    alert('thing-1-consume clicked!')
})

let servient = new Wot.Core.Servient();
servient.addClientFactory(new Wot.Http.HttpClientFactory());
let helpers = new Wot.Core.Helpers(servient);

helpers.fetch("http://localhost:8080/temperaturecontroller").then(async (td) => {
    console.log("Thing Description:", td);
})