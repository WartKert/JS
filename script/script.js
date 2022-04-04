/**
 * @param  {string} str
 * @param  {string} op
 * @param {number} number
 * @param {number} b
 * @param {string[]} arr
 * @param  {function} func
 * @param {object} salaries
 */

class Dice {
	_square = {};
	_scoreCoordinate = {};
	/**
	 * @param {number} number
	 */
	constructor(size = 100, originCorX = 100 + size, originCorY = 100 + size) {
		let angle = Math.random() * 2 * Math.PI;
		let dX = Math.cos(angle) * size;
		let dY = Math.sin(angle) * size;
		let dX2 = Math.cos(angle + Math.PI / 2) * size;
		let dY2 = Math.sin(angle + Math.PI / 2) * size;
		let dX3 = Math.cos(angle + Math.PI) * size;
		let dY3 = Math.sin(angle + Math.PI) * size;
		this._square.point1 = { x: originCorX, y: originCorY };
		this._square.point2 = { x: this._square.point1.x + dX, y: this._square.point1.y + dY };
		this._square.point3 = { x: this._square.point2.x + dX2, y: this._square.point2.y + dY2 };
		this._square.point4 = { x: this._square.point3.x + dX3, y: this._square.point3.y + dY3 };
		this._square.center = {
			x: (this._square.point1.x + this._square.point3.x) / 2,
			y: (this._square.point1.y + this._square.point3.y) / 2,
		};
		Object.defineProperty(this._square, "center", { enumerable: false });
		this.score = Math.floor(Math.random() * (6 - 1) + 1);
		this.ok = true;
	}

	/**
	 * @param {number} number
	 * @param {number} size
	 * @param {HTMLCanvasElement} objcanvas
	 */
	paintDice(objcanvas, scale = 10) {
		let ctx = objcanvas.getContext("2d");
		ctx.beginPath();
		this.paintSquare(ctx);
		ctx.closePath();
		ctx.stroke();
		this.paintCircle(ctx, this.searchCord(this.score), scale);
	}
	/**
	 * @param {HTMLCanvasElement} ctx
	 */
	paintSquare(ctx) {
		ctx.moveTo(this._square.point1.x, this._square.point1.y);
		for (const key in this._square) {
			ctx.lineTo(this._square[key].x, this._square[key].y);
		}
	}
	/**
	 * @param {HTMLCanvasElement} ctx
	 * @param {number} x
	 * @param {number} y
	 * @param {number} scale
	 * @param {object} points
	 */
	paintCircle(ctx, points, scale) {
		for (const key in points) {
			ctx.beginPath();
			ctx.arc(points[key].x, points[key].y, scale, 0, 2 * Math.PI, true);
			ctx.fill();
			ctx.stroke();
		}
	}
	/**
	 * @param {object} numDiag
	 * @param {number} numPoint
	 * @param {number} y
	 * @param {number} scale
	 */
	searchCord(numPoint) {
		let pointCircle = {
			1: { x: this._square.center.x, y: this._square.center.y },
			2: { x: (this._square.center.x + this._square.point1.x) / 2, y: (this._square.center.y + this._square.point1.y) / 2 },

			3: {
				x: ((this._square.center.x + this._square.point1.x) / 2 + (this._square.center.x + this._square.point2.x) / 2) / 2,
				y: ((this._square.center.y + this._square.point1.y) / 2 + (this._square.center.y + this._square.point2.y) / 2) / 2,
			},

			4: { x: (this._square.center.x + this._square.point2.x) / 2, y: (this._square.center.y + this._square.point2.y) / 2 },
			5: { x: (this._square.center.x + this._square.point3.x) / 2, y: (this._square.center.y + this._square.point3.y) / 2 },

			6: {
				x: ((this._square.center.x + this._square.point4.x) / 2 + (this._square.center.x + this._square.point3.x) / 2) / 2,
				y: ((this._square.center.y + this._square.point4.y) / 2 + (this._square.center.y + this._square.point3.y) / 2) / 2,
			},

			7: { x: (this._square.center.x + this._square.point4.x) / 2, y: (this._square.center.y + this._square.point4.y) / 2 },
		};

		let deepClone = function (dst = {}, obj = {}) {
			for (const key in obj) {
				if (obj[key] instanceof Object) dst[key] = deepClone({}, obj[key]);
				else dst[key] = obj[key];
			}
			return dst;
		};
		switch (numPoint) {
			case 1:
				return deepClone({}, { 1: pointCircle["1"] });
			case 2:
				return deepClone({}, { 2: pointCircle["2"], 5: pointCircle["5"] });

			case 3:
				return deepClone({}, { 1: pointCircle["1"], 2: pointCircle["2"], 5: pointCircle["5"] });

			case 4:
				return deepClone({}, { 2: pointCircle["2"], 4: pointCircle["4"], 5: pointCircle["5"], 7: pointCircle["7"] });

			case 5:
				return deepClone(
					{},
					{ 1: pointCircle["1"], 2: pointCircle["2"], 4: pointCircle["4"], 5: pointCircle["5"], 7: pointCircle["7"] }
				);
			case 6:
				return deepClone(
					{},
					{
						2: pointCircle["2"],
						3: pointCircle["3"],
						4: pointCircle["4"],
						5: pointCircle["5"],
						6: pointCircle["6"],
						7: pointCircle["7"],
					}
				);

			default:
				return {};
		}
	}
}

