import {Crypto, load, _} from './lib/cat.js';

let key = 'bilibili';
let url = '';
let siteKey = '';
let siteType = 0;

const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1';

const cookie = {};

async function request(reqUrl, referer, mth, data, hd) {
    const headers = {
        'User-Agent': UA,
        'X-CLIENT': 'open',
        Cookie: _.map(cookie, (value, key) => {
            return `${key}=${value}`;
        }).join(';'),
    };
    if (referer) headers.referer = encodeURIComponent(referer);
    let res = await req(reqUrl, {
        method: mth || 'get',
        headers: headers,
        data: data,
        postType: mth === 'post' ? 'form' : '',
    });
    return res.content;
}

// cfg = {skey: siteKey, ext: extend}
async function init(cfg) {
    siteKey = cfg.skey;
    siteType = cfg.stype;
    url = cfg.ext;
}

async function home(filter) {
    const api = url;
    const json = await request(api);
    return json.replaceAll('1$/$1', '1$/$0');
}

async function homeVod() {
    return '{}';
    //return await request(url + '?ids=recommend');
}

async function category(tid, pg, filter, extend) {
    if (pg <= 0) pg = 1;
    let api = url + '?t=' + tid + '&pg=' + pg;
    if (extend) {
        let data = Object.entries(extend).map(([key, val] = entry) => {
            return '&' + key + '=' + val;
        })
        api += data;
        api += '&f=' + encodeURIComponent(JSON.stringify(extend));
    }
    return await request(api);
}

async function detail(id) {
    const api = url + '?ids=' + id;
    return await request(api);
}

async function play(flag, id, flags) {
    const playHeaders = {
        Referer: 'https://www.bilibili.com',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36'
    };
    const js2Base = await js2Proxy(true, siteType, siteKey, 'dash/', {});
    return JSON.stringify({
        parse: 0,
        url: js2Base + id,
        header: playHeaders,
    });
}

async function search(wd, quick) {
    const api = url + '?wd=' + wd;
    return await request(api);
}

async function proxy(segments) {
    let what = segments[0];
    let id = segments[1];
    if (what == 'dash') {
        const api = url.replace('/bilibili', '/play') + '?bvid=' + id + '&from=open&flag=proxy';
        const json = await request(api);
        const body = JSON.parse(json)

        return JSON.stringify({
            code: 200,
            content: body.mpd,
            headers: {
                'Content-Type': 'application/dash+xml',
            },
        });
    }
    return JSON.stringify({
        code: 500,
        content: '',
    });
}

export function __jsEvalReturn() {
    return {
        init: init,
        home: home,
        homeVod: homeVod,
        category: category,
        detail: detail,
        play: play,
        proxy: proxy,
        search: search,
    };
}
