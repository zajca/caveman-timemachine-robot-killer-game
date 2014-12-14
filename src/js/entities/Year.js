var _ = require('underscore');
var Enemy = require("./Enemy");

Year = function (id,game, enemyBullets, player, bullets) {
    this.player = player;
    this.game = game;
    this.bullets = bullets;
    this.enemyBullets = enemyBullets;
    this.id = id;
    this.active = false;
    this.enemies = [];
    this.enemiesTotal = 20;
    this.enemiesAlive = 20;
    this.cleared = false;
    this.event = new CustomEvent("enemy-destroy", { "alive": this.enemiesAlive });
    this.create();

};
Year.prototype.create= function(){
    for (var i = 0; i < this.enemiesTotal; i++)
    {
        this.enemies.push(new Enemy(i, this.game, this.player, this.enemyBullets));
    }

    console.log("new year",this.id);

};

Year.prototype.activate= function(){
    if(this.aliveEnemiesCount() == 0){
        return false;
    }
    console.log("activate",this.id,this.aliveEnemiesCount());
    _.each(this.enemies,function(enemy){
        if(enemy.alive){
            enemy.show();
        }
    });
    this.active = true;
    return true;
};

Year.prototype.aliveEnemiesCount = function(){
    count = 0;
    _.each(this.enemies, (function(_this) {
        return function(enemy) {
            if (enemy.alive) {
                count++;
            }
        };
    })(this));
    return count;
};

Year.prototype.deactivate= function(){
    console.log("deactivate",this.id);
    if(this.aliveEnemiesCount() == 0){
        this.cleared = true;
        this.game.incClearedLevels();
    }
    _.each(this.enemies,function(enemy){
        enemy.hide();
    });
    this.active = false;
};

Year.prototype.update = function() {
    if(this.active){
        for (var i = 0; i < this.enemies.length; i++)
        {
            if (this.enemies[i].alive)
            {
                this.enemiesAlive++;
                this.game.physics.arcade.collide(this.player, this.enemies[i].enemy);
                this.game.physics.arcade.overlap(this.bullets, this.enemies[i].enemy, this.bulletHitEnemy, null, this);
                this.enemies[i].update();
            }
        }
    }
};

Year.prototype.bulletHitEnemy = function(enemy, bullet) {

    bullet.kill();
    //console.log('enemy',this,this.enemies);

    var destroyed = this.enemies[enemy.name].damage();

    if (destroyed)
    {
        this.enemiesAlive--;
        document.dispatchEvent(this.event);
        //console.log(this.explosions);
        //var explosionAnimation = this.explosions.getFirstExists(false);
        //explosionAnimation.reset(enemy.x, enemy.y);
        //explosionAnimation.play('kaboom', 30, false, true);
    }

};

module.exports = Year;