---@class Streaming
local Streaming = {}
---@type Logger
local Logger = WXSCore.Logger


--- Requests a model to be loaded and returns a promise that resolves when the model is loaded.
--- @param modelName string|number The name of the model to load.
--- @return boolean Whether the model was loaded successfully.
function Streaming:RequestModelSync(modelName)
    local p = promise.new()
    local model = type(modelName) == "string" and GetHashKey(modelName) or modelName

    CreateThread(function()
        if not HasModelLoaded(model) then
            RequestModel(model)

            local tries = 0
            while not HasModelLoaded(model) do
                Citizen.Wait(5)
                tries = tries + 1

                if tries >= 100 then
                    Logger:Error(GetCurrentResourceName(),
                        'Failed to load model ' .. model .. ' after ' .. tries .. ' tries')
                    p:resolve(false)
                    break
                end
            end
        end

        p:resolve(HasModelLoaded(model))
    end)

    return Citizen.Await(p)
end

--- Requests a model to be loaded and calls a callback function when the model is loaded.
--- @param modelName string The name of the model to load.
--- @param callback function The function to call when the model is loaded.
function Streaming:RequestModel(modelName, callback)
    local model = GetHashKey(modelName)

    CreateThread(function()
        if not HasModelLoaded(model) then
            RequestModel(model)

            local tries = 0
            while not HasModelLoaded(model) do
                Citizen.Wait(5)
                tries = tries + 1

                if tries >= 100 then
                    Logger:Error(GetCurrentResourceName(),
                        'Failed to load model ' .. modelName .. ' after ' .. tries .. ' tries')
                    callback(false)
                    break
                end
            end
        end

        callback(HasModelLoaded(model), model)
    end)
end

--- Requests a streamed texture dictionary to be loaded and returns a promise that resolves when the dictionary is loaded.
--- @param textureDict string The name of the streamed texture dictionary to load.
--- @return boolean Whether the dictionary was loaded successfully.
function Streaming:RequestStreamedTextureDictSync(textureDict)
    local p = promise.new()

    CreateThread(function()
        if not HasStreamedTextureDictLoaded(textureDict) then
            RequestStreamedTextureDict(textureDict, true)

            local tries = 0
            while not HasStreamedTextureDictLoaded(textureDict) do
                Citizen.Wait(5)
                tries = tries + 1

                if tries >= 100 then
                    Logger:Error(GetCurrentResourceName(),
                        'Failed to load streamed texture dict ' .. textureDict .. ' after ' .. tries .. ' tries')
                    p:resolve(false)
                    break
                end
            end
        end

        p:resolve(HasStreamedTextureDictLoaded(textureDict))
    end)

    return Citizen.Await(p)
end

--- Requests a streamed texture dictionary to be loaded and calls a callback function when the dictionary is loaded.
--- @param textureDict string The name of the streamed texture dictionary to load.
--- @param callback function The function to call when the dictionary is loaded.
function Streaming:RequestStreamedTextureDict(textureDict, callback)
    CreateThread(function()
        if not HasStreamedTextureDictLoaded(textureDict) then
            RequestStreamedTextureDict(textureDict, true)

            local tries = 0
            while not HasStreamedTextureDictLoaded(textureDict) do
                Citizen.Wait(5)
                tries = tries + 1

                if tries >= 100 then
                    Logger:Error(GetCurrentResourceName(),
                        'Failed to load streamed texture dict ' .. textureDict .. ' after ' .. tries .. ' tries')
                    callback(false)
                    break
                end
            end
        end

        callback(HasStreamedTextureDictLoaded(textureDict))
    end)
end

-- Requests an animation set and waits for it to load synchronously.
-- @param animSet The name of the animation set to load.
-- @return A boolean indicating whether the animation set was loaded successfully.
function Streaming:RequestAnimSetSync(animSet)
    local p = promise.new()

    CreateThread(function()
        if not HasAnimSetLoaded(animSet) then
            RequestAnimSet(animSet)

            local tries = 0
            while not HasAnimSetLoaded(animSet) do
                Citizen.Wait(5)
                tries = tries + 1

                if tries >= 100 then
                    Logger:Error(GetCurrentResourceName(),
                        'Failed to load anim set ' .. animSet .. ' after ' .. tries .. ' tries')
                    p:resolve(false)
                    break
                end
            end
        end

        p:resolve(HasAnimSetLoaded(animSet))
    end)

    return Citizen.Await(p)
end

-- Requests an animation set and calls a callback function when it is loaded.
-- @param animSet The name of the animation set to load.
-- @param callback The function to call when the animation set is loaded.
function Streaming:RequestAnimSet(animSet, callback)
    CreateThread(function()
        if not HasAnimSetLoaded(animSet) then
            RequestAnimSet(animSet)

            local tries = 0
            while not HasAnimSetLoaded(animSet) do
                Citizen.Wait(5)
                tries = tries + 1

                if tries >= 100 then
                    Logger:Error(GetCurrentResourceName(),
                        'Failed to load anim set ' .. animSet .. ' after ' .. tries .. ' tries')
                    callback(false)
                    break
                end
            end
        end

        callback(HasAnimSetLoaded(animSet))
    end)
end

