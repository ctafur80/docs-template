

/* Comportamientos para la tabla de contenidos #TOC */



// Doy algo de retardo para que, en la función siguiente, haga bien la comprobación de la
// sección actual.
const observerOptions = {
  root: null,
  rootMargin: "0px 0px -20% 0px", // Por ejemplo, para "anticipar" la entrada
  threshold: 0.1
};


// Resalta, en la tabla de contenidos, la sección en la que me encuentro en ese momento.
document.addEventListener("DOMContentLoaded", function() {


  // Seleccionamos todas las secciones y los enlaces de la TOC
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll("#TOC a");

  // Opciones para el IntersectionObserver
  const observerOptions = {
    root: null,           // Utiliza la ventana como contenedor
    rootMargin: "0px",    // Margen de 0
    threshold: 0.5        // Se considera visible cuando al menos el 50% de la sección está en la vista
  };

  // Función que se ejecuta cuando cambia la visibilidad de alguna sección
  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting) {
        // Se obtiene el id de la sección visible
        const idVisible = entry.target.getAttribute('id');

        // Se actualizan los enlaces de la TOC: se remueve la clase active de todos y se añade al enlace correspondiente
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + idVisible);
        });
      }
    });
  };

  // Creamos el observer y lo aplicamos a cada sección
  const observer = new IntersectionObserver(observerCallback, observerOptions);
  sections.forEach(section => observer.observe(section));
});




// Tras seleccionar un enlace de la tabla de contenidos, se cierra esta automáticamente.
document.addEventListener("DOMContentLoaded", function() {
  const tocLinks = document.querySelectorAll("#TOC a");
  const tocCheckbox = document.getElementById("toc-check");

  tocLinks.forEach(link => {
    link.addEventListener("click", () => {
      tocCheckbox.checked = false;
    });
  });
});



