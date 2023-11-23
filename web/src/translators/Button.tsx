import { Button } from "antd";
import { GetBindableProps } from "../utils/getBindableProps";
import React, { CSSProperties } from "react";
import { IconFromString } from "../utils/IconFromString";
import { renderElements } from "../utils/renderElement";

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
    customButton?: boolean;
}

interface IButton {
    id: string;
    name: string;
    properties: IProperties;
    children: IFoactElement[];
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

    "borderColorDisabled",
    "contentFontSize",
    "contentFontSizeLG",
    "contentFontSizeSM",
    "dangerColor",
    "dangerShadow",
    "defaultBg",
    "defaultBorderColor",
    "defaultColor",
    "defaultGhostBorderColor",
    "defaultGhostColor",
    "defaultShadow",
    "fontWeight",
    "ghostBg",
    "groupBorderColor",
    "linkHoverBg",
    "onlyIconSize",
    "onlyIconSizeLG",
    "onlyIconSizeSM",
    "paddingInline",
    "paddingInlineLG",
    "paddingInlineSM",
    "primaryColor",
    "primaryShadow",
    "textHoverBg",
]

export function ButtonTranslator(element: IButton, uiName: string) {
    let propsFromElementProps: any = {};
    for (const prop of Object.keys(element.properties)) {
        if (supportedProps.includes(prop)) {
            propsFromElementProps[prop] = (element.properties as { [key: string]: any })[prop];
        }
    }

    const Icon = IconFromString(element.properties.icon);

    const customButton = element.properties.customButton || false;

    return (
        <React.Fragment key={`fragment.button-${element.id}`}>
            {!customButton && (
                <Button
                    key={element.id}
                    style={{...element.properties}}
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
            )}

            {customButton && (
                <button
                    key={element.id}
                    style={{...element.properties}}
                    {...propsFromElementProps}
                    {...GetBindableProps(element.properties)}
                >
                    {renderElements(element.children, uiName)}
                </button>   
            )}
        </React.Fragment>
    )
}