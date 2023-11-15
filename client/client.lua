exports("LoadUI", function(uiName, elements)
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

RegisterNUICallback("CallFnRef", function(body, resultCallback)
    TriggerEvent("Foact:CallFnRef", body.fnRefName, table.unpack(body.args))
    resultCallback()
end)
