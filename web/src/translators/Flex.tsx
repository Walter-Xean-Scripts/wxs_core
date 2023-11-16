import { Flex } from "antd";
import { renderElements } from "../utils/renderElement";
import { GetBindableProps } from "../utils/getBindableProps";
import { CSSProperties } from "react";

interface IProperties extends CSSProperties {
    vertical?: boolean;
    justify?: IJustify;
    align?: IAlign;
    gap?: IGap;
    wrap?: "wrap" | undefined;
}

interface IFlex {
    id: string;
    name: string;
    properties: IProperties;
    children: IFoactElement[];
}

type IJustify = "flex-start" | "center" | "flex-end" | "space-between" | "space-around" | "space-evenly" | undefined;
type IAlign = "flex-start" | "center" | "flex-end" | undefined;
type IGap = 'small' | 'middle' | 'large' | number;

export function FlexTranslator(element: IFlex, uiName: string) {

    const vertical: boolean = element.properties.vertical || false;
    const justify: IJustify = element.properties.justify || undefined;
    const align: IAlign = element.properties.align || undefined;
    const gap: IGap = element.properties.gap || "small";
    const wrap: "wrap" | undefined = element.properties.wrap ? "wrap" : undefined

    return (
        <Flex
            key={element.id}
            style={{ ...element.properties }}
            vertical={vertical}
            justify={justify}
            align={align}
            gap={gap}
            wrap={wrap}
            {...GetBindableProps(element.properties)}
        >
            {renderElements(element.children, uiName)}
        </Flex>
    )
}