const socket = io("/");

socket.on("hello", () => {console.log("hello")});

const bronkhorstResponse = document.querySelector("#bronkhorst-response");
const mdrobotResponse = document.querySelector("#mdrobot-response");

socket.on("messageFromDevice", (data) => {
    console.log(data);
    switch(data.type){
        case "bronkhorst":
            bronkhorstResponse.querySelector(".res_status short").innerText = data.status;
            bronkhorstResponse.querySelector(".res_value short").innerText = data.value;
            break;
        case "mdrobot":
            mdrobotResponse.querySelector(".res_status short").innerText = data.status;
            mdrobotResponse.querySelector(".res_value short").innerText = data.value;
            break;
        default:
            console.log("unknown device (data.type)")
    }
});

//ports

const handleOpenPort = (event) => {
    event.preventDefault();
    const formData = new FormData(event.path[0]);
    const openOption = {
        path: formData.get("path"),
        baudRate: formData.get("baudrate")
    }
    console.log(`Open Port Request, path: ${openOption.path}, baudrate: ${openOption.baudRate}`)
    socket.emit("reqOpenPort", openOption);
    setTimeout(() => {socket.emit("reqPortInfo")}, 250);
}

const handleClosePort = (event) => {
    event.preventDefault();
    const formData = new FormData(event.path[0]);
    const path = formData.get("path");
    console.log(`Close Port Request, path: ${path}`);
    socket.emit("reqClosePort", path);
    setTimeout(() => {socket.emit("reqPortInfo")}, 250);
}

const portsRefresh = document.querySelector("#refresh-ports");
const portsWrapper = document.querySelector("#ports-wrapper");
portsRefresh.addEventListener("click", () => {
    socket.emit("reqPortInfo"); 
});

socket.on("portInfo", (data) => {
    console.log(data);
    portsWrapper.innerHTML = data.htmlString;
    const openPortForms = document.querySelectorAll(".open-port");
    const closePortForms = document.querySelectorAll(".close-port");
    
    openPortForms.forEach((form) => {
        form.addEventListener("submit", handleOpenPort);
    })
    closePortForms.forEach((form) => {
        form.addEventListener("submit", handleClosePort);
    })

});

const portsHide = document.querySelector("#hide-ports");
portsHide.addEventListener("click", () => {
    portsWrapper.innerHTML = "";
})

//bronkhorst 통신

const bronkhorstForm = document.querySelector("#bronkhorstTX");

const handleBronkhorstTX = (event) => {
    event.preventDefault();
    const formData = new FormData(bronkhorstForm);
    console.log("bronkhorst", formData.get("txFunction"), formData.get("txValue"));
    
    const txData = {
        port: "COM5",
        type: "bronkhorst",
        node: "03",
        function: formData.get("txFunction"),
        value: formData.get("txValue"),
    };

    socket.emit("reqToDevice", txData);
}

bronkhorstForm.addEventListener("submit", handleBronkhorstTX);

//mdrobot 통신

const mdrobotForm = document.querySelector("#mdrobotTX");

const handleMdrobotTX = (event) => {
    event.preventDefault();
    const formData = new FormData(mdrobotForm);
    console.log("mdrobot", formData.get("txFunction"), formData.get("txValue"));
    
    const txData = {
        port: "COM6",
        type: "mdrobot",
        id: 1,
        function: formData.get("txFunction"),
        value: formData.get("txValue")
    };

    socket.emit("reqToDevice", txData);
}

mdrobotForm.addEventListener("submit", handleMdrobotTX);

//serialport 설정 (open/close)

