fx_version 'cerulean'

games { "gta5" }

author "Walter & Xean Scripts"
version '1.0.0'

lua54 'yes'

client_scripts {
  'client/*.lua',
}

files {
  'main.lua',
  'imports/**/client.lua',
  'imports/**/shared.lua',
  'web/build/index.html',
  'web/build/assets/**/*',
}

ui_page 'web/build/index.html'
