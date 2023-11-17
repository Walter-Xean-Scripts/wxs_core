import { GetBindableProps } from "../utils/getBindableProps";
import { AutoComplete } from "antd";
import { DefaultOptionType } from "antd/es/select";
import { CSSProperties } from "react";

interface IProperties extends CSSProperties {
    options: DefaultOptionType[];
    placeholder?: string;
    allowClear?: boolean;
    autoFocus?: boolean;
    backfill?: boolean;
    bordered?: boolean;
    defaultActiveFirstOption?: boolean;
    defaultOpen?: boolean;
    defaultValue?: string;
    disabled?: boolean;
    notFoundContent?: string;
    status?: 'error' | 'warning';
}

interface IAutoComplete {
    id: string;
    name: string;
    properties: IProperties;
    children: IFoactElement[];
}

const supportedProps = [
    "placeholder", // string
    "allowClear", // boolean
    "autoFocus", // boolean
    "backfill", // boolean
    "bordered", // boolean
    "defaultActiveFirstOption", // boolean
    "defaultOpen",  // boolean
    "defaultValue", // sring
    "disabled", // boolean
    "notFoundContent", // string
    "status", // 'error' | 'warning'

    "clearBg",
    "multipleItemBg",
    "multipleItemBorderColor",
    "multipleItemBorderColorDisabled",
    "multipleItemColorDisabled",
    "multipleItemHeight",
    "multipleItemHeightLG",
    "multipleSelectorBgDisabled",
    "optionActiveBg",
    "optionFontSize",
    "optionHeight",
    "optionLineHeight",
    "optionPadding",
    "optionSelectedBg",
    "optionSelectedColor",
    "optionSelectedFontWeight",
    "selectorBg",
    "singleItemHeightLG",
    "zIndexPopup",
]

export function AutoCompleteTranslator(element: IAutoComplete, uiName: string) {
    let propsFromElementProps: any = {};
    for (const prop of Object.keys(element.properties)) {
        if (supportedProps.includes(prop)) {
            propsFromElementProps[prop] = (element.properties as { [key: string]: any })[prop];
        }
    }

    if (!element.properties.options) {
        console.log("AutoComplete: properties.options CAN NOT BE UNDEFINED! Source (UI NAME): " + uiName)
        return null;
    }

    const options = element.properties.options

    const filterOption = (inputValue: string, option: DefaultOptionType): boolean => {
        return (option.value as string).toUpperCase().indexOf(inputValue.toUpperCase()) !== -1;
    };

    return (
        <AutoComplete
            key={element.id}
            style={{ ...element.properties }}
            {...propsFromElementProps}
            {...GetBindableProps(element.properties)}
            options={options}
            filterOption={filterOption}
        />
    )
}