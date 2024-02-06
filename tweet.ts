class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        if(this.text.toLowerCase().includes("just completed")||this.text.toLowerCase().includes("just posted") ){
            return "completed_event";
        }
        else if(this.text.toLowerCase().includes("right now")){
            return "live_event";
            }
        else if (this.text.toLowerCase().includes("achieved")||this.text.toLowerCase().includes("set a goal") ){
            return "achievement";
        }
        else
            return "miscellaneous";
        
        
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        
        if( this.text.toLowerCase().includes(" - ") && this.source == "completed_event" ) {
            return true;
        }
        return false;
    }
    // return user text


    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        return this.text.substring(this.text.indexOf(' - '), this.text.indexOf('http'));
    }

    get day(): string {
        if((this.time.toString()).includes("Mon")){return "Mon"}
        else if((this.time.toString()).includes("Tue")){return "Tue"}
        else if((this.time.toString()).includes("Wed")){return "Wed"}
        else if((this.time.toString()).includes("Thu")){return "Thu"}
        else if((this.time.toString()).includes("Fri")){return "Fri"}
        else if((this.time.toString()).includes("Sat")){return "Sat"}
        else if((this.time.toString()).includes("Sun")){return "Sun"}
        return ""
    }
    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        if(this.text.includes("walk")){
            return "walking";
        }
        else if (this.text.includes("hike")){
            return "hiking";
        }
        else if (this.text.includes("swim")){
            return "swimming";
        }
        else if (this.text.includes("yoga")){
            return "yoga";
        }
        else if (this.text.includes("biking")){
            return "biking";
        }
        else if (this.text.includes("bike")){
            return "biking";
        }
        else if (this.text.includes("mtn bik")){
            return "biking";
        }
        else if (this.text.includes("workout")){
            return "workout";
        }
        else if (this.text.includes("run")&& !(this.text.includes("ski"))){
            return "running";
        }
        
        else if (this.text.includes("ski")&& this.text.includes("run")){
            return "skiing";
        }

        return "other"
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        var parsed = this.text.split(" ");
         if (parsed[4] == "mi"){
            return parseFloat(parseFloat(parsed[3]).toFixed(2));
        }
        else if (parsed[4] == "km"){
            return parseFloat((parseFloat(parsed[3])/1.609).toFixed(2));
        }
        else
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
            let tweetTextWithLinks = this.text.replace(/(https:\/\/[^\s]+)/g, '<a href="$1" target="_blank">$1</a>');
    
            return `
                <tr>
                    <td>${rowNumber}</td>
                    <td>${this.activityType}</td>
                    <td>${tweetTextWithLinks}</td>
                </tr>
            `;
        }
    

}