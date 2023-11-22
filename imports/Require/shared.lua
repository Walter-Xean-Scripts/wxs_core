--[[
    If anyone reads this - I'd like to credit OXLib for this code.
    Link to them here: https://github.com/overextended
]]
local loaded = {}
local resourceName = "wxs_core"

package = {
    loaded = setmetatable({}, {
        __index = loaded,
        __newindex = function() end,
        __metatable = false,
    }),
    path = './?.lua;'
}

local _require = require

---Loads the given module inside the current resource, returning any values returned by the file or `true` when `nil`.
---@param modname string
---@return unknown?
function require(modname)
    if type(modname) ~= 'string' then return end

    local modpath = modname:gsub('%.', '/')
    local module = loaded[modname]

    if module then return module end

    local success, result = pcall(_require, modname)

    if success then
        loaded[modname] = result
        return result
    end

    local resourceSrc

    if not modpath:find('^@') then
        local idx = 1

        while true do
            local di = debug.getinfo(idx, 'S')

            if di then
                if not di.short_src:find('^@wxs_core/imports/Require') and not di.short_src:find('^%[C%]') and not di.short_src:find('^citizen') and di.short_src ~= '?' then
                    resourceSrc = di.short_src:gsub('^@(.-)/.+', '%1')
                    break
                end
            else
                resourceSrc = resourceName
                break
            end

            idx += 1
        end

        if resourceSrc ~= resourceName then
            modname = ('@%s.%s'):format(resourceSrc, modname)
        end
    end

    if not module then
        if module == false then
            error(("^1circular-dependency occurred when loading module '%s'^0"):format(modname), 2)
        end

        if not resourceSrc then
            resourceSrc = modpath:gsub('^@(.-)/.+', '%1')
            modpath = modpath:sub(#resourceSrc + 3)
        end

        for path in package.path:gmatch('[^;]+') do
            local scriptPath = path:gsub('?', modpath):gsub('%.+%/+', '')
            local resourceFile = LoadResourceFile(resourceSrc, scriptPath)

            if resourceFile then
                loaded[modname] = false
                scriptPath = ('@@%s/%s'):format(resourceSrc, scriptPath)

                local chunk, err = load(resourceFile, scriptPath)

                if err or not chunk then
                    loaded[modname] = nil
                    return error(err or ("unable to load module '%s'"):format(modname), 3)
                end

                module = chunk(modname) or true
                loaded[modname] = module

                return module
            end
        end

        return error(result, 2)
    end

    return module
end

return require
