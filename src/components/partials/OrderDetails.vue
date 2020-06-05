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
            console.log(user);
            let order = this.order;
            let lineas = '';
            let nombre = this.user.nombre.substr(this.user.nombre.indexOf(", "));





            let envio = {
                "token": "",
                "usuario": "",
                "fechaPedido": "",
                "mdoLineasPedidoWeb": [],
                "email" : ""
            };
            envio.token = window.sessionStorage.token;
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
                lineas += '<li>' + producto.name + ' (' + producto.quantity.toString() + ')</li>'
                
            }
            envio.cuentaCorreo = user.cuentasCorreo[0];
            envio.htmlPedido  = '<!doctype html><html><head><meta name="viewport" content="width=device-width" /><meta http-equiv="Content-Type" content="text/html; charset=UTF-8" /><title>Simple Transactional Email</title><style>/* -------------------------------------GLOBAL RESETS------------------------------------- *//*All the styling goes here*/img {border: none;-ms-interpolation-mode: bicubic;max-width: 100%;}body {background-color: #f6f6f6;font-family: sans-serif;-webkit-font-smoothing: antialiased;font-size: 14px;line-height: 1.4;margin: 0;padding: 0;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;}table {border-collapse: separate;mso-table-lspace: 0pt;mso-table-rspace: 0pt;width: 100%;}table td {font-family: sans-serif;font-size: 14px;vertical-align: top;}/* -------------------------------------BODY & CONTAINER------------------------------------- */.body {background-color: #f6f6f6;width: 100%;}/* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */.container {display: block;margin: 0 auto !important;/* makes it centered */max-width: 580px;padding: 10px;width: 580px;}/* This should also be a block element, so that it will fill 100% of the .container */.content {box-sizing: border-box;display: block;margin: 0 auto;max-width: 580px;padding: 10px;}/* -------------------------------------HEADER, FOOTER, MAIN------------------------------------- */.main {background: #ffffff;border-radius: 3px;width: 100%;}.wrapper {box-sizing: border-box;padding: 20px;}.content-block {padding-bottom: 10px;padding-top: 10px;}.footer {clear: both;margin-top: 10px;text-align: center;width: 100%;}.footer td,.footer p,.footer span,.footer a {color: #999999;font-size: 12px;text-align: center;}/* -------------------------------------TYPOGRAPHY------------------------------------- */h1,h2,h3,h4 {color: #000000;font-family: sans-serif;font-weight: 400;line-height: 1.4;margin: 0;margin-bottom: 30px;}h1 {font-size: 35px;font-weight: 300;text-align: center;text-transform: capitalize;}p,ul,ol {font-family: sans-serif;font-size: 14px;font-weight: normal;margin: 0;margin-bottom: 15px;}p li,ul li,ol li {list-style-position: inside;margin-left: 5px;}a {color: #3498db;text-decoration: underline;}/* -------------------------------------BUTTONS------------------------------------- */.btn {box-sizing: border-box;width: 100%;}.btn>tbody>tr>td {padding-bottom: 15px;}.btn table {width: auto;}.btn table td {background-color: #ffffff;border-radius: 5px;text-align: center;}.btn a {background-color: #ffffff;border: solid 1px #3498db;border-radius: 5px;box-sizing: border-box;color: #3498db;cursor: pointer;display: inline-block;font-size: 14px;font-weight: bold;margin: 0;padding: 12px 25px;text-decoration: none;text-transform: capitalize;}.btn-primary table td {background-color: #3498db;}.btn-primary a {background-color: #3498db;border-color: #3498db;color: #ffffff;}/* -------------------------------------OTHER STYLES THAT MIGHT BE USEFUL------------------------------------- */.last {margin-bottom: 0;}.first {margin-top: 0;}.align-center {text-align: center;}.align-right {text-align: right;}.align-left {text-align: left;}.clear {clear: both;}.mt0 {margin-top: 0;}.mb0 {margin-bottom: 0;}.preheader {color: transparent;display: none;height: 0;max-height: 0;max-width: 0;opacity: 0;overflow: hidden;mso-hide: all;visibility: hidden;width: 0;}.powered-by a {text-decoration: none;}hr {border: 0;border-bottom: 1px solid #f6f6f6;margin: 20px 0;}/* -------------------------------------RESPONSIVE AND MOBILE FRIENDLY STYLES------------------------------------- */@media only screen and (max-width: 620px) {table[class=body] h1 {font-size: 28px !important;margin-bottom: 10px !important;}table[class=body] p,table[class=body] ul,table[class=body] ol,table[class=body] td,table[class=body] span,table[class=body] a {font-size: 16px !important;}table[class=body] .wrapper,table[class=body] .article {padding: 10px !important;}table[class=body] .content {padding: 0 !important;}table[class=body] .container {padding: 0 !important;width: 100% !important;}table[class=body] .main {border-left-width: 0 !important;border-radius: 0 !important;border-right-width: 0 !important;}table[class=body] .btn table {width: 100% !important;}table[class=body] .btn a {width: 100% !important;}table[class=body] .img-responsive {height: auto !important;max-width: 100% !important;width: auto !important;}}/* -------------------------------------PRESERVE THESE STYLES IN THE HEAD------------------------------------- */@media all {.ExternalClass {width: 100%;}.ExternalClass,.ExternalClass p,.ExternalClass span,.ExternalClass font,.ExternalClass td,.ExternalClass div {line-height: 100%;}.apple-link a {color: inherit !important;font-family: inherit !important;font-size: inherit !important;font-weight: inherit !important;line-height: inherit !important;text-decoration: none !important;}#MessageViewBody a {color: inherit;text-decoration: none;font-size: inherit;font-family: inherit;font-weight: inherit;line-height: inherit;}.btn-primary table td:hover {background-color: #34495e !important;}.btn-primary a:hover {background-color: #34495e !important;border-color: #34495e !important;}}</style></head><body class=""><table role="presentation" border="0" cellpadding="0" cellspacing="0" class="body"><tr><td>&nbsp;</td><td class="container"><div class="content"><!-- START CENTERED WHITE CONTAINER --><table role="presentation" class="main"><!-- START MAIN CONTENT AREA --><tr><td class="wrapper"><table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td><p>Hola' + nombre + '.</p><p>Te confirmamos que hemos recibido y procesado el siguiente pedido para el ' + this.orderDate + '</p><ul>' + lineas + '</ul><p>Para comprobar el precio final del pedido, así como modificarlo o revisar los pedidos anteriores, visita <a href="http://pedidos.ecosecha.org">pedidos.ecosecha.org</a></p></td></tr></table></td></tr><!-- END MAIN CONTENT AREA --></table><!-- END CENTERED WHITE CONTAINER --><!-- START FOOTER --><div class="footer"><table role="presentation" border="0" cellpadding="0" cellspacing="0"></table></div><!-- END FOOTER --></div></td><td>&nbsp;</td></tr></table></body></html>';
            this.$http.post('/grabarpedido', envio ).then( response => this.proccessCheckOut(response.data) )
            .catch( error => this.errorCheckOut(error) );
        },
        proccessCheckOut: function(data){
            if('mensaje' in data){
                this.basketUpdated = this.rowDeleted = false;
                this.dialogTitle = '¡Algo ha salido mal!';
                this.dialogText = data.mensaje;
            }else{
                this.basketUpdated = this.rowDeleted = false;
                this.dialogTitle = '¡Perfecto!';
                this.dialogText = 'Hemos procesado correctamente tus cambios. ¡Muchas gracias!';
            }
            this.dialog = true;
            this.basketUpdated = this.rowDeleted = false;
        },
        errorCheckOut: function (error){
            console.log('mal')
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

        // console.log('Validación: ' + this.validation)
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
