/**
 * Created by zajca on 12/14/14.
 */
var _ = require('underscore');

HUD = function (game) {
    this.game = game;
    this.huds = [];
};
HUD.prototype.add= function(name,x,y,prefix,initContent){
    var text = this.game.text(
        x,
        y,
        "",
        {
            size: "32px",
            fill: "#FFF",
            align: "center"
        }
    );
    text.prefix = prefix;
    text.name = name;
    text.setText(prefix+": "+initContent);
    this.huds.push(text);
};


HUD.prototype.update = function(name,text) {
    _.each(this.huds,function(hud){
        if(hud.name == name){
            hud.setText(hud.prefix+": "+text);
        }
    });
};


module.exports = HUD;