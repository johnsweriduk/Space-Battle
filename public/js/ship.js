class Spaceship {
    constructor(name, hullStrength, firePower, accuracy) {
        this.name = name;
        this.hullStrength = hullStrength;
        this.firePower =  firePower;
        this.accuracy = accuracy;
        this.isAlive = true;
        this.canAttack = true;
        this.score = 0;
        this.lives = 3;
    }
    attack(ship) {
        this.canAttack = false;
        let self = this;
        setTimeout(function() {
            self.canAttack = true;
        }, 1000);
        new Audio('sound/laser.wav').play();
        if(Math.random() <= this.accuracy) {
            // successful hit
            console.log(`${this.name} blasted ${ship.name} for ${this.firePower} damage.`);
            ship.takeDamage(this.firePower);
            if(!ship.isAlive) {
                this.score += 100;
            }
        } else {
            console.log(`${this.name} missed ${ship.name} horribly. Seriously, what were they thinking?`);
        }
    }
    takeDamage(amount) {
        this.hullStrength -= amount;
        if(this.hullStrength <= 0) {
            new Audio('sound/explosion.mp3').play;
            this.isAlive = false;
            console.log(`${this.name} has been destroyed`);
            this.score -= 200;
            this.lives -= 1;
        }
    }
}