import { CSSProperties } from "react";
import { GetBindableProps } from "../utils/getBindableProps";
import { renderElements } from "../utils/renderElement";


interface IBox {
    id: string;
    name: string;
    properties: CSSProperties;
    children: IFoactElement[];
}

export function BoxTranslator(element: IBox, uiName: string) {
    return (
        <div
            key={element.id}
            style={{ ...element.properties }}
            {...GetBindableProps(element.properties)}
        >
            {renderElements(element.children, uiName)}
        </div>
    )
}