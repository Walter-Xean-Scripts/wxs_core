---@type Foact
local Foact = WXSCore.Foact
local PBUI = Foact.new("wxscore_progressbar")

local progressText = PBUI:createElement("Text", {
    text = "",
    color = "white",
    fontSize = "1.25rem",
    fontWeight = "bold",
    textAlign = "center",
    position = "absolute",
    top = "50%",
    left = "50%",
    transform = "translate(-50%, -50%)"
})

local barFiller = PBUI:createElement("Box", {
    height = "100%",
    width = "0%",
    backgroundColor = "rgba(255, 255, 255, 0.5)",
    borderRadius = "0.25rem",
    transition = "all 5s ease"
})

local barContainer = PBUI:createElement("Box", {
    height = "50px",
    width = "300px",
    backgroundColor = "rgba(25, 25, 25, 0.95)",
    position = "absolute",
    bottom = "100px",
    left = "50%",
    borderRadius = "0.25rem",
    transform = "translateX(-50%)",
}, {
    barFiller,
    progressText
})

PBUI:initialize(barContainer)

exports("StartProgress", function(time, text, color, callback, blockInput)
    barFiller.width = "0%"
    Wait(50)
    barFiller.transition = "all " .. time .. "s linear"
    barFiller.backgroundColor = color

    progressText.text = text

    if blockInput == nil then
        blockInput = false
    end

    PBUI:SetActive(true, blockInput)

    Wait(50)
    barFiller.width = "100%"

    Citizen.CreateThread(function()
        Citizen.Wait(time * 1000)
        PBUI:SetActive(false, false)
        callback()
    end)
end)

RegisterNetEvent("WXSCore:Client:Progressbar", function(time, text, color, callback, blockInput)
    exports.StartProgress(time, text, color, callback, blockInput)
end)
