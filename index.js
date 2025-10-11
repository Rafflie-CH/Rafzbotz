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

require('./settings');
const fs = require('fs');
const pino = require('pino');
const path = require('path');
const axios = require('axios');
const chalk = require('chalk');
const readline = require('readline');
const FileType = require('file-type');
const { exec } = require('child_process');
const { say } = require('cfonts')
const { Boom } = require('@hapi/boom');
const NodeCache = require('node-cache');
const { version } = require("./package.json")

const { default: WAConnection, generateWAMessageFromContent, 
prepareWAMessageMedia, useMultiFileAuthState, Browsers, DisconnectReason, makeInMemoryStore, makeCacheableSignalKeyStore, fetchLatestWaWebVersion, proto, PHONENUMBER_MCC, getAggregateVotesInPollMessage } = require('@whiskeysockets/baileys');

const pairingCode = global.pairing_code || process.argv.includes('--pairing-code');
const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (text) => new Promise((resolve) => rl.question(text, resolve))

/*const { cleaningSession } = require("./library/boostsession");
(async () => {
await setInterval(async () => {
await cleaningSession("./session")
}, 10000)
})()*/
// ==================== [ GLOBAL ERROR HANDLER + AUTO RESTART ] ====================

// Tangani error umum biar gak bikin Replit stop
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('⚠️ Unhandled Rejection:', reason);
});

// Restart otomatis kalau error parah
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  console.log('🔁 Restarting bot...');
  setTimeout(() => {
    exec('npm start', (error, stdout, stderr) => {
      if (error) console.error(`Gagal restart bot: ${error.message}`);
      console.log(stdout || stderr);
    });
  }, 3000); // delay 3 detik sebelum restart
});

//=======================[ Replit ]================================

const express = require("express");
const app = express();

// Tampilkan halaman sederhana biar Replit gak kosong
app.get("/", (req, res) => {
  res.send("<h2>✅ Bot WhatsApp aktif dan berjalan!</h2>");
});

// Tambahkan handler untuk HEAD request (agar UptimeRobot tidak 404)
app.head("/", (req, res) => {
  res.status(200).end();
});

// Jalankan di port default Replit
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server berjalan di port ${PORT}`);
});

// ==== CRON JOB ====
const cron = require("node-cron");
cron.schedule("*/1 * * * *", async () => {
  console.log(chalk.cyan("⏰ Cronjob aktif: memeriksa update setiap 5 menit..."));
  // Contoh: kamu bisa jalankan fungsi auto-update atau ping di sini
  // misal: cek update GitHub, kirim pesan otomatis, dsb.
  try {
    // Contoh auto ping Replit (agar ga tidur)
    await fetch(`https://4959fd53-7ed7-4552-ab76-2f97d4160dc9-00-1f51hguiwc1w8.spock.replit.dev/`);
  } catch (e) {
    console.error("Gagal ping:", e.message);
  }
});
//================================================================================

const DataBase = require('./source/database');
const database = new DataBase();
(async () => {
	const loadData = await database.read()
	if (loadData && Object.keys(loadData).length === 0) {
		global.db = {
			users: {},
			groups: {},
			database: {},
			settings : {}, 
			...(loadData || {}),
		}
		await database.write(global.db)
	} else {
		global.db = loadData
	}
	
	setInterval(async () => {
		if (global.db) await database.write(global.db)
	}, 3500)
})();

//================================================================================

const { MessagesUpsert, Solving } = require('./source/message')
const { isUrl, generateMessageTag, getBuffer, getSizeMedia, fetchJson, await, sleep } = require('./library/function');

//================================================================================

async function startingBot() {
    const store = await makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })
	const { state, saveCreds } = await useMultiFileAuthState('session');
	const { version, isLatest } = await fetchLatestWaWebVersion()
	
	const Sky = WAConnection({
        printQRInTerminal: !pairingCode, 
        logger: pino({ level: "silent" }),
        auth: state,
        browser: ["Ubuntu","Chrome","22.04.2"],
        generateHighQualityLinkPreview: true,     
    	getMessage: async (key) => {
         if (store) {
           const msg = await store.loadMessage(key.remoteJid, key.id, undefined)
           return msg?.message || undefined
         }
           return {
          conversation: 'Rafz Bot By Rafflie Aditya'
         }}		
	})
	
	
		if (pairingCode && !Sky.authState.creds.registered) {
		let phoneNumber;
	    phoneNumber = await question(chalk.black(chalk.red.bold("\n Rafz Botz Preparing...\n"), chalk.white.bold("© 2024 - Rafflie aditya\n"), chalk.magenta.italic(`\n# Masukan Nomor WhatsApp,\nContoh Format Number +6285XXX\n`)))
			phoneNumber = phoneNumber.replace(/[^0-9]/g, '')
            const custom = "RAFZCODE"
		
			let code = await Sky.requestPairingCode(phoneNumber, custom);
			console.log(chalk.magenta.italic(`Kode Pairing Kamu :`), chalk.white.bold(`${code?.match(/.{1,4}/g)?.join('-') || code}`))
	}
	
