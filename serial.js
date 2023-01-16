import fs from "fs";
import { autoDetect } from "@serialport/bindings-cpp";
import { SerialPort, InterByteTimeoutParser } from "serialport";


export const connections = [];

//Save connection info

const PATH_PREV_CONNECTIONS = "./prev_serial_connections.json"
const saveConnections = () => {
    let saveData = [];
    connections.forEach((con) => {
        if(con.isOpen){
            saveData.push({
                pnpId: con.pnpId,
                path: con.path,
                type: con.type,
                openOptions: con.openOptions,
                parserOptions: con.parserOptions,
                nodes: con.nodes,
            });
        }
    });
    fs.writeFileSync(PATH_PREV_CONNECTIONS, JSON.stringify(saveData));
    console.log("Connection info updated.");
}

//Make array of available ports

const Binding = autoDetect();
const ports = await Binding.list();

const emptyPort = (pnpId, path) => {
    return {
    pnpId: pnpId,
    path: path,
    type: "unknown",
    openOptions: {},
    parserOptions: {},
    nodes: [],
    serialport: {},
    parser: {},
    buffer: [],
    isOpen: false,
    }
}

ports.forEach((port) => {
    connections.push(emptyPort(port.pnpId, port.path));
});

//Load previous connection informaiton

let lastConnections = [];

const promise = new Promise((resolve, reject) => {
    fs.readFile(PATH_PREV_CONNECTIONS, "utf8", (err, jsonString) => {
        if (err) {
            console.log("Error reading file from disk:", err);
            return;
        }
        try {
            lastConnections = JSON.parse(jsonString);
            console.log("Last connection info:", lastConnections); // => "Customer address is: Infinity Loop Drive"
            resolve()
        } catch (err) {
            console.log("Error parsing JSON string:", err);
        }
    });
})

//Merge connections and lastconnections

promise.then(() => {
    lastConnections.forEach((item) => {
        connections.forEach((con, idx) => {
            try{
                if(con.pnpId == item.pnpId){
                    con.type = item.type;
                    con.openOptions = item.openOptions;
                    con.openOptions.path = con.path;
                    con.openOptions.baudRate = Number(con.openOptions.baudRate);
                    con.parserOptions = item.parserOptions;
                    con.nodes = item.nodes;
                    con.serialport = new SerialPort(con.openOptions);
                    con.parser = new InterByteTimeoutParser({interval: con.parserOptions.interval | 30,
                                                                encoding: con.parserOptions.encoding});
                    con.serialport.pipe(con.parser);
                    con.parser.on("data", async (line) => {con.buffer.push(`${line}`)});
                    con.isOpen = true;
                    console.log(`✅Serial Connection Established: ${con.path}, baudRate ${con.openOptions.baudRate}`);
                }
            } catch(error) {
                console.log(`Error in editing serial port ${con.path}`);
                console.log(error);
                con.type = "unknown";
                con.openOptions= {};
                con.parserOptions= {};
                con.nodes= [];
                con.serialport= {};
                con.parser= {};
                con.buffer= [];
            }
        });
    });
    saveConnections();
})


export const openConnection = (connections, path, params) => {
    const openOptions = params;
    openOptions.baudRate = Number(openOptions.baudRate);
    connections.forEach((con, idx) => {
        if(con.path==path && !con.isOpen){
            con.openOptions = openOptions;
            con.serialport = new SerialPort(openOptions);
            con.parser = new InterByteTimeoutParser({interval: 30});
            con.serialport.pipe(con.parser);
            con.parser.on("data", async (line) => {
                con.buffer.push(`${line}`);
            });
            con.isOpen = true;
            saveConnections();
            return idx;
        }
    });
    return -1;
}

export const closeConnection = (connections, path) => {
    let matchIdx = -1;
    let pnpId = "";
    connections.forEach((con, idx) => {
        if(con.path==path){
            con.serialport.close();
            matchIdx = idx;
            pnpId = con.pnpId;
        }
    });
    connections[matchIdx] = emptyPort(pnpId, path);
    saveConnections();
    return matchIdx;
}