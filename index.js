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

  // sort by assessment


  const SEBE = data.filter(elem => {
    return elem.category === 'SEBE'
  })
  SEBE.push({
    "category": 'SEBE',
    "questNo": "",
    "questText": `You have just completed an assessment of psychological wellbeing. Research shows that a sense of happiness and wellbeing involves three components: self-acceptance, sense of purpose, and agency.\n**Self-acceptance** – being on good terms with one’s own self, including both positive and negative aspects and traits – is fundamental. It opens doors for growth by increasing emotional maturity and granting one freedom and confidence to revisit and re-assess past decisions and actions.\n**Purpose** – a sense that your life has meaning and direction – provides grounds for success and achievement while at the same time shielding you from negative mood and social rejection.\nFinally, **autonomy** points to the sense of self-directedness and confidence in your ability to overcome challenges. It is the ability to actualize the power we have to independently decide what it is that serves our growth, purpose, and wellbeing.`,
    "ansRange": {}
  })

  const PCS = data.filter(elem => {
    return elem.category === 'PCS'
  })
  PCS.push({
    "category": 'PCS',
    "questNo": "",
    "questText": `You have just completed an assessment on your perception of pain. Pain is an unpleasant sensation that makes us do what it takes to heal what caused the pain in the first place. Pain bothers us to make us act. And there is a fine line: Sometimes pain bothers us too much, resulting in a mindset of constant engagement with the pain, not being able to think of anything else. That is to say, there is a fine line between adaptive coping and maladaptive catastrophizing of pain. The assessment you have just completed will tell you which side of the line you are on, and we will be here to assist you in overcoming catastrophization if need be.`,
    "ansRange": {}
  })

  const EMAW = data.filter(elem => {
    return elem.category === 'EMAW'
  })
  EMAW.push({
    "category": 'EMAW',
    "questNo": "",
    "questText": `You have just completed an assessment examining your emotional awareness. Most of us intuitively think that we know everything there is to know about our own feelings. But truth be told, this is not always so. Some people are more aware of their feelings, and others less. Low emotional awareness might feel good – we are not disturbed and overwhelmed by feelings that are out of place, or for which we don’t have time. Yet it disrupts regulation of one’s mood and relationships with other people, and ultimately leads to maladaptive behaviours and a less satisfying life. Contrary to that, high emotional awareness helps us solve problems, get our needs met, allows us to recognize and empathize with people around us, and thus improves our sense of wellbeing.`,
    "ansRange": {}
  })
  const MOVE = data.filter(elem => {
    return elem.category === 'MOVE'
  })
  MOVE.push({
    "category": 'MOVE',
    "questNo": "",
    "questText": `Probably every individual in the modern world is aware of the benefits of physical exercise. But how many are truly aware of the mental health benefits of this habit? Today, physical exercise has proven paramount in the resolution of several mental health struggles ranging from stress, anxiety and depression to ADHD, PTSD and trauma. Known as "organic" treatment for anxiety and depression, physical exercise has proven to be as effective as antidepressant and anti-anxiety medications. But even if you are not anxious, physical exercise promotes growth of neurons in the brain, strengthens connections of already existing neurons, and reduces inflammation – all without the tiresome side effects of pharmaceuticals. As a result, exercise improves memory, resilience in response to emotional conflicts and stress, and better sleep. And this is not all. Most delightfully, during physical exercise our body produces endorphins — chemicals that relieve stress and induce a sense of wellbeing, so after just a little bit of exercise you may experience the stress-free head-rushing buzz of happiness. To summarise, physical exercise almost always results in higher self-esteem once consistent.`,
    "ansRange": {}
  })

  const INTAW = data.filter(elem => {
    return elem.category === 'INTAW'
  })

  INTAW.push({
    "category": "INTAW",
    "questNo": "",
    "questText": `You’ve just completed an assessment of interoceptive awareness – the ability to experience and recognize bodily sensations. Our bodily state has a direct impact on our emotional state, both positive (enjoying a bubble bath) and negative (feeling irritable after a sleepless night). Interoceptive awareness is what allows us to adequately allocate true causes of our feelings of pleasure and displeasure, and thus react appropriately. This is why interoceptive awareness is a key part of self-regulation. What that means is that good interoceptive awareness results in life with less anxiety and greater feeling of presence & enjoyment of life. It improves connection with one’s self and, in turn, with other people.\nThis is the end of the questionnaire series. You're one step closer to getting your holistic biopsychosocial assessment.\nThank you for participating!`,
    "ansRange": {}
  })

  const assessment = { SEBE, PCS, EMAW, MOVE, INTAW }

  // console.log(assessment)

  fs.writeFileSync('questions.json', JSON.stringify(assessment, null, ' '));

});

