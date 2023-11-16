import { DownOutlined } from "@ant-design/icons";
import { Dropdown, MenuProps, Space } from "antd";
import { fetchNui } from "../utils/fetchNui";
import * as AIcon from '@ant-design/icons';
import { GetBindableProps } from "../utils/getBindableProps";
import { CSSProperties } from "react";
import { ItemType } from "antd/es/menu/hooks/useItems";

interface IProperties extends CSSProperties {
    text?: string;
    trigger?: ITrigger;
    type?: IType;
    selectable?: boolean;
    defaultSelectedKeys?: string[];
    multiple?: boolean;
    triggerSubMenuAction?: ITriggerSubMenuAction;
    menuEvents?: any;
    items?: any;
}

interface IDropdown {
    id: string;
    name: string;
    properties: IProperties;
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
            propsFromElementProps[prop] = (element.properties as { [key: string]: any })[prop];
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

    const trigger = element.properties.trigger || "click"; // Array - ("contextMenu" | "click" | "hover")[]
    const type: IType = element.properties.type || undefined; // "button" | undefined
    const selectable = element.properties.selectable || false;
    const defaultSelectedKeys = element.properties.defaultSelectedKeys || undefined;
    const multiple = element.properties.multiple || true;
    const triggerSubMenuAction = element.properties.triggerSubMenuAction || "hover";

    return (
        <>
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
        </>
    )
}