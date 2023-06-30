const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const paddleWidth = 18,
paddleHeight = 120,
paddleSpeed = 8,
ballRadius = 12,
initialBallSpeed = 8,
maxBallSpeed =  40,
netWidth = 5,
netColor = "WHITE";


//draw rect ( called in draw net)
function drawRect(x, y, width, height, color){
context.fillStyle = color;
context.fillRect(x, y, width, height);
}

//canvas drawing 
function drawNet(){
    for ( let i = 0; i <= canvas.height; i+=15){
        drawRect(canvas.width / 2 - netWidth /  2, i, netWidth, 10, netColor);
    }
}

function drawCircle(x, y, radius, color){
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, radius, Math.PI * 2, false);
    context.closePath();
    context.fill();
}

//write text
function drawText(text, x, y, color, fontSize = 60, fontWeight = 'bold', font = "Courier New") {
    context.fillStyle = color;
    context.font = `${fontWeight} ${fontSize}px ${font}`;
    context.textAlign = "center";
    context.fillText(text, x, y);
}


//create a "pong" paddle obj
function createPaddle(x, y, width, height, color){
return { x, y, width, height, color, score: 0}
}

//create a pong ball object
function createBall( x, y, radius, velocityX, velocityY, color){
    return { x, y, radius, velocityX, velocityY, color, speed: initialBallSpeed };
}

//init user as well as computer objects
const user = createPaddle(0, canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, "WHITE");

const com = createPaddle(canvas.width - paddleWidth, canvas.height / 2 - paddleHeight / 2, paddleWidth, paddleHeight, "WHITE");

//init ball obj
const ball = createBall( canvas.width / 2, canvas.height / 2, ballRadius, initialBallSpeed, initialBallSpeed, "WHITE");

//track user mouse 2 paddle
canvas.addEventListener('mousemove', movePaddle);

function movePaddle(event){
    const rect = canvas.getBoundingClientRect();
    user.y = event.clientY - rect.top - user.height / 2;
}

//ball touching paddle
function collision(b, p){
    return (
        b.x + b.radius > p.x && b.x - b.radius < p.x + p.width && b.y + b.radius > p.y && b.y - b.radius < p.y + p.height
    );
}

//reset balls in touch event?

function resetBall(){
    ball.x = canvas.width / 2;
    ball.y = Math.random() * (canvas.height - ball.radius * 2) + ball.radius;
    ball.velocityX = -ball.velocityX;
    ball.speed = initialBallSpeed;
}


//update game status

function update(){

if ( ball.x - ball.radius < 0){
    com.score++;
    resetBall();
} else if ( ball.x + ball.radius > canvas.width){
    user.score++;
    resetBall();
}

//update x and y pos in relation to velocty
ball.x += ball.velocityX;
ball.y += ball.velocityY;

//update computer pos
com.y += (ball.y - (com.y + com.height / 2)) * 0.1;

//top and bottom floor/roof case
if ( ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height){
    ball.velocityY = -ball.velocityY;
}

//checkwhich paddle hit, and if can handle collision

let player = ball.x + ball.radius < canvas.width / 2 ? user : com;
if ( collision(ball, player)){
    const contactPoint = ball.y - (player.y + player.height / 2);
    const contactAngle = (Math.PI / 4) * (contactPoint / ( player.height / 2));
    const direction = ball.x + ball.radius < canvas.width / 2 ? 1 : -1;
    ball.velocityX = direction * ball.speed * Math.cos(contactAngle);
    ball.velocityY = ball.speed * Math.sin(contactAngle);

    ball.speed += 0.2;
    if ( ball.speed > maxBallSpeed){
        ball.speed = maxBallSpeed;
    }
}

} //update()


function render(){
    drawRect( 0, 0, canvas.width, canvas.height, "BLACK");
    drawNet();

    //render score
    drawText(user.score, canvas.width / 4, canvas.height / 2, "GRAY", 120, 'bold');
    drawText(com.score, ( 3 * canvas.width) / 4, canvas.height / 2, "GRAY", 120, 'bold');

    //render paddles
    drawRect(user.x, user.y, user.width, user.height, user.color);
    drawRect(com.x, com.y, com.width, com.height, com.color);

    //render ball
    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

//main run game func
function game(){
    update();
    render();
}


//sets the game to run at 60 fps
const framePerSec = 60;
setInterval(game, 1000 / framePerSec);


