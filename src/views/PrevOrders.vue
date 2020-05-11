<template>
  <div class="content-wrapper">
    <div id="order" class="col-xs-12 col-md-6 col-lg-8">
      <p class="intro">
        A continuación puedes ver un listado con todos los pedidos realizados hasta la fecha. Seleccione un pedido para consultar sus detalles, o para descargar en formato PDF.      
      </p>
      <div class="products-tab">
        <v-tabs
        v-model="tab"
        >
        <v-tab
            v-for="order in orders"
            :key="order.tab"
        >
            {{ order.tab }} 
        </v-tab>
        </v-tabs>

        <v-tabs-items v-model="tab">
            <v-tab-item
                v-for="order in orders"
                :key="order.tab"
            >
              <v-card flat>
                <v-card-text class="d-flex flex-wrap ">
                  <ul id="order-list" v-if="order.fechas">
                    <li v-for="pedido in visiblePages" :key="pedido.fecha">
                      <div class="order-selector" @click="/*currentOrder = order.fecha;*/ prevOrder(pedido.fecha); calcHeightOrders();" v-bind:class="{ active: isOrderListItemActive(pedido.fecha) }">{{ pedido.fecha }}</div>
                    </li>
                  </ul>
                  <v-pagination
                    v-model="page"
                    :length="Math.ceil(order.fechas.length/perPage)"
                    v-if="order.fechas && order.fechas.length > perPage"
                  ></v-pagination>
                </v-card-text>
              </v-card>
            </v-tab-item>
        </v-tabs-items>
      </div>
    </div>
    <div id="order-details" class="col-xs-12 col-md-6 col-lg-4">
      <div class="order-details-container container" >
        <v-icon v-on:click="toggleOrderDetails()" id="close-orders" class="hidden-md-and-up">mdi-close</v-icon>
        <h2>Resumen del pedido</h2>
        <p class="order-info">
            Los datos aquí reflejados son solamente de consulta.
        </p>
        <div id="client-details">
            <h3></h3>
            <h3></h3>
            <h3><strong>Fecha del pedido: {{ currentOrder.fecha }}</strong></h3>
        </div>
        <div id="order-details-table"  >
            <table>
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Uds</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="product in currentOrder.order.products" :key="product.idProducto">
                      <template v-if="product.idProducto">
                        <td class="col-name">{{ product.nombreProducto }}</td> 
                        <td>{{ product.precio }}€</td>
                        <td>{{ product.cantidad }}</td>
                        <td>{{ rowTotal(product.precio, product.cantidad) }}€</td> 
                      </template>
                    </tr> 
                </tbody>
            </table>
        </div>
        <div id="order-summary" >
            <div class="fila">
                <span class="order-summary-concept">Suma pedido</span>
                <span class="order-summary-price">{{ orderSum }}€</span>
            </div>
            <div class="fila" id="order-summary-impPagoReparto" v-if="currentOrder.order.impPagoReparto != '0,00' ">
                <span class="order-summary-concept">Punto de reparto</span>
                <span class="order-summary-price">{{ currentOrder.order.impPagoReparto }}€</span>
            </div>
            <div class="fila" id="order-summary-impPreparacion" v-if="currentOrder.order.impPreparacion != '0,00' ">
                <span class="order-summary-concept">Importe preparación</span>
                <span class="order-summary-price">{{ currentOrder.order.impPreparacion }}€</span>
            </div>
            <div class="fila" id="order-summary-impRepartoDomi" v-if="currentOrder.order.impRepartoDomi != '0,00' ">
                <span class="order-summary-concept">Coste Reparto</span>
                <span class="order-summary-price">{{ currentOrder.order.impRepartoDomi }}€</span>
            </div>
            <div class="fila" id="order-summary-suplemento" v-if="currentOrder.order.suplemento != '0,00' ">
                <span class="order-summary-concept">Suplemento</span>
                <span class="order-summary-price">{{ currentOrder.order.suplemento }}€</span>
            </div>
        </div>
        <div id="order-details-footer">
            <div id="order-total">
                <span v-if="currentOrder.order.products.length">Total: {{ total() }}€</span>
            </div>
            <div id="order-footer-buttons" v-bind:class="{ 'show-checkout': ordersOpened}">
                <!-- <v-btn text id="order-checkout" class="bg-primary hidden-sm" @click="download" v-if="currentOrder.order.total">Descargar PDF</v-btn> -->
                <v-btn text id="order-checkout" class="bg-primary hidden-sm" @click="download" v-if="currentOrder.order.total != 0">Descargar PDF</v-btn>
                <v-btn text id="order-show" class="bg-primary hidden-md-and-up" @click="toggleOrderDetails">Ver pedido</v-btn>
            </div>
        </div>
      </div>    
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import ProductsTab from '@/components/partials/ProductsTab.vue'
// import OrderDetails from '@/components/partials/OrderDetails.vue'
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import jwt_decode from 'jwt-decode';

