let handler = async function (m, { command, isCreator, example, text, Reply, capital }) {
if (!isCreator) return Reply(mess.owner)
if (!text) return m.reply(example("on/off"))
if (!/on|off/.test(text)) return m.reply(example("on/off"))
let event
let name
let actions 
if (command == "autoread") {
event = global.db.settings.autoread
name = "Autoread"
actions = async (kondisi) => {
global.db.settings.autoread = kondisi
}
}
if (command == "autopromosi") {
event = global.db.settings.autopromosi
name = "Autopromosi"
actions = async (kondisi) => {
global.db.settings.autopromosi = kondisi
}
}
if (command == "autotyping") {
name = "Autotyping"
event = global.db.settings.autotyping
actions = async (kondisi) => {
global.db.settings.autotyping = kondisi
}
}
if (command == "autoreadsw") {
event = global.db.settings.readsw
name = "Autoreadsw"
actions = async (kondisi) => {
global.db.settings.readsw = kondisi
}
}
if (text == "on") {
if (event == true) return m.reply(`*${name} sudah aktif!*`)
actions(true)
m.reply(`*${name} berhasil di aktifkan ✅*`)
}
if (text == "off") {
if (event == false) return m.reply(`*${name} sudah tidak aktif!*`)
actions(false)
m.reply(`*${name} berhasil di matikan ✅*`)
}
}

handler.command = ["autoread", "autopromosi", "autotyping", "autoreadsw"]

module.exports = handler