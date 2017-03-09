export function run() {
    let l = window.location;
    let path = `${l.origin}${l.pathname}?run=ol3-draw/examples/`;
    let labs = `
    index
    ol3-draw&GROUP_NAME=ol3-draw-examples
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


    html += `<a href='${l.origin}${l.pathname}?run=ol3-draw/tests/index'>tests</a>`;

    document.write(html);
};
