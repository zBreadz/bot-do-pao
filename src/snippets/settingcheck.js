
const path = require("path");
const fs = require("fs");
const chalk = require('chalk');
const {sql,redis} = require(path.join(__dirname, "./ps"));
const settings = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../data/settings.json"))
);
const {
    newgroup
} = require(path.join(__dirname, "./newgroup"));

const {
    MessageType
} = require("@adiwajshing/baileys");
const { red } = require("chalk");

const {
    text
} = MessageType;

let data1, data2, data3 = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../data/data3.json")));
const urlregex =
    /^(?:(?:https?|http|www):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
Array.prototype.detecta = function () {
    const returnarray = [];
    this.forEach((element, index) => {
        let hash = 0, i, chr;
        if (element.length === 0) return hash;
        for (i = 0; i < element.length; i++) {
            chr = element.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0;
        }
        data3.words.indexOf(hash) != -1 ? returnarray.push(this[index]) : null;
    })
    return returnarray;
}


module.exports = async function settingread(arg, from, sender, groupname, client, groupMetadata, stanzaId, isMedia) {
    random = settings.prefixchoice.charAt(
        Math.floor(Math.random() * settings.prefixchoice.length))
    try {
        botdata = await redis.hgetall('botdata');
        if (botdata === null) {
            let botdata = await sql.query(
                "select * from botdata;"
            );
            redis.hmset('botdata', botdata )
        }

        if (from.endsWith("@g.us")) {
            data1 = await hgetall(from)
            if (data1 === null) {
                if (process.env.NODE_ENV === 'development') {
                    console.log("👪 " + chalk.bgCyan("Prefix assigned is / for group " + groupname));
                    await sql.query(
                        `INSERT INTO groupdata VALUES ('${from}','true','/','false','true', '{''}',0,0,false,true);`
                    );
                    const gd = {
                        "groupid": from,
                        "useprefix": true,
                        "prefix": "/",
                        "allowabuse": false,
                        "membercanusebot": true,
                        "banned_users": ["'"],
                        "totalmsgtoday": 0,
                        "totalmsg": 0,
                        "autosticker": false,
                        "nsfw": true
                    };
                    redis.hmset(from, gd)
                    return settingread(arg, from, sender, groupname)

                }
                if (process.env.NODE_ENV === 'production') {

                    if (
                        groupMetadata.participants.length < botdata.mingroupsize
                    ) {
                        await client.sendMessage(from, "```Minimum participants required is ```" + botdata.mingroupsize, text);
                        client.groupLeave(from);
                        return
                    }
                    newgroup(from, client, random).then(() => console.log("New group!"));

                    const gd = {
                        "groupid": from,
                        "useprefix": true,
                        "prefix": random,
                        "allowabuse": false,
                        "membercanusebot": true,
                        "banned_users": ["'"],
                        "totalmsgtoday": 0,
                        "totalmsg": 0,
                        "autosticker": false,
                        "nsfw": true
                    }
                    await sql.query(
                        `INSERT INTO groupdata VALUES ('${from}','true','${random}','false','true', '{''}',0,0,false,true);`
                    );
                    redis.hmset(from, gd)
                    return settingread(arg, from, sender, groupname)
                }
            }
        }

        from.endsWith("@g.us") ?
            (number = sender.split("@")[0]) :
            (number = from.split("@")[0]);

        data2 = await redis.hgetall(number);
        if (data2 === null) {
            console.log("👨 " + chalk.bgBlueBright("Entering data for  number -" + number));
            await sql.query(`INSERT INTO messagecount VALUES ('${number}', 0, 0, false);`)
            const md = {
                "phonenumber": number,
                "totalmsgtoday": 0,
                "totalmsg": 0,
                "dailylimitover": false
            }
            redis.hmset(number,md)
            return settingread(arg, from, sender, groupname)
        }


        return (data = {

            from: from,
            arg: from.endsWith("@g.us") ? data1.useprefix ? arg.replace(/\s+/g, " ").toLowerCase().startsWith(data1.prefix) ?
                arg = (arg.replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "").slice(1).replace(/^\s+|\s+$/g, "").split(" ")).map(xa => urlregex.test(xa) ? xa : xa.toLowerCase()) :
                arg = [] : arg = (arg.replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "").split(" ")).map(xa =>
                    urlregex.test(xa) ? xa : xa.toLowerCase()) : arg.replace(/\s+/g, " ").startsWith('!') || arg.replace(/\s+/g, " ").startsWith('.') || arg.replace(/\s+/g, " ").startsWith('#') || arg.replace(/\s+/g, " ").startsWith('-') ? arg = (arg.slice(1).replace(/^\s+|\s+$/g, "").replace(/\s+/g, " ").split(" ")).map(xa => urlregex.test(xa) ? xa : xa.toLowerCase()) : arg = (arg.replace(/\s+/g, " ").split(" ")).map(xa => urlregex.test(xa) ? xa : xa.toLowerCase()),
            number: number,
            noofmsgtoday: data2.totalmsgtoday,
            totalmsg: data2.totalmsg,
            dailylimitover: data2.dailylimitover,
            abusepresent: from.endsWith("@g.us") ? data1.allowabuse == 0 ? arg.detecta() : [] : arg.detecta(),
            canmemberusebot: from.endsWith("@g.us") ? data1.membercanusebot == false ? false : true : true,
            isnumberblockedingroup: from.endsWith("@g.us") ? data1.banned_users.includes(number) ? 1 : 0 : 0,
            groupdata: from.endsWith("@g.us") ? data1  : 0,
            botdata: botdata ,
            sender: sender,
            stanzaId: stanzaId,
            isMedia: isMedia
        })

    } catch (error) {
        console.log(error);
    }
};





(async () => {
    v = await redis.hgetall('tesst');
    console.log(v);
    redis.quit()
})();