function Sword(power, className) {
    Boost.call(this, power, className);
}

Sword.prototype = Object.create(Boost.prototype)
Sword.prototype.constructor = Sword;

Sword.prototype.genSword = function (count,  minPower, maxPower) {
    for (var i = 0; i < count; i++) {
        var sword = new Sword(getRandomInt(minPower, maxPower), game.swordClassName);
        game.map.placeItems(sword)
    }
}

Sword.prototype.improvement = function () {
    game.hero.power += this.power;
    game.chat.addNote('Игрок повысил силу на ' + this.power + ' единиц')
    game.hero.indicatorPowerDraw()
}
