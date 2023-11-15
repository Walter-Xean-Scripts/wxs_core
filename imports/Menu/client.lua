---@type Foact
local Foact = WXSCore.Foact
local Menu = Foact.new("WXMenu")

local container = Menu:createElement("Box", {
    position = "absolute",
    right = "30px",
    top = "50%",
    transform = "translateY(-50%)",

    minHeight = "400px",
    width = "300px",

    borderRadius = "10px",
    backgroundColor = "#1a2029",

    padding = "10px"
})
Menu:initialize(container)

---@class MenuCreator
local MenuCreator = {}

function MenuCreator.new(title)
    return setmetatable({
        title = title,
        titleElement = nil,
        items = {},
        currentSubmenu = "main",
        lastSubmenu = "",
        lastSubmenuTitle = title,
        currentSubmenuItems = {}
    }, { __index = MenuCreator })
end

function MenuCreator:CreateSubmenu(parentId, id, label, icon)
    if not self.items[parentId] then
        self.items[parentId] = {}
    end

    table.insert(self.items[parentId], {
        type = "submenu",
        id = id,
        name = label,
        icon = icon
    })
end

function MenuCreator:CreateButtonItem(parentId, id, label, icon, onClick)
    if not self.items[parentId] then
        self.items[parentId] = {}
    end
    
    table.insert(self.items[parentId], {
        type = "button",
        id = id,
        name = label,
        icon = icon,
        onClick = onClick
    })
end

function MenuCreator:CreateSeparator(parentId, id)
    if not self.items[parentId] then
        self.items[parentId] = {}
    end

    table.insert(self.items[parentId], {
        type = "separator",
        id = id
    })
end

function MenuCreator:CreateCheckbox(parentId, id, label, icon, defaultValue, onClick)
    if not self.items[parentId] then
        self.items[parentId] = {}
    end

    table.insert(self.items[parentId], {
        type = "checkbox",
        id = id,
        name = label,
        icon = icon,
        defaultValue = defaultValue,
        onClick = onClick
    })
end

function MenuCreator:CreateNumberInput(parentId, id, label, icon, min, max, defaultValue, onChange)
    if not self.items[parentId] then
        self.items[parentId] = {}
    end

    table.insert(self.items[parentId], {
        type = "numberinput",
        id = id,
        name = label,
        icon = icon,
        min = min,
        max = max,
        defaultValue = defaultValue,
        onChange = onChange
    })
end

function MenuCreator:Construct(onlyItems)
    if not onlyItems then
        self.titleElement = Menu:createElement("Title", {
            text = self.title,
            level = 3,
            color = "white",
            margin = "0px",
            padding = "0px",
            textAlign = "center"
        })
        container:add(self.titleElement)

        local divider = Menu:createElement("Divider", {
            marginBottom = "10px",
            marginTop = "5px"
        })
        container:add(divider)
    end

    for parent, items in pairs(self.items) do
        for _, item in ipairs(items) do
            if item.type == "button" then
                local newElement = Menu:createElement("Button", {
                    leftText = item.name,
                    onClick = item.onClick,
                    borderRadius = "10px",
                    block = true,
                    size = "large",
                    backgroundColor = "#202833",
                    icon = item.icon,
                    marginBottom = "10px"
                })

                if self.currentSubmenu == parent then
                    container:add(newElement)
                    table.insert(self.currentSubmenuItems, newElement)
                end
            elseif item.type == "submenu" then
                local newElement = Menu:createElement("Button", {
                    leftText = item.name,
                    rightText = ">",
                    borderRadius = "10px",
                    block = true,
                    size = "large",
                    backgroundColor = "#202833",
                    icon = item.icon,
                    marginBottom = "10px",
                    onClick = function()
                        self.lastSubmenu = self.currentSubmenu
                        self.lastSubmenuTitle = self.titleElement.text
                        self.currentSubmenu = item.id

                        for _, element in ipairs(self.currentSubmenuItems) do
                            container:remove(element)
                        end
                    
                        self.titleElement.text = item.name

                        self:Construct(true)
                    end
                })

                if self.currentSubmenu == parent then
                    container:add(newElement)
                    table.insert(self.currentSubmenuItems, newElement)
                end
            end
        end
    end

    if self.currentSubmenu ~= "main" then
        local newElement = Menu:createElement("Button", {
            leftText = "<- Go back",
            onClick = function()
                self.currentSubmenu = self.lastSubmenu

                for _, element in ipairs(self.currentSubmenuItems) do
                    container:remove(element)
                end
            
                self.titleElement.text = self.lastSubmenuTitle

                self:Construct(true)
            end,
            borderRadius = "10px",
            block = true,
            size = "large",
            backgroundColor = "#202833",
            marginBottom = "10px",
            danger = true,
        })

        container:add(newElement)
        table.insert(self.currentSubmenuItems, newElement)
    end
end

function MenuCreator:SetVisible(visible)
    Menu:SetActive(visible, visible)
end

return MenuCreator