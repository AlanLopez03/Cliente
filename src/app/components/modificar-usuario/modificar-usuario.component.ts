import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Router } from '@angular/router';
import { getUsuario } from '../../models/getUsuario';
import { Rol } from '../../models/rolModel';
import Swal from 'sweetalert2'
import { environment } from '../../environments/environment';
import { ImagenesService } from '../../services/imagenes/imagenes.service';
declare var $: any;

@Component({
  selector: 'app-modificar-usuario',
  templateUrl: './modificar-usuario.component.html',
  styleUrls: ['./modificar-usuario.component.css']
})
export class ModificarUsuarioComponent implements OnInit {
  constructor(private usuarioService: UsuarioService, private router: Router, private imagenesService: ImagenesService) {
    this.imgPrincipal = null;
    this.fileToUpload = null;
  }
  usuarios: getUsuario[] = [];
  usuario: getUsuario = new getUsuario();
  rol: Rol = new Rol();
  roles: Rol[] = [];
  pageSize = 5;
  p = 1;
  imgPrincipal: any;
  fileToUpload: any;
  liga: string = environment.API_URL_IMAGENES + '/usuarios';

  ngOnInit(): void {
    // Inicializa los modales en ngOnInit
    $(document).ready(function(){
      $('.dropdown-trigger').dropdown();
      $('.modal').modal();  
    });

    this.imgPrincipal = null;
    this.usuarioService.list().subscribe((resUsuarios: any) =>
     {
      this.usuarios = resUsuarios;
      console.log(this.usuarios);
      if (resUsuarios == false){
        Swal.fire({
          title: 'Sin usuarios',
          text: 'No hay usuarios disponibles',
          icon: 'warning',
          confirmButtonText: 'Aceptar'
        })
      }
    }, err => console.log(err));
    this.usuarioService.getRoles().subscribe((resRoles: any) => {
      this.roles = resRoles;
      console.log(this.roles);
    }, err => console.log(err));
    
  }
  modificarUsuario(idUsuario: any) {
    this.usuarioService.listone(idUsuario).subscribe((resUsuario: any) => {
      this.usuario = resUsuario;
      $('#modalModificarusuario').modal('open');
      this.usuarioService.getRol(this.usuario.idRol).subscribe((resRol: any) => {
        this.rol = resRol;
      }, err => console.log(err));

    }, err => console.log(err));
  }
  guardar() {
    this.usuarioService.update(this.usuario).subscribe((resUsuario: any) => 
    {
      $('#modalModificarusuario').modal('close');
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Usuario modificado correctamente',
        showConfirmButton: false,
        timer: 1500
      })
    }, err => console.log(err));
  }

  cancelar() {
    $('#modalModificarusuario').modal('close');
  }
  modificarRol(rol: any,usuario: any){
    usuario.idRol = rol.idRol;
    for (const rol1 of this.roles) {
      if(rol1.idRol == rol.idRol){
        this.rol = rol1;
      }
    }
  }
  eliminarUsuario(idUsuario: any){

    Swal.fire({
      title: '¿Está seguro?',
      text: "No podrá revertir esta acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4caf50',
      cancelButtonColor: '#f44336',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.delete(idUsuario).subscribe((resUsuario: any) => 
        {
          console.log("Usuario eliminado correctamente")
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Usuario eliminado correctamente',
            showConfirmButton: false,
            timer: 1500
          })
          this.usuarioService.list().subscribe((resUsuarios: any) =>
          {
            this.usuarios = resUsuarios;
            console.log(this.usuarios);
          }, err => console.log(err));
          
        }, err => console.log(err));
      }
    });
  }
  
  cargandoImagen(event: any, id : any) {
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
          console.log(id);
          const files: FileList = event.target.files;
          this.fileToUpload = files.item(0);
          let imgPromise = this.getFileBlob(this.fileToUpload);
          imgPromise.then(blob => {
            this.imagenesService.guardarImagen(id, "usuarios", blob).subscribe(
              (res: any) => {
                this.imgPrincipal = blob;
                this.usuarioService.updateFoto(id, this.usuario).subscribe((resUsuario: any) => 
                  {
                    Swal.fire({
                      position: 'center',
                      icon: 'success',
                      title: 'Imagen actualizada correctamente',
                      showConfirmButton: false,
                      timer: 1500
                    })
                  }, err => console.log(err));
                window.location.reload();
              },
              err => console.error(err));
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

  return(){
    $('modal2').modal('close');
  }
  getRol(idRol: any){
    this.usuarioService.getRol(idRol).subscribe((resRol: any) => {
      this.return();
    }, err => console.log(err));
  }
  
}

