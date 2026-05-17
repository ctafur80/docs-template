

/* Hace que se escriba automáticamente como texto de un enlace el atributo data-label, en
los elementos referenciados que tengan este. Esto se hace solo en los anchors con clase
.nameref. */
document.addEventListener("DOMContentLoaded", function() {

  // Selecciona solo los enlaces con clase "nameref" cuyo href comience con "#"
  var enlaces = document.querySelectorAll('a.nameref[href^="#"]');

  enlaces.forEach(function(enlace) {
    // Extrae el id (eliminando el '#' del href)
    var idDestino = enlace.getAttribute("href").slice(1);
    var destino = document.getElementById(idDestino);
    if (destino) {
      // Si el elemento destino tiene el atributo "data-label", actualiza el texto del
      // enlace
      var label = destino.getAttribute("data-label");
      if (label) {
        enlace.textContent = label;
      }
    }
  });
});



