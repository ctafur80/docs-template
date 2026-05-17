

window.MathJax = {

  loader: {
    load: [
      "[tex]/ams",
      "[tex]/boldsymbol",
      "[tex]/centernot"
    ]
  },


  tex: {
    inlineMath: [["$", "$"], ["\\(", "\\)"]],

    /* packages: ["base", "require"] */
    packages: {
      "[+]": ["ams"],
      "[+]": ["boldsymbol"],
      "[+]": ["centernot"]
    },


    macros: {
      nset: "\\mathbb{N}",
      zset: "\\mathbb{Z}",
      qset: "\\mathbb{Q}",
      rset: "\\mathbb{R}",
      cset: "\\mathbb{C}",


      st: "\\ : \\ ",

      // tautol: "\\textbf{1}",
      // contrad: "\\textbf{0}",


      card: ["\\operatorname{card}#1", 1],
      powset: ["\\mathcal{P}#1", 1],


      min: ["\\operatorname{mín}#1", 1],
      max: ["\\operatorname{máx}#1", 1],




    }
  },
  svg: {
    fontCache: "global"
  },


};




// De momento, en MathJax versión 3 no están soportadas fuentes distintas a la
// predeterminada de TeX (Computer Modern).
/*
window.MathJax.Hub.Config({
  "HTML-CSS" : {
    availableFonts : ["STIX"],
    preferredFont : "STIX",
    webFont : "STIX-Web",
    imageFont : null
  }
});
*/

