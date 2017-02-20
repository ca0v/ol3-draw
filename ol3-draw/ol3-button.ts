import ol = require("openlayers");
import { cssin, html, mixin } from "ol3-fun/ol3-fun/common";
import { StyleConverter } from "ol3-symbolizer";

export interface IOptions extends olx.control.ControlOptions {
    className?: string;
    position?: string;
    label?: string;
    title?: string;
    eventName?: string;
}

export class Button extends ol.control.Control {
    static DEFAULT_OPTIONS: IOptions = {
        className: "ol-button",
        position: "top right",
        label: "Button",
        title: "Button",
        eventName: "click:button"
    }

    static create(options?: IOptions) {
        options = mixin(mixin({}, Button.DEFAULT_OPTIONS), options);

        if (!options.element) {
            options.element = document.createElement("div");
            document.body.appendChild(options.element);
        }

        if (!options.target) {
            options.target = document.createElement("div");
            document.body.appendChild(options.target);
        }

        return new Button(options);
    }

    public options: IOptions;

    constructor(options: IOptions) {
        super(options);
        this.options = options;

        this.cssin();
        options.element.className = `${options.className} ${options.position}`;

        let button = html(`<input type="button" value="${options.label}" />`);
        button.title = options.title;
        options.element.appendChild(button);

        this.set("active", false);
        button.addEventListener("click", () => this.set("active", !this.get("active")));

        this.on("change:active", () => this.options.element.classList.toggle("active", this.get("active")));
    }

    cssin() {
        let className = this.options.className;
        cssin(className, `
            .${className} {
                position: absolute;
                background: #ccc;
            }
            .${className}.active {
                background-color: white;
            }
            .${className}.top {
                top: 0.5em;
            }
            .${className}.top-1 {
                top: 1.5em;
            }
            .${className}.top-2 {
                top: 2.5em;
            }
            .${className}.top-3 {
                top: 3.5em;
            }
            .${className}.top-4 {
                top: 4.5em;
            }
            .${className}.right {
                right: 0.5em;
            }
            .${className}.right-1 {
                right: 1.5em;
            }
            .${className}.right-2 {
                right: 2.5em;
            }
            .${className}.right-3 {
                right: 3.5em;
            }
            .${className}.right-4 {
                right: 4.5em;
            }
            .${className}.right-5 {
                right: 5.5em;
            }
            .${className}.right-6 {
                right: 6.5em;
            }
            .${className} input[type="button"] {
                background: transparent;
                border: none;
                width: 2em;
                height: 2em;
            }
        `);
    }

    setMap(map: ol.Map) {
        let options = this.options;
        super.setMap(map);

        this.on("change:active", () => {
            map.dispatchEvent({
                type: options.eventName,
                control: this
            });
        });
    }

}

