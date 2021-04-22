//************THIS WORKS DON'T TOUCH************//

const canvas = document.getElementById("canv");
const clearCanvas = document.getElementById("clear");
const submit = document.getElementById("submit");
const remove = document.getElementById("remove");
const ctx = canvas.getContext("2d");
let dataUrl = "";
console.log(dataUrl);
canvas.addEventListener("mousedown", startdrawing);

canvas.addEventListener("mouseup", () => {
    stopdrawing();
    dataUrl = canvas.toDataURL();

    //console.log("dataUrl", dataUrl);
    document.getElementById("signature").value = dataUrl;
    console.log(dataUrl);
});

remove.addEventListener("click", () => {
    dataUrl = "";
    console.log(dataUrl);
});

canvas.addEventListener("mousemove", draw);

clearCanvas.addEventListener("click", () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    dataUrl = "";
    console.log(dataUrl);
});
//************THIS WORKS DON'T TOUCH************//
