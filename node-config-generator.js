var fs = require('fs');
var path = require('path');
var builder = require('xmlbuilder');

var targetDir = process.argv[2] || '.';
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

        makeConfigForDirectory(dir);
        break;

      }

      findConfigWorthyDirectories(fileDir);

    }

  }

}

function makeConfigForDirectory(dir) {

  console.log('Targeting:', dir);

  // Create base xml structure
  var xml = builder.create('config')
    .ele('component', {'assets': dir})
      .ele('slides');

  // Make slide nodes for each asset.
  var firstSlide;
  var files = fs.readdirSync(dir);
  for (var i = 0; i < files.length; i++) {

    var fileDir = dir + '/' + files[i];

    var classStr = '';
    var ext = path.extname(fileDir);

    // If we find an image file, assume it is a configurable directory.
    if (imgExts.indexOf(ext) > -1) {
      classStr += 'image';
    } else if (sndExts.indexOf(ext) > -1) {
      classStr = 'image sound';
    } else if (movExts.indexOf(ext) > -1) {
      classStr = 'movie';
    } else {
      // Didn't recognize extension. Skip.
    }

    if (classStr != '' && fileDir.indexOf('_FR_') < 0) {

      var enFile = fileDir;
      var frFile = enFile.replace('EN', 'FR');

      //Sound exception. Attribute to first slide.
      if ( classStr.indexOf('sound') > -1) {

        firstSlide.att('class', classStr);
        firstSlide.att('enSnd', enFile);
        firstSlide.att('frSnd', frFile);

      } else {

        // Create new slide.
        var item = xml.ele('slide');
        item.att('id', 'slide_' + i);
        item.att('class', classStr);
        item.att('enSrc', enFile);
        item.att('frSrc', frFile);

        // Remember first node
        if (i === 1) firstSlide = item;

      }

    }

  }

  // Pretty Stringify xml.
  var xmlStr = xml.end({ pretty: true});

  // Write to XML file.
  var saveDir = 'configs/';
  var parentFolder = path.basename(dir);
  var configTitle = parentFolder +'.xml';
  fs.writeFile(saveDir + configTitle, xmlStr, function (err) {
    if (err) throw err;
    console.log('Saved--> '+saveDir + configTitle + ' ');
  });

}

// Kick things off.
findConfigWorthyDirectories(targetDir);
