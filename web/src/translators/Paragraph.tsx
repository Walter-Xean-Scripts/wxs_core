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

export function ParagraphTranslator(element: ITypography, uiName: string) {
    const propsFromElementProps = Object.keys(element.properties).map((prop: string) => {
        if (supportedProps.includes(prop)) {
            return {
                [prop]: element.properties[prop]
            }
        }
    });

    return (
        <Typography.Paragraph
            key={element.id}
            style={{ ...element.properties }}
            {...propsFromElementProps}
            {...GetBindableProps(element.properties)}
        >
            {element.properties.text}
        </Typography.Paragraph>
    )
}