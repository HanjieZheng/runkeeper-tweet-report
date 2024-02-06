function parseTweets(runkeeper_tweets) {
    // Do not proceed if no tweets loaded
    if (runkeeper_tweets === undefined) {
        window.alert('No tweets returned');
        return;
    }

    let tweet_array = runkeeper_tweets.map(function(tweet) {
        return new Tweet(tweet.text, tweet.created_at);
    });

    // Sort tweets by date to ensure correct ordering for first and last date
    tweet_array.sort(function(a, b) {
        return new Date(a.time) - new Date(b.time);
    });

    // Update number of tweets
    $('#numberTweets').text(tweet_array.length);

    // Update the DOM with the earliest and latest tweet dates using JQuery
    $('#firstDate').text(new Date(tweet_array[0].time).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));
    $('#lastDate').text(new Date(tweet_array[tweet_array.length - 1].time).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }));

    let completed = 0, live = 0, achievement = 0, miscellaneous = 0, userwritten = 0;
    
    tweet_array.forEach(tweet => {
        switch (tweet.source) {
            case "completed_event":
                completed++;
                if (tweet.written) userwritten++;
                break;
            case "live_event":
                live++;
                break;
            case "achievement":
                achievement++;
                break;
            case "miscellaneous":
                miscellaneous++;
                break;
        }
    });

    // Update counts and percentages in the DOM
    $('.completedEvents').text(completed);
    $('.liveEvents').text(live);
    $('.achievements').text(achievement);
    $('.miscellaneous').text(miscellaneous);
    $('.written').text(userwritten);

    $('.completedEventsPct').text(((completed / tweet_array.length) * 100).toFixed(2) + "%");
    $('.liveEventsPct').text(((live / tweet_array.length) * 100).toFixed(2) + "%");
    $('.achievementsPct').text(((achievement / tweet_array.length) * 100).toFixed(2) + "%");
    $('.miscellaneousPct').text(((miscellaneous / tweet_array.length) * 100).toFixed(2) + "%");
    $('.writtenPct').text(((userwritten / completed) * 100).toFixed(2) + "%"); // Assuming you want the percentage of written tweets out of completed events
}

// Wait for the DOM to load
$(document).ready(function() {
    loadSavedRunkeeperTweets().then(parseTweets);
});

