const axios = require('axios');
const { MessageType, Mimetype } = require("@adiwajshing/baileys");
const { text, image } = MessageType;
const fs = require("fs");
const path = require("path");
const sourcecode = (Infor, client, xxx3) => new Promise((resolve, reject) => {
    const xxx = { ...xxx3 };

    const from = Infor.from;
    axios.get(`https://api.github.com/repos/zbreadz/xxx-whatsapp-bot`)
        .then((response) => {
            let data = response.data;

            msg = "\n🤖🤖🤖 *Código fonte* 🤖🤖🤖\n\n" +
                "🐱 *Github*\n```github.com/zbreadz/xxx-whatsapp-bot```\n\n" +
                "👨‍💻 *Owner:* ```" + data.owner.login + "```\n" +
                "💻 *Name:*  ```" + data.name + "```\n" +
                "🉐 *Language:*     ```" + data.language + "```\n" +
                "⭐ *Stars:*             ```" + data.stargazers_count + "```\n" +
                "🔀 *Forks:*             ```" + data.forks_count + "```\n" +
                "🧰 *Issues:*           ```" + data.open_issues + "```\n" +
                "🎨 *Watchers:*      ```" + data.watchers_count + "```\n" +
                "💾 *Size:*               ```" + (data.size / 1024).toFixed(0) + " KB```\n" +
                "📄 *License:*         ```" + data.license.key + " ```\n" +
                "\n🤖 🤖 *_Bot made by Davi -zBreadz- Oliveira_* 🤖 🤖"


            client.sendMessage(from,
                msg,
                text,
                {
                    quoted: xxx,
                    detectLinks: false,
                })
            resolve();


        })
        .catch((e) => {
            console.log(e);
            reject(Infor)

        })
})
module.exports.sourcecode = sourcecode;