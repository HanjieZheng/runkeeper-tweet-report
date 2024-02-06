document.addEventListener('DOMContentLoaded', async function() {
    const runkeeper_tweets = await loadSavedRunkeeperTweets();
    if (!runkeeper_tweets) {
        alert('No tweets returned');
        return;
    }

    const processedTweets = processTweets(runkeeper_tweets);
    displayActivityCounts(processedTweets);
    initializeVisualizations(processedTweets);
    toggleVisualization();
});

function processTweets(tweets) {
    return tweets.map(tweet => new Tweet(tweet.text, tweet.created_at));
}

function displayActivityCounts(tweets) {
    const activitySummary = summarizeActivities(tweets);
    for (const [key, value] of Object.entries(activitySummary.counts)) {
        $(`#${key}`).text(value);
    }
    $(`#numberActivities`).text(Object.keys(activitySummary.counts).length);
    updateActivityTypeSpans(activitySummary.sortedActivities);
}

function summarizeActivities(tweets) {
    let counts = { completed: 0, live: 0, achievement: 0, miscellaneous: 0 };
    tweets.forEach(tweet => {
        if (tweet.source in counts) {
            counts[tweet.source]++;
        }
    });
    return { 
        counts, 
        sortedActivities: Object.entries(counts).sort((a, b) => b[1] - a[1]).map(entry => entry[0])
    };
}

function updateActivityTypeSpans(sortedActivities) {
    sortedActivities.slice(0, 3).forEach((activity, index) => {
        $(`#activityRank${index + 1}`).text(activity);
    });
}

function initializeVisualizations(tweets) {
    const completedTweets = tweets.filter(tweet => tweet.source === 'completed_event');
    const activityData = aggregateActivityData(completedTweets);
    renderActivityChart(activityData);
}

function aggregateActivityData(tweets) {
    let aggregatedData = tweets.reduce((acc, tweet) => {
        const dayOfWeek = tweet.time.getDay(); // 转换为周几（0-6）
        const activityType = tweet.activityType;
        const distance = tweet.distance;

        if (!acc[activityType]) {
            acc[activityType] = {};
        }

        if (!acc[activityType][dayOfWeek]) {
            acc[activityType][dayOfWeek] = { totalDistance: 0, count: 0 };
        }

        acc[activityType][dayOfWeek].totalDistance += distance;
        acc[activityType][dayOfWeek].count++;

        return acc;
    }, {});

    // 转换聚合数据为可视化所需的格式
    const result = [];
    Object.keys(aggregatedData).forEach(activityType => {
        Object.keys(aggregatedData[activityType]).forEach(dayOfWeek => {
            const { totalDistance, count } = aggregatedData[activityType][dayOfWeek];
            result.push({
                activityType,
                dayOfWeek,
                averageDistance: totalDistance / count
            });
        });
    });

    return result;
}


function renderActivityChart(data) {
    const spec = {
        "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
        "description": "Average distances by day of the week for all activities.",
        "data": { "values": data },
        "mark": "bar",
        "encoding": {
            "x": { "field": "dayOfWeek", "type": "ordinal", "title": "Day of the Week", "axis": { "labelAngle": 0 }},
            "y": { "field": "averageDistance", "type": "quantitative", "title": "Average Distance (miles)" },
            "color": { "field": "activityType", "type": "nominal", "title": "Activity Type" },
            "tooltip": [
                { "field": "activityType", "type": "nominal" },
                { "field": "dayOfWeek", "type": "ordinal" },
                { "field": "averageDistance", "title": "Avg Distance", "type": "quantitative", "format": ".2f" }
            ]
        }
    };

    vegaEmbed('#activityVis', spec, { actions: false });
}


function toggleVisualization() {
    $('#aggregate').click(() => {
        $('#distanceVis').toggle();
        $('#distanceVisAggregated').toggle();
    });
}
