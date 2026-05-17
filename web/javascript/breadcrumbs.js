

// Función que actualiza la miga de pan según la sección visible
function actualizarBreadcrumb() {
  // Se determina el punto medio de la ventana
  const midX = window.innerWidth / 2;
  const midY = window.innerHeight / 2;
  // Se obtienen los elementos en ese punto
  const elementos = document.elementsFromPoint(midX, midY);
  let seccionActual = null;

  // Se busca el primer elemento que sea una sección
  for (const el of elementos) {
    if (el.tagName.toLowerCase() === "section") {
      seccionActual = el;
      break;
    }
  }


  if (seccionActual) {
    // Se recorre la jerarquía de secciones que envuelven a la sección actual
    const seccionesBreadcrumb = [];
    let sec = seccionActual;
    while (sec && sec.tagName.toLowerCase() === "section") {
      seccionesBreadcrumb.unshift(sec);
      sec = sec.parentElement ? sec.parentElement.closest("section") : null;
    }

    // Se extraen los títulos de cada sección (se asume que el primer heading dentro de la sección es el título)
    const titulos = seccionesBreadcrumb.map(s => {
      let heading = s.querySelector("h1, h2, h3, h4, h5, h6");
      // En caso de no encontrarlo, se puede buscar en el siguiente hermano (según la estructura)
      if (!heading && s.nextElementSibling && /^h[1-6]$/.test(s.nextElementSibling.tagName.toLowerCase())) {
        heading = s.nextElementSibling;
      }
      return heading ? heading.textContent.trim() : "";
    }).filter(texto => texto !== "");

    // Se actualiza el contenedor del breadcrumb
    const breadcrumbContainer = document.getElementById("breadcrumb");
    if (breadcrumbContainer) {
      breadcrumbContainer.textContent = titulos.join(" > ");
    }
  }
}

// Se actualiza la miga de pan al cargar, al hacer scroll y al redimensionar la ventana
document.addEventListener("DOMContentLoaded", actualizarBreadcrumb);
document.addEventListener("scroll", actualizarBreadcrumb);
window.addEventListener("resize", actualizarBreadcrumb);


