function Hero(health, power, className, inventory) {
    Person.call(this, health, power, className);
    this.inventory = inventory
}

Hero.prototype = Object.create(Person.prototype)
Hero.prototype.constructor = Hero;

Hero.prototype.bindKeyboardEvents = function() {
    // Сохраняем ссылку на текущий объект Game для использования в обработчиках событий
    var self = this;

    if (game.map.playerX !== null) {
        // Функция обработки нажатия клавиш
        function handleKeyPress(event) {
            // Получаем код нажатой клавиши
            var key = event.keyCode;

            switch (key) {
                case 87:
                case 38:
                    self.movePlayer(game.map.playerX - 1, game.map.playerY);
                    break;

                case 83:
                case 40:
                    self.movePlayer(game.map.playerX + 1, game.map.playerY);
                    break;

                case 65:
                case 37:
                    //добавление класса для разворота
                    if (!self.className.includes('rotate')) {
                        self.className += ' rotate'
                    }
                    self.movePlayer(game.map.playerX, game.map.playerY - 1);
                    break;

                case 68:
                case 39:
                    if (self.className.includes('rotate')) {
                        self.className = self.className.replace(' rotate', '')
                    }
                    self.movePlayer(game.map.playerX, game.map.playerY + 1);
                    break;
                case 32:
                    self.attack();
                    break;
                case 72:
                    self.healing();
                    break;
            }
        }
    }

    window.addEventListener('keydown', handleKeyPress);
};

Hero.prototype.inventoryDraw = function () {
    //олучение ссылки и отчистка
    var fieldElement = document.querySelector('.inventory');
    fieldElement.innerHTML = '';

    //Итерация инвентаря и отрисока
    for (var i = 0; i < this.inventory.length; i++) {
        var tileElement = document.createElement('div');
        tileElement.className = this.inventory[i].className;
        fieldElement.appendChild(tileElement);
    }
}

Hero.prototype.indicatorHealthDraw = function () {
    var fieldElement = document.querySelector('.indicator-health');
    fieldElement.innerHTML = '';
    fieldElement.textContent = this.health;
}

Hero.prototype.indicatorPowerDraw = function () {
    var fieldElement = document.querySelector('.indicator-power');
    fieldElement.innerHTML = '';
    fieldElement.textContent = this.power;
}

Hero.prototype.movePlayer = function(newX, newY) {
    // Проверяем, чтобы новые координаты были в пределах карты и являлись пустыми клетками
    if (
        newX >= 0 && newX < game.map.rows && newY >= 0 && newY < game.map.columns &&
        game.map.map[newX][newY].className !== game.wall.className &&
        !game.map.map[newX][newY].className.includes(game.enemyClassName)
    ) {

        var target = game.map.map[newX][newY]
        if (target.className === game.healClassName) {
            if (this.health === 100 && this.inventory.length < 25) {
                //Если хп равны 100, то хилка закидывается в инвентарь.
                //Вновь используется невероятный метод копирования, потому что, чистов в теории,
                //все объекты хилок могут быть разными, ведь можно задать рандомное количество
                //восполняемого здоровья
                this.inventory.push(JSON.parse(JSON.stringify(target)))
                this.inventoryDraw()
            } else {
                target.healing()
            }
        }
        if (target.className === game.swordClassName) {
            target.improvement()
        }

        game.map.map[newX][newY] = JSON.parse(JSON.stringify(this));
        // Обновляем старые координаты героя на карте
        game.map.map[game.map.playerX][game.map.playerY] = game.floor;
        game.map.playerX = newX;
        game.map.playerY = newY;

        game.map.mapDraw();
    }
};

Hero.prototype.attack = function() {
    // Проверяем, чтобы новые координаты были в пределах карты и являлись пустыми клетками
    var offsets = [
        { x: -1, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: -1 },
        { x: 0, y: 1 }
    ];

    for (var i = 0; i < offsets.length; i++) {
        var x = game.map.playerX + offsets[i].x;
        var y = game.map.playerY + offsets[i].y;

        var target = game.map.map[x][y]

        // Проверка на то, находится ли поле в пределах границ карты и содержит ли врага
        if (x >= 0 && x < game.map.rows && y >= 0 && y < game.map.columns) {
            if (target.className.includes(game.enemyClassName)) {
                // Если это враг, то у него обязательно будет поле здоровья, на это и проверка
                if (target.health) {
                    target.health -= this.power;
                    //Если хп меньше или равны 0, то поле заменяется на пол
                    if (target.health <= 0) {
                        game.map.map[x][y] = game.floor;
                    }
                }
            }
        }
    }

    game.map.mapDraw();
};

Hero.prototype.healing = function () {
    //Проверка на уровень здоровья героя и содержание инвантаря
    if (this.inventory.length && this.health < 100) {
        this.health += this.inventory[0].power
        if (this.health > 100) {
            this.health = 100
        }
        //Если воспользовались первым зельем, то оно удаляется
        this.inventory.shift()
        this.inventoryDraw()
        game.map.mapDraw()
    }
    this.indicatorHealthDraw()
    game.chat.addNote('Игрок востановил здоровь на ' + this.inventory[0].power + ' единиц');
}