export default {
  name: 'Home',
  components: {
    // ProductsTab,
    // OrderDetails
  },    
  data () {
    return{
      allData : null,
      page: 1,
      perPage: 20,
      tab: null,
      ordersOpened: false,
      activeOrderListItem: '1121',
      fechas: null,
      orders: [
        { 
          tab: 'Pedidos anteriores', 
          fechas: null,
          content: []
        },
      ],
      currOrder: null,
      currentOrder: {
        id: '',
        fecha: 'XX/XX/XXXX',
        order: {
          impPagoReparto: 0, 
          impPreparacion: 0, 
          impRepartoDomi: 0, 
          descuento: 0,
          envio: 0,
          total: 0,
          suplemento: 0,
          products: [
            {
              nombreProducto: '',
              precio: '',
              cantidad: '',
              idProducto: 0,
            },
          ],
        }
      },      
    }
  },
  // mounted: function(){
  //     this.currentOrder = this.orders[0].content[0];
  // },
  methods: {
    isOrderListItemActive: function(orderItem){
      return this.currentOrder.fecha === orderItem;
    },
    setOrderListItemActive: function(orderItem){
      return this.currentOrder.fecha = orderItem;
    },
    total: function(){
      if(this.currentOrder.order.total != 0){
        // console.log(this.currentOrder.order.total);
        return toSpanishNumber( toEnglishNumber(this.currentOrder.order.total).toFixed(2) );
      }else{
        let total = toEnglishNumber(this.orderSum) + toEnglishNumber(this.currentOrder.order.impPagoReparto) + toEnglishNumber(this.currentOrder.order.impPreparacion) + toEnglishNumber(this.currentOrder.order.impRepartoDomi) + toEnglishNumber(this.currentOrder.order.suplemento);
        return toSpanishNumber(total.toFixed(2));
      }
    },
    rowTotal(price, quantity){
        return toSpanishNumber((toEnglishNumber(price) * quantity).toFixed(2));
    },
    calcHeightOrders(){
        calcHeightOrders(300);
    },
    toggleOrderDetails(){
        this.ordersOpened = !this.ordersOpened;
        let myBody = document.getElementsByTagName('body')[0];
        myBody.classList.toggle('orders-opened');
        this.$emit('ordersOpened', this.ordersOpened);
    },
    setData ( data ){
      this.allData = data;
      this.orders[0].fechas = data.mdoFechasPedidosAnterior;
      if(this.orders[0].fechas[0].fecha){
        this.prevOrder(this.orders[0].fechas[0].fecha)
      }
    },
    setPrevOrder (data){
      // console.log(data);
      this.currentOrder.order.impPagoReparto = toSpanishNumber(data.impPagoReparto);
      this.currentOrder.order.impPreparacion = toSpanishNumber(data.impPreparacion);
      this.currentOrder.order.impRepartoDomi = toSpanishNumber(data.impRepartoDomi);
      this.currentOrder.order.suplemento = toSpanishNumber(data.suplemento);
      this.currentOrder.order.total = toSpanishNumber(data.totalOrden);
      this.currentOrder.order.products = data.articulos;
      this.currentOrder.fecha = data.fecha;
    },
    prevOrder (date){      
      let token = localStorage.token;
      let tokenDecoded = jwt_decode(token);
      let userId = tokenDecoded.jti;

      this.$http.post('/pedidoanterior', { 
        usuario: userId, 
        token: localStorage.token,
        fechaPedidoAnterior: date
      }).then( response => this.setPrevOrder(response.data) )
        .catch( error => console.log(error) );
    },
    download(){      
      let empresa = this.allData.mdoConfiguracion;

      let cliente = this.allData.mdoConsumidor;
      let logo = '';
      if(cliente.repartoDomicilio){
        logo = require('@/assets/guerta.png');
      }else{
        logo = require('@/assets/ecosecha.png');
      }
      // console.log(this.currentOrder);

      let htmlEmpresa = '<div id="company"> <h2 class="name">' + empresa.nombreEmpresa + '</h2> <div>' + empresa.telefonoEmpresa + '</div> <div>' + empresa.direccionEmpresa + '</div>  <div>' + empresa.cifEmpresa + '</div> <div><a href="mailto:' + empresa.cuentaCorreo + '">' + empresa.cuentaCorreo + '</a></div> </div>';


      let productos = this.currentOrder.order.products;
      let tablaProductos = '';
      let counter = 1;
      let orderSum = 0;
      productos.forEach(function( producto){
        if(producto.precio){
          tablaProductos += '<tr> <td class="no">' + counter + '</td> <td class="desc">' + producto.nombreProducto + '</td> <td class="unit">' + toSpanishNumber(producto.precio) + '€</td> <td class="qty">' + toSpanishNumber(producto.cantidad) + '</td> <td class="total">' + toSpanishNumber((toEnglishNumber(producto.precio) * producto.cantidad).toFixed(2))  + '€</td> </tr>';
          orderSum += (producto.cantidad * producto.precio);
          counter++;
        }
      });
      let totales = '<tr><td colspan="2"></td> <td colspan="2">Subtotal</td> <td>' + toSpanishNumber(orderSum) + '€</td> </tr>';
      if(this.currentOrder.order.impPagoReparto != '0,00' ){
        totales += '<tr> <td colspan="2"></td> <td colspan="2">Punto de reparto</td> <td>' + toSpanishNumber(this.currentOrder.order.impPagoReparto) + '€</td> </tr>';
      }
      if(this.currentOrder.order.impPreparacion != '0,00' ){
        totales += '<tr> <td colspan="2"></td> <td colspan="2">Importe preparación</td> <td>' + toSpanishNumber(this.currentOrder.order.impPreparacion) + '€</td> </tr>';
      }
      if(this.currentOrder.order.impRepartoDomi != '0,00' ){
        totales += '<tr> <td colspan="2"></td> <td colspan="2">Coste reparto</td> <td>' + toSpanishNumber(this.currentOrder.order.impRepartoDomi) + '€</td> </tr>';
      }
      if(this.currentOrder.order.suplemento != '0,00' ){
        totales += '<tr> <td colspan="2"></td> <td colspan="2">Suplemento</td> <td>' + toSpanishNumber(this.currentOrder.order.suplemento) + '€</td> </tr>';
      }
      totales += '<tr> <td colspan="2"></td> <td colspan="2">TOTAL</td> <td>' + this.total() + '€</td> </tr>';

      let html = '<!DOCTYPE html><html lang="en"> <head> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"> <title>Example 2</title> <style> .clearfix:after { content: ""; display: table; clear: both; } a { color: #0087C3; text-decoration: none; } body { position: relative; width: 21cm; height: 29.7cm; margin: 0 auto; color: #555555; background: #FFFFFF; font-family: Arial, sans-serif; font-size: 14px; font-family: Verdana; } header { padding: 10px 0; margin-bottom: 20px; border-bottom: 1px solid #AAAAAA; } #logo { float: left; margin-top: 8px; } #logo img { height: 70px; } #company { float: right; text-align: right; } #details { margin-bottom: 50px; } #client { padding-left: 6px; border-left: 6px solid #0087C3; float: left; } #client .to { color: #777777; } h2.name { font-size: 1.4em; font-weight: normal; margin: 0; } #invoice { float: right; text-align: right; } #invoice h1 { color: #0087C3; font-size: 2.4em; line-height: 1em; font-weight: normal; margin: 0 0 10px 0; } #invoice .date { font-size: 1.1em; color: #777777; } table { width: 100%; border-collapse: collapse; border-spacing: 0; margin-bottom: 20px; } table th, table td { padding: 5px 20px; background: #EEEEEE; text-align: center; border-bottom: 1px solid #FFFFFF; } table th { white-space: nowrap; font-weight: bold; } table td { text-align: right; } table td h3 { color: #57B223; font-size: 1.2em; font-weight: normal; margin: 0 0 0.2em 0; } table .no { color: #FFFFFF; background: #57B223; } table .desc { text-align: left; } table .unit { background: #DDDDDD; } table .qty {} table .total { background: #57B223; color: #FFFFFF; } table td.unit, table td.qty, table td.total { font-size: 1.2em; } table tbody tr:last-child td { border: none; } table tfoot td { padding: 10px 20px; background: #FFFFFF; border-bottom: none; font-size: 1.2em; white-space: nowrap; border-top: 1px solid #AAAAAA; } table tfoot tr:first-child td { border-top: none; } table tfoot tr:last-child td { color: #57B223; font-size: 1.4em; border-top: 1px solid #57B223; } table tfoot tr td:first-child { border: none; } #thanks { font-size: 2em; margin-bottom: 50px; } #notices { padding-left: 6px; border-left: 6px solid #0087C3; } #notices .notice { font-size: 1.2em; } footer { color: #777777; width: 100%; height: 30px; position: absolute; bottom: 0; border-top: 1px solid #AAAAAA; padding: 8px 0; text-align: center; } </style> </head> <body> <header class="clearfix"> <div id="logo"> <img src="' + logo + '"> </div> ' + htmlEmpresa + ' </header> <main> <div id="details" class="clearfix"> <div id="client"> <h2 class="name">' + cliente.nombre + '</h2> <div class="address">Zona de reparto: ' + cliente.nombreGrupo + '</div> </div> <div id="invoice"> <h1>' + this.currentOrder.fecha + '</h1> <div class="date">Fecha del pedido</div> </div> </div> <table border="0" cellspacing="0" cellpadding="0"> <thead> <tr> <th class="no">#</th> <th class="desc">Producto</th> <th class="unit">Precio</th> <th class="qty">Unidades</th> <th class="total">Total</th> </tr> </thead> <tbody> ' + tablaProductos + ' </tbody> <tfoot> ' + totales + ' </tfoot> </table> <div id="thanks">¡Gracias!</div> <div id="notices"> <div>AVISO:</div> <div class="notice">Para cualquier consulta sobre el contenido de este recibo, por favor contáctanos en <a href="' + empresa.cuentaCorreo + '">' + empresa.cuentaCorreo + '</a>.</div> </div> </main> <footer> Este recibo se ha generado automáticamente. Si detectas cualquier error en los datos, avísanos. </footer> </body> </html>';
      let iframe = document.createElement('iframe');
      document.body.appendChild(iframe);
      
      let iframedoc = iframe.contentDocument || iframe.contentWindow.document;
      iframedoc.body.innerHTML = html;


      html2canvas(iframedoc.body).then(function(canvas){
          let img = canvas.toDataURL("image/png");
          let doc = new jsPDF();
          let width = doc.internal.pageSize.getWidth() - 40;
          let height = doc.internal.pageSize.getHeight() - 40;
          doc.addImage(img,'JPEG', 20, 20, width, height);
          doc.save('test.pdf');
          document.body.removeChild(iframe);
        }
      );
    }
  },
  computed: {
    visiblePages () {
      return this.orders[0].fechas.slice((this.page - 1)* this.perPage, this.page * this.perPage)
    },
    orderSum: function(){          
        let total = 0;
        // if('order' in this.currentOrder){
          this.currentOrder.order.products.forEach( product => {
            if(product.precio){
              total += ( toEnglishNumber(product.precio) * product.cantidad ); 
            }
          });
          return toSpanishNumber(total.toFixed(2));
        // }
        // return 'error';
    },
    discountTotal: function(){
        let price = toEnglishNumber(this.orderSum) / 100 * toEnglishNumber(this.currentOrder.order.descuento);
        return toSpanishNumber(parseFloat(price).toFixed(2));
    },
  },
  mounted () {    
    let token = localStorage.token;
    let tokenDecoded = jwt_decode(token);
    let userId = tokenDecoded.jti;

    this.$http.post('/all', { 
      usuario: userId,
      password: '',
      token: localStorage.token
    }).then( response => this.setData(response.data) )
      .catch( error => console.log(error) );
  }
}

