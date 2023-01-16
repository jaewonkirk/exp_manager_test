import { SerialPort, InterByteTimeoutParser } from "serialport";

import express from "express";
import morgan from "morgan";
import socketIO from "socket.io";

import pug from "pug";

import "./serial.js";
import { connections, openConnection, closeConnection } from "./serial.js";

const PORT = 4000;

const app = express();

const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(express.static(process.cwd() + "/build"));
app.use(logger);
app.use(express.urlencoded({ extended: true }));


import { bronkhorstFunctions, toBronkhorst, fromBronkhorst } from "./bronkhorst.js";
import { mdrobotFunctions, toMdrobot, fromMdrobot } from "./mdrobot.js";

app.get("/", (req, res) => {res.render("home", { connections, bronkhorstFunctions, mdrobotFunctions })});
app.get("/test", (req, res) => {res.render("newhome", { connections })});

const handleListening = () => console.log(`✅Server is listening on port ${PORT}`);

const server = app.listen(PORT, handleListening);

const io = socketIO(server);


const sockets = [];
io.on("connection", (socket) => {
    console.log("connected");
    sockets.push(socket);
    socket.on("newMessage", (data) => {
        console.log(data);
    });
    socket.on("reqPortInfo", () => {
        console.log("reqPortInfo");
        const compilePorts = pug.compileFile("src/views/partials/port.pug");
        const portsHTML = compilePorts({ connections });
        console.log(portsHTML);
        socket.emit("portInfo", { htmlString: portsHTML });
    })
    socket.on("reqOpenPort", (data) => {
        console.log("reqOpenPort", data);
        openConnection(connections, data.path, data);
    })
    socket.on("reqClosePort", (data) => {
        console.log("reqClosePort", data);
        closeConnection(connections, data);
    })
    socket.on("reqToDevice", (data) => {
        //Todo: serialports 작업 후 port match
        switch(data.type){ // device 에 맞는 명령어 찾기
            case "bronkhorst":
                port.write(toBronkhorst(data));
                break;
            case "mdrobot":
                console.log(data);
                console.log(toMdrobot(data));
                port2.write(toMdrobot(data), 'hex');
                break;
            default:
                console.log("unknown device");
            }
        });
});

/*
parser.on("data", async (line) => {
    console.log(`${line}`);
    sockets.forEach((socket) => {
        socket.emit("messageFromDevice", fromBronkhorst(`${line}`));
    });
});

parser2.on("data", async (line) => {
    console.log(`${line}`);
    sockets.forEach((socket) => {
        socket.emit("messageFromDevice", fromMdrobot(`${line}`));
    })
});
*/