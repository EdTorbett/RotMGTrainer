var canvas,
        stage,
        screen_width,
        screen_height,
        target,
        target_location = {},
        player,
        background,
        player_radius = 20,
        target_radius = 20,
        bullet_radius = 5,
        player_location = {},
        player_direction = {},
        player_speed = 4,
        bullets = [],
        counter = 0,
        max_bullets = 300,
        bullet_speed = 5,
        interval_between_bullets = 5,
        bullet_lifespan = 100,
        score = 0,
        score_text;

var KEYCODE_SPACE = 32,
        KEYCODE_UP = 38,
        KEYCODE_DOWN = 40,
        KEYCODE_LEFT = 37,
        KEYCODE_RIGHT = 39,
        KEYCODE_W = 87,
        KEYCODE_S = 83,
        KEYCODE_A = 65,
        KEYCODE_D = 68;

var keys_pressed = {
    KEYCODE_W: false,
    KEYCODE_A: false,
    KEYCODE_S: false,
    KEYCODE_D: false,
    KEYCODE_SPACE: false,
    KEYCODE_UP: false,
    KEYCODE_DOWN: false,
    KEYCODE_LEFT: false,
    KEYCODE_RIGHT: false
};

function rx(x) {
    return x - (player_location.x - player.x);
}

function ry(y) {
    return y - (player_location.y - player.y);
}

function ax(x) {
    return x + (player_location.x - player.x);
}

function ay(y) {
    return y + (player_location.y - player.y);
}

function tick() {
    if (!stage.mouseInBounds) {
        return;
    }
    
    var mouseX = ax(stage.mouseX);
    var mouseY = ay(stage.mouseY);
    
    console.log("rx: " + stage.mouseX + ", ry: " + stage.mouseY + ", ax: " + mouseX + ", ay: " + mouseY);
    
    var distance = Math.sqrt(Math.pow(mouseX - target_location.x, 2)
                + Math.pow(mouseY - target_location.y, 2));
        
    if (distance < target_radius) {
        score++;
    }

    // update the stage		
    if (player_direction.x !== 0 || player_direction.y !== 0) {
        player_location.x += (player_direction.x * player_speed);
        player_location.y += (player_direction.y * player_speed);
    }

    counter += 1;

    if (counter >= interval_between_bullets) {
        if (bullets.length >= max_bullets) {
            bullets.shift().remove();
        }

        var startX = target_location.x;
        var startY = target_location.y;

        var new_bullet;
        
        var speed_modifier = 0.75 + (Math.random() * 0.5);
        
        if (Math.random() < 0.05) {
            var count = Math.floor(5 + (Math.random() * 40));
            new_bullet = new bullet_ring(startX,
                    startY,
                    count,
                    bullet_speed * speed_modifier,
                    bullet_lifespan,
                    bullet_radius);
        } else {
            var angle;
            if (Math.random() < 0.2) {
                angle = Math.atan2(player_location.y - startY, player_location.x - startX);
            } else {
                angle = Math.PI * 2 * Math.random();
            }

            new_bullet = new bullet(startX,
                    startY,
                    angle,
                    bullet_speed * speed_modifier,
                    bullet_lifespan,
                    bullet_radius);
        }
        
        bullets.push(new_bullet);

        counter = 0;
    }

    for (var index in bullets) {
        bullets[index].tick();
    }

    //Update the background's drawn position based on player movement
    background.x = rx(0) % 32;
    background.y = ry(0) % 32;

    //Update the target's drawn position based on player movement
    target.x = rx(target_location.x);
    target.y = ry(target_location.y);

    score_text.text = score;

    stage.update();
}

function bullet_ring(x, y, count, speed, life, radius) {
    var self = this;
    self.bullets = [];
    
    var delta_angle = 2 * Math.PI / count;
    var angle = 0;
    for (var i = 0; i < count; i++) {
        var new_bullet = new bullet(x,
                y,
                angle,
                speed,
                life,
                radius);
        bullets.push(new_bullet);
        angle += delta_angle;
    }
    
    self.tick = function() {
        for (var index in bullets) {
            bullets[index].tick;
        }
    };
    self.remove = function() {
        for (var index in bullets) {
            bullets[index].remove();
        }
        bullets = [];
    };
}

function bullet(x, y, angle, speed, life, radius) {
    var self = this;
    self.x = x;
    self.y = y;
    self.dx = Math.cos(angle) * speed;
    self.dy = Math.sin(angle) * speed;
    self.life = life;
    self.db = new createjs.Shape();
    self.radius = radius;
    self.tick = function() {
        self.db.x = rx(self.x += self.dx);
        self.db.y = ry(self.y += self.dy);
        if ((--self.life) <= 0) {
            self.remove();
        }
        
        var distance = Math.sqrt(Math.pow(player_location.x - self.x, 2)
                + Math.pow(player_location.y - self.y, 2));
        
        if (distance < (player_radius + self.radius)) {
            self.remove();
            score = 0;
        }
    };
    self.remove = function() {
        stage.removeChild(self.db);
    };
    self.db.graphics.beginFill("red").drawCircle(0, 0, self.radius);
    self.db.x = x;
    self.db.y = y;
    stage.addChild(self.db);
    return self;
}

