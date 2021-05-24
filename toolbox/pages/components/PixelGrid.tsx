import styles from "../../styles/PixelGrid.module.css";

import React, { ReactElement, HTMLAttributes } from "react";
import { hexToRgba, range } from "../util";

interface PixelGridProps extends HTMLAttributes<HTMLDivElement> {
  width?: number;
  height?: number;
  draw: React.MouseEventHandler;
  getColor: (index: number) => string;
  getOpacity?: (index: number) => number;
}

export default function PixelGrid({
  width = 8,
  height = 8,
  draw,
  getColor,
  getOpacity = (_) => 1,
  ...rest
}: PixelGridProps): ReactElement {
  return (
    <div
      className={styles.grid}
      onContextMenu={(e) => e.preventDefault()}
      style={{
        gridTemplateColumns: `repeat(${width}, 1fr)`,
        gridTemplateRows: `repeat(${height}, 1fr)`,
      }}
      {...rest}
    >
      {range(0, width * height).map((i) => {
        const color = getColor(i);
        const opacity = getOpacity(i);
        let cell: string;
        if (color && opacity) {
          const rgba = hexToRgba(getColor(i), getOpacity(i));
          cell = `rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${rgba[3]})`;
        } else {
          cell = "transparent";
        }
        return (
          <div
            key={i}
            data-index={i}
            className={styles.gridItem}
            onMouseDown={draw}
            onMouseOver={draw}
            style={{
              background: cell,
            }}
          ></div>
        );
      })}
    </div>
  );
}
