const randomNumberBounded = (min, max) => {
    if(Number.isInteger(min)) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    } else {
        return Math.random() * (max - min) + min;
    }
}

let space = new Space();
let player = new Spaceship('USS Schwarzenegger', 99, 5, 0.7);
$(document).on('click', '#play', (e) => {
    e.preventDefault();

    if(typeof playerName != 'undefined') {
        $.ajax({
            url: '/ship/data/' + playerName
        }).done((ship) => {
            console.log(ship);
            player = new Spaceship(playerName, Math.floor(ship.hp * (1 + (0.1 * (ship.level - 1))) * 20), ship.damage * (1 + (0.1 * (ship.level - 1))), 1);
            space.addPlayer(player);
            space.createOverlay();
            $('.game-over').remove();
            const href= $(e.target).attr('href');
            $.ajax({
                url: href
            }).done( (waves) => {
                for(let wave of waves) {
                    space.nextLevel = false;
                    space.addWave(wave);
                }
                requestAnimationFrame(mainLoop);
                $('.modal.main').hide();
            });
        });
    }
});
$(document).on('click', '#play-level', (e) => {
    e.preventDefault();
    const href= $(e.target).attr('href');
    $.ajax({
        url: href
    }).done( (waves) => {
        for(let wave of waves) {
            space.nextLevel = false;
            space.addWave(wave);
        }
        requestAnimationFrame(mainLoop);
        $('.modal.next-level').hide();
    });
});
$(document).on('click', '#restart', (e) => {
    e.preventDefault();
    space = new Space();
    $('#space').empty();
    $('.modal.main').show();
    $('.modal.next-level').hide();
});
const mainLoop = () => {
    space.update();
    if(!space.nextLevel) {
        requestAnimationFrame(mainLoop);
    }
};
let oldHtml;
$(document).on('click', '.ajax-button', (e) => {
    e.preventDefault();
    let method;
    if($(e.target).hasClass('logout')) {
        method = 'POST';
    } else {
        method = 'GET';
    }
    oldHtml = $('.modal.main').html();
    $.ajax({
        url: $(e.target).attr('href'),
        method: method
    }).done((data) => {
        console.log(data);
        if(method == 'GET') {
            $('.modal.main').html(data);
        } else {
            window.location.href="/";
        }
    });
});
$(document).on('click', '#edit-submit', (e) => {
    e.preventDefault();
    console.log('submit');
    const data = {
        name: $('input[type="hidden"]').val(),
        shiphull: $('#ship-hull').val(),
        shipfirepower: $('input[name="shipfirepower"]').val()
    };
    console.log(data);
    $.ajax({
        url: $('#edit-form').attr('action'),
        data: data,
        method: 'PUT'
    }).done((data) => {
        console.log('test');
        $('.modal.main').html(oldHtml);
    })
})
$(document).on('click', '#new-user', (e) => {
    e.preventDefault();
    const userData = $('#new-user-form').serialize();
    // create user
    // create ship
    // load login data
    $.ajax({
        url: '/users',
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
                    $('.modal.main').html(data);
                });
            });
        } else {
            $('.modal.main').append('<p class="error">Username already taken, please choose another.</p>');
        }
    });
});
$(document).on('click', '#back', (e) => {
    e.preventDefault();
    $('.modal.main').html(oldHtml);
});

$(document).on('click', '#delete-user', (e) => {
   e.preventDefault();
   $.ajax({
       url: '/ship',
       method: 'DELETE'
   }).done((data) => {
        $.ajax({
            url: '/users',
            method: 'DELETE'
        }).done((data) => {
            window.location.href = '/';
        })
   });
});