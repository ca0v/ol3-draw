import { describe, it, should, shouldEqual } from "ol3-fun/tests/base";
import { DrawControlOptions, Draw } from "../../ol3-draw/ol3-draw";

describe("Draw Tests", () => {
  it("Draw", () => {
    should(!!Draw, "Draw");
  });

  it("DEFAULT_OPTIONS", () => {
    let options = Draw.DEFAULT_OPTIONS;
    checkDefaultInputOptions(options);
  });

  it("options of an Input instance", () => {
    let input = Draw.create();
    checkDefaultInputOptions(input.options);
  });
});

function checkDefaultInputOptions(options: DrawControlOptions) {
  should(!!options, "options");
  shouldEqual(options.className, "ol-draw", "className");
  shouldEqual(options.map, undefined, "map");
  shouldEqual(options.position, "top left", "position");
}
