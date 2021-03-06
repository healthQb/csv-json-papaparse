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
    data['ansType'] = data['Answer Type']
    data['ansRange'] = data['Answer Range'];
    data['isLastQuestion'] = data['Is Last Question'] !== "TRUE" ? false : true;

    delete data['Category'];
    delete data['Question Number'];
    delete data['Question Text'];
    delete data['Answer Type'];
    delete data['Answer Range'];
    delete data['Is Last Question'];

    // modify ansRange
    let ansRangeNum, ansRangeText

    // Example: 0-5 (Never - Always)
    if (data.ansRange.indexOf('(') > 0) {
      // console.log('first (', results.data.category, results.data.questNo)
      // ansRangeType = "slider"
      ansRangeNum = data.ansRange.split('(')[0].trim().split('-')
      ansRangeText = data.ansRange.split('(')[1].slice(0, -1).split('-').map(elem => elem.trim())
    }

    // Example: [Yes, at home] [Yes, not at home] [No]
    if (data.ansRange.indexOf(']') > 0) {
      let regex = /\[.+\]/g
      ansRangeText = data.ansRange.match(regex)
        .filter((elem) => elem.length > 0)
        .map(elem => {
          elem = elem.substring(1, elem.length - 1)
          return elem
        })
    }

    // Example: 0-7
    if ((/0\-7/).test(data.ansRange)) {
      ansRangeNum = data.ansRange.split('(')[0].trim().split('-')
    }

    // Example: Hours:0-24 Minutes:0-59

    data.ansRange = { ansRangeNum, ansRangeText }

    // console.log("Row data:", results.data);
    return data
  })

  const data = result.data

  // sort by assessment


  const SEBE = data.filter(elem => {
    return elem.category === 'SEBE'
  })

  const PCS = data.filter(elem => {
    return elem.category === 'PCS'
  })

  const EMAW = data.filter(elem => {
    return elem.category === 'EMAW'
  })

  const MOVE = data.filter(elem => {
    return elem.category === 'MOVE'
  })

  const INTAW = data.filter(elem => {
    return elem.category === 'INTAW'
  })

  const PAIN_INVENTORY = data.filter(elem => {
    return elem.category === 'PAIN_INVENTORY'
  })

  const INTERVENTION = data.filter(elem => {
    return elem.category === 'INTERVENTION'
  })

  const assessment = { SEBE, PCS, EMAW, MOVE, INTAW, PAIN_INVENTORY, INTERVENTION }

  // console.log(assessment)

  fs.writeFileSync('questions.json', JSON.stringify(assessment, null, ' '));

});

