const path = require("path");
const {sql,redis} = require(path.join(__dirname, "./ps"));

const count = (infor, abused = 1) => new Promise(async (resolve, reject) => {
  number = infor.number;
  no_of_msg_today = infor.noofmsgtoday + (1 * abused);
  totalmsg = infor.totalmsg + 1;
  no_of_msg_today_group = infor.groupdata.totalmsgtoday + 1
  no_of_msg_group = infor.groupdata.totalmsg + 1;
  no_of_msg_today_by_bot = infor.botdata.totalmsgtoday + 1
  no_of_msg_by_bot = infor.botdata.totalmsg + 1


  redis.hmset(number, {
    'totalmsgtoday': no_of_msg_today,
    'totalmsg': totalmsg
  })
  sql.query(`UPDATE messagecount SET totalmsgtoday = ${no_of_msg_today} , totalmsg = ${totalmsg} WHERE phonenumber ='${number}';`)

  redis.hmset('botdata', {
    'totalmsgtoday': no_of_msg_today_by_bot,
    'totalmsg': no_of_msg_by_bot
  })
  sql.query(`UPDATE botdata SET totalmsgtoday = ${no_of_msg_today_by_bot} , totalmsg = ${no_of_msg_by_bot};`)


  if (infor.from.endsWith("@g.us")) {
    sql.query(`UPDATE groupdata SET totalmsgtoday = ${no_of_msg_today_group} , totalmsg = ${no_of_msg_group} WHERE groupid ='${infor.from}';`);
    redis.hmset(from, {
      totalmsgtoday: no_of_msg_today_group,
      totalmsg: no_of_msg_group
    })

  }
  resolve()
});
module.exports.count = count;
