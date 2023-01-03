import { SerialPort, InterByteTimeoutParser } from "serialport";

import express from "express";
import morgan from "morgan";
import socketIO from "socket.io";


const port = new SerialPort({
    path: "COM5",
    baudRate: 38400,
});

const parser = new InterByteTimeoutParser({
    interval: 100,
});

port.pipe(parser);


const PORT = 4000;

const app = express();

const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(express.static(process.cwd()+"/src/static"));
app.use(logger);
app.use(express.urlencoded({ extended: true }));


import { bronkhorstFunctions, toBronkhorst, fromBronkhorst } from "./bronkhorst.js";

app.get("/", (req, res) => {res.render("home", { bronkhorstFunctions })});

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
    socket.on("reqToDevice", (data) => {
        //Todo: serialports 작업 후 port match
        switch(data.type){ // device 에 맞는 명령어 찾기
            case "bronkhorst":
                port.write(toBronkhorst(data));
                break;
            default:
                console.log("unknown device");
        }
    });
});

parser.on("data", async (line) => {
    console.log(`${line}`);
    sockets.forEach((socket) => {
        socket.emit("messageFromDevice", fromBronkhorst(`${line}`));
    });
});