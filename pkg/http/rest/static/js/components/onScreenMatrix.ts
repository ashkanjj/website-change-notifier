import { zip } from "lodash";

export type Direction = "up" | "down" | "left" | "right";

export type MatrixItem = { type: string; id: string };

export class OnScreenMatrix {
  private matrix: MatrixItem[][];
  private currentArrays: [][];
  constructor(...arrays) {
    this.currentArrays = arrays;
    this.matrix = zip(...arrays);
    console.log("matrix", this.matrix);
  }

  public addNewArray(arr) {
    this.currentArrays = [...this.currentArrays, arr];
    this.matrix = zip(...this.currentArrays);
  }

  public findNextItemInMatrix(
    selected: string,
    direction: Direction
  ): MatrixItem {
    let nextItem;
    const matrix = this.matrix;
    matrix.forEach((outer, outerIndex) => {
      outer.forEach((inner, innerIndex) => {
        if (inner && inner.id === selected) {
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
