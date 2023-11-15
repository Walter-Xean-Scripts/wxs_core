---@type Foact
local Foact = WXSCore.Foact
---@class Dialogue
local Dialogue = {}
local DialogueMenu = Foact.new("WXDialogue")

local name = DialogueMenu:createElement("Title", {
    text = "MR JOHANSON",
    margin = "0px",
    padding = "0px",
})

local context = DialogueMenu:createElement("Title", {
    text = "👋 STRANGER",
    margin = "0px",
    padding = "0px",
})

local nameContainer = DialogueMenu:createElement("Box", {
    display = "flex",
    flexDirection = "column",

    position = "absolute",
    left = "60px",
    top = "50px",

    width = "300px",
    height = "100px",

    transform = "skewY(5deg)",
}, {
    name,
    context
})

local topLeftGlowBall = DialogueMenu:createElement("Box", {
    position = "absolute",
    left = "-100px",
    top = "-100px",

    width = "100px",
    height = "100px",

    borderRadius = "50%",
    backgroundColor = "transparent",
    boxShadow = "0 0 60px 30px #fff, 0 0 100px 60px #f0f, 0 0 140px 90px #0ff",
    opacity = "0.7"
})

local bottomRightGlowBall = DialogueMenu:createElement("Box", {
    position = "absolute",
    right = "-100px",
    bottom = "-100px",

    width = "100px",
    height = "100px",

    borderRadius = "50%",
    backgroundColor = "transparent",
    boxShadow = "0 0 60px 30px #fff, 0 0 100px 60px #f0f, 0 0 140px 90px #0ff",
    opacity = "0.7"
})

local vignette = DialogueMenu:createElement("Box", {
    position = "fixed",
    left = "0px",
    top = "0px",

    width = "100vw",
    height = "100vh",

    background = "radial-gradient(transparent 20%, black)",
    zIndex = "-1",
})

local function messageLayout(senderName, text)
    local elem1 = DialogueMenu:createElement("Title", {
        text = senderName,
        margin = "0px",
        padding = "0px",
    })
    local elem2 = DialogueMenu:createElement("Text", {
        text = text,
        margin = "0px",
        padding = "0px",
        fontSize = "1rem",
    })

    return elem1, elem2
end

local function createPreviousOutgoingDialogue(senderName, text)
    local elem1, elem2 = messageLayout(senderName, text)
    local newElement = DialogueMenu:createElement("Box", {
        display = "flex",
        flexDirection = "column",

        width = "fit-content",
        minWidth = "300px",
        height = "auto",

        alignSelf = "flex-end",

        padding = "10px",
        marginBottom = "10px",

        borderRadius = "5px",
        backgroundColor = "#4da7c1",
        border = "1px solid #fff",
    }, {
        elem1,
        elem2
    })

    return newElement, elem1, elem2
end

local function createPreviousIncomingDialogue(senderName, text)
    local elem1, elem2 = messageLayout(senderName, text)
    local newElement = DialogueMenu:createElement("Box", {
        display = "flex",
        flexDirection = "column",

        width = "fit-content",
        minWidth = "300px",
        height = "auto",

        float = "left",

        padding = "10px",
        marginBottom = "10px",

        borderRadius = "5px",
        backgroundColor = "rgba(150, 150, 150, 0.85)",
        border = "1px solid #fff",
    }, {
        elem1,
        elem2
    })

    return newElement, elem1, elem2
end

local previousDialogue = DialogueMenu:createElement("Box", {
    display = "flex",
    flexDirection = "column",
    marginTop = "15px",
    marginBottom = "25px",

    height = "fit-content",
    width = "100%",

    transform = "skewY(-5deg) rotate(180deg)",

    direction = "ltr",
})

local rotatedPrevDialogue = DialogueMenu:createElement("Box", {
    position = "absolute",
    right = "50px",
    bottom = "35vh",
    width = "30vw",
    height = "fit-content",
    maxHeight = "65vh",
    overflowY = "auto",
    transform = "rotate(180deg)",
    direction = "rtl",
}, {
    previousDialogue
})

local function createDialogueOption(text, onClick)
    local newElement = DialogueMenu:createElement("Button", {
        text = text,
        onClick = onClick,
        width = "100%",
        height = "100%",
        background = "rgba(150, 150, 150, 0.5)",
        border = "1px solid #fff",
        borderRadius = "5px",
        fontSize = "1.25rem",
        disabled = false
    })

    return newElement
end

local dialogueOptions = DialogueMenu:createElement("Box", {
    position = "absolute",
    right = "40px",
    bottom = "0px",

    width = "30vw",
    height = "30vh",

    display = "grid",
    gridTemplateColumns = "1fr 1fr",
    gridTemplateRows = "0.3fr 0.3fr",
    gridGap = "10px",
    justifyContent = "end",

    padding = "10px",

    transform = "skewY(-5deg)",
})

local dialogueContainer = DialogueMenu:createElement("Box", {
    width = "100vw",
    height = "100vh",
    margin = "0px",
    padding = "0px",
    position = "absolute",
    top = "0px",
    left = "0px",
    overflow = "hidden",
    transition = "all 0.5s ease-in-out",
}, {
    topLeftGlowBall,
    bottomRightGlowBall,
    vignette,
    nameContainer,
    rotatedPrevDialogue,
    dialogueOptions
})

DialogueMenu:initialize(dialogueContainer)

local dialogueButtons = {}
local previousDialogueElements = {}

local function typewriterEffect(element, fullText, shouldntEnable, cb)
    local lenght = string.len(fullText)
    Citizen.CreateThread(function()
        for _, button in pairs(dialogueButtons) do
            button.disabled = true
        end

        for i = 1, lenght do
            local text = string.sub(fullText, 1, i)
            element.text = text
            Citizen.Wait(50)
        end

        if not shouldntEnable then
            for _, button in pairs(dialogueButtons) do
                button.disabled = false
            end
        end

        if cb then
            cb()
        end
    end)
end

local currentName = ""
function Dialogue:SetOptions(...)
    local options = { ... }
    for _, button in pairs(dialogueButtons) do
        dialogueOptions:remove(button)
    end

    for _, option in ipairs(options) do
        local createdOption = createDialogueOption(option.text, function()
            local outgoingDialogue, _, whatSaying = createPreviousOutgoingDialogue("YOU", "")
            previousDialogue:add(outgoingDialogue)
            table.insert(previousDialogueElements, outgoingDialogue)

            typewriterEffect(whatSaying, option.text, true, function()
                option.onClick()
            end)
        end)
        dialogueOptions:add(createdOption)
        table.insert(dialogueButtons, createdOption)
    end
end

function Dialogue:AddAnswer(answer, cb)
    local incomingDialogue, _, whatSaying = createPreviousIncomingDialogue(currentName, "")
    previousDialogue:add(incomingDialogue)
    table.insert(previousDialogueElements, incomingDialogue)

    typewriterEffect(whatSaying, answer, false, cb)
end

local pedCamera = nil
local IK_HEAD <const> = 12844
local function ZoomInOnPedFace(ped)
    pedCamera = CreateCamera('DEFAULT_SCRIPTED_CAMERA', true)
    local pedOffset <const> = GetOffsetFromEntityInWorldCoords(ped, 0.0, 0.6, 0.65)

    SetCamCoord(pedCamera, pedOffset.x, pedOffset.y, pedOffset.z)

    local pedHeadBone <const> = GetPedBoneCoords(ped, IK_HEAD, 0.0, 0.0, 0.0)
    PointCamAtCoord(pedCamera, pedHeadBone.x, pedHeadBone.y, pedHeadBone.z)
    SetCamActiveWithInterp(pedCamera, GetRenderingCam(), 2, 1, 1)
    RenderScriptCams(true, true, 500, true, false)
end

function Dialogue:Start(ped, newName, relationship)
    currentName = newName:upper()
    name.text = currentName
    context.text = "👋 " .. relationship:upper()

    DialogueMenu:SetActive(true, true)
    ZoomInOnPedFace(ped)
end

function Dialogue:ResetConversation()
    for _, element in ipairs(previousDialogueElements) do
        previousDialogue:remove(element)
    end
    previousDialogueElements = {}
end

function Dialogue:Stop()
    DialogueMenu:SetActive(false, false)

    for _, button in pairs(dialogueButtons) do
        button.disabled = false
    end

    if pedCamera then
        RenderScriptCams(false, true, 500, true, false)
        DestroyCam(pedCamera, true)
        pedCamera = nil
    end
end

return Dialogue
