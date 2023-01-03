const socket = io("/");

socket.on("hello", () => {console.log("hello")});

const bronkhorstResponse = document.querySelector("#bronkhorst-response");

socket.on("messageFromDevice", (data) => {
    console.log(data);
    bronkhorstResponse.querySelector(".res_status short").innerText = data.status;
    bronkhorstResponse.querySelector(".res_value short").innerText = data.value;
});

const bronkhorstForm = document.querySelector("#bronkhorstTX");

const handleBronkhorstTX = (event) => {
    event.preventDefault();
    const formData = new FormData(bronkhorstForm);
    console.log(formData.get("txFunction"), formData.get("txValue"));
    
    const txData = {
        port: "COM20",
        type: "bronkhorst",
        node: "03",
        function: formData.get("txFunction"),
        value: formData.get("txValue"),
    };

    socket.emit("reqToDevice", txData);
}

bronkhorstForm.addEventListener("submit", handleBronkhorstTX);

