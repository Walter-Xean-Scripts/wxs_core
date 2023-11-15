local _require = require
local loaded = {}
local path = './?.lua;'

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
        resourceSrc = GetCurrentResourceName()

        if resourceSrc ~= "wxs_core" then
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

        for path in path:gmatch('[^;]+') do
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