import Search from "antd/es/input/Search";
import { GetBindableProps } from "../utils/getBindableProps";
import { Input } from "antd";
import * as AIcon from "@ant-design/icons";
//import { SearchOutlined } from "@ant-design/icons";
import React from "react";

interface IInput {
    id: string;
    name: string;
    properties: any;
    children: any[];
}

const supportedProps = [
    "placeholder",
    "addonBefore",
    "addonAfter",
    "defaultValue",
    "allowClear",
    "size",
    "loading",
    "rows",
    "maxLength",
    "autoSize",
    "showCount",
    "status",
    "bordered",
    "disabled",
]

type IType = "Input" | "Search" | "TextArea"

function getInputValueOrIcon(input: {type: string, value: string} | undefined): any {
    if (!input) return undefined;
    if (input.type == "icon") {
        console.log(11, "value: ", input.value)
        const Icon = input.value ? (AIcon as { [key: string]: any })[input.value] : undefined;
        return Icon ? <Icon /> : undefined;
    } else {
        return input.value;
    }
}

export function InputTranslator(element: IInput, uiName: string) {
    let propsFromElementProps: any = {};
    for (const prop of Object.keys(element.properties)) {
        if (supportedProps.includes(prop)) {
            propsFromElementProps[prop] = element.properties[prop];
        }
    }

    const type: IType = element.properties.type || "Input";

    // Prefix handling.
    let prefix: React.ReactNode | string = getInputValueOrIcon(element.properties.prefix);

    // Suffix handling.
    let suffix: React.ReactNode | string = getInputValueOrIcon(element.properties.suffix);    

    // Icon/Text handling for "search" button.
    let enterButton: React.ReactNode | string = getInputValueOrIcon(element.properties.enterButton);

    return (
        <>
            {type.toLowerCase() === "input" && (
                <Input
                    key={element.id}
                    style={{ ...element.properties }}
                    {...propsFromElementProps}
                    {...GetBindableProps(element.properties)}
                    prefix={prefix}
                    suffix={suffix}
                />   
            )}
            {type.toLowerCase() === "search" && (
                <Search
                    key={element.id}
                    style={{ ...element.properties }}
                    {...propsFromElementProps}
                    {...GetBindableProps(element.properties)}
                    enterButton={enterButton}
                    prefix={prefix}
                    suffix={suffix}
                />
            )}
            {type.toLowerCase() === "textarea" && (
                <Input.TextArea
                    key={element.id}
                    style={{ ...element.properties }}
                    {...propsFromElementProps}
                    {...GetBindableProps(element.properties)}
                    prefix={prefix}
                    suffix={suffix}
                />
            )}
        </>
    )
}