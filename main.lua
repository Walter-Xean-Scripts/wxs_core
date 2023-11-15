--[[
    If anyone reads this - I'd like to credit OXLib for most of this code.
    I've just taken the parts we needed, since they already had a good implementation.
    So credits to them.
]]--
local context = IsDuplicityVersion() and 'server' or 'client'

local function noop() end

--[[
    Loads the specified module from our folder
]]--
local function loadModule(self, module)
    local dir = ('%s'):format(module)
    local chunk = LoadResourceFile("wxs_core", ('imports/%s/%s.lua'):format(dir, context))
    local shared = LoadResourceFile("wxs_core", ('imports/%s/shared.lua'):format(dir))

    if shared then
        chunk = (chunk and ('%s\n%s'):format(shared, chunk)) or shared
    end

    if chunk then
        local fn, err = load(chunk, ('@@wxs_core/imports/%s/%s.lua'):format(module, context))

        if not fn or err then
            return error(('\n^1Error importing module (%s): %s^0'):format(dir, err), 3)
        end

        local result = fn()
        self[module] = result or noop
        return self[module]
    end
end

--[[
    Index function of our table, that'll fetch the module if it doesn't exists, and call a function on it.
]]--
local function call(self, index, ...)
    local module = rawget(self, index)

    if not module then
        self[index] = noop
        module = loadModule(self, index)
    end

    return module
end

WXSCore = setmetatable({
    name = "wxs_core",
    context = context
}, {
    __index = call,
    __call = call,
})

--[[
    Override the standard require function.
]]--
require = WXSCore.Require