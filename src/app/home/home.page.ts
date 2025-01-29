import { Component } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { Juegos } from '../juegos';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone:false,
})
export class HomePage {

  juegosEditando: Juegos;  
  idjuegoSelec: string = '';
  arrayColeccionJuegos: any = [{
    id: "",
    data: {} as Juegos
   }];

  constructor(private firestoreService: FirestoreService, private router: Router) {
    // Crear una juegos vacía
    this.juegosEditando = {} as Juegos;
    this.obtenerListaJuegos();
  } 
  obtenerListaJuegos(){
    this.firestoreService.consultar("juegoss").subscribe((resultadoConsultaJuegos) => {
      this.arrayColeccionJuegos = [];
      resultadoConsultaJuegos.forEach((datosJuegos: any) => {
        this.arrayColeccionJuegos.push({
          id: datosJuegos.payload.doc.id,
          data: datosJuegos.payload.doc.data()
        });
      })
    });
  }
  
  clicBotonInsertar() {
    this.firestoreService.insertar("juegoss", this.juegosEditando).then(() => {
      console.log('juegos creada correctamente!');
      this.juegosEditando= {} as Juegos;
    }, (error) => {
      console.error(error);
    });
  }

  selecJuego(juegoSelec: any) {
    console.log("Juego seleccionada: ");
    console.log(juegoSelec);
    this.idjuegoSelec = juegoSelec.id;
    this.juegosEditando.nombre = juegoSelec.data.titulo;
    this.juegosEditando.descripcion = juegoSelec.data.descripcion;
    this.juegosEditando.jugadores_min = juegoSelec.data.jugadores_min;
    this.juegosEditando.precio = juegoSelec.data.precio; 
    this.router.navigate(["/detalle",this.idjuegoSelec]);  
  }

  clicBotonBorrar() {
    this.firestoreService.borrar("juegoss", this.idjuegoSelec).then(() => {
      // Actualizar la lista completa
      this.obtenerListaJuegos();
      // Limpiar datos de pantalla
      this.juegosEditando = {} as Juegos;
    })
  }
  clicBotonModificar() {
    this.firestoreService.actualizar("juegoss", this.idjuegoSelec, this.juegosEditando).then(() => {
      // Actualizar la lista completa
      this.obtenerListaJuegos();
      // Limpiar datos de pantalla
      this.juegosEditando = {} as Juegos;
    })
  }
  document: any = {
    id: "",
    data: {} as Juegos
  };
  consultarPorId(idConsultar: string) {
    this.firestoreService.consultarPorId("juegoss", idConsultar).subscribe((resultado) => {
      if(resultado.payload.data() != null) {
        this.document.id = resultado.payload.id;
        this.document.data = resultado.payload.data();
        console.log(this.document.data.nombre);
      } else {
        this.document.data = {} as Juegos;
      }
    });
  }
  navigateToNew() {
    this.router.navigate(['/detalle', 'nuevo']); // 'nuevo' es el identificador para crear un nuevo juego
  }

}