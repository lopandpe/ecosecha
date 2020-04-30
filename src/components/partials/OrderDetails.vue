<template>
  <div class="order-details-container container" >
    <v-icon v-on:click="toggleOrderDetails()" id="close-orders" class="hidden-md-and-up">mdi-close</v-icon>
    <h2>Resumen del pedido</h2>
    <p class="order-info">
        Puedes añadir o eliminar los productos que desees. Si tu cuenta tiene configurada un pedido por defecto, aparecerá marcado aquí abajo. 
    </p>
    <div id="client-details">
        <h3>{{ name }}</h3>
        <h3>Zona de reparto: {{ zone }}</h3>
        <h3><strong>Fecha del pedido: {{ orderDate }}</strong></h3>
    </div>
    <div id="order-details-table">
        <table>
            <thead>
                <tr>
                    <th></th>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Uds</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="product in order" :key="product.id">
                    <td><v-icon v-on:click="deleteRow(product.id)" v-if="validation">mdi-delete-forever</v-icon></td>
                    <td class="col-name">{{ product.name }}</td>
                    <td>{{ product.price }}€</td>
                    <td>{{ product.quantity }}</td>
                    <td>{{ rowTotal(product.price, product.quantity) }}€</td>
                </tr>
            </tbody>
        </table>
    </div>
    <div id="order-summary" >
        <div class="fila">
            <span class="order-summary-concept">Suma pedido</span>
            <span class="order-summary-price">{{ orderSum }}€</span>
        </div>
        <div class="fila" id="order-summary-discount" v-if="discount != 0">
            <span class="order-summary-concept">Descuento de socio ({{ discount }}%)</span>
            <span class="order-summary-price">-{{ discountTotal }}€</span>
        </div>
        <div class="fila" id="order-summary-delivery" v-if="delivery != 0">
            <span class="order-summary-concept">Coste reparto</span>
            <span class="order-summary-price">{{ delivery }}€</span>
        </div>
    </div>
    <div id="order-details-footer">
        <div id="order-total">
            <span v-if=" order.length ">Total: {{ total }}€</span>
        </div>
        <div id="order-footer-buttons" v-bind:class="{ 'show-checkout': ordersOpened}">
            <v-btn text id="order-checkout" class="bg-primary hidden-sm" :disabled="!canCheckout" @click="checkOut" v-if="validation">{{ checkOutText }}</v-btn>
            <v-btn text id="order-show" class="bg-primary hidden-md-and-up" @click="toggleOrderDetails">Ver pedido</v-btn>
        </div>
         <div class="alert alert-danger" v-if="error">{{ error }}</div>
    </div>    
    <v-dialog
        v-model="dialog"
        width="500"
        >
        <v-card>
            <v-card-title class="headline">{{ dialogTitle }}</v-card-title>
            <v-card-text>{{ dialogText }}</v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="green darken-1" text @click="dialog = false">Ok</v-btn>
            </v-card-actions>
        </v-card>        
    </v-dialog>
  </div>
</template>

<script>
// @ is an alias to /src
// import ProductsTab from '@/components/partials/ProductsTab.vue'

