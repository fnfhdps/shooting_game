
let canvas;
let ctx; // 이미지 그리는 변수

canvas = document.createElement("canvas");
ctx = canvas.getContext("2d"); // 2d 컨텍스트를 담음
canvas.width = 400;
canvas.height = 700;
document.body.appendChild(canvas);

// images 폴더 이미지들을 로드
let backgroundImage, spaceshipImage, bulletImage, enemyImage, gameOverImage;
// true면 게임 끝
let gameover = false;
// 점수
let score = 0;
// 우주선 좌표
let spaceshipX = canvas.width/2-32;
let spaceshipY= canvas.height-64;

// 총알 class
let bulletList = []; // 총알들 저장 리스트
class Bullet{
  x = 0;
  y = 0;
  constructor(){
    this.x = spaceshipX + 19;
    this.y = spaceshipY;
    this.alive = true; // true: 총알 보임, false: 총알 안보임
  }
  push(){
    bulletList.push(this); // 배열에 저장
  }
  update(){
    this.y -= 7
  }
  // 적군과 총알이 닿았는지 검사
  checkHit(){
  // 총알.y <= 적군.y &&
  // 총알.x >= 적군.x && 총알.x <= 적군.x + 적군 넓이
    for(let i=0; i<enemyList.length; i++){
      if(
        this.y <= enemyList[i].y &&
        this.x >= enemyList[i].x &&
        this.x <= enemyList[i].x + 40
        ){
          score++; // 적군이 사라지고 점수 +=1
          this.alive = false;
          enemyList.splice(i, 1); // 해당 우주선 잘라내기
        }
    }
  }
}

// 적군 랜덤 좌표
// 최대값, 최소값 사이에서 랜덤값 받는 공식
function generateRandomValue(min, max){
  let randomNum = Math.floor(Math.random()*(max-min+1))+min;
  return randomNum;
}

// 적군 class
let enemyList = [];
class Enemy{
  x = 0;
  y = 0;
  constructor(){
    this.x = generateRandomValue(0, canvas.width-64);
  }
  push(){
    enemyList.push(this);
    console.log("적 생성");
  }
  update(){
    this.y += 4; // 적군 속도 조절
    // 적군이 맨 아래에 닿으면..
    if(this.y >= canvas.height-64){
      gameover = true;
      console.log("gameover");
    }
  }
}

function loadImage(){
  backgroundImage = new Image();
  backgroundImage.src = "images/background.gif";

  spaceshipImage = new Image();
  spaceshipImage.src = "images/spaceship.png";

  bulletImage = new Image();
  bulletImage.src = "images/bullet.png";

  enemyImage = new Image();
  enemyImage.src = "images/enemy.png";

  gameOverImage = new Image();
  gameOverImage.src = "images/gameover.png";
}

let keysDown = {};
function setupKeyboardListener(){
  document.addEventListener("keydown", function(event){
    keysDown[event.keyCode] = true;
    //console.log("키다운객체에 들어간 값은?", keysDown);
    //console.log("무슨 키 누름?", event.keyCode);
  });
  document.addEventListener("keyup", function(){
    delete keysDown[event.keyCode];
    //console.log("버튼 클릭후", keysDown);

    if(event.keyCode == 32){
      creatBullet(); // space 떼면 총알 생성
    }
  });
}

function creatBullet(){
  //console.log("총알생성");
  let b = new Bullet(); // 총알 하나 생성
  b.push(); // 총알 배열에 저장
  //console.log("새로운 총알 리스트", bulletList);
}

// 사이트가 로드 되자마자 실행
function createEnemy(){
  const interval = setInterval(() => {
    let e = new Enemy();
    e.push();
  }, 1000);
}

function update(){
  // 우주선 좌표 변경
  // 오른쪽이동 x좌표 증가, 왼쪽이동 x좌표 감소
  if(39 in keysDown){ // -> 누름
    spaceshipX += 5; // 이동 속도
  }
  if(37 in keysDown){ // <- 누름
    spaceshipX -= 5; 
  }
  
  // 우주선 최소 이동 x좌표
  if(spaceshipX <=0){
    spaceshipX = 0;
  }
  // 우주선 최대 이동 x좌표
  // 이미지 사이즈 포함해서 계산
  if(spaceshipX >= canvas.width-64){
    spaceshipX = canvas.width-64;
  }

  // 총알 발사, y좌표 업데이트
  for(let i=0; i<bulletList.length; i++){
    if(bulletList[i].alive){
      bulletList[i].update();
      bulletList[i].checkHit();
    }
  }

  // 적군 발사, y좌표 업데이트
  for(let i=0; i<enemyList.length; i++){
    enemyList[i].update();
  }
}

// 해당 좌표에 이미지 그리기
function render(){
  // 우주선 그리기
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(spaceshipImage, spaceshipX, spaceshipY);
  
  // 점수 보이기
  ctx.fillText(`Score:${score}`, 20, 30);
  ctx.fillStyle = "white";
  ctx.font = "20px Arial";

  // 총알 그리기
  for(let i=0; i<bulletList.length; i++){
    if(bulletList[i].alive){
      ctx.drawImage(bulletImage, bulletList[i].x, bulletList[i].y);
    }
  }

  // 적군 그리기
  for(let i=0; i<enemyList.length; i++){
    ctx.drawImage(enemyImage, enemyList[i].x, enemyList[i].y);
  }
}

function main(){
  if(gameover == false){
    update(); // 좌표값 변경
    render(); // 이미지 그려줌
  //console.log("animation cllas main function")
    requestAnimationFrame(main);
  }else{
    // 게임오버 그리기
    ctx.drawImage(gameOverImage, 100, 200, 200, 150);
  }
}

loadImage();
setupKeyboardListener();
createEnemy();
main();

// 방향키 누르면
// 우주선 x, y 좌표 변경됨
// 화면에 다시 render

// 총알 만들기
// 1. space누르면 총알 발사
// 2. 총알이 발사 = 총알의 y값이 --
// x값은 space를 누른 순간의 우주선의 x좌표
// 3. 발사된 총알은 배열에 저장을 함
// 4. 모든 총알은 x, y 값이 있어야 함
// 5. 총알 배열을 가지고 render() 그림

// 적군 만들기
// x, y 좌표 / 배열에 추가 / 좌표 변경
// 적군 위치가 랜덤 생성
// 밑으로 내려옴
// 1초 간격으로 생성
// 우주선 바닥에 닿으면 게임 오버
// 적군과 총알이 만나면 우주선이 사라짐, 점수 +1

// 적군이 죽는다
// 총알.y <= 적군.y &&
// 총알.x >= 적군.x && 총알.x <= 적군.x + 적군 넓이
// => 닿았다 => 적군이 사라지고 점수 +=1
