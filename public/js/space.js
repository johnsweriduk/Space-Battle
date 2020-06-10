class Space {
    constructor() {
        this.player = '';
        this.activeWave = [];
        this.waves = [];
        this.alienShipFactory = new AlienShipFactory();
        this.currentLevel = 1;
        this.nextLevel = false;
        this.shipCount = 1;
        this.moveTimeout = true;
        this.originalHullStrength;
    }
    addPlayer(ship) {
        this.player = ship;
        this.originalHullStrength = ship.hullStrength;
    }
    addWave(numAliens) {
        const wave = [];
        for(let i = 1; i <= numAliens; i++) {
            wave.push(this.alienShipFactory.createShip(`ufo-${this.shipCount}`, this.currentLevel));
            this.shipCount++;
        }
        this.waves.push(wave);
    }
    cycleWaves() {
        if(this.activeWave.length > 0) {
            //this.activeWave = [];
        } else {
            let newWave = this.waves.shift();
            for(let alien of newWave) {
                alien.enterBattle();
            }
            this.activeWave = newWave;
            let self = this;
            for(let alien of this.activeWave) {
                alien.domElement.addEventListener('click', function () {
                    if (alien.isAlive && self.player.canAttack) {
                        self.player.attack(alien);
                    }
                });
            }
        }
    }
    gameLoop() {
        return this.player.hullStrength > 0 && (this.activeWave.length > 0 || this.waves.length > 0);
    }
    update() {
        this.updateOverlay();
        for(let i = 0; i < this.activeWave.length; i++) {
            if(!this.activeWave[i].isAlive) {
                this.activeWave.splice(i, 1);
            }
        }
        if(this.gameLoop()) {
            // player is alive, game isnt over
            if(this.activeWave.length > 0 && this.moveTimeout) {
                for(let alien of this.activeWave) {
                    alien.move();
                }
                this.moveTimeout = false;
                const self = this;
                setTimeout( () => {
                    self.moveTimeout = true;
                }, 100);
            } else if(this.waves.length > 0) {
                this.cycleWaves();
            }
            for(let alien of this.activeWave) {
                if (Math.random() > 0.99935) {
                    alien.attack(this.player);
                }
            }
        } else {
            if(this.player.hullStrength > 0 && !this.nextLevel) {
                this.nextLevel = true;
                this.currentLevel++;
                const data = {
                    name: playerName,
                    score: space.player.score
                };
                $.ajax({
                    url: '/ship',
                    data: data,
                    method: 'PUT'
                }).done((data) => {
                    // do nothing
                });
                $('.next-level .level').html(this.currentLevel);
                $('.next-level a:first-child').attr('href', '/enemy/' + this.currentLevel);
                $('.next-level').show();
            } else if(!this.nextLevel) {
                //alert('GAME OVER!');
                // reset
                this.resetGame();
            }
        }
    }
    updateOverlay() {
        let healthBar = document.getElementById('health-bar');
        healthBar.innerHTML = Math.floor(this.player.hullStrength);
        let healthBarInner = document.getElementById('health-inner');
        let healthBarOuter = document.getElementById('health');
        if(this.player.hullStrength < 66 && this.player.hullStrength > 33) {
            healthBar.style.backgroundColor = 'yellow';
            healthBarInner.style.backgroundColor = 'yellow';
        } else if(this.player.hullStrength < 33) {
            healthBar.style.backgroundColor = 'red';
            healthBarInner.style.backgroundColor = 'red';
            healthBarOuter.style.borderColor = 'yellow';
        } else {
            healthBar.style.backgroundColor = 'green';
            healthBarInner.style.backgroundColor = 'green';
            healthBarOuter.style.borderColor = 'red';
        }
        healthBarInner.style.transform = `translateX(${(this.originalHullStrength - this.player.hullStrength) / this.originalHullStrength * -100}%)`;
    }
    createOverlay() {
        let overlay = document.createElement('div');
        overlay.setAttribute('id','overlay');
        overlay.setAttribute('class', 'overlay');

        let healthDiv = document.createElement('div');
        healthDiv.setAttribute('id','health-bar');
        healthDiv.setAttribute('class', 'health-bar');
        healthDiv.innerHTML = this.player.hullStrength;

        let healthBar = document.createElement('div');
        healthBar.setAttribute('id','health');
        healthBar.setAttribute('class','health');

        let healthBarInner = document.createElement('div');
        healthBarInner.setAttribute('id','health-inner');
        healthBarInner.setAttribute('class','health-inner');

        healthBar.appendChild(healthBarInner);

        overlay.appendChild(healthDiv);
        overlay.appendChild(healthBar);

        document.getElementById('space').appendChild(overlay);
    }
    resetGame() {
        this.player = new Spaceship('USS Schwarzenegger', 99, 5, 0.7);
        for(let ship of this.activeWave) {
            ship.explode();
        }
        this.currentLevel = 1;
        $('.modal.next-level').show();
        const $gameOver = $('<div>').addClass('game-over').html('<p>Game Over</p>');
        $('.modal.next-level').prepend($gameOver);
        $('.next-level .level').html(this.currentLevel);
        $('.next-level a:first-child').attr('href', '/enemy/' + this.currentLevel);
        this.activeWave = [];
        this.waves = [];
        this.nextLevel = true;
    }
}