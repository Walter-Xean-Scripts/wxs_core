---@class Notifications
local Notifications = {}

local function sendNotification(type, title, message, duration, placement)
    exports.wxs_core:SendNotification(type, title, message, duration, placement)
end

---Sends a success notification
---@param title string
---@param message string
---@param duration? number defaults to 5 (seconds)
---@param placement? "top" | "topLeft" | "topRight" | "bottom" | "bottomLeft" | "bottomRight" defaults to "topRight"
function Notifications:Success(title, message, duration, placement)
    sendNotification("success", title, message, duration, placement)
end

---Sends an error notification
---@param title string
---@param message string
---@param duration? number defaults to 5 (seconds)
---@param placement? "top" | "topLeft" | "topRight" | "bottom" | "bottomLeft" | "bottomRight" defaults to "topRight"
function Notifications:Error(title, message, duration, placement)
    sendNotification("error", title, message, duration, placement)
end

---Sends an info notification
---@param title string
---@param message string
---@param duration? number defaults to 5 (seconds)
---@param placement? "top" | "topLeft" | "topRight" | "bottom" | "bottomLeft" | "bottomRight" defaults to "topRight"
function Notifications:Info(title, message, duration, placement)
    sendNotification("info", title, message, duration, placement)
end

---Sends a warning notification
---@param title string
---@param message string
---@param duration? number defaults to 5 (seconds)
---@param placement? "top" | "topLeft" | "topRight" | "bottom" | "bottomLeft" | "bottomRight" defaults to "topRight"
function Notifications:Warning(title, message, duration, placement)
    sendNotification("warning", title, message, duration, placement)
end

return Notifications
