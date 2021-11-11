const {
  MessageType
} = require("@adiwajshing/baileys");
const {
  text
} = MessageType;
const getGroupAdmins = (participants) => {
  admins = [];
  for (let i of participants) {
    i.isAdmin ? admins.push(i.jid) : "";
  }
  return admins;
};
const newgroup = (from, client, random) =>
  new Promise(async (resolve, reject) => {
    const groupMetadata = await client.groupMetadata(from);
    const groupMembers = groupMetadata.participants;
    const groupAdmins = getGroupAdmins(groupMembers);
    let newmsg =
      "🍞🍞🍞  *BOT DO PÃO*  🍞🍞🍞\n\n" +
      "🚨 *Use este prefixo para os comandos:* " +
      random +
      "\n\n🚨 *O bot só aceitará comandos com o prefixo* " + random + "\n\n" +
      "🚨 ```Escreva``` " + "```" + random + "```" + "```help para ver a lista de comandos que o bot tem!```\n\n" +
      "🎀 *Example:* \n" +
      "🎁 ```" + random + "```" + "```help```\n" +
      "🎡 ```" + random + "```" + "```sticker crop```\n" +
      "🎪 ```" + random + "```" + "```rs```\n" +
      "🎢 ```" + random + "```" + "```crypto btc```\n" +
      "🎫 ```" + random + "```" + "```limit```\n"
    // + "🎠 ```" + random + "```" + "```market details tcs```\n\n"; +"👮 ```Admins:```\n"  
    index = 0;
    for (let admin of groupAdmins) {
      index += 1;
      newmsg += `\n@${admin.split("@")[0]}`;
    }

    client.sendMessage(from, newmsg, text, {
      contextInfo: {
        mentionedJid: admins,
      },
    });
    resolve()
  });
module.exports.newgroup = newgroup;