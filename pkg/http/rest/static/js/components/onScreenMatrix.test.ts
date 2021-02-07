import { OnScreenMatrix } from "./onScreenMatrix";

describe("onScreenMatrix", () => {
  it("should create a new instance", () => {
    const instance = new OnScreenMatrix([1, 2, 3]);
  });

  it("should give you the next item", () => {
    const t1 = new OnScreenMatrix(["1", "2", "3"]);
    expect(t1.findNextItemInMatrix("2", "down")).toEqual("3");

    const t2 = new OnScreenMatrix(["1", "2", "3"], ["4", "5", "6"]);

    expect(t2.findNextItemInMatrix("1", "right")).toEqual("4");
  });

  it("should be able to recreate matrix with new array", () => {
    const instance = new OnScreenMatrix(["1", "2", "3"]);

    instance.addNewArray(["5", "6", "7"]);

    expect(instance.findNextItemInMatrix("1", "right")).toEqual("5");

    instance.addNewArray(["8", "9", "10"]);
    console.log("instance", instance);

    expect(instance.findNextItemInMatrix("5", "right")).toEqual("8");
    expect(instance.findNextItemInMatrix("2", "down")).toEqual("3");
  });
});
