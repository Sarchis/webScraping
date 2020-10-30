const cheerio = require('cheerio')
const axios = require('axios').default;
const URL = process.env.URL_ZARA;
const puppeteer = require('puppeteer');



const fethHtml = async (url) => {
    try {
        const { data } = await axios.get(url);
        return data;
    } catch {
        console.error(`ERROR: An error occurred while trying to fetch the URL: ${url}`);
    }
};
/*
* Render página principal
*/
let indexPage = async (req, res, next) => {
    let categorias = await cat();
    let subcategorias = await subCat();

    let mujeres = subcategorias.subcategorias.slice(0, 17);
    let hombres = subcategorias.subcategorias.slice(27, 44);

    categorias.length = categorias.length - 3;

    // Categorías y subcategorías mujeres
    let catM = {
        categoria: categorias[0],
        subcategoria: mujeres,
    }

    // Categorías y subcategorías hombres
    let catH = {
        categoria: categorias[1],
        subcategoria: hombres,
    }

    res.render("index.ejs", {
        categorias,
        catH,
        catM
    })
}

// Obtener categorías
const cat = () => {
    return new Promise((resolve, reject) => {
        const listCategories = [];

        axios
            .get(URL)
            .then((res) => {
                const $ = cheerio.load(res.data);

                $("#sidebar > .layout__sidebar-content > .layout-categories > div > ul > li > a > span").map((index, element) => {
                    const elementItem = {
                        category: $(element).text()
                    }
                    listCategories.push($(element).text())
                })
                resolve(listCategories)

            })
            .catch((e) => {
                console.log(e)
            })
    })
}

// Obtener subcategorías
const subCat = async () => {
    return new Promise((resolve, reject) => {
        const subcategorias = [];
        const subcategoriaHref = [];
        let datos;

        axios
            .get(URL)
            .then(async (res) => {
                const $ = cheerio.load(res.data);
                let subcategoria = $("#sidebar > .layout__sidebar-content > .layout-categories > div > ul > li > ul > li").next().next();

                subcategoria
                    .find(".layout-categories-category__subcategory > li")
                    .map((i, e) => {
                        subcategorias.push($(e).text())
                        subcategoriaHref.push($(e).find("a").attr("href"));

                        datos = {
                            subcategorias,
                            subcategoriaHref
                        }
                    })
                resolve(datos)
            })
    })
}


const getCategories = async (req, res) => {

    // (async () => {
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
    // })();

    res.json({
        productList
    })

}

const extractProduct = ($) => {

    const images = $
        .find(".item")
        .find(".product-grid-xmedia")
        // .find("._imageLoaded")
        // .attr("src")
        .html()
    console.log(images)

    return {
        images
    }
}

const getPhotosByCategory = async (enlace) => {
    console.log(`Vamos a coger las fotos del enlace ${enlace}`)

    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();

    await page.goto(enlace, { waitUntil: "networkidle0" });
    // await page.goto("https://www.zara.com/co/es/mujer-vestidos-l1066.html?v1=1549249", { waitUntil: "networkidle0" });

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

}

const categoria = (req, res) => {
    console.log(req.params);

    res.json({
        status: 200,
        data: req.params
    })
}


const subcategoria = async (req, res) => {
    console.log(req.body);

    let subcategorias = await subCat();

    let mujeres = subcategorias.subcategorias.slice(0, 17)
    let mujeresHref = subcategorias.subcategoriaHref.slice(0, 17)
    let hombres = subcategorias.subcategorias.slice(27, 44)
    let hombresHref = subcategorias.subcategoriaHref.slice(27, 44)

    var dataMujer; // Array que contiene objetos con las categorias y los enlaces [ {categoria: 'ABRIGO', enlace: 'http://...'} ]
    var categoriasMujeres = [];
    var enlacesCatMujeres = [];
    var listaDataMujer = [];

    for (let i of mujeres) {
        categoriasMujeres.push(i)
    }

    for (let j of mujeresHref) {
        enlacesCatMujeres.push(j)
    }

    categoriasMujeres.forEach((elem, idx) => {
        dataMujer = {
            categoria: elem,
            enlace: enlacesCatMujeres[idx]
        }
        listaDataMujer.push(dataMujer)
    })

    var dataHombre; // Array que contiene objetos con las categorias y los enlaces [ {categoria: 'ABRIGO', enlace: 'http://...'} ]
    var categoriasHombres = [];
    var enlaceCatHombres = [];
    var listaDataHombres = [];

    for (let i of hombres) {
        categoriasHombres.push(i)
    }

    for (let j of hombresHref) {
        enlaceCatHombres.push(j)
    }

    categoriasHombres.forEach((elem, idx) => {
        dataHombre = {
            categoria: elem,
            enlace: enlaceCatHombres[idx]
        }

        listaDataHombres.push(dataHombre)
    })

    if (req.body.categoria === 'HOMBRE') {
        const filtroH = listaDataHombres.filter((categoriaHombre) => {
            return categoriaHombre.categoria === req.body.subcategoriaH
        });
        // console.log("Resultado filtro:", filtroH)
        let enlace = filtroH[0].enlace;

        getPhotosByCategory(enlace)

    } else if (req.body.categoria === 'MUJER') {

        const filtroM = listaDataMujer.filter((categoriaMujer) => {
            return categoriaMujer.categoria === req.body.subcategoriaM
        });

        let enlace = filtroM[0].enlace
        getPhotosByCategory(enlace)

        // console.log("Resultado filtro Mujeres:", filtroM)
    } else {
        console.log('nada para hacer')
    }

    res.json({
        status: 200,
        msg: 'Ok'
    })
    // res.redirect('/api/main')
}


module.exports = {
    indexPage,
    getCategories,
    categoria,
    subcategoria
}