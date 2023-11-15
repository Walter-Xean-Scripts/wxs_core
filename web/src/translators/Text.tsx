import { Typography } from "antd";
import { GetBindableProps } from "../utils/getBindableProps";

interface ITypography {
    id: string;
    name: string;
    properties: any;
}

const supportedProps = [
    "code",
    "copyable",
    "delete",
    "disabled",
    "editable",
    "ellipsis",
    "mark",
    "strong",
    "italic",
    "type",
    "underline"
]

export function TextTranslator(element: ITypography, uiName: string) {
    let propsFromElementProps: any = {};
    for (const prop of Object.keys(element.properties)) {
        if (supportedProps.includes(prop)) {
            propsFromElementProps[prop] = element.properties[prop];
        }
    }

    return (
        <Typography.Text
            key={element.id}
            style={{ ...element.properties }}
            {...propsFromElementProps}
            {...GetBindableProps(element.properties)}
        >
            {element.properties.text}
        </Typography.Text>
    )
}