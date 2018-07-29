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

//  may contain spaces fix - you will need this for song and movie information. 
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
        var artistName = data.tracks.items[0].artists[0].name;
        var albumName = data.tracks.items[0].album.artists[0].name;
        var songName = data.tracks.items[0].name;
        var previewLink = data.tracks.items[0].external_urls.spotify;

        //Display Spotify Information
        console.log(
            "Artist Name: " + artistName + "\n" +
            "Album Name: " + albumName + "\n" +
            "Song Name: " + songName + "\n" +
            "Link: " + previewLink + "\n"
        );
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
        // console.log(object);
        var movieTitle = object.Title;
        var movieYear = object.Year;
        var imdbRating = object.Ratings[0].Value;
        var rottenRating = object.Ratings[1].Value;
        var country = object.Country;
        var movielanguage = object.Language;
        var plot = object.Plot;
        var actors = object.Actors;

        console.log(
            "Movie Title: " + movieTitle + "\n" + 
            "Year : " + movieYear + "\n" +
            "IMDB Rating: " + imdbRating + "\n" +
            "Rotten Tomatoes Rating: " + rottenRating + "\n" +
            "Country: " + country + "\n" + 
            "Languages: " + movielanguage + "/n" + 
            "Plot: " + plot + "\n" + 
            "Actors: " + actors
        );
    })
};

//Function to read random.txt 
function doWhatItSays () {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            console.log("Error Occurred: " + error);
        }
        console.log(data);
    });
}


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













