import styles from "../styles/Pixel.module.css";
import Head from "next/head";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  PixelSprite,
  Mask,
  MaskData,
  SpriteOptions,
} from "./textures/pixel-sprite";

import React from "react";
import { range, seedRand } from "./util";

export default function Pixel() {
  const [pixelSprite, setPixelSprite] = useState<PixelSprite>();
  const [width, setWidth] = useState<number>(8);
  const [height, setHeight] = useState<number>(8);
  const [mirrorX, setMirrorX] = useState<boolean>(false);
  const [mirrorY, setMirrorY] = useState<boolean>(false);
  const [maskData, setMaskData] = useState<MaskData[]>();
  const [scale, setScale] = useState<number>(20);
  const [rotation, setRotation] = useState<number>(0);

  const [spriteOptions, setSpriteOptions] = useState<SpriteOptions>({
    colored: true,
    edgeBrightness: 0.3,
    colorVariations: 0.2,
    brightnessNoise: 0.3,
    saturation: 0.5,
  });

  const [seed, setSeed] = useState<string>("JS13K");
  const [output, setOutput] = useState<string>();
  const [selectedBrush, setSelectedBrush] = useState<MaskData>(
    MaskData.EmptyBody
  );

  const seedRef = useRef<HTMLInputElement>();
  const mirrorXRef = useRef<HTMLInputElement>();
  const mirrorYRef = useRef<HTMLInputElement>();
  const coloredRef = useRef<HTMLInputElement>();
  const scaleRef = useRef<HTMLInputElement>();
  const rotateRef = useRef<HTMLInputElement>();

  const rng = useMemo(() => {
    return seedRand(seed);
  }, [seed]);

  useEffect(() => {
    if (!maskData) return;
    const mask = new Mask(maskData, width, height, mirrorX, mirrorY);
    const sprite = new PixelSprite(mask, rng, spriteOptions);
    setPixelSprite(sprite);
  }, [width, height, mirrorX, mirrorY, maskData, spriteOptions, rng]);

  const exportData = () => {
    const data = JSON.stringify({
      mask: {
        width: width,
        height: height,
        mirrorX: mirrorX,
        mirrorY: mirrorY,
        maskData: maskData,
      },
      options: spriteOptions,
    });
    prompt("exported data", data);
  };

  const importData = () => {
    const data = prompt("data");
    const parsed = JSON.parse(data) as {
      mask: {
        width: number;
        height: number;
        mirrorX: boolean;
        mirrorY: boolean;
        maskData: MaskData[];
      };
      options: SpriteOptions;
    };
    if (parsed) {
      setMaskData(parsed.mask.maskData);
      setWidth(parsed.mask.width);
      setHeight(parsed.mask.height);
      setMirrorX(parsed.mask.mirrorX);
      setMirrorY(parsed.mask.mirrorY);
      setSpriteOptions(parsed.options);
    }
  };

  useEffect(() => {
    setMaskData(new Array(width * height).fill(MaskData.Empty));
  }, [width, height]);

  useEffect(() => {
    if (pixelSprite) {
      setOutput(pixelSprite.canvas.toDataURL());
    }
  }, [pixelSprite]);

  const updateSeed = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setSeed(ev.target.value);
  };

  const updateWidth = (ev: React.ChangeEvent<HTMLInputElement>) => {
    let number = Number(ev.target.value);
    if (number <= 0) {
      number = 1;
    }
    setWidth(number);
  };

  const updateHeight = (ev: React.ChangeEvent<HTMLInputElement>) => {
    let number = Number(ev.target.value);
    if (number <= 0) {
      number = 1;
    }
    setHeight(number);
  };

  const updateMirrorX = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setMirrorX(ev.target.checked);
  };

  const updateMirrorY = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setMirrorY(ev.target.checked);
  };

  const updateColored = (ev: React.ChangeEvent<HTMLInputElement>) => {
    spriteOptions.colored = ev.target.checked;
    setSpriteOptions({ ...spriteOptions });
  };

  const draw = useCallback(
    (ev: React.MouseEvent<HTMLDivElement>) => {
      if (!(ev.buttons === 1 || ev.buttons === 2)) {
        return;
      }
      const brush = ev.buttons === 1 ? selectedBrush : MaskData.Empty;
      const gridIndex = Number(ev.currentTarget.dataset.index);
      maskData[gridIndex] = brush;
      setMaskData(maskData.splice(0));
    },
    [maskData]
  );

  const maskGrid = useMemo(() => {
    if (!maskData) {
      return <></>;
    }
    return (
      <div
        className={styles.mask}
        onContextMenu={(e) => e.preventDefault()}
        style={{
          gridTemplateColumns: `repeat(${width}, 1fr)`,
          gridTemplateRows: `repeat(${height}, 1fr)`,
        }}
      >
        {range(0, width * height).map((i) => {
          return (
            <div
              key={i}
              data-index={i}
              data-type={maskData[i]}
              className={styles.gridItem}
              onMouseDown={draw}
              onMouseOver={draw}
            >
              {maskData[i]}
            </div>
          );
        })}
      </div>
    );
  }, [width, height, maskData]);

  const reset = () => {
    setMaskData(new Array(width * height).fill(MaskData.Empty));
  };

  const nextPicture = () => {
    if (pixelSprite) {
      pixelSprite?.next();
      setOutput(pixelSprite.canvas.toDataURL());
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>JS13K Toolbox - Pixel Sprite Creator</title>
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Pixel Sprite Creator</h1>
        <div className={styles.split}>
          <div className={styles.left}>
            <div className={styles.form}>
              <div className={styles.input}>
                <label htmlFor="seed">seed:</label>
                <input
                  onChange={updateSeed}
                  id="seed"
                  type="text"
                  value={seed}
                />
              </div>
              <div className={styles.input}>
                <label htmlFor="width">width:</label>
                <input
                  ref={seedRef}
                  onChange={updateWidth}
                  id="width"
                  type="number"
                  value={width}
                />
              </div>
              <div className={styles.input}>
                <label htmlFor="height">height:</label>
                <input
                  onChange={updateHeight}
                  id="width"
                  type="number"
                  value={height}
                />
              </div>
              <div className={styles.input}>
                <label htmlFor="mirror-x">mirror x:</label>
                <input
                  type="checkbox"
                  id="mirror-x"
                  ref={mirrorXRef}
                  onChange={updateMirrorX}
                />
              </div>
              <div className={styles.input}>
                <label htmlFor="mirror-y">mirror y:</label>
                <input
                  type="checkbox"
                  id="mirror-y"
                  ref={mirrorYRef}
                  onChange={updateMirrorY}
                />
              </div>
              <div className={styles.input}>
                <label htmlFor="colored">colored:</label>
                <input
                  type="checkbox"
                  id="colored"
                  ref={coloredRef}
                  onChange={updateColored}
                  checked={spriteOptions.colored}
                />
              </div>
              <div className={styles.input}>
                <label htmlFor="edge-brightness">edge brightness:</label>
                <input
                  id="edge-brightness"
                  type="range"
                  defaultValue={spriteOptions.edgeBrightness * 100}
                  onChange={(e) =>
                    setSpriteOptions({
                      ...spriteOptions,
                      edgeBrightness: (1 * e.currentTarget.valueAsNumber) / 100,
                    })
                  }
                />
              </div>
              <div className={styles.input}>
                <label htmlFor="color-variations">color variations:</label>
                <input
                  id="color-variations"
                  type="range"
                  defaultValue={spriteOptions.colorVariations * 100}
                  onChange={(e) =>
                    setSpriteOptions({
                      ...spriteOptions,
                      colorVariations:
                        (1 * e.currentTarget.valueAsNumber) / 100,
                    })
                  }
                />
              </div>
              <div className={styles.input}>
                <label htmlFor="brightness-noise">brightness noise:</label>
                <input
                  id="brightness-noise"
                  type="range"
                  defaultValue={spriteOptions.brightnessNoise * 100}
                  onChange={(e) =>
                    setSpriteOptions({
                      ...spriteOptions,
                      brightnessNoise:
                        (1 * e.currentTarget.valueAsNumber) / 100,
                    })
                  }
                />
              </div>
              <div className={styles.input}>
                <label htmlFor="saturation">saturation:</label>
                <input
                  id="saturation"
                  type="range"
                  defaultValue={spriteOptions.saturation * 100}
                  onChange={(e) =>
                    setSpriteOptions({
                      ...spriteOptions,
                      saturation: (1 * e.currentTarget.valueAsNumber) / 100,
                    })
                  }
                />
              </div>
            </div>
            <div>
              <button
                type="button"
                onClick={() => setSelectedBrush(MaskData.AlwaysBorder)}
              >
                border
              </button>
              <button
                type="button"
                onClick={() => setSelectedBrush(MaskData.EmptyBody)}
              >
                empty / body
              </button>
              <button
                type="button"
                onClick={() => setSelectedBrush(MaskData.BorderBody)}
              >
                border / body
              </button>
            </div>
            {maskGrid}
            <div>
              <button type="button" onClick={importData}>
                import
              </button>
              <button type="button" onClick={exportData}>
                export
              </button>
            </div>
            <div>
              <button type="button" onClick={nextPicture}>
                next
              </button>
              <button type="button" onClick={reset}>
                reset
              </button>
            </div>
          </div>
          <div className={styles.right}>
            {output ? (
              <img
                className={styles.output}
                src={output}
                width={width * scale}
                height={height * scale}
                style={{
                  transform: `rotate(${rotation}deg)`,
                }}
              />
            ) : (
              <></>
            )}
            <div className={styles.input}>
              <label htmlFor="scale">scale:</label>
              <input
                id="scale"
                type="number"
                ref={scaleRef}
                value={scale}
                onChange={(e) =>
                  setScale(Math.max(1, e.currentTarget.valueAsNumber))
                }
              />
            </div>
            <div className={styles.input}>
              <label htmlFor="rotation">rotation:</label>
              <input
                id="rotation"
                type="range"
                min="0"
                max="360"
                ref={rotateRef}
                defaultValue={rotation}
                onChange={(e) => setRotation(e.currentTarget.valueAsNumber)}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
