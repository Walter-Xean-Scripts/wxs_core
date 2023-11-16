interface IFoactElement {
    id: string;
    name: string;
    properties: any;
    children: IFoactElement[];
}

interface ILoadUIData {
    name: string;
    data: IFoactElement[];
}

interface IDefaultState {
    currentlyDisplaying: string;
    uiList: {
        [key: string]: IFoactElement
    }
}

interface IUpdatePropertiesEvent {
    name: string;
    key: string;
    value: any;
}

interface IUpdateChildrenEvent {
    name: string;
    children: string; // this is json encoded IFoactElement[]
}