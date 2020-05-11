<template v-if="parseInt(precio) > 0">
    <v-card class="product">
        <!-- <v-img class="align-end" height="95px" :src="'http://ecosecha.vservers.es' + image">                 -->
        <v-img class="align-end" height="95px" :src="imagen" @error="imageLoadError">                
            <v-card-text class="product-price">{{ precio }}€</v-card-text>
        </v-img>
        <div class="content">
            <div class="data">
                <v-card-title class="product-title">{{ name }}</v-card-title>
                <v-card-subtitle class="product-from">{{ from }}</v-card-subtitle>
                <v-card-subtitle class="product-subProducts" v-if="hasSubProducts()">
                    <a @click.stop="dialog = true">Ver composición</a>
                </v-card-subtitle>
            </div>
            <div class="footer">
                <v-card-actions class="product-actions">
                    <div id="quantity-wrapper">
                        <v-btn class="product-control" text small v-on:click="decrement()">-</v-btn>
                        <v-text-field class="product-quantity" v-model="foo" value="0" type="text" min="0" disabled></v-text-field>
                        <v-btn class="product-control" text small  v-on:click="increment()">+</v-btn>
                    </div>
                    <v-btn text small class="product-add-to-cart bg-primary" v-on:click="submit" :disabled="!canSubmit()">Añadir</v-btn>
                </v-card-actions>
            </div>
        </div>
        
        <v-dialog v-if="hasSubProducts()"
            v-model="dialog"
            max-width="320"
            >
            <v-card>
                <v-card-title>Composición de<br>{{ name }}</v-card-title>
                <v-card-text>
                    <ul>
                        <li v-for="producto in subProductos" v-bind:key="producto.codigoProducto">{{ producto.descripcion }} ({{ producto.cantidad }})</li>
                    </ul>
                </v-card-text>
                

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn
                        color="green darken-1"
                        text
                        @click="dialog = false"
                    >
                        Ok
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-card>
</template>

<script>
// @ is an alias to /src
// import ProductsTab from '@/components/partials/ProductsTab.vue'

export default {
    name: 'Product',
    props: [
        'id',
        'name',
        'price',
        'image',
        'from',
        'type',
        'familia',
        'codigo',
        'validation',
        'subProductos'
    ],
    components: {
    // ProductsTab
    },
    data () {
        return {
            precio: null,
            foo: 0,
            imagen: "/default.jpg",
            dialog: false
        }
    },  
    methods: {
        increment () {
            this.foo = parseInt(this.foo,10) + 1
        },
        decrement () {
            if(this.foo > 0)
                this.foo = parseInt(this.foo,10) - 1
        },
        submit () {
            if(this.foo > 0){
                let data = {
                    id: this.id,
                    name: this.name,
                    price: this.price,
                    quantity: this.foo,
                    type: this.type,
                    codigo: this.codigo,
                    familia: this.familia
                }
                // console.log(data);
                this.$emit('addedProduct', data);
                this.foo = 0;
            }
            
        },        
        hasSubProducts() {
            // console.log(this.subProductos);
            if(!this.subProductos){
                return false;
            }
            return this.subProductos.length;
        },
        imageLoadError(){
            this.imagen = "/default.jpg";
        },
        canSubmit(){
            if(this.foo > 0 && this.validation){
                return true;
            }
        }
    },
    mounted (){
        this.precio = toSpanishNumber(this.price);
        
        let foto = this.image;
        foto = foto.replace('c:/products/', '/img/');
        foto = foto.replace('/products/', '/img/');
        let imageExists = require('image-exists');
        imageExists(foto, function(exists) {
            // console.log(foto + ' -> ' + exists);
            if (!exists) {
                foto = "/default.jpg";
            }
        });
        this.imagen = foto;
    }
}


function toSpanishNumber($number){
    return $number.toString().replace('.', ',');
}
</script>

<style lang="scss">
  @import '@/styles/_variables.scss';
  .product{
        // box-shadow: none;
        // border: none;
        max-width: 160px;
        margin: 5px;
        .content{
            height: calc(100% - 95px);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        }
        .product-price{
            position: absolute;
            bottom: 0px;
            right: 0px;
            padding: 5px;
            width: auto;
            background-color: rgba(#FFF, 0.7);
            font-weight: 900;
            font-size: 17px;
        }
        .product-title{
            font-weight: 400;
            font-size: 15px;
            line-height: 1.25em;
            word-break: normal;
        }
        .product-from{
            margin-top: -10px;
        }
        .product-subProducts{
            padding-top: 0px;
        }
        .product-actions{
            justify-content: space-between;
            padding: 0px 10px; 
            margin-top: -10px;
            #quantity-wrapper{
                display: flex;
                align-items: center;
                .v-btn.product-control{
                    min-width: auto;
                    font-size: 26px;
                    font-weight: 100;
                    margin: 0px;
                    padding: 0 5px;
                }
                .product-quantity{
                    .v-input__slot{
                        &:before{
                            border-color: rgba(0, 0, 0, 0.42);
                            border-image: none;
                        }
                    }
                    .v-text-field__slot{
                        overflow: hidden;
                    }
                    input{
                        max-width: none;
                        width: 25px;
                        overflow: hidden;
                        text-align: center;
                        -webkit-appearance: none;
                        -moz-appearance:    none;
                        appearance:         none;
                        margin: 0;
                        color: #000 !important;
                        // margin-right: -15px;
                    }
                }
            }
            .product-add-to-cart{
                background-color: $primary-color;
                color: #FFF !important;
                &.v-btn--disabled {
                    opacity: 0.3;
                }
            }
        }
        
      .v-image{

      }
  }
  @media screen and (min-width: $desktop){
      .product{
          max-width: 170px;
          margin: 10px;
      }
  }
</style>
