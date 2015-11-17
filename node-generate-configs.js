var fs = require('fs');
var path = require('path');
var builder = require('xmlbuilder');

var targetDir = process.argv[2] || '.';
var configTitle = process.argv[3] || 'config.xml';

var configDirs = [];

var imgExts = ['.png', '.jpg', '.gif'];
var sndExts = ['.mp3', '.ogg', '.wav'];
var movExts = ['.mov', '.mp4', '.m4v'];

// Find all directories that look like they'll need a config file.
function findConfigWorthyDirectories(dir) {

  var directoryStats = fs.lstatSync(dir);

  if (directoryStats.isDirectory()) {

    // Directory ...
    var files = fs.readdirSync(dir);
    for (var i = 0; i < files.length; i++) {

      var fileDir = dir + '/' + files[i];

      // If we find an image file, assume it is a configurable directory.
      if (imgExts.indexOf(path.extname(fileDir)) > -1) {
        configDirs.push(dir);
        break;
      }

      findConfigWorthyDirectories(fileDir);

    }

  }

}

function makeConfigForDirectory(dir) {

  console.log('Building config for:', dir);

  // Create base xml structure
  var xml = builder.create('config')
    .ele('component', {'assets': dir})
      .ele('slides');


  // Make slide nodes for each asset.
  var files = fs.readdirSync(dir);
  for (var i = 0; i < files.length; i++) {

    var fileDir = dir + '/' + files[i];

    var classStr = '';
    var ext = path.extname(fileDir);

    // If we find an image file, assume it is a configurable directory.
    if (imgExts.indexOf(ext) > -1) {
      classStr += 'image ';
    } else if (sndExts.indexOf(ext) > -1) {
      classStr += 'sound ';
    } else if (movExts.indexOf(ext) > -1) {
      classStr += 'movie ';
    } else {
      // Didn't recognize extension. Skip.
    }

    if (classStr != '') {
      var item = xml.ele('slide');
      item.att('id', 'slide_' + i);
      item.att('class', classStr);
      item.att('enSrc', fileDir);
      item.att('frSrc', fileDir);
    }

  }

  // Pretty Stringify xml.
  var xmlStr = xml.end({ pretty: true});

  // Write to XML file.
  fs.writeFile(dir + '/' + configTitle, xmlStr, function (err) {
    if (err) throw err;
    console.log('Saved!  ' + dir + '/' + configTitle + ' ');
  });

}


// Kick things off.
findConfigWorthyDirectories(targetDir);

// Make/overwrite config files.
for (var i = 0; i < configDirs.length; i++) {
  makeConfigForDirectory(configDirs[i]);
}
