import { BoxTranslator } from "../translators/Box"
import { ButtonTranslator } from "../translators/Button";
import { SidebarTranslator } from "../translators/Sidebar";
import { DividerTranslator } from "../translators/Divider";
import { FlexTranslator } from "../translators/Flex";
import { SliderTranslator } from "../translators/Slider";
import { TextTranslator } from "../translators/Text";
import { TitleTranslator } from "../translators/Title";
import { ParagraphTranslator } from "../translators/Paragraph";
import { SpaceTranslator } from "../translators/Space";
import { DropdownTranslator } from "../translators/Dropdown";
import { ImageTranslator } from "../translators/Image";
import { AutoCompleteTranslator } from "../translators/AutoComplete";
import { CheckboxTranslator } from "../translators/Checkbox";

export function renderElements(elements: any, uiName: string) {
    if (!elements) return;

    const result = [];
    for (const elem of elements) {
        switch (elem.name) {
            case "Box":
                result.push(BoxTranslator(elem, uiName));
                break;
            case "Image":
                result.push(ImageTranslator(elem, uiName));
                break;
            case "Button":
                result.push(ButtonTranslator(elem, uiName));
                break;
            case "Slider":
                result.push(SliderTranslator(elem, uiName))
                break;
            case "Divider":
                result.push(DividerTranslator(elem, uiName))
                break;
            case "Sidebar":
                result.push(SidebarTranslator(elem, uiName))
                break;
            case "Text":
                result.push(TextTranslator(elem, uiName))
                break;
            case "Title":
                result.push(TitleTranslator(elem, uiName))
                break;
            case "Paragraph":
                result.push(ParagraphTranslator(elem, uiName))
                break;
            case "Flex":
                result.push(FlexTranslator(elem, uiName))
                break;
            case "Space":
                result.push(SpaceTranslator(elem, uiName))
                break;
            case "Dropdown":
                result.push(DropdownTranslator(elem, uiName))
                break;
            case "AutoComplete":
                result.push(AutoCompleteTranslator(elem, uiName))
                break;
            case "Checkbox":
                result.push(CheckboxTranslator(elem, uiName))
                break;
        }
    }

    return result;
}