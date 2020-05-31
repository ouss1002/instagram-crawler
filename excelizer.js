const fs = require('fs');
const json2xls = require('json2xls');

function getJSON(path) {
    let data = fs.readFileSync(path);
    
    if(data == null) {
        return {};
    }

    let json = JSON.parse(data);

    return json;
}

function normalizeJSON(jsonObj) {
    let ret = {};

    if(Object.entries(jsonObj).length == 0) {
        return ret;
    }

    let firstPost = Object.values(jsonObj)[0];

    let profile_id = firstPost['profile_id'];
    let profile_link = firstPost['profile_link'];
    let profile_name = firstPost['profile_name'];


    ret['profile'] = profile_id;
    ret['posts'] = [];

    for(let arr of Object.entries(jsonObj)) {
        let postObj = {};
        let value = arr[1];

        let nat = Object.values(value['media'])[0];
        let media_ext = nat == 'video' ? '.mp4' : '.jpg';

        postObj['profile_id'] = `=HYPERLINK("${profile_link}", "${profile_id}")`;
        postObj['profile_name'] = profile_name;
        postObj['date'] = value['date'];
        postObj['time'] = value['time'];
        postObj['location'] = value['location'];
        postObj['post'] = value['post'];
        postObj['hashtags'] = value['hashtags'];
        postObj['nbr_media'] = value['nbr_media'];
        postObj['media'] = `=HYPERLINK("${value['post_directory']}/1${media_ext}", "${nat}")`;
        postObj['directory'] = `=HYPERLINK("${value['post_directory']}", "media_dir")`;
        postObj['nature'] = value['nature'];
        postObj['likes'] = value['likes'];
        postObj['views'] = value['views'];
        postObj['comments'] = value['comments'];
        postObj['post_link'] = `=HYPERLINK("${value['post_link']}", "link")`;

        ret['posts'].push(postObj);
    }

    return ret;
}

function makeExcelFromJSON(json) {
    
    let arr = Object.entries(json);

    if(arr.length == 0) {
        return ;
    }

    let postList = arr[1][1];

    let xls = json2xls(postList);

    fs.writeFileSync('data.xlsx', xls, 'binary');
}

function excelize() {
    // process.chdir('../');
    process.chdir('result/');

    fs.readdirSync('./').forEach((dir) => {

        if(fs.lstatSync(dir).isDirectory()) {
            process.chdir(dir);
            console.log('Processing directory: ', process.cwd());
    
            let jsonObj = getJSON('./output.json');
    
            let norm = normalizeJSON(jsonObj);
    
            makeExcelFromJSON(norm);
    
            process.chdir('../');
            console.log('Finished writing excel file');
            
        }
    });

}

excelize();