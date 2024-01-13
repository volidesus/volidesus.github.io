function kochCurve(ctx, order, length, startX, startY, angle) {
    if (order === 0) {
        const endX = startX + length * Math.cos(angle);
        const endY = startY + length * Math.sin(angle);
        ctx.lineTo(endX, endY);
    } else {
        length /= 3;

        kochCurve(ctx, order - 1, length, startX, startY, angle);
        startX += length * Math.cos(angle);
        startY += length * Math.sin(angle);

        angle += -Math.PI / 3;
        kochCurve(ctx, order - 1, length, startX, startY, angle);

        startX += length * Math.cos(angle);
        startY += length * Math.sin(angle);

        angle += 2 * Math.PI / 3;
        kochCurve(ctx, order - 1, length, startX, startY, angle);

        startX += length * Math.cos(angle);
        startY += length * Math.sin(angle);

        angle += -Math.PI / 3;
        kochCurve(ctx, order - 1, length, startX, startY, angle)
    }

    const gradient = ctx.createLinearGradient(0, 0, ctx.canvas.width, 0);
    gradient.addColorStop(0, 'blue');
    gradient.addColorStop(1, 'red');
    ctx.strokeStyle = gradient;
}

function drawKochCurve(order) {
    const canvas = document.getElementById('kochCanvas');
    const ctx = canvas.getContext('2d');

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let startX = 0;
    const startY = canvas.height / 2;
    const length = 1000;
    let angle = 0;

    ctx.beginPath();
    ctx.moveTo(startX, startY);

    kochCurve(ctx, order, length, startX, startY, angle);
    ctx.lineTo(startX, startY);
    ctx.stroke();

    ctx.closePath();
    ctx.fillStyle = ctx.strokeStyle;
    ctx.fill();
    ctx.stroke();

    angle = Math.PI;
    startX = canvas.width;
    kochCurve(ctx, order, length, startX, startY, angle);
    ctx.lineTo(startX, startY);
    ctx.stroke();
}

drawKochCurve(5);
function updateCanvas() {
    const sliderValue = document.getElementById("mySlider").value;
    drawKochCurve(sliderValue);
    const incrementLabel = document.getElementById('incrementValue');
    incrementLabel.textContent = sliderValue;
}