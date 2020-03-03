<template>
  <div class="content-wrapper">
    <div id="order" class="col-12 col-md-6 col-lg-8">
      <p class="intro">
        Configuración del pedido para el XX/XX/XXXX. Recuerda que todo pedido debe incluir como mínimo una cesta o 20 euros en productos independientes. Cualquier duda que tengas, ponte en contacto con nosotr@s en xxxxx@xxxx.com
      </p>
      <ProductsTab @updateBasket="updateBasket" />
    </div>
    <div id="order-details" class="col-12 col-md-6 col-lg-4">
      <OrderDetails ref="orderDetails" :order="order"/>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import ProductsTab from '@/components/partials/ProductsTab.vue'
import OrderDetails from '@/components/partials/OrderDetails.vue'

export default {
  name: 'Home',
  components: {
    ProductsTab,
    OrderDetails
  },    
  data () {
    return{
      order: []
    }
  },
  methods: {
      updateBasket ( product ){
        let prod = this.order.find( el => {
                return el.id === product.id;
            });
        // console.log(prod);
        if(prod){
            prod.quantity += product.quantity;
        }else{
            this.order.push(product);
        }
        this.$refs.orderDetails.calcHeightOrders();
      }
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
</style>
