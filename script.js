//Game constants &var

let inputDir = { x: 0, y: 0 };
const foodSound = new Audio("/music/food.mp3");
const gameOverSound = new Audio("/music/gameover.mp3");
const moveSound = new Audio("/music/move.mp3");
const musicSound = new Audio("/music/music.mp3");
let lastPaintTime = 0;
let speed = 5;
let score = 0;
let snakeArr = [{ x: 13, y: 15 }];
food = { x: 6, y: 7 };

//Game functions
function main(ctime) {
  window.requestAnimationFrame(main); //this calls the function just before the next frame

  //here we ctime is the current time
  //this variable can be anything since we doesnt pass any value as parameter it will display the current time
  //we had already intialized lastpainttime to zero
  //(ctime - lastPaintTime) : by using this we find the time between current time and lastPaintTime
  //the we convert it into seconds by dividing it with hundred
  //1/speed means how many frames per second , since we had given speed= 2 this means that it takes 0.5s for each frame
  //if there are more than 2 frame per second then that frame is skipped
  if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
    return; //when this is executed it exits the fuction and prevents the execution of the futher code
  }
  //console.log(ctime);

  lastPaintTime = ctime;
  gameEngine();
}

function isCollide(snake) {
  //if u bump into yourself
  for (let i = 1; i < snakeArr.length; i++) {
    if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
      return true;
    }
  }

  //if u bump into wall
  if (
    snake[0].x >= 18 ||
    snake[0].x <= 0 ||
    snake[0].y >= 18 ||
    snake[0].y <= 0
  ) {
    return true;
  }
}

function gameEngine() {
  //part 1 : Updating the snake array & food

  if (isCollide(snakeArr)) {
    gameOverSound.play();
    musicSound.pause();
    inputDir = { x: 0, y: 0 };
    score = 0;
    scoreBox.innerHTML = "Score:" + score;
    alert("Game Over press any key to play again !");
    snakeArr = [{ x: 13, y: 15 }];
    // musicSound.play();
  }

  //if u  ate the food , increment score & regenerate food

  //Moving the snake

  for (let i = snakeArr.length - 2; i >= 0; i--) {
    snakeArr[i + 1] = { ...snakeArr[i] };
    //here we are actually assingning the block tonext block inorder to move the snake

    //Doubt about the using of {...snakeArr[i]} :

    //incase of javascript if we use snakeArr[i] instead of {...snakeArr[i]}
    // {...snakeArr[i]} will create a copy of snakeArr[i]
    // bu when we use snakeArr[i] instead  , both will refer to same object and
    // any change made to one will effect the other too
    // therefore doesnt give the snake moving effect
  }
  snakeArr[0].x += inputDir.x;
  snakeArr[0].y += inputDir.y;

  if (snakeArr[0].y === food.y && snakeArr[0].x === food.x) {
    foodSound.play();
    score += 1;
    scoreBox.innerHTML = "Score:" + score;
    if (score > hiscoreval) {
      hiscoreval = score;
      localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
      hiscoreBox.innerHTML = "Hi score: " + hiscoreval;
    }
    snakeArr.unshift({
      // it must be given as unshift because
      // unshift will add the elements to the 0 th index of the array
      // Here in this case each time an element is added to the 0 th index
      //inputDir is added to its corresponding x and y
      x: snakeArr[0].x + inputDir.x,

      //we should remember that before each frame this func will be called
      //when snake collide with food a new element will be added into 0 th position
      //this is the new head and others are tails
      //since func is called before each frame this will be seen as a snake

      y: snakeArr[0].y + inputDir.y,
    });
    let a = 2; // loweBound
    let b = 16; // upperBound

    food = {
      x: Math.round(a + (b - a) * Math.random()),
      y: Math.round(a + (b - a) * Math.random()),
    };
    // math.random will produce random num b/w 0 and 1(not included) ,
    //(b-a) = 14   =>by multipliying this with math.random  , a random num b/w 0 and 14 is generated  ,
    //then by adding  a to it that is 2  , the lowerBound will become 2 and upperBound 18
  }

  //part 2 :Display the snake and food

  //Display the snake
  board.innerHTML = "";
  snakeArr.forEach((e, index) => {
    snakeElement = document.createElement("div");
    board.appendChild(snakeElement);
    snakeElement.style.gridRowStart = e.y;
    snakeElement.style.gridColumnStart = e.x;
    if (index === 0) {
      snakeElement.classList.add("head");
    } else {
      snakeElement.classList.add("snake");
    }
  });

  //display the food element

  foodElement = document.createElement("div");
  board.appendChild(foodElement);
  foodElement.style.gridRowStart = food.y;
  foodElement.style.gridColumnStart = food.x;
  foodElement.classList.add("food");
}

//Main logic starts here

let hiscore = localStorage.getItem("hiscore");
if (hiscore === null) {
  hiscoreval = 0;
  localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
} else {
  hiscoreval = JSON.parse(hiscore);
  hiscoreBox.innerHTML = "Hi score: " + hiscore;
}

window.requestAnimationFrame(main); //call

window.addEventListener("keydown", (e) => {
  // e contains information about the event
  inputDir = { x: 0, y: 1 };
  moveSound.play();

  switch (
    e.key // by using e.key we will be able to find which key is pressed
  ) {
    case "ArrowUp":
      console.log("ArrowUp");
      inputDir.x = 0;
      inputDir.y = -1;
      break;

    case "ArrowDown":
      console.log("ArrowDown");
      inputDir.x = 0;
      inputDir.y = 1;
      break;

    case "ArrowLeft":
      console.log("ArrowLeft");
      inputDir.x = -1;
      inputDir.y = 0;
      break;

    case "ArrowRight":
      console.log("ArrowRight");
      inputDir.x = 1;
      inputDir.y = 0;
      break;

    default:
      break;
  }
});
