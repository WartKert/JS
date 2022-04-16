interface segmentOriginCordInterface {
	[key: string]: {
		[x: string]: number;
	};
}

class Segment {
	imageDataArr: Map<string, ImageData> = new Map();
	pointLines: object = {};
	lineHSeg: segmentOriginCordInterface = {};
	lineVSeg: segmentOriginCordInterface = {};

	constructor(canvas: HTMLCanvasElement) {
		// Определение исходных точек
		let canvasWidth: number = canvas.offsetWidth;
		let canvasHeight: number = canvas.offsetHeight;
		let heightSeg: number = canvasHeight * 0.05;
		let lengthSeg: number = canvasHeight / 2 - (canvasHeight / 2) * 0.05 - 2 * heightSeg;
		let centreH: number = canvasWidth / 2;
		let centreV: number = canvasHeight / 2;
		const segmentOriginCord: segmentOriginCordInterface = {
			h1: { x: centreH + heightSeg / 2 - lengthSeg / 2, y: centreV - lengthSeg },
			v2: { x: centreH + heightSeg + lengthSeg / 2, y: centreV - lengthSeg + heightSeg / 2 },
			v3: { x: centreH + heightSeg + lengthSeg / 2, y: centreV + 1.5 * heightSeg },
			h4: { x: centreH + heightSeg / 2 - lengthSeg / 2, y: centreV + lengthSeg + 1.5 * heightSeg },
			v5: { x: centreH + heightSeg / 2 - lengthSeg / 2, y: centreV + 1.5 * heightSeg },
			v6: { x: centreH + heightSeg / 2 - lengthSeg / 2, y: centreV - lengthSeg + heightSeg / 2 },
			h7: { x: centreH + heightSeg / 2 - lengthSeg / 2, y: centreV + heightSeg },
		};
		// Расчёт приращений для точек линии
		const angle: number = Math.PI / 4;
		let dX2: number = Math.cos(angle) * (heightSeg / 2) * Math.SQRT2;
		let dY2: number = Math.sin(angle) * (heightSeg / 2) * Math.SQRT2;
		let dX3: number = Math.cos(0) * (lengthSeg - 2 * dX2);
		let dY3: number = Math.sin(0) * (lengthSeg - 2 * dX2);
		let dX4: number = dX2;
		let dY4: number = dY2;
		let dX5: number = dX2;
		let dY5: number = dY2;
		let dX6: number = dX3;
		let dY6: number = dY3;
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

		const crArray: readonly string[][] = [
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
		let str: number = 0;
		for (const iterator of crArray) {
			this.imageDataArr.set(String(str), this.createSegment(canvas, iterator, segmentOriginCord));
			str++;
		}
	}

	paintLineSegment(ctx: CanvasRenderingContext2D, posX: number, posY: number, lineObj: segmentOriginCordInterface): void {
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

	createSegment(canvas: HTMLCanvasElement, createData: readonly string[], dataObj: segmentOriginCordInterface): ImageData {
		let ctx = canvas.getContext("2d")!;
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

function drawTime(): void {
	try {
		document.querySelector(".messageError")!.textContent = "";
		let ctx: NodeListOf<HTMLCanvasElement> = document.querySelectorAll(`.canvas`);
		let sizeBlockCanvas: DOMRect = document.querySelector(".blockCanvas")!.getBoundingClientRect();
		for (const iterator of ctx) {
			iterator.setAttribute("width", String(`${sizeBlockCanvas.width / 6}`));
			iterator.setAttribute("height", String(parseInt(`${sizeBlockCanvas.height}`)));
		}
		let part = new Segment(ctx[0]);
		let showedTime: string[] = ["99", "99", "99"];
		setInterval(() => {
			let curTime: Date = new Date();
			let time = [curTime.getHours(), curTime.getMinutes(), curTime.getSeconds()]
				.map((value) => {
					return value < 10 ? "0" + value : value;
				})
				.concat() as string[];
			time.forEach((element, index) => {
				if (element != showedTime[index])
					String(element)
						.split("")
						.forEach((element, ind) => {
							ctx[index + index + ind].getContext("2d")!.putImageData(part.imageDataArr.get(element)!, 0, 0);
						});
			});
		}, 1000);
	} catch (error: any) {
		document.querySelector(".messageError")!.textContent = "Невозможно рассчитать положение циферблата!";
		console.log(error.message);
	}
}

window.onload = drawTime;
