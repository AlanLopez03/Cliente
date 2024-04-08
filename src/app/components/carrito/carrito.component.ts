import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../services/carrito/carrito.service';
import { InventarioService } from '../../services/inventario/inventario.service';
import { Router } from '@angular/router';
import { Carrito, addProducto } from '../../models/carrito';
import { Producto } from '../../models/producto';
import { Compra } from '../../models/compra';
import Swal from 'sweetalert2';
import { Pedidos, nuevoPedido } from '../../models/pedidos';
import { error } from 'jquery';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Domicilio } from '../../models/domicilio';
@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit {
  domicilios: Domicilio[] = [];
  domicilio = new Domicilio();
  pedidos: Pedidos[] = [];
  pedido = new Pedidos();
  producto = new Producto();
  carrito1: Carrito = new Carrito();
  carrito: Carrito[] = [];
  pageSize = 5;
  idDomicilio: number = 0;
  p = 1;
  constructor(private carritoService: CarritoService, private inventarioService: InventarioService, private router: Router,private usuarioService:UsuarioService) { }
  inserta = new addProducto();
  ngOnInit(): void {
    $(document).ready(function () {
      $('#direccion').click(function() {
        $(this).css('background-color', '#ff0000'); // Cambiar a rojo
    });
    })
    this.idDomicilio = 0;
    this.carritoService.listone(localStorage.getItem('idUsuario')).subscribe(
      (res: any) => {
        this.carrito = res;

        console.log("hola");
        console.log(this.carrito);
        if (res == false){
          Swal.fire({
            title: 'Sin productos',
            text: 'No hay productos que ver',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
          })
        }

      },
      err => console.log(err)

    );
    this.usuarioService.verDomicilios(localStorage.getItem('idUsuario')).subscribe(
      (res: any) => {
        if (res!=false) {
        this.domicilios = res;
        console.log(this.domicilios);
      }
      },
      
      err => console.log(err)
    );
    
  }
  setDomicilio(id: any) {
    this.idDomicilio = id;
  }
  eliminarProducto(id: any) {
    // console.log(id);
    Swal.fire({
      title: '¿Está seguro que desea eliminar el producto del carrito?',
      text: "Esta acción no se puede revertir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar'
    }).then((result) => {

      if (result.isConfirmed) {
        this.carritoService.eliminarProducto(id).subscribe(
          (res: any) => {
            Swal.fire(
              'Producto eliminado',
              'El producto se ha eliminado con éxito',
              'success'
            ).then((result) => {
              this.ngOnInit();
            })
          }, err => console.log(err));
      }
    })


  }
  insertarProducto(id: any, decremento?: any) {//Se debe mandar un objeto de tipo addProducto
    var a = localStorage.getItem('idUsuario') ?? '1';
    var stock = 0;
    if (decremento)
      this.inserta.setAtributos(id, parseInt(a), -1);
    else
      this.inserta.setAtributos(id, parseInt(a), 1);
    this.inventarioService.listone(id).subscribe(
      (res: any) => {
        stock = res.stock;//Obtiene el stock del producto
        if (stock > 0) {
          this.carritoService.insertar(this.inserta).subscribe((res: any) => {
            this.ngOnInit();
          },
            err => console.log(err));
        }
        else {
          Swal.fire(
            'Error',
            'No hay stock suficiente',
            'error')
        }
      },
      err => console.log(err)

    );

  }
  limpiarCarrito() {
    var idUsuario = localStorage.getItem('idUsuario');
    Swal.fire({
      title: '¿Está seguro que desea limpiar el carrito?',
      text: "Esta acción no se puede revertir",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Limpiar'
    }).then((result) => {
      if (result.isConfirmed) {
        //Debe agregar al stock si se limpia el carrito
        this.carritoService.listarCompras(idUsuario).subscribe((res: any) => {
          console.log(res);
          //Obtenemos el arreglo con el carrito de productos
          var productos = res;//Obtener la cantidad de productos en el carrito
          for (let producto of productos) {
            var datos = {
              idProducto: producto.idProducto,
              stock: producto.cantidad
            }
            this.inventarioService.agregarStock(datos).subscribe(
              (res: any) => {
                console.log(res);
              },
              err => console.log(err)
            );

          }

          this.carritoService.limpiarCarrito(idUsuario).subscribe(
            (res: any) => {

              this.ngOnInit();
              Swal.fire(
                'Carrito limpiado',
                'El carrito se ha limpiado con éxito',
                'success'
              )
            }, err => console.log(err));
        }, err => console.log(err)
        );




      }
    })
  }
  pagar() {
    this.router.navigate(['/pagar']);
  }

  comprarCarrito() {
    if(this.idDomicilio<=0 || this.idDomicilio==null)
    {
      Swal.fire(
        'Error',
        'Debe seleccionar un domicilio',
        'error'
      )
    }
    
    else
    {
      var objeto = new Compra();
      var fecha = new Date();//Se debe formatear la fecha a yyyy-mm-dd
      let fechaActual = new Date();
      // Obtener el año, mes y día
      let año = fechaActual.getFullYear();
      let mes = ("0" + (fechaActual.getMonth() + 1)).slice(-2); // Agregar un cero delante si es necesario
      let dia = ("0" + fechaActual.getDate()).slice(-2); // Agregar un cero delante si es necesario
      // Formatear la fecha actual en el formato "yyyy-mm-dd"
      let fechaActualFormateada = `${año}-${mes}-${dia}`;
      //console.log(fechaActualFormateada); // Salida: "2022-02-06" (por ejemplo)
      objeto.set(fechaActualFormateada, 1,this.idDomicilio);//Cambiar fecha
      console.log("Domicilio",this.idDomicilio);

      this.carritoService.comprar(localStorage.getItem('idUsuario'), objeto).subscribe(
        (res: any) => {
          if (res == false) {
            Swal.fire(
              'Error',
              'No hay suficiente stock',
              'error'
            )
          }
          else {
            Swal.fire(
              'Compra realizada',
              'La compra se ha realizado con éxito',
              'success'
            )
            this.router.navigateByUrl('/home');
            //this.ngOnInit();
          }

        },
        err => console.log(err)
      );
    }
  }
}
