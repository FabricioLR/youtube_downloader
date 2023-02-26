(async () => {
    const http = require('http')
    const fs = require('fs')
    const axios = require("axios")
    const arguments = process.argv

    if (arguments.length == 2){
        console.log(`
            -url URL                 video url
            -o OUTPUT_DIRECTORY      directory path
            -n NAME                  file name
        `)
        return
    }

    if (!arguments.includes("-url")) {
        console.log("Url not provided")
        return
    }

    const output = arguments.includes("-o") ? arguments[arguments.findIndex((value) => value == "-o") + 1].endsWith("/") ? arguments[arguments.findIndex((value) => value == "-o") + 1] : arguments[arguments.findIndex((value) => value == "-o") + 1] + "/" : ""
    const fileName = arguments.includes("-n") ? arguments[arguments.findIndex((value) => value == "-n") + 1] + ".mp4" : ""
    const videoId = arguments[arguments.findIndex((value) => value == "-url") + 1].split("v=")[1].split("&")[0]

    const videoInfo = await axios.get("https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + videoId + "&fields=items(id,snippet)&key=AIzaSyD09BuHU-VBcTmWrth_GB4otF-GM0oi220")
    const videoName = videoInfo.data.items[0].snippet.title + ".mp4"

    const file = fs.createWriteStream(output == "" ? (fileName == "" ? videoName : fileName) : (output + String(fileName == "" ? videoName : fileName) ))
    http.get("http://www.youtube.com/embed/" + videoId, function(response) {
       response.pipe(file)

       file.on("finish", () => {
           file.close()
           console.log("Download Completed");
       })
    })
})()
