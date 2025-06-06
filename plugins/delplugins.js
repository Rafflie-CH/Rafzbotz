const fs = require("fs")

let handler = async (m, { Sky, isCreator, text, Reply, example }) => {
if (!isCreator) return Reply(global.mess.owner)
if (!text) return m.reply(example("namafile plugins"))
if (!text.endsWith(".js")) return m.reply("Nama file harus berformat .js")
if (!fs.existsSync("./plugins/" + text.toLowerCase())) return m.reply("File plugins tidak ditemukan!")
await fs.unlinkSync("./plugins/" + text.toLowerCase())
return m.reply(`Berhasil menghapus file plugins *${text.toLowerCase()}*`)
}

handler.command = ["delplugins", "delplugin"]

module.exports = handler