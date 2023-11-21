import React, { CSSProperties } from "react";
import { Modal } from "antd";
import { GetBindableProps } from "../utils/getBindableProps";
import { renderElements } from "../utils/renderElement";
import { IconFromString } from "../utils/IconFromString";

interface IProperties extends CSSProperties {
    title?: string;
    open?: boolean;
    styles?: {header?: CSSProperties, body?: CSSProperties, footer?: CSSProperties, mask?: CSSProperties};
    cancelButtonProps?: any;
    cancelText?: string;
    centered?: boolean;
    closeIcon?: boolean | string;
    confirmLoading?: boolean;
    destroyOnClose?: boolean;
    focusTriggerAfterClose?: boolean;
    //footer?: React.ReactNode;
    forceRender?: boolean;
    keyboard?: boolean;
    mask?: any; // boolean
    maskClosable?: boolean;
    okButtonProps?: any;
    okText?: string;
    okType?: string;
    width?: string | number;
    zIndex?: number;
    autoFocusButton?: null | "ok" | "cancel";
    content?: any;
    footer?: any;
    icon?: string;
}

interface IModal {
    id: string;
    name: string;
    properties: IProperties;
    children: IFoactElement[];
}

const supportedProps = [
    "title",
    "open",
    "cancelButtonProps",
    "cancelText",
    "centered",
    "closeIcon",
    "confirmLoading",
    "destroyOnClose",
    "focusTriggerAfterClose",
    "forceRender",
    "keyboard",
    "mask",
    "maskClosable",
    "okButtonProps",
    "okText",
    "okType",
    "width",
    "zIndex",
    "autoFocusButton",
    "content",
    "footer",
    "icon",
]

export function ModalTranslator(element: IModal, uiName: string) {
    let propsFromElementProps: any = {};
    for (const prop of Object.keys(element.properties)) {
        if (supportedProps.includes(prop)) {
            propsFromElementProps[prop] = (element.properties as { [key: string]: any })[prop];
        }
    }

    const styles = element.properties.styles;
    const closeIcon = typeof element.properties.closeIcon === "string" ? IconFromString(element.properties.closeIcon) : element.properties.closeIcon;
    const icon = IconFromString(element.properties.icon);

    return (
        <Modal
            key={element.id}
            style={{ ...element.properties }}
            {...propsFromElementProps}
            {...GetBindableProps(element.properties)}
            styles={styles}
            closeIcon={closeIcon}
            icon={icon}
        >
            {renderElements(element.children, uiName)}
        </Modal>
    )
}