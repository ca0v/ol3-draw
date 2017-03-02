import ol = require("openlayers");
import { cssin, html, mixin } from "ol3-fun/ol3-fun/common";
import { StyleConverter } from "ol3-symbolizer";

function range(n: number) {
    let result = new Array(n);
    for (let i = 0; i < n; i++) result[i] = i;
    return <number[]>result;
}

function pair<A, B>(a1: A[], a2: B[]) {
    let result: Array<[A, B]> = [];
    a1.forEach(v1 => a2.forEach(v2 => result.push([v1, v2])));
    return result;
}

export interface IOptions extends olx.control.ControlOptions {
    map?: ol.Map;
    className?: string;
    position?: string;
    label?: string;
    title?: string;
    eventName?: string;
    buttonType?: typeof Button;
}

export class Button extends ol.control.Control {
    static DEFAULT_OPTIONS: IOptions = {
        className: "ol-button",
        position: "top right",
        label: "Button",
        title: "Button",
        eventName: "click:button",
        buttonType: Button
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

        let button = new (options.buttonType)(options);
        if (options.map) {
            options.map.addControl(button);
        }
        return button;
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
        button.addEventListener("click", () => {
            this.dispatchEvent("click");
            this.set("active", !this.get("active"));
        });

        this.on("change:active", () => void this.options.element.classList.toggle("active", this.get("active")));
    }

    cssin() {
        let className = this.options.className;
        let positions = pair("top left right bottom".split(" "), range(24))
            .map(pos => `.${className}.${pos[0] + (-pos[1] || '')} { ${pos[0]}:${0.5 + pos[1]}em; }`);

        cssin(className, `
            .${className} {
                position: absolute;
                background: #ccc;
            }
            .${className}.active {
                background-color: white;
            }
            .${className} input[type="button"] {
                background: transparent;
                border: none;
                width: 2em;
                height: 2em;
            }
            ${positions.join('\n')}
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

