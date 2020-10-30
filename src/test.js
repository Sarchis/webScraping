const puppeteer = require("puppeteer");
const cheerio = require('cheerio');

(async () => {
    // console.log(`Consultando imágenes de ${enlace} , ${categoria}, ${subcategoria}`)

    // const enlace = 'https://www.zara.com/co/es/mujer-pantalones-l1335.html?v1=1549251';
    const enlace = 'https://www.zara.com/co/es/mujer-prendas-exterior-l1184.html?v1=1549242';

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    const content = await page.content();

    await page.goto(enlace, { waitUntil: "networkidle0" });

    const text = await page.evaluate(() => {
        const parent = document.querySelector(".product-info");
        let child = parent.querySelector('.product-info-item-label');

        child.scrollIntoView();

        if(child === null) {
            return child = 'No label'
        } else {
            return child.innerText;
        }
    })
    console.log(text);
    await browser.close();


})();



const getPhotosByCategory = async (enlace, categoria, subcategoria) => {
    console.log(`Consultando imágenes de ${enlace} , ${categoria}, ${subcategoria}`)

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto(enlace, { waitUntil: "networkidle0" });

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

            const label = await scrollAndExtract('.product-info > .product-info-item-label > .label-undefined', "innerHTML");
            const title = await scrollAndExtract('.product-name', 'innerText');
            const img = await scrollAndExtract('.product-media', "src");

            // remove the parent here
            await scrollAndExtract("div._groups-wrap ul li", null, true);

            return {label, title, img };
        }

        const products = [];
        async function allProducts() {
            if (products.length < 10) {
                await delay(500);
                window.scrollTo(0, 0);

                const data = await extractor();
                // if (!data.img) return null;
                if (!data.label || !data.title || !data.img) return null;

                products.push(data);
                return allProducts();
            }
        }

        // run the function to grab data
        await allProducts();

        // and return the product from inside the page
        return products;
    });

    console.log(productList);

    productList.forEach(async function (item) {
        // console.log(item)
        try {
            const saveDataDB = new zaraModel(item);
            // await saveDataDB.save()
        } catch (error) {
            console.error("Error en almacenamiento: ", error)
        }
    })

    await browser.close();

}