import { Slider } from "antd";
import { fetchNui } from "../utils/fetchNui";
import { TooltipPlacement } from "antd/es/tooltip";
import { GetBindableProps } from "../utils/getBindableProps";

interface ISlider {
    id: string;
    name: string;
    properties: any;
}

const supportedProps = [
    "min",
    "max",
    "defaultValue",
    "disabled",
    "step",
    "vertical",
    "autoFocus",
    "keyboard",
    "dots",
    "range",
    "reverse",
]

export function SliderTranslator(element: ISlider, uiName: string) {
    let propsFromElementProps: any = {};
    for (const prop of Object.keys(element.properties)) {
        if (supportedProps.includes(prop)) {
            propsFromElementProps[prop] = element.properties[prop];
        }
    }

    const tooltipOpen: boolean = (element.properties.tooltipOpen !== undefined) ? element.properties.tooltipOpen : undefined
    const tooltipPlacement: TooltipPlacement = element.properties.tooltipPlacement || "top"

    return (
        <Slider
            key={element.id}
            style={{ ...element.properties }}
            {...propsFromElementProps}
            onChange={(value) => { fetchNui("SliderChange", { id: element.id, name: uiName, value: value }) }}
            onAfterChange={(value) => { fetchNui("SliderAfterChange", { id: element.id, name: uiName, value: value }) }}

            tooltip={{
                open: tooltipOpen,
                placement: tooltipPlacement,
            }}
            {...GetBindableProps(element.properties)}
        />
    )
}