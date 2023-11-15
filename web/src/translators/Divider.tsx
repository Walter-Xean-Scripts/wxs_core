import { Divider } from "antd";
import { GetBindableProps } from "../utils/getBindableProps";

interface IDivider {
    id: string;
    name: string;
    properties: any;
}

type IOrientation = "left" | "right" | undefined
type IType = "vertical" | "horizontal"

export function DividerTranslator(element: IDivider, uiName: string) {

    const text = element.properties.text
    const orientation: IOrientation = element.properties.orientation
    const orientationMargin: number = element.properties.orientationMargin || 0
    const plain: boolean = element.properties.plain || false
    const type: IType = element.properties.type || "horizontal"
    const dashed: boolean = element.properties.dashed || false

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