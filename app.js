import { Particle } from "./particle.js";

const NUM = 3000;
const particles = [];

let start;

let canvas;
let wind;
let projection;

export function run(_canvas, _wind, _projection) {
  canvas = _canvas;
  wind = _wind;
  projection = _projection;

  // 粒子の初期化
  for (let i = 0; i < NUM; i++) {
    particles.push(new Particle());
  }

  // フレームごと処理開始
  start = new Date().getTime();
  requestAnimationFrame(process);

  // フレームごと処理
  function process() {
    const now = new Date().getTime();
    const tx = now - start;
    start = now;

    // 粒子を動かす
    move(tx);

    // 描画する
    render();

    // 次回描画の準備
    requestAnimationFrame(process);
  }

  function move(tx) {
    particles.forEach((p) => p.move(tx, wind));
  }

  function render() {
    const ctx = canvas.node().getContext("2d");

    // canvasを少し暗く
    ctx.fillStyle = "rgba(0, 0, 0, 0.90)";
    const prev = ctx.globalCompositeOperation;
    ctx.globalCompositeOperation = "destination-in";
    ctx.fillRect(0, 0, canvas.attr("width"), canvas.attr("height"));
    ctx.globalCompositeOperation = prev;

    // particlesを描画
    ctx.beginPath();
    ctx.strokeStyle = "rgb(200,200,200)";
    particles.forEach((p) => p.draw(ctx, projection));
    ctx.stroke();
  }
}
