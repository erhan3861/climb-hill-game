// https://www.youtube.com/watch?v=3eCU97h0YHs

// mobile check
let mobilmi = false;
(function (a) {
    if (
        /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
            a
        ) ||
        /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
            a.substr(0, 4)
        )
    )
        mobilmi = true;
})(navigator.userAgent || navigator.vendor || window.opera);
console.log(mobilmi);

// setup
var c = document.createElement("canvas");
c.width = window.innerWidth;
c.height = window.innerHeight;
document.body.appendChild(c);
var ctx = c.getContext("2d");

var pts = [];
while (pts.length < 254) {
    while (pts.includes((val = Math.floor(Math.random() * 255))));
    pts.push(val);
}
pts.push(pts[0]); // döngü oluşturmak için ilk elemanı sona ekliyoruz

var lerp = (a, b, t) => a + (b - a) * (1 - Math.cos(t * Math.PI)) / 2; // lerp fonksiyonu

// noise fonksiyonu
var noise = (x) => {
    x = (x * 0.01) % 254;
    return lerp(pts[Math.floor(x)], pts[Math.ceil(x)], x - Math.floor(x));
};

// init
var bgcolor = "#ff4301"; // turuncu
var forecolor = "#4a3f35"; // açık gri
var linecolor = "#2f2519"; // koyu gri
var linewidth = 10;
var offset = -10;
var yRatio = 0.3;
var t = 0;
var speed = 0;
var playing = true;
var k = { ArrowUp: 0, ArrowLeft: 0, ArrowRight: 0 }; // klavye tuşları

// Puan ve süre değişkenleri
var score = 0;
var startTime = Date.now();
var elapsedTime = 0;

var player = new (function () {
    this.x = c.width / 2;
    this.y = 50;
    this.truck = new Image();
    this.truck.src = "jeep1.png";
    this.rot = 0;
    this.ySpeed = 0;
    this.rSpeed = 0;

    // interface
    this.startBtn = new Image();
    this.startBtn.src = "play.png";
    this.leftBtn = new Image();
    this.leftBtn.src = "left.png";
    this.rightBtn = new Image();
    this.rightBtn.src = "right.png";
    this.fireBtn = new Image();
    this.fireBtn.src = "gas.png";

    this.drawInterface = function () {
        if (playing) {
            if (mobilmi) {
                ctx.drawImage(this.leftBtn, 20, c.height - 90, 70, 70);
                ctx.drawImage(this.rightBtn, 110, c.height - 90, 70, 70);
                ctx.drawImage(this.fireBtn, c.width - 90, c.height - 90, 70, 70);
            }
        } else {
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = "75px Impact";
            ctx.fillStyle = "white";
            ctx.fillText("OYUN BİTTİ", c.width / 2, c.height / 3);

            

            ctx.drawImage(this.startBtn, c.width / 2 - 40, c.height / 3+50, 100, 100);

            // Puanı göster
            ctx.font = "50px Impact";
            ctx.fillText("Puan: " + score, c.width / 2, c.height / 3+250);
        }
    };

    this.draw = function () {
        var p1 = c.height * 0.9 - noise(this.x + t) * yRatio;
        var p2 = c.height * 0.9 - noise(this.x + t + 5) * yRatio;

        var gnd = 0;
        var offset = 18;
        if (p1 - offset > this.y) {
            this.ySpeed += 0.1;
        } else {
            this.ySpeed -= this.y - (p1 - offset);
            this.y = p1 - offset;
            gnd = 1;
        }

        // fall check
        if (!playing || (gnd && Math.abs(this.rot) > Math.PI * 0.5)) {
            playing = false;
            this.rSpeed = 0.5;
            k.ArrowUp = 1;
            this.x -= speed * 5;
        }

        var angle = Math.atan2(p2 - offset - this.y, this.x + 5 - this.x);
        if (gnd && playing) {
            this.rot -= (this.rot - angle) * 0.5;
            this.rSpeed = this.rSpeed - (angle - this.rot);
        }

        this.rSpeed += (k.ArrowLeft - k.ArrowRight) * 0.05;
        this.rot -= this.rSpeed * 0.05;

        this.rot -= this.rSpeed * 0.1;

        if (this.rot > Math.PI) this.rot = -Math.PI;
        if (this.rot < -Math.PI) this.rot = Math.PI;

        this.y += this.ySpeed;

        // truck draw
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rot);
        ctx.drawImage(this.truck, -40, -40, 80, 80);
        ctx.restore();
    };
})();

// Puan hesaplama fonksiyonu
function calculateScore() {
    if (!playing) return;
    elapsedTime = (Date.now() - startTime) / 1000; // Geçen süreyi saniye cinsinden hesapla
    score = Math.floor(elapsedTime * speed * 10); // Süre ve hıza göre puan hesapla
}

