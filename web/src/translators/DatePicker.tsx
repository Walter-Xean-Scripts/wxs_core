import { GetBindableProps } from "../utils/getBindableProps";
import { DatePicker, Divider } from "antd";
import React, { CSSProperties } from "react";
import { renderElements } from "../utils/renderElement";
import { IconFromString } from "../utils/IconFromString";
import { StepForwardOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import Icon from "@ant-design/icons/lib/components/Icon";

interface IProperties extends CSSProperties {
    defaultValue?: string | string[];
    showNow?: boolean;
    showTime?: boolean;
    showToday?: boolean;
    value?: any;
    rangePicker?: boolean;

    allowClear?: boolean;
    autoFocus?: boolean;
    bordered?: boolean;
    changeOnBlur?: boolean;
    disabled?: boolean;
    mode?: "time" | "date" | "month" | "year" | "decade";
    open?: boolean;
    picker?: "date" | "week" | "month" | "quarter" | "year";
    placeholder?: string | string[];
    placement?: "bottomLeft" | "bottomRight" | "topLeft" | "topRight";
    nextIcon?: string; //React.ReactNode;
    prevIcon?: string; //React.ReactNode;
    size?: "large" | "middle" | "small";
    status?: "error" | "warning";
    suffixIcon?: string; //React.ReactNode;
    superNextIcon?: string; //React.ReactNode;
    superPrevIcon?: string; //React.ReactNode;
    format?: string; //

    seperator?: string; //React.ReactNode

    //style?: CSSProperties;
    popupStyle?: CSSProperties;
    
    presets?: any[];
    disabledDate?: any; //?
}

interface IDatePicker {
    id: string;
    name: string;
    properties: IProperties;
    children: IFoactElement[];
}

const supportedProps = [
    //"defaultValue",
    "disabledTime",
    //"renderExtraFooter",
    "showNow",
    "showTime",
    "showTime",
    "showToday",
    "value",
    "onChange",
    "onOk",
    "onPanelChange",

    "allowClear",
    "autoFocus",
    "bordered",
    //"className",
    //"dateRender",
    "changeOnBlur",
    //"cellRender",
    "disabled",
    "disabledDate",
    //"format",
    //"popupClassName",
    //"getPopupContainer",
    //"inputReadOnly",
    "locale",
    "mode",
    "open",
    //"panelRender",
    "picker",
    "placeholder",
    "placement",
    "popupStyle",
    "presets",
    "size",
    "status",
    //"style",
    //"onOpenChange",
    //"onPanelChange",

    "allowEmpty",
    //"dateRender",
    //"cellRender",
    //"renderExtraFooter",
    "separator", // ?
    //"onCalendarChange",

]

export function DatePickerTranslator(element: IDatePicker, uiName: string) {
    let propsFromElementProps: any = {};
    for (const prop of Object.keys(element.properties)) {
        if (supportedProps.includes(prop)) {
            propsFromElementProps[prop] = (element.properties as { [key: string]: any })[prop];
        }
    }
    
    let format = element.properties.format || "DD-MM-YYYY";
    if (element.properties.showTime) element.properties.format = format + " HH:mm:ss";

    let defaultValue: Dayjs | Dayjs[] | undefined;
    if (element.properties.defaultValue) {
        if (Array.isArray(element.properties.defaultValue)) {
            defaultValue = element.properties.defaultValue.map((value: string) => dayjs(value, format));
        } else {
            defaultValue = dayjs(element.properties.defaultValue, format);
        }
    }

    const nextIcon = IconFromString(element.properties.nextIcon);
    const prevIcon = IconFromString(element.properties.prevIcon);
    const suffixIcon = IconFromString(element.properties.suffixIcon);
    const superNextIcon = IconFromString(element.properties.superNextIcon);
    const superPrevIcon = IconFromString(element.properties.superPrevIcon);

    const rangePicker: boolean = element.properties.rangePicker || false;

    const { RangePicker } = DatePicker
    return (
        <React.Fragment key={`fragment.datepicker-${element.id}`}>
            {!rangePicker && (
                <DatePicker
                    key={element.id}
                    style={{ ...element.properties }}
                    {...propsFromElementProps}
                    {...GetBindableProps(element.properties)}
                    defaultValue={defaultValue}
                    format={format}
                    nextIcon={nextIcon}
                    prevIcon={prevIcon}
                    superNextIcon={superNextIcon}
                    superPrevIcon={superPrevIcon}
                    suffixIcon={suffixIcon}
                    popupStyle={{ ...element.properties.popupStyle }}
                />
            )}
            {rangePicker && (
                <RangePicker
                    key={element.id}
                    style={{ ...element.properties }}
                    {...propsFromElementProps}
                    {...GetBindableProps(element.properties)}
                    defaultValue={defaultValue}
                    format={format}
                    nextIcon={nextIcon}
                    prevIcon={prevIcon}
                    superNextIcon={superNextIcon}
                    superPrevIcon={superPrevIcon}
                    popupStyle={{ ...element.properties.popupStyle }}
                    separator={IconFromString(element.properties.seperator)}
                />
            )}
        </React.Fragment>
    )
}