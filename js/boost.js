function Boost(power, className) {
    Entity.call(this, className);
    this.power = power;
}

Boost.prototype = Object.create(Entity.prototype)
Boost.prototype.constructor = Boost;