function toEnglishNumber($number){
    return parseFloat($number.toString().replace(',', '.'));
}
function toSpanishNumber($number){
  $number = parseFloat($number).toFixed(2);
    return $number.toString().replace('.', ',');
}
function calcHeightOrders(offset = 150){
    let elementHeight = document.querySelector('.order-details-container').offsetHeight;
    let orderDetails = document.getElementById('order-details');
    let orderDetailsHeight = orderDetails.offsetHeight;
    // console.log('elementHeight = ' + elementHeight + '  \n orderDetailsHeight = ' + orderDetailsHeight + ' \n window.innerHeight = ' + orderDetailsHeight);
    if( (elementHeight + offset > orderDetailsHeight) || (elementHeight + offset > window.innerHeight) ){
            orderDetails.classList.add('scrollbar');
    }else{
            orderDetails.classList.remove('scrollbar');
    }
}
</script>

<style lang="scss">
  @import '@/styles/_variables.scss';
  iframe{
    position: absolute;
    z-index: -9999;
    opacity: 0;
    width: 0;
    height: 0;
    /* margin: 0; */
    /* line-height: 0px; */
    top: 0;
  }
  #logout-wrapper{
    width: 100%;
    text-align: right;
  }
  .content-wrapper{
    display: flex;
    // margin: -12px;
    width: 100%;
  }
  #order-list{
    list-style: none;
    font-size: 18px;
    padding: 0px;
    li{
      margin-bottom: 10px;
      .order-selector{        
        cursor: pointer;
        &.active{
          font-weight: bold;
        }
        &:hover{
          opacity: 0.9;
        }
      }
    }
  }
  // #order{
  //   padding: 20px;
  //   padding-top: 100px;
  // }
  .order-details-container{
      padding: 10px 20px;
      h2{
          text-align: center;
          margin-bottom: 20px;
      }
      h3{
          font-weight: normal;
          text-align: center;
          font-size: 18px;
      }
  }
  #close-orders{
      position: absolute;
      top: 20px;
      right: 20px;
      color: $error-color;
      transition: all 0.5s ease-in-out;
      font-size: 40px;
      &:hover{
          transform: rotate(180deg);
      }
  }
  #client-details{
      margin-top: 20px;
      margin-bottom: 20px;
      h3{
          font-weight: normal;
          text-align: center;
      }
  }
  #order-details-table{
      margin: 30px auto;
    //   max-height: 300px;
    //   overflow: auto;
      width: 100%;
      table{
          width: 100%;
          text-align: left;
          th, td{
              border-bottom: 1px solid #FFF;
              padding: 7px 10px;
          }
          td{
              padding: 5px;
              text-align: center;
              &:first-child{
                  padding: 0px;
              }
              &.col-name{
                  text-align: left;
              }
          }
          th{
              text-transform: uppercase;
              font-size: 11px;
          }
          .v-icon{
              color: $error-color;
              font-size: 20px;
              cursor: pointer;
          }
      }
  }
  #order-summary{
      padding: 10px;
      .fila{
        text-align: right;
          .order-summary-concept{

          }
          .order-summary-price{
              display: inline-block;
              width: 80px;
          }
      }
  }
  #order-details-footer{
    position: fixed;
    bottom: 0px;
    /* width: 100%; */
    right: 0px;
    left: 0px;
    background-color: $dark-grey;
    display: flex;
    padding: 20px;
    > div{
        width: 100%;
    }
    #order-total{
        color: #FFF;
        font-size: 26px;
        font-weight: 100;
    }
    #order-footer-buttons{
        text-align: right;
        display: flex;
        justify-content: flex-end;
        padding: 0px 20px;
        &.show-checkout{
            #order-show{
                display: none !important;
            }
            // #order-checkout{
            //     display: block !important;
            // }
        }
    }
  }
  
  @media screen and (min-width: $tablet){
    #order-details-table{
        // max-height: 300px;
        overflow: auto;
    }
    #order-details-footer{
        position: absolute;
        #order-footer-buttons{
        }
    } 
  }
</style>
