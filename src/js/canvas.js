const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

//16*9
canvas.width = 1024;
canvas.height = 576;

const gravity = 0.5;

function createImage(img) {
  const newImg = new Image();
  newImg.onload = () => {};
  newImg.src = img;
  return newImg;
}

const image = new Image();
image.onload = () => {
  animate();
};
image.src = "../img/background.png";

/////////////////////
//CLASSES
class Sprite {
  constructor(
    position = { x: 0, y: 0 },
    imageSrc,
    frames = { max: 1 },
    offset = { x: 0, y: 0 }
  ) {
    //sprite position
    this.position = position;

    //sprites src
    this.image = new Image();
    this.image.src = imageSrc;

    //used to loop through our sprites, max is max frames and current is current frame which we default to 0
    //elapsed and hold are related to the speed of which we proceed through our crop of images
    this.frames = {
      max: frames.max,
      current: 0,
      elapsed: 0,
      hold: 3,
    };

    this.offset = offset;
  }

  draw() {
    if (!this.image.complete) return;

    //how we crop our image so we can loop through the correct amount of frames associated with that image
    const cropWidth = this.image.width / this.frames.max;

    //crop used within our drawImage method
    const crop = {
      position: {
        x: cropWidth * this.frames.current,
        y: 0,
      },
      width: this.image.width / this.frames.max,
      height: this.image.height,
    };

    //drawImage that will crop our specifed sprite sheets into correct amounts related to that image.
    c.drawImage(
      this.image,
      crop.position.x,
      crop.position.y,
      crop.width,
      crop.height,
      this.position.x + this.offset.x,
      this.position.y + this.offset.y,
      crop.width,
      crop.height
    );
  }

  update() {
    //responsible for animation
    this.frames.elapsed++;
    if (this.frames.elapsed % this.frames.hold === 0) {
      //how we reloop through our frames once we hit our max frames
      this.frames.current++;
      if (this.frames.current >= this.frames.max) {
        this.frames.current = 0;
      }
    }
  }
}

class Player {
  constructor(position = { x: 0, y: 0 }) {
    this.position = position;

    this.velocity = {
      x: 0,
      y: 0,
    };

    this.width = 66;
    this.height = 150;

    this.speed = 10;

    this.frames = 0;

    this.sprites = {
      standRight: {
        sheet: createImage("../img/spriteStandRight.png"),
        //cropWidth because our sprites are different sizes
        cropWidth: 177,
        width: 66,
      },
      standLeft: {
        sheet: createImage("../img/spriteStandLeft.png"),
        cropWidth: 177,
        width: 66,
      },
      runRight: {
        sheet: createImage("../img/spriteRunRight.png"),
        cropWidth: 341,
        width: 127.875,
      },
      runLeft: {
        sheet: createImage("../img/spriteRunLeft.png"),
        cropWidth: 341,
        width: 127.875,
      },
    };

    this.currentSprite = this.sprites.standRight.sheet;
    this.currentCropWidth = this.sprites.standRight.cropWidth;
  }

  draw() {
    // c.fillStyle = "red";
    // c.fillRect(this.position.x, this.position.y, this.width, this.height);
    c.drawImage(
      this.currentSprite,
      //this part is how we make our character look animated
      this.currentCropWidth * this.frames,
      0,
      this.currentCropWidth,
      400,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    );
  }

  update() {
    this.frames++;
    if (
      this.frames > 59 &&
      this.currentSprite === this.sprites.standRight.sheet
    ) {
      this.frames = 0;
    } else if (
      this.frames > 59 &&
      this.currentSprite === this.sprites.standLeft.sheet
    ) {
      this.frames = 0;
    } else if (
      this.frames > 28 &&
      this.currentSprite === this.sprites.runRight.sheet
    ) {
      this.frames = 0;
    } else if (
      this.frames > 28 &&
      this.currentSprite === this.sprites.runLeft.sheet
    ) {
      this.frames = 0;
    }

    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity;
    } else {
    }
  }
}

