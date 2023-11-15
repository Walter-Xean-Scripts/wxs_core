local function makeLog(severity, componentName, log)
    local prefix = '[LOG]'

    if severity == 2 then
        prefix = '[^3WARN^7]'
    elseif severity == 3 then
        prefix = '[^1ERROR^7]'
    elseif severity == 4 then
        prefix = '[^9FATAL^7]'
    end

    local formattedLog = string.format('%s\t[^5%s^7] %s', prefix, componentName, log)
    print(formattedLog)
end


---Logger class provides functionality for logging to the server or client console.
---@class Logger
local Logger = {}

---Logs a message with no severity level.
---@param componentName string Name of the component that is logging.
---@param log string Message to be logged.
function Logger:Log(componentName, log)
    makeLog(1, componentName, log)
end

---Logs a message as a warning.
---@param componentName string Name of the component that is logging.
---@param log string Message to be logged.
function Logger:Warn(componentName, log)
    makeLog(2, componentName, log)
end

---Logs a message as an error.
---@param componentName string Name of the component that is logging.
---@param log string Message to be logged.
function Logger:Error(componentName, log)
    makeLog(3, componentName, log)
end

---Logs a message as fatal.
---@param componentName string Name of the component that is logging.
---@param log string Message to be logged.
function Logger:Fatal(componentName, log)
    makeLog(4, componentName, log)
end

return Logger