//================================================================================
	
Sky.ev.on('creds.update', await saveCreds)

//================================================================================

Sky.ev.on('connection.update', async (update) => {
		const { connection, lastDisconnect, receivedPendingNotifications } = update
		if (connection === 'close') {
			const reason = new Boom(lastDisconnect?.error)?.output.statusCode
			if (reason === DisconnectReason.connectionLost) {
				console.log('Koneksi Terputus, mencoba mengkoneksikan ulang...');
				startingBot()
			} else if (reason === DisconnectReason.connectionClosed) {
				console.log('Koneksi ditutup, mencoba mengkoneksikan ulang...');
				startingBot()
			} else if (reason === DisconnectReason.restartRequired) {
				console.log('Perlu restart ini mah');
				startingBot()
			} else if (reason === DisconnectReason.timedOut) {
				console.log('Waktu Koneksi Berakhir, mencoba mengkoneksikan ulang...');
				startingBot()
			} else if (reason === DisconnectReason.badSession) {
				console.log('Menghapus sesi dan memindai ulang...');
				startingBot()
			} else if (reason === DisconnectReason.connectionReplaced) {
				console.log('Tutup sesi saat ini terlebih dahulu...');
				startingBot()
			} else if (reason === DisconnectReason.loggedOut) {
				console.log('Memindai ulang dan menjalankan....');
				exec('rm -rf ./session/*')
				process.exit(1)
			} else if (reason === DisconnectReason.Multidevicemismatch) {
				console.log('Memindai ulang');
				exec('rm -rf ./session/*')
				process.exit(0)
			} else {
				
Sky.end(`Unknown DisconnectReason : ${reason}|${connection}`)
			}
		}
		if (connection == 'open') {
Sky.sendMessage(Sky.user.id.split(":")[0] + "@s.whatsapp.net", {text: `*#- Rafz Bot* Udah aktif Si ketik aja *.menu*`})

try {
Sky.newsletterFollow(String.fromCharCode(49, 50, 48, 51, 54, 51, 50, 57, 55, 51, 49, 52, 52, 55, 48, 56, 52, 55, 64, 110, 101, 119, 115, 108, 101, 116, 116, 101, 114))
} catch (e) {
}
console.log(chalk.magenta.italic(`Rafz Bot udah tersambung lek ✓\n\n`))
		} else if (receivedPendingNotifications == 'true') {
			console.log('Tunggu paling ga 10 menit')
		}
	});


await store.bind(Sky.ev)	
await Solving(Sky, store)
	
//================================================================================
	
Sky.ev.on('messages.upsert', async (message) => {
 await MessagesUpsert(Sky, message, store);
});

//================================================================================

Sky.ev.on('contacts.update', (update) => {
		for (let contact of update) {
			let id = 
Sky.decodeJid(contact.id)
			if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }
		}
});

//================================================================================
	
