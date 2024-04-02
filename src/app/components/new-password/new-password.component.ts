import { Component,OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Router } from '@angular/router';
import { UsuarioPassword } from '../../models/Usuario';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.component.html',
  styleUrl: './new-password.component.css'
})
export class NewPasswordComponent implements OnInit{
  token : string = "";

  usuario: UsuarioPassword = new UsuarioPassword();
  constructor(private usuarioService: UsuarioService, private router: Router, private route: ActivatedRoute,) { }

  enviarPassword() {
    if(this.usuario.password == "" || this.usuario.password1 ==""){
      Swal.fire({
        title: 'Error',
        text: 'Por favor, asegurese de haber llenado todos los campos',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      })
      return;
    }
    else{
      if (this.usuario.password != this.usuario.password1){
        Swal.fire({
          title: 'Error',
          text: 'Las contraseñas no coinciden',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        })
        return;
      }
      else{
        this.usuarioService.actualizarPassword(this.token, this.usuario.password).subscribe((res : any) => {
          console.log(res);
          Swal.fire({
            title: 'Actualización exitosa',
            text: 'Se ha actualizado su contraseña',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          })
          this.router.navigateByUrl("")
        }, err => console.error(err));
      }
    }
  }
  ngOnInit():void{
    this.route.params.subscribe(params => {
      this.token = params['token'];
      console.log(this.token);
    });
  }
}
