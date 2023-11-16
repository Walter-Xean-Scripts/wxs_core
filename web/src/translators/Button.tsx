import { Button } from "antd";
import { fetchNui } from "../utils/fetchNui";
import * as AIcon from "@ant-design/icons";
import { GetBindableProps } from "../utils/getBindableProps";
import { CSSProperties } from "react";

interface IProperties extends CSSProperties {
    type?: IType;
    icon?: string;
    size?: "large" | "middle" | "small";
    disabled?: boolean;
    loading?: boolean;
    ghost?: boolean;
    block?: boolean;
    danger?: boolean;
    leftText?: string;
    text?: string;
    rightText?: string;
}

interface IButton {
    id: string;
    name: string;
    properties: IProperties;
}

type IType = "primary" | "default" | "dashed" | "text" | "link"

export function ButtonTranslator(element: IButton, uiName: string) {
    const type = element.properties.type || "default"

    const Icon = element.properties.icon ? (AIcon as { [key: string]: any })[element.properties.icon] : undefined
    const size = element.properties.size || "default"
    const disabled = element.properties.disabled || false
    const loading = element.properties.loading || false
    const ghost = element.properties.ghost || false
    const block = element.properties.block || false
    const danger = element.properties.danger || false

    return (
        <Button
            key={element.id}
            style={{ ...element.properties }}
            type={type}
            icon={Icon ? <Icon /> : undefined}
            size={size}
            disabled={disabled}
            loading={loading}
            ghost={ghost}
            block={block}
            danger={danger}
            {...GetBindableProps(element.properties)}
        >
            {
                (element.properties.leftText) && (
                    <span
                        style={{
                            float: "left",
                        }}
                    >
                        {element.properties.leftText}
                    </span>
                )
            }

            {element.properties.text}

            {
                (element.properties.rightText) && (
                    <span
                        style={{
                            float: "right",
                        }}
                    >
                        {element.properties.rightText}
                    </span>
                )
            }

        </Button>
    )
}