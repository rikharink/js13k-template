import { Random } from "../util";

export enum MaskData {
  AlwaysBorder = -1,
  Empty = 0,
  EmptyBody = 1,
  BorderBody = 2,
}

export class Mask {
  public width: number;
  public height: number;
  public data: MaskData[];
  public mirrorX: boolean;
  public mirrorY: boolean;

  constructor(
    data: MaskData[],
    width: number,
    height: number,
    mirrorX?: boolean,
    mirrorY?: boolean
  ) {
    this.width = width;
    this.height = height;
    this.data = data;
    this.mirrorX = mirrorX ?? true;
    this.mirrorY = mirrorY ?? true;
  }
}

export interface SpriteOptions {
  colored?: boolean;
  edgeBrightness?: number;
  colorVariations?: number;
  brightnessNoise?: number;
  saturation?: number;
  isVerticalGradient?: boolean;
}

export class PixelSprite {
  public canvas!: HTMLCanvasElement;
  private _width: number;
  private _height: number;
  private _mask: Mask;
  private _data: MaskData[];
  private _options: SpriteOptions;
  private _ctx!: CanvasRenderingContext2D;
  private _pixels?: ImageData;
  private _rng: Random;
  private _isVerticalGradient: boolean;

  constructor(
    mask: Mask,
    rng: Random,
    {
      colored = true,
      edgeBrightness = 0.3,
      colorVariations = 0.2,
      brightnessNoise = 0.3,
      saturation = 0.5,
      isVerticalGradient = undefined,
    }: SpriteOptions
  ) {
    this._width = mask.width * (mask.mirrorX ? 2 : 1);
    this._height = mask.height * (mask.mirrorY ? 2 : 1);
    this._mask = mask;
    this._rng = rng;
    this._data = new Array(this._width * this._height);
    this._isVerticalGradient = isVerticalGradient
      ? isVerticalGradient
      : rng() > 0.5;

    this._options = {
      colored,
      edgeBrightness,
      colorVariations,
      brightnessNoise,
      saturation,
    };

    this._init();
  }

  private _init() {
    this._initCanvas();
    this._initContext();
    this._initData();

    this._applyMask();
    this._generateRandomSample();

    if (this._mask.mirrorX) {
      this._mirrorX();
    }

    if (this._mask.mirrorY) {
      this._mirrorY();
    }

    this._generateEdges();
    this._renderPixelData();
  }

  public next() {
    this._init();
  }

  private _initCanvas() {
    this.canvas = document.createElement("canvas");
    this.canvas.width = this._width;
    this.canvas.height = this._height;
  }

  private _initContext() {
    this._ctx = this.canvas.getContext("2d")!;
    this._pixels = this._ctx.createImageData(this._width, this._height);
  }

  public getData(x: number, y: number) {
    return this._data[y * this._width + x];
  }

  public setData(x: number, y: number, value: MaskData) {
    this._data[y * this._width + x] = value;
  }

  private _initData() {
    for (let y = 0; y < this._height; y++) {
      for (let x = 0; x < this._width; x++) {
        this.setData(x, y, -1);
      }
    }
  }

  private _applyMask() {
    const w = this._mask.width;
    for (let y = 0; y < this._mask.height; y++) {
      for (let x = 0; x < w; x++) {
        this.setData(x, y, this._mask.data[y * w + x]);
      }
    }
  }

