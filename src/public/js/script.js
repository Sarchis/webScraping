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