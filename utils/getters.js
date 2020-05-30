const funcs = require('./funcs');
const organizer = require('./organizer');

async function getURL(page) {

    let ret = await page.evaluate(() => {
        let d = document.querySelector('c-Yi7');

        if(d == null) {
            return window.location.href;
        }

        return d.href;
    });
    
    return ret;
}

async function getDate(page) {

    let ret = await page.evaluate(() => {
        let d = document.querySelector('.c-Yi7');
        if(d == null) {
            return '';
        }
        return d.querySelector('time').title;
    });

    return ret;
}

async function getTime(page) {
    
    let ret = await page.evaluate(() => {
        let d = document.querySelector('.c-Yi7');
        if(d == null) {
            return '';
        }
        return d.querySelector('time').dateTime;
    });

    if(ret.length != 0) {
        ret = funcs.timeFromDate(ret);
    }

    return ret;
}

async function getLocation(page) {

    let ret = await page.evaluate(() => {
        d = document.querySelector('.M30cS');
        if(d == null) {
            return '';
        }
        return d.innerText;
    });
    
    return ret;
}

async function getPostText(page) {

    let ret = await page.evaluate(() => {
        let more = document.querySelector('.sXUSN');
        if(more != null) {
            more.click();
        }

        d = document.querySelector('.QzzMF');
        if(d == null) {
            return '';
        }
        return d.querySelector('span').innerText;
    });

    return ret;
}

async function getHashtags(page) {

    let ret = await page.evaluate(() => {
        let d = document.querySelector('.QzzMF');

        if(d == null) {
            return '';
        }

        let hashes = d.querySelectorAll('.xil3i');
        let full = "";

        for(hash of hashes) {
            full += hash.innerText + ", ";
        }

        if(full.length > 0) {
            full = full.slice(0, full.length - 2);
        }

        return full;
    });

	return ret;
}

async function getNature(page) {

    let ret = await page.evaluate(() => {
        let d = document.querySelector('nav.gW4DF');
        if(d == null) {
            return 'Post';
        }

        let h1 = d.querySelector('h1');
        return h1 == null ? 'Post' : h1.innerText;
    });

    return ret;
}

async function isVideo(page) {

    let nature = await getNature(page);
    
    return nature == 'Video';
}

async function getViews(page) {
    let isVid = await isVideo(page);

    if(!isVid) {
        return 0;
    }

    let ret = await page.evaluate(() => {
        let d = document.querySelector('.vcOH2');
        if(d == null) {
            return '0';
        }
        return d.innerText;
    });

    return funcs.formatToNum(ret);
}

async function getLikes(page) {
    if(await isVideo(page)) {
        await page.click('.vcOH2');
        await page.waitFor('.vJRqr');

        let ret = await page.evaluate(() => {
            let d = document.querySelector('.vJRqr');
            if(d == null) {
                return '0';
            }
            return d.innerText;
        });
        
        let likes = funcs.formatToNum(ret);

        return likes;
    }

    let ret = await page.evaluate(() => {
        let d = document.querySelector('.zV_Nj');
        if(d == null) {
            return '0';
        }
        return d.innerText;
    });

    return funcs.formatToNum(ret);
}

async function getComments(page) {

    let ret = await page.evaluate(() => {
        let d = document.querySelector('.r8ZrO');
        if(d == null) {
            let commCount = document.querySelectorAll('._2ic5v');
            return `${commCount}`;
        }

        let text = d.innerText;

        return `${text}`;
    });

    let arr = ret.split(' ');
    let num = funcs.checkStringForNumber(arr);

    return funcs.formatToNum(num);
}

async function getMediaLinks(page) {

    let links = await page.evaluate(() => {
        d = document.querySelectorAll('.Ckrof');
        if(d.length == 0) {
            return {};
        }

        let retLinks = {};

        for(ele of d) {
            let vid = ele.querySelector('video');

            if(vid == null) {
                retLinks[ele.querySelector('img').src] = 'image';
            }
            else {
                retLinks[vid.src] = 'video';
            }
        }

        return retLinks;
    });

    return links;
}

