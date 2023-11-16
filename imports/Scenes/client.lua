---@class SceneHandler
local SceneHandler = {}

---@type Streaming
local Streaming = WXSCore.Streaming

---Don't call this unless you know what you're doing. Start calls this automatically.
function SceneHandler.LoadSceneData(self)
    if not self.loadedAnims then self.loadedAnims = {} end
    if not self.loadedModels then self.loadedModels = {} end

    if self.sceneData.actorAnims then
        for _, v in ipairs(self.sceneData.actorAnims) do
            if not self.loadedAnims[v.dir] then
                Streaming:RequestAnimDictSync(v.dir)
                self.loadedAnims[v.dir] = true
            end
        end
    end

    if self.sceneData.objectAnims then
        for _, v in ipairs(self.sceneData.objectAnims) do
            if not self.loadedAnims[v.dir] then
                Streaming:RequestAnimDictSync(v.dir)
                self.loadedAnims[v.dir] = true
            end
        end
    end

    if self.sceneData.objects then
        for _, v in ipairs(self.sceneData.objects) do
            if not self.loadedModels[v] then
                Streaming:RequestModelSync(v)
                self.loadedModels[v] = true
            end
        end
    end
end

---The function for starting your scene. Remeber to add a callback or await it's completion if you need logic after it's done.
function SceneHandler.Start(self)
    if not self.sceneObjects then self.sceneObjects = {} end
    if not self.spawedObjects then self.spawedObjects = {} end

    SceneHandler.LoadSceneData(self)

    local addZ = 0.0
    if self.useDelaZ then
        addZ = self.sceneData.deltaZ
    end

    self.sceneId = NetworkCreateSynchronisedScene(self.sceneLocation.x, self.sceneLocation.y, self.sceneLocation.z + addZ,
        self.sceneRotation.x, self.sceneRotation.y, self.sceneRotation.z, 2, not self.looped, self.looped, 1.0, 0.0, 1.0);

    if self.sceneData.actorAnims then
        for index, v in ipairs(self.sceneData.actorAnims) do
            NetworkAddPedToSynchronisedScene(self.actors[index], self.sceneId, v.dir, v.name, 8.0, 8.0, 0, 0, 1000.0, 0)
        end
    end

    if self.sceneData.objectAnims then
        if not self.manualSpawn then
            for index, object in ipairs(self.sceneData.objectAnims) do
                if self.spawedObjects[index] then
                    NetworkAddEntityToSynchronisedScene(self.spawedObjects[index], self.sceneId, object.dir, object.name,
                        8.0, 8.0, 0)
                else
                    local sceneObject = self.sceneData.objects[index]

                    local model = type(sceneObject) == "string" and GetHashKey(sceneObject) or sceneObject
                    local newObject <const> = CreateObject(model, self.sceneLocation.x, self.sceneLocation.y,
                        self.sceneLocation.z, true, true, false)
                    table.insert(self.spawedObjects, newObject)
                    NetworkAddEntityToSynchronisedScene(newObject, self.sceneId, object.dir, object.name, 8.0, 8.0, 0)
                end
            end
        else
            for index, object in ipairs(self.sceneData.objectAnims) do
                NetworkAddEntityToSynchronisedScene(self.spawedObjects[index], self.sceneId, object.dir, object.name, 8.0,
                    8.0, 0)
            end
        end
    end

    if self.addCamera and self.sceneData.cameraAnim then
        self.cam = CreateCam("DEFAULT_ANIMATED_CAMERA", true)
        SetCamActive(self.cam, true)
        RenderScriptCams(true, false, 3000, true, false)
        PlayCamAnim(self.cam, self.sceneData.cameraAnim.name, self.sceneData.cameraAnim.dir, self.sceneLocation.x,
            self.sceneLocation.y, self.sceneLocation.z, self.sceneRotation.x, self.sceneRotation.y, self.sceneRotation.z,
            false, 2)
    end

    if self.looped then
        SetSynchronizedSceneLooped(self.sceneId, true)
    end
    SetSynchronizedScenePhase(self.sceneId, 0.0)
    NetworkStartSynchronisedScene(self.sceneId)

    if self.looped then
        return
    end

    CreateThread(function()
        if self.sceneData.actorAnims then
            Wait(self.sceneData.actorAnims[1].animIndex)
        else
            Wait(self.sceneData.objectAnims[1].animIndex)
        end

        if not self.prevntStop then
            SceneHandler.Stop(self)
        end

        if self.callback then
            self.callback()
        end
    end)
