import { GetBindableProps } from "../utils/getBindableProps";
import { renderElements } from "../utils/renderElement";

interface IImage {
    id: string;
    name: string;
    properties: any;
    children: any[];
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