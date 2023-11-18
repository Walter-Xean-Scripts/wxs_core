---@class Progressbar
local Progressbar = {}

function Progressbar:Start(text, time, color, callback, blockInput)
    exports.wxs_core:StartProgress(time, text, color, callback, blockInput)
end

return Progressbar
