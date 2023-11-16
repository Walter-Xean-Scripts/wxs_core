import { Typography } from "antd";
import { GetBindableProps } from "../utils/getBindableProps";
import { CSSProperties } from "react";

interface IProperties extends CSSProperties {
    text?: string;
}

interface ITypography {
    id: string;
    name: string;
    properties: IProperties;
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
                [prop]: (element.properties as { [key: string]: any })[prop]
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