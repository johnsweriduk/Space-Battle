class AlienShipFactory {
    createShip(name) {
        let hullStrength = randomNumberBounded(3, 6);
        let firePower = randomNumberBounded(2,4);
        let accuracy = randomNumberBounded(0.6,0.8);
        let velocity = randomNumberBounded(0.5,1);
        return new Enemy(name, hullStrength, firePower, accuracy, velocity);
    }
}