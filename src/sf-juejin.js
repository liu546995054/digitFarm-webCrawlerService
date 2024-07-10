const puppeteer = require('puppeteer')
var {timeout} = require('../tools/tools.js');
const Profile = require("../db/save");
const Article = require('../db/config').Article

var delay = 1500

//获取当前日期函数
function getNowFormatDate() {
    let date = new Date(),
        year = date.getFullYear(), //获取完整的年份(4位)
        month = date.getMonth() + 1, //获取当前月份(0-11,0代表1月)
        strDate = date.getDate() // 获取当前日(1-31)
    if (month < 10) month = `${month}` // 如果月份是个位数，在前面补0
    if (strDate < 10) strDate = `${strDate}` // 如果日是个位数，在前面补0

    return `${year}年${month}月${strDate}日`
}

// 以下拿掘金开刀,贡献私人测试账号
// puppeteer.launch().then(async browser => {
puppeteer.launch({headless: false}).then(async browser => {

    // page.setViewport({width: 1200, height: 600})

    /** 登录juejin **/
    // try {
    //     let scrape = async () => {
    //         let page = await browser.newPage()
    //         await page.goto('https://hangqing.zhuwang.com.cn/zhujia/index.html');
    //
    //         await page.waitForSelector('#red')
    //         const elements = await page.$('#red')
    //
    //         const newPagePromise = new Promise(x => browser.once('targetcreated', target => x(target.page()))); // 声明变量
    //
    //         await elements.click()
    //
    //         const newPage =  await newPagePromise
    //         await newPage.waitForSelector(".zxxw1");
    //
    //         const result = await newPage.evaluate(() => {
    //             const list = [...document.querySelectorAll('.zxxw1')]
    //             const contents = [...document.querySelectorAll('.show_content')]
    //             let title =  list.map(el => {
    //                 return {title: el.innerText}
    //             })
    //             let content =  contents.map(el => {
    //                 return {content: el.outerHTML}
    //             })
    //             return { title,content };
    //         });
    //         const form = {
    //             type:0,
    //             title:result.title[0].title,
    //             content:result.content[0].content,
    //             classify:'猪'
    //         }
    //         await Article.create(form)
    //
    //         await browser.close();
    //     };
    //
    //     await scrape();
    //
    // } catch (e) {}


    try {
        let scrape = async () => {
            let page = await browser.newPage()
            await page.goto('https://hangqing.zhuwang.com.cn/zhujia/index.html');

            await page.waitForSelector('#red')
            // const elements = await page.$('#red')


            let elementsToClick = await page.$$('#red');
            console.log(`Elements to click: ${elementsToClick}`);
            // return

            for (let i = 0; i < elementsToClick.length; i++) {
                const newPagePromise = new Promise(x => browser.once('targetcreated', target => x(target.page()))); // 声明变量

                await elementsToClick[i].click()

                const newPage = await newPagePromise
                await newPage.waitForSelector(".zxxw1");

                const result = await newPage.evaluate(() => {
                    const list = [...document.querySelectorAll('.zxxw1')]
                    const contents = [...document.querySelectorAll('.show_content')]
                    let title = list.map(el => {
                        return {title: el.innerText}
                    })
                    let content = contents.map(el => {
                        return {content: el.outerHTML}
                    })
                    return {title, content};
                });
                console.log('****', result)
                let time = Date.parse(new Date()) / 1000
                const title = result.title[0].title
                let newTitle = getNowFormatDate()
                let classify_child = title.indexOf('内三元') !== -1 ? '内三元' : title.indexOf('外三元') !== -1 ? '外三元' : title.indexOf('土杂猪') !== -1 ? '土杂猪' : title.indexOf('仔猪') !== -1 ? '仔猪' : ''
                let area = title.indexOf('全国') !== -1 ? '全国'  : '全国'
                let weight = title.indexOf('10至14公斤') !== -1 ? '10~14公斤' : title.indexOf('15至19公斤') !== -1 ? '15~19公斤' : title.indexOf('20至30公斤') !== -1 ? '20~30公斤' : ''
                const form = {
                    type: 0,
                    title: classify_child ? newTitle + classify_child + weight + '价格' + ' (' + area + ')' : result.title[0].title,
                    content: result.content[0].content,
                    classify_child: classify_child,
                    area: area,
                    classify:'生猪',
                    weight:weight,
                    create_time: time,
                    update_time: time,
                }
                await Article.create(form)

                await timeout(delay)
                //关闭新tab页面
                await newPage.close()

                //切换回原始页面
                await page.bringToFront()
                // elementsToClick = await page.$$('#red');
            }


            await browser.close();


        };

        await scrape();

    } catch (e) {
    }

    return

    /** 1. 到sf获取最新的前端文章 **/
    try {
        // await page.goto('https://segmentfault.com/news/frontend')
        await page.goto('https://hangqing.zhuwang.com.cn/shengzhu/20240621/574541.html')
        await timeout(delay)

        // var SfFeArticleList = await page.evaluate(() => {
        //     var list = [...document.querySelectorAll('.content .h6 a')]
        //
        //     return list.map(el => {
        //         return {href: el.href.trim(), title: el.innerText}
        //     })
        // })


        var SfFeArticleList = await page.evaluate(() => {
            // var list = [...document.querySelectorAll('table tr td')]
            const title = [...document.querySelectorAll('.zxxw1')]
            const content = [...document.querySelectorAll('.show_content')]

            // let title =  list.map(el => {
            //     return {title: el.innerText}
            // })

            let content1 = content.map(el => {
                return {content: el.outerHTML}
            })

            console.log('****', content1)
            return content1

        })

        console.log('SfFeArticleList:', SfFeArticleList);

        await page.screenshot({path: './data/sf-juejin/sf.png', type: 'png'});
    } catch (e) {
        console.log('sf err:', e);
    }

    // const Profile = require('../db/save')
    // await Profile.bulkCreate(SfFeArticleList)


    return


    /** 随机推荐一篇从sf拿来的文章到掘金 **/
    try {
        await timeout(2500)
        var seed = Math.floor(Math.random() * 30)
        var theArtile = SfFeArticleList[seed]

        var add = await page.$('.main-nav .more')
        await add.click()

        var addLink = await page.$('.more-list .item')
        await addLink.click()

        await timeout(2500)

        var shareUrl = await page.$('.entry-form-input .url-input')
        await shareUrl.click()
        await page.type(theArtile.href, {delay: 20})

        await page.press('Tab')
        await page.type(theArtile.title, {delay: 20})

        await page.press('Tab')
        await page.type(theArtile.title, {delay: 20})

        await page.evaluate(() => {
            let li = [...document.querySelectorAll('.category-list-box .category-list .item')]
            li.forEach(el => {
                if (el.innerText == '前端')
                    el.click()
            })
        })

        var submitBtn = await page.$('.submit-btn')
        await submitBtn.click()

    } catch (e) {
        await page.screenshot({path: './data/sf-juejin/err.png', type: 'png'});
    }

    await page.screenshot({path: './data/sf-juejin/done.png', type: 'png'});
    // await page.close()
    // browser.close()
})
