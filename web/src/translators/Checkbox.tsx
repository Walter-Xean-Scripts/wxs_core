import React from "react";
import { GetBindableProps } from "../utils/getBindableProps";
import { Checkbox, CheckboxOptionType } from "antd";

interface ICheckbox {
    id: string;
    name: string;
    properties: any;
    children: any[];
}

const supportedProps = [
    "autoFocus",
    "checked",
    "defaultChecked",
    "disabled",
    "defaultValue",
    
    "indeterminate", // ??
]

export function CheckboxTranslator(element: ICheckbox, uiName: string) {
    let propsFromElementProps: any = {};
    for (const prop of Object.keys(element.properties)) {
        if (supportedProps.includes(prop)) {
            propsFromElementProps[prop] = element.properties[prop];
        }
    }

    const text: string = element.properties.text || "";
    
    const isGroup: boolean = element.properties.isGroup || false;
    if (isGroup && ! element.properties.options) {
        console.log("Checkbox: properties.options can NOT be undefined when isGroup is true!! Source (UI NAME): " + uiName)
        return null;
    }

    const options: (string | number | CheckboxOptionType)[] = element.properties.options;

    return (
        <React.Fragment key={`fragment.checkbox-${element.id}`}>
            {!isGroup && (
                <Checkbox
                    key={element.id}
                    style={{ ...element.properties }}
                    {...propsFromElementProps}
                    {...GetBindableProps(element.properties)}
                >
                    {text}
                </Checkbox>
            )}
            {isGroup && (
                <Checkbox.Group
                    key={element.id}
                    style={{ ...element.properties }}
                    {...propsFromElementProps}
                    {...GetBindableProps(element.properties)}
                    options={options}
                />
            )}
        </React.Fragment>
    )
}