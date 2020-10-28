const cheerio = require('cheerio')
const axios = require('axios').default;


let indexPage = (req, res, next) => {
    res.render("index")
}

const init = () => {
    return new Promise((resolve, reject) => {
        const listCategories = [];
        const URL = "https://www.zara.com/co/";

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

const getCategories = async (req, res) => {
    let categorias = await init();
    categorias.length = categorias.length - 3;

    console.log(categorias)
    res.json({
        categorias
    })
}

const categoria = (req, res) => {
    console.log(req.params)
}


const subcategoria = (req, res) => {
    console.log(req.params)
}

module.exports = {
    indexPage,
    getCategories,
    categoria,
    subcategoria
}