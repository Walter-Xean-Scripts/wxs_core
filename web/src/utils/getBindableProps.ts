import { fetchNui } from "./fetchNui";

const relevantReturnProps = [
    "keyPath",
    "value",
    "key",
    "checked",
    "selected",
    "disabled",
    "source",
    "altKey",
    "ctrlKey",
    "button",
    "buttons",
    "clientX",
    "clientY",
    "layerX",
    "layerY",
    "offsetX",
    "offsetY",
    "movementX",
    "movementY",
    "metaKey",
    "ctrlKey",
    "pageX",
    "pageY",
    "screenX",
    "screenY",
    "shiftKey",
    "x",
    "y",
    "s",
    "selectedKeys",
    "openKeys",
    "checkedValue",
    "target",
]

function isStringArray(arr: any[]) {
    if (!Array.isArray(arr)) return false;
    if (arr.length == 0) return false;

    for (const value of arr) {
        if (typeof value !== "string") return false;
    }

    return true;

}

function checkProps(props: any) {
    const newProps: any = {}

    if (isStringArray(props)) {
        return props;
    }

    for (const [key, value] of Object.entries(props)) {
        if (relevantReturnProps.includes(key)) {
            newProps[key] = value
        }
    }
    return newProps
}

function filterReturnProps(props: any[]) {
    let newProps: any = [];

    for (const prop of props) {
        console.log(typeof prop)
        if (typeof prop !== "object") {
            newProps.push(prop);
            continue;
        };

        const va = checkProps(prop)
        if (va) {
            newProps.push(va);
        }
    }

    return newProps;
}

export function GetBindableProps(properties: any) {
    const newProperties: any = {};
    let i = 0;

    for (const value of Object.values(properties)) {
        if (typeof value == "string" && value.startsWith("fnRef_")) {
            const key = Object.keys(properties)[i];
            newProperties[key] = (...args: any) => {
                const newArgs = filterReturnProps(args);
                fetchNui("CallFnRef", {
                    fnRefName: value,
                    args: newArgs,
                });
            }
        }

        i++;
    }

    return newProperties;
}