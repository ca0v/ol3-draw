import ol = require("openlayers");
import { olx } from "openlayers";
import { cssin, html, mixin, pair, range } from "ol3-fun/index";
import { StyleConverter } from "ol3-symbolizer/ol3-symbolizer/format/ol3-symbolizer";

export interface ButtonOptions extends olx.control.ControlOptions {
  map?: ol.Map;
  element: HTMLElement; // required
  className: string;
  position: string;
  label: string;
  title: string;
  eventName: string;
  buttonType: typeof Button;
}

export class Button extends ol.control.Control {
  static DEFAULT_OPTIONS: Partial<ButtonOptions> = {
    className: "ol-button",
    position: "top right",
    label: "Button",
    title: "Button",
    eventName: "click:button",
    buttonType: Button
  };

  static create(opt?: Partial<ButtonOptions>) {
    let options = mixin(mixin({}, Button.DEFAULT_OPTIONS), opt || {}) as ButtonOptions;

    options.element = options.element || document.createElement("DIV");

    let button = new options.buttonType(options);
    if (options.map) {
      options.map.addControl(button);
    }
    return button;
  }

  public options: ButtonOptions;
  public handlers: Array<() => void>;
  public symbolizer: StyleConverter;

  constructor(options: ButtonOptions) {
    super(options);
    this.options = options;
    this.handlers = [];
    this.symbolizer = new StyleConverter();

    this.cssin();
    options.element.className = `${options.className} ${options.position}`;

    let button = html(`<input type="button" value="${options.label}" />`);
    this.handlers.push(() => options.element.remove());

    button.title = options.title;
    options.element.appendChild(button);

    this.set("active", false);

    button.addEventListener("click", () => {
      this.dispatchEvent("click");
      this.set("active", !this.get("active"));
    });

    this.on("change:active", () => {
      this.options.element.classList.toggle("active", this.get("active"));
      if (options.map) {
        options.map.dispatchEvent({
          type: options.eventName,
          control: this
        });
      }
    });
  }

  setPosition(position: string) {
    this.options.position.split(" ").forEach(k => this.options.element.classList.remove(k));

    position.split(" ").forEach(k => this.options.element.classList.add(k));

    this.options.position = position;
  }

  destroy() {
    this.handlers.forEach(h => h());
    this.setTarget(<any>null);
  }

  cssin() {
    let className = this.options.className;
    let positions = pair("top left right bottom".split(" "), range(24)).map(
      pos => `.${className}.${pos[0] + (-pos[1] || "")} { ${pos[0]}:${0.5 + pos[1]}em; }`
    );

    this.handlers.push(
      cssin(
        className,
        `
            .${className} {
                position: absolute;
                background-color: rgba(255,255,255,.4);
            }
            .${className}.active {
                background-color: white;
            }
            .${className}:hover {
                background-color: white;
            }
            .${className} input[type="button"] {
                color: rgba(0,60,136,1);
                background: transparent;
                border: none;
                width: 2em;
                height: 2em;
            }
            ${positions.join("\n")}
        `
      )
    );
  }

  setMap(map: ol.Map) {
    let options = this.options;
    super.setMap(map);
    options.map = map;

    if (!map) {
      this.destroy();
      return;
    }
  }
}
