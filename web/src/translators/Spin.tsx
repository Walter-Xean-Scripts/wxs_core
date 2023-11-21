import React, { CSSProperties } from "react";
import { Spin } from "antd";
import { GetBindableProps } from "../utils/getBindableProps";
import { renderElements } from "../utils/renderElement";
import { IconFromString } from "../utils/IconFromString";

interface IProperties extends CSSProperties {
    size?: "small" | "default" | "large";
    spinning?: boolean;
    tip?: string;
    delay?: number;
    indicator?: string;
    fullscreen?: boolean;
}

interface ISpin {
    id: string;
    name: string;
    properties: IProperties;
    children: IFoactElement[];
}

const supportedProps = [
    "size",
    "spinning",
    "tip",
    "delay",
    "fullscreen",

    "contentHeight",
    "dotSize",
    "dotSizeLG",
    "dotSizeSM",
]

export function SpinTranslator(element: ISpin, uiName: string) {
    let propsFromElementProps: any = {};
    for (const prop of Object.keys(element.properties)) {
        if (supportedProps.includes(prop)) {
            propsFromElementProps[prop] = (element.properties as { [key: string]: any })[prop];
        }
    }

    const indicator = IconFromString(element.properties.indicator);

    return (
        <Spin
            key={element.id}
            style={{ ...element.properties }}
            {...propsFromElementProps}
            {...GetBindableProps(element.properties)}
            indicator={indicator}
        >
            {renderElements(element.children, uiName)}
        </Spin>
    )
}