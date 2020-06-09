const randomNumberBounded = (min, max) => {
    if(Number.isInteger(min)) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    } else {
        return Math.random() * (max - min) + min;
    }
}

const space = new Space();
const player = new Spaceship('USS Schwarzenegger', 99, 5, 0.7);
$(document).on('click', '#play', (e) => {
    e.preventDefault();
    space.addPlayer(player);
    space.addAliens(20);
    space.cycleShips();
    requestAnimationFrame(mainLoop);
    $('.modal').hide();
});

const mainLoop = () => {
    space.update();
    requestAnimationFrame(mainLoop);
}
