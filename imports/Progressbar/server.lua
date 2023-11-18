---@class ProgressbarSV
local Progressbar = {}

function Progressbar:Start(source, text, time, color, callback, blockInput)
    TriggerClientEvent("WXSCore:Client:Progressbar", source, text, time, color, callback, blockInput)
end

return Progressbar
