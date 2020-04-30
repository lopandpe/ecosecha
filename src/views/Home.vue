<template>
  <div class="content-wrapper">
    <div id="order" class="col-12 col-md-6 col-lg-8">
      <p class="intro">
        Configuración del pedido para el {{ fechaPedido }}. Recuerda que todo pedido debe incluir como mínimo <span  v-if="!guerta">una cesta o </span>{{ minimo}} euros en productos. Cualquier duda que tengas, ponte en contacto con nosotr@s en <a :href="`mailto:${eMailProductor}`" target="_blank">{{ eMailProductor }}</a>
      </p>
      <h3 v-if="!validation" class="red darken-2 text-center"><span class="white--text" v-html="validationMessage"></span></h3>
      <ProductsTab @updateBasket="updateBasket" :products="products" :familias="familias" :despensa="despensa" :validation="validation" v-if="products"/>
    </div>
    <div id="order-details" class="col-12 col-md-6 col-lg-4">
      <OrderDetails ref="orderDetails" :order="order" :user="user" :fechaPedido="fechaPedido" :guerta="guerta" :minimo="minimo" :basketUpdated="basketUpdated" :validation="validation" v-if="user"/>
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
      defaultOrder: [],
      validation: null,
      validationMessage: null,
      guerta: false,
      minimo: null,
      eMailProductor: null,
      depensa: 1,
      basketUpdated: false
    } 
  },
  methods: {
      updateBasket ( product, $basketUpdated = true ){
        // console.log(this.order);
        let prod = this.order.find( el => {
              // console.log(el);
              // console.log(product);
                return el.id === product.id;
            });
        if(prod){
            prod.quantity += parseInt(product.quantity);
        }else{
            this.order.push(product);
        }
        this.basketUpdated = $basketUpdated;
        setTimeout(() => {
          this.calcHeightOrders();
        }, 300);
        
      },
      setData ( data ){
        console.log(data);
        this.user = data.mdoConsumidor;
        this.minimo = parseFloat(data.mdoConfiguracion.importeMinimo.trim());
        this.eMailProductor = data.mdoConfiguracion.cuentaCorreo;
        this.fechaPedido = data.mdoConfiguracion.fecha;
        this.despensa = parseInt(data.mdoConsumidor.pedidosCarta);
        this.setProductsList(data);
        this.defaultOrderCalc ( data.mdoPedidosExtras );
        this.validation = data.mdoConsumidor.validacion == 'Ok';
        // this.validation = true;
        this.validationMessage = data.mdoConsumidor.validacion.replace('|', '</br>');
      },
      defaultOrderCalc ( order ){
        if(Array.isArray(order.articulos) && order.articulos.length){
          let printed = false;
          for(let i = 0; i < order.articulos.length; i++){
            if(parseInt(order.articulos[i].importe) > 0){
              if(!printed){
                printed = true;
              }
              let producto = {
                    id: order.articulos[i].idProducto,
                    name: order.articulos[i].nombreProducto,
                    price: order.articulos[i].precio,
                    quantity: order.articulos[i].cantidad,
                    type: order.articulos[i].familiaProducto,
                    familia: order.articulos[i].familiaProducto,
                    codigo: order.articulos[i].codigoProducto
                };
              this.updateBasket(producto, false);
            }
          } 
        }
      },
      setProductsList (data){
        let allProducts = data.mdoProductosExtras;
        let cestas = data.mdoProductosCambios;
        allProducts.push(cestas)
        for(let i = 0; i < cestas.length; i++ ){
          allProducts.push(cestas[i]);
        }
        this.products = allProducts;        
        let familia = {
          codigo: 1,
          nombre: 'CESTAS'
        };
        this.familias = data.mdoFamilias;
        this.familias.push(familia);
      },
      calcHeightOrders(offset = 150){ 
          let elementHeight = document.querySelector('.order-details-container').offsetHeight;
          let orderDetails = document.getElementById('order-details');
          let orderDetailsHeight = orderDetails.offsetHeight;
          if( (elementHeight + offset > orderDetailsHeight) || (elementHeight + offset > window.innerHeight) ){
            orderDetails.classList.add('scrollbar');
          }else{
            orderDetails.classList.remove('scrollbar'); 
          }
      },
      getAllData(){
        let token = localStorage.token;
        let tokenDecoded = jwt_decode(token);
        let userId = tokenDecoded.jti;
        // console.log(tokenDecoded);
        if(tokenDecoded.distribution == 1){
          this.guerta = true;
        }
        this.$http.post('/all', { 
          usuario: userId, 
          password: '',
          fechaPedido: '',
          token: localStorage.token
        }).then( response => this.setData(response.data) )
          .catch( error => console.log(error) );
      }
  } ,
  mounted () {    
    this.getAllData();
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
      position: fixed;
      right: 0px;
      top: 64px;
      padding-bottom: auto;
      z-index: initial;
      padding-bottom: 90px;
      .order-details-container{        
        height: 100%;
        overflow-y: auto;
        padding-bottom: 80px;
      }
      &.scrollbar{
        // height: auto;
        // min-height: calc(100vh - 64px);
        // height: fit-content;
        // /* position: relative; */
        // bottom: 0px;
        // /* margin-top: 64px; */
        // top: auto;
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
