import { Component,OnInit } from '@angular/core';
import { ReportesService } from '../../services/reportes/reportes.service';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Domicilio } from '../../models/domicilio';
import { Router } from '@angular/router';
import { ventas } from '../../models/ventas';
import { Estados } from '../../models/estados';
import Swal from 'sweetalert2';

declare var $: any;

@Component({
  selector: 'app-usuario-compras',
  templateUrl: './usuario-compras.component.html',
  styleUrl: './usuario-compras.component.css'
})
export class UsuarioComprasComponent implements OnInit{
  compras:ventas[] = [];
  datos = new Domicilio();
  compraUsuario = new ventas();
  estado = new Estados();
  constructor(private router: Router, private reportesService: ReportesService,private usuarioService: UsuarioService) { 
    var id = localStorage.getItem('idUsuario');
    console.log(id);
    this.reportesService.verComprasUsuario(id).subscribe((res:any) => 
    {
      if (res.length > 0) 
      {
        this.compras = res;//Ya tenemos todas las compras realizadas por el usuario
        
      }
      else
      Swal.fire({
        icon: 'error',
        title: '?...',
        text: 'No se han encontrado compras',
      });
    });
  }

  abrirAct(id:any){
    this.datos = new Domicilio();
    this.reportesService.listOne(id).subscribe((res:any) => {
      this.compraUsuario = res;
      var idDom=this.compraUsuario.idDomicilio;
      this.reportesService.getEstado(res.idEdo).subscribe((resE :any) =>{
        this.estado = resE;
      });
      this.usuarioService.verDatosDomicilio(idDom).subscribe((resD:any) =>{
        if(resD!=false)
          this.datos = resD;
        $('#modalAct').modal('open');
      });
      
    })
  }

  cerrarAct() {
    $('#modalAct').modal('close');
  }

  ngOnInit(): void {
    $(document).ready(function(){
      $('.modal').modal();
    });
  }
}
