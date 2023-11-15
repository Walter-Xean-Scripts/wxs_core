import type { MenuProps } from 'antd';
import { Menu } from 'antd';
import { useEffect, useState } from "react";
import * as AIcon from '@ant-design/icons';
import { fetchNui } from '../utils/fetchNui';
import { GetBindableProps } from '../utils/getBindableProps';

type MenuItem = Required<MenuProps>['items'][number];

interface ISlider {
    id: string;
    name: string;
    properties: any;
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

export function SidebarTranslator(element: ISlider, uiName: string) {
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

    const onClick: MenuProps['onClick'] = (e) => {
        fetchNui("SidebarClick", { sId: e.key, id: element.id, name: uiName })
    };

    return (
        <Menu
            key={element.id}
            onClick={onClick}
            style={{ height: "100%", ...element.properties }}
            defaultSelectedKeys={element.properties.defaultSelectedKeys}
            defaultOpenKeys={element.properties.defaultOpenKeys}
            mode="inline"
            items={items}
            {...GetBindableProps(element.properties)}
        />
    )
}