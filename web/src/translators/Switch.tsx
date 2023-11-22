import React, { CSSProperties } from "react";
import { Switch } from "antd";
import { GetBindableProps } from "../utils/getBindableProps";
import { IconFromString } from "../utils/IconFromString";
import { StepForwardOutlined } from "@ant-design/icons";

interface IProperties extends CSSProperties {
    autoFocus?: boolean;
    checked?: boolean;
    checkedChildren?: any //?
    defaultChecked?: boolean;
    disabled?: boolean;
    loading?: boolean;
    size?: "small" | "default";
    unCheckedChildren?: any //?
}

interface IModal {
    id: string;
    name: string;
    properties: IProperties;
    children: IFoactElement[];
}

const supportedProps = [
    "autoFocus",
    "checked",
    "checkedChildren",
    "defaultChecked",
    "disabled",
    "loading",
    "size",
    "unCheckedChildren",

    "handleBg",
    "handleShadow",
    "handleSize",
    "handleSizeSM",
    "innerMaxMargin",
    "innerMaxMarginSM",
    "innerMinMargin",
    "innerMinMarginSM",
    "trackHeight",
    "trackHeightSM",
    "trackMinWidth",
    "trackMinWidthSM",
    "trackPadding",
]

function handleCheckedChildren(data: any) {
    if (!data) return undefined;
    if (typeof data === "string") {
        return data;
    }
    if (typeof data === "object") {
        return IconFromString(data.icon);
    }
}

export function SwitchTranslator(element: IModal, uiName: string) {
    let propsFromElementProps: any = {};
    for (const prop of Object.keys(element.properties)) {
        if (supportedProps.includes(prop)) {
            propsFromElementProps[prop] = (element.properties as { [key: string]: any })[prop];
        }
    }

    const checkedChildren = handleCheckedChildren(element.properties.checkedChildren);
    const unCheckedChildren = handleCheckedChildren(element.properties.unCheckedChildren);

    return (
        <Switch
            key={element.id}
            style={{ ...element.properties }}
            {...propsFromElementProps}
            {...GetBindableProps(element.properties)}
            checkedChildren={checkedChildren}
            unCheckedChildren={unCheckedChildren}
        />
    )
}