"use strict";
class Segment {
    constructor(canvas) {
        this.imageDataArr = new Map();
        this.pointLines = {};
        this.lineHSeg = {};
        this.lineVSeg = {};
        // Определение исходных точек
        let canvasWidth = canvas.offsetWidth;
        let canvasHeight = canvas.offsetHeight;
        let heightSeg = canvasHeight * 0.05;
        let lengthSeg = canvasHeight / 2 - (canvasHeight / 2) * 0.05 - 2 * heightSeg;
        let centreH = canvasWidth / 2;
        let centreV = canvasHeight / 2;
        const segmentOriginCord = {
            h1: { x: centreH + heightSeg / 2 - lengthSeg / 2, y: centreV - lengthSeg },
            v2: { x: centreH + heightSeg + lengthSeg / 2, y: centreV - lengthSeg + heightSeg / 2 },
            v3: { x: centreH + heightSeg + lengthSeg / 2, y: centreV + 1.5 * heightSeg },
            h4: { x: centreH + heightSeg / 2 - lengthSeg / 2, y: centreV + lengthSeg + 1.5 * heightSeg },
            v5: { x: centreH + heightSeg / 2 - lengthSeg / 2, y: centreV + 1.5 * heightSeg },
            v6: { x: centreH + heightSeg / 2 - lengthSeg / 2, y: centreV - lengthSeg + heightSeg / 2 },
            h7: { x: centreH + heightSeg / 2 - lengthSeg / 2, y: centreV + heightSeg },
        };
        // Расчёт приращений для точек линии
        const angle = Math.PI / 4;
        let dX2 = Math.cos(angle) * (heightSeg / 2) * Math.SQRT2;
        let dY2 = Math.sin(angle) * (heightSeg / 2) * Math.SQRT2;
        let dX3 = Math.cos(0) * (lengthSeg - 2 * dX2);
        let dY3 = Math.sin(0) * (lengthSeg - 2 * dX2);
        let dX4 = dX2;
        let dY4 = dY2;
        let dX5 = dX2;
        let dY5 = dY2;
        let dX6 = dX3;
        let dY6 = dY3;
        // Координаты линий для сегментов
        this.lineHSeg = {
            line1: {
                x: +0 + dX2,
                y: 0 - dY2,
            },
            line2: {
                x: dX2 + dX3,
                y: dY3,
            },
            line3: {
                x: dX4,
                y: dY3 + dY4,
            },
            line4: {
                x: -dX5,
                y: dY5,
            },
            line5: {
                x: -dX2 - dX6,
                y: dY6,
            },
        };
        this.lineVSeg = {
            line1: {
                x: +0 + dX2,
                y: +0 + dY2,
            },
            line2: {
                x: dY3,
                y: dX3,
            },
            line3: {
                x: -dX4,
                y: dY4,
            },
            line4: {
                x: -dX5,
                y: -dY5,
            },
            line5: {
                x: dY6,
                y: -dX6,
            },
        };
        const crArray = [
            ["h1", "v2", "v3", "h4", "v5", "v6"],
            ["v2", "v3"],
            ["h1", "v2", "h4", "v5", "h7"],
            ["h1", "v2", "v3", "h4", "h7"],
            ["v2", "v3", "v6", "h7"],
            ["h1", "v3", "h4", "v6", "h7"],
            ["v3", "h4", "v5", "v6", "h7"],
            ["h1", "v2", "v3"],
            ["h1", "v2", "v3", "h4", "v5", "v6", "h7"],
            ["h1", "v2", "v3", "v6", "h7"],
        ];
        let str = 0;
        for (const iterator of crArray) {
            this.imageDataArr.set(String(str), this.createSegment(canvas, iterator, segmentOriginCord));
            str++;
        }
    }
    paintLineSegment(ctx, posX, posY, lineObj) {
        ctx.moveTo(posX, posY);
        for (const key in lineObj) {
            posX += lineObj[key].x;
            posY += lineObj[key].y;
            ctx.lineTo(posX, posY);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }
    createSegment(canvas, createData, dataObj) {
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (const iterator of createData) {
            for (const key in dataObj) {
                if (key === iterator) {
                    ctx.beginPath();
                    this.paintLineSegment(ctx, dataObj[key].x, dataObj[key].y, key[0] === "h" ? this.lineHSeg : this.lineVSeg);
                    break;
                }
            }
        }
        return ctx.getImageData(0, 0, canvas.width, canvas.height);
    }
}
function drawTime() {
    try {
        document.querySelector(".messageError").textContent = "";
        let ctx = document.querySelectorAll(`.canvas`);
        let sizeBlockCanvas = document.querySelector(".blockCanvas").getBoundingClientRect();
        for (const iterator of ctx) {
            iterator.setAttribute("width", String(`${sizeBlockCanvas.width / 6}`));
            iterator.setAttribute("height", String(parseInt(`${sizeBlockCanvas.height}`)));
        }
        let part = new Segment(ctx[0]);
        let showedTime = ["99", "99", "99"];
        setInterval(() => {
            let curTime = new Date();
            let time = [curTime.getHours(), curTime.getMinutes(), curTime.getSeconds()]
                .map((value) => {
                return value < 10 ? "0" + value : value;
            })
                .concat();
            time.forEach((element, index) => {
                if (element != showedTime[index])
                    String(element)
                        .split("")
                        .forEach((element, ind) => {
                        ctx[index + index + ind].getContext("2d").putImageData(part.imageDataArr.get(element), 0, 0);
                    });
            });
        }, 1000);
    }
    catch (error) {
        document.querySelector(".messageError").textContent = "Невозможно рассчитать положение циферблата!";
        console.log(error.message);
    }
}
window.onload = drawTime;
