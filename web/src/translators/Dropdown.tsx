import { DownOutlined } from "@ant-design/icons";
import { Dropdown, MenuProps, Space } from "antd";
import { fetchNui } from "../utils/fetchNui";
import * as AIcon from '@ant-design/icons';
import { GetBindableProps } from "../utils/getBindableProps";
import React from "react";

interface IDropdown {
    id: string;
    name: string;
    properties: any;
}

const supportedProps = [
    "placement", // "topLeft" | "topCenter" | "topRight" | "bottomLeft" | "bottomCenter" | "bottomRight" | "top" | "bottom"
    "autoFocus", // boolean
    "disabled", // boolean
]

type ITrigger = ("contextMenu" | "click" | "hover")[] | undefined
type IType = "button" | undefined;
type ITriggerSubMenuAction = "hover" | "click";

export function DropdownTranslator(element: IDropdown, uiName: string) {
    let propsFromElementProps: any = {};
    for (const prop of Object.keys(element.properties)) {
        if (supportedProps.includes(prop)) {
            propsFromElementProps[prop] = element.properties[prop];
        }
    }

    if (!element.properties.items) {
        return null;
    }

    const items: MenuProps['items'] = [];
    // Todo : Support Icons
    for (let item of element.properties.items) {
        const Icon = item.icon ? (AIcon as { [key: string]: any })[item.icon] : undefined
        items.push({ ...item, icon: Icon ? <Icon /> : undefined })
    }

    const trigger: ITrigger = element.properties.trigger || "click"; // Array - ("contextMenu" | "click" | "hover")[]
    const type: IType = element.properties.type || undefined; // "button" | undefined
    const selectable: boolean = element.properties.selectable || false;
    const defaultSelectedKeys: string[] = element.properties.defaultSelectedKeys || undefined;
    const multiple: boolean = element.properties.multiple || true;
    const triggerSubMenuAction: ITriggerSubMenuAction = element.properties.triggerSubMenuAction || "hover";

    return (
        <React.Fragment key={`fragment.dropdown-${element.id}`}>
            {type == undefined && (
                <Dropdown
                    key={element.id}
                    menu={{
                        items,
                        selectable: selectable,
                        defaultSelectedKeys: defaultSelectedKeys,
                        multiple: multiple,
                        triggerSubMenuAction: triggerSubMenuAction,
                        ...GetBindableProps(element.properties.menuEvents),
                    }}
                    {...propsFromElementProps}
                    {...GetBindableProps(element.properties)}
                    trigger={trigger}
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
                    trigger={trigger}
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