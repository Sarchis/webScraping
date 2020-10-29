// async function getCategories() {
//     await fetch('/api/categorias', {
//         method: "POST",
//         headers: {
//             Accept: "application/json",
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ text: 'Categorias' })
//     })

//     .then(response => response.json())
//     .then(result => console.log(result))
// }

// let formulario = document.getElementById('formulario');

// // getCategories()

$(document).ready(function() {
    document.getElementById('submit').disabled = true;
})


function getSelectValue() {
    var selectedValue = document.getElementById("categoria1").value;
    console.log(selectedValue);

    if (selectedValue === 'MUJER') {
        document.getElementById('subcategoriaMujer').style.display = "inline-block";
        document.getElementById('subcategoriaHombre').style.display = "none";
        document.getElementById('submit').disabled = false;
    } else if (selectedValue === 'HOMBRE') {
        document.getElementById('subcategoriaHombre').style.display = "inline-block";
        document.getElementById('subcategoriaMujer').style.display = "none";
        document.getElementById('submit').disabled = false;
    }
}
getSelectValue();