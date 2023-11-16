import { CSSProperties } from "react";
import { GetBindableProps } from "../utils/getBindableProps";
import { renderElements } from "../utils/renderElement";

interface IProperties extends CSSProperties {
    src?: string;
}

interface IImage {
    id: string;
    name: string;
    properties: IProperties;
    children: IFoactElement[];
}

export function ImageTranslator(element: IImage, uiName: string) {
    return (
        <img
            key={element.id}
            src={element.properties.src}
            style={{ ...element.properties }}
            {...GetBindableProps(element.properties)}
        />
    )
}