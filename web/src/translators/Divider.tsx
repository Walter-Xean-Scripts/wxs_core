import { Divider } from "antd";
import { GetBindableProps } from "../utils/getBindableProps";
import { CSSProperties } from "react";

interface IProperties extends CSSProperties {
    text?: string;
    orientation?: IOrientation;
    orientationMargin?: number;
    plain?: boolean;
    type?: IType;
    dashed?: boolean;
}

interface IDivider {
    id: string;
    name: string;
    properties: IProperties;
}

type IOrientation = "left" | "right" | undefined
type IType = "vertical" | "horizontal"

export function DividerTranslator(element: IDivider, uiName: string) {
    const text = element.properties.text
    const orientation = element.properties.orientation
    const orientationMargin = element.properties.orientationMargin || 0
    const plain = element.properties.plain || false
    const type: IType = element.properties.type || "horizontal"
    const dashed = element.properties.dashed || false

    return (
        <Divider
            key={element.id}
            style={{ ...element.properties }}
            orientation={orientation}
            orientationMargin={orientationMargin}
            plain={plain}
            type={type}
            dashed={dashed}
            {...GetBindableProps(element.properties)}
        >
            {text}
        </Divider>
    )
}