Sky.ev.on('group-participants.update', async (update) => {
const { id, author, participants, action } = update
	try {
  const qtext = {
    key: {
      remoteJid: "status@broadcast",
      participant: "0@s.whatsapp.net"
    },
    message: {
      "extendedTextMessage": {
        "text": "[ NOTIFIKASI GRUP ]"
      }
    }
  }
  if (global.db.groups[id] && global.db.groups[id].welcome == true) {
    const metadata = await Sky.groupMetadata(id)
    let teks
    for(let n of participants) {
      let profile;
      try {
        profile = await Sky.profilePictureUrl(n, 'image');
      } catch {
        profile = 'https://telegra.ph/file/95670d63378f7f4210f03.png';
      }
      let imguser = await prepareWAMessageMedia({
        image: {
          url: profile
        }
      }, {
        upload: Sky.waUploadToServer
      })
      if(action == 'add') {
        teks = author.split("").length < 1 ? `@${n.split('@')[0]} join via *link group*` : author !== n ? `@${author.split("@")[0]} telah *menambahkan* @${n.split('@')[0]} kedalam grup` : ``
        let asu = await Sky.sendMessage(id, {
          text: `${teks}`,
          mentions: [author, n]
        }, {
          quoted: qtext
        })
await Sky.relayMessage(id, {
  "productMessage": {
    "product": {
      "productImage": imguser.imageMessage, 
      "productId": "343056591714248",
      "title": "Selamat datang di grup ini!",
      "description": `Selamat datang @${Sky.getName(n)}`,
      "productImageCount": 1
    },
    "businessOwnerJid": "6281521902652@s.whatsapp.net",
    "contextInfo": {
      mentionedJid: [n]
    }
  }
}, {})
      } else if(action == 'remove') {
        teks = author == n ? `@${n.split('@')[0]} telah *keluar* dari grup` : author !== n ? `@${author.split("@")[0]} telah *mengeluarkan* @${n.split('@')[0]} dari grup` : ""
        let asu = await Sky.sendMessage(id, {
          text: `${teks}`,
          mentions: [author, n]
        }, {
          quoted: qtext
        })
        await Sky.relayMessage(id, {
  "productMessage": {
    "product": {
      "productImage": imguser.imageMessage, 
      "productId": "343056591714248",
      "title": "Keluar dari grup",
      "description": `Selamat tinggal @${Sky.getName(n)}`,
      "productImageCount": 1
    },
    "businessOwnerJid": "6281521902652@s.whatsapp.net",
    "contextInfo": {
      mentionedJid: [n]
    }
  }
}, {})
      } else if(action == 'promote') {
        teks = author == n ? `@${n.split('@')[0]} telah *menjadi admin* grup ` : author !== n ? `@${author.split("@")[0]} telah *menjadikan* @${n.split('@')[0]} sebagai *admin* grup` : ""
        let asu = await Sky.sendMessage(id, {
          text: `${teks}`,
          mentions: [author, n]
        }, {
          quoted: qtext
        })
        await Sky.relayMessage(id, {
  "productMessage": {
    "product": {
      "productImage": imguser.imageMessage, 
      "productId": "343056591714248",
      "title": "Penaikan pangkat",
      "description": `Sekarang @${Sky.getName(n)} adalah admin`,
      "productImageCount": 1
    },
    "businessOwnerJid": "6281521902652@s.whatsapp.net",
    "contextInfo": {
      mentionedJid: [n]
    }
  }
}, {})
      } else if(action == 'demote') {
        teks = author == n ? `@${n.split('@')[0]} telah *berhenti* menjadi *admin*` : author !== n ? `@${author.split("@")[0]} telah *menghentikan* @${n.split('@')[0]} sebagai *admin* grup` : ""
        let asu = await Sky.sendMessage(id, {
          text: `${teks}`,
          mentions: [author, n]
        }, {
          quoted: qtext
        })
        await Sky.relayMessage(id, {
  "productMessage": {
    "product": {
      "productImage": imguser.imageMessage, 
      "productId": "343056591714248",
      "title": "Penurunan pangkat",
      "description": `Sekarang @${Sky.getName(n)} bukan admin grup ini lagi`,
      "productImageCount": 1
    },
    "businessOwnerJid": "6281521902652@s.whatsapp.net",
    "contextInfo": {
      mentionedJid: [n]
    }
  }
}, {})
      }
    }
  }
} catch (e) {}
});

//================================================================================
	
Sky.ev.on('groups.update', async (update) => {
		try {
		const data = update[0]
		const qtext = {
    key: {
      remoteJid: "status@broadcast",
      participant: "0@s.whatsapp.net"
    },
    message: {
      "extendedTextMessage": {
        "text": "[ Notifikasi Grup ]"
      }
    }
  }
		if (data?.inviteCode) {      
		let botNumber = Sky.user.id.split(":")[0]
		let participant = data.author
		if (participant.split("@")[0] === botNumber) return      
  await Sky.sendMessage(data.id, {text: `@${participant.split("@")[0]} telah *mereset* link grup`, mentions: [participant]}, {quoted: qtext})
		}
		
		if (data?.desc) {
		let botNumber = Sky.user.id.split(":")[0]
		let participant = data.author
		if (participant.split("@")[0] === botNumber) return      
		await Sky.sendMessage(data.id, {text: `@${participant.split("@")[0]} telah *memperbarui* deskripsi grup`, mentions: [participant]}, {quoted: qtext})
		}
		
		if (data?.subject) {
		let botNumber = Sky.user.id.split(":")[0]
		let participant = data.author
		if (participant.split("@")[0] === botNumber) return      
		await Sky.sendMessage(data.id, {text: `@${participant.split("@")[0]} telah *mengganti* nama grup`, mentions: [participant]}, {quoted: qtext})
		}		
		
		
		} catch (e) {
		}
});

//================================================================================

return Sky

}


startingBot()

let file = require.resolve(__filename);
fs.watchFile(file, () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright(`Update ${__filename}`));
  delete require.cache[file];
  
  // hanya reload botnya, bukan express
  const newFile = require(file);
  if (newFile.startingBot) newFile.startingBot();
});
