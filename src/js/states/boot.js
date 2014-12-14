var Boot = function () {};

module.exports = Boot;

Boot.prototype = {

  preload: function () {
    this.load.image('preloader', 'assets/preloader.gif');
    this.load.tilemap('map', 'assets/map2.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.image('level', 'assets/map2.png');

    this.load.atlas('tank', 'assets/games/tanks/tanks.png', 'assets/games/tanks/tanks.json');
    this.load.atlas('enemy', 'assets/games/tanks/enemy-tanks.png', 'assets/games/tanks/tanks.json');
    this.load.image('logo', 'assets/games/tanks/logo.png');
    this.load.image('bullet', 'assets/games/tanks/bullet.png');
    this.load.image('earth', 'assets/games/tanks/scorched_earth.png');
    this.load.spritesheet('kaboom', 'assets/games/tanks/explosion.png', 64, 64, 23);
  },

  create: function () {
    this.game.input.maxPointers = 1;

    if (this.game.device.desktop) {
      this.game.stage.scale.pageAlignHorizontally = true;
    } else {
      this.game.stage.scaleMode = Phaser.StageScaleMode.SHOW_ALL;
      this.game.stage.scale.minWidth =  480;
      this.game.stage.scale.minHeight = 260;
      this.game.stage.scale.maxWidth = 1000;
      this.game.stage.scale.maxHeight = 500;
      this.game.stage.scale.forceLandscape = true;
      this.game.stage.scale.pageAlignHorizontally = true;
      this.game.stage.scale.setScreenSize(true);
    }

    this.game.state.start('Preloader');
  }
};
