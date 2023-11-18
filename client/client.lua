local isNuiReady = false

RegisterNUICallback("nuiReady", function(body, resultCallback)
    isNuiReady = true
    resultCallback(true)
end)

exports("LoadUI", function(uiName, elements)
    local tries = 0
    while not isNuiReady and tries < 100 do
        Wait(50)
        tries = tries + 1
    end

    if not isNuiReady then
        error("NUI never got ready?")
        return
    end

    SendNUIMessage({
        action = "loadUI",
        data = {
            name = uiName,
            data = elements
        }
    })
end)

exports("SetActive", function(uiName, active, focus)
    SetNuiFocus(active, focus)
    SendNUIMessage({
        action = "setActive",
        data = {
            active = active,
            id = uiName
        }
    })
end)

exports("UpdateUI", function(uiName, elementId, key, value)
    SendNUIMessage({
        action = "updateUiById",
        data = {
            name = uiName,
            id = elementId,
            key = key,
            value = value
        }
    })
end)

exports("UpdateChildren", function(uiName, elementId, children)
    SendNUIMessage({
        action = "updateChildren",
        data = {
            name = uiName,
            id = elementId,
            children = json.encode(children)
        }
    })
end)

exports("SendNotification", function(type, title, message, duration, placement)
    SendNUIMessage({
        action = "notification",
        data = {
            type = type,
            title = title,
            message = message,
            duration = duration,
            placement = placement
        }
    })
end)

RegisterNetEvent("WXSCore:Client:Notification", function(type, title, message, duration, placement)
    SendNUIMessage({
        action = "notification",
        data = {
            type = type,
            title = title,
            message = message,
            duration = duration,
            placement = placement
        }
    })
end)


RegisterKeyMapping("clearNotifs", "Clear Notifications", "keyboard", "delete")
RegisterCommand("clearNotifs", function()
    SendNUIMessage({
        action = "clearNotifications",
        data = true
    })
end, false)

RegisterNUICallback("CallFnRef", function(body, resultCallback)
    TriggerEvent("Foact:CallFnRef", body.fnRefName, table.unpack(body.args))
    resultCallback(true)
end)
