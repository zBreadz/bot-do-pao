const asyncRedis = require('async-redis');
const redis = asyncRedis.createClient();

//  redis.set('from', JSON.stringify(gd));

(async () => {
    q = await redis.get('919013722149-1604682527@g.us');
    console.log(JSON.parse(q));
    redis.quit()
})();












































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