async function getMedia(page) {
    let ret = {};

    let firstOne = await page.evaluate(() => {
        let d = document.querySelector('._97aPb');
        if(d == null) {
            return '';
        }
        let vid = d.querySelector('video');

        let obj = {};
        
        if(vid == null) {
            obj[d.querySelector('img').src] = 'image';
            let img = d.querySelector('img');
            if(img == null) {
                obj['x'] = 'none';
            }
            else {
                obj[img.src] = 'image';
            }
        }
        else {
            obj[vid.src] = 'video';
        }
        
        return obj;
            
    });

    if(Object.keys(firstOne)[0].length > 1) {
        ret[Object.keys(firstOne)[0]] = Object.values(firstOne)[0];
    }

    let lks = await getMediaLinks(page);

    for(arr of Object.entries(lks)) {
        ret[arr[0]] = arr[1];
    }

    sliderExists = await page.evaluate(() => {
        let d = document.querySelector('.coreSpriteRightChevron');
        return d != null;
    });

    while(sliderExists) {
        await page.click('.coreSpriteRightChevron');
        lks = await getMediaLinks(page);

        for(arr of Object.entries(lks)) {
            if(arr[0].length > 0) {
                ret[arr[0]] = arr[1];
            }
        }

        sliderExists = await page.evaluate(() => {
            let d = document.querySelector('.coreSpriteRightChevron');
            return d != null;
        });
    }

    return ret;
}

async function getProfileLink(post_page) {
    let ret = await post_page.evaluate(() => {
        return document.querySelector('.e1e1d').querySelector('a').href;
    });

    return ret;
}

async function getProfileId(profile_page) {
    let ret = await profile_page.evaluate(() => {
        let d = document.querySelector('._7UhW9');
        
        if(d == null) {
            return '';
        }
        return d.innerText;
    });

    return ret;
}

async function getProfileName(profile_page) {
    let ret = await profile_page.evaluate(() => {
        return document.querySelector('.rhpdm').innerText;
    });

    return ret;
}

async function getPostId(page) {
    let ret = page.evaluate(() => {
        return window.location.pathname.split('/')[2];
    });

    return ret;
}

async function getPost(page, profile_id, profile_name) {
    let meta = {
        'profile_link': '',
        'profile_name': '',
        'profile_id': '',
        'date': '',
        'time': '',
        'location': '',
        'post': '',
        'hashtags': '',
        'nbr_media': 0,
        'media': [],
        'nature': '',
        'likes': 0,
        'views': 0,
        'comments': 0,
        'post_link': '',
        'post_id': '',
    };
    
    meta.profile_link = await getProfileLink(page);
    meta.profile_name = profile_name;
    meta.profile_id = profile_id;
    meta.date = await getDate(page);
    meta.time = await getTime(page);
    meta.location = await getLocation(page);
    meta.post = await getPostText(page);
    meta.hashtags = await getHashtags(page);
    meta.media = await getMedia(page);
    meta.nature = await getNature(page);
    meta.likes = await getLikes(page);
    meta.views = await getViews(page);
    meta.comments = await getComments(page);
    meta.post_link = await getURL(page);
    meta.post_id = await getPostId(page);
    meta.nbr_media = Object.entries(meta.media).length;

    return meta;
}

async function getPostsFromLinks(page, links, profile_id, profile_name, rules) {

    let posts = {};

    for(let link of links) {
        await page.goto(link);
        console.log('   crawling post: ', link);
        let post = await getPost(page, profile_id, profile_name);
        posts[link] = post;
        console.log('   downloading media');
        await organizer.downloadMediaFromPost(post, rules);
        console.log('   finished crawling');
        await page.waitFor(1000);
    }
    if(Object.entries(posts).length > 0) {
        organizer.writeJSON(posts, `./${rules.result}/${profile_id}/output.json`);
        console.log('JSON profile file has been saved.');
    }

    return posts;
}

