const randomNumberBounded = (min, max) => {
    if(Number.isInteger(min)) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    } else {
        return Math.random() * (max - min) + min;
    }
}

const space = new Space();
const player = new Spaceship('USS Schwarzenegger', 99, 5, 0.7);
space.addPlayer(player);
$(document).on('click', '#play', (e) => {
    e.preventDefault();
    const href= $(e.target).attr('href');
    space.createOverlay();
    $.ajax({
        url: href
    }).done( (waves) => {
        for(let wave of waves) {
            space.nextLevel = false;
            space.addWave(wave);
            requestAnimationFrame(mainLoop);
        }
    });
    $('.modal').hide();
});

const mainLoop = () => {
    space.update();
    if(!space.nextLevel) {
        requestAnimationFrame(mainLoop);
    }
};
