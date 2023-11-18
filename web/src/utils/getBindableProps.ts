import dayjs from "dayjs";
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
    "date",
    "dateString",
    "dates",
]

function isStringArray(arr: any[]) {
    if (!Array.isArray(arr)) return false;
    if (arr.length == 0) return false;

    for (const value of arr) {
        if (typeof value !== "string") return false;
    }

    return true;

}

function checkProps(props: any, currentDepth?: number) {
    const newProps: any = {}

    if (isStringArray(props)) {
        return props;
    }
    if (props == undefined) return newProps;
    if (currentDepth == undefined) currentDepth = 0;

    if (currentDepth > 4) return newProps;
    if (dayjs.isDayjs(props)){
        return {
            dateString: props.format("DD-MM-YYYY"),
            timeString: props.format("HH:mm:ss"),
        }
    }

    if (Object.keys(props).length == 0) {
        for (const key of Object.getOwnPropertyNames(props)) {
            const value = props[key];
            if (typeof value == "object") {
                currentDepth++;
                const va = checkProps(value, currentDepth);
                if (va) {
                    newProps[key] = va;
                }
            } else if (relevantReturnProps.includes(key)) {
                newProps[key] = value
            }
        }
    } else {
        for (const [key, value] of Object.entries(props)) {
            if (typeof value == "object") {
                currentDepth++;
                const va = checkProps(value, currentDepth);
                if (va) {
                    newProps[key] = va;
                }
            } else if (relevantReturnProps.includes(key)) {
                newProps[key] = value
            }
        }
    }

    return newProps
}

function filterReturnProps(props: any[]) {
    let newProps: any = [];

    for (const prop of props) {
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
    if (!properties) return undefined;
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