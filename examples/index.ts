import "./measure";
import "./ol3-draw";
import "./ol3-history";

export function run() {
    let l = window.location;
    let path = `${l.origin}${l.pathname}?run=examples/`;
    let labs = `
    index
    measure
    ol3-draw&GROUP_NAME=ol3-draw-examples
    ol3-history
    `;

    let styles = document.createElement("style");
    document.head.appendChild(styles);

    styles.innerText += `
    #map {
        display: none;
    }
    .test {
        margin: 20px;
    }
    `;

    let html = labs
        .split(/ /)
        .map(v => v.trim())
        .filter(v => !!v)
        //.sort()
        .map(lab => `<div class='test'><a href='${path}${lab}&debug=0'>${lab}</a></div>`)
        .join("\n");

    document.write(html);
};
