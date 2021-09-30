var channelIDInp = document.getElementById("getChannelID");
var mainChannelNameInp = document.getElementById("getChannelName");
var channelNameText = document.getElementById("channelNameText");
var pmHandler = document.getElementById("pmHandler");

// Get cookie for channel name
var channelNameCookie = getCookie("channelName");
if (channelNameCookie !== false){
    channelIDInp.value = channelNameCookie;
}

channelIDInp.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      startChat(channelIDInp.value)
    }
});

// Start chat
function startChat(channelname) {
    
    const client = new tmi.Client({
        connection: {
            secure: true,
            reconnect: true
        },
        
        channels: [channelname]
    });
    try {
        client.connect();
        document.cookie = `channelName=${channelname}`;
        mainChannelNameInp.style.border = "2px solid rgb(173, 173, 13)";
        channelIDInp.remove();
        channelNameText.innerHTML = `Connecting To ${channelname}`;
        
        client.on('connected', () => {
            mainChannelNameInp.style.border = "2px solid green";
            channelNameText.innerHTML = `Connected To ${channelname}`
        })
        
    } catch (error) {
        channelNameText.innerHTML = `Can't Connect Tp ${channelname}`
        return mainChannelNameInp.style.border = "2px solid red";
    }
        client.on("chat", (channel, tags, message, self) => {
            if(!tags.mod) return;
            const messageArry = message.split(" ")
            if(!messageArry[1]) return;
            if(message.startsWith("-pm")){
                newChat(tags['display-name'], "normal", message)
            }else if(message.startsWith("-spm")){
                newChat(tags['display-name'], "prime", message)
            }
        })
}

function newChat(username, stats, message) {
    var mainDiv = document.createElement("div");
    var usernameP = document.createElement("p");
    var messageP = document.createElement("p");
    const messageSplit = message.split(" ");

    messageP.className = "text";

    if (stats == "prime"){
        // Spcial pm
        mainDiv.className = "pm shadow red";
        usernameP.className = "username";
        usernameP.style.color = "red";

        let check = false
        let allTime = 0
        var interval = setInterval(() => {
            if(check == false){
                mainDiv.style.boxShadow = "0 0 10px 5px red"
                check = true
            }else{
                mainDiv.style.boxShadow = "0 0 0 0 red"
                check = false
            }
            allTime = allTime + 300
            if(allTime >= 30000){
                mainDiv.style.boxShadow = "0 0 0 0 red";
                allTime = 0
                clearInterval(interval)
            }
        }, 300);

    }else{
        // Normal pm
        mainDiv.className = "pm green";
        usernameP.className = "username";
        usernameP.style.color = "#00ff00";
    }

    pmHandler.insertBefore(mainDiv, pmHandler.firstChild)
    mainDiv.appendChild(usernameP);
    mainDiv.appendChild(messageP);

    usernameP.innerHTML = `${username}: `;
    messageP.innerHTML = message.replace(`${messageSplit[0]} `, "");

    mainDiv.scrollIntoView({behavior: "smooth"});
}

function getCookie(cookieName) {
    var cookies = document.cookie.split(";");
    for(const i of cookies){
        const iSplit = i.split("=")
        if(iSplit[0] == cookieName){
            return iSplit[1];
        }
    }
    return false;
}