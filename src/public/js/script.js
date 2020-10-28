async function getCategories() {
    await fetch('/api/categorias', {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: 'Categorias' })
    })

    .then(response => response.json())
    .then(result => console.log(result))
}

let formulario = document.getElementById('formulario');





getCategories()