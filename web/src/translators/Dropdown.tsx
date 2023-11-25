import { DownOutlined } from "@ant-design/icons";
import { Button, Dropdown, MenuProps, Space } from "antd";
import { GetBindableProps } from "../utils/getBindableProps";
import React from "react";
import { CSSProperties } from "react";
import { IconFromString } from "../utils/IconFromString";

type IDropdownType = "button" | "default";
type IButtonType = "primary" | "default" | "dashed" | "link" | "text";

interface IProperties extends CSSProperties {
    text?: string;
    items?: MenuProps['items'];
    type?: IDropdownType;
    buttonType?: IButtonType;
    buttonStyle?: CSSProperties;
    buttonProps?: any;
    placement?: "bottomLeft"|"bottom"|"bottomRight"|"topLeft"|"top"|"topRight";
    arrow?: boolean | {pointAtCenter: boolean};
    trigger?: "click"|"hover"|"contextMenu";
    loading?: boolean;
    open?: boolean;
    autoFocus?: boolean;
    disabled?: boolean;
    menu?: MenuProps;
    overlayStyle?: CSSProperties;
    
    autoAdjustOverflow?: boolean;
    destroyPopupOnHide?: boolean;
    
    // .Button:
    danger?: boolean;
    icon?: string;
    size?: "large" | "middle" | "small";
    menuButtonType?: IButtonType;

    //buttonsRender...
    //dropdownRender...
}

interface IDropdown {
    id: string;
    name: string;
    properties: IProperties;
}

const supportedProps = [
    "text",
    "items",
    "type",
    //"buttonType",
    //"buttonStyle",
    //"buttonProps",
    "placement",
    "arrow",
    "trigger",
    "loading",
    "open",
    "autoFocus",
    "disabled",
    "menu",
    "overlayStyle",
    "danger",
    "icon",
    "size",
    "menuButtonType",

    "autoAdjustOverflow",
    "destroyPopupOnHide",
]

export function DropdownTranslator(element: IDropdown, uiName: string) {
    if (!element.properties.items) {
        console.log("Dropdown: `items` was not defined.")
        return undefined;
    }

    let propsFromElementProps: any = {};
    for (const prop of Object.keys(element.properties)) {
        if (supportedProps.includes(prop)) {
            propsFromElementProps[prop] = (element.properties as { [key: string]: any })[prop];
        }
    }

    // Dropdown Type
    const type: IDropdownType = element.properties.type || "default";

    // Button Type & Style
    const buttonType: IButtonType = element.properties.buttonType || "default";
    const buttonStyle = element.properties.buttonStyle;
    const buttonProps = element.properties.buttonProps;

    // Items Handling:
    const items: MenuProps['items'] = element.properties.items;

    // Menu Props
    let fixedExtraProps: any = {}
    if (element.properties.menu) {
        if (typeof element.properties.menu.expandIcon == "string")
            fixedExtraProps["expandIcon"] = IconFromString(element.properties.menu.expandIcon)
        // More?...
    }
    const menuProps: MenuProps = {
        items: items,
        ...element.properties.menu,
        ...fixedExtraProps,
        ...GetBindableProps(element.properties.menu)
    }
    return (
        <React.Fragment key={`fragment.dropdown-${element.id}`}>
            {type == "default" && (
                <Dropdown
                    key={element.id}
                    style={{ ...element.properties }}
                    {...propsFromElementProps}
                    {...GetBindableProps(element.properties)}
                    menu={menuProps}
                >
                    <Button
                        key={"dropdown-button-" + element.id}
                        style={{ ...buttonStyle }}
                        type={buttonType}
                        {...buttonProps}
                        {...GetBindableProps(element.properties.buttonProps)}
                    >
                        <Space>
                            {element.properties.text}
                            <DownOutlined />
                        </Space>
                    </Button>
                </Dropdown>
            )}
            {type == "button" && (
                <Dropdown.Button
                    key={element.id}
                    style={{ ...element.properties }}
                    {...propsFromElementProps}
                    {...GetBindableProps(element.properties)}
                    menu={menuProps}
                    icon={IconFromString(element.properties.icon)}
                    type={element.properties.menuButtonType}
                >
                    {element.properties.text}
                </Dropdown.Button>
            )}
        </React.Fragment>
    
    )
}