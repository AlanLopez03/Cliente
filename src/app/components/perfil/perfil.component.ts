import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Rol } from '../../models/rolModel';
import { Domicilio } from '../../models/domicilio';
import { getUsuario } from '../../models/getUsuario';
import Swal from 'sweetalert2';
import { Usuario } from '../../models/Usuario';
import { Route, Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ImagenesService } from '../../services/imagenes/imagenes.service';

declare var $: any;

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit {
  constructor(private usuarioService: UsuarioService, private router: Router, private imagenesService: ImagenesService) {
    this.imgPrincipal = null;
    this.fileToUpload = null;
  }
  usuario: getUsuario = new getUsuario();
  rol: Rol = new Rol();
  direcciones: Domicilio[] = [];
  direccion: Domicilio = new Domicilio();
  idUsuario = 0;
  flagD = 0;
  idioma = localStorage.getItem('idioma') ?? 2;
  imgPrincipal: any;
  fileToUpload: any;

  liga: string = environment.API_URL_IMAGENES + '/usuarios/' + localStorage.getItem('idUsuario') + '.jpg';
  ngOnInit(): void {
    $(document).ready(function () {
      $('.modal').modal();
      $('.collapsible').collapsible();
    }
    );
    this.imgPrincipal = null;


    this.usuarioService.listone(localStorage.getItem('idUsuario')).subscribe((resusuario: any) => {
      this.usuario = resusuario;
      this.idUsuario = resusuario.idUsuario;
      this.usuarioService.getRol(this.usuario.idRol).subscribe((resRol: any) => {
        this.rol = resRol;
        this.usuarioService.getDomicilio(localStorage.getItem('idUsuario')).subscribe((resDir: any) => {
          this.direcciones = resDir;
          this.flagD = 0;
        }, err => this.flagD = 1)
      }, err => console.log(err))
    }, err => console.log(err));
  }

  abrirND() {
    this.direccion = new Domicilio();//limpia el objeto
    $('#modalN').modal('open');
  }

  abrirActP() {
    this.usuarioService.listone(this.idUsuario).subscribe((resusuario: any) => {
      this.usuario = resusuario;

      $('#modalActP').modal('open');
    },
      err => console.error(err)
    );
  }

  cerrarND() {
    $('#modalN').modal('close');
  }
  cerrarActP() {
    $('#modalActP').modal('close');
  }

  abrirActD(id: any) {
    this.usuarioService.getDireccion(id).subscribe((resdir: any) => {

      this.direccion = resdir;
      $('#modalAct').modal('open');

    },
      err => console.error(err)
    );
  }

  cerrarActD() {
    $('#modalAct').modal('close')
  }

  cargandoImagen(event: any) {
    if (event.target.files && event.target.files[0])
      Swal.fire({
        title: "¿Estas seguro de agregar la imagen?",

        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Guardar imagen"
      }).then((result) => {
        if (result.isConfirmed) {
          this.imgPrincipal = null;
          const files: FileList = event.target.files;
          this.fileToUpload = files.item(0);
          let imgPromise = this.getFileBlob(this.fileToUpload);
          imgPromise.then(blob => {
            this.imagenesService.guardarImagen(this.usuario.idUsuario, "usuarios", blob).subscribe(
              (res: any) => {
                this.imgPrincipal = blob;
                window.location.reload();
              },
              err => console.error(err));
          });
        }
      });
  }

  agregarDireccion() {
    this.direccion.idCliente = this.idUsuario;
    this.usuarioService.crearDomicilio(this.direccion).subscribe((resD: any) => {
      this.cerrarND();
      this.usuarioService.getDomicilio(localStorage.getItem('idUsuario')).subscribe((resDir: any) => {
        this.direcciones = resDir
        Swal.fire({
          title: "Exito!",
          text: "Direccion agregada!.",
          icon: "success"
        });
      })
    })
  }

  actualizarDireccion() {
    this.direccion.idCliente = this.idUsuario;
    this.usuarioService.actualizarDomicilio(this.direccion).subscribe((resD: any) => {
      this.cerrarActD();
      this.usuarioService.getDomicilio(localStorage.getItem('idUsuario')).subscribe((resDir: any) => {
        this.direcciones = resDir
        Swal.fire({
          title: "Exito!",
          text: "Direccion actualizada!.",
          icon: "success"
        });
      })
    })
  }

  eliminarDir(id: any) {
    Swal.fire({
      title: "¿Estas seguro de eliminar esta direccion?",
      text: "No será posible revertir este cambio!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar direccion!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.eliminaDireccion(id).subscribe((resproducto: any) => {
          //console.log("resproducto: ", resproducto);
          this.usuarioService.getDomicilio(localStorage.getItem('idUsuario')).subscribe((resdir: any) => {
            this.direcciones = resdir;
            //console.log(resproducto);
          },
            err => console.error(err)
          );
        },
          err => console.error(err)
        );
        Swal.fire({
          title: "Eliminado!",
          text: "Direccion eliminada!.",
          icon: "success"
        });
      }
    });
  }

  actualizar() {
    Swal.fire({
      title: "¿Estas seguro de editar el perfil?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Actualizar!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.cerrarActP()
        this.usuarioService.update(this.usuario).subscribe((resproducto: any) => {
          this.usuarioService.listone(localStorage.getItem('idUsuario')).subscribe((resdir: any) => {
            this.usuario = resdir
            //console.log(resproducto);
          },
            err => console.error(err)
          );
        },
          err => console.error(err)
        );
        Swal.fire({
          title: "Actualizado!",
          text: "Usuario actualizado!.",
          icon: "success"
        });
      }
    });
  }

  getFileBlob(file: File): Promise<string | ArrayBuffer | null> {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = () => {
        // Aseguramos que reader.result sea manejado adecuadamente
        resolve(reader.result);
      };
      reader.onerror = error => {
        // Manejo del error
        reject(error);
      };
      // Inicia la lectura del contenido del Blob, que será completada con el evento load.
      reader.readAsDataURL(file);
    });
  }

}
