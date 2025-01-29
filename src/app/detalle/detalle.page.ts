import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Juegos } from '../juegos';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
  standalone: false
})
export class DetallePage implements OnInit {
  id: string = "";
  document: any = {
    id: "",
    data: {} as Juegos
  };

  constructor(
    private activateRoute: ActivatedRoute, 
    private firestoreService: FirestoreService,
    private router: Router
  ) { }

  ngOnInit() {
    let idRecibido = this.activateRoute.snapshot.paramMap.get('id');
    if (idRecibido != null) {
      this.id = idRecibido;
      if (this.id === 'nuevo') {
        // Preparar para la inserción de un nuevo juego
        this.document.data = {} as Juegos; // Inicializar un nuevo juego
        this.document.id = ''; // No hay ID para un nuevo juego
      } else {
        this.consultarPorId(this.id);
      }
    }
  }

  consultarPorId(idConsultar: string) {
    this.firestoreService.consultarPorId("juegoss", idConsultar).subscribe((resultado) => {
      if (resultado.payload.data() != null) {
        this.document.id = resultado.payload.id;
        this.document.data = resultado.payload.data();
        console.log(this.document.data.nombre);
      } else {
        this.document.data = {} as Juegos;
      }
    });
  }

  clicBotonBorrar() {
    this.firestoreService.borrar("juegoss", this.id).then(() => {
      this.router.navigate(['/home']);
    });
  }

  clicBotonModificar() {
    if (this.id === 'nuevo') {
      this.firestoreService.insertar("juegoss", this.document.data).then(() => {
        this.router.navigate(['/home']);
      }).catch(error => {
        console.error('Error al guardar el juego:', error);
      });
    } else {
      this.firestoreService.actualizar("juegoss", this.id, this.document.data).then(() => {
        this.router.navigate(['/home']);
      }).catch(error => {
        console.error('Error al modificar el juego:', error);
      });
    }
  }
}