import fs from 'node:fs';
import path from 'path';
import {zip} from 'zip-a-folder';
import uglifyjs from 'uglify-js';

const copySpider = ['app', 'xiaoya', 'xiaoya_alist', 'bilibili', 'bili_open', 'kunyu77_open', 'czzy_open', 'duboku2_open', 'wobg_open',
    'subaibai_open', 'duboku_open', 'alist_open', '13bqg_open', 'sc1080_open', 'ddys_open', 'ggys_open', 'ikanbot_open',
    'douyu_open', 'huya_open', 'lz_open', 'bengou_open', 'mkz_open', 'baozimh_open', 'boutique_comics_open', 'anfun_open',
    'nivod_op', 'wogg', 'xiaoya_open', '230ts_open', '230ts_book_open', 'kuqimv_open', 'boosj_open', 'ubestkid_open', 'cntv_open',
    'tuxiaobei_open', 'dj0898_open', 'libvio_open', 'sharenice_open', 'bookan_open', 'sharenice_open', '1free_open',
    'pansou_open', 'dovx_open', 'xiaozhitiao_open', 'upyun_open', 'yunpan4k_open', 'kkys_open'];

const files = ['lbgs_open', 'douban_open', 'doubanbb', 'ng_open', 'ikanbot_open', '555dy_open', 'yqktv_open',
    'voflix_open', 'ym_open', 'caiji', 'adm_open', '58dm_open', 'wf_open', 'kuwo_open', 'rbzj_open', 'zjm_open',
    'tiantian_open', 'nangua_open', 'ng_open', 'qiao2_open', 'tutu_open', 'bililive_open']

const root = process.cwd();

const src = path.join(root);
const out = path.join(root, 'dist');

function minify(s, d) {
    let jsContent = fs.readFileSync(s).toString();
    jsContent = jsContent.replace('./lib/cat.js', 'assets://js/lib/cat.js');
    jsContent = jsContent.replace('./cat.js', 'assets://js/lib/cat.js');
    jsContent = uglifyjs.minify(jsContent, {
        mangle: false,
    });
    fs.writeFileSync(d, jsContent.code);
}

function listAllFiles(dirPath, arrayOfFiles) {
    const files = fs.readdirSync(dirPath);

    arrayOfFiles = arrayOfFiles || [];

    files.forEach(function (file) {
        if (fs.statSync(dirPath + '/' + file).isDirectory()) {
            arrayOfFiles = listAllFiles(dirPath + '/' + file, arrayOfFiles);
        } else {
            arrayOfFiles.push(path.join(dirPath, '/', file));
        }
    });

    return arrayOfFiles;
}

function src2Out() {
    if (fs.existsSync(out)) fs.rmSync(out, {recursive: true, force: true});

    fs.mkdirSync(out, {recursive: true});
    const libSrc = path.join(src, 'lib');
    const libOut = path.join(out, 'lib');
    fs.mkdirSync(libOut, {recursive: true});
    const libs = listAllFiles(libSrc);
    for (let index = 0; index < libs.length; index++) {
        const element = libs[index];
        const relative = path.relative(libSrc, element);
        minify(element, path.join(libOut, relative));
    }

    for (const sp of copySpider) {
        minify(path.join(src, sp + '.js'), path.join(out, sp + '.js'));
    }

    for (const file of files) {
        let jsContent = fs.readFileSync(path.join(src, file + '.js')).toString();
        fs.writeFileSync(path.join(out, file + '.js'), jsContent);
    }
}

src2Out();

fs.copyFileSync(path.join(src, 'config_open.json'), path.join(out, 'config_open.json'));

await zip('dist', 'cat_open.zip');

console.log('build done');
