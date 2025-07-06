const fs = require("fs")
const os = require('os');
const path = require('path');
const namaFilePendaftaran = path.join(__dirname, '..', 'library', 'database', 'daftar.json');

async function isRegister(sender) {
  try {
    const dataBuffer = await fs.promises.readFile(namaFilePendaftaran, 'utf8');
    const daftarPengguna = JSON.parse(dataBuffer);
    const nomorSender = sender.split('@')[0];
    return daftarPengguna.some(user => user.no === nomorSender || user.email === sender);
  } catch (error) {
    console.error("Gagal membaca atau memparse daftar pendaftar:", error);
    return false;
  }
}


let handler = async (m, { Sky, isCreator, isPremium, qtext, runtime, toIDR }) => {
await Sky.sendMessage(m.chat, {react: {text: '🧏‍♂️', key: m.key}})
let teksnya = `
Hai @${m.sender.split("@")[0]}!

 ╭─ *『 乂 Information - Bot 』*
 │
 │• Nama bot : *${global.botname2}*
 │• Versi : *${global.versi}*
 │• Mode : *${Sky.public ? "Public": "Self"}*
 │• Pembuat : @${global.owner}
 │• Runtime Bot : *${runtime(process.uptime())}*
 │• Uptime Vps : *${runtime(os.uptime())}*
 │•  NOTE: Jika hanya mengetikan command tanpa querynya maka bot akan mengirimkan cara penggunaan command tersebut*
 ╰─────
 
 ╭─ *『 乂 Information - Users 』*
 │• Nomor Lu: ${m.sender.split("@")[0]}
 │• Status : *${isCreator ? "Pemilik" : isPremium ? "Premium" : await isRegister(m.sender) ? "Pengguna Terdaftar" : "Pengguna Gratis"}*
 │ Ingin mendaftar? ketik saja .register
 ╰─────
 
 ╭─ *『 Sticker Menu 』*
 │ ⳺ .qc <teks>
 │ ⳺ .qcwarna <teks>|<kodewarna>
 │ ⳺ .brat <teks>
 │ ⳺ .brat2 <teks>
 │ ⳺ .bratip <teks>
 │ ⳺ .bratvid <teks>
 │ ⳺ .sticker <kirim/reply media>
 │ ⳺ .emojigif <emoji>
 │ ⳺ .emojimix <emoji1>|<emoji2>
 │ ⳺ .smeme <text1>|<text2> 
 │ ⳺ .stickerwm <kirim/reply media> <teks>
 │ ⳺ 🅓 .cswm <kirim/reply media> packname|author
 ╰─────
 
 ╭─ *『 Stalker Menu 』*
 │⳺ .mlstalk <id ml>
 │⳺ .ffstalk <id ff>
 │⳺ .ttstalk <nama>
 │⳺ .ytstalk <username> 
 │⳺ .getbisnis <+62xxnomor wa bisnis>
 │⳺ .transfermarkt <Nama lengkap pemain>
 │⳺ .wastalk <+62xxx>
 │⳺ .roblox <username>
 ╰─────
 
 ╭─ *『 Image Generator Menu 』*
 │ ⳺ .struk <nama toko>|<id transaksi>|<biaya admin>|<nomor tujuan>|<barang1-harga1,barang2-harga2,Seterusnya>
 │ ⳺ .text2img" <teks>
 │ ⳺ .ssweb <link>
 │ ⳺ .bingimg <teks>
 │ ⳺ .logogen <judul>|<ide>|<slogan>
 │ ⳺ .ektp <reply foto> <provinsi>/<kota>/<nik>/<nama>/<tempatTanggalLahir>/<jenisKelamin>/<golonganDarah>/<alamat>/<rtRw>/<kelDesa>/<kecematan>/<agama>/<status>/<pekerjaan>/<kewarganegaraan>/<masaBerlaku>/<tanggalDibuat>
 │ ⳺ .faketweet <reply foto> .faketweet teksTweet/Nama/Username/Waktu/Tanggal/Retweet/Quote/Like/Mode
 │ ⳺ .iqc <teks>
 │ ⳺ .faketiktok <reply foto> <Nama>|<Username>|<Followers>|<Following>|<Likes>|<Bio>|Verified(<true>/<false>)|isFollow(<true>/<false>)|<dark>/<light>
 │ ⳺ .fakestory <nama>|<teks>
 │ ⳺ .pakustad <teks>
 │ ⳺ .pakustad2 <teks>
 │ ⳺ .pakustad3 <teks>
 ╰──────

╭─ *『 Ai Chat 』*
│ ⳺ .ai <teks>
│ ⳺ .aix <teks>
│ ⳺ .telusuriimg <kirim foto/reply foto> <prompt (opsional)>
│ ⳺ .proai <teks>
│ ⳺ .deepseek <teks>
╰──────

 ╭─ *『 Search Menu 』*
 │ ⳺ .yts <teks>
 │ ⳺ .searchspotify <judul lagu>
 │ ⳺ .searchmeme <teks>
 │ ⳺ .searchlirik <judul lagu>
 │ ⳺ .kata" <teks>
 │ ⳺ .cookpad <nama masakan>
 │ ⳺ .selectsurah <urutan surah dalam Al Qur'an>
 │ ⳺ .murotal <urutan surah dalam Al Qur'an>
 │ ⳺ .kisahnabi <nama Nabi>
 │ ⳺ .infogempa
 │ ⳺ .audiosurah <urutan surah dalam Alquran> (berlimit apikey)
 │ ⳺ .apkmod <teks>
 │ ⳺ .pinterest <teks>
 │ ⳺ .sfile <teks>
 │ ⳺ .puisiacak
 │ ⳺ .meme 
 │ ⳺ .gsmarena <merek hp>
 │ ⳺ .lahelu <teks>
 │ ⳺ .font <nama font> 
 │ ⳺ .ggimg <teks>
 │ ⳺ .sggl <teks>
 │ ⳺ .dafont search <nama font>
 │ ⳺ .jadwaltv <channel>
 │ ⳺ .topcmd
 │ ⳺ .stt <teks>
 │ ⳺ .stt2 <teks>
 │ ⳺ .unsplash <teks> 
 ╰──────
  
 ╭─ *『 Downloader Menu 』*
 │ ⳺ .tiktok <link tiktok>
 │ ⳺ .tiktokmp3 <link tiktok>
 │ ⳺ .instagram <link instargam>
 │ ⳺ .ig2 <link instragam>
 │ ⳺ .ig3 <link instragam>
 │ ⳺ .fb <link facebook>
 │ ⳺ .fb2 <link facebook>
 │ ⳺ .fb3 <link facebook>
 │ ⳺ .ytmp3 <link youtube>
 │ ⳺ .ytmp4 <link youtube>
 │ ⳺ .ytmp4v2 <link youtube> <resolusi>
 │ ⳺ .dl <link>
 │ ⳺ .spdown <link spotify>
 │ ⳺ .gdrive <link google drive>
 │ ⳺ .quiziz <id quiziz>
 │ ⳺ .play <teks>
 │ ⳺ .playtt <teks>
 │ ⳺ .playvid <teks>
 │ ⳺ .gitclone
 │ ⳺ .mediafire <link mediafire>
 │ ⳺ .getpaste <link pastebin>
 │ ⳺ .spdown <link spotify>
 │ ⳺ .getpp <nomor>
 │ ⳺ .dafont dl <link dafont>
 │ ⳺ .twitter <link twitter>
 ╰─────
  
 ╭─ *『 Converter Menu 』*
 │ ⳺ .tourl <kirim/reply media>
 │ ⳺ .toaudio <kirim/reply media video>
 │ ⳺ .toimg <reply stiker>
 │ ⳺ .tovn <reply audio/video>
 │ ⳺ .tourl2 <kirim/reply media>
 │ ⳺ .shortlink <kirim/reply media>
 │ ⳺ .shortlink2 <kirim/reply media>
 │ ⳺ .convert <jumlah>|<dari>|<ke>
 ╰──────
  
 ╭─ *『 Tools Menu 』*
 │ ⳺ .hdvid <kirim/reply media>
 │ ⳺ .tohd <kirim/reply media>
 │ ⳺ .hd2 <kirim/reply foto>
 │ ⳺ .hdr <kirim/reply media>
 │ ⳺ .remini <kirim/reply media
 │ ⳺ .colorrize <kirim/reply media>
 │ ⳺ .recollor <kirim/reply media>
 │ ⳺ .cekidch <linkch>
 │ ⳺ .cekidgc <linkgc>
 │ ⳺ .readviewonce <reply media>
 │ ⳺ .translate <bahasa format singkat> <teks>
 │ ⳺ .removebg <kirim/reply media>
 │ ⳺ .tempmail
 │ ⳺ .ctext <teks>
 │ ⳺ .pastebinpost <judul>#<kode/teks>
 │ ⳺ .enc <reply file js>
 │ ⳺ .reactch <linkpesanch> <teks/emoji>
 │ ⳺ .removenoise <reply media>
 │ ⳺ .transkrip <link youtube>
 │ ⳺ .tourlall <reply file/media>
 │ ⳺ .creategc <namagrup>|<deskripsi>
 │ ⳺ .hitamkan <kirim/reply media>
 │ ⳺ .normalkan <kirim/reply media>
 │ ⳺ .editimg <kirim/reply media> <prompt nya>
 │ ⳺ .publicchat <teks>|<nama>
 │ ⳺ .countjam <jam WIB>
 │ ⳺ .imgs <kirim/reply media>
 │ ⳺ .upscale <kirim/reply media> <style> <noise reduction level>
 │ ⳺ .unkenon <nomor>
 │ ⳺ .upchbrat <teks>
 │ ⳺ .talknotes <kirim video/reply pesan suara/audio>
 │ ⳺ .cektagihanpln <ID pelanggan>
 │ ⳺ .sendngl <link ngl>|pesan|jumlah
 │ ⳺ .editaudio <reply audio> <efek>
 │ ⳺ .tag <nomor 62xxx>
 │ ⳺ .confees <teks>|<dari siapa>|<ke siapa>
 │ ⳺ .tts <teks>
 │ ⳺ .resizevideo <kirim/reply media> <resolusi>
 │ ⳺ .tambah <angka>+<angka>
 │ ⳺ .kurang <angka>-<angka>
 │ ⳺ .kali <angka>*<angka>
 │ ⳺ .bagi <angka>/<angka>
 │ ⳺ .ambillinkgc <id gc>
 │ ⳺ .toviourl <kirim/reply media>
 │ ⳺ .ocr <kirim/reply media>
 ╰──────
  
 ╭─ *『 Grup Menu 』*
 │ ⳺ .add <nomor>
 │ ⳺ .kick <nomor/tag>
 │ ⳺ .close
 │ ⳺ .open
 │ ⳺ .opentime <angka> <konversi waktu>
 │ ⳺ .closetime <angka> <konversi waktu>
 │ ⳺ .antitagsw <on/off>
 │ ⳺ .hidetag <teks>
 │ ⳺ .kudetagc
 │ ⳺ .leave
 │ ⳺ .tagall <teks>
 │ ⳺ .promote <nomor/tag>
 │ ⳺ .demote <nomor/tag>
 │ ⳺ .resetlinkgc
 │ ⳺ .on
 │ ⳺ .off
 │ ⳺ .linkgc
 │ ⳺ .tagbiru
 │ ⳺ .ctag <nomor 62xxxxx>|<custom name>
 ╰───────
  
 ╭─ *『 Costumer Service 』*
 │ ⳺ .chatown <teks>
 │ ⳺ .report <nama fitur yg eror>|<erornya kenapa> 
 ╰──────
  
 ╭─ *『 Shop Menu (ERORR) 』*
 │ ⳺ .buypanel
 │ ⳺ .buyadp
 │ ⳺ .buyscript
 │ ⳺ .buyvps
 ╰────

  
 ╭─ *『 Store Menu (BEBERAPA ERORR) 』*
 │ ⳺ .addrespon
 │ ⳺ .delrespon
 │ ⳺ .listrespon
 │ ⳺ .done
 │ ⳺ .proses
 │ ⳺ .jpm
 │ ⳺ .jpm2
 │ ⳺ .jpmtesti
 │ ⳺ .jpmslide
 │ ⳺ .jpmslideht
 │ ⳺ .sendtesti
 │ ⳺ .pushkontak
 │ ⳺ .pushkontak2
 │ ⳺ .payment
 │ ⳺ .produk
 │ ⳺ .subdomain
 ╰────
  
 ╭─ *『 Digital Ocean Menu (ERORR) 』*
 │ ⳺ .r1c1
 │ ⳺ .r2c1
 │ ⳺ .r4c2
 │ ⳺ .r8c4
 │ ⳺ .r16c4
 │ ⳺ .sisadroplet
 │ ⳺ .deldroplet
 │ ⳺ .listdroplet
 │ ⳺ .rebuild
 │ ⳺ .restartvps
 ╰────
  
  ╭─ *『 Panel Menu Reseller (ERORR) 』*
  │ ⳺ .addseller
  │⳺ .delseller
  │⳺ .listseller
  │⳺ .1gb
  │⳺ .2gb
  │⳺ .3gb
  │⳺ .4gb
  │⳺ .5gb
  │⳺ .6gb
  │⳺ .7gb
  │⳺ .8gb
  │⳺ .9gb
  │⳺ .10gb
  │⳺ .unlimited
  │⳺ .cadmin
  │⳺ .delpanel
  │⳺ .deladmin
  │⳺ .listpanel
  │⳺ .listadmin
  ╰───────
    
 ╭─ *『 Panel Menu  Owner (ERORR) 』*
 │ ⳺ .1gb-v2
 │ ⳺ .2gb-v2
 │ ⳺ .3gb-v2
 │ ⳺ .4gb-v2
 │ ⳺ .5gb-v2
 │ ⳺ .6gb-v2
 │ ⳺ .7gb-v2
 │ ⳺ .8gb-v2
 │ ⳺ .9gb-v2
 │ ⳺ .10gb-v2
 │⳺ .unlimited-v2
 │⳺ .cadmin-v2
 │⳺ .delpanel-v2
 │⳺ .deladmin-v2
 │⳺ .listpanel-v2
 │⳺ .listadmin-v2
 ╰──────
 
 ╭─ *『 Installer Menu (ERORR) 』*
 │ ⳺ .hackbackpanel
 │ ⳺ .installpanel
 │ ⳺ .installtemastellar
 │ ⳺ .installtemabilling
 │ ⳺ .installtemaenigma
 │ ⳺ .uninstallpanel
 │⳺ .uninstalltema
 ╰──────

  
 ╭─ *『 Owner Menu 』*
 │ ⳺ .autoread
 │ ⳺ .autopromosi
 │ ⳺ .autoreadsw
 │ ⳺ .autotyping
 │ ⳺ .addplugins
 │ ⳺ .listplugins
 │ ⳺ .delplugins
 │ ⳺ .getplugins
 │ ⳺ .saveplugins
 │ ⳺ .addowner
 │ ⳺ .listowner
 │ ⳺ .delowner
 │ ⳺ .self/public
 │ ⳺ .setimgmenu
 │ ⳺ .setimgfake
 │ ⳺ .setppbot
 │ ⳺ .setppbotpanjang <kirim/reply media>
 │ ⳺ .clearsession
 │ ⳺ .clearchat
 │ ⳺ .resetdb
 │ ⳺ .restartbot
 │ ⳺ .getsc
 │ ⳺ .getcase
 │ ⳺ .listgc
 │ ⳺ .joingc
 │ ⳺ .joinch
 │ ⳺ .upchannel
 │ ⳺ .upchannel2
 ╰──────
* Download Script Bot Rafzbotz: https://github.com/Rafflie-CH/Rafzbotz
 
* Ingin dapat pembaruan tentang bot ini? 
Join saluran RAFZ BROADCAST: https://whatsapp.com/channel/0029Vb9R8pgAzNbzE3K8QP39

* Butuh Preset AM? Malas ngedit? Join Saluran: https://whatsapp.com/channel/0029VbAUJuR4o7qJhpARGn1b
Di situ berbagi berbagai kebutuhan ngedit di AM seperti CC,Preset 5MB/XML, Dll


 ╭─ *『 Thanks To 』*
 │ ALLAH Swt. (God)
 │ Skyzopedia (Base)
 │Penyedia Fitur Bot ( Di saluran)
 │Pengguna Bot
 ╰────

> RAFZBOT BY Rafflie aditya
`



await Sky.sendMessage(m.chat, { image: { url: `https://img12.pixhost.to/images/939/576388077_rafzbot.jpg` }, caption: teksnya, mentions: [m.sender, global.owner+"@s.whatsapp.net"], contextInfo: {
isForwarded: true, 
forwardingScore: 9999999999999, 
businessMessageForwardInfo: { businessOwnerJid: global.owner+"@s.whatsapp.net" }, forwardedNewsletterMessageInfo: { newsletterName: `${botname}`, newsletterJid: global.idSaluran }, 
externalAdReply: {
showAdAttribution: false,
title: `${global.botname2} Menu`, 
body: `© Powered By ${namaOwner}`, 
thumbnailUrl: global.image.reply, 
sourceUrl: 'https://whatsapp.com/channel/0029Vb9R8pgAzNbzE3K8QP39',
mediatype: 1,
renderLargerThumbnail: false
}}}, {quoted: qtext})
}


handler.command = ["menu"]

module.exports = handler
