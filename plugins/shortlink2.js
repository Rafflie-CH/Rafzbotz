const axios = require("axios")
const { generateWAMessageFromContent, proto } = require("@whiskeysockets/baileys")

let handler = async (m, { Sky, example, text }) => {
if (!text) return m.reply(example("linknya"))
if (!text.startsWith("http://") && !text.startsWith("https://")) return m.reply("Link tautan tidak valid")
await axios.get(`https://widipe.com/isgd?link=${text.toLowerCase()}`).then(async (e) => {
let result = e.data
const link = `  
* *Shortlink by is.gd*
 ${result.hasil.shorturl}
`.toString()
return m.reply(link)
}).catch(e => m.reply("Error!" + e))
}

handler.command = ["shortlink2"]

module.exports = handler