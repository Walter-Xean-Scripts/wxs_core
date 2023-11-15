local id = 0
local registered = {}
local responses = {}

---@type Logger
local Logger = WXSCore.Logger

local function callbackResponse(success, result, ...)
	if not success then
		if result then
			return print(('^1SCRIPT ERROR: %s^0\n%s'):format(result , Citizen.InvokeNative(`FORMAT_STACK_TRACE` & 0xFFFFFFFF, nil, 0, Citizen.ResultAsString()) or ''))
		end

		return false
	end

	return result, ...
end

local function doClientCallback(_, event, source, cb, ...)
    local promise = promise.new()
    id = id + 1
    local currentId = id

    TriggerClientEvent("WXS:CB:" .. event, source, currentId, ...)

    RegisterNetEvent("WXS:SCB:Response:" .. event, function(_id, ...)
        if _id ~= currentId then return end
        promise:resolve({ callbackResponse(pcall(cb, ...)) })
    end)

    return Citizen.Await(promise)
end

WXSCore.Callbacks = setmetatable({}, {
    __call = doClientCallback
})

---@diagnostic disable-next-line: duplicate-set-field
function WXSCore.Callbacks.Register(name, callback)
    if registered[name] ~= nil then
        Logger:Warn('Callbacks', 'Callback ' .. name .. ' already exists, not registering')
        return
    end

    registered[name] = true

    RegisterNetEvent("WXS:SCB:" .. name, function(_id, ...)
        local source = source
        local args = { callbackResponse(pcall(callback, source, ...)) }

        TriggerClientEvent("WXS:CB:Response:" .. name, source, _id, table.unpack(args))
    end)
end

---@diagnostic disable-next-line: duplicate-set-field
function WXSCore.Callbacks.Await(event, source, ...)
    return doClientCallback(event, source, false, ...)
end

return WXSCore.Callbacks