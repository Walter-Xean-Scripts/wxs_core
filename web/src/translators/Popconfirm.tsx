import { ButtonProps, Popconfirm, Typography } from "antd";
import { GetBindableProps } from "../utils/getBindableProps";
import React, { CSSProperties } from "react";
import { IconFromString } from "../utils/IconFromString";
import { renderElements } from "../utils/renderElement";
import { TooltipPlacement } from "antd/es/tooltip";

interface IProperties extends CSSProperties {
    title?: string;
    description?:  string | string[];
    descriptionStyle: CSSProperties;
    okText?: string;
    cancelText?: string;
    placement?: TooltipPlacement;
    disabled?: boolean;
    icon?: string;
    okType?: string;
    cancelButtonProps?: any;
    okButtonProps?: any;
    showCancel?: boolean;
}

interface ITypography {
    id: string;
    name: string;
    properties: IProperties;
    children: IFoactElement[];
}

const supportedProps = [
    "title",
    "description",
    "okText",
    "cancelText",
    "placement",
    "disabled",
    "okType",
    "showCancel",
    "open",

    "zIndexPopup",
]

export function PopconfirmTranslator(element: ITypography, uiName: string) {
    let propsFromElementProps: any = {};
    for (const prop of Object.keys(element.properties)) {
        if (supportedProps.includes(prop)) {
            propsFromElementProps[prop] = (element.properties as { [key: string]: any })[prop];
        }
    }

    // Description Handle
    let description: React.ReactNode = element.properties.description;
    const descriptionStyle: CSSProperties = element.properties.descriptionStyle || {margin: 0}
    if (element.properties.description) {
        const _description = element.properties.description
        if (typeof _description === "object") {
            description = (
                <div>
                    {_description.map((child: string, index: number) => {
                        return <div key={index} style={descriptionStyle}>{child}</div>
                    })}
                </div>
            )
        }
    }

    const icon = IconFromString(element.properties.icon);

    let cancelButtonProps: ButtonProps | undefined = undefined;
    if (element.properties.cancelButtonProps) {
        cancelButtonProps = {
            ...element.properties.cancelButtonProps,
            icon: IconFromString(element.properties.cancelButtonProps.icon)
        };
    }

    let okButtonProps: ButtonProps | undefined = undefined;
    if (element.properties.okButtonProps) {
        okButtonProps = {
            ...element.properties.okButtonProps,
            icon: IconFromString(element.properties.okButtonProps.icon)
        };
    }

    return (
        <Popconfirm
            key={element.id}
            style={{ ...element.properties }}
            {...propsFromElementProps}
            {...GetBindableProps(element.properties)}
            icon={icon}
            okButtonProps={okButtonProps}
            cancelButtonProps={cancelButtonProps}
            description={description}
        >
            {renderElements(element.children, uiName)}
        </Popconfirm>
    )
}