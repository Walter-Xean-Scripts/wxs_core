import { Flex } from "antd";
import { renderElements } from "../utils/renderElement";
import { GetBindableProps } from "../utils/getBindableProps";
import { CSSProperties } from "react";

interface IProperties extends CSSProperties {
    vertical?: boolean;
    justify?: "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly";
    align?: "flex-start" | "center" | "flex-end";
    gap?: 'small' | 'middle' | 'large' | number;
    wrap?: "wrap" | undefined;
}

interface IFlex {
    id: string;
    name: string;
    properties: IProperties;
    children: IFoactElement[];
}

const supportedProps = [
    "vertical",
    "wrap",
    "justify",
    "align",
    "gap",
]

export function FlexTranslator(element: IFlex, uiName: string) {
    let propsFromElementProps: any = {};
    for (const prop of Object.keys(element.properties)) {
        if (supportedProps.includes(prop)) {
            propsFromElementProps[prop] = (element.properties as { [key: string]: any })[prop];
        }
    }

    return (
        <Flex
            key={element.id}
            style={{ ...element.properties }}
            {...propsFromElementProps}
            {...GetBindableProps(element.properties)}
        >
            {renderElements(element.children, uiName)}
        </Flex>
    )
}