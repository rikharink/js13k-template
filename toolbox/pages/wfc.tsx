import styles from "../styles/Wfc.module.css";
import Head from "next/head";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { OverlappingModel } from "./textures/wfc/overlapping-model";
import { seedRand } from "./util";

export default function WaveFunctionCollapse() {
  const [image, setImage] = useState<string>();
  const [inputScale, setInputScale] = useState<number>(10);
  const [outputScale, setOutputScale] = useState<number>(20);
  const [outputWidth, setOutputWidth] = useState<number>(48);
  const [outputHeight, setOutputHeight] = useState<number>(48);
  const [N, setN] = useState<number>(3);
  const [symmetry, setSymmetry] = useState<1 | 2 | 3 | 4 | 5 | 6 | 7 | 8>(1);
  const [periodicInput, setPeriodicInput] = useState<boolean>(true);
  const [periodicOutput, setPeriodicOutput] = useState<boolean>(true);
  const [seed, setSeed] = useState<string>("JS13K");

  const [imageData, setImageData] = useState<ImageData>();
  const [result, setResult] = useState<string>();
  const [isRendering, setIsRendering] = useState<boolean>(false);
  const [lastRenderSucces, setLastRenderSucces] = useState<boolean>(true);

  const imageRef = useRef<HTMLInputElement>();

  const rng = useMemo(() => {
    return seedRand(seed);
  }, [seed]);

  useEffect(() => {
    if (!image) return;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = image;
    img.onload = () => {
      ctx.drawImage(img, 0, 0, img.width, img.height);
      setImageData(ctx.getImageData(0, 0, img.width, img.height));
    };
  }, [image]);

  const outputBuffer = useMemo(() => {
    return new Uint8ClampedArray(outputWidth * outputHeight * 4);
  }, [outputWidth, outputHeight]);

  const renderImage = useCallback(() => {
    if (!imageData) {
      return;
    }
    setIsRendering(true);
    const model = new OverlappingModel(
      imageData.data,
      imageData.width,
      imageData.height,
      N,
      outputWidth,
      outputHeight,
      periodicInput,
      periodicOutput,
      symmetry
    );
    const success = model.generate(rng);
    if (success) {
      setLastRenderSucces(true);
      setIsRendering(false);
      const result = model.graphics(outputBuffer);
      const resultCanvas = document.createElement("canvas");
      resultCanvas.width = outputWidth;
      resultCanvas.height = outputHeight;
      const ctx = resultCanvas.getContext("2d");
      const imageData = new ImageData(result, outputWidth, outputHeight);
      ctx.putImageData(imageData, 0, 0);
      setResult(resultCanvas.toDataURL());
    } else {
      setIsRendering(false);
      setLastRenderSucces(false);
    }
  }, [
    imageData,
    outputWidth,
    outputHeight,
    N,
    symmetry,
    periodicInput,
    periodicOutput,
    outputBuffer,
  ]);

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
              <label htmlFor="image">input image:</label>
              <input
                ref={imageRef}
                onChange={(e) => setImage(e.currentTarget.value)}
                id="image"
                type="text"
                value={image}
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
            {image && imageData ? (
              <>
                <img
                  className={styles.img}
                  src={image}
                  width={imageData.width * inputScale}
                  height={imageData.height * inputScale}
                />
                <div className={styles.input}>
                  <label htmlFor="inputScale">input scale:</label>
                  <input
                    id="inputScale"
                    type="number"
                    value={inputScale}
                    onChange={(e) =>
                      setInputScale(Math.max(1, e.currentTarget.valueAsNumber))
                    }
                  />
                </div>
                <button
                  type="button"
                  onClick={renderImage}
                  disabled={isRendering}
                >
                  try render
                </button>
              </>
            ) : (
              <></>
            )}
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
