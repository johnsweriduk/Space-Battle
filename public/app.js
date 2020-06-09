const space = new Space();
const player = new Spaceship('USS Schwarzenegger', 99, 5, 0.7);
space.addPlayer(player);
space.addAliens(20);
space.cycleShips();

const mainLoop = () => {
    space.update();
    requestAnimationFrame(mainLoop);
}

requestAnimationFrame(mainLoop);