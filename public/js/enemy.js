class Enemy extends Spaceship {
    constructor(name, hullStrength, firePower, accuracy, velocity) {
        super(name, hullStrength, firePower, accuracy);
        this.velocity = velocity;
        let el = document.createElement('div');
        el.setAttribute('id',this.name);
        el.setAttribute('class','ufo');
        this.domElement = el;
        this.posX = randomNumberBounded(window.innerWidth * 0.1,window.innerWidth * 0.9);
        this.posY = randomNumberBounded(window.innerHeight * 0.1,window.innerHeight * 0.9);
        this.momX = 0;
        this.momY = 0;
    }
    takeDamage(amount) {
        super.takeDamage(amount);
        if(!this.isAlive) {
            this.explode();
        }
    }
    attack(ship) {
        this.canAttack = false;
        let self = this;
        setTimeout(function() {
            self.canAttack = true;
        }, 1000);
        new Audio('sound/ufo-laser.wav').play();
        if(Math.random() <= this.accuracy) {
            // successful hit
            console.log(`${this.name} blasted ${ship.name} for ${this.firePower} damage.`);
            ship.takeDamage(this.firePower);
        } else {
            console.log(`${this.name} missed ${ship.name} horribly. Seriously, what were they thinking?`);
        }
    }
    explode() {
        new Audio('sound/explosion.mp3').play;
        this.domElement.style.backgroundImage = 'url(img/explosion.png)';
        let self = this;
        setTimeout(function() {
            self.domElement.remove();
        }, 500);
    }
    move() {
        let dispX = this.velocity * 5 *  2 * (Math.random() - 0.5);
        let dispY = this.velocity * 5 *  2 * (Math.random() - 0.5);
        this.momX += dispX / 5;
        this.momY += dispY / 5;
        if(Math.abs(this.momX) > 3) {
            this.momX = 0;
        }
        if(Math.abs(this.momY) > 3) {
            this.momY = 0;
        }
        this.posX += dispX + this.momX;
        this.posY += dispY + this.momY;

        // reset if out of bounds
        if(this.posX < window.innerWidth * 0.1) {
            this.posX = window.innerWidth * 0.1;
        }
        if(this.posY < window.innerHeight * 0.1) {
            this.posY = window.innerHeight * 0.1;
        }
        if(this.posX > window.innerWidth * 0.9) {
            this.posX = window.innerWidth * 0.9;
        }
        if(this.posY > window.innerHeight * 0.9) {
            this.posY = window.innerHeight * 0.9;
        }
        this.domElement.style.left = this.posX + 'px';
        this.domElement.style.top = this.posY + 'px';
    }
    enterBattle() {
        document.getElementById('space').appendChild(this.domElement);
    }
}