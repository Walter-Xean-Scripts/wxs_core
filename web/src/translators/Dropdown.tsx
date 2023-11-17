import { DownOutlined } from "@ant-design/icons";
import { Dropdown, MenuProps, Space } from "antd";
import * as AIcon from '@ant-design/icons';
import { GetBindableProps } from "../utils/getBindableProps";
import React from "react";
import { CSSProperties } from "react";
import { IconFromString } from "../utils/getIcon";

type IType = "button" | undefined;

interface IProperties extends CSSProperties {
    text?: string;
    trigger?: "hover" | "click" | "contextMenu";
    type?: IType;
    selectable?: boolean;
    defaultSelectedKeys?: string[];
    multiple?: boolean;
    triggerSubMenuAction?: "hover" | "click";
    menuEvents?: any;
    items?: any;
    placement?: "topLeft" | "topCenter" | "topRight" | "bottomLeft" | "bottomCenter" | "bottomRight" | "top" | "bottom";
    autoFocus?: boolean;
    disabled?: boolean;
    arrow?: boolean | { pointAtCenter?: boolean | undefined; };
    autoAdjustOverflow?: any;
    menu?: any;
    overlayStyle?: CSSProperties;
    icon?: string;
}

interface IDropdown {
    id: string;
    name: string;
    properties: IProperties;
}

const supportedProps = [
    "placement",
    "autoFocus",
    "disabled",
    "trigger",
    "arrow",
    "open",
    "laoding",
    "danger",
    "type",

    "autoAdjustOverflow",
    "menu",
    "overlayStyle",
]

export function DropdownTranslator(element: IDropdown, uiName: string) {
    if (!element.properties.items) return null;

    let propsFromElementProps: any = {};
    for (const prop of Object.keys(element.properties)) {
        if (supportedProps.includes(prop)) {
            propsFromElementProps[prop] = (element.properties as { [key: string]: any })[prop];
        }
    }

    const items: MenuProps['items'] = [];
    for (let item of element.properties.items) {
        const Icon = item.icon ? (AIcon as { [key: string]: any })[item.icon] : undefined
        items.push({ ...item, icon: Icon ? <Icon /> : undefined })
    }

    const type: IType = element.properties.type || undefined; // "button" | undefined
    
    const selectable = element.properties.selectable || false;
    const defaultSelectedKeys = element.properties.defaultSelectedKeys || undefined;
    const multiple = element.properties.multiple || true;
    const triggerSubMenuAction = element.properties.triggerSubMenuAction || "hover";

    let overlayStyle: CSSProperties | undefined;
    if (element.properties.overlayStyle) overlayStyle = element.properties.overlayStyle;

    const icon = element.properties.icon ? IconFromString(element.properties.icon) : undefined;

    return (
        <React.Fragment key={`fragment.dropdown-${element.id}`}>
            {!type && (
                <Dropdown
                    key={element.id}
                    menu={{
                        items,
                        multiple: multiple,
                        selectable: selectable,
                        defaultSelectedKeys: defaultSelectedKeys,
                        triggerSubMenuAction: triggerSubMenuAction,
                        ...GetBindableProps(element.properties.menuEvents),
                    }}
                    {...propsFromElementProps}
                    {...GetBindableProps(element.properties)}
                    overlayStyle={overlayStyle}
                >
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            {element.properties.text}
                            <DownOutlined />
                        </Space>
                    </a>
                </Dropdown>
            )}

            {type == "button" && (
                <Dropdown.Button
                    key={element.id}
                    menu={{
                        items,
                        selectable: selectable,
                        defaultSelectedKeys: defaultSelectedKeys,
                        multiple: multiple,
                        triggerSubMenuAction: triggerSubMenuAction,
                        ...GetBindableProps(element.properties)
                    }}
                    {...propsFromElementProps}
                    {...GetBindableProps(element.properties)}
                    overlayStyle={overlayStyle}
                    icon={icon}
                >
                    <a onClick={(e) => e.preventDefault()}>
                        <Space>
                            {element.properties.text}
                        </Space>
                    </a>
                </Dropdown.Button>
            )}
        </React.Fragment>
    )
}