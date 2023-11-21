import React, { CSSProperties } from "react";
import { Table } from "antd";
import { GetBindableProps } from "../utils/getBindableProps";
import { IconFromString } from "../utils/IconFromString";
import type { ColumnsType } from 'antd/es/table';

interface IProperties extends CSSProperties {
    columns?: any;
    data?: any;
    rowSelection?: any;
    type?: "checkbox" | "radio";

    bordered?: boolean;
    components?: any;
    expandable?: any;
    loading?: boolean | any;
    locale?: any;
    pagination?: any;
    rowKey?: any;
    scroll?: any;
    showHeader?: boolean;
    showSorterTooltip?: boolean;
    size?: "large" | "middle" | "small";
    sortDirections?: any;
    sticky?: any;
    tableLayout?: any;
    virtual?: boolean;
}

interface IModal {
    id: string;
    name: string;
    properties: IProperties;
    children: IFoactElement[];
}

const supportedProps = [
    "type",
    "bordered",
    "components",
    "expandable",
    "loading",
    "locale",
    "pagination",
    "rowKey",
    "scroll",
    "showHeader",
    "showSorterTooltip",
    "size",
    "sortDirections",
    "sticky",
    "tableLayout",
    "virtual",
]

export function TableTranslator(element: IModal, uiName: string) {
    let propsFromElementProps: any = {};
    for (const prop of Object.keys(element.properties)) {
        if (supportedProps.includes(prop)) {
            propsFromElementProps[prop] = (element.properties as { [key: string]: any })[prop];
        }
    }
    
    const columns: ColumnsType = element.properties.columns;
    const data = element.properties.data;

    return (
        <Table
            key={element.id}
            style={{ ...element.properties }}
            {...propsFromElementProps}
            {...GetBindableProps(element.properties)}
            columns={columns}
            dataSource={data}
            rowSelection={{
                type: element.properties.type,
                selectedRowKeys: element.properties.rowSelection?.selectedRowKeys,
                ...GetBindableProps(element.properties.rowSelection)
            }}
        />
    )
}