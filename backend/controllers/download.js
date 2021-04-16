const { parse } = require('url')
const http = require('http')
const fs = require('fs')
// const { basename } = require('path')
const path = require("path");

const TIMEOUT = 10000

const postPath = path.join(__dirname, "../", "images/");

const getListFiles = (req, res) => {
  const ErrStr = "Error in download files: ";
  fs.readdir(postPath, function (err, files) {
    if (err) {
      console.log(ErrStr + err);  
      res.status(500).send({
        message: ErrStr + "Unable to read files!",
      });
      return;
    }

    let fileInfos = [];
    try {
      files.forEach((file) => {
        fileInfos.push({
          name: file,
          url: postPath + file,
        });
      });
    }
    catch(error) {
      console.log(ErrStr + error);  

      res.status(500).send({
        message: ErrStr + "Unable to find files!",
      });    
      return;  
    }
    res.status(200).send(fileInfos);
  });
};
 
const download = (req, res) => {
  const fileName = req.params.name;
  console.log("download fileName: " + fileName);  
  const postFilePath = path.join(postPath, fileName);
  console.log("download Path: " + postFilePath);  
  res.download(postFilePath, fileName, (err) => {
    if (err) {
      res.status(500).send({
        message: "Could not download the file. " + err,
      });
    }
  });
};

module.exports = {
  getListFiles,
  download,
};