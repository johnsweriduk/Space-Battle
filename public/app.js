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
space.createOverlay();
$(document).on('click', '#play', (e) => {
    e.preventDefault();
    const href= $(e.target).attr('href');
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
$(document).on('click', '.ajax-button', (e) => {
    e.preventDefault();
    $.ajax({
        url: $(e.target).attr('href')
    }).done((data) => {
        console.log(data);
        $('.modal').html(data);
    });
})
$(document).on('click', '#new-user', (e) => {
    e.preventDefault();
    const userData = $('#new-user-form').serialize();
    // create user
    // create ship
    // load login data
    $.ajax({
        url: '/users/',
        data: userData,
        method: 'POST'
    }).done( (data) => {
        if(!data.error) {
            const shipData = {
                name: data.user,
                hp: $('input[name="ship-hull"]').val(),
                damage: $('input[name="ship-firepower"]').val()
            };
            console.log(shipData);
            $.ajax({
                url: '/ship',
                data: shipData,
                method: 'POST'
            }).done(() => {
                // load login data
                console.log('test');
                $.ajax({
                    url: '/sessions/new'
                }).done((data) => {
                    $('.modal').html(data);
                });
            });
        } else {
            $('.modal').append('<p class="error">Username already taken, please choose another.</p>');
        }
    });
});
$(document).on('click', '#back', (e) => {
    e.preventDefault();
    const html = '\n' +
        '        <div class="title">' +
        '            <p>Login/Signup</p>' +
        '        </div>\n' +
        '        <div class="buttons">' +
        '            <a id="new-account" class="button ajax-button" href="/users/new">New Account</a>' +
        '            <a id="login" class="button ajax-button" href="/sessions/new">Login</a>' +
        '        </div>';
    $('.modal').html(html);
});