/**
 * @param {HTMLElement} show
 */
let show = document.querySelector('.showLogo');
show.addEventListener('mouseover', (event) => {
    let [CoordX, CoordY] = [event.pageX, event.pageY];
    let image = document.querySelector('.imgLogo');
    image.style.top = CoordY + 18 + 'px'
    image.style.left = CoordX + 'px';
});