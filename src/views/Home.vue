<template>
  <div class="content-wrapper">
    <div id="order" class="col-12 col-md-6 col-lg-8">
      <p class="intro">
        Configuración del pedido para el {{ fechaPedido }}. Recuerda que todo pedido debe incluir como mínimo una cesta o 20 euros en productos independientes. Cualquier duda que tengas, ponte en contacto con nosotr@s en xxxxx@xxxx.com
      </p>
      <ProductsTab @updateBasket="updateBasket" :products="products" :familias="familias" v-if="products"/>
    </div>
    <div id="order-details" class="col-12 col-md-6 col-lg-4">
      <OrderDetails ref="orderDetails" :order="order" :user="user" :fechaPedido="fechaPedido" v-if="user"/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import ProductsTab from '@/components/partials/ProductsTab.vue'
import OrderDetails from '@/components/partials/OrderDetails.vue'

import jwt_decode from 'jwt-decode';

export default {
  name: 'Home',
  components: {
    ProductsTab,
    OrderDetails
  },
  props : {
    // user: Object,
  },   
  data () {
    return{
      order: [],
      allData: null,
      fechaPedido: null,
      products: null,
      familias: null,
      user: null,
      defaultOrder: []
    } 
  },
  methods: {
      updateBasket ( product ){
        let prod = this.order.find( el => {
                return el.id === product.id;
            });
        // console.log(prod);
        if(prod){
            prod.quantity += parseInt(product.quantity);
        }else{
            this.order.push(product);
        }
        console.log(this.$refs);
        this.$refs.orderDetails.calcHeightOrders();
      },
      setData ( data ){
        console.log(data);
        this.user = data.mdoConsumidor;
        this.fechaPedido = data.mdoFechas.fecha;
        this.products = data.mdoProductosExtras;
        this.familias = data.mdoFamilias;
        this.defaultOrderCalc ( data.mdoPedidosCambios )
      },
      defaultOrderCalc ( order ){
        console.log('----------------- ORDER -------------------');
        console.log(order);
        if(Array.isArray(order.articulos) && order.articulos.length){
          let producto = {
                id: order.articulos[0].idProducto,
                name: order.articulos[0].nombreProducto,
                price: order.articulos[0].importe,
                quantity: order.articulos[0].cantidad,
                type: order.articulos[0].familiaProducto
            };
          this.updateBasket(producto);
          // console.log(producto);
        }
      }
  } ,
  mounted () {    
    let token = localStorage.token;
    let tokenDecoded = jwt_decode(token);
    let userId = tokenDecoded.jti;
    console.log(userId);

    this.$http.post('/all', { 
      usuario: userId, 
      password: '',
      token: localStorage.token
    }).then( response => this.setData(response.data) )
      .catch( error => console.log(error) );
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
  #order{
    padding: 20px;
    padding-top: 100px;
  }
  #order-details{
    background-color: $orders-bg;
    position: fixed;
    top: 100vh;
    z-index: 999;
    height: 100vh;
    overflow-y: auto;
    padding-bottom: 200px;
    transition: top 0.3s ease-in-out;
  }
  body.orders-opened{
    overflow: hidden;
    position: fixed;
    #order-details{
      top: 0px;
    }
  }
  @media screen and (min-width: $tablet){
    body.orders-opened{
      overflow: auto;
      position: relative;
      #order-details{
        top: 64px;
      }
    }
    #order-details{
      // background-color: $orders-bg;
      height: calc(100vh - 64px);
      position: sticky;
      top: 64px;
      padding-bottom: auto;
      z-index: initial;
      &.scrollbar{
        height: auto;
        min-height: calc(100vh - 64px);
        height: fit-content;
        /* position: relative; */
        bottom: 0px;
        /* margin-top: 64px; */
        top: auto;
          }
        }
  }
  .col-xl, .col-xl-auto, .col-xl-12, .col-xl-11, .col-xl-10, .col-xl-9, .col-xl-8, .col-xl-7, .col-xl-6, .col-xl-5, .col-xl-4, .col-xl-3, .col-xl-2, .col-xl-1, .col-lg, .col-lg-auto, .col-lg-12, .col-lg-11, .col-lg-10, .col-lg-9, .col-lg-8, .col-lg-7, .col-lg-6, .col-lg-5, .col-lg-4, .col-lg-3, .col-lg-2, .col-lg-1, .col-md, .col-md-auto, .col-md-12, .col-md-11, .col-md-10, .col-md-9, .col-md-8, .col-md-7, .col-md-6, .col-md-5, .col-md-4, .col-md-3, .col-md-2, .col-md-1, .col-sm, .col-sm-auto, .col-sm-12, .col-sm-11, .col-sm-10, .col-sm-9, .col-sm-8, .col-sm-7, .col-sm-6, .col-sm-5, .col-sm-4, .col-sm-3, .col-sm-2, .col-sm-1, .col, .col-auto, .col-12, .col-11, .col-10, .col-9, .col-8, .col-7, .col-6, .col-5, .col-4, .col-3, .col-2, .col-1 {
      width: 100%;
      padding: 12px;
  }
  .col-12 {
      -webkit-box-flex: 0;
      -ms-flex: 0 0 100%;
      flex: 0 0 100%;
      max-width: 100%;
  }
  @media (min-width: 960px){
    .col-md-6 {
        -webkit-box-flex: 0;
        -ms-flex: 0 0 50%;
        flex: 0 0 50%;
        max-width: 50%;
    }
  }
  @media (min-width: 1264px){
    .col-lg-4 {
        -webkit-box-flex: 0;
        -ms-flex: 0 0 33.3333333333%;
        flex: 0 0 33.3333333333%;
        max-width: 33.3333333333%;
    }
    .col-lg-8 {
        -webkit-box-flex: 0;
        -ms-flex: 0 0 66.6666666667%;
        flex: 0 0 66.6666666667%;
        max-width: 66.6666666667%;
    }
  }
</style>
