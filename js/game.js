function Game() {

    this.heroClassName = 'tile tileP'
    this.enemyClassName = 'tile tileE'
    this.healClassName = 'tile tileHP'
    this.swordClassName = 'tile tileSW'
    this.wallClassName = 'tile tileW'
    this.floorClassName = 'tile'

    this.wall = new Entity(this.wallClassName)
    this.floor = new Entity(this.floorClassName)
    this.hero = new Hero(100, 5, this.heroClassName, []);
    this.map = new GameMap(24, 40);
    this.chat = new Chat()

    this.wave = 0

    Game.prototype.init = function () {
        this.newGame()
        this.hero.indicatorHealthDraw()
        this.hero.indicatorPowerDraw()

        Enemy.prototype.enemyAction()
        this.hero.bindKeyboardEvents();
    };

    Game.prototype.newWave = function () {
        this.chat.addNote(this.wave + ' волна')
        this.map.mapInit();
        this.map.placeRandomPassages(3, 5, 3, 5);
        this.map.placeRandomRooms(5, 10, 3, 8, 3, 8);
        //Каждую новую волну количество врагов увеличивается и их сила повышается
        Enemy.prototype.genEnemies(9 + this.wave, 9 + this.wave, 24 + this.wave);
        Heal.prototype.genHeal(10, 10);
        Sword.prototype.genSword(2, 40, 50);
        this.map.mapDraw();
        this.updateWave()
    }

    Game.prototype.newHero = function () {
        this.hero = new Hero(100, 5, this.heroClassName, []);
        this.map.placeHero();
    }

    Game.prototype.newGame = function () {
        this.wave = 1
        this.newWave()
        this.newHero()
        this.hero.indicatorHealthDraw()
        this.hero.indicatorPowerDraw()
        this.hero.inventoryDraw()
    }

    Game.prototype.nextLevel = function () {
        this.wave += 1
        this.newWave()
        this.map.placeHero();
    }

    Game.prototype.updateWave = function () {
        var waveElement = document.querySelector('.wave');
        if (waveElement) {
            waveElement.textContent = this.wave;
        }
    }

}

