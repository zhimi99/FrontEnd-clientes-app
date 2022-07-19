import { Component, OnInit, Input } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ModalService } from './modal.service';
import swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { AuthService } from '../../usuarios/auth.service';

@Component({
  selector: 'app-detalle-foto',
  templateUrl: './detalle-foto.component.html',
  styleUrls: ['./detalle-foto.component.css']
})

export class DetalleFotoComponent implements OnInit {

  @Input() cliente: Cliente;
  titulo: String = "detalle del cliente";
  public fotoSeleccionada: File;
  public progreso: number = 0;

  constructor(public clienteService: ClienteService,
      private authService: AuthService,
      public modalService: ModalService) { }


  ngOnInit(): void {


  }


  seleccionarFotos(event) {
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    console.log(this.fotoSeleccionada);
    if (this.fotoSeleccionada.type.indexOf('image') < 0) {
      swal.fire('Error al seleccionar foto', 'Error debe ser tipo foto', 'error');
      this.fotoSeleccionada = null;
    }

  }


  subirFoto() {

    if (!this.fotoSeleccionada) {
      swal.fire('Error upload', 'Error al  cargar la foto', 'error');
    } else {

      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id)
        .subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {

            this.progreso = Math.round((event.loaded / event.total) * 100);

          } else if (event.type === HttpEventType.Response) {
            let response: any = event.body;
            this.cliente = response.cliente as Cliente;

            this.modalService.notificarUpload.emit(this.cliente);

            swal.fire('Foto  subida corectamente', response.mensaje, 'success')

          }

        });
    }
  }

  cerrarModal(){
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }


}
