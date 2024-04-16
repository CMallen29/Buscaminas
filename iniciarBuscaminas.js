


window.addEventListener("load", inicio);


// ------------ LISTENERS ------------ \\

function inicio() {
  document.getElementById("ok").addEventListener("submit", elegirNivel);             //---> elegir nivel
  document.getElementById("tablero").addEventListener("contextmenu", pulsarBoton);   //---> poner bandera
  document.getElementById("tablero").addEventListener("click", pulsarBoton);         //---> pulsar boton
} //inicio


// ------------ TEST ------------ \\

function prueba(e) {
  console.log("prueba");
  console.log(e);
  console.log(e.target);

}//prueba(e)


// ------------ VARIABLES GLOBALES ------------ \\


let arrayTablero = new Array();
let lado, numeroBanderas,celdasRestantes;
let minutos =segundos= 0;



// ------------ UTILIDADES ------------ \\


function tiempoTranscurrido() {
  segundos++;

  if (segundos < 10) {
    segundos = "0" + segundos;
  }

  if (segundos == 60) {
    segundos = 0;
    minutos++;
  }

  let tiempoTranscurrido = minutos + ":" + segundos;
  document.getElementById("time").innerHTML = tiempoTranscurrido;
}//tiempoTranscurrido()

setInterval(tiempoTranscurrido, 1000);



function ponerClase(casilla, nombreClase) {
  document.getElementById(casilla.posicionX + " " + casilla.posicionY).classList.add(nombreClase);
}//ponerClase(casilla,nombreClase)



function ponerNumero(casilla, numero) {
  document.getElementById(casilla.posicionX + " " + casilla.posicionY).textContent = numero;
}//ponerClase(casilla,nombreClase)



function numeroMinas() {
  return (arrayTablero.length * 0.13).toFixed(0);
} //numeroMinas()



function encontrarCasilla(x, y) {
  return arrayTablero.find(casilla => casilla.posicionX === x && casilla.posicionY === y);
}//encontrarCasilla(x, y)






// ------------ LÓGICA ------------ \\


function elegirNivel(evento) {
  evento.preventDefault(); 

  if (confirm('¿Elegir esta dificultad?')) {

    document.querySelector('input').value = "RESETEAR";
    let dificultad;
    dificultad = document.getElementById("nivel").value;

  
    arrayTablero = [];

   
    switch (dificultad) {
      case "FÁCIL":
        lado = 9;
        break;

      case "MEDIO":
        lado = 13;
        break;

      case "DIFÍCIL":
        lado = 19;
        break;
    }

   
    dibujarTableroHTML(lado); 
    colocarMinas(numeroMinas());
    

    numeroBanderas = numeroMinas();
    celdasRestantes = arrayTablero.length - 1 - numeroBanderas;
    document.getElementById("flag").innerHTML = numeroBanderas;

  }

}//elegirNivel(evento)





function dibujarTableroHTML(lado) {

  let boton, intro;
  let tablero = document.getElementById("tablero");

 
  while (tablero.firstChild) {
    tablero.removeChild(tablero.firstChild);
  }

  for (let indiceFila = 0; indiceFila < lado; indiceFila++) {

    
    let div = document.createElement("div");
    div.id = indiceFila;


    for (let inidiceColumna = 0; inidiceColumna < lado; inidiceColumna++) {

     
      boton = document.createElement("button");
      boton.id = indiceFila + " " + inidiceColumna;

      
      div.appendChild(boton);

      
      arrayTablero.push({
        posicionX: indiceFila,
        posicionY: inidiceColumna,
        bloquear: false,
        bomba: false,
        banderilla: false,
        contador: 0
      });

    }

    tablero.appendChild(div); 
  }
}//dibujarTableroHTML(tablero)




function colocarMinas(numMinas) {

  
  for (let i = 0; i < numMinas;) {

   
    let x = Math.floor(Math.random() * lado);
    let y = Math.floor(Math.random() * lado);

    
    let casilla = encontrarCasilla(x, y);

    if (casilla && casilla.bomba === false) {
      i++; 
      casilla.bomba = true;
     
      sumarAlrededorBomba(casilla);
      
    }
  }
} //colocarMinas(numMinas)