-- Requests an animation dictionary and waits for it to load synchronously.
-- @param animDict The name of the animation dictionary to load.
-- @return A boolean indicating whether the animation dictionary was loaded successfully.
function Streaming:RequestAnimDictSync(animDict)
    local p = promise.new()

    CreateThread(function()
        if not HasAnimDictLoaded(animDict) then
            RequestAnimDict(animDict)

            local tries = 0
            while not HasAnimDictLoaded(animDict) do
                Citizen.Wait(5)
                tries = tries + 1

                if tries >= 100 then
                    Logger:Error(GetCurrentResourceName(),
                        'Failed to load anim dict ' .. animDict .. ' after ' .. tries .. ' tries')
                    p:resolve(false)
                    break
                end
            end
        end

        p:resolve(HasAnimDictLoaded(animDict))
    end)

    return Citizen.Await(p)
end

-- Requests an animation dictionary and calls a callback function when it is loaded.
-- @param animDict The name of the animation dictionary to load.
-- @param callback The function to call when the animation dictionary is loaded.
function Streaming:RequestAnimDict(animDict, callback)
    CreateThread(function()
        if not HasAnimDictLoaded(animDict) then
            RequestAnimDict(animDict)

            local tries = 0
            while not HasAnimDictLoaded(animDict) do
                Citizen.Wait(5)
                tries = tries + 1

                if tries >= 100 then
                    Logger:Error(GetCurrentResourceName(),
                        'Failed to load anim dict ' .. animDict .. ' after ' .. tries .. ' tries')
                    callback(false)
                    break
                end
            end
        end

        callback(HasAnimDictLoaded(animDict))
    end)
end

-- Requests a named particle effect asset and waits for it to load synchronously.
-- @param assetName The name of the particle effect asset to load.
-- @return A boolean indicating whether the particle effect asset was loaded successfully.
function Streaming:RequestNamedPtfxAssetSync(assetName)
    local p = promise.new()

    CreateThread(function()
        if not HasNamedPtfxAssetLoaded(assetName) then
            RequestNamedPtfxAsset(assetName)

            local tries = 0
            while not HasNamedPtfxAssetLoaded(assetName) do
                Citizen.Wait(5)
                tries = tries + 1

                if tries >= 100 then
                    Logger:Error(GetCurrentResourceName(),
                        'Failed to load named ptfx asset ' .. assetName .. ' after ' .. tries .. ' tries')
                    p:resolve(false)
                    break
                end
            end
        end

        p:resolve(HasNamedPtfxAssetLoaded(assetName))
    end)

    return Citizen.Await(p)
end

-- Requests a named particle effect asset and calls a callback function when it is loaded.
-- @param assetName The name of the particle effect asset to load.
-- @param callback The function to call when the particle effect asset is loaded.
function Streaming:RequestNamedPtfxAsset(assetName, callback)
    CreateThread(function()
        if not HasNamedPtfxAssetLoaded(assetName) then
            RequestNamedPtfxAsset(assetName)

            local tries = 0
            while not HasNamedPtfxAssetLoaded(assetName) do
                Citizen.Wait(5)
                tries = tries + 1

                if tries >= 100 then
                    Logger:Error(GetCurrentResourceName(),
                        'Failed to load named ptfx asset ' .. assetName .. ' after ' .. tries .. ' tries')
                    callback(false)
                    break
                end
            end
        end

        callback(HasNamedPtfxAssetLoaded(assetName))
    end)
end

-- Requests a weapon asset and waits for it to load synchronously.
-- @param weaponHash The hash of the weapon asset to load.
-- @return A boolean indicating whether the weapon asset was loaded successfully.
function Streaming:RequestWeaponAssetSync(weaponHash)
    local p = promise.new()

    CreateThread(function()
        if not HasWeaponAssetLoaded(weaponHash) then
            RequestWeaponAsset(weaponHash, 1, 1)

            local tries = 0
            while not HasWeaponAssetLoaded(weaponHash) do
                Citizen.Wait(5)
                tries = tries + 1

                if tries >= 100 then
                    Logger:Error(GetCurrentResourceName(),
                        'Failed to load weapon asset ' .. weaponHash .. ' after ' .. tries .. ' tries')
                    p:resolve(false)
                    break
                end
            end
        end

        p:resolve(HasWeaponAssetLoaded(weaponHash))
    end)

    return Citizen.Await(p)
end

-- Requests a weapon asset and calls a callback function when it is loaded.
-- @param weaponHash The hash of the weapon asset to load.
-- @param callback The function to call when the weapon asset is loaded.
function Streaming:RequestWeaponAsset(weaponHash, callback)
    CreateThread(function()
        if not HasWeaponAssetLoaded(weaponHash) then
            RequestWeaponAsset(weaponHash, 1, 1)

            local tries = 0
            while not HasWeaponAssetLoaded(weaponHash) do
                Citizen.Wait(5)
                tries = tries + 1

                if tries >= 100 then
                    Logger:Error(GetCurrentResourceName(),
                        'Failed to load weapon asset ' .. weaponHash .. ' after ' .. tries .. ' tries')
                    callback(false)
                    break
                end
            end
        end

        callback(HasWeaponAssetLoaded(weaponHash))
    end)
end

return Streaming