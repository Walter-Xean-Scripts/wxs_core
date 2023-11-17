import React from "react";
import * as AIcon from "@ant-design/icons";

export function IconFromString(input: string): React.ReactNode | undefined {
    if (!input) return undefined;
    const Icon = input ? (AIcon as { [key: string]: any })[input] : undefined;
    return Icon ? <Icon/> : undefined;
}