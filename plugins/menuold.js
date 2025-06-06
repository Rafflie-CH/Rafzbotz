const fs = require("fs")
const os = require('os');

let handler = async (m, { Sky, isCreator, isPremium, qtext, runtime, toIDR }) => {
await Sky.sendMessage(m.chat, {react: {text: '🧏‍♂️', key: m.key}})
let teksnya = `
Hai @${m.sender.split("@")[0]}!
 *乂 Information - Bot*
  • Nama bot : *${global.botname2}*
  • Versi : *${global.versi}*
  • Mode : *${Sky.public ? "Public": "Self"}*
  • Pembuat : @${global.owner}
  • Runtime Bot : *${runtime(process.uptime())}*
  • Uptime Vps : *${runtime(os.uptime())}*
  
 *乂 Information - Users*
  • Nomor Lu: ${m.sender.split("@")[0]}
  • Status : *${isCreator ? "Pemilik" : isPremium ? "Premium" : "Pengguna Gratis"}*

  *— Othermenu*
  ⳺ .cekidch <linkch>
  ⳺ .cekidgc <linkgc>
  ⳺ .qc <teks>
  ⳺ .brat <teks>
  ⳺ .brat2 <teks>
  ⳺ .bratip <teks>
  ⳺ .bratvid <teks>
  ⳺ .readviewonce <reply media>
  ⳺ .stickerwm <teks>
  ⳺ .kata" <teks>
  ⳺ .sticker <kirim/reply media>
  
  *— Searchmenu*
  ⳺ .yts <teks>
  ⳺ .searchspotify <teks>
  ⳺ .apkmod <teks>
  ⳺ .pinterest <teks>
  ⳺ .ttstalk <nama>
  ⳺ .telusuriimg <kirim foto/reply foto> <prompt (opsional)>
  ⳺ .cookpad <nama masakan>
  ⳺ .selectsurah <urutan surah dalam Al Qur'an>

  *— Toolsmenu*
  ⳺ .ai <teks>
  ⳺ .gpt <teks>
  ⳺ .tourl <kirim/reply media>
  ⳺ .tourl2 <kirim/reply media>
  ⳺ .ssweb <link>
  ⳺ .translate <bahasa format singkat> <teks>
  ⳺ .tohd <kirim/reply media>
  ⳺ .hdr <kirim/reply media>
  ⳺ .remini <kirim/reply media>
  ⳺ .shortlink <kirim/reply media>
  ⳺ .shortlink2 <kirim/reply media>
  ⳺ .enc
  
  *— Shopmenu* (EROR)
  ⳺ .buypanel
  ⳺ .buyadp
  ⳺ .buyscript
  ⳺ .buyvps
  
  *— Downloadmenu* (BEBERAPA EROR)
  ⳺ .tiktok <link tiktok>
  ⳺ .tiktokmp3 <link tiktok>
  ⳺ .instagram <link instargam>
  ⳺ .ytmp3 <link youtube>
  ⳺ .ytmp4 <link youtube>
  ⳺ .spdown <link spotify>
  ⳺ .play <teks>
  ⳺ .playvid <teks>
  ⳺ .gitclone
  ⳺ .mediafire <link mediafire>
  
  *— Storemenu* (EROR)
  ⳺ .addrespon
  ⳺ .delrespon
  ⳺ .listrespon
  ⳺ .done
  ⳺ .proses
  ⳺ .jpm
  ⳺ .jpm2
  ⳺ .jpmtesti
  ⳺ .jpmslide
  ⳺ .jpmslideht
  ⳺ .sendtesti
  ⳺ .pushkontak
  ⳺ .pushkontak2
  ⳺ .payment
  ⳺ .produk
  ⳺ .subdomain
  
  *— Digitaloceanmenu* (EROR)
  ⳺ .r1c1
  ⳺ .r2c1
  ⳺ .r4c2
  ⳺ .r8c4
  ⳺ .r16c4
  ⳺ .sisadroplet
  ⳺ .deldroplet
  ⳺ .listdroplet
  ⳺ .rebuild
  ⳺ .restartvps
  
  *— Panelmenu Reseller* (EROR)
  ⳺ .addseller
  ⳺ .delseller
  ⳺ .listseller
  ⳺ .1gb
  ⳺ .2gb
  ⳺ .3gb
  ⳺ .4gb
  ⳺ .5gb
  ⳺ .6gb
  ⳺ .7gb
  ⳺ .8gb
  ⳺ .9gb
  ⳺ .10gb
  ⳺ .unlimited
  ⳺ .cadmin
  ⳺ .delpanel
  ⳺ .deladmin
  ⳺ .listpanel
  ⳺ .listadmin
    
  *— Panelmenu Owner* (EROR)
  ⳺ .1gb-v2
  ⳺ .2gb-v2
  ⳺ .3gb-v2
  ⳺ .4gb-v2
  ⳺ .5gb-v2
  ⳺ .6gb-v2
  ⳺ .7gb-v2
  ⳺ .8gb-v2
  ⳺ .9gb-v2
  ⳺ .10gb-v2
  ⳺ .unlimited-v2
  ⳺ .cadmin-v2
  ⳺ .delpanel-v2
  ⳺ .deladmin-v2
  ⳺ .listpanel-v2
  ⳺ .listadmin-v2
  
  *— Installermenu* (EROR)
  ⳺ .hackbackpanel
  ⳺ .installpanel
  ⳺ .installtemastellar
  ⳺ .installtemabilling
  ⳺ .installtemaenigma
  ⳺ .uninstallpanel
  ⳺ .uninstalltema
  
  *— Groupmenu*
  ⳺ .add <nomor>
  ⳺ .kick <nomor/tag>
  ⳺ .close
  ⳺ .open
  ⳺ .hidetag <teks>
  ⳺ .kudetagc
  ⳺ .leave
  ⳺ .tagall <teks>
  ⳺ .promote <nomor/tag>
  ⳺ .demote <nomor/tag>
  ⳺ .resetlinkgc
  ⳺ .on
  ⳺ .off
  ⳺ .linkgc
  
  *— Ownermenu*
  ⳺ .autoread
  ⳺ .autopromosi
  ⳺ .autoreadsw
  ⳺ .autotyping
  ⳺ .addplugins
  ⳺ .listplugins
  ⳺ .delplugins
  ⳺ .getplugins
  ⳺ .saveplugins
  ⳺ .addowner
  ⳺ .listowner
  ⳺ .delowner
  ⳺ .self/public
  ⳺ .setimgmenu
  ⳺ .setimgfake
  ⳺ .setppbot
  ⳺ .setppbotpanjang <kirim/reply media>
  ⳺ .clearsession
  ⳺ .clearchat
  ⳺ .resetdb
  ⳺ .restartbot
  ⳺ .getsc
  ⳺ .getcase
  ⳺ .listgc
  ⳺ .joingc
  ⳺ .joinch
  ⳺ .upchannel
  ⳺ .upchannel2

* Ingin dapat pembaruan tentang bot ini? 
Join saluran RAFZ BROADCAST: https://whatsapp.com/channel/0029Vb9R8pgAzNbzE3K8QP39

* Butuh Preset AM? Malas ngedit? Join Saluran: https://whatsapp.com/channel/0029VarhQrV1dAvzCicr8S1Y
Di situ berbagi berbagai kebutuhan ngedit di AM seperti CC,Preset 5MB/XML, Dll


`
await Sky.sendMessage(m.chat, {text: teksnya, mentions: [m.sender, global.owner+"@s.whatsapp.net"]}, {quoted: qtext})
}

handler.command = ["menuold"]

module.exports = handler