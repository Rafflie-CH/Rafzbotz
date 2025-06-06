const fs = require("fs")

let handler = async (m, { Sky, isCreator, text, Reply, example }) => {
if (!isCreator) return Reply(global.mess.owner)
if (!text) return m.reply(example("namafile & reply code"))
if (!m.quoted || !m.quoted.text) return m.reply(example("namafile & reply code"))
if (!text.endsWith(".js")) return m.reply("Nama file harus berformat .js")
let kondisi = "menambah"
if (fs.existsSync("./plugins/" + text)) return m.reply("Nama file plugins sudah terdaftar di dalam folder plugins!")
let teks = m.quoted.text
await fs.writeFileSync("./plugins/" + text, teks)
return m.reply(`Berhasil ${kondisi} file plugins *${text}*`)
}

handler.command = ["addplugins", "addplugin", "addp", "addplug"]

module.exports = handler