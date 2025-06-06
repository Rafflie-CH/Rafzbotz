const fs = require("fs")
const path = require('path');

let handler = async (m, { Sky, isCreator, text, Reply, example }) => {
if (!isCreator) return Reply(global.mess.owner)
let dir = fs.readdirSync('./plugins')
if (dir.length < 1) return m.reply("Tidak ada file plugins")
let teks = "\n"
for (let e of dir) {
teks += `* ${e}\n`
}
m.reply(teks)
}

handler.command = ["listplugin", "listplugins"]

module.exports = handler