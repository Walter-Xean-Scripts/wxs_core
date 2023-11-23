import React, { CSSProperties } from "react";
import * as AIcon from "@ant-design/icons";
import { IconFromString } from "../utils/IconFromString";
import { GetBindableProps } from "../utils/getBindableProps";

interface IProperties extends CSSProperties {
    icon?: string;
    spin?: boolean;
    rotate?: number | any;
    twoToneColor?: string;
}

interface IIcon {
    id: string;
    name: string;
    properties: IProperties;
    children: IFoactElement[];
}

const supportedProps = [
    "spin",
    "rotate",
]

export function IconTranslator(element: IIcon, uiName: string) {
    let propsFromElementProps: any = {};
    for (const prop of Object.keys(element.properties)) {
        if (supportedProps.includes(prop)) {
            propsFromElementProps[prop] = (element.properties as { [key: string]: any })[prop];
        }
    }

    if (!element.properties.icon) return undefined;
    const _Icon = element.properties.icon ? (AIcon as { [key: string]: any })[element.properties.icon] : undefined;
    const Icon = _Icon ? (
        <_Icon
            key={element.id}
            style={{...element.properties}}
            {...propsFromElementProps}
            {...GetBindableProps(element.properties)}
        />) : undefined;

    return (
        <React.Fragment key={`fragment.icon-${element.id}`}>
            {Icon}
        </React.Fragment>
    )
}