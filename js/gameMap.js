function GameMap(rows, columns) {
    this.rows = rows;
    this.columns = columns;
    this.map = [];

    this.playerX = null;
    this.playerY = null;
}

//Первоначальная инициализация карты из стен
GameMap.prototype.mapInit = function() {
    this.map = []
    for (var i = 0; i < this.rows; i++) {
        var row = [];
        for (var j = 0; j < this.columns; j++) {
            row.push(game.wall);
        }
        this.map.push(row);
    }
};

GameMap.prototype.placeRandomRooms = function (roomCountMin, roomCountMax, roomWidthMin, roomWidthMax, roomHeightMin, roomHeightMax) {
    var roomCount = getRandomInt(roomCountMin, roomCountMax);

    for (var k = 0; k < roomCount; k++) {
        var roomWidth = getRandomInt(roomWidthMin, roomWidthMax);
        var roomHeight = getRandomInt(roomHeightMin, roomHeightMax);

        //Этот чекер предназначен для для того, что бы у комнаты ТОЧНО был вход и выход.
        //Принцип работы просто: даются координаты и от них происходит проверка по всему периметру комнаты.
        //Ессли хотя вы в один раз будет встрчен скин пола, значит при генерации комнаты в неё будет доступ,
        //в противном случа, если не было встречно не одного пола - в комнату не получится получить доступ и
        //необходимо заново сгенерировать координаты комнаты и вновь их проверить.
        var check = true
        while (check) {
            var startX = getRandomInt(0, this.columns - roomWidth - 1);
            var startY = getRandomInt(0, this.rows - roomHeight - 1);
            for (var x = startX; x < startX + roomWidth; x++) {
                for (var y = startY; y < startY + roomHeight; y++) {
                    if (this.map[y][x].className === game.floorClassName) {
                        check = false
                        break
                    }
                }
                if (!check) {
                    break
                }
            }
        }

        // Заполняем ячейки карты, чтобы создать комнату
        for (var x = startX; x < startX + roomWidth; x++) {
            for (var y = startY; y < startY + roomHeight; y++) {
                this.map[y][x] = game.floor;
            }
        }
    }
}

GameMap.prototype.getFreeSpace = function () {
    var x = getRandomInt(0, this.rows - 1);
    var y = getRandomInt(0, this.columns - 1);

    while (this.map[x][y].className !== game.floorClassName) {
        x = getRandomInt(0, this.rows - 1);
        y = getRandomInt(0, this.columns - 1);
    }

    return {x: x, y: y}
}

GameMap.prototype.placeRandomPassages = function (minVerticalPassages, maxVerticalPassages, minHorizontalPassages, maxHorizontalPassages) {
    var verticalPassages = getRandomInt(minVerticalPassages, maxVerticalPassages);
    for (var i = 0; i < verticalPassages; i++) {
        var x = getRandomInt(0, this.rows - 1);
        for (var y = 0; y < this.columns; y++) {
            this.map[x][y] = game.floor;
        }
    }

    var horizontalPassages = getRandomInt(minHorizontalPassages, maxHorizontalPassages);
    for (var j = 0; j < horizontalPassages; j++) {
        var y = getRandomInt(0, this.columns - 1);
        for (var x = 0; x < this.rows; x++) {
            this.map[x][y] = game.floor;
        }
    }
};

GameMap.prototype.placeItems = function (item) {
    var cords = this.getFreeSpace()
    this.map[cords.x][cords.y] = item;
};

GameMap.prototype.placeHero = function () {
    var cords = this.getFreeSpace()
    this.map[cords.x][cords.y] = game.hero;
    this.playerX = cords.x
    this.playerY = cords.y
}

GameMap.prototype.mapDraw = function () {
    // Очищаем поле перед отрисовкой
    var fieldElement = document.querySelector('.field');
    fieldElement.innerHTML = '';
    // Проходим по всем элементам карты и отрисовываем их
    for (var i = 0; i < this.rows; i++) {
        for (var j = 0; j < this.columns; j++) {
            var tileElement = document.createElement('div');
            tileElement.className = this.map[i][j].className;
            if (this.map[i][j].health) {
                var healthElement = document.createElement('div');
                healthElement.className = 'health';
                //Используется именно include, потому что иногда к герою дописывается класс для его разворота
                if (this.map[i][j].className.includes(game.heroClassName)) {
                    healthElement.style.width = game.hero.health.toString() + '%'

                } else {
                    healthElement.style.width = this.map[i][j].health.toString() + '%'
                }
                tileElement.appendChild(healthElement)
            }
            fieldElement.appendChild(tileElement);
        }
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}