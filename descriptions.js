document.addEventListener('DOMContentLoaded', async () => {
    const runkeeperTweets = await loadSavedRunkeeperTweets();
    if (!runkeeperTweets || runkeeperTweets.length === 0) {
        alert('No tweets returned');
        return;
    }
    
    // 初始化页面和事件处理器
    initializePage(runkeeperTweets);
});

function initializePage(tweets) {
    const writtenTweets = tweets.filter(tweet => new Tweet(tweet.text, tweet.created_at).written);
    updateTable(writtenTweets);

    const searchBox = document.getElementById('searchBox');
    searchBox.addEventListener('input', () => filterTweets(searchBox.value, writtenTweets));
}

function filterTweets(searchTerm, tweets) {
    const searchTermLower = searchTerm.toLowerCase();
    const filteredTweets = tweets.filter(({text}) => text.toLowerCase().includes(searchTermLower));

    updateTable(filteredTweets);
    document.getElementById('searchCount').textContent = filteredTweets.length;
    document.getElementById('searchText').textContent = searchTerm;
}

function updateTable(tweets) {
    const tableBody = document.getElementById('tweetTableBody');
    tableBody.innerHTML = ''; // 清除现有的表格内容

    tweets.forEach((tweet, index) => {
        const rowHTML = `<tr>
            <td>${index + 1}</td>
            <td>${tweet.activityType}</td>
            <td>${tweet.distance.toFixed(2)} miles</td>
            <td>${tweet.text}</td>
            <td>${tweet.getLinksHTML()}</td>
        </tr>`;
        tableBody.innerHTML += rowHTML;
    });
}

Tweet.prototype.getLinksHTML = function() {
    const urls = this.text.match(/https?:\/\/\S+/g) || [];
    return urls.map(url => `<a href="${url}" target="_blank">Link</a>`).join(', ');
};
