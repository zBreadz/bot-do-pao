const path = require("path");
const fs = require("fs");
const chalk = require('chalk');
const sql = require(path.join(__dirname, "./ps"));
const settings = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/settings.json"))
);

const {
  newgroup
} = require(path.join(__dirname, "./newgroup"));


const {
  MessageType
} = require("@adiwajshing/baileys");

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

class InforClass {
  constructor(
    from, arg, number, noofmsgtoday, totalmsg, dailylimitover, abusepresent, groupdata, botdata, sender, stanzaId, isMedia) {
    this.from = from;
    this.arg = arg;
    this.number = number;
    this.noofmsgtoday = noofmsgtoday;
    this.totalmsg = totalmsg;
    this.dailylimitover = dailylimitover;
    this.abusepresent = abusepresent;
    this.groupdata = groupdata;
    this.botdata = botdata;
    this.sender = sender;
    this.stanzaId = stanzaId;
    this.isMedia = isMedia;


  }
}


module.exports = async function settingread(arg, from, sender, groupname, client, groupMetadata, stanzaId, isMedia) {
  const Infor = new InforClass();

  random = settings.prefixchoice.charAt(
    Math.floor(Math.random() * settings.prefixchoice.length))
  try {

    botdata = await sql.query(
      "select * from botdata;"
    );

    if (from.endsWith("@g.us")) {

      data1 = await sql.query(`select * from groupdata where groupid='${from}';`);
      if (data1.rows.length == 0) {
        if (process.env.NODE_ENV === 'development') {
          console.log("👪  " + chalk.bgCyan(`Prefixo selecionado '${random}' para o grupo ` + groupname));
          await sql.query(
            `INSERT INTO groupdata VALUES ('${from}','true','/','false','true', '{''}',0,0,false,true);`
          );
          return settingread(arg, from, sender, groupname)
        }
        if (process.env.NODE_ENV === 'production') {
          if (
            groupMetadata.participants.length < botdata.rows[0].mingroupsize
          ) {
            await client.sendMessage(from, "*Quantidade minima de participantes no grupo:* " + botdata.rows[0].mingroupsize, text);
            client.groupLeave(from);
            return
          }
          console.log("👪  " + chalk.bgCyan(`Prefixo selecionado '${random}' para o grupo ` + groupname));
          newgroup(from, client, random)
          sql.query(
            `INSERT INTO groupdata VALUES ('${from}','true','${random}','false','true', '{''}',0,0,false,true);`
          );
          return settingread(arg, from, sender, groupname)
        }
      }
    }

    from.endsWith("@g.us") ?
      (number = sender.split("@")[0]) :
      (number = from.split("@")[0]);

    data2 = await sql.query(
      `select * from messagecount where phonenumber='${number}';`)
    if (data2.rows.length == 0) {
      console.log("👨  " + chalk.bgBlueBright("Adionando registro para o número: -" + number));
      await sql.query(`INSERT INTO messagecount VALUES ('${number}', 0, 0, false);`)
      return settingread(arg, from, sender, groupname)
    }



    Infor.from = from;
    Infor.arg = from.endsWith("@g.us") ? data1.rows[0].useprefix ? arg.replace(/\s+/g, " ").toLowerCase().startsWith(data1.rows[0].prefix) ?
      arg = (arg.replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "").slice(1).replace(/^\s+|\s+$/g, "").split(" ")).map(xa => urlregex.test(xa) ? xa : xa.toLowerCase()) :
      arg = [] : arg = (arg.replace(/\s+/g, " ").replace(/^\s+|\s+$/g, "").split(" ")).map(xa =>
        urlregex.test(xa) ? xa : xa.toLowerCase()) : arg.replace(/\s+/g, " ").startsWith('!') || arg.replace(/\s+/g, " ").startsWith('.') || arg.replace(/\s+/g, " ").startsWith('#') || arg.replace(/\s+/g, " ").startsWith('-') ? arg = (arg.slice(1).replace(/^\s+|\s+$/g, "").replace(/\s+/g, " ").split(" ")).map(xa => urlregex.test(xa) ? xa : xa.toLowerCase()) : arg = (arg.replace(/\s+/g, " ").split(" ")).map(xa => urlregex.test(xa) ? xa : xa.toLowerCase());
    Infor.number = number;
    Infor.noofmsgtoday = data2.rows[0].totalmsgtoday;
    Infor.totalmsg = data2.rows[0].totalmsg;
    Infor.dailylimitover = data2.rows[0].dailylimitover;
    Infor.abusepresent = from.endsWith("@g.us") ? data1.rows[0].allowabuse == 0 ? arg.detecta() : [] : arg.detecta();
    Infor.groupdata = from.endsWith("@g.us") ? data1.rows[0] : 0;
    Infor.botdata = botdata.rows[0];
    Infor.sender = sender;
    Infor.stanzaId = stanzaId;
    Infor.isMedia = isMedia;


    return Infor;

  } catch (error) {
    console.log(error);
  }
};