function sumarAlrededorBomba(casilla) {

   
  for (let i = 0; i < 3; i++) {

   
    for (let j = 0; j < 3; j++) {
      let x = casilla.posicionX - 1 + i;
      let y = casilla.posicionY - 1 + j;
      let casillaAdyacente = encontrarCasilla(x, y);

     
      if ((x >= 0 && x < lado) && (y >= 0 && y < lado)) {

        
        if (casillaAdyacente.bomba === true) {
          casillaAdyacente.contador = -1;
                 
        } else if (casillaAdyacente.bomba === false) {
          casillaAdyacente.contador++;
         
        }
      }
    }
  }
}//sumarAlrededorBomba(casilla)



function pulsarBoton(evento) {

 
  let boton = evento.target.id.split(" ");

  
  let casilla = encontrarCasilla(parseInt(boton[0]), parseInt(boton[1]));


  if (evento.type == "click") {

    if(celdasRestantes == 0){
      arrayTablero.forEach(element => {
        element.bloquear = true;
      });
      

      Swal.fire({
        title: "!VICTORIA ROYAL!",
        text: "BUENA PARTIDA",
        imageUrl: "img/victoria.png",
        imageWidth: 360,
        imageHeight: 360,
        imageAlt: "Custom image"
      });
     
      
    }

    if (casilla.bloquear == false) {
      if (casilla.banderilla == true) {
        evento.preventDefault();
        alert("QUITA LA BANDERA ANTES DE PULSAR");

      } else if (casilla.bomba == true) {
        ponerClase(casilla, "bomba");
        arrayTablero.forEach(element => {
          element.bloquear = true;
          if (element.bomba == true) {
            ponerClase(element, "bomba");
          }
        });

      Swal.fire({
        title: "MALA SUERTE",
        text: "PRUEBA OTRA VEZ",
        imageUrl: "img/derrota.jpg",
        imageWidth: 400,
        imageHeight: 200,
        imageAlt: "Custom image",
        
      });




      } else if (casilla.contador > 0) {
        casilla.bloquear = true;
        celdasRestantes--;
        ponerNumero(casilla, casilla.contador);
        ponerClase(casilla, "numero");

      } else {
        buscarMinas(casilla);
      }
    }


  } else if (evento.type == "contextmenu") {

    evento.preventDefault();

    if (casilla.bloquear == false) {

      if (casilla.banderilla == false) {
        casilla.banderilla = true;
        evento.target.classList.toggle("bandera");
        numeroBanderas--;

      } else {
        casilla.banderilla = false;
        evento.target.classList.toggle("bandera");
        numeroBanderas++;
      }
    }

    document.getElementById("flag").innerHTML = numeroBanderas;
  }
}//pulsarBoton(evento)



function buscarMinas(casilla) {
 
  for (let i = 0; i < 3; i++) {

   
    for (let j = 0; j < 3; j++) {
      let x = casilla.posicionX - 1 + i;
      let y = casilla.posicionY - 1 + j;
      let casillaAdyacente = encontrarCasilla(x, y);

     
      if ((x >= 0 && x < lado) && (y >= 0 && y < lado)) {

       
        if (
          casillaAdyacente.contador < 0 ||
          casillaAdyacente.banderilla == true ||
          document.getElementById(casillaAdyacente.posicionX + " " + casillaAdyacente.posicionY).classList.contains("descubierto") ||
          document.getElementById(casillaAdyacente.posicionX + " " + casillaAdyacente.posicionY).classList.contains("numero")) {
          continue;

        } else if (casillaAdyacente.contador > 0) {
          celdasRestantes--;
          casillaAdyacente.bloquear = true;
          ponerNumero(casillaAdyacente, casillaAdyacente.contador);
          ponerClase(casillaAdyacente, "numero");

        }

        else if (casillaAdyacente.contador == 0) {
          celdasRestantes--;
          casillaAdyacente.bloquear = true;
          ponerClase(casillaAdyacente, "descubierto");
          buscarMinas(casillaAdyacente);
        }
      }
    }
  }
}//buscarMinas(casilla)