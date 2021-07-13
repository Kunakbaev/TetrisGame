
let figures =
  [
    [1, 3, 5, 7], // I
    [2, 4, 5, 7], // Z
    [3, 5, 4, 6], // S
    [3, 5, 4, 7], // T
    [2, 3, 5, 7], // L
    [3, 5, 7, 6], // J
    [2, 3, 4, 5], // O
  ];

let tileColor = {
  0: "#0048BA",
  1: "#7CFC00",
  2: "#FF7E00",
  3: "#FF00FF",
  4: "red",
  5: "#FFBF00",
  6: "#7CB9E8"
};

let a, b, dx, rotate, w, h, fallSpeed, field, lineMatrix, aLine, tileSize, timer, delay, ctx, width, height, lose, pause;
var tile = null;
let colorNum = 0;

function check() {
  for (let i = 0; i < 4; i++) {
    if (a[i][0] < 0 || a[i][0] >= h ||
      a[i][1] < 0 || a[i][1] >= w) return 0;
    else if (field[a[i][0]][a[i][1]]) return 0;
    // console.log(a[i][0], a[i][1]);
  }

  return 1;
}

function getRandomArbitrary(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function neib(a, i, j) {
  if (a[i][0] == a[j][0] && a[i][1] - a[j][1] == -1) return 1;
  if (a[i][0] == a[j][0] && a[i][1] - a[j][1] == 1) return 3;
  if (a[i][1] == a[j][1] && a[i][0] - a[j][0] == 1) return 0;
  if (a[i][1] == a[j][1] && a[i][0] - a[j][0] == -1) return 2;
  if (a[i][1] == a[j][1] && Math.abs(a[i][0] - a[j][0]) == 1) return true;
  return -1;
}

function showLose(text) {
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.fillRect(0, 0, width, height);

  ctx.fillStyle = "white";
  ctx.strokeStyle = "#F00";
  ctx.font = "normal 60pt Arial";
  ctx.textAlign = "center";
  ctx.textBaseLine = "middle";
  ctx.fillText(text, width / 2, height / 2);
}

function update() {
  if (pause) {
    draw();
    showLose("pause");
  }
  if (lose || pause) return;
  ///////// move ///////
  for (let i = 0; i < 4; i++) { b[i][0] = a[i][0]; b[i][1] = a[i][1]; a[i][1] += dx; }
  if (!check()) for (let i = 0; i < 4; i++) { a[i][0] = b[i][0]; a[i][1] = b[i][1]; }

  ///////// rotate /////
  if (rotate && colorNum != 6) {
    let p = a[1]; // center of rotation
    if (colorNum == 4) p = a[2];
    if (colorNum == 0) {
      // for (let i = 0; i < 4; i++) console.log(a[i][1], a[i][0]);
      // console.log("endl");

      let sameX = true; let x = a[0][1];
      let sameY = true; let y = a[0][0];
      let xGrow = a[0][1] < a[1][1];
      let yGrow = a[0][0] < a[1][0];
      for (let i = 1; i < 4; i++) {
        if (x != a[i][1]) sameX = false;
        if (y != a[i][0]) sameY = false;
      }

      for (let i = 0; i < 4; i++) {
        let x = a[i][0] - p[0];
        let y = a[i][1] - p[1];
        a[i][0] = p[0] + y;
        a[i][1] = p[1] - x;
      }

      if (sameX && yGrow) for (let i = 0; i < 4; i++) a[i][1] += 1;
      if (sameY && !xGrow) for (let i = 0; i < 4; i++) a[i][0] += 1;
      if (sameX && !yGrow) for (let i = 0; i < 4; i++) a[i][1] -= 1;
      if (sameY && xGrow) for (let i = 0; i < 4; i++) a[i][0] -= 1;
    } else {
      for (let i = 0; i < 4; i++) {
        let x = a[i][0] - p[0];
        let y = a[i][1] - p[1];
        a[i][0] = p[0] + y;
        a[i][1] = p[1] - x;
      }
    }

    if (!check()) for (let i = 0; i < 4; i++) {
      a[i][0] = b[i][0]; a[i][1] = b[i][1];
    };
  }

  ///////// check lines //////////
  let k = h - 1;
  for (let i = h - 1; i > 0; i--) {
    let count = 0;
    for (let j = 0; j < w; j++) {
      if (field[i][j]) count++;
      field[k][j] = field[i][j];
      lineMatrix[k][j] = lineMatrix[i][j];
      //lineMatrix[k][j][2] = 1;
    }
    if (count < w) k--;
  }

  if (timer >= delay) {
    for (let i = 0; i < 4; i++) { b[i][0] = a[i][0]; b[i][1] = a[i][1]; a[i][0] += fallSpeed };
    if (!check()) {
      for (let i = 0; i < 4; i++) {
        aLine[i] = [-1, -1, -1, -1];
        for (let j = 0; j < 4; j++) {
          let num = neib(b, i, j);
          if (num != -1) {
            aLine[i][num] = 1;
          }
        }
      }
      for (let i = 0; i < 4; i++) {
        lineMatrix[b[i][0]][b[i][1]] = aLine[i];
      }

      for (let i = 0; i < h; i++) {
        let word = "";
        for (let j = 0; j < w; j++) {
          word += field[i][j].toString() + " ";
        }
        //console.log(word);
      }
      for (let i = 0; i < 4; i++) {
        //console.log("a[i] : ", i, a[i][0], a[i][1], "   b[i] : ", i, b[i][0], b[i][1]);
      }
      for (let i = 0; i < 4; i++) field[b[i][0]][b[i][1]] = colorNum + 1;

      colorNum = getRandomArbitrary(0, 6);
      xMove = getRandomArbitrary(0, 7);
      console.log(colorNum);
      for (let i = 0; i < 4; i++) {
        a[i][1] = figures[colorNum][i] % 2 + xMove;
        a[i][0] = Math.floor(figures[colorNum][i] / 2);
      }

      if (!check()) {
        lose = true;
        showLose("you lose");
        return;
      }
    }

    timer = 0;
  }
  timer += 50;

  for (let i = 0; i < 4; i++) {
    aLine[i] = [-1, -1, -1, -1];
    for (let j = 0; j < 4; j++) {
      let num = neib(a, i, j);
      if (num != -1) {
        aLine[i][num] = 1;
      }
    }
  }

  dx = 0; rotate = 0, fallSpeed = 1, delay = 1000;
  draw();
}

function draw() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = "white";
  for (let i = 0; i <= h; i++) {
    ctx.fillStyle = "white";
    ctx.fillRect(0, i * tileSize, w * tileSize, 3);
  }

  for (let j = 0; j <= w; j++) {
    ctx.fillStyle = "white";
    ctx.fillRect(j * tileSize, 0, 3, h * tileSize);
  }

  ctx.fillStyle = "black";
  for (let i = 0; i < h; i++) {
    for (let j = 0; j < w; j++) {
      let flag = false; let ind = 0;
      for (let l = 0; l < 4; l++) if (a[l][0] == i && a[l][1] == j) { flag = true; ind = l; };
      let color;
      if (field[i][j]) color = tileColor[field[i][j] - 1];
      if (!field[i][j] && flag) color = tileColor[colorNum];

      if (field[i][j] || flag) {
        //console.log("draw", tileColor[color], color);
        ctx.fillStyle = color;
        let k = 1.03;
        //ctx.fillRect(j * tileSize, i * tileSize, tileSize * k, tileSize * k);
        let ww = tileSize * k; let hh = tileSize * k;
        let x = j * tileSize; let y = i * tileSize;
        let val = lineMatrix[i][j];
        if (flag) val = aLine[ind];

        let word = "";
        for (let l = 0; l < 4; l++) {
          word += (val[l]).toString() + "     ";
        }
        //console.log(word);

        ctx.fillStyle = color;
        ctx.fillRect(x, y, tileSize, tileSize);
      }
    }
  }

  for (let i = 0; i < h; i++) {
    for (let j = 0; j < w; j++) {
      let flag = false; let ind = 0;
      for (let l = 0; l < 4; l++) if (a[l][0] == i && a[l][1] == j) { flag = true; ind = l; };
      let color;
      if (field[i][j]) color = tileColor[field[i][j] - 1];
      if (!field[i][j] && flag) color = tileColor[colorNum];

      let val = lineMatrix[i][j];
      if (flag) val = aLine[ind];

      if (field[i][j] || flag) {
        ctx.fillStyle = "black";
        for (let l = 0; l < 4; l++) {
          if (val[l] == -1) {
            //console.log("rect");
            // if (l == 0) { console.log("bla bla", flag); y += some; hh -= some };
            // if (l == 1) { ww -= some };
            // if (l == 2) { hh -= some };
            // if (l == 3) { ww -= some; x += some; };
            k = 3;
            if (l == 0) { ctx.fillRect(j * tileSize, i * tileSize, tileSize + k, 3) };
            if (l == 1) { ctx.fillRect(j * tileSize + tileSize, i * tileSize, 3, tileSize) };
            if (l == 2) { ctx.fillRect(j * tileSize, i * tileSize + tileSize, tileSize, 3) };
            if (l == 3) { ctx.fillRect(j * tileSize, i * tileSize, 3, tileSize + k) };
          }
        }
      }
    }
  }
}

