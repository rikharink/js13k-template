import styles from "../styles/Wfc.module.css";
import Head from "next/head";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { OverlappingModel } from "./textures/wfc/overlapping-model";
import { floodFill, hexToRgba, rgbToHex, seedRand } from "./util";
import PixelGrid from "./components/PixelGrid";

export default function WaveFunctionCollapse() {
  const [inputScale, setInputScale] = useState<number>(10);
  const [outputScale, setOutputScale] = useState<number>(20);
  const [inputWidth, setInputWidth] = useState<number>(8);
  const [inputHeight, setInputHeight] = useState<number>(8);
  const [outputWidth, setOutputWidth] = useState<number>(48);
  const [outputHeight, setOutputHeight] = useState<number>(48);
  const [N, setN] = useState<number>(3);
  const [symmetry, setSymmetry] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8>(8);
  const [ground, setGround] = useState<number>(0);
  const [periodicInput, setPeriodicInput] = useState<boolean>(true);
  const [periodicOutput, setPeriodicOutput] = useState<boolean>(false);
  const [seed, setSeed] = useState<string>("JS13K");

  const [imageBuffer, setImageBuffer] = useState<Uint8ClampedArray>();
  const [result, setResult] = useState<string>();
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [lastRenderSucces, setLastRenderSucces] = useState<boolean>(true);
  const [model, setModel] = useState<OverlappingModel>();
  const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
  const [exportData, setExportData] = useState<string>();

  const [color, setColor] = useState<[number, number, number, number]>([
    0, 0, 0, 255,
  ]);

  const [hexColor, setHexColor] = useState<string>();

  const loadImage = useCallback(() => {
    if (!ctx) return;
    const src = prompt("Image data uri");
    const img = new Image();
    img.src = src;
    img.onload = () => {
      ctx.clearRect(0, 0, img.width, img.height);
      ctx.drawImage(img, 0, 0, img.width, img.height);
      const data = ctx.getImageData(0, 0, img.width, img.height);
      setInputWidth(data.width);
      setInputHeight(data.height);
      setImageBuffer(data.data);
    };
  }, [ctx]);

  const rng = useMemo(() => {
    return seedRand(seed);
  }, [seed]);

  useEffect(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    setCtx(ctx);
  }, []);

  useEffect(() => {
    setHexColor(rgbToHex(color));
  }, [color]);

  useEffect(() => {
    if (!ctx) return;
    const buff = new Uint8ClampedArray(inputWidth * inputHeight * 4).fill(0);
    setImageBuffer(buff);
    ctx.canvas.width = inputWidth;
    ctx.canvas.height = inputHeight;
    const dat = new ImageData(buff, inputWidth, inputHeight);
    ctx.clearRect(0, 0, inputWidth, inputHeight);
    ctx.putImageData(dat, 0, 0);
  }, [ctx, inputWidth, inputHeight]);

  const outputBuffer = useMemo(() => {
    return new Uint8ClampedArray(outputWidth * outputHeight * 4);
  }, [outputWidth, outputHeight]);

  useEffect(() => {
    if (!imageBuffer) {
      return;
    }
    const model = new OverlappingModel(
      imageBuffer,
      inputWidth,
      inputHeight,
      N,
      outputWidth,
      outputHeight,
      periodicInput,
      periodicOutput,
      symmetry,
      ground
    );
    setModel(model);
    setExportData(
      JSON.stringify({
        buffer: imageBuffer,
        inputWidth,
        inputHeight,
        outputWidth,
        outputHeight,
        N,
        periodicInput,
        periodicOutput,
        symmetry,
        ground,
      })
    );
  }, [
    imageBuffer,
    inputWidth,
    inputHeight,
    N,
    outputWidth,
    outputHeight,
    periodicInput,
    periodicOutput,
    symmetry,
    ground,
  ]);

  const renderImage = useCallback(() => {
    if (!model || !ctx) return;
    setIsRendering(true);
    const success = model.generate(rng);
    if (success) {
      setLastRenderSucces(true);
      const result = model.graphics(outputBuffer);
      ctx.canvas.width = outputWidth;
      ctx.canvas.height = outputHeight;
      ctx.clearRect(0, 0, outputWidth, outputHeight);
      const imageData = new ImageData(result, outputWidth, outputHeight);
      ctx.putImageData(imageData, 0, 0);
      setResult(ctx.canvas.toDataURL());
      setIsRendering(false);
    } else {
      setIsRendering(false);
      setLastRenderSucces(false);
    }
  }, [model, outputWidth, outputHeight, ctx]);

  const draw = useCallback(
    (ev: React.MouseEvent<HTMLDivElement>) => {
      if (!(ev.buttons === 1 || ev.buttons === 2 || ev.buttons === 4)) {
        return;
      }
      if (ev.buttons === 4) {
        const i = Number(ev.currentTarget.dataset.index);
        floodFill(
          imageBuffer,
          inputWidth,
          i,
          [
            imageBuffer[i * 4],
            imageBuffer[i * 4 + 1],
            imageBuffer[i * 4 + 2],
            imageBuffer[i * 4 + 3],
          ],
          color
        );
      } else {
        const brush: [number, number, number, number] =
          ev.buttons === 1 ? color : [0, 0, 0, 0];
        const i = Number(ev.currentTarget.dataset.index) * 4;
        imageBuffer[i] = brush[0];
        imageBuffer[i + 1] = brush[1];
        imageBuffer[i + 2] = brush[2];
        imageBuffer[i + 3] = brush[3];
      }
      setImageBuffer(imageBuffer.slice(0));
    },
    [color, imageBuffer]
  );

  const getColor = useCallback(
    (i: number) => {
      if (!imageBuffer) {
        return "transparent";
      }
      const s = i * 4;
      return rgbToHex([
        imageBuffer[s],
        imageBuffer[s + 1],
        imageBuffer[s + 2],
        imageBuffer[s + 3],
      ]);
    },
    [imageBuffer]
  );

  const getOpacity = useCallback(
    (i: number) => (imageBuffer ? imageBuffer[i * 4 + 3] / 255 : 0),
    [imageBuffer]
  );

  const exportWfcParameters = useCallback(() => {
    prompt("WFC parameters", exportData);
  }, [exportData]);

  const exportInputImage = useCallback(() => {
    if (!ctx || !imageBuffer) return;
    ctx.clearRect(0, 0, inputWidth, inputHeight);
    const data = new ImageData(imageBuffer, inputWidth, inputHeight);
    ctx.putImageData(data, 0, 0);
    const url = ctx.canvas
      .toDataURL("image/webp", 1)
      .replace("image/webp", "image/octet-stream");
    var link = document.createElement("a");
    link.download = "wfc-export.webp";
    link.href = url;
    link.click();
  }, [ctx, imageBuffer, inputWidth, inputHeight]);

  const mouseLeftGrid = useCallback(
    (ev: React.MouseEvent<HTMLDivElement>) => {
      if (ev.buttons === 0) {
        renderImage();
      }
    },
    [renderImage]
  );

  return (
    <div className={styles.container}>
      <Head>
        <title>JS13K Toolbox - Wave Function Collapse</title>
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Wave Function Collapse</h1>
        <div className={styles.split}>
          <div className={styles.left}>
            <div className={styles.input}>
              <label htmlFor="seed">seed:</label>
              <input
                onChange={(e) => setSeed(e.currentTarget.value)}
                id="seed"
                type="text"
                value={seed}
              />
            </div>
            <div className={styles.input}>
              <label htmlFor="input-width">input width:</label>
              <input
                onChange={(e) =>
                  setInputWidth(Math.max(1, e.currentTarget.valueAsNumber))
                }
                id="input-width"
                type="number"
                value={inputWidth}
              />
            </div>
            <div className={styles.input}>
              <label htmlFor="input-height">input height:</label>
              <input
                onChange={(e) =>
                  setInputHeight(Math.max(1, e.currentTarget.valueAsNumber))
                }
                id="input-height"
                type="number"
                value={inputHeight}
              />
            </div>
            <div className={styles.input}>
              <label htmlFor="width">output width:</label>
              <input
                onChange={(e) =>
                  setOutputWidth(Math.max(1, e.currentTarget.valueAsNumber))
                }
                id="width"
                type="number"
                value={outputWidth}
              />
            </div>
            <div className={styles.input}>
              <label htmlFor="height">output height:</label>
              <input
                onChange={(e) =>
                  setOutputHeight(Math.max(1, e.currentTarget.valueAsNumber))
                }
                id="height"
                type="number"
                value={outputHeight}
              />
            </div>
            <div className={styles.input}>
              <label htmlFor="n">N:</label>
              <input
                onChange={(e) =>
                  setN(Math.max(1, e.currentTarget.valueAsNumber))
                }
                id="n"
                type="number"
                value={N}
              />
            </div>
            <div className={styles.input}>
              <label htmlFor="ground">ground:</label>
              <input
                onChange={(e) =>
                  setGround(Math.max(0, e.currentTarget.valueAsNumber))
                }
                id="ground"
                type="number"
                value={ground}
              />
            </div>
            <div className={styles.input}>
              <label htmlFor="symmetry">symmetry:</label>
              <input
                onChange={(e) =>
                  setSymmetry(
                    e.currentTarget.valueAsNumber as
                      | 1
                      | 2
                      | 3
                      | 4
                      | 5
                      | 6
                      | 7
                      | 8
                  )
                }
                id="symmetry"
                type="range"
                min="1"
                max="8"
                value={symmetry}
              />
            </div>
            <div className={styles.input}>
              <label htmlFor="periodic-in">periodic input:</label>
              <input
                onChange={(e) => setPeriodicInput(e.currentTarget.checked)}
                id="periodic-in"
                type="checkbox"
                checked={periodicInput}
              />
            </div>
            <div className={styles.input}>
              <label htmlFor="periodic-out">periodic output:</label>
              <input
                onChange={(e) => setPeriodicOutput(e.currentTarget.checked)}
                id="periodic-out"
                type="checkbox"
                checked={periodicOutput}
              />
            </div>

            <PixelGrid
              width={inputWidth}
              height={inputHeight}
              draw={draw}
              getColor={getColor}
              getOpacity={getOpacity}
              onMouseLeave={mouseLeftGrid}
            />
            <div className={styles.input}>
              <label htmlFor="color">brush color:</label>
              <input
                id="color"
                type="color"
                defaultValue={hexColor}
                onChange={(e) =>
                  setColor([...hexToRgba(e.currentTarget.value, 255)])
                }
              />
            </div>
            <button type="button" onClick={loadImage}>
              load image from datauri
            </button>
            <button type="button" onClick={renderImage} disabled={isRendering}>
              try render
            </button>
            <button type="button" onClick={exportWfcParameters}>
              export wfc parameters
            </button>
            <button type="button" onClick={exportInputImage}>
              export input image
            </button>
          </div>
          <div className={styles.right}>
            {isRendering ? <p>rendering...</p> : <></>}
            {!lastRenderSucces ? <p>rendering failed, try again!</p> : <></>}
            {result ? (
              <>
                <img
                  className={styles.img}
                  src={result}
                  width={outputWidth * outputScale}
                  height={outputHeight * outputScale}
                />
                <div className={styles.input}>
                  <label htmlFor="outputScale">output scale:</label>
                  <input
                    id="outputScale"
                    type="number"
                    value={outputScale}
                    onChange={(e) =>
                      setOutputScale(Math.max(1, e.currentTarget.valueAsNumber))
                    }
                  />
                </div>
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
