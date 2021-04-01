const Papa = require('./papaparse.min.js'); // https://www.papaparse.com/docs#data
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
	step: function(results, parser) {
    console.log("Row data:", results.data);
    console.log("Row errors:", results.errors);
  },
	complete: undefined,
	error: undefined,
	download: false,
	downloadRequestHeaders: undefined,
	downloadRequestBody: undefined,
	skipEmptyLines: false,
	chunk: undefined,
	chunkSize: undefined,
	fastMode: undefined,
	beforeFirstChunk: undefined,
	withCredentials: undefined,
	transform: undefined,
	delimitersToGuess: [',', '\t', '|', ';', Papa.RECORD_SEP, Papa.UNIT_SEP]
}

let questions = {
  negativeHA: {},

}


reader = fs.createReadStream('check-in.csv');
  
// Read and disply the file data on console
reader.on('data', function (chunk) {
  // console.log(chunk.toString())
  const result = Papa.parse(chunk.toString(), config)
  // console.log(JSON.stringify(result.data))
  // fs.writeFileSync('check-in.json', JSON.stringify(result.data, null, ' '));

});

