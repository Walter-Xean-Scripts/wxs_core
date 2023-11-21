import React, { CSSProperties } from "react";
import { Spin, Tooltip } from "antd";
import { GetBindableProps } from "../utils/getBindableProps";
import { renderElements } from "../utils/renderElement";
import { IconFromString } from "../utils/IconFromString";
import { TooltipPlacement } from "antd/es/tooltip";

interface IProperties extends CSSProperties {
    title?: string;
    align?: any;
    arrow?: boolean | {pointAtCenter: boolean};
    autoAdjustOverflow?: boolean;
    color?: string;
    defaultOpen?: boolean;
    destroyTooltipOnHide?: boolean;
    fresh?: boolean;
    mouseEnterDelay?: number;
    mouseLeaveDelay?: number;
    overlayStyle?: CSSProperties;
    overlayInnerStyle?: CSSProperties;
    placement?: TooltipPlacement;
    trigger?: "hover" | "focus" | "click" | "contextMenu" ;
    open?: boolean;
}

interface ITooltip {
    id: string;
    name: string;
    properties: IProperties;
    children: IFoactElement[];
}

const supportedProps = [
    "title",

    "align",
    "arrow",
    "autoAdjustOverflow", //
    "color",
    "defaultOpen",
    "destroyTooltipOnHide", //
    "fresh",
    "mouseEnterDelay",
    "mouseLeaveDelay",
    "overlayStyle",
    "overlayInnerStyle",
    "placement",
    "trigger",
    "open",
    "zIndex",
    "zIndexPopup",
]

export function TooltipTranslator(element: ITooltip, uiName: string) {
    let propsFromElementProps: any = {};
    for (const prop of Object.keys(element.properties)) {
        if (supportedProps.includes(prop)) {
            propsFromElementProps[prop] = (element.properties as { [key: string]: any })[prop];
        }
    }

    return (
        <Tooltip
            key={element.id}
            style={{ ...element.properties }}
            {...propsFromElementProps}
            {...GetBindableProps(element.properties)}
            overlayStyle={{...element.properties.overlayStyle}}
            overlayInnerStyle={{...element.properties.overlayInnerStyle}}
        >
            {renderElements(element.children, uiName)}
        </Tooltip>
    )
}