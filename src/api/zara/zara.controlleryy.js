const cheerio = require('cheerio')
const axios = require('axios').default;

const fethHtml = async (url) => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch {
        console.error(`ERROR: An error occurred while trying to fetch the URL: ${url}`);
    }
};

const extractDeal = ($) => {

    const images = $
        .find(".search_capsule")
        .find("img")
        .attr('src')

    const title = $
        .find(".responsive_search_name_combined")
        .find("div[class='col search_name ellipsis'] > span[class='title']")
        .text()
        .trim();

    const releaseDate = $
        .find(".responsive_search_name_combined")
        .find("div[class='col search_released responsive_secondrow']")
        .text()
        .trim();

    const link = $.attr("href").trim();

    const priceSelector = $
        .find("div[class='col search_price_discount_combined responsive_secondrow']")
        .find("div[class='col search_price discounted responsive_secondrow']");

    const originalPrice = priceSelector
        .find("span > strike")
        .text()
        .trim();

    const pricesHtml = priceSelector.html().trim();
    const matched = pricesHtml.match(/(<br>(.+\s[0-9].+.\d+))/);

    const discountedPrice = matched[matched.length - 1];

    // console.log(`${title} - ${releaseDate} - ${originalPrice}`)
    console.log(images)

    return {
        images,
        title,
        releaseDate,
        originalPrice,
        discountedPrice,
        link
    };
};

const scrapSteam = async () => {
    const steamUrl =
        "https://store.steampowered.com/search/?filter=weeklongdeals";

    const html = await fethHtml(steamUrl);

    const $ = cheerio.load(html);

    const searchResults = $("body").find(
        "#search_result_container > #search_resultsRows > a"
    );

    console.log(searchResults.html())

    const deals = searchResults
        .map((idx, el) => {
            const elementSelector = $(el);
            return extractDeal(elementSelector);
        })
        .get();

    return deals;
};

const getCategories = async (req, res) => {
    const result = await scrapSteam()
    res.json(result)
}


module.exports = { getCategories }