window.onkeydown = function (e) {
  e = e || window.event;

  if (e.keyCode == '38') {
    rotate = 1;
  }
  else if (e.keyCode == '40') {
    delay = 50;
  }
  else if (e.keyCode == '37') {
    dx = -1;
  }
  else if (e.keyCode == '39') {
    dx = 1;
  }
  else if (e.keyCode == '32' && !lose) pause = !pause;
}

window.onresize = function () {
  canvas = document.getElementsByClassName("game")[0];
  ctx = canvas.getContext("2d");
  width = canvas.clientWidth; height = canvas.clientHeight;
  ctx.canvas.width = width; ctx.canvas.height = height;
  tileSize = width / w;
}

window.onload = function () {
  w = 10, fallSpeed = 1, dx = 0, timer = 0, delay = 1000, lose = false, pause = false;
  a = []; b = []; field = []; lineMatrix = []; aLine = [];

  canvas = document.getElementsByClassName("game")[0];
  ctx = canvas.getContext("2d");
  console.log(2 * parseInt(canvas.style.paddingLeft), canvas.style.paddingLeft);
  width = canvas.clientWidth - 20; height = canvas.clientHeight - 20;
  ctx.canvas.width = width; ctx.canvas.height = height;
  tileSize = Math.floor(width / w);
  h = Math.floor(height / tileSize);

  for (let i = 0; i < 4; i++) {
    a.push([]); b.push([]); aLine.push([-1, -1, -1, -1]);
    a[i].push([0, 0]); b[i].push([0, 0]);
  }

  for (let i = 0; i < h; i++) {
    field.push([]); lineMatrix.push([]);
    for (let j = 0; j < w; j++) {
      field[i].push(0); lineMatrix[i].push([-1, -1, -1, -1]);
    }
  }

  colorNum = Math.floor(Math.random() * 7);
  for (let i = 0; i < 4; i++) {
    a[i][1] = figures[colorNum][i] % 2;
    a[i][0] = Math.floor(figures[colorNum][i] / 2);
  }

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      let num = neib(a, i, j);
      if (num != -1) {
        aLine[i][num] = 1;
        console.log("some");
      }
    }
  }

  for (let i = 0; i < h; i++) {
    let word = "";
    for (let j = 0; j < w; j++) {
      word += field[i][j].toString() + " ";
    }
  }

  draw();
  setInterval(update, 50);
}
