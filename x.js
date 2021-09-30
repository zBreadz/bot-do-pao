const asyncRedis = require('async-redis');
const redis = asyncRedis.createClient();
redis.hmset('botdata', {
    'javascript': 'ReactJS',
    'css': 'TailwindCSS',
    'node': 'dzvdvr'
});
(async () => {
    q = await redis.hgetall('botdata');
    console.log(q);
    redis.quit()
})()

String.prototype.hash = function () {
    let hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
    }
    return hash;
}