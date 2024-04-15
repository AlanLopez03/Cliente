import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Router } from '@angular/router';
import { getUsuario } from '../../models/getUsuario';
import { IdiomaService } from '../../services/idioma/idioma.service';
import { Rol } from '../../models/rolModel';
import { Location } from '@angular/common';
import { TranslateService } from "@ngx-translate/core";
import Swal from 'sweetalert2'
declare var $: any;

@Component({
  selector: 'app-modificar-usuario',
  templateUrl: './modificar-usuario.component.html',
  styleUrls: ['./modificar-usuario.component.css']
})
export class ModificarUsuarioComponent implements OnInit {
  constructor(private usuarioService: UsuarioService, private router: Router,private idiomaService:IdiomaService,
    private translate:TranslateService) { }
  usuarios: getUsuario[] = [];
  usuario: getUsuario = new getUsuario();
  rol: Rol = new Rol();
  roles: Rol[] = [];
  pageSize = 5;
  lenguaje: string = 'es';
  p = 1;
  idioma = localStorage.getItem('idioma') ?? "es";
  ngOnInit(): void {
    // Inicializa los modales en ngOnInit
    $(document).ready(function(){
      $('.dropdown-trigger').dropdown();
      $('.modal').modal();  
    });
    this.idiomaService.currentLanguage.subscribe(lang => {
      this.lenguaje= lang;
      this.translate.use(lang);
    });
    this.usuarioService.list().subscribe((resUsuarios: any) =>
     {
      this.usuarios = resUsuarios;
      //console.log(this.usuarios);
      if (resUsuarios == false){
        this.translate.get('sinUsuarios').subscribe((translations) => 
       { Swal.fire({
          title: translations['sinUsuarios.title'],
          icon: 'warning',
          confirmButtonText: translations['sinUsuarios.confirm']
        })})
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
      this.translate.get('modificarUsuario').subscribe((translations) =>
      {
        Swal.fire({
        position: 'center',
        icon: 'success',
        title: translations.title,
        confirmButtonText: translations.confirm,
        showConfirmButton: false,
        timer: 1500
      })})
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

    this.translate.get('eliminarUsuario').subscribe((translations) =>
   { Swal.fire({
      title: translations.title,
      text: translations.text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4caf50',
      cancelButtonColor: '#f44336',
      confirmButtonText: translations.confirm,
      cancelButtonText: translations.cancel
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.delete(idUsuario).subscribe((resUsuario: any) => 
        {
          console.log("Usuario eliminado correctamente")
          this.translate.get('usuarioEliminado').subscribe((translations) =>
{          Swal.fire({
            position: 'center',
            icon: 'success',
            title: translations.title,
            confirmButtonText: translations.confirm,
            showConfirmButton: false,
            timer: 1500
          })})
          this.usuarioService.list().subscribe((resUsuarios: any) =>
          {
            this.usuarios = resUsuarios;
            //console.log(this.usuarios);
          }, err => console.log(err));
          
        }, err => console.log(err));
      }
    }
  );
})
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

