import {CanvasResult, NCircle, NColor, NGradient, NList, NScalar, NString, SCOPE} from './test1.js'

export const is_error_result = (result) => result instanceof Error
export const is_scalar = (val) => (val instanceof NScalar)
export const is_string = (val) => (val instanceof NString)
export const is_list   = (val) => val instanceof NList
export const is_color  = (val) => val instanceof NColor
export const is_canvas_result = (val) => val instanceof CanvasResult
export function is_gradient(result) {
    return result instanceof NGradient
}

export function real_eval(code) {
    let scope = {
        foo: () => console.log("doing foo"),
        scalar: (v) => new NScalar(v),
        string: v => new NString(v),
        list: v => new NList(v),
        color: v => new NColor(v),
        gradient: v => new NGradient(v),
        size: SCOPE.size.impl,
        sum: SCOPE.sum.impl,
        average: SCOPE.average.impl,
        map: SCOPE.map.impl,
        circle: v => new NCircle(v),
        pack_row: SCOPE.pack_row.impl,
        draw: SCOPE.draw.impl
    }

    let lines = code.split("\n")
    lines[lines.length - 1] = 'return ' + lines[lines.length - 1]

    let defines = Object.keys(scope).map(key => {
        return `    const ${key} = scope.${key}`
    }).join("\n")
    let gen_code = `
"use strict"; 
return function(scope) {
${defines}
${lines.join("\n")}
};
`
    console.log("generated code is", gen_code)
    try {
        return Function(gen_code)()(scope)
    } catch (e) {
        console.error(e)
        return e
    }
}