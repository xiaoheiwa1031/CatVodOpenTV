import xiaoya_tv from './spider/video/xiaoya-tv.js';
import xiaoya_alist from './spider/video/xiaoya-alist.js';
import bilibili from './spider/video/bilibili.js';
import douban from './spider/video/douban.js';
import wogg from './spider/video/wogg.js';
import wobg from './spider/video/wobg.js';
import xxpan from './spider/video/xxpan.js';
//import ysche from './spider/video/ysche.js';
import tudou from './spider/video/tudou.js';
import kunyu77 from './spider/video/kunyu77.js';
import kkys from './spider/video/kkys.js';
import nangua from './spider/video/ng.js';
import czzy from './spider/video/czzy.js';
import mayiya from './spider/video/mayiya.js';
import ikanbot from './spider/video/ikanbot.js';
import rrys from './spider/video/rrys.js';
import libvio from './spider/video/libvio.js';
import baipiaoys from './spider/video/baipiaoys.js';
import yingso from './spider/video/yingso.js';
import ttian from './spider/video/ttian.js';
import subaibai from './spider/video/subaibai.js';
//import yiso from './spider/video/yiso.js';
//import scys from './spider/video/scys.js';
import nongmin from './spider/video/nongmin.js';
import ddys from './spider/video/ddys.js';
import sharenice from './spider/video/sharenice.js';
import ktv from './spider/video/ktv.js';
import boo from './spider/video/boo.js';
import ttkx from './spider/video/ttkx.js';
import meijumi from './spider/video/meijumi.js';
import xinshijue from './spider/video/xinshijue.js';
import bili from './spider/video/bili.js';
import huya from './spider/video/huya.js';
import douyu from './spider/video/douyu.js';
import anfun from './spider/video/anfun.js';
//import xiaoya from './spider/video/xiaoya.js';
import live from './spider/video/live.js';
import cntv from './spider/video/cntv.js';
import bqr from './spider/video/bqr.js';
import _360ba from './spider/video/_360ba.js';
import appys from './spider/video/appys.js';
import yunpanres from './spider/video/yunpanres.js';
import pansearch from './spider/video/pansearch.js';
import upyun from './spider/video/upyun.js';
import push from './spider/video/push.js';
import alist from './spider/pan/alist.js';
import _13bqg from './spider/book/13bqg.js';
import wenku from './spider/book/wenku.js';
import bookan from './spider/book/bookan.js';
import bengou from './spider/book/bengou.js';
import laobaigs from './spider/book/laobaigs.js';
import coco from './spider/book/coco.js';
import hm from './spider/book/韩漫基地.js';
import mhdq from './spider/book/mhdq.js';
import tewx from './spider/book/tewx.js';
import copymanga from './spider/book/copymanga.js';
import baozimh from './spider/book/baozimh.js';
import vcm3u8 from './spider/video/vcm3u8.js';
import avm3u8 from './spider/video/avm3u8.js';
import maiyoux from './spider/video/maiyoux_node.js';

const spiders = [xiaoya_tv, xiaoya_alist, bilibili, douban, wogg, wobg, xxpan, tudou, kunyu77, kkys, nangua, czzy, mayiya, ikanbot, rrys, libvio, baipiaoys, yingso, ttian, subaibai, nongmin, ddys, sharenice, ktv, boo, ttkx, meijumi, xinshijue, bili, huya, douyu, anfun, live, cntv, bqr, _360ba, appys, yunpanres, pansearch, upyun, vcm3u8, avm3u8, maiyoux, push, alist, _13bqg, wenku, bookan, bengou, laobaigs, coco, hm, mhdq, tewx, copymanga, baozimh];
const spiderPrefix = '/spider';

/**
 * A function to initialize the router.
 *
 * @param {Object} fastify - The Fastify instance
 * @return {Promise<void>} - A Promise that resolves when the router is initialized
 */
export default async function router(fastify) {
    // register all spider router
    spiders.forEach((spider) => {
        const path = spiderPrefix + '/' + spider.meta.key + '/' + spider.meta.type;
        fastify.register(spider.api, { prefix: path });
        console.log('Register spider: ' + path);
    });
    /**
     * @api {get} /check 检查
     */
    fastify.register(
        /**
         *
         * @param {import('fastify').FastifyInstance} fastify
         */
        async (fastify) => {
            fastify.get(
                '/check',
                /**
                 * check api alive or not
                 * @param {import('fastify').FastifyRequest} _request
                 * @param {import('fastify').FastifyReply} reply
                 */
                async function (_request, reply) {
                    reply.send({ run: !fastify.stop });
                }
            );
            fastify.get(
                '/config',
                /**
                 * get catopen format config
                 * @param {import('fastify').FastifyRequest} _request
                 * @param {import('fastify').FastifyReply} reply
                 */
                async function (_request, reply) {
                    const config = {
                        video: {
                            sites: [],
                        },
                        read: {
                            sites: [],
                        },
                        comic: {
                            sites: [],
                        },
                        music: {
                            sites: [],
                        },
                        pan: {
                            sites: [],
                        },
                        color: fastify.config.color || [],
                    };
                    spiders.forEach((spider) => {
                        let meta = Object.assign({}, spider.meta);
                        meta.api = spiderPrefix + '/' + meta.key + '/' + meta.type;
                        meta.key = 'nodejs_' + meta.key;
                        const stype = spider.meta.type;
                        if (stype < 10) {
                            config.video.sites.push(meta);
                        } else if (stype >= 10 && stype < 20) {
                            config.read.sites.push(meta);
                        } else if (stype >= 20 && stype < 30) {
                            config.comic.sites.push(meta);
                        } else if (stype >= 30 && stype < 40) {
                            config.music.sites.push(meta);
                        } else if (stype >= 40 && stype < 50) {
                            config.pan.sites.push(meta);
                        }
                    });
                    reply.send(config);
                }
            );
        }
    );
}