  private _generateRandomSample() {
    const h = this._height;
    const w = this._width;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const val = this.getData(x, y);
        if (val === MaskData.EmptyBody) {
          this.setData(x, y, val * Math.round(this._rng()));
        } else if (val === MaskData.BorderBody) {
          if (this._rng() > 0.5) {
            this.setData(x, y, 1);
          } else {
            this.setData(x, y, -1);
          }
        }
      }
    }
  }

  private _mirrorX() {
    for (let y = 0; y < this._height; y++) {
      for (let x = 0; x < Math.floor(this._width / 2); x++) {
        this.setData(this._width - x - 1, y, this.getData(x, y));
      }
    }
  }

  private _mirrorY() {
    for (let y = 0; y < Math.floor(this._height / 2); y++) {
      for (let x = 0; x < this._width; x++) {
        this.setData(x, this._height - y - 1, this.getData(x, y));
      }
    }
  }

  private _generateEdges() {
    for (let y = 0; y < this._height; y++) {
      for (let x = 0; x < this._width; x++) {
        if (this.getData(x, y) > 0) {
          if (y - 1 >= 0 && this.getData(x, y - 1) === 0) {
            this.setData(x, y - 1, -1);
          }
          if (y + 1 < this._height && this.getData(x, y + 1) === 0) {
            this.setData(x, y + 1, -1);
          }
          if (x - 1 >= 0 && this.getData(x - 1, y) === 0) {
            this.setData(x - 1, y, -1);
          }
          if (x + 1 < this._width && this.getData(x + 1, y) === 0) {
            this.setData(x + 1, y, -1);
          }
        }
      }
    }
  }

  private _renderPixelData() {
    const saturation = Math.max(
      Math.min(this._rng() * this._options.saturation!, 1),
      0
    );
    let hue = this._rng();
    let ulen, vlen;
    if (this._isVerticalGradient) {
      ulen = this._height;
      vlen = this._width;
    } else {
      ulen = this._width;
      vlen = this._height;
    }

    for (let u = 0; u < ulen; u++) {
      // Create a non-uniform random number between 0 and 1 (lower numbers more likely)
      let isNewColor = Math.abs(
        (this._rng() * 2 - 1 + (this._rng() * 2 - 1) + (this._rng() * 2 - 1)) /
          3
      );

      // Only change the color sometimes (values above 0.8 are less likely than others)
      if (isNewColor > 1 - this._options.colorVariations!) {
        hue = this._rng();
      }

      for (let v = 0; v < vlen; v++) {
        let val, index;
        if (this._isVerticalGradient) {
          val = this.getData(v, u);
          index = (u * vlen + v) * 4;
        } else {
          val = this.getData(u, v);
          index = (v * ulen + u) * 4;
        }

        let rgb = { r: 1, g: 1, b: 1 };

        if (val !== 0) {
          // Fade brightness away towards the edges
          let brightness =
            Math.sin((u / ulen) * Math.PI) *
              (1 - this._options.brightnessNoise!) +
            this._rng() * this._options.brightnessNoise!;

          // Get the RGB color value
          this.hslToRgb(hue, saturation, brightness, rgb);

          // If this is an edge, then darken the pixel
          if (val === -1) {
            rgb.r *= this._options.edgeBrightness!;
            rgb.g *= this._options.edgeBrightness!;
            rgb.b *= this._options.edgeBrightness!;
          }
        }
        if (this._options.colored) {
          this._pixels!.data[index + 0] = rgb.r * 255;
          this._pixels!.data[index + 1] = rgb.g * 255;
          this._pixels!.data[index + 2] = rgb.b * 255;
        } else {
          const grayscale =
            (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) * 255;
          this._pixels!.data[index + 0] = grayscale;
          this._pixels!.data[index + 1] = grayscale;
          this._pixels!.data[index + 2] = grayscale;
        }
        this._pixels!.data[index + 3] = rgb.r + rgb.g + rgb.b === 3 ? 0 : 255;
      }
    }

    this._ctx.putImageData(this._pixels!, 0, 0);
  }

  public hslToRgb(
    h: number,
    s: number,
    l: number,
    result?: { r: number; g: number; b: number }
  ) {
    result = result ?? { r: 0, g: 0, b: 0 };

    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = l * (1 - s);
    const q = l * (1 - f * s);
    const t = l * (1 - (1 - f) * s);

    switch (i % 6) {
      case 0:
        (result.r = l), (result.g = t), (result.b = p);
        break;
      case 1:
        (result.r = q), (result.g = l), (result.b = p);
        break;
      case 2:
        (result.r = p), (result.g = l), (result.b = t);
        break;
      case 3:
        (result.r = p), (result.g = q), (result.b = l);
        break;
      case 4:
        (result.r = t), (result.g = p), (result.b = l);
        break;
      case 5:
        (result.r = l), (result.g = p), (result.b = q);
        break;
    }

    return result;
  }

  public toString() {
    let output = "";
    for (let y = 0; y < this._height; y++) {
      for (let x = 0; x < this._width; x++) {
        var val = this.getData(x, y);
        output += val >= 0 ? " " + val : "" + val;
      }
      output += "\n";
    }
    return output;
  }
}
