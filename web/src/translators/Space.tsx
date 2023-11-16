import { Divider, Slider, Space } from "antd";
import { renderElements } from "../utils/renderElement";
import React, { CSSProperties } from "react";
import { GetBindableProps } from "../utils/getBindableProps";

interface IProperties extends CSSProperties {
    compact?: boolean;
}

interface ISpace {
    id: string;
    name: string;
    properties: IProperties;
    children: IFoactElement[];
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
            propsFromElementProps[prop] = (element.properties as { [key: string]: any })[prop];
        }
    }

    const IsCompact: boolean = element.properties.compact || false;

    return (
        <React.Fragment key={`fragment.space-${element.id}`}>
            {!IsCompact ? (
                <Space
                    key={`space-${element.id}`}
                    style={{ ...element.properties }}
                    {...propsFromElementProps}
                    {...GetBindableProps(element.properties)}
                >
                    {renderElements(element.children, uiName)}
                </Space>
            ) : (
                <Space.Compact
                    key={`space.compact-${element.id}`}
                    style={{ ...element.properties }}
                    {...propsFromElementProps}
                    {...GetBindableProps(element.properties)}
                >
                    {renderElements(element.children, uiName)}
                </Space.Compact>
            )}
        </React.Fragment>
    )
}