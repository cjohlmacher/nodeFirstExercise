const util = require('util');
const fs = require('fs');
const axios = require('axios');

const readFile = util.promisify(fs.readFile);

async function cat(path) {
    const readData = await readFile(path,'utf8').catch( (err) => {
        console.log(`Error reading file ${path}`);
        throw new Error(err);
    });
    return readData;
};

async function webCat(path) {
    const resp = await axios.get(path).catch(function(err) {
        console.log(`Error fetching ${path}`);
        throw new Error(err);
    });
    return resp.data;
};

function output(readData, outFlag) {
    if (outFlag) {
        fs.writeFile(process.argv[3],readData,{encoding: 'utf8', flag: 'a'}, function(err) {
            if (err) {
                console.log(`Error writing to ${process.argv[3]}`);
                console.log(err);
            }
        });
    } else {
        console.log(readData);
    };
};

async function routeRequest() {
    let readPath;
    let readData;
    let outFlag = true;
    if (process.argv[2] == '--out') {
        readPath = process.argv[4];
    } else {
        readPath = process.argv[2];
        outFlag = false;
    };
    try {
        //Try to process source file as a URL
        const url = new URL(readPath);
        readData = await webCat(readPath);
    } catch {
        //Catch failure to process file as URL and instead process as file.
        readData = await cat(readPath);
    };
    output(readData,outFlag);

};

routeRequest();