// draw
function draw() {
    speed -= (speed - k.ArrowUp) * 0.01; // 1 olamayan hızı 1'e yaklaştırıyoruz
    t += 10 * speed; // t değerini arttırıyoruz
    t++;

    // bg
    ctx.fillStyle = bgcolor;
    ctx.fillRect(0, 0, c.width, c.height);

    player.draw();

    // ground
    ctx.fillStyle = forecolor;
    ctx.strokeStyle = linecolor;
    ctx.lineWidth = linewidth;
    ctx.beginPath();
    ctx.moveTo(offset, c.height - offset);

    for (let i = offset; i < c.width - offset; ++i) {
        ctx.lineTo(i, c.height * 0.9 - noise(i + t) * yRatio);
    }

    ctx.lineTo(c.width - offset, c.height - offset);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Puanı hesapla ve göster
    calculateScore();
    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.textAlign = "left";
    ctx.fillText("Puan: " + score, 20, 40);

    player.drawInterface();

    requestAnimationFrame(draw);
}

draw();

if (mobilmi) {
    c.addEventListener("touchstart", handleStart, false);
    c.addEventListener("touchend", handleEnd, false);
} else {
    // desktop click
    onkeydown = (d) => (k[d.key] = 1);
    onkeyup = (d) => (k[d.key] = 0);
    c.addEventListener("mousedown", handleInput, false);
}

window.onresize = function () {
    window.location.reload();
};

function handleStart(evt) {
    evt.preventDefault();
    var touches = evt.changedTouches;
    for (let i = 0; i < touches.length; i++) {
        var touch = touches[i];

        if (
            touch.pageX > c.width / 2 - 40 &&
            touch.pageX < c.width / 2 + 40 &&
            touch.pageY > c.height / 3 + 150 &&
            touch.pageY < c.height / 3 + 250
        ) {
            // Oyunu yeniden başlat
            score = 0;
            startTime = Date.now();
            playing = true;
            player.y = 50;
            player.rot = 0;
            player.ySpeed = 0;
            player.rSpeed = 0;
            k.ArrowUp = 0;
            k.ArrowLeft = 0;
            k.ArrowRight = 0;
        }

        if (touch.pageX > 20 && touch.pageX < 90 && touch.pageY > c.height - 90 && touch.pageY < c.height - 20) {
            k.ArrowLeft = 1;
        }

        if (touch.pageX > 110 && touch.pageX < 180 && touch.pageY > c.height - 90 && touch.pageY < c.height - 20) {
            k.ArrowRight = 1;
        }

        if (touch.pageX > c.width - 90 && touch.pageX < c.width - 20 && touch.pageY > c.height - 90 && touch.pageY < c.height - 20) {
            k.ArrowUp = 1;
        }
    }
}

function handleEnd(evt) {
    evt.preventDefault();
    var touches = evt.changedTouches;
    for (let i = 0; i < touches.length; i++) {
        var touch = touches[i];
        if (touch.pageX > 20 && touch.pageX < 90 && touch.pageY > c.height - 90 && touch.pageY < c.height - 20) {
            k.ArrowLeft = 0;
        }

        if (touch.pageX > 110 && touch.pageX < 180 && touch.pageY > c.height - 90 && touch.pageY < c.height - 20) {
            k.ArrowRight = 0;
        }

        if (touch.pageX > c.width - 90 && touch.pageX < c.width - 20 && touch.pageY > c.height - 90 && touch.pageY < c.height - 20) {
            k.ArrowUp = 0;
        }
    }
}

function handleInput(evt) {
    evt.preventDefault();
    const x = evt.touches ? evt.touches[0].pageX : evt.pageX;
    const y = evt.touches ? evt.touches[0].pageY : evt.pageY;

    const buttonX = (c.width / 2) - 40;
    const buttonY = (c.height / 3) + 50;
    const buttonWidth = 100;
    const buttonHeight = 100;

    const leftButtonX = 20;
    const leftButtonY = c.height - 90;
    const leftButtonWidth = 70;
    const leftButtonHeight = 70;

    const rightButtonX = 110;
    const rightButtonY = c.height - 90;

    const fireButtonX = c.width - 90;
    const fireButtonY = c.height - 90;
    
    // Check if click/touch is within the button boundaries
    if (playing &&
        x > leftButtonX &&
        x < leftButtonX + buttonWidth &&
        y > leftButtonY &&
        y < leftButtonY + buttonHeight
    ) {
        console.log("left");    
    }

    if (playing &&
        x > rightButtonX &&
        x < rightButtonX + buttonWidth &&
        y > rightButtonY &&
        y < rightButtonY + buttonHeight 
    ) { 
        console.log("right");   
    }

    if (playing &&
        x > fireButtonX &&
        x < fireButtonX + buttonWidth &&
        y > fireButtonY &&
        y < fireButtonY + buttonHeight  
    ) { 
        console.log("fire");    
    }

     // Check if click/touch is within the left button boundaries
     if (
        !playing &&
        x > buttonX &&
        x < buttonX + buttonWidth &&
        y > buttonY &&
        y < buttonY + buttonHeight
    ) {
        window.location.reload(); // Restart the game
    }
}
