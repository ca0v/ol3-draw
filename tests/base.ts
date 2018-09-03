export function describe(title: string, cb: any) {
    console.log(title || "undocumented test group");
    return window.describe(title, cb);
}

export function it(title: string, cb: any) {
    console.log(title || "undocumented test");
    return window.it(title, cb);
}

// can't figure out how to load "should" library (index.js seems amd compliant..should work)
export function should(result: boolean, message: string) {
    console.log(message || "undocumented assertion");
    if (!result) throw message;
}

export function shouldEqual<T>(a: T, b: T, message: string) {
    if (a != b) console.warn(a, b);
    should(a == b, message);
}

export function stringify(o: Object) {
    return JSON.stringify(o, null, "\t");
}