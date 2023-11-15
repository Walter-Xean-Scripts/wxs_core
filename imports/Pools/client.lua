---@alias Player number Number representing a player's R* handle.
---@alias Ped number Number representing a ped's R* handle.

---@class Pools
local Pools = {}

---@class Players
Pools.Players = {}
---@class Vehicles
Pools.Vehicles = {}
---@class Peds
Pools.Peds = {}
---@class Objects
Pools.Objects = {}

--[[
    Players Functions
]]
--

--- Returns all players loaded for the client.
---@return {ped: Ped, id: Player} Players
function Pools.Players:GetPlayerPeds()
    local players = {}

    for _, player in ipairs(GetActivePlayers()) do
        local ped = GetPlayerPed(player)

        if DoesEntityExist(ped) then
            table.insert(players, { ['ped'] = ped, ['id'] = player })
        end
    end

    return players
end

---Returns a table of all players in the given circle.
---@param coords Vector3 Coordinates to the center of the area.
---@param radius number Radius from `coords`.
---@return {ped: Ped, id: Player} Players
function Pools.Players:GetInArea(coords, radius)
    local players = {}

    for _, player in ipairs(GetActivePlayers()) do
        local ped = GetPlayerPed(player)
        local plyCoords = GetEntityCoords(ped)

        if player ~= PlayerId() and #(plyCoords - coords) <= radius then
            table.insert(players, { ['ped'] = ped, ['id'] = player })
        end
    end

    return players
end

---Returns the closest player to `coords`
---@param coords vector3 Coords to get the closest player from.
---@return number PlayerHandle R* Handle of closest player `-1` if none found.
---@return number Distance Distance from closest player. `-1` if none fonud.
function Pools.Players:GetClosestPlayer(coords)
    local ped = PlayerPedId()
    local players = self:GetPlayerPeds()
    local closestDistance, closestPlayer = -1, -1
    local coords = coords

    if coords == nil then
        coords = GetEntityCoords(ped)
    end

    for k, v in ipairs(players) do
        local target = v.ped

        if v.id ~= PlayerId() then
            local targetCoords = GetEntityCoords(target)
            local distance = #(targetCoords - coords)

            if closestDistance == -1 or closestDistance > distance then
                closestPlayer = v.id
                closestDistance = distance
            end
        end
    end

    return closestPlayer, closestDistance
end

--[[
    Vehicle Functions
]]
--

---Returns a list of all vehicles.
---@return number[] Vehicles
function Pools.Vehicles:GetAll()
    return GetGamePool('CVehicle')
end

---Returns a list of vehicle in the given circle.
---@param coords Vector3 Center of circle.
---@param radius number Radius of circle.
---@return number[] - List of R* Vehicle handles.
function Pools.Vehicles:GetInArea(coords, radius)
    local objects = {}

    for k, v in ipairs(GetGamePool('CVehicle')) do
        local objCoords = GetEntityCoords(v)

        if #(objCoords - coords) <= radius then
            table.insert(objects, v)
        end
    end

    return objects
end

---Returns closest vehicle to given coords.
---@param coords vector3 Distance to get from.
---@return number VehicleHandle R* Handle of the closest vehicle. `-1` if none found.
---@return number Distance Distance from closest vehicle. `-1` if none found.
function Pools.Vehicles:GetClosest(coords)
    local ped = PlayerPedId()
    local vehicles = GetGamePool('CVehicle')
    local closestDistance, closestVehicle = -1, -1
    local coords = coords

    if coords == nil then
        coords = GetEntityCoords(ped)
    end

    for k, v in ipairs(vehicles) do
        local targetCoords = GetEntityCoords(v)
        local distance = #(targetCoords - coords)

        if closestDistance == -1 or closestDistance > distance then
            closestVehicle = v
            closestDistance = distance
        end
    end

    return closestVehicle, closestDistance
end

--[[
    Peds Functions
]]
--

---Returns a list of peds.
---@return number[] Peds
function Pools.Peds:GetAll()
    return GetGamePool('CPed')
end

---Returns a list of peds in the given circle.
---@param coords Vector3 Center of circle.
---@param radius number Radius of circle.
---@return number[] Peds
function Pools.Peds:GetInArea(coords, radius)
    local objects = {}

    for k, v in ipairs(GetGamePool('CPed')) do
        local objCoords = GetEntityCoords(v)

        if #(objCoords - coords) <= radius then
            table.insert(objects, v)
        end
    end

    return objects
end

---Returns the closest ped to the given coords.
---@param coords vector3 Coords to find ped from.
---@return number PedHandle R* Ped handle. `-1` if none found.
---@return number Distance Distance from ped. `-1` if none found.
function Pools.Peds:GetClosest(coords)
    local ped = PlayerPedId()
    local peds = GetGamePool('CPed')
    local closestDistance, closestPed = -1, -1
    local coords = coords

    if coords == nil then
        coords = GetEntityCoords(ped)
    end

    for k, v in ipairs(peds) do
        local targetCoords = GetEntityCoords(v)
        local distance = #(targetCoords - coords)

        if (closestDistance == -1 or closestDistance > distance) and v ~= PlayerPedId() then
            closestPed = v
            closestDistance = distance
        end
    end

    return closestPed, closestDistance
end

--[[
    Objects Functions
]]
--

---Returns a list of all objects.
---@return number[] Objects
function Pools.Objects:GetAll()
    return GetGamePool('CObject')
end

---Returns a list of all objects in the given circle.
---@param coords Vector3 Center of circle.
---@param radius number Radius of circle.
---@return number[] ObjectsInArea
function Pools.Objects:GetInArea(coords, radius)
    local objects = {}

    for k, v in ipairs(GetGamePool('CObject')) do
        local objCoords = GetEntityCoords(v)

        if #(objCoords - coords) <= radius then
            table.insert(objects, v)
        end
    end

    return objects
end

---Returns the closest object to the given coords.
---@param coords vector3 From coords.
---@return number ObjectHandle R* Object handle. `-1` if none found.
---@return number Distance Distance from `coords`. `-1` if none found.
function Pools.Objects:GetClosest(coords)
    local ped = PlayerPedId()
    local objects = GetGamePool('CObject')
    local closestDistance, closestObject = -1, -1
    local coords = coords

    if coords == nil then
        coords = GetEntityCoords(ped)
    end

    for k, v in ipairs(objects) do
        local targetCoords = GetEntityCoords(v)
        local distance = #(targetCoords - coords)

        if closestDistance == -1 or closestDistance > distance then
            closestObject = v
            closestDistance = distance
        end
    end

    return closestObject, closestDistance
end

return Pools
