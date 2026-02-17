/* 

=========================================================================

  #- Credits By Skyzopedia
   Contact: https://6285624297893
   Youtube: https://youtube.com/@skyzodev
   Telegram: https://t.me/skyzodev
   Recode by : Lynzz YT
    
  Developer : https://wa.me/6285624297893
  
  -[ ! ]- Jangan hapus contact developer! hargai pembuat script ini

=========================================================================

*/

const fs = require('fs');
const chalk = require('chalk');
const { version } = require("./package.json")

// Settings Bot 
global.owner = '6281521902652'
global.versi = version
global.namaOwner = "RAFZZ"
global.packname = 'SAN (SEKTE ANTI NYOLONG)' 
global.author = 'Rafzbot BY YT: MC RafflieAditya CH'
global.botname = 'RAFZ BOT BY RAFZZ'
global.botname2 = 'RAFZ BOT'
global.paircode = 'RAFZCODE' // Kode Pairing 

global.tempatDB = 'database.json' // Jangan ubah
global.pairing_code = true // Jangan ubah

// Settings Link / Tautan
global.linkOwner = "https://wa.me/6281521902652"
global.linkGrup = "https://chat.whatsapp.com/FydI8suEWKH82hMCXGZXwT"

// Delay Jpm & Pushctc || 1000 = 1detik
global.delayJpm = 3500
global.delayPushkontak = 6000

// Settings Channel / Saluran
global.linkSaluran = "https://whatsapp.com/channel/0029VbAUJuR4o7qJhpARGn1b"
global.idSaluran = "120363420035429023@newsletter"
global.namaSaluran = "ALZ || PRST"
global.saluranDataLogin = "120363416326771537@newsletter" // isi dengan id saluran penyimpanan Data login bot
global.idupchbrat = "120363400173226744@newsletter" // isi dengan id saluran yg di gunakan untuk upload stiker brat

global.merchantIdOrderKuota = "-"
global.apiOrderKuota = "-"
global.qrisOrderKuota = "-"

// Settings Api Digital Ocean
global.apiDigitalOcean = "-"

// Settings Api Digital Ocean
global.apiSimpelBot = "new2025"


// Settings All Payment
global.dana = "6281521902652"
global.ovo = "Tidak Tersedia"
global.gopay = "Tidak Tersedia"

// Settings Image Url
global.image = {
menu: "https://img101.pixhost.to/images/77/546441106_skyzopedia.jpg", 
reply: "https://img101.pixhost.to/images/77/546441106_skyzopedia.jpg", 
logo: "https://img101.pixhost.to/images/77/546441106_skyzopedia.jpg", 
dana: "https://img100.pixhost.to/images/667/540082364_skyzopedia.jpg", 
ovo: "https://img100.pixhost.to/images/667/540082774_skyzopedia.jpg", 
gopay: "https://img100.pixhost.to/images/667/540083275_skyzopedia.jpg", 
qris: "https://img100.pixhost.to/images/667/540080636_skyzopedia.jpg"
}

// Settings Api Panel Pterodactyl
global.egg = "15" // Egg ID
global.nestid = "5" // nest ID
global.loc = "1" // Location ID
global.domain = "https://-"
global.apikey = "-" //ptla
global.capikey = "-" //ptlc

// Settings Api Panel Pterodactyl Server 2
global.eggV2 = "15" // Egg ID
global.nestidV2 = "5" // nest ID
global.locV2 = "1" // Location ID
global.domainV2 = "https://-"
global.apikeyV2 = "-" //ptla
global.capikeyV2 = "-" //ptlc

// Settings Api Subdomain
global.subdomain = {
"privatehost.us.kg": {
"zone": "790918217c4add75b7684458518c5836", 
"apitoken": "qYv4NvEN6ZcUIv4dEXihjkmQMwbP_-3Qy_zFlAHv"
}, 
"botwhatsapp.us.kg": {
"zone": "fb1ac418c5564373a56c91d962b30dca", 
"apitoken": "rfQih0XNXiq7AyEuDoLjoFfHX2mhYf_9kddAdKIo"
}, 
"skyzopedia.us.kg": {
"zone": "9e4e70b438a65c1d3e6d0e48b82d79de", 
"apitoken": "odilM9DpvLVPodbPyZwW7UcDKg1aIWsivJc0Vt_o"
}, 
"marketplace.us.kg": {
"zone": "2f33118c3db00b12c38d07cf1c823ed1", 
"apitoken": "6WS_Op6yuPOWcO17NiO-sOP8Vq9tjSAFZyAn82db"
}, 
"pteroserver.us.kg": {
"zone": "f693559a94aebc553a68c27a3ffe3b55", 
"apitoken": "ZPAXx7CL51PtbGweL2pE3BsI3x0hgTgLuy56iXuo"
}, 
"digitalserver.us.kg": {
"zone": "df13e6e4faa4de9edaeb8e1f05cf1a36", 
"apitoken": "HXVf4soYFM3iiOewHZ6tk6LEnG9f7m7CVhU0EoVz"
}, 
"xyz-store.biz.id": {
"zone": "8ae812c35a94b7bd2da993a777b8b16d", 
"apitoken": "oqZafkd3mSt1bABD9MMTidpCtD9VZdiPTjElVKJB"
}, 
"shopserver.us.kg": {
"zone": "54ca38e266bfdf2dcdb7f51fd79c2db5", 
"apitoken": "4qOupI-Of-6yNrBaeS1-H0KySuKCd0wS-x0P5XQ4"
}
}

// Message Command 
global.mess = {
    saluran:"*Akses Ditolak*\n*Fitur ini hanya untuk saluran Alz*\n*Ingin mendapat Akses?*\n*Minta Alz atau Owner bot ini mengetik .izinsaluran*",
	owner: "* *Akses Ditolak*\nFitur ini hanya untuk owner bot!",
	admin: "* *Akses Ditolak*\nFitur ini hanya untuk admin grup!",
	botAdmin: "* *Akses Ditolak*\nFitur ini hanya untuk ketika bot menjadi admin!",
	group: "* *Akses Ditolak*\nFitur ini hanya untuk dalam grup!",
	private: "* *Akses Ditolak*\nFitur ini hanya untuk dalam private chat!",
	prem: "* *Akses Ditolak*\nFitur ini hanya untuk user premium!",
    register: "* *Akses Ditolak*\nFitur ini hanya untuk user terdaftar!\nUntuk menjadi pengguna terdaftar silahkan daftar dengan mengetikkan .register",
	wait: 'Loading...',
	error: 'Error!',
	done: 'Done'
}
let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
})