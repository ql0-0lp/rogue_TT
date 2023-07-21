function Person(health, power, className) {
    Entity.call(this, className);
    this.health = health;
    this.power = power;
}

Person.prototype = Object.create(Entity.prototype)
Person.prototype.constructor = Person;

