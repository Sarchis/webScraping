const puppeteer = require("puppeteer");

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto("https://www.zara.com/co/es/mujer-vestidos-l1066.html?v1=1549249", { waitUntil: "networkidle0" });

    const productList = await page.evaluate(async function infinityLoader() {
        const delay = d => new Promise(r => setTimeout(r, d));

        const scrollAndExtract = async (selector, leaf, remove) => {
            const element = document.querySelector(selector);
            if (element) {
                element.scrollIntoView();
                if (remove) return element.remove(); // <-- Remove and exit
                return element[leaf];
            }
        };

        async function extractor() {
            const title = await scrollAndExtract('.product-name', 'innerText') 
            const img = await scrollAndExtract('.product-media', "src");

            // remove the parent here
            await scrollAndExtract("div._groups-wrap ul li", null, true);
            return { title, img };
        }

        const products = [];
        async function hundredProducts() {
            if (products.length < 10) {
                await delay(1000);
                window.scrollTo(0, 0);

                const data = await extractor();
                // if (!data.img) return null;
                if (!data.title || !data.img) return null;

                products.push(data);
                return hundredProducts();
            }
        }

        // run the function to grab data
        await hundredProducts();

        // and return the product from inside the page
        return products;
    });

    console.log(productList);
    console.log(productList.length);

    await browser.close();
})();