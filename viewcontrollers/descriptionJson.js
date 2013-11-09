var request = require('request');
var parseString = require('xml2js').parseString;



module.exports.controller = function(app) {
    app.get('/descriptionJson', function(req, res) {
        /*Variables declaration starts */
        var wordDetails = {};
        var imageList = [];
        var phrasesList = {};
        var anagramsString = "";

        var Phrase = "";
        var Anagrams = "";
        var Images = [];
        var Speech = "",
            Definition = "",
        Usage = "",
        Audio = "",
        Synonyms = "",
        Antonyms = "";
        /*Variables ends */

        var inputWord = req.query.word;

        /*function definitions */
        var getWordDetails = function(keyWord) {
            url = 'http://api.pearson.com/v2/dictionaries/entries?headword=' + keyWord + '&apikey=6pUM7idZK2khzpx31xSfUoUapA2wQbzm';
            request(url, function(err, response, data) {
                console.log(err);
                if (!err && response.statusCode == 200) {
                    wordDetails = JSON.parse(data);
                    console.log(wordDetails);

                    if (Object.keys(wordDetails).length > 0) {
                        for (var item = 0; item < wordDetails.results.length; item++) {
                            if (wordDetails.results[item].headword == keyWord) {
                                Definition = wordDetails.results[item].senses[0].definition;
                                if (wordDetails.results[item].senses[0].examples) {
                                    Usage = wordDetails.results[item].senses[0].examples[0].text;
                                    if (wordDetails.results[item].senses[0].examples[0].audio)
                                        Audio = "http://api.pearson.com" + wordDetails.results[item].senses[0].examples[0].audio[0].url;
                                }
                                break;
                            }
                        }
                    }
                }
                getDKImages(keyWord);
            });
        }
        var getDKImages = function(keyWord) {
            url = 'http://api.pearson.com/dk/v1/images?caption=' + keyWord + '&limit=3&apikey=6pUM7idZK2khzpx31xSfUoUapA2wQbzm';
            request(url, function(err, response, data) {

                if (!err && response.statusCode == 200) {
                    imageList = JSON.parse(data);

                    if (imageList.images && imageList.images.length > 0) {
                        imageList.images.forEach(function(imageItem) {
                            Images.push(imageItem.url);
                        })
                        
                    }
                    else
                        getGoogleImages(keyWord);
                }
                getPhrases(keyWord);
            });
        }
        var getGoogleImages = function(keyWord) {
            url = 'http://ajax.googleapis.com/ajax/services/search/images?v=1.0&q=' + keyWord;
            request(url, function(err, response, data) {
                if (!err && response.statusCode == 200) {
                    imageList = JSON.parse(data);
                    if (imageList.responseData && imageList.responseData.results) {
                        imageList.responseData.results.forEach(function(result) {
                            Images.push(result.url);
                        });
                        
                    }
                }
            });
        };
        var getPhrases = function(keyWord) {
            url = 'http://stands4.com/services/v2/phrases.php?uid=2167&tokenid=LL870U6UWvQIh9w&phrase=' + keyWord;
            request(url, function(err, response, data) {
                if (!err && response.statusCode == 200) {
                    parseString(data, function(error, result) {
                        phraseObj = result;
                        if (!error && phraseObj.results.result) {
                            Phrase = phraseObj.results.result[0].explanation;
                        } else if (error) {
                            console.log('parse error in getPhrases: ' + error.message);
                        }

                    });
                }
                getAnagrams(keyWord);
            });
        };
        var getAnagrams = function(keyWord) {
            url = 'http://anagramica.com/best/:' + keyWord;
            request(url, function(err, response, anagramdata) {
                if (!err && response.statusCode == 200) {
                    var jsonData = JSON.parse(anagramdata);
                    console.log(jsonData);
                    Anagrams = jsonData['best'].join(",");
                }
                getSynonyms(keyWord);
            });
        };
        var getSynonyms = function(keyWord) {
            url = 'http://stands4.com/services/v2/syno.php?uid=2167&tokenid=LL870U6UWvQIh9w&word=' + keyWord;
            request(url, function(err, response, data) {
                if (!err && response.statusCode == 200) {
                    parseString(data, function(error, parsedJson) {
                        if (!error && parsedJson.results.result) {
                            Synonyms = parsedJson.results.result[0].synonyms;
                            Antonyms = parsedJson.results.result[0].antonyms;
                            Speech = parsedJson.results.result[0].partofspeech;
                            if (Definition == "" || Definition == null)
                                Definition = parsedJson.results.result[0].definition;
                        }

                    });
                }
                res.send({
                    KeyWord: keyWord,
                    Speech: Speech,
                    Audio: Audio,
                    Definition: Definition,
                    Usage: Usage,
                    Phrase: Phrase,
                    Synonyms: Synonyms,
                    Antonyms: Antonyms,
                    Anagrams: Anagrams,
                    Images: Images
                });
            });
        }

        getWordDetails(inputWord);
    });
};