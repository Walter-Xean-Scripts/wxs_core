import React from "react";
import { CSSProperties } from "react";
import { GetBindableProps } from "../utils/getBindableProps";
import { Checkbox, CheckboxOptionType } from "antd";

interface IExtraProps {
    autoFocus?: boolean;
    checked?: boolean;
    defaultChecked?: boolean;
    disabled?: boolean;
    defaultValue?: boolean;
    indeterminate?: boolean;
}

interface IPropeties extends CSSProperties, IExtraProps {
    text?: string;
    isGroup?: boolean;
    options?: (string | number | CheckboxOptionType)[];
    value?: (string | number | boolean)[];
}

interface ICheckbox {
    id: string;
    name: string;
    properties: IPropeties;
    children: IFoactElement[];
}

const supportedProps = [
    "autoFocus",
    "checked",
    "defaultChecked",
    "disabled",
    "defaultValue",

    "indeterminate", // ??

    "colorBgContainer",
    "colorBgContainerDisabled",
    "colorBorder",
    "colorPrimary",
    "colorPrimaryBorder",
    "colorPrimaryHover",
    "colorText",
    "colorTextDisabled",
    "colorWhite",
    "borderRadiusSM",
    "controlInteractiveSize",
    "fontFamily",
    "fontSize",
    "fontSizeLG",
    "lineHeight",
    "lineType",
    "lineWidth",
    "lineWidthBold",
    "lineWidthFocus",
    "marginXS",
    "motionDurationFast",
    "motionDurationMid",
    "motionDurationSlow",
    "motionEaseInBack",
    "motionEaseOutBack",
    "paddingXS",
]

export function CheckboxTranslator(element: ICheckbox, uiName: string) {
    let propsFromElementProps: { [key: string]: boolean } = {};
    for (const prop of Object.keys(element.properties)) {
        if (supportedProps.includes(prop)) {
            propsFromElementProps[prop] = (element.properties as { [key: string]: boolean })[prop];
        }
    }

    const text: string = element.properties.text || "";

    const isGroup: boolean = element.properties.isGroup || false;
    if (isGroup && !element.properties.options) {
        console.log("Checkbox: properties.options can NOT be undefined when isGroup is true!! Source (UI NAME): " + uiName)
        return null;
    }

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
                    options={element.properties.options}
                />
            )}
        </React.Fragment>
    )
}