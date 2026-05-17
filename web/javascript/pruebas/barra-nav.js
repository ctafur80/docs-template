
// Seleccionamos todas las secciones con clases que empiezan por "level"
const sections = document.querySelectorAll('section[class^="level"]');
const menu = document.getElementById('menu');

sections.forEach((section, index) => {
  // Buscamos el encabezado que sigue inmediatamente a la sección
  // Si los encabezados están dentro de la sección, ajusta el selector
  let header = section.querySelector('h2, h3, h4, h5, h6');

  // Si no se encuentra el encabezado dentro de la sección, se puede buscar el siguiente hermano
  if (!header) {
    header = section.nextElementSibling;
  }

  // Si encontramos el encabezado y tiene texto
  if (header && header.textContent.trim() !== "") {
    // Generamos un id para el encabezado si no lo tiene
    if (!header.id) {
      header.id = 'header-' + index;
    }

    // Creamos un elemento de lista para la navegación
    const li = document.createElement('li');

    // Podemos usar la clase de la sección para dar un estilo jerárquico
    li.classList.add(section.className);

    // Creamos el enlace
    const a = document.createElement('a');
    a.href = '#' + header.id;
    a.textContent = header.textContent;

    li.appendChild(a);
    menu.appendChild(li);
  }
});




