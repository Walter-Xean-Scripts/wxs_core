# Accept params
[CmdletBinding()]
param(
    [Parameter(Mandatory = $false)]
    [string]$title
)
# If not title read from host (Read-Host "What scene would you like to load (Name)")
$title = $title.Trim()
if ($title -eq "") {
    $title = Read-Host "What scene would you like to load (Name)"
}

$sceneDirectoryAnims = Select-Xml -Path "./SceneDirectorSynchedAnim.xml" -XPath 'SynchedAnimations/SynchedAnim'

if ($title -eq "") {
    Write-Host "Invalid scene title, exiting..."
    return
}

$sceneDirectoryAnim = $sceneDirectoryAnims | Where-Object { $_.Node.Title -eq $title }
if ($null -eq $sceneDirectoryAnim) {
    Write-Host "Invalid scene title, exiting..."
    return
}
class AnimData {
    [int]$id
    [string]$dir
    [string]$name
    [int]$animIndex
}
function Get-SceneData {
    param(
        [Parameter(Mandatory = $true)]
        [int]$animId
    )

    $animData = Select-String -Path "./SceneDirectorAnim.txt" -Pattern "^0{0,5}$animId" | Select-Object -First 1
    if ($null -eq $animData) {
        return $null
    }
    $animData = $animData.Line.Split(" ")

    $dir = $animData[1]
    $name = $animData[2]
    $animIndex = $animData[3]

    return [AnimData]@{
        id        = $animId
        dir       = $dir
        name      = $name
        animIndex = $animIndex
    }
}

function Get-CamAnimationForScene {
    param(
        [Parameter(Mandatory = $true)]
        [AnimData]$scene
    )

    # Remove last part of scene name, unless it's the only part
    $animName = ($scene.name -split "_" | Select-Object -First ($scene.name.Split("_").Length - 1)) -join "_"
    if ($animName -eq "") {
        $animName = $scene.name
    }

    $pattern = "$($scene.dir) $($animName)_cam"
    $camLine = Select-String -Path "./SceneDirectorAnim.txt" -Pattern $pattern | Select-Object -First 1
    if ($null -eq $camLine) {
        return $null
    }

    $camData = $camLine.Line.Split(" ")

    $camId = $camData[0]
    $camDir = $camData[1]
    $camName = $camData[2]
    $camAnimIndex = $camData[3]

    return [AnimData]@{
        id        = $camId
        dir       = $camDir
        name      = $camName
        animIndex = $camAnimIndex
    }
}


$sceneAnim = $sceneDirectoryAnim.Node
$actorsAligned = $sceneAnim.ActorsAligned
$deltaZ = $sceneAnim.DeltaZ

$cameraAnimations = @()
$actorAnimations = @()
$objectAnimations = @()
$objects = @()

# Get children of sceneAnim
foreach ($child in $sceneAnim.ChildNodes) {
    $animId = $child.animIndex
    $scene = Get-SceneData -animId $animId

    if ($child.Name -eq "ActorAnim") {
        if ($null -ne $animId) {
            $actorAnimations += $scene
            $cameraAnimations += Get-CamAnimationForScene -scene $scene
        }
    }
    elseif ($child.Name -eq "ObjectAnim") {
        if ($null -ne $animId) {
            $objectAnimations += $scene
        }
    }
    elseif ($child.Name -eq "Object") {
        $objects += $child.propName
    }
}

$cameraAnimations = $cameraAnimations | Where-Object { $_ -ne $null }

# Escape single quotes function.
function Format-SingleQuotes {
    param(
        [Parameter(Mandatory = $true)]
        [string]$string
    )

    return $string.Replace("'", "\'")
}

# Const tab width
$tab = "    "
$luaTable = @("{")
$luaTable += "$tab['title'] = '$(Format-SingleQuotes $title)',"
$luaTable += "$tab['actorsAligned'] = $actorsAligned,"
$luaTable += "$tab['deltaZ'] = $deltaZ,"
if ($actorAnimations.Length -gt 0) {
    $luaTable += "$tab['actorAnims'] = {"
    foreach ($actorAnimation in $actorAnimations) {
        $luaTable += "$tab$tab{"
        $luaTable += "$tab$tab$tab['id'] = $($actorAnimation.id),"
        $luaTable += "$tab$tab$tab['dir'] = '$($actorAnimation.dir)',"
        $luaTable += "$tab$tab$tab['name'] = '$($actorAnimation.name)',"
        $luaTable += "$tab$tab$tab['animIndex'] = $($actorAnimation.animIndex)"
        $luaTable += "$tab$tab},"
    }
    $luaTable += "$tab},"
}
if ($objectAnimations.Length -gt 0) {
    $luaTable += "$tab['objectAnims'] = {"
    foreach ($objectAnimation in $objectAnimations) {
        $luaTable += "$tab$tab{"
        $luaTable += "$tab$tab$tab['id'] = $($objectAnimation.id),"
        $luaTable += "$tab$tab$tab['dir'] = '$($objectAnimation.dir)',"
        $luaTable += "$tab$tab$tab['name'] = '$($objectAnimation.name)',"
        $luaTable += "$tab$tab$tab['animIndex'] = $($objectAnimation.animIndex)"
        $luaTable += "$tab$tab},"
    }
    $luaTable += "$tab},"
}
if ($cameraAnimations.Length -gt 0) {
    $luaTable += "$tab['cameraAnim'] = {"
    $luaTable += "$tab$tab['id'] = $($cameraAnimations[0].id),"
    $luaTable += "$tab$tab['dir'] = '$($cameraAnimations[0].dir)',"
    $luaTable += "$tab$tab['name'] = '$($cameraAnimations[0].name)',"
    $luaTable += "$tab$tab['animIndex'] = $($cameraAnimations[0].animIndex)"
    $luaTable += "$tab},"
}
if ($objects.Length -gt 0) {
    $luaTable += "$tab['objects'] = {"
    foreach ($object in $objects) {
        $luaTable += "$tab$tab``$object``,"
    }
    $luaTable += "$tab},"
}


$luaTable += "}"
$luaTable = $luaTable | Out-String

Set-Clipboard -Value $luaTable
Write-Host "Copied to clipboard"