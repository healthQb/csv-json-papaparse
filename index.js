const Papa = require('./papaparse.min.js');
const fs = require('fs');

const config = {
  delimiter: "",	// auto-detect
  newline: "",	// auto-detect
  quoteChar: '"',
  escapeChar: '"',
  header: true,
  transformHeader: undefined,
  dynamicTyping: false,
  preview: 0,
  encoding: "",
  worker: false,
  comments: false,
  complete: undefined,
  error: undefined,
  download: false,
  downloadRequestHeaders: undefined,
  downloadRequestBody: undefined,
  skipEmptyLines: true,
  chunk: undefined,
  chunkSize: undefined,
  fastMode: undefined,
  beforeFirstChunk: undefined,
  withCredentials: undefined,
  transform: undefined,
  delimitersToGuess: [',', '\t', '|', ';', Papa.RECORD_SEP, Papa.UNIT_SEP]
}

reader = fs.createReadStream(process.argv[2]);

// Read and disply the file data on console
reader.on('data', function (chunk) {
  const result = Papa.parse(chunk.toString(), config)

  // clean the data
  result.data.map(data => {
    // delete unused fields
    delete data['OLD CODE'];
    delete data[''];

    // rename fields for JS friendly code
    data['category'] = data['Category'];
    data['questNo'] = data['Question Number'];
    data['questText'] = data['Question Text'];
    data['ansRange'] = data['Answer Range'];

    delete data['Category'];
    delete data['Question Number'];
    delete data['Question Text'];
    delete data['Answer Range'];

    // modify ansRange
    let ansRangeNum, ansRangeText, ansRangeType

    // if(questNo)

    // Example: 0-5 (Never - Always)
    if (data.ansRange.indexOf('(') > 0) {
      // console.log('first (', results.data.category, results.data.questNo)
      ansRangeType = "slider"
      ansRangeNum = data.ansRange.split('(')[0].trim().split('-')
      ansRangeText = data.ansRange.split('(')[1].slice(0, -1).split('-').map(elem => elem.trim())
    }

    // Example: [Yes, at home] [Yes, not at home] [No]
    if (data.ansRange.indexOf(']') > 0) {
      // console.log('second [', results.data.category, results.data.questNo)
      ansRangeType = "checkbox"
      ansRangeText = data.ansRange.split('] [').map(elem => {
        return elem.replace('[', '').replace(']', '')
      })
    }

    // Example: 0-7
    if ((/0\-7/).test(data.ansRange)) {
      // console.log('third 0-7', results.data.category, results.data.questNo)
      ansRangeType = "date"
      ansRangeNum = data.ansRange.split('(')[0].trim().split('-')
    }

    // Example: Hours:0-24 Minutes:0-59
    if (data.ansRange.indexOf('Minutes') > 0) {
      // console.log('fourth hours', results.data.category, results.data.questNo)
      ansRangeType = "time"
    }

    data.ansRange = { ansRangeType, ansRangeNum, ansRangeText }

    // console.log(results.data.category, results.data.questNo, ansRangeNum, ansRangeText)
    // console.log("Row data:", results.data);
    return data
  })

  const data = result.data
  const assessment1 = data.filter(elem => {
    return elem.category === 'INTAW'
  })

  const assessment2 = data.filter(elem => {
    return elem.category === 'SEBE'
  })

  const assessment3 = data.filter(elem => {
    return elem.category === 'PCS'
  })

  const assessment4 = data.filter(elem => {
    return elem.category === 'EMAW'
  })
  const assessment5 = data.filter(elem => {
    return elem.category === 'MOVE'
  })

  const assessment = { assessment1, assessment2, assessment3, assessment4, assessment5 }


  console.log(assessment2)

  fs.writeFileSync('questions.json', JSON.stringify(assessment, null, ' '));

});

