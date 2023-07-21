function Heal(power, className) {
    Boost.call(this, power, className);
}

Heal.prototype = Object.create(Boost.prototype)
Heal.prototype.constructor = Heal;

Heal.prototype.genHeal = function (count,  treatment) {
    for (var i = 0; i < count; i++) {
        var heal = new Heal(treatment, game.healClassName);
        game.map.placeItems(heal)
    }
}

Heal.prototype.healing = function () {
    if (game.hero.health < 100) {
        game.hero.health += this.power
        if (game.hero.health > 100) {
            game.hero.health = 100;
        }
    }
    game.chat.addNote('Игрок востановил здоровь на ' + this.power + ' единиц');
    game.hero.indicatorHealthDraw();
}