function keydown(event) {
    //cross browser issues exist
    if (!e) {
        var e = window.event;
    }
    switch (e.keyCode) {
        case KEYCODE_W:
            keys_pressed.KEYCODE_W = true;
            break;
        case KEYCODE_UP:
            keys_pressed.KEYCODE_UP = true;
            break;
        case KEYCODE_S:
            keys_pressed.KEYCODE_S = true;
            break;
        case KEYCODE_DOWN:
            keys_pressed.KEYCODE_DOWN = true;
            break;
        case KEYCODE_A:
            keys_pressed.KEYCODE_A = true;
            break;
        case KEYCODE_LEFT:
            keys_pressed.KEYCODE_LEFT = true;
            break;
        case KEYCODE_D:
            keys_pressed.KEYCODE_D = true;
            break;
        case KEYCODE_RIGHT:
            keys_pressed.KEYCODE_RIGHT = true;
            break;
    }
    calculate_player_direction();
}

function keyup(event) {
    //cross browser issues exist
    if (!e) {
        var e = window.event;
    }
    switch (e.keyCode) {
        case KEYCODE_W:
            keys_pressed.KEYCODE_W = false;
            break;
        case KEYCODE_UP:
            keys_pressed.KEYCODE_UP = false;
            break;
        case KEYCODE_S:
            keys_pressed.KEYCODE_S = false;
            break;
        case KEYCODE_DOWN:
            ;
            keys_pressed.KEYCODE_DOWN = false;
            break;
        case KEYCODE_A:
            keys_pressed.KEYCODE_A = false;
            break;
        case KEYCODE_LEFT:
            keys_pressed.KEYCODE_LEFT = false;
            break;
        case KEYCODE_D:
            keys_pressed.KEYCODE_D = false;
            break;
        case KEYCODE_RIGHT:
            ;
            keys_pressed.KEYCODE_RIGHT = false;
            break;
    }
    calculate_player_direction();
}

function calculate_player_direction() {
    var up = keys_pressed.KEYCODE_W || keys_pressed.KEYCODE_UP,
            down = keys_pressed.KEYCODE_S || keys_pressed.KEYCODE_DOWN,
            left = keys_pressed.KEYCODE_A || keys_pressed.KEYCODE_LEFT,
            right = keys_pressed.KEYCODE_D || keys_pressed.KEYCODE_RIGHT;

    if (up && down) {
        player_direction.y = 0;
    } else if (up && !down) {
        player_direction.y = -1;
    } else if (!up && down) {
        player_direction.y = 1;
    } else {
        player_direction.y = 0;
    }

    if (left && right) {
        player_direction.x = 0;
    } else if (left && !right) {
        player_direction.x = -1;
    } else if (!left && right) {
        player_direction.x = 1;
    } else {
        player_direction.x = 0;
    }
}

$(function() {
    // Initialise keyboard controls
    $("#canvas").keydown(keydown);
    $("#canvas").keyup(keyup);

    //find canvas and load images, wait for last image to load
    canvas = $("#canvas")[0];
    // create a new stage and point it at our canvas:
    stage = new createjs.Stage(canvas);

    // Maximise the canvas + grab canvas width and height for later calculations
    screen_width = $("#content").width();
    screen_height = $("#content").height();

    canvas.width = screen_width;
    canvas.height = screen_height;

    var tile = $("#bg-tile")[0];

    background = new createjs.Shape();
    background.graphics.beginBitmapFill(tile, "repeat").drawRect(-64, -64, screen_width + 128, screen_height + 128);
    background.x = 0;
    background.y = 0;
    stage.addChild(background);

    player = new createjs.Shape();
    player.graphics.beginFill("green").drawCircle(0, 0, player_radius);
    player.x = screen_width / 2;
    player.y = screen_height / 2;
    player_location.x = 0;
    player_location.y = 0;
    stage.addChild(player);

    target = new createjs.Shape();
    target.graphics.beginFill("red").drawCircle(0, 0, target_radius);
    target.x = screen_width / 2;
    target.y = screen_height / 2;
    target_location.x = target.x;
    target_location.y = target.y;
    stage.addChild(target);

    score_text = new createjs.Text("0", "16px Monospace", "#000");
    score_text.x = 5;
    score_text.y = 24;
    score_text.text = 0;
    score_text.textBaseline = "alphabetic";
    stage.addChild(score_text);
    
    player_direction.x = 0, player_direction.y = 0;

    createjs.Ticker.addListener(window);
    // Best Framerate targeted (60 FPS)
    createjs.Ticker.useRAF = true;
    createjs.Ticker.setFPS(60);
});
