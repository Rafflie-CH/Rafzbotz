const fs = require("fs")

let handler = async (m, { Sky, isCreator, Reply, text, example }) => {
if (!isCreator) return Reply(global.mess.owner)
if (!text) return m.reply(example("namafile plugins nya"))
if (!text.endsWith(".js")) return m.reply("Nama file harus berformat .js")
if (!fs.existsSync("./plugins/" + text.toLowerCase())) return m.reply("File plugins tidak ditemukan!")
let res = await fs.readFileSync("./plugins/" + text.toLowerCase())
return m.reply(`${res.toString()}`)
}

handler.command = ["getp", "gp", "getplugins", "getplugin"]

module.exports = handler