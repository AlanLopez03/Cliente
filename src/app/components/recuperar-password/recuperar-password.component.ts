
import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Router } from '@angular/router';
import { Usuario } from '../../models/Usuario';
import Swal from 'sweetalert2'
import { CorreoService } from '../../services/correo/correo.service';

@Component({
  selector: 'app-recuperar-password',
  templateUrl: './recuperar-password.component.html',
  styleUrl: './recuperar-password.component.css'
})
export class RecuperarPasswordComponent {

  usuario: Usuario = new Usuario();
  constructor(private usuarioService: UsuarioService, private router: Router,private correoService:CorreoService) { }

  enviarCorreo() {
    this.correoService.enviarCorreoRecuperarContrasenya(this.usuario).subscribe((resUsuario: any) =>
      {
        console.log(resUsuario) ;
      },err => console.error(err));
  }

}