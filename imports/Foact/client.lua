---@class Foact
---@field uiName string?
---@field elements table?
local Foact = {}

--[[
    Until we find a better place to store these, they're here.
]]
---@class FoactElements
local elementsList = {
    "Box",
    "Paragraph",
    "Heading1",
    "Heading2",
    "Heading3",
    "Heading4",

    "Button",
    "FloatButton",
    "Icon",
    "Typography",

    "Divider",
    "Flex",
    "Grid",
    "Space",
    "Dropdown",
}

-- Which elements should be treated as images, and have their src property replaced with an image path
local imageReplacers = {
    ["src"] = true,
    ["backgroundImage"] = true
}

local functionReferences = {}
local function saveFunctionReferences(uiName, id, properties)
    for key, value in pairs(properties) do
        if type(value) == "function" then
            if not functionReferences[uiName] then
                functionReferences[uiName] = {}
            end
            if not functionReferences[uiName][id] then
                functionReferences[uiName][id] = {}
            end
            if not functionReferences[uiName][id][key] then
                functionReferences[uiName][id][key] = {}
            end

            local newKey = math.random(100000, 999999)
            while functionReferences["fnRef_" .. newKey] do
                newKey = math.random(100000, 999999)
            end

            functionReferences["fnRef_" .. newKey] = {
                uiName = uiName,
                id = id,
                func = value
            }
            properties[key] = "fnRef_" .. newKey
        elseif type(value) == "table" then
            saveFunctionReferences(uiName, id, value)
        end
    end
end

AddEventHandler("Foact:CallFnRef", function(fnRefName, ...)
    local ref = functionReferences[fnRefName]
    if ref then
        ref.func(ref.id, ref.uiName, ...)
    end
end)

--- Since we're going to need some kind of identifier, in-case that a single resource creates more than 1 UI, we're going to have to
--- make a new function, that users will then call to create a new UI object they can then create components upon.
---@param uiName string
---@return Foact
function Foact.new(uiName)
    local self = setmetatable({
        elements = {}
    }, {
        __index = function(tbl, key)
            if key == "uiName" then
                return uiName
            elseif key == "elements" then
                return tbl.elements
            else
                return Foact[key]
            end
        end
    })

    return self
end

local function isUrl(string)
    return string:find("http") ~= nil
end

local function formatForUI(object)
    local formattedChildren = {}
    if not object then return end

    if object.children then
        for _, child in ipairs(object.children) do
            local newChild = formatForUI(child)
            if newChild then
                table.insert(formattedChildren, newChild)
            end
        end
    end

    if object.properties then
        for key, value in pairs(object.properties) do
            if imageReplacers[key] and not isUrl(value) then
                object.properties[key] = "https://cfx-nui-" .. GetCurrentResourceName() .. "/images/" .. value
            end
        end
    end

    return {
        id = object.id,
        name = object.name,
        properties = object.properties,
        children = formattedChildren
    }
end



--- This function will be used to create a new element, and add it to the elements table.
---@param elementName string
---@param properties CSSProperties
---@param children table[] | nil
---@return table
function Foact:createElement(elementName, properties, children)
    local newId = math.random(100000, 999999)

    --registerEventHandler(elementName, self.uiName, newId, properties)
    saveFunctionReferences(self.uiName, newId, properties)

    local newElement = setmetatable({
        properties = properties,
        unformattedChildren = children or {},

        add = function(tbl, child)
            table.insert(tbl.unformattedChildren, child)

            local newChildren = {}
            for _, child in ipairs(tbl.unformattedChildren) do
                local newChild = formatForUI(child)
                if newChild then
                    table.insert(newChildren, newChild)
                end
            end

            exports.wxs_core:UpdateChildren(self.uiName, newId, newChildren)
        end,
        remove = function(tbl, child)
            for i, v in ipairs(tbl.unformattedChildren) do
                if v.id == child.id then
                    table.remove(tbl.unformattedChildren, i)

                    local newChildren = {}
                    for _, child in ipairs(tbl.unformattedChildren) do
                        local newChild = formatForUI(child)
                        if newChild then
                            table.insert(newChildren, newChild)
                        end
                    end

                    exports.wxs_core:UpdateChildren(self.uiName, newId, newChildren)
                end
            end
        end
    }, {
        __index = function(tbl, key)
            if key == "properties" then
                return tbl.properties
            elseif key == "children" then
                return tbl.unformattedChildren
            elseif key == "name" then
                return elementName
            elseif key == "id" then
                return newId
            elseif tbl.properties[key] then
                return tbl.properties[key]
            elseif key == "children" then
                return children
            end
        end,
        __newindex = function(tbl, key, value)
            if properties[key] ~= nil then
                rawset(tbl.properties, key, value)
                exports.wxs_core:UpdateUI(self.uiName, newId, key, value)
            else
                rawset(tbl, key, value)
            end
        end
    })

    table.insert(self.elements, {
        id = newId,
        name = elementName,
        object = newElement
    })

    return newElement
end

--- This function will load the UI into the NUI, so it's ready to be used when the user calls Foact.SetActive
function Foact:initialize(renderElement)
    local uiData = formatForUI(renderElement)
    exports.wxs_core:LoadUI(self.uiName, json.encode(uiData))
end

--- This function will be used to set the UI active, and set the focus to the UI if needed.
---@param active boolean
---@param focus boolean
function Foact:SetActive(active, focus)
    exports.wxs_core:SetActive(self.uiName, active, focus)
    if focus == false then
        SetNuiFocusKeepInput(active)
    end
end

return Foact
