function Enemy(health, power, className) {
    Person.call(this, health, power, className);
}

Enemy.prototype = Object.create(Person.prototype)
Enemy.prototype.constructor = Enemy;

Enemy.prototype.genEnemies = function (count,  minPower, maxPower) {
    for (var i = 0; i < count; i++) {
        var enemy = new Enemy(100, getRandomInt(minPower, maxPower), game.enemyClassName);
        game.map.placeItems(enemy)
    }
}

Enemy.prototype.moveEnemies = function () {
    //Создание массива врагов с их позициями, чтобы было удобнее взаимодействовать, а то
    //при переборе непосредственно по массиву карты, возникала проблема в тем, что один
    //человечек мог пройти несколько клеток из-за того что попадал несколько раз под и итерацию.
    var enemies = [];
    for (var x = 0; x < game.map.rows; x++) {
        for (var y = 0; y < game.map.columns; y++) {
            if (game.map.map[x][y].className.includes(game.enemyClassName)) {
                enemies.push({ x: x, y: y });
            }
        }
    }

    //В случае, если врагов больше не осталось - запускается новый уровень
    if (!enemies.length) {
        game.nextLevel()
    }

    for (var i = 0; i < enemies.length; i++) {
        var enemyX = enemies[i].x;
        var enemyY = enemies[i].y;

        this.attack(enemyX, enemyY)
        var direction = getRandomInt(1, 4);
        switch (direction) {
            case 1:
                if (enemyX > 0 && game.map.map[enemyX - 1][enemyY].className === game.floor.className) {
                    //Невероято полезный и классный способ копирования объекта для того, чтобы переместить персонажа
                    game. map.map[enemyX - 1][enemyY] = JSON.parse(JSON.stringify(game.map.map[enemyX][enemyY]));
                    game.map.map[enemyX][enemyY] = game.floor;
                }
                break;
            case 2:
                if (enemyX < game.map.rows - 1 && game.map.map[enemyX + 1][enemyY].className === game.floor.className) {
                    game.map.map[enemyX + 1][enemyY] = JSON.parse(JSON.stringify(game.map.map[enemyX][enemyY]));
                    game.map.map[enemyX][enemyY] = game.floor;
                }
                break;
            case 3:
                if (enemyY > 0 && game.map.map[enemyX][enemyY - 1].className === game.floor.className) {
                    //Поворот скина в случае поворота
                    if (!game.map.map[enemyX][enemyY].className.includes('rotate')) {
                        game.map.map[enemyX][enemyY].className += ' rotate'
                    }
                    game.map.map[enemyX][enemyY - 1] = JSON.parse(JSON.stringify(game.map.map[enemyX][enemyY]));
                    game.map.map[enemyX][enemyY] = game.floor;
                }
                break;
            case 4:
                if (enemyY < game.map.columns - 1 && game.map.map[enemyX][enemyY + 1].className === game.floor.className) {
                    if (game.map.map[enemyX][enemyY].className.includes('rotate')) {
                        game.map.map[enemyX][enemyY].className = game.map.map[enemyX][enemyY].className.replace(' rotate', '')
                    }
                    game.map.map[enemyX][enemyY + 1] = JSON.parse(JSON.stringify(game.map.map[enemyX][enemyY]));
                    game.map.map[enemyX][enemyY] = game.floor;
                }
                break;
            default:
                break;
        }

    }
};

Enemy.prototype.enemyAction = function () {
    setInterval(function () {
        Enemy.prototype.moveEnemies();
        game.map.mapDraw();
    }, 1000)
};

Enemy.prototype.attack = function(enemyX, enemyY) {

    //Массив направлений атаки
    var offsets = [
        { x: -1, y: 0 },
        { x: 1, y: 0 },
        { x: 0, y: -1 },
        { x: 0, y: 1 }
    ];

    for (var i = 0; i < offsets.length; i++) {
        var x = enemyX + offsets[i].x;
        var y = enemyY + offsets[i].y;

        if (x >= 0 && x < game.map.rows && y >= 0 && y < game.map.columns) {
            if (game.map.map[x][y].className.includes(game.heroClassName)) {
                game.hero.health -= game.map.map[enemyX][enemyY].power;
                game.chat.addNote('Противник нанес герою урон в размере ' + game.map.map[enemyX][enemyY].power)
                game.map.mapDraw()
                if (game.hero.health <= 0) {
                    game.map.map[x][y] = game.floor;
                    game.chat.addNote('Игрок был убит')
                    game.newGame()
                }
            }
        }
    }

    game.hero.indicatorHealthDraw();
    game.map.mapDraw();
};