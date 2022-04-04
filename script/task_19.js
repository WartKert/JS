"use strict";
class Segment {
    constructor(width, height) {
        this.numberArr = [];
    }
    paintH(ctx, width, height) {
        let ImData = new ImageData(new Uint8ClampedArray(width * height * 4), width, height, { colorSpace: "srgb" });
    }
}
function draw() {
    try {
        document.querySelector(".messageError").textContent = "";
        let ctx = document.querySelectorAll(".canvas");
        let divSize = document.querySelector(".blockCanvas").getBoundingClientRect();
        for (const iterator of ctx) {
            iterator.setAttribute("width", String(divSize.width * 0.9));
            iterator.setAttribute("height", String(divSize.height * 0.9));
        }
        let val = document.querySelectorAll(".input");
        //let part =
    }
    catch (error) {
        document.querySelector(".messageError").textContent = "Невозможно рассчитать положение циферблата!";
        console.log(error.message);
    }
}
