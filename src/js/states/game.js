var Year = require('../entities/Year');
var Random = require('../helpers/random');
var HUD = require('../helpers/HUD');

var Game = function () {
  this.map = null;
  this.layer = null;
  this.enemy = null;
  this.years = [];
  this.yearsAddSpeed = 10000;
  this.fireRate = 200;
  this.nextFire = 0;
  this.currentYear = null;
  this.currentSpeed = 0;
  this.explosions = null;
  this.HUD = new HUD();
  this.cleared = null;
  this.score = 0;
  this.levelsCleared = 0;
  this.year = 10000;
  this.levelsCount = 0;
};

module.exports = Game;

Game.prototype = {

  create: function () {
    this.physics.startSystem(Phaser.Physics.ARCADE);
    this.map = this.add.tilemap('map');
    this.map.addTilesetImage('level');
    this.layer = this.map.createLayer('Tile Layer 1');
    this.map.setCollisionBetween(1, 5);
    this.layer.resizeWorld();
    this.setUpHud();

    this.enemy = this.add.sprite(0, 0, 'tank', 'tank1');
    this.enemy.anchor.setTo(0.5, 0.5);
    this.enemy.animations.add('move', ['tank1', 'tank2', 'tank3', 'tank4', 'tank5', 'tank6'], 20, true);

    this.game.physics.arcade.collide(this.enemy, this.layer);

    //this.enemy.body.collideWorldBounds = true;

    this.physics.enable(this.enemy, Phaser.Physics.ARCADE);
    this.turret = this.add.sprite(0, 0, 'tank', 'turret');
    this.turret.anchor.setTo(0.3, 0.5);

    this.enemyBullets = this.add.group();
    this.enemyBullets.enableBody = true;
    this.enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.enemyBullets.createMultiple(100, 'bullet');

    this.enemyBullets.setAll('anchor.x', 0.5);
    this.enemyBullets.setAll('anchor.y', 0.5);
    this.enemyBullets.setAll('outOfBoundsKill', true);
    this.enemyBullets.setAll('checkWorldBounds', true);

    //  Our bullet group
    this.bullets = this.add.group();
    this.bullets.enableBody = true;
    this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
    this.bullets.createMultiple(30, 'bullet', 0, false);
    this.bullets.setAll('anchor.x', 0.5);
    this.bullets.setAll('anchor.y', 0.5);
    this.bullets.setAll('outOfBoundsKill', true);
    this.bullets.setAll('checkWorldBounds', true);

    this.explosions = this.add.group();

    for (var i = 0; i < 10; i++)
    {
      var explosionAnimation = this.explosions.create(0, 0, 'kaboom', [0], false);
      explosionAnimation.anchor.setTo(0.5, 0.5);
      explosionAnimation.animations.add('kaboom');
    }

    this.enemy.bringToTop();
    this.turret.bringToTop();

    this.camera.follow(this.enemy);
    this.camera.deadzone = new Phaser.Rectangle(150, 150, 500, 300);
    this.camera.focusOnXY(0, 0);

    this.cursors = this.input.keyboard.createCursorKeys();

    var x = (this.game.width / 2) - 100;
    var y = (this.game.height / 2) - 50;
    this.pushNewYear();
    this.currentYear = this.getRandomYear();
    this.currentYear.activate();
    this.yearText.setText("year:"+this.currentYear.id);
    this.pushYearLoop();
    this.swithYear();
    this.enemiesInLevelText.setText("in this year left:" + _this.currentYear.aliveEnemiesCount());
    document.addEventListener("enemy-destroy", (function(_this) {
      return function(e) {
        _this.enemiesInLevelText.setText("in this year left:" + _this.currentYear.aliveEnemiesCount());
      };
    })(this));


    //this.input.onDown.add(this.onInputDown, this);
  },
  setUpHud: function(){
    this.scoreText = this.add.text(
        50,
        20,
        "",
        {
          size: "32px",
          fill: "#FFF",
          align: "center"
        }
    );
    this.scoreText.setText("score:"+this.levelsCleared);
    this.enemiesInLevelText = this.add.text(
        1000,
        20,
        "",
        {
          size: "32px",
          fill: "#FFF",
          align: "center"
        }
    );
    this.enemiesInLevelText.setText("in this year left:"+this.levelsCleared);
    this.levelClearedText = this.add.text(
        300,
        20,
        "",
        {
          size: "32px",
          fill: "#FFF",
          align: "center"
        }
    );
    this.levelClearedText.setText("cleared:"+this.levelsCleared);
    this.levelCountText = this.add.text(
        700,
        20,
        "",
        {
          size: "32px",
          fill: "#FFF",
          align: "center"
        }
    );
    this.levelCountText.setText("years posible:"+this.levelsCount);
    this.yearText = this.add.text(
        500,
        20,
        "",
        {
          size: "32px",
          fill: "#FFF",
          align: "center"
        }
    );
  },
  swithYear:function(){
    window.setTimeout((function(_this) {
      return function() {
        _this.currentYear.deactivate();
        _this.currentYear = _this.getRandomYear();
        while(_this.currentYear.cleared){
          _this.currentYear = _this.getRandomYear();
        }
        console.log('year swith',_this.currentYear);
        _this.swithYear();
        _this.year = _this.currentYear.id;
        _this.enemiesInLevelText.setText("in this year left:" + _this.currentYear.aliveEnemiesCount());
        _this.yearText.setText("year:"+_this.year);
        _this.currentYear.activate();
        return _this.currentYear
      };
    })(this), this.yearsAddSpeed);
  },

  incClearedLevels: function(){
    this.levelsCleared++;
    this.levelClearedText.setText("cleared:"+this.levelsCleared);
    return this.levelsCleared;
  },
  incScore: function(count){
    this.score+=count;
    this.scoreText.setText("score:"+this.score);
    return this.score;
  },

  pushNewYear:function(){
    var newYear = new Year(Random.randomIntBetween(0,1000).toString(),this, this.enemyBullets, this.enemy,this.bullets);
    newYear.deactivate();
    this.years.push(newYear);
    this.levelsCount = this.years.length;
    this.levelCountText.setText("years posible:"+this.levelsCount);
    this.pushYearLoop()
  },

  pushYearLoop: function(){
    window.setTimeout((function(_this) {
      return function() {
        return _this.pushNewYear();
      };
    })(this), this.yearsAddSpeed);
  },

  update: function () {
    this.physics.arcade.overlap(this.enemyBullets, this.enemy, this.bulletHitPlayer, null, this);

    this.currentYear.enemiesAlive = 0;
    this.currentYear.update();

    if (this.cursors.left.isDown)
    {
      this.enemy.angle -= 4;
    }
    else if (this.cursors.right.isDown)
    {
      this.enemy.angle += 4;
    }

    if (this.cursors.up.isDown)
    {
      //  The speed we'll travel at
      this.currentSpeed = 300;
    }
    else
    {
      if (this.currentSpeed > 0)
      {
        this.currentSpeed -= 4;
      }
    }

    if (this.currentSpeed > 0)
    {
      this.physics.arcade.velocityFromRotation(this.enemy.rotation, this.currentSpeed, this.enemy.body.velocity);
    }
    //
    //this.land.tilePosition.x = -this.camera.x;
    //this.land.tilePosition.y = -this.camera.y;

    this.turret.x = this.enemy.x;
    this.turret.y = this.enemy.y;

    this.turret.rotation = this.physics.arcade.angleToPointer(this.turret);

    if (this.input.activePointer.isDown)
    {
      //  Boom!
      this.fire();
    }
  },

  getRandomYear: function(){
    return Random.randomFromArray(this.years);
  },

  //onInputDown: function () {
  //  this.game.state.start('Menu');
  //}
  bulletHitPlayer: function (enemy, bullet) {

    bullet.kill();

  },

  fire: function() {

    if (this.time.now > this.nextFire && this.bullets.countDead() > 0)
    {
      this.nextFire = this.time.now + this.fireRate;

      var bullet = this.bullets.getFirstExists(false);

      bullet.reset(this.turret.x, this.turret.y);

      bullet.rotation = this.physics.arcade.moveToPointer(bullet, 1000, this.input.activePointer, 500);
    }

  }
};
