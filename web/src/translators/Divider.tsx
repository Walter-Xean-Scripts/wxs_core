import { Divider } from "antd";
import { GetBindableProps } from "../utils/getBindableProps";
import { CSSProperties } from "react";

interface IProperties extends CSSProperties {
    text?: string;
    orientation?: "left" | "right";
    orientationMargin?: number;
    plain?: boolean;
    type?: "vertical" | "horizontal";
    dashed?: boolean;
}

interface IDivider {
    id: string;
    name: string;
    properties: IProperties;
}

const supportedProps = [
    "dashed",
    "orientation",
    "orientationMargin",
    "plain",
    "type",
]

export function DividerTranslator(element: IDivider, uiName: string) {
    let propsFromElementProps: any = {};
    for (const prop of Object.keys(element.properties)) {
        if (supportedProps.includes(prop)) {
            propsFromElementProps[prop] = (element.properties as { [key: string]: any })[prop];
        }
    }

    return (
        <Divider
            key={element.id}
            style={{ ...element.properties }}
            {...propsFromElementProps}
            {...GetBindableProps(element.properties)}
        >
            {element.properties.text}
        </Divider>
    )
}