const fs = require("fs");
const path = require("path");
const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/help.json"))
);
const { MessageType } = require("@adiwajshing/baileys");
const { text } = MessageType;
const getGroupAdmins = (participants) => {
  admins = [];
  for (let i of participants) {
    i.isAdmin ? admins.push(i.jid) : "";
  }
  return admins;
};
total = 0, version = "1.7";
const axios = require('axios');

try {
  axios.get(`https://api.github.com/repos/zBreadz/xxx-whatsapp-bot/stats/commit_activity`)
    .then((response) => {
      let data = response.data;

      data.forEach(obj => {
        total += obj.total;
      });

      version = total.toString().split("").join(".");
      console.log("v", version);
    });
} catch (error) {
  axios.get(`https://api.github.com/repos/zBreadz/xxx-whatsapp-bot/stats/commit_activity`)
    .then((response) => {
      let data = response.data;

      data.forEach(obj => {
        total += obj.total;
      });

      version = total.toString().split("").join(".");
      console.log("v", version);
    });
}



const help = (Infor, client, xxx3, syntax) =>
  new Promise(async (resolve, reject) => {
    const xxx = { ...xxx3 };
    const arg = Infor.arg;
    const from = Infor.from;
    const isGroup = from.endsWith("@g.us");
    const groupMetadata = isGroup ? await client.groupMetadata(from) : "";
    const groupMembers = isGroup ? groupMetadata.participants : "";
    const groupAdmins = isGroup ? getGroupAdmins(groupMembers) : "";
    const isGroupAdmins = groupAdmins.includes(Infor.sender) || false;
    let prefix = Infor.groupdata.prefix;
    let useprefix = Infor.groupdata.useprefix;
    let msg;
    const c = prefix == undefined ? "```Não é necessário prefixo no PV```" : useprefix ? prefix : "( " + prefix + " )" + " ```Desabilitado```";
    if (prefix == undefined || !useprefix) prefix = "🎀";

    if (arg.length == 1) {
      cas = Infor.number === process.env.OWNER_NUMBER ?
        "🎩 *Owner* :\n```rst, dul, dgl, mgs, sql, mdr, rmdr, rtrt, stp```\n\n"
        : "";

      const grpcmds = (isGroup && (isGroupAdmins || Infor.number === process.env.OWNER_NUMBER || Infor.botdata.moderators.includes(Infor.number))) ? "👑 *Admin* :\n```groupinfo, promote, demote, kick, changedp, grouplink, botleave, setprefix, useprefix, autosticker, nsfw, close, open, tagall, ban, unban, banlist, filterabuse, botaccess```\n\n" : "";
      msg =
        "🍞🍞🍞  *Bot do Pão*  🍞🍞🍞\n\n💡 *Prefixo:*  " +
        c +
        "\n\n" +
        "📗 *Geral* :\n ```help, faq, limit, delete, sourcecode, invite```\n\n" +
        grpcmds +
        "📱 *Mídia* :\n```ss, sticker, rs, lyrics, ytv, shorturl, testnsfw, run, crypto, pin```\n\n" +
        cas +
        "🎁 *Para mais informações :*\n" +
        prefix +
        "```help <comando>```\n\n" +
        "🚄 *Exemplo* :\n" +
        prefix + "help crypto\n" +
        prefix + "help shorturl\n" +
        prefix + "help sticker\n" +
        prefix + "help run\n" +
        "\n\n⚙️ *Bot version* : " + version;


      client.sendMessage(from, msg, text, {
        quoted: xxx,
      });
      resolve();
    } else {

      try {
        msg =
          syntax == undefined ? "🔖 *Descrição* :\n" +
            data[arg[1]].desc : "❎ *Erro* :\n```erro de syntax no comando.```\n" + "\n🔖 *Descrição* :\n" +
          data[arg[1]].desc
        msg += "\n\n" +
          "📕 *Usado* :\n" +
          prefix + "```" +
          data[arg[1]].usage +
          "```" +
          "\n\n" +
          "📚 *Exemplo* :\n";
        data[arg[1]].eg.forEach(currentItem => {
          msg += "```" + prefix + currentItem + "```" + "\n";
        });
        client.sendMessage(from, msg, text, {
          quoted: xxx,
          detectLinks: false

        });
        resolve();
      } catch (e) {
        client.sendMessage(
          from,
          "🤖 ```Não existe tal comando:``` " + arg[1],
          text,
          {
            quoted: xxx,
          }
        );
        resolve();
      }
    }
  });
module.exports.help = help;