class Platform extends Sprite {
  constructor(position = { x: 0, y: 0 }) {
    super({ position }, "../img/platform.png");

    this.position = position;

    this.width = 580;
    this.height = 125;
  }
}

class GenericObject extends Sprite {
  constructor(position = { x: 0, y: 0 }) {
    super({ position }, "../img/hills.png");

    this.position = position;

    this.width = 100;
    this.height = 100;
  }
}

class SmallPlatform extends Sprite {
  constructor(position = { x: 0, y: 0 }) {
    super({ position }, "../img/platformSmallTall.png");

    this.position = position;

    this.width = 291;
    this.height = 227;
  }
}

let lastKey;

const keys = {
  right: {
    pressed: false,
  },
  left: {
    pressed: false,
  },
};

let player = new Player({ x: 100, y: 100 });

let platforms = [];

let smallPlatforms = [];

let genericObjects = [];

let scrollOffset = 0;

function init() {
  player = new Player({ x: 100, y: 100 });

  platforms = [
    new Platform({ x: -1, y: 470 }),
    new Platform({ x: 580 - 3, y: 470 }),
    new Platform({ x: 580 * 2 - 3 + 200, y: 470 }),
    new Platform({ x: platforms.width * 3 + 400, y: 470 }),
    new Platform({ x: platforms.width * 4 + 1200, y: 470 }),
  ];

  smallPlatforms = [
    new SmallPlatform({
      x: 2900,
      y: 270,
    }),
  ];

  genericObjects = [
    new GenericObject({
      x: -1,
      y: -1,
    }),
  ];

  scrollOffset = 0;
}

init();
function animate() {
  requestAnimationFrame(animate);
  // c.fillStyle = "white";
  // c.fillRect(0, 0, canvas.width, canvas.height);
  c.drawImage(image, 0, 0);

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

  //for our run transitions
  if (
    keys.right.pressed &&
    lastKey === "right" &&
    player.currentSprite !== player.sprites.runRight.sheet
  ) {
    player.frames = 1;
    player.currentSprite = player.sprites.runRight.sheet;
    player.currentCropWidth = player.sprites.runRight.cropWidth;
    player.width = player.sprites.runRight.width;
  } else if (
    keys.left.pressed &&
    lastKey === "left" &&
    player.currentSprite !== player.sprites.runLeft.left
  ) {
    player.currentSprite = player.sprites.runLeft.sheet;
    player.currentCropWidth = player.sprites.runLeft.cropWidth;
    player.width = player.sprites.runLeft.width;
  } else if (
    !keys.left.pressed &&
    lastKey === "left" &&
    player.currentSprite !== player.sprites.standLeft.sheet
  ) {
    player.currentSprite = player.sprites.standLeft.left;
    player.currentCropWidth = player.sprites.standLeft.cropWidth;
    player.width = player.sprites.standLeft.width;
  } else if (
    !keys.right.pressed &&
    lastKey === "right" &&
    player.currentSprite !== player.sprites.standRight.sheet
  ) {
    player.currentSprite = player.sprites.standRight.right;
    player.currentCropWidth = player.sprites.standRight.cropWidth;
    player.width = player.sprites.standRight.width;
  }

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

addEventListener("keydown", ({ key }) => {
  key.toLowerCase();
  switch (key) {
    case "a":
      console.log("left");
      keys.left.pressed = true;
      lastKey = "left";
      break;
    case "s":
      console.log("down");
      break;
    case "d":
      keys.right.pressed = true;
      lastKey = "right";
      break;
    case "w":
      player.velocity.y -= 25;
      break;
  }
});

addEventListener("keyup", ({ key }) => {
  key.toLowerCase();
  switch (key) {
    case "a":
      console.log("left");
      keys.left.pressed = false;
      break;
    case "s":
      console.log("down");
      break;
    case "d":
      keys.right.pressed = false;
      break;
    case "w":
      player.velocity.y = 0;
      break;
  }
});
