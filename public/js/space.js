class Space {
    constructor() {
        this.player = '';
        this.aliens = [];
        this.activeAlien = '';
        this.alienShipFactory = new AlienShipFactory();
        this.createOverlay();
    }
    addPlayer(ship) {
        this.player = ship;
    }
    addAliens(numAliens) {
        for(let i = 1; i <= numAliens; i++) {
            this.aliens.push(this.alienShipFactory.createShip(`ufo-${i}`));
        }
    }
    cycleShips() {
        if(this.aliens.length == 0) {
            this.activeAlien = -1;
        } else {
            let newAlien = this.aliens.shift();
            newAlien.enterBattle();
            this.activeAlien = newAlien;
            let self = this;
            this.activeAlien.domElement.addEventListener('click', function() {
                if(self.activeAlien.isAlive && self.player.canAttack) {
                    self.player.attack(self.activeAlien);
                }
            });
        }
    }
    gameLoop() {
        return this.player.isAlive && this.activeAlien != -1;
    }
    update() {
        this.updateOverlay();
        if(this.gameLoop()) {
            // player is alive, game isnt over
            if(this.activeAlien.isAlive) {
                this.activeAlien.move();
            } else {
                this.cycleShips();
            }
            if(Math.random() > 0.996) {
                this.activeAlien.attack(this.player);
            }
        } else {
            if(this.player.hullStrength > 0) {
                alert('You Win!');
            } else {
                alert('GAME OVER!');
            }
            this.resetGame();
        }
    }
    updateOverlay() {
        let healthBar = document.getElementById('health-bar');
        healthBar.innerHTML = this.player.hullStrength;
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
        healthBarInner.style.transform = `translateX(${this.player.hullStrength - 100}%)`;
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
        this.activeAlien = '';
        this.addAliens(20);
        this.cycleShips();
    }
}