export default {
    name: 'OrderDetails',
    components: {
    //   Product
    },
    props: {
        order: Array,
        user: Object,
        fechaPedido: String,
        OrderDetailsHeight: Number,
        defaultOrder: Array,
        guerta: Boolean,
        minimo: Number,
        basketUpdated: Boolean,
        validation: Boolean
    },
    data () {
      return {
          name: '',
          zone: '',
          orderDate: '',
          discount: '',
          delivery: '',
          ordersOpened: false,
          checkOutText: 'Confirmar',
          error: null,
          dialog: false,
          dialogTitle: '',
          dialogText: '',
          rowDeleted: false
      }
    },
    computed: {
        total: function(){
            let total = toEnglishNumber(this.orderSum) - toEnglishNumber(this.discountTotal) + toEnglishNumber(this.delivery);
            return toSpanishNumber(total.toFixed(2));
        },
        orderSum: function(){          
            let total = 0;
            this.order.forEach( product => {
                total += ( toEnglishNumber(product.price) * product.quantity ); 
            });
            return toSpanishNumber(total.toFixed(2));
        },
        discountTotal: function(){
            let price = toEnglishNumber(this.orderSum) / 100 * toEnglishNumber(this.discount);
            return toSpanishNumber(parseFloat(price).toFixed(2));
        },
        canCheckout: function(){
            if(!this.basketUpdated && !this.rowDeleted){
                return false;
            }
            let total = 0;
            let cesta = false;
            this.order.forEach( product => {
                total += ( toEnglishNumber(product.price) * product.quantity ); 
                if( !this.guerta && (product.type == 'CESTAS' || product.type == 1 ) ){
                    cesta = true;
                }
            });
            return (cesta || parseFloat(total) >= this.minimo);
        }
    },
    methods: {
        deleteRow (id) {
            this.rowDeleted = true;
            // console.log(this.orderChanged)
            let pos = this.order.map(function(e) { 
                return e.id; 
            }).indexOf(id);
            if ( pos > -1 ){
                this.order.splice(pos, 1);
                calcHeightOrders(50);
            }
        },
        rowTotal(price, quantity){
            return toSpanishNumber( (toEnglishNumber(price) * quantity).toFixed(2) );
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
        checkOut: function(){
            let user = this.user;
            let order = this.order;
            let envio = {
                "token": "",
                "usuario": "",
                "fechaPedido": "",
                "mdoLineasPedidoWeb": []
            };
            envio.token = localStorage.token;
            envio.usuario = user.codigo;
            envio.fechaPedido = this.fechaPedido.trim();
            for(let i=0; i<order.length; i++ ){
                let producto = order[i];
                // console.log(producto);
                let prod = {
                    'nombreProducto': producto.name,
                    'cantidad': producto.quantity.toString(),
                    'codigoProducto': producto.codigo.toString(),
                    'familiaProducto': producto.familia.toString(),
                    'importe': (producto.quantity * producto.price).toString(),
                    'precio': producto.price,
                    'idProducto': producto.id
                }
                envio.mdoLineasPedidoWeb.push(prod);
                
            }
            
            this.$http.post('/grabarpedido', envio ).then( response => this.proccessCheckOut(response.data) )
            .catch( error => this.errorCheckOut(error) );
        },
        proccessCheckOut: function(){
            this.dialogTitle = '¡Perfecto!';
            this.dialogText = 'Hemos procesado correctamente tus cambios. ¡Muchas gracias!'
            this.dialog = true;
            this.basketUpdated = this.rowDeleted = false;
        },
        errorCheckOut: function (error){
            this.error = 'Error al grabar el pedido';
            console.log(error)
        }
        
    },
    mounted(){
        
          this.name = this.user.nombre;
          this.zone = this.user.nombreGrupo;
          this.orderDate = this.fechaPedido;
          this.discount = this.user.dtoSocio;
          this.delivery = this.user.fijoDomicilio;

        console.log('Validación: ' + this.validation)
        this.$nextTick(function() {
            // window.addEventListener('resize', this.calcHeightOrders);
            var doit;
            window.onresize = function() {
                clearTimeout(doit);
                doit = setTimeout(function() {
                    calcHeightOrders();
                }, 100);
            };
            
        });
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
    if( (elementHeight + offset > orderDetailsHeight) || (elementHeight + offset > window.innerHeight) ){
            orderDetails.classList.add('scrollbar');
    }else{
            orderDetails.classList.remove('scrollbar');
    }
}

</script>

<style lang="scss">
  @import '@/styles/_variables.scss';
  .order-details-container{
    //   top: 100vh;
    //   position: relative;
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
        #order-show{
            color: #FFF;
        }
        #order-checkout{
            display: none;
            background-color: $primary-color;
            text-transform: none;
            // font-size: 18px;
            color: #FFF;
            font-weight: 400;
        }
        &.show-checkout{
            #order-show{
                display: none !important;
            }
            #order-checkout{
                display: block !important;
            }
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
            #order-checkout{
                display: block;
            }
            #order-show{
                display: none;
            }
        }
    }
  }
</style>
