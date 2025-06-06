const { writeExif } = require(process.cwd()+"/lib/sticker");
const axios = require('axios')

module.exports = {
    command: "smeme", //- Nama fitur nya
    alias: ["stickermeme", "stickmeme"], //- Short cut command
    category: ["tools"], //- Kategori Fitur 
    settings: {
        owner: false, //-  Apakah Fitur ini khusus owner ?
        group: false, // - Apakah Fitur ini khusus group ?
     },
    description: "buat sticker foto smeme", //- Penjelasan tentang fitur nya
    loading: true, //- Ingin menambahkan loading messages ?
 async run(m, { sock, Func, Scraper, text, config }) {

if (!/webp/.test(m.quoted.msg.mimetype) && /image/.test(m.quoted.msg.mimetype)) {
if (!text) return m.reply(`Usage: ${prefix + command} text1|text2`)

atas = text.split('|')[0] ? text.split('|')[0] : '-'
bawah = text.split('|')[1] ? text.split('|')[1] : '-'
const { catbox } = require(process.cwd()+"/lib/uploader")
const k = await m.quoted.download()
let mem = await catbox(k)
let meme = `https://api.memegen.link/images/custom/${encodeURIComponent(atas)}/${encodeURIComponent(bawah)}.png?background=${mem}`
        let media = await getBuffer(meme)
        let sticker = await writeExif(
          {
            mimetype: "image",
            data: media,
          },
          {
            packName: config.sticker.packname,
            packPublish: config.sticker.author,
          },
        );
        await m.reply({ sticker });
       }
    }
}

const getBuffer = async (url, options) => {
	try {
		options ? options : {}
		const res = await axios({
			method: "get",
			url,
			headers: {
				'DNT': 1,
				'Upgrade-Insecure-Request': 1
			},
			...options,
			responseType: 'arraybuffer'
		})
		return res.data
	} catch (err) {
		return err
	}
}
