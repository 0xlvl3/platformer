const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

//16*9
canvas.width = 1024;
canvas.height = 576;

const gravity = 0.5;

const image = new Image();
image.onload = () => {
  animate();
};
image.src = "../img/platform.png";

class Player {
  constructor() {
    this.position = {
      x: 100,
      y: 100,
    };
    this.velocity = {
      x: 0,
      y: 0,
    };

    this.width = 30;
    this.height = 30;

    this.speed = 10;
  }

  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, this.width, this.height);
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    } else {
    }
  }
}

//position = { x: 0, y: 0 }
class Platform {
  constructor({ x, y }) {
    this.position = {
      x,
      y,
    };

    this.image = image;

    this.width = image.width;
    this.height = image.height;
  }

  draw() {
    // if (!this.image.complete) return;
    // c.fillStyle = "blue";
    // c.fillRect(this.position.x, this.position.y, this.width, this.height);

    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

class GenericObject {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };

    this.image = image;

    this.width = image.width;
    this.height = image.height;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

class SmallPlatform {
  constructor({ x, y, image }) {
    this.position = {
      x,
      y,
    };

    this.image = image;

    this.width = image.width;
    this.height = image.height;
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y);
  }
}

function createImage(imageSrc) {
  const image = new Image();
  image.src = imageSrc;
  return image;
}

const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};

let player = new Player();

let platforms = [];

let smallPlatforms = [];

let genericObjects = [];

let scrollOffset = 0;

function init() {
  player = new Player();

  platforms = [
    new Platform({ x: -1, y: 470 }),
    new Platform({ x: image.width - 3, y: 470 }),
    new Platform({ x: image.width * 2 + 200, y: 470 }),
    new Platform({ x: image.width * 3 + 400, y: 470 }),
    new Platform({ x: image.width * 4 + 1200, y: 470 }),
  ];

  smallPlatforms = [
    new SmallPlatform({
      x: 2900,
      y: 270,
      image: createImage("../img/platformSmallTall.png"),
    }),
  ];

  genericObjects = [
    new GenericObject({
      x: -1,
      y: -1,
      image: createImage("../img/background.png"),
    }),
    new GenericObject({
      x: -1,
      y: -1,
      image: createImage("../img/hills.png"),
    }),
  ];

  scrollOffset = 0;
}

init();
function animate() {
  requestAnimationFrame(animate);
  c.fillStyle = "white";
  c.fillRect(0, 0, canvas.width, canvas.height);

  genericObjects.forEach((object) => {
    object.draw();
  });

  platforms.forEach((platform) => {
    platform.draw();
  });

  smallPlatforms.forEach((small) => {
    small.draw();
  });

  player.update();

  //player movement
  if (keys.right.pressed && player.position.x <= 400) {
    player.velocity.x = player.speed;
  } else if (
    (keys.left.pressed && player.position.x > 100) ||
    (keys.left.pressed && scrollOffset === 0 && player.position.x > 0)
  ) {
    player.velocity.x = -player.speed;
  } else {
    player.velocity.x = 0;

    //illuision of moving background, scrolling platform
    if (keys.right.pressed) {
      //code that goes agaisnt other statements to stop things from moving
      scrollOffset += player.speed;

      //keeps platform from moving player moving forward
      platforms.forEach((platform) => {
        platform.draw();

        platform.position.x -= player.speed;
      });

      //keeps platform from moving player moving forwards
      smallPlatforms.forEach((small) => {
        small.draw();

        small.position.x -= player.speed;
      });

      //parallex scroll
      genericObjects.forEach((genericObject) => {
        genericObject.position.x -= player.speed * 0.66;
      });
      //else if below stops us from moving off the left side of screen at start
    } else if (keys.left.pressed && scrollOffset > 0) {
      //code that goes agaisnt other statements to stop things from moving
      scrollOffset -= player.speed;

      //keeps platform from moving player moving backwards
      platforms.forEach((platform) => {
        platform.draw();

        platform.position.x += player.speed;
      });

      //keeps small platform from moving player moving backwards
      smallPlatforms.forEach((small) => {
        small.draw();

        small.position.x += player.speed;
      });

      genericObjects.forEach((genericObject) => {
        genericObject.position.x += player.speed * 0.66;
      });
    }

    //win condition
    if (scrollOffset > image.width * 4 + 1300) {
      console.log("you win");
    }

    //lose condition
    if (player.position.y > canvas.height) {
      console.log("You lose :(");
      init();
    }
  }

  console.log(scrollOffset);

  //platform collision detection
  platforms.forEach((platform) => {
    platform.draw();

    if (
      player.position.y + player.height <= platform.position.y &&
      player.position.y + player.height + player.velocity.y >=
        platform.position.y &&
      player.position.x + player.width >= platform.position.x &&
      player.position.x <= platform.position.x + platform.width
    ) {
      player.velocity.y = 0;
    }
  });

  //smalll platform collision detection
  smallPlatforms.forEach((small) => {
    small.draw();

    if (
      player.position.y + player.height <= small.position.y &&
      player.position.y + player.height + player.velocity.y >=
        small.position.y &&
      player.position.x + player.width >= small.position.x &&
      player.position.x <= small.position.x + small.width
    ) {
      player.velocity.y = 0;
    }
  });
}

addEventListener("keydown", ({ keyCode }) => {
  switch (keyCode) {
    case 65:
      console.log("left");
      keys.left.pressed = true;
      break;
    case 83:
      console.log("down");
      break;
    case 68:
      keys.right.pressed = true;
      break;
    case 87:
      player.velocity.y -= 25;
      break;
  }
});

addEventListener("keyup", ({ keyCode }) => {
  switch (keyCode) {
    case 65:
      console.log("left");
      keys.left.pressed = false;
      break;
    case 83:
      console.log("down");
      break;
    case 68:
      keys.right.pressed = false;
      break;
    case 87:
      player.velocity.y = 0;
      break;
  }
});
