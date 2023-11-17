import { Typography } from "antd";
import { GetBindableProps } from "../utils/getBindableProps";
import React, { CSSProperties } from "react";
import * as AIcon from "@ant-design/icons";
import { IconFromString } from "../utils/getIcon";

type ICopyable = boolean | {
    text?: string;
    onCopy?: (event: any) => void;
    icon?: any; //React.ReactNode;
    tooltips?: [string, string] | string;
} | undefined;
type IEditable = boolean | {
    icon?: any; //React.ReactNode;
    tooltip?: boolean | string;
    editing?: boolean;
    maxLength?: number;
    autoSize?: boolean | { minRows?: number; maxRows?: number };
    text?: string;
    onChange?: (value: string) => void;
    onCancel?: () => void;
    onStart?: () => void;
    onEnd?: () => void;
    triggerType?: ("icon" | "text")[];
    enterIcon?: any; //React.ReactNode;
} | undefined;

interface IProperties extends CSSProperties {
    text?: string;
    copyable?: ICopyable;
    editable?: IEditable;
}

interface ITypography {
    id: string;
    name: string;
    properties: IProperties;
}

const supportedProps = [
    "code",
    //"copyable",
    "delete",
    "disabled",
    "editable",
    "ellipsis",
    "keyboard",
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
            propsFromElementProps[prop] = (element.properties as { [key: string]: any })[prop];
        }
    }

    // Handle Copyable
    let copyable: ICopyable;
    if (element.properties.copyable) {
        if (typeof element.properties.copyable === "boolean") {
            copyable = element.properties.copyable;
        } else {
            copyable = {
                text: element.properties.copyable.text,
                icon: IconFromString(element.properties.copyable.icon),
                tooltips: element.properties.copyable.tooltips,
                ...GetBindableProps(element.properties.copyable),
            }
        }
    }

    // Handle Editable
    let editable: IEditable;
    if (element.properties.editable) {
        if (typeof element.properties.editable === "boolean") {
            editable = element.properties.editable;
        } else {
            editable = {
                icon: IconFromString(element.properties.editable.icon),
                tooltip: element.properties.editable.tooltip,
                editing: element.properties.editable.editing,
                maxLength: element.properties.editable.maxLength,
                autoSize: element.properties.editable.autoSize,
                text: element.properties.editable.text,
                triggerType: element.properties.editable.triggerType,
                enterIcon: IconFromString(element.properties.editable.enterIcon),
                ...GetBindableProps(element.properties.editable),
            }
        }
    }

    return (
        <Typography.Text
            key={element.id}
            style={{ ...element.properties }}
            {...propsFromElementProps}
            {...GetBindableProps(element.properties)}
            copyable={copyable}
            editable={editable}
        >
            {element.properties.text}
        </Typography.Text>
    )
}