var requests = require("requests");
const http = require('http');
const fs = require('fs'); //file system

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceValue = (tempValue, orgValue) => {
    let temperature = tempValue.replace("{%temp%}", orgValue.main.temp);
        temperature = temperature.replace("{%temp_min%}", orgValue.main.temp_min);
        temperature = temperature.replace("{%temp_max%}", orgValue.main.temp_max);
        temperature = temperature.replace("{%location%}", orgValue.name);
        temperature = temperature.replace("{%country%}", orgValue.sys.country);
        temperature = temperature.replace("{%tempstatus%}", orgValue.weather[0].main);
        
    return temperature;
};

const server = http.createServer((req, res) => {
    if(req.url == "/"){ //this means it is home page
        requests("https://api.openweathermap.org/data/2.5/weather?q=silvassa&appid=d411d3a59c967fd5476b78dcf13d9e3b&units=metric")
        .on("data", (chunk) => {
            const objData = JSON.parse(chunk); //object
            const arrData = [objData]; //array
            // console.log(arrData[0].main.temp); //array of an object

            const realTimeData = arrData.map(value => replaceValue(homeFile, value)).join("");
            res.write(realTimeData);
        })
        .on("end", (err) => {
            if (err) return console.log("connection closed due to error", err);
            res.end();
        });
    } else {
        res.end("File not found");
    }
});

server.listen(8000, "127.0.0.1");