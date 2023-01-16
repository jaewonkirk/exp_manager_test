import { SerialPort } from "serialport";
import { autoDetect } from "@serialport/bindings-cpp";
import { InterByteTimeoutParser } from "serialport";

const Binding = autoDetect();
const ports = await Binding.list();

const connections = [];

ports.forEach((port) => {
    connections.push({pnpId: port.pnpId,
        path: port.path,
        type: "unknown",
        openOptions: {},
        parserOptions: {},
        nodes: [],
        serialport: {},
        parser: {},
        buffer: [],
        isOpen: false,
    });
})


import fs from "fs";
let lastConnections = [];

fs.readFile("./serial.json", "utf8", (err, jsonString) => {
    if (err) {
      console.log("Error reading file from disk:", err);
      return;
    }
    try {
      lastConnections = JSON.parse(jsonString);
      console.log("Last connection info:", lastConnections); // => "Customer address is: Infinity Loop Drive"
    } catch (err) {
      console.log("Error parsing JSON string:", err);
    }
});

lastConnections.forEach((item) => {
    try{
        connections.forEach((con) => {
            if(con.pnpId == item.pnpId){
                con.type = item.type;
                con.openOptions = item.openOptions;
                con.nodes = item.nodes;
            }
        });
    } catch(error) {
        console.log(error);
    }
});

connections.forEach((con) => {
    const openOptions = con.openOptions;
    openOptions.path = con.path;
    try{
        con.serialport = new SerialPort(openOptions);
        con.parser = new InterByteTimeoutParser(con.parserOptions);
        con.serialport.pipe(con.parser);
        con.parser.on("data", async (line) => {
            buffer.push(fromDevice(`${line}`, con.type));
        });
        con.isOpen = con.serialport.isOpen();
    } catch(error) {
        console.log(`Error occured in establishing connection with ${con.port}. Error: ${error}`);
        con.type = "unknown";
        con.openOptions= {};
        con.parserOptions= {};
        con.nodes= [];
        con.serialport= {};
        con.parser= {};
        con.buffer= [];
    }
    con.nodes.forEach((node) => {
        //Todo: type에 따른 node 정보 확인
    });
});

console.log(connections);

console.log(JSON.stringify(connections[0]));

const saveConnections = () => {
    let jsonStr = "[";
    connections.forEach((con) => {
        if(con.isOpen){
            jsonStr += `${JSON.stringify(con)},`;
        }
    });
    jsonStr += "]";
    fs.writeFileSync("serial.json", jsonStr);
}

saveConnections();