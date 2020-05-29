function timeFromDate(date) {
	let temp = date.split("T")[1].split(".")[0];
	temp = temp.split(":");

	return temp[0] + ":" + temp[1];
}

function formatToNum(text) {
	return parseInt(text.split(' ')[0].replace(',', ''));
}

function isNum(char) {
    return char >= '0' && char <= '9';
}

function checkStringForNumber(arr) {
    for(ele of arr) {
        if(typeof ele == 'string') {
            if(isNum(ele[0])) {
                return ele;
            }
        }
    }

    return '0';
}

function normalizeLinks(list) {

    let ret = [];

    for(link of list) {
        ret.push(link[link.length - 1] == '/' ? link.slice(0, link.length - 1) : link);
    }

    return ret;
}


module.exports = {
    timeFromDate,
    formatToNum,
    checkStringForNumber,
    normalizeLinks,
}