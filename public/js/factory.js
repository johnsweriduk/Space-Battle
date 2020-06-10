class AlienShipFactory {
    createShip(name, level) {
        let hullStrength = randomNumberBounded(3, 6) * (1 + (level - 1) * 0.1);
        let firePower = randomNumberBounded(2,4) * (1 + (level - 1) * 0.1);
        let accuracy = randomNumberBounded(0.6,0.8) * (1 + (level - 1) * 0.1);
        let velocity = randomNumberBounded(0.5,1) * (1 + (level - 1) * 0.1);
        return new Enemy(name, hullStrength, firePower, accuracy, velocity);
    }
}