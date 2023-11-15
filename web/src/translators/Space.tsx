import { Divider, Slider, Space } from "antd";
import { renderElements } from "../utils/renderElement";
import React from "react";
import { GetBindableProps } from "../utils/getBindableProps";

interface ISpace {
    id: string;
    name: string;
    properties: any;
    children: any[];
}

const supportedProps = [
    "direction", // "horizontal" | "vertical"
    "size", // 'small' | 'middle' | 'large' | number | undefined;
    "align", // "center" | "start" | "end" | "baseline" | undefined
    "wrap", // boolean
    //"compact" boolean
]

export function SpaceTranslator(element: ISpace, uiName: string) {
    let propsFromElementProps: any = {};
    for (const prop of Object.keys(element.properties)) {
        if (supportedProps.includes(prop)) {
            propsFromElementProps[prop] = element.properties[prop];
        }
    }

    const IsCompact: boolean = element.properties.compact || false;

    return (
        <>
            {!IsCompact && (
                <Space
                    key={element.id}
                    style={{ ...element.properties }}
                    {...propsFromElementProps}
                    {...GetBindableProps(element.properties)}
                >
                    {renderElements(element.children, uiName)}
                </Space>
            )}
            {IsCompact && (
                <Space.Compact
                    key={element.id}
                    style={{ ...element.properties }}
                    {...propsFromElementProps}
                    {...GetBindableProps(element.properties)}
                >
                    {renderElements(element.children, uiName)}
                </Space.Compact>
            )}
        </>
    )
}