class GameDices {
	_dices = {};
	/**
	 * @param {HTMLCanvasElement} objCanvas
	 * @param {number} x
	 * @param {number} y
	 * @param {number} scale
	 * @param {object} points
	 */
	constructor(number = 6, size = 100, objCanvas) {
		this.canvas = objCanvas;
		let i = 2;
		let tryCount = 0;
		let sumScore = 0;
		for (let i = 0; i < number; i++) {
			let tempDice;
			try {
				tempDice = new Dice(
					size,
					Math.random() * (this.canvas.width - 3 * size) + 1.5 * size,
					Math.random() * (this.canvas.height - 3 * size) + 1.5 * size
				);
				for (const key in this._dices) {
					if (this.isIntersections(tempDice._square, this._dices[key]._square)) {
						tryCount++;
						throw new Error("Dices are intersection!");
					}
				}
			} catch (error) {
				console.log(error.message);
				i--;
				if (tryCount > 500) {
					throw new Error("Unable to complete the build!");
				}
				continue;
			}
			this._dices[i] = tempDice;
			sumScore += this._dices[i].score;
		}
		document.querySelector(".messageError").textContent = `Сумма выпавших костей равна ${sumScore}`;
		for (const key in this._dices) {
			this._dices[key].paintDice(this.canvas, size / 10);
		}
	}

	/**
	 * @param {object} pointsObj1
	 * @param {object} pointsObj2
	 */
	isIntersections(pointsObj1, pointsObj2) {
		let firstSquareLines = [];
		let secondSquareLines = [];
		let name = firstSquareLines;
		for (const iterator of arguments) {
			let temp = Object.values(iterator);
			name.push(
				[Object.values(temp[0]), Object.values(temp[1])],
				[Object.values(temp[1]), Object.values(temp[2])],
				[Object.values(temp[2]), Object.values(temp[3])],
				[Object.values(temp[3]), Object.values(temp[0])]
			);
			name = secondSquareLines;
		}
		for (const iterator1 of firstSquareLines) {
			for (const iterator2 of secondSquareLines) {
				let v1 =
					(iterator2[1][0] - iterator2[0][0]) * (iterator1[0][1] - iterator2[0][1]) -
					(iterator2[1][1] - iterator2[0][1]) * (iterator1[0][0] - iterator2[0][0]);
				let v2 =
					(iterator2[1][0] - iterator2[0][0]) * (iterator1[1][1] - iterator2[0][1]) -
					(iterator2[1][1] - iterator2[0][1]) * (iterator1[1][0] - iterator2[0][0]);
				let v3 =
					(iterator1[1][0] - iterator1[0][0]) * (iterator2[0][1] - iterator1[0][1]) -
					(iterator1[1][1] - iterator1[0][1]) * (iterator2[0][0] - iterator1[0][0]);
				let v4 =
					(iterator1[1][0] - iterator1[0][0]) * (iterator2[1][1] - iterator1[0][1]) -
					(iterator1[1][1] - iterator1[0][1]) * (iterator2[1][0] - iterator1[0][0]);
				if (v1 * v2 < 0 && v3 * v4 < 0) return true;
			}
		}
		return false;
	}
}

/**
 * @param {HTMLCanvasElement} ctx
 */
function draw() {
	try {
		document.querySelector(".messageError").textContent = "";
		let ctx = document.querySelector("canvas");
		let size = document.getElementById("divCanvas").getBoundingClientRect();
		ctx.setAttribute("width", size.width);
		ctx.setAttribute("height", size.height);
		let val = document.querySelectorAll(".input");
		let part = new GameDices(+val[0].value, +val[1].value, ctx);
	} catch (error) {
		document.querySelector(".messageError").textContent = "Невозможно рассчитать положение игральных костей!";
		console.log(error.message);
	}
}
