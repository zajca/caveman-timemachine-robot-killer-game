Random = require('../helpers/random');

Enemy = function (index, game, player, bullets) {
    this.game = game;
    var x = game.world.randomX;
    var y = game.world.randomY;

    this.game = game;
    this.health = 3;
    this.player = player;
    this.bullets = bullets;
    this.fireRate = 1000;
    this.nextFire = 0;
    this.alive = true;
    this.hidden = true;
    this.price = Random.randomIntBetween(10,100);

    this.enemy = game.add.sprite(x, y, 'enemy', 'tank1');
    this.turret = game.add.sprite(x, y, 'enemy', 'turret');
    this.hide();

    this.enemy.anchor.set(0.5);
    this.turret.anchor.set(0.3, 0.5);

    this.enemy.name = index.toString();
    game.physics.enable(this.enemy, Phaser.Physics.ARCADE);
    this.enemy.body.immovable = false;
    this.enemy.body.collideWorldBounds = true;
    this.enemy.body.bounce.setTo(1, 1);

    this.enemy.angle = game.rnd.angle();

    game.physics.arcade.velocityFromRotation(this.enemy.rotation, 100, this.enemy.body.velocity);

};
Enemy.prototype.hide = function(){
    console.log('enemy hide');
    this.hidden = true;
    this.enemy.visible = false;
    this.turret.visible = false;
};

Enemy.prototype.show = function(){
    console.log('enemy show');
    this.hidden = false;
    this.enemy.visible = true;
    this.turret.visible = true;
};

Enemy.prototype.damage = function() {
    console.log('damage',this.health);
    this.health -= 1;

    if (this.health <= 0)
    {
        this.alive = false;
        this.game.incScore(this.price);

        this.enemy.kill();
        this.turret.kill();

        return true;
    }

    return false;

}

Enemy.prototype.update = function() {

    if(!this.hidden){

        this.turret.x = this.enemy.x;
        this.turret.y = this.enemy.y;
        this.turret.rotation = this.game.physics.arcade.angleBetween(this.enemy, this.player);

        if (this.game.physics.arcade.distanceBetween(this.enemy, this.player) < 300)
        {
            if (this.game.time.now > this.nextFire && this.bullets.countDead() > 0)
            {
                this.nextFire = this.game.time.now + this.fireRate;

                var bullet = this.bullets.getFirstDead();

                bullet.reset(this.turret.x, this.turret.y);

                bullet.rotation = this.game.physics.arcade.moveToObject(bullet, this.player, 500);
            }
        }
    }

};

module.exports = Enemy;