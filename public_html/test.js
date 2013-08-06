var playerDX = 0;
var playerDY = 0;

var counter = 0;

var maxBullets = 50;
var intervalBetweenBullets = 10;

var playerSpeed = 4;
var bulletSpeed = 1.2;

var inTarget = 0;

var score = 0;

function tick() {
	var player = $("#player");
	var target = $("#target");
	var arena = $("#arena");
	
	var playerPos = player.position();
	var targetPos = target.position();
	
	playerPos.top += playerDY;
	playerPos.left += playerDX;
	
	if (playerPos.top < 16) {
		playerPos.top = 16;
	}
	if (playerPos.left < 16) {
		playerPos.left = 16;
	}

	if (playerPos.top > arena.height() - 16) {
		playerPos.top = arena.height() - 16;
	}
	if (playerPos.left > arena.width() - 16) {
		playerPos.left = arena.width() - 16;
	}

	player.css({"top": playerPos.top, "left": playerPos.left});
	
	var bullets = $(".bullet", arena);
	
	bullets.each(moveBullet);
	
	counter += 1;	
	
	if (bullets.length < maxBullets && counter >= intervalBetweenBullets) {
	
		var angle = Math.atan2(playerPos.top - targetPos.top, playerPos.left - targetPos.left) * 180 / Math.PI;
	
		spawnBullet({
			"top": targetPos.top,
			"left": targetPos.left,
			"speed": bulletSpeed,
			"angle": angle
		});
		counter = 0;
	}
        
        if (inTarget) {
            score += 0.1;
            if (score > 100) {
                score = 100;
            }
        } else {
            score -= 0.2;
            if (score < 0) {
                score = 0;
            }
        }
        
        $("#score").css("width", score + "%");
        
        centerArenaOnPlayer();
}

function centerArenaOnPlayer() {
    var player = $("#player");
    var arena = $("#arena");
    var arenaBounds = $("#arenaBounds");

    var playerPos = player.position();
    var arenaCenterX = arenaBounds.width() / 2;
    var arenaCenterY = arenaBounds.height() / 2;

    arena.css({
            "top": arenaCenterY - playerPos.top,
            "left": arenaCenterX - playerPos.left
        });
}

function moveBullet() {
	var bullet = $(this);
	
	var arena = $("#arena");
	var player = $("#player");
	
	var playerPos = player.position();
	
	var dX = bullet.data("dx");
	var dY = bullet.data("dy");

	var bulletPos = bullet.position();
	
	bulletPos.top += dY;
	bulletPos.left += dX;
	
	if (bulletPos.top < 4) {
		bullet.remove();
	}
	if (bulletPos.left < 4) {
		bullet.remove();
	}

	if (bulletPos.top >= arena.height() - 4) {
		bullet.remove();
	}
	if (bulletPos.left >= arena.width() - 4) {
		bullet.remove();
	}
        
	if (bulletPos.top > playerPos.top - 18
            && bulletPos.top < playerPos.top + 18
            && bulletPos.left > playerPos.left - 18
            && bulletPos.left < playerPos.left + 18) {
                score = 0;
		bullet.remove();
	}
	if (bulletPos.left < 4) {
		bullet.remove();
	}

	if (bulletPos.top >= arena.height() - 4) {
		bullet.remove();
	}
	if (bulletPos.left >= arena.width() - 4) {
		bullet.remove();
	}        
	
	bullet.css({"top": bulletPos.top, "left": bulletPos.left});
}

function spawnBullet(bullet) {
	
	var dx = bullet.speed * Math.cos(bullet.angle * Math.PI / 180);
	var dy = bullet.speed * Math.sin(bullet.angle * Math.PI / 180);
	
	var arena = $("#arena");
	
	$("<div/>")
		.addClass("bullet")
		.data({"dx": dx, "dy": dy})
		.css({"top": bullet.top, "left": bullet.left})
		.appendTo(arena);
}

function keydown(event) {
	var key = event.which;
	if (key >= 37 && key <= 40) {
		event.preventDefault();
		switch (key) {
			case 37: //Left
				playerDX = -playerSpeed;
				break;
			case 38: //Up
				playerDY = -playerSpeed;
				break;
			case 39: //Right
				playerDX = playerSpeed;
				break;
			case 40: //Down
				playerDY = playerSpeed;
				break;
		}
	} else {
		console.log("Down: " + key);
	}
}

function keyup(event) {
	var key = event.which;
	if (key >= 37 && key <= 40) {
		event.preventDefault();
		switch (key) {
			case 37: //Left
				playerDX = 0;
				break;
			case 38: //Up
				playerDY = 0;
				break;
			case 39: //Right
				playerDX = 0;
				break;
			case 40: //Down
				playerDY = 0;
				break;
		}
	} else {
		console.log("Up: " + key);
	}	
}

function mouseovertarget() {
    inTarget = 1;
}

function mouseleavetarget() {
    inTarget = 0;
}

$(function() {
	$(window).keydown(keydown);
	$(window).keyup(keyup);

	$("#target").hover(mouseovertarget, mouseleavetarget);
    
	setInterval(tick, 25);
});