end

---Sets the actors of the scene
---@param self SceneHandler
---@param actors table
function SceneHandler.SetActors(self, actors)
    self.actors = actors
end

---Gets the shouldDelete boolean
---@return boolean?
function SceneHandler.ShouldDelete(self)
    return self.shouldDelete
end

---Sets the shouldDelete boolean
---@param shouldDelete boolean
function SceneHandler.SetShouldDelete(self, shouldDelete)
    self.shouldDelete = shouldDelete
end

function SceneHandler.ShouldAutoStop(self)
    return self.prevntStop
end

---Sets the prevntStop boolean
---@param shouldAutoStop boolean
function SceneHandler.SetShouldAutoStop(self, shouldAutoStop)
    self.prevntStop = not shouldAutoStop
end

---This can NOT be used with AwaitCompletion, this is meant as an alternative to AwaitCompletion.
---@param callback function
function SceneHandler.SetCallback(self, callback)
    self.callback = callback
end

---This will override the callback, this is meant as an alternative to the callback
---@return unknown
function SceneHandler.AwaitCompletion(self)
    local p = promise.new()

    self.SetCallback(self, function()
        p:resolve()
    end)

    return Citizen.Await(p)
end

function SceneHandler.StopAndDelete(self)
    self.shouldDelete = true
    self.Stop(self)
end

---Stops an ongoing scene
function SceneHandler.Stop(self)
    self.stopped = true
    NetworkStopSynchronisedScene(self.sceneId)

    if self.shouldDelete then
        if self.cam then
            self:DestroyCam()
        end

        for _, v in pairs(self.spawedObjects) do
            DeleteObject(v)
        end
    end
end

function SceneHandler.DestroyCam(self)
    RenderScriptCams(false, true, 500, true, false);
    DestroyCam(self.cam, false);
end

---Sets the props of the scene, so that the scene wont spawn new ones on start.
---@param props any
function SceneHandler.SetProps(self, props)
    if not self.spawedObjects then self.spawedObjects = {} end

    for index, value in ipairs(props) do
        self.spawedObjects[index] = value
    end
end

function SceneHandler.SetProp(self, index, prop)
    if not self.spawedObjects then self.spawedObjects = {} end
    self.spawedObjects[index] = prop
end

---Gets the props spawned by the scene handler, or if set, the props set by the SetProps function.
---@return table?
function SceneHandler.GetProps(self)
    return self.spawedObjects
end

---@return SceneHandler
function SceneHandler.new(prototype)
    local class = {
        __index = function(self, key)
            if type(prototype[key]) == "function" then
                return function(...)
                    return prototype[key](...)
                end
            else
                return prototype[key]
            end
        end
    }

    function class.new(obj)
        return setmetatable(obj, class)
    end

    return class
end

--[[
    Usage of our scene handler code above.
]]
   --
local sceneHandler = SceneHandler.new(SceneHandler)
local Scene = {}

---@param sceneData SyncronizedScene
---@param sceneLocation Vector3
---@param sceneRotation Vector3
---@param actors table
---@param looped boolean
---@param useDelaZ boolean
---@param addCamera boolean
---@param manualSpawn boolean
---@return SceneHandler
function Scene:Create(sceneData, sceneLocation, sceneRotation, actors, looped, useDelaZ, addCamera, manualSpawn)
    local test = sceneHandler.new({
        sceneData = sceneData,
        sceneLocation = sceneLocation,
        sceneRotation = sceneRotation,
        actors = actors,
        looped = looped,
        useDelaZ = useDelaZ,
        addCamera = addCamera,
        manualSpawn = manualSpawn
    })

    return test
end

return Scene
