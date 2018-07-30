require("dotenv").config();
var fs = require("fs");
var keys = require("./keys");
//Incorporating the reqest npm packages
var Twitter = require("twitter");
var Spotify = require('node-spotify-api');
var request = require("request");

//Getting access keys and tokens.
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

// Read command line arguments
var cmdArgs = process.argv;

// The LIRI command is the second argument
var liriCommand = cmdArgs[2];

//Spaces fix and liriArg stuff. 
var liriArg = '';

for (let i = 3; i < cmdArgs.length; i++) {
    liriArg += cmdArgs[i] + ' ';
}

var log = function (input) {
    console.log(JSON.stringify(input, null, 2));
}


//Function to display the last twenty tweets
function displayTweets() {
    var params = { screen_name: "clearly_liri", count: 20 }
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (error) {
            console.log("Error Occurred: " + error);
        }
        for (var j = 0; j < tweets.length; j++) {
            console.log("===========================");
            console.log(j + 1 + ". ", tweets[j].text)
            console.log("");
            
            //Adds tweets to file
            fs.appendFile('log.txt', "@clearly_liri: " + tweets[j].text, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    console.log("Content was added.");
                }
                
            });
        }
    })
};

//Function to get Spotify information
function displaySpotify(song) {
    let search;
    if (song === undefined) {
        search = "The Sign Ace of Base";
    } else {
        search = song;
    }
    spotify.search({ type: 'track', query: search }, function (err, data) {
        if (err) {
            return console.log("Error occurred: " + err);
        }
        
        var spotifyInformation = "Artist Name: " + data.tracks.items[0].artists[0].name + "\n" + "Album Name: " + data.tracks.items[0].album.artists[0].name + "\n" + "Song Name: " + data.tracks.items[0].name + "\n" + "Link: " + data.tracks.items[0].external_urls.spotify + "\n";
        
        console.log(spotifyInformation);

        fs.appendFile('log.txt', spotifyInformation, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Content was added.");
            }
            
        });
    });
};

//Function to get movie information
function displayMovie() {
    var queryURL = "https://www.omdbapi.com/?t=" + liriArg + "&apikey=trilogy";
    //Request data from API
    request(queryURL, function (error, response, body) {
        var object = JSON.parse(body);
        if (error) {
            console.log("Error Occurred: " + error);
        }
        
        var movieInformation = "Movie Title: " + object.Title + "\n" + "Year: " + object.Year + "\n" + "iMDB Rating: " + object.Ratings[0].Value + "\n" + "Rotten Tomatoes Rating: " + "\n" + object.Ratings[1].Value + "\n" + "Country: " + object.Country + "\n" +  "Languages: " + object.Language + "\n" + "Plot: " + object.Plot + "\n" + "Actors: " + object.Actors;
        //Display Movie Information
        console.log(movieInformation);

        //Append Movie Information to Log.txt file. 
        fs.appendFile('log.txt', movieInformation, function (err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Content was added.");
            }
            
        });
    })
};

//Function to read random.txt 
function doWhatItSays() {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            console.log("Error Occurred: " + error);
        }
        console.log(data);
        var text = data.split(',');
        displaySpotify(text[1]);
    });
};

//Log tweets if Liri command equals my-tweets
if (liriCommand === "my-tweets") {
    console.log("These are the latest tweets");
    displayTweets();
}

//log Spotify information if liri command equals spotify-this-song
if (liriCommand === "spotify-this-song") {
    console.log("Spotify Stuff: ");
    let song = process.argv[3];
    displaySpotify(song);
}

if (liriCommand === "movie-this") {
    console.log("Movie Information: ");
    displayMovie();
}

if (liriCommand === "do-what-it-says") {
    console.log("Spotify Information for 'I Want it That Way': ");
    doWhatItSays();
}
