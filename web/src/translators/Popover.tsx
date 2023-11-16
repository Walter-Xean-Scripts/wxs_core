import { GetBindableProps } from "../utils/getBindableProps";
import { Popover } from "antd";
import React, { CSSProperties } from "react";
import { renderElements } from "../utils/renderElement";
import { TooltipPlacement } from "antd/es/tooltip";

type IArrow = boolean | {pointAtCenter?: boolean | undefined;} | undefined;

interface IProperties extends CSSProperties {
    title?: string;
    content?: any;
    contentStyle?: any;
    placement?: TooltipPlacement;
    arrow?: IArrow;
    open?: boolean;
    trigger: "hover" | "focus" | "click";
}

interface IPopover {
    id: string;
    name: string;
    properties: IProperties;
    children: IFoactElement[];
}

const supportedProps = [
    "trigger",
    "title",
    "placement",
    "open",
    "defaultOpen",

    // Tooltip API https://ant.design/components/tooltip#api
    "align",
    //"arrow",
    "autoAdjustOverflow",
    "color",
    "destroyTooltipOnHide",
    "fresh",
    "getPopupContainer",
    "mouseEnterDelay",
    "mouseLeaveDelay",
    "overlayClassName",
    "overlayStyle",
    "overlayInnerStyle",
    "zIndex",

    // content
    // contentStyle
    // arrow  `true`, `false`, `undefined`
]

export function PopoverTranslator(element: IPopover, uiName: string) {
    let propsFromElementProps: any = {};
    for (const prop of Object.keys(element.properties)) {
        if (supportedProps.includes(prop)) {
            propsFromElementProps[prop] = (element.properties as { [key: string]: any })[prop];
        }
    }

    let arrow: IArrow = element.properties.arrow;

    let content: React.ReactNode | undefined;
    const contentStyle: CSSProperties = element.properties.contentStyle || {margin: 0};
    if (element.properties.content) {
        content = (
            <div>
                {element.properties.content.map((child: string, index: number) => {
                    return <div key={index} style={contentStyle}>{child}</div>
                })}
            </div>
        )
    }
    
    return (
        <Popover
            key={element.id}
            style={{ ...element.properties }}
            {...propsFromElementProps}
            {...GetBindableProps(element.properties)}
            arrow={arrow}
            content={content}
        >
            {renderElements(element.children, uiName)}
        </Popover>
    )
}