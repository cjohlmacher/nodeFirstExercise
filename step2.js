const fs = require('fs');
const axios = require('axios');

function cat(path) {
    fs.readFile(path,'utf8',function(err,data) {
        if (err) {
            console.log(`Error reading ${path}:\n`, err);
        } else {
            console.log(data);
        }
    });
};

async function webCat(path) {
    const resp = await axios.get(path).catch(function(err) {
        console.log(`Error fetching ${path}`);
        throw new Error(err);
    });
    console.log(resp.data);
};

try {
    const path = process.argv[2];
    const url = new URL(path);
    webCat(path);
} catch {
    cat(process.argv[2]);
}

