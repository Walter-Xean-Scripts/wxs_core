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
    "level",
    "mark",
    "italic",
    "type",
    "underline"
]

export function TitleTranslator(element: ITypography, uiName: string) {
    const propsFromElementProps = Object.keys(element.properties).map((prop: string) => {
        if (supportedProps.includes(prop)) {
            return {
                [prop]: element.properties[prop]
            }
        }
    });

    return (
        <Typography.Title
            key={element.id}
            style={{ ...element.properties }}
            {...propsFromElementProps}
            {...GetBindableProps(element.properties)}
        >
            {element.properties.text}
        </Typography.Title>
    )
}