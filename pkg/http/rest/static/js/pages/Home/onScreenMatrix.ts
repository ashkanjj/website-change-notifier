import { zip } from "lodash";

export type Direction = "up" | "down" | "left" | "right";

export class OnScreenMatrix {
  private matrix: string[][];
  constructor(...arrays) {
    this.matrix = zip(...arrays);
  }

  public findNextItemInMatrix(
    selected: string,
    direction: Direction
  ): string | null {
    let nextItem;
    const matrix = this.matrix;
    matrix.forEach((outer, outerIndex) => {
      outer.forEach((inner, innerIndex) => {
        if (inner === selected) {
          switch (direction) {
            case "down": {
              let outerItem = matrix[outerIndex + 1];
              nextItem =
                outerItem && outerItem[innerIndex]
                  ? outerItem[innerIndex]
                  : null;
              break;
            }
            case "up": {
              let outerItem = matrix[outerIndex - 1];
              nextItem =
                outerItem && outerItem[innerIndex]
                  ? outerItem[innerIndex]
                  : null;
              break;
            }
            case "right": {
              nextItem = matrix[outerIndex][innerIndex + 1] || null;
              break;
            }
            case "left": {
              nextItem = matrix[outerIndex][innerIndex - 1] || null;
              break;
            }
            default:
              nextItem = null;
          }
        }
      });
    });

    return nextItem;
  }
}
