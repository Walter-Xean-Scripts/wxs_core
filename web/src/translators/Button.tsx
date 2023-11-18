import { Button } from "antd";
import * as AIcon from "@ant-design/icons";
import { GetBindableProps } from "../utils/getBindableProps";
import React, { CSSProperties } from "react";
import { IconFromString } from "../utils/IconFromString";

type IType = "primary" | "default" | "dashed" | "text" | "link"

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

const supportedProps = [
    "type",
    "size",
    "disabled",
    "loading",
    "ghost",
    "block",
    "danger",
    "shape",

    "href",
    "htmlType",
    "target",
]

export function ButtonTranslator(element: IButton, uiName: string) {
    let propsFromElementProps: any = {};
    for (const prop of Object.keys(element.properties)) {
        if (supportedProps.includes(prop)) {
            propsFromElementProps[prop] = (element.properties as { [key: string]: any })[prop];
        }
    }

    const Icon = IconFromString(element.properties.icon);

    return (
        <Button
            key={element.id}
            style={{ ...element.properties }}
            {...propsFromElementProps}
            {...GetBindableProps(element.properties)}
            icon={Icon}
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