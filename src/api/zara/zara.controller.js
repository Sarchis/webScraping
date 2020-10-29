const cheerio = require('cheerio')
const axios = require('axios').default;
const URL = process.env.URL_ZARA;

/*
* Render página principal
*/
let indexPage = async (req, res, next) => {
    let categorias = await cat();
    let subcategorias = await subCat();

    let mujeres = subcategorias.slice(0, 17)
    let hombres = subcategorias.slice(27, 44)

    categorias.length = categorias.length - 3;

    let catM = {
        categoria: categorias[0],
        subcategoria: mujeres
    }

    let catH = {
        categoria: categorias[1],
        subcategoria: hombres
    }

    res.render("index.ejs", {
        categorias,
        catH,
        catM
    })
}

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


const subCat = async () => {
    return new Promise((resolve, reject) => {
        const subcategorias = [];

        axios
            .get(URL)
            .then(async (res) => {
                const $ = cheerio.load(res.data);
                let subcategoria = $("#sidebar > .layout__sidebar-content > .layout-categories > div > ul > li > ul > li").next().next();

                let itemsMujeres = subcategoria
                    .find(".layout-categories-category__subcategory > li")
                    .map((i, e) => {
                        subcategorias.push($(e).text())
                    })

                resolve(subcategorias)
            })
    })
}


const getCategories = async (req, res) => {
    let subcategorias = await subCat();

    let mujeres = subcategorias.slice(0, 17)
    let hombres = subcategorias.slice(27, 44)
    // let niños = subcategorias.slice(, 17)

    // console.log(subcategorias)
    console.log("Mujeres: ", mujeres)
    console.log("Hombres: ", hombres)
}


const categoria = (req, res) => {
    console.log(req.params);

    res.json({
        status: 200,
        data: req.params
    })
}


const subcategoria = (req, res) => {
    console.log(req.body);

    res.redirect('/api/main')
}


module.exports = {
    indexPage,
    getCategories,
    categoria,
    subcategoria
}