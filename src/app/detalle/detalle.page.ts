import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../firestore.service';
import { ActivatedRoute } from '@angular/router';
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

  constructor(private activateRoute: ActivatedRoute, private firestoreService: FirestoreService) { }

  ngOnInit() {
    // Se almacena en una variable el id que se recibe por la url
    let idRecibido = this.activateRoute.snapshot.paramMap.get('id');
    if (idRecibido != null) {
      this.id = idRecibido;
      this.consultarPorId(this.id); // Llama a la función para consultar el documento
    } else {
      this.id = "";
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
}