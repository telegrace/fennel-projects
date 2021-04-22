//************THIS WORKS DON'T TOUCH************//
let coord = { x: 0, y: 0 };
let pendown = false;
function startdrawing(event) {
    pendown = true;
    getPosition(event);
}
function stopdrawing() {
    pendown = false;
}
function draw(event) {
    if (!pendown) return;
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    ctx.moveTo(coord.x, coord.y);
    getPosition(event);
    ctx.lineTo(coord.x, coord.y);
    ctx.stroke();
}
function getPosition(event) {
    coord.x = event.clientX - canvas.offsetLeft;
    coord.y = event.clientY - canvas.offsetTop;
}
//************THIS WORKS DON'T TOUCH************//
