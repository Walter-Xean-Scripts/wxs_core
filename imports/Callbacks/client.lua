local id = 0
local registered = {}
local responses = {}

---@type Logger
local Logger = WXSCore.Logger

local function callbackResponse(success, result, ...)
    if not success then
        if result then
            return print(('^1SCRIPT ERROR: %s^0\n%s'):format(result,
                Citizen.InvokeNative(`FORMAT_STACK_TRACE` & 0xFFFFFFFF, nil, 0, Citizen.ResultAsString()) or ''))
        end

        return false
    end

    return result, ...
end

local function doServerCallback(_, event, cb, ...)
    local promise = promise.new()
    id = id + 1
    local currentId = id

    if not cb then
        cb = function() end
    end

    TriggerServerEvent("WXS:SCB:" .. event, currentId, ...)

    RegisterNetEvent("WXS:CB:Response:" .. event, function(_id, ...)
        if _id ~= currentId then return end
        promise:resolve({ callbackResponse(pcall(cb, ...)) })
    end)

    return promise
end

WXSCore.Callbacks = setmetatable({}, {
    __call = doServerCallback
})

---@diagnostic disable-next-line: duplicate-set-field
function WXSCore.Callbacks.Register(name, callback)
    if registered[name] ~= nil then
        Logger:Warn('Callbacks', 'Callback ' .. name .. ' already exists, not registering')
        return
    end

    registered[name] = true

    RegisterNetEvent("WXS:CB:" .. name, function(_id, ...)
        local args = { callbackResponse(pcall(callback, ...)) }

        TriggerServerEvent("WXS:SCB:Response:" .. name, _id, table.unpack(args))
    end)
end

---@diagnostic disable-next-line: duplicate-set-field
function WXSCore.Callbacks.Await(event, ...)
    return Citizen.Await(doServerCallback(nil, event, false, ...))
end

return WXSCore.Callbacks
