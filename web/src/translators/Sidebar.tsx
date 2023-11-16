import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { CSSProperties } from "react";
import * as AIcon from '@ant-design/icons';
import { fetchNui } from '../utils/fetchNui';
import { GetBindableProps } from '../utils/getBindableProps';

type MenuItem = Required<MenuProps>['items'][number];

interface IProperties extends CSSProperties {
    defaultSelectedKeys?: string[];
    defaultOpenKeys?: string[];
    items?: any;
    mode?: "vertical" | "horizontal" | "inline";
    menuEvents?: any;
    selectable?: boolean;
    multiple?: boolean;
    triggerSubMenuAction: "hover" | "click";
}

interface ISlider {
    id: string;
    name: string;
    properties: IProperties;
}

function getItem(
    label: React.ReactNode,
    key?: React.Key | null,
    icon?: React.ReactNode,
    children?: MenuItem[],
    type?: 'group',
): MenuItem {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as MenuItem;
}

const supportedProps = [
    "defaultOpenKeys",
    "defaultSelectedKeys",
    "multiple",
    "openKeys",
    "selectable",
    "selectedKeys",
    "theme",
    "triggerSubMenuAction",

    "subMenuCloseDelay",
    "subMenuOpenDelay",
    "forceSubMenuRender",
    "inlineCollapsed",
    "inlineIndent",
]

export function SidebarTranslator(element: ISlider, uiName: string) {
    let propsFromElementProps: any = {};
    for (const prop of Object.keys(element.properties)) {
        if (supportedProps.includes(prop)) {
            propsFromElementProps[prop] = (element.properties as { [key: string]: any })[prop];
        }
    }

    const categories: string[] = [];
    const categoryIcons: string[] = [];
    const categoryIds: string[] = [];
    const foundItems: { [key: string]: any } = {};

    if (!element.properties.items) {
        return null;
    }

    for (const item of element.properties.items) {
        if (!foundItems[item.category]) {
            foundItems[item.category] = [];
        }
        foundItems[item.category].push(item);

        if (!categories.includes(item.category)) {
            categories.push(item.category);
            categoryIcons.push(item.icon);
            categoryIds.push(item.categoryId);
        }
    }

    let i = 0;
    let finializedItems: MenuProps['items'] = [];
    for (const category of categories) {
        const Icon = (AIcon as { [key: string]: any })[categoryIcons[i]];

        finializedItems.push(
            getItem(category, categoryIds[i], <Icon />, [
                ...foundItems[category].map((item: any) => getItem(item.name, item.id))
            ])
        )

        i++;
    }

    const items = finializedItems;
    
    const mode = element.properties.mode || "inline";
    
    return (
        <Menu
            key={element.id}
            style={{ height: "100%", ...element.properties }}
            mode={mode}
            items={items}
            {...propsFromElementProps}
            {...GetBindableProps(element.properties)}
        />
    )
}