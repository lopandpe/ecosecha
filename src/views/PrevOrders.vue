<template>
  <div class="content-wrapper">
    <div id="order" class="col-12 col-md-6 col-lg-8">
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
    <div id="order-details" class="col-12 col-md-6 col-lg-4">
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
            <div class="fila" id="order-summary-discount" v-if="currentOrder.order.descuento != 0">
                <span class="order-summary-concept">Descuento de socio ({{ currentOrder.order.descuento }}%)</span>
                <span class="order-summary-price">-{{ discountTotal }}€</span>
            </div>
            <div class="fila" id="order-summary-delivery" v-if="currentOrder.order.envio != 0">
                <span class="order-summary-concept">Coste reparto</span>
                <span class="order-summary-price">{{ currentOrder.order.envio }}€</span>
            </div>
        </div>
        <div id="order-details-footer">
            <div id="order-total">
                <span v-if="currentOrder.order.products.length ">Total: {{ total() }}€</span>
            </div>
            <div id="order-footer-buttons" v-bind:class="{ 'show-checkout': ordersOpened}">
                <!-- <v-btn text id="order-checkout" class="bg-primary hidden-sm" :disabled="!canCheckout">Confirmar</v-btn> -->
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

import jwt_decode from 'jwt-decode';

export default {
  name: 'Home',
  components: {
    // ProductsTab,
    // OrderDetails
  },    
  data () {
    return{
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
          descuento: 0,
          envio: 0,
          total: 0,
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
      return this.activeOrderListItem === orderItem;
    },
    setOrderListItemActive: function(orderItem){
      return this.activeOrderListItem = orderItem;
    },
    total: function(){
        let total = toEnglishNumber(this.orderSum) - toEnglishNumber(this.discountTotal) + toEnglishNumber(this.currentOrder.order.envio);
        // console.log(total);
        return toSpanishNumber(total.toFixed(2));
    },
    rowTotal(price, quantity){
        return toSpanishNumber(toEnglishNumber(price) * quantity);
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
        this.orders[0].fechas = data.mdoFechasPedidosAnterior;
        if(this.orders[0].fechas[0].fecha){
          this.prevOrder(this.orders[0].fechas[0].fecha)
        }
    },
    setPrevOrder (data){
      // console.log(data);
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
    }
  },
  computed: {
    visiblePages () {
      return this.orders[0].fechas.slice((this.page - 1)* this.perPage, this.page * this.perPage)
    },
    orderSum: function(){          
        let total = 0;
        this.currentOrder.order.products.forEach( product => {
          if(product.precio){
            total += ( toEnglishNumber(product.precio) * product.cantidad ); 
          }
        });
        return toSpanishNumber(total.toFixed(2));
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
  #order{
    padding: 20px;
    padding-top: 100px;
  }
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
        max-height: 300px;
        overflow: auto;
    }
    #order-details-footer{
        position: absolute;
        #order-footer-buttons{
        }
    }
  }
</style>
