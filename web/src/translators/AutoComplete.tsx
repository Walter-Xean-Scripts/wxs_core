import { GetBindableProps } from "../utils/getBindableProps";
import { AutoComplete } from "antd";
import { DefaultOptionType } from "antd/es/select";

interface IAutoComplete {
    id: string;
    name: string;
    properties: any;
    children: any[];
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
]

export function AutoCompleteTranslator(element: IAutoComplete, uiName: string) {
    let propsFromElementProps: any = {};
    for (const prop of Object.keys(element.properties)) {
        if (supportedProps.includes(prop)) {
            propsFromElementProps[prop] = element.properties[prop];
        }
    }

    if (!element.properties.options) {
        console.log("AutoComplete: properties.options CAN NOT BE UNDEFINED! Source (UI NAME): " + uiName)
        return null;
    }

    const options: DefaultOptionType[] = element.properties.options

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