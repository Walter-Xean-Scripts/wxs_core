---@class NotificationsSV
local Notifications = {}

local function sendNotification(source, type, title, message, duration, placement)
    TriggerClientEvent("WXSCore:Client:Notification", source, type, title, message, duration, placement)
end

---Sends a success notification
---@param source number
---@param title string
---@param message string
---@param duration? number defaults to 5 (seconds)
---@param placement? "top" | "topLeft" | "topRight" | "bottom" | "bottomLeft" | "bottomRight" defaults to "topRight"
function Notifications:Success(source, title, message, duration, placement)
    sendNotification(source, "success", title, message, duration, placement)
end

---Sends an error notification
---@param source number
---@param title string
---@param message string
---@param duration? number defaults to 5 (seconds)
---@param placement? "top" | "topLeft" | "topRight" | "bottom" | "bottomLeft" | "bottomRight" defaults to "topRight"
function Notifications:Error(source, title, message, duration, placement)
    sendNotification(source, "error", title, message, duration, placement)
end

---Sends an info notification
---@param source number
---@param title string
---@param message string
---@param duration? number defaults to 5 (seconds)
---@param placement? "top" | "topLeft" | "topRight" | "bottom" | "bottomLeft" | "bottomRight" defaults to "topRight"
function Notifications:Info(source, title, message, duration, placement)
    sendNotification(source, "info", title, message, duration, placement)
end

---Sends a warning notification
---@param source number
---@param title string
---@param message string
---@param duration? number defaults to 5 (seconds)
---@param placement? "top" | "topLeft" | "topRight" | "bottom" | "bottomLeft" | "bottomRight" defaults to "topRight"
function Notifications:Warning(source, title, message, duration, placement)
    sendNotification(source, "warning", title, message, duration, placement)
end

return Notifications
