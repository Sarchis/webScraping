const cheerio = require('cheerio')
const axios = require('axios').default;

// axios.get(url)
//     .then((response) => {
//         let $ = cheerio.load(response.data)
//         $('a').each(function (i, e) {
//             let links = $(e).attr('href');
//             console.log(links)
//         })
//     })
//     .catch(function (e) {
//         console.log(e)
//     })

function getTitle($) {
    const webSiteTitle = $('title');
    console.log("Title: ", webSiteTitle.trim())
}


function getQuotes($) {
    $('.quote').each(function (index, elem) {
        let tags = []
        // console.log(index, $(elem).html())
        let text = $(elem).text();
        let author = $(elem).find("span small.author").text();
        
        $(elem).find(".tags a").each((i, el) => {
            tags.push($(el).text())
        })
        // tags.push(tag)
        console.log(tags)
    })
}

const init = async () => {
    const URL = "https://quotes.toscrape.com/";
    try {
        axios.get(URL)
            .then((response) => {
                const $ = cheerio.load(response.data);
                // $.html()
                //    getTitle($)
                getQuotes($)
            })
            .catch((err) => {
                console.error(`Error, ${err}`)
            })
    } catch (error) {
        console.error('Error')
    }
}

init();
