---@class BlipsUtil
local Blips = {}
local curBlipId = 0
local blips = {}
local resourceBlips = {}

local function setBlipProperties(blip, sprite, color, scale, alpha, shortRange, name)
  SetBlipSprite(blip, sprite)
  SetBlipColour(blip, color)
  SetBlipScale(blip, scale)
  SetBlipAlpha(blip, alpha)
  SetBlipAsShortRange(blip, shortRange)
  BeginTextCommandSetBlipName("STRING")
  AddTextComponentSubstringPlayerName(name)
  EndTextCommandSetBlipName(blip)
end

---@param name string
---@param coords Vector3
---@param sprite number
---@param color number
---@param scale number
---@param alpha number
---@param shortRange boolean
---@return integer
function Blips:AddBlip(name, coords, sprite, color, scale, alpha, shortRange)
  local blipData = {
    id = curBlipId,
    name = name,
    coords = coords,
    sprite = sprite,
    color = color,
    scale = scale,
    alpha = alpha,
    shortRange = shortRange
  }

  local blip = AddBlipForCoord(coords.x, coords.y, coords.z)
  setBlipProperties(blip, sprite, color, scale, alpha, shortRange, name)

  blipData.blip = blip

  blips[curBlipId] = blipData
  if not resourceBlips[GetInvokingResource()] then
    resourceBlips[GetInvokingResource()] = {}
  end
  table.insert(resourceBlips[GetInvokingResource()], blip)
  curBlipId = curBlipId + 1

  return blipData.id
end

---@param coords Vector3
---@param width number
---@param height number
---@param rotation number
---@param color number
---@param alpha number
---@return integer
function Blips:AddBlipForArea(coords, width, height, rotation, color, alpha)
  local blipData = {
    id = curBlipId,
    coords = coords,
    width = width,
    height = height,
    rotation = rotation,
    color = color,
    alpha = alpha
  }

  local blip = AddBlipForArea(coords.x, coords.y, coords.z, width, height)
  SetBlipRotation(blip, rotation)
  SetBlipColour(blip, color)
  SetBlipAlpha(blip, alpha)

  blipData.blip = blip

  blips[curBlipId] = blipData
  if not resourceBlips[GetInvokingResource()] then
    resourceBlips[GetInvokingResource()] = {}
  end
  table.insert(resourceBlips[GetInvokingResource()], blip)
  curBlipId = curBlipId + 1

  return blipData.id
end

---@param entity number
---@param name string
---@param sprite number
---@param color number
---@param scale number
---@param alpha number
---@param shortRange boolean
---@return integer
function Blips:AddBlipForEntity(entity, name, sprite, color, scale, alpha, shortRange)
  local blipData = {
    id = curBlipId,
    name = name,
    entity = entity,
    sprite = sprite,
    color = color,
    scale = scale,
    alpha = alpha,
    shortRange = shortRange
  }

  local blip = AddBlipForEntity(entity)
  if not resourceBlips[GetInvokingResource()] then
    resourceBlips[GetInvokingResource()] = {}
  end
  table.insert(resourceBlips[GetInvokingResource()], blip)
  setBlipProperties(blip, sprite, color, scale, alpha, shortRange, name)

  blipData.blip = blip

  blips[curBlipId] = blipData
  curBlipId = curBlipId + 1

  return blipData.id
end

---@param pickup number
---@param name string
---@param sprite number
---@param color number
---@param scale number
---@param alpha number
---@param shortRange boolean
---@return integer
function Blips:AddBlipForPickup(pickup, name, sprite, color, scale, alpha, shortRange)
  local blipData = {
    id = curBlipId,
    name = name,
    pickup = pickup,
    sprite = sprite,
    color = color,
    scale = scale,
    alpha = alpha,
    shortRange = shortRange
  }

  local blip = AddBlipForPickup(pickup)
  if not resourceBlips[GetInvokingResource()] then
    resourceBlips[GetInvokingResource()] = {}
  end
  table.insert(resourceBlips[GetInvokingResource()], blip)
  setBlipProperties(blip, sprite, color, scale, alpha, shortRange, name)

  blipData.blip = blip

  blips[curBlipId] = blipData
  curBlipId = curBlipId + 1

  return blipData.id
end

---@param name string
---@param coords Vector3
---@param sprite number
---@param color number
---@param scale number
---@param alpha number
---@param shortRange boolean
---@return integer
function Blips:AddBlipForRadius(name, coords, sprite, color, scale, alpha, shortRange)
  local blipData = {
    id = curBlipId,
    name = name,
    coords = coords,
    sprite = sprite,
    color = color,
    scale = scale,
    alpha = alpha,
    shortRange = shortRange
  }

  local blip = AddBlipForRadius(coords.x, coords.y, coords.z, scale)
  if not resourceBlips[GetInvokingResource()] then
    resourceBlips[GetInvokingResource()] = {}
  end
  table.insert(resourceBlips[GetInvokingResource()], blip)
  setBlipProperties(blip, sprite, color, scale, alpha, shortRange, name)

  blipData.blip = blip

  blips[curBlipId] = blipData
  curBlipId = curBlipId + 1

  return blipData.id
end

---@param id number
---@return number|nil
function Blips:GetHandle(id)
  local blip = blips[id]

  if blip then
    return blip.blip
  end
end

---@param id number
function Blips:RemoveBlip(id)
  local blip = blips[id]

  if blip then
    RemoveBlip(blip.id)
    blips[id] = nil
  end
end

AddEventHandler("onResourceStop", function (resource)
  if resource == GetCurrentResourceName() then
    for _, blip in pairs(blips) do
      RemoveBlip(blip.blip)
    end
  end

  if resourceBlips[resource] then
    for _, blip in pairs(resourceBlips[resource]) do
      RemoveBlip(blip)
    end

    resourceBlips[resource] = nil
  end
end)

return Blips