async function getLinksFromProfile(page, rules) {
    if(rules.numberOfPosts <= 0) {
        if(isNaN(Date.parse(rules.startDate))) {
            console.log('check the rules...');
            return [];
        }
        if(isNaN(Date.parse(rules.endDate))) {
            return await getLinksFromProfileRespectDebut(page, rules.startDate, 0);
        }
        return await getLinksFromProfileRespectDates(page, rules.startDate, rules.endDate);
    }
    else {
        if(isNaN(Date.parse(rules.startDate))) {
            if(isNaN(Date.parse(rules.endDate))) {
                console.log('check the rules...');
                return [];
            }
            return await getLinksFromProfileRespectEnding(page, rules.endDate, rules.numberOfPosts);
        }
        else {
            if(isNaN(Date.parse(rules.endDate))) {
                return await getLinksFromProfileRespectDebut(page, rules.endDate, rules.numberOfPosts)
            }
            return await getLinksFromProfileRespectEverything(page, rules.startDate, rules.endDate, rules.numberOfPosts);
        }
    } 
}

async function getLinksFromProfileRespectDates(page, dateDeb, dateEnd) {
    let ret = [];
    let delay = 250;
    let repetitions = 20;

    let dateStartNumber = Date.parse(dateDeb);
    let dateEndNumber = Date.parse(dateEnd);

    let still = true;
    let whenToStop = 0;

    while(still && whenToStop < repetitions) {
        let leng = ret.length;
        let articles = await getCurrentArticles(page);

        if(Object.entries(articles).length == 0) {
            break;
        }

        for(let arr of Object.entries(articles)) {
            if(arr[1] < dateStartNumber) {
                return ret;
            }
            if(arr[1] < dateEndNumber) {
                ret.push(arr[0]);
            }
        }

        ret = [...new Set(ret)];

        if(leng == ret.length && ret.length != 0) {
            whenToStop++;
        }
        else {
            whenToStop = 0;
        }

        await scroll(page);
        await page.waitFor(delay);
    }

    return ret;
}

async function getLinksFromProfileRespectEverything(page, dateDeb, dateEnd, numPosts) {
    let ret = [];

    // TODO: work on this

    return ret;
}

async function getLinksFromProfileRespectDebut(page, dateDeb, numPosts) {
    let ret = [];

    // TODO: work on this

    return ret;
}

async function getLinksFromProfileRespectEnding(page, dateEnd, numPosts) {
    let ret = [];

    // TODO: work on this

    return ret;
}

async function getCurrentArticles(page) {
    let links = await page.evaluate(() => {
        let d = document.querySelectorAll('.c-Yi7');
        let ret = {};

        for(ele of d) {
            ret[ele.href] = Date.parse(ele.querySelector('time').dateTime);
        }
        return ret;
    });

    return links;
}

async function scroll(page) {
    await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight);
    });
}

async function crawlProfile(page, link, rules) {
    await page.goto(`${link}/feed`);
    await page.waitFor(3000);

    let error = await page.evaluate(() => {
        return document.querySelector('.error-container');
    });

    if(error != null) {
        return {
            link: {},
        };
    }

    let profile_id = await getProfileId(page);
    if(profile_id.length == 0) {
        return {};
    }
    
    let profile_name = await getProfileName(page);

    let links = await getLinksFromProfile(page, rules);

    let origin = link;
    origin = origin.split('/');
    origin = origin[origin.length - 1];

    await organizer.writeProfileDirectory(origin, links, rules);

    let ret = await getPostsFromLinks(page, links, profile_id, profile_name, rules);

    return ret;
}

async function crawlProfilesFromList(page, rules) {

    let meta = {};

    for(let link of rules.links) {
        console.log('>crawling profile: ', link);
        let profile = await crawlProfile(page, link, rules);
        meta[link] = profile;
        console.log('>finished crawling profile');
        console.log();
        await page.waitFor(5000);
    }

    return meta;
}

module.exports = {
    crawlProfilesFromList,
}