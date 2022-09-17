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
      this.velocity.y = 0;
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

function createImage(imageSrc) {
  const image = new Image();
  image.src = imageSrc;
  return image;
}

const player = new Player();
const platforms = [
  new Platform({ x: -1, y: 470 }),
  new Platform({ x: image.width - 3, y: 470 }),
];

const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};

let scrollOffset = 0;

const genericObjects = [
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

  player.update();

  //player movement
  if (keys.right.pressed && player.position.x <= 400) {
    player.velocity.x = 5;
  } else if (keys.left.pressed && player.position.x > 100) {
    player.velocity.x = -5;
  } else {
    player.velocity.x = 0;

    //illuision of moving background, scrolling platform
    if (keys.right.pressed) {
      scrollOffset += 5;
      platforms.forEach((platform) => {
        platform.draw();

        platform.position.x -= 5;
      });

      //parallex scroll
      genericObjects.forEach((genericObject) => {
        genericObject.position.x -= 3;
      });
    } else if (keys.left.pressed) {
      scrollOffset -= 5;
      platforms.forEach((platform) => {
        platform.draw();

        platform.position.x += 5;
      });

      genericObjects.forEach((genericObject) => {
        genericObject.position.x += 3;
      });
    }

    //how to win
    if (scrollOffset > 2000) {
      console.log("you win");
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
      player.velocity.y -= 20;
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
