---@class Markers
local Markers = {}

local Blips = WXSCore.Blips

local storedMarkers = {}
local activeMarkers = {}
local activeMarkerIds = {}
local inMarkerIds = {}
local markerId = 0

local resourceMarkers = {}

---@class BlipData
---@field name string
---@field sprite number
---@field color number
---@field scale number
---@field alpha number
---@field shortRange boolean

---@param type number
---@param pos Vector3
---@param dir Vector3
---@param rot Vector3
---@param scale Vector3
---@param color table
---@param bobUpAndDown boolean
---@param faceCamera boolean
---@param range number
---@param markerCallback fun(id: number, didEnter: boolean)
---@param addBlip? boolean
---@param blipData? BlipData
---@returns number markerId
function Markers:RegisterMarker(type, pos, dir, rot, scale, color, bobUpAndDown, faceCamera, range, markerCallback,
                                addBlip, blipData)
    markerId += 1;

    local marker = {
        id = markerId,
        type = type,
        pos = pos,
        dir = dir,
        rot = rot,
        scale = scale,
        color = color,
        bobUpAndDown = bobUpAndDown,
        faceCamera = faceCamera,
        range = range,
        markerCallback = markerCallback
    }

    if addBlip and blipData ~= nil then
        marker.blip = Blips:AddBlip(blipData.name, pos, blipData.sprite,
            blipData.color, blipData.scale, blipData.alpha, blipData.shortRange)
    end

    if not resourceMarkers[GetInvokingResource()] then resourceMarkers[GetInvokingResource()] = {} end
    table.insert(resourceMarkers[GetInvokingResource()], markerId)

    table.insert(storedMarkers, marker)
    return markerId
end

---@class ChangeableMarkerData
---@field type? number
---@field pos? Vector3
---@field dir? Vector3
---@field rot? Vector3
---@field scale? Vector3
---@field color? table
---@field bobUpAndDown? boolean
---@field faceCamera? boolean
---@field range? number
---@field markerCallback? fun(didEnter: boolean)

---@param id number
---@param newValues ChangeableMarkerData
function Markers:UpdateMarker(id, newValues)
    for _, marker in ipairs(storedMarkers) do
        if marker.id == id then
            for key, value in pairs(newValues) do
                marker[key] = value
            end
            break
        end
    end
end

local function removeFromActiveMarkers(id)
    if not activeMarkerIds[id] then return end

    for i, activeMarker in ipairs(activeMarkers) do
        if activeMarker.id == id then
            table.remove(activeMarkers, i)
            break
        end
    end
end

---@param id number
---@return boolean success
function Markers:DeleteMarker(id)
    print(id)
    for i, marker in ipairs(storedMarkers) do
        if marker.id == id then
            if marker.blip then
                RemoveBlip(marker.blip)
            end
            removeFromActiveMarkers(id)
            table.remove(storedMarkers, i)
            return true
        end
    end

    return false
end

local function drawMarkers()
    for _, marker in ipairs(activeMarkers) do
        DrawMarker(marker.type,
            marker.pos.x,
            marker.pos.y,
            marker.pos.z,
            marker.dir.x,
            marker.dir.y,
            marker.dir.z,
            marker.rot.x,
            marker.rot.y,
            marker.rot.z,
            marker.scale.x,
            marker.scale.y,
            marker.scale.z,
            marker.color.r,
            marker.color.g,
            marker.color.b,
            marker.color.a,
            marker.bobUpAndDown,
            marker.faceCamera,
            2,
            marker.rotate,
            "",
            "",
            false
        )
    end
end

local function checkActiveMarkers()
    local player = PlayerPedId()
    local playerPos = GetEntityCoords(player)

    for _, marker in ipairs(storedMarkers) do
        local distance = #(playerPos - marker.pos)

        if distance <= (marker.scale.x / 2) and not inMarkerIds[marker.id] then
            marker.markerCallback(marker.id, true)
            inMarkerIds[marker.id] = true
        elseif distance > (marker.scale.x / 2) and inMarkerIds[marker.id] then
            marker.markerCallback(marker.id, false)
            inMarkerIds[marker.id] = nil
        end

        if distance <= marker.range and not activeMarkerIds[marker.id] then
            table.insert(activeMarkers, marker)
            activeMarkerIds[marker.id] = true
        elseif distance > marker.range and activeMarkerIds[marker.id] then
            for i, activeMarker in ipairs(activeMarkers) do
                if activeMarker.id == marker.id then
                    table.remove(activeMarkers, i)
                    activeMarkerIds[marker.id] = nil
                    break
                end
            end
        end
    end
end

-- Loop through all markers and draw them
local isAnyActive = false
local function startActiveLoop()
    Citizen.CreateThread(function()
        while isAnyActive do
            Citizen.Wait(0)
            drawMarkers()
        end
    end)
end

-- Loop through all stored markers and add them to active markers if within range
Citizen.CreateThread(function()
    while true do
        Citizen.Wait(500)
        checkActiveMarkers()

        if not isAnyActive and #activeMarkers > 0 then
            isAnyActive = true
            startActiveLoop()
        elseif isAnyActive and #activeMarkers == 0 then
            isAnyActive = false
        end
    end
end)

AddEventHandler("onResourceStop", function (resource)
    if resource == GetCurrentResourceName() then
        for _, marker in ipairs(storedMarkers) do
            Markers:DeleteMarker(marker.id)
        end
    end


    if resourceMarkers[resource] then
        for _, markerId in ipairs(resourceMarkers[resource]) do
            Markers:DeleteMarker(markerId)
        end

        resourceMarkers[resource] = nil
    end
end)

return Markers