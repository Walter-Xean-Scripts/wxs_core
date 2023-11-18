local loadedLocale = {}

local function localeString(str, ...)
    local translatedString = loadedLocale[str]

    if not translatedString then
        print("^1[FW] Attempted to translate invalid string: " .. str)
        return str
    end

    if ... then
        translatedString = string.format(translatedString, ...)
    end

    return translatedString
end

local Locale = setmetatable({}, {
    __call = localeString
})

function Locale:Load()
    local locale = GetConvar('wxs:locale', 'en')
    local path = "locales/" .. locale .. ".json"
    local file = LoadResourceFile(GetCurrentResourceName(), path)
    local data = json.decode(file)

    if not data then
        print("Failed to load locale file: " .. path)
        return
    end

    loadedLocale = data
end

return Locale
