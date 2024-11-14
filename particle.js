const MIN_LAT = 20;
const MAX_LAT = 60;
const MIN_LON = 115;
const MAX_LON = 155;
const MIN_AGE = 500;
const MAX_AGE = 1200;

function rand(min, max) {
  return Math.random() * (max + 1 - min) + min;
}

export class Particle {
  constructor() {
    this.init();
  }

  init() {
    this.lat = rand(MIN_LAT, MAX_LAT);
    this.lon = rand(MIN_LON, MAX_LON);
    this.age = rand(MIN_AGE, MAX_AGE);

    this.nextLat = this.lat;
    this.nextLon = this.lon;
  }

  // 近傍４点を利用した補間関数
  _interpolate(field, width, offset, x, y) {
    // 線形補間
    const linear = (p, d1, d2) => {
      return d1 * (1.0 - p) + d2 * p;
    };

    const x1 = Math.floor(x);
    const y1 = Math.floor(y);
    const x2 = x1 + 1;
    const y2 = y1 + 1;

    const dx = x - x1;
    const dy = y - y1;
    const d1 = field[offset + y1 * width + x1];
    const d2 = field[offset + y1 * width + x2];
    const d3 = field[offset + y2 * width + x1];
    const d4 = field[offset + y2 * width + x2];

    const z1 = linear(dx, d1, d2);
    const z2 = linear(dx, d3, d4);
    const z3 = linear(dy, z1, z2);

    return z3;
  }

  move(tx, field) {
    // 前回の座標
    this.lat = this.nextLat;
    this.lon = this.nextLon;

    // 範囲制御
    if (
      this.lat < MIN_LAT ||
      this.lat > MAX_LAT ||
      this.lon < MIN_LON ||
      this.lon > MAX_LON
    ) {
      this.init();
      return;
    }

    // 寿命制御
    this.age = this.age - 1 * tx;
    if (this.age <= 0) {
      this.init();
      return;
    }

    // 緯度経度が1440 * 721のどこに対応するのか
    const x = (this.lon / 360) * 1440;
    const y = (1 - (this.lat + 90) / 180) * 721;

    // 1440 * 721 Uデータの後にVデータを連結しているのでoffsetが必要
    const offset = 1038240;

    // 次の座標計算
    this.nextLon =
      this.lon + 0.0005 * tx * this._interpolate(field, 1440, 0, x, y);
    this.nextLat =
      this.lat + 0.0005 * tx * this._interpolate(field, 1440, offset, x, y);
  }

  draw(ctx, projection) {
    const point = projection([this.lon, this.lat]);
    const nextPoint = projection([this.nextLon, this.nextLat]);

    ctx.moveTo(point[0], point[1]);
    ctx.lineTo(nextPoint[0], nextPoint[1]);
  }
}
