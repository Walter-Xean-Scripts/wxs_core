import { createStore } from 'redux';

const initialState: IDefaultState = {
    currentlyDisplaying: "",
    uiList: {}
}

const updateId = (data: any[], id: string, key: any, value: any): any => {
    const newData = [...data];
    for (const element of newData) {
        if (element.id === id) {
            newData[newData.indexOf(element)].properties[key] = value;
            return newData;
        }

        if (element.children) {
            const result = updateId(element.children, id, key, value);
            if (result) {
                newData[newData.indexOf(element)].children = result;
                return newData;
            }
        }
    }

    return false;
}

const updateChildrenById = (data: any[], id: string, children: any): any => {
    const newData = [...data];
    for (const element of newData) {
        if (element.id === id) {
            newData[newData.indexOf(element)].children = children;
            return newData;
        }

        if (element.children && element.children.length > 0) {
            const result = updateChildrenById(element.children, id, children);
            if (result) {
                newData[newData.indexOf(element)].children = result;
                return newData;
            }
        }
    }

    return false;
}

const uiReducer = (state = initialState, action: { type: string, payload: any }) => {
    switch (action.type) {
        case "SET_CURRENTLY_DISPLAYING":
            return {
                ...state,
                currentlyDisplaying: action.payload
            }
        case "ADD_TO_UI_LIST":
            return {
                ...state,
                uiList: {
                    ...state.uiList,
                    [action.payload.name]: JSON.parse(action.payload.data)
                }
            }
        case "UPDATE_UI_BY_ID":
            const uiData = state.uiList[action.payload.name];
            if (uiData.id == action.payload.id) {
                return {
                    ...state,
                    uiList: {
                        ...state.uiList,
                        [action.payload.name]: {
                            ...uiData,
                            properties: {
                                ...uiData.properties,
                                [action.payload.key]: action.payload.value
                            }
                        }
                    }
                }
            }

            const newData = updateId(uiData.children, action.payload.id, action.payload.key, action.payload.value);
            if (!newData) return state;

            return {
                ...state,
                uiList: {
                    ...state.uiList,
                    [action.payload.name]: {
                        ...uiData,
                        children: newData
                    }
                }
            }
        case "UPDATE_UI_CHILDREN_BY_ID":
            const uiData2 = state.uiList[action.payload.name];
            if (uiData2.id == action.payload.id) {
                return {
                    ...state,
                    uiList: {
                        ...state.uiList,
                        [action.payload.name]: {
                            ...uiData2,
                            children: JSON.parse(action.payload.children)
                        }
                    }
                }
            }

            const newData2 = updateChildrenById(uiData2.children, action.payload.id, JSON.parse(action.payload.children));
            if (!newData2) return state;

            return {
                ...state,
                uiList: {
                    ...state.uiList,
                    [action.payload.name]: {
                        ...uiData2,
                        children: newData2
                    }
                }
            }
        default:
            return state
    }
}

const uiStore = createStore(uiReducer);
export default uiStore;