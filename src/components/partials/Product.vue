<template v-if="parseInt(precio) > 0">
    <v-card class="product" max-width="180">
        <!-- <v-img class="align-end" height="95px" :src="'http://ecosecha.vservers.es' + image">                 -->
        <v-img class="align-end" height="95px" :src="imagen" @error="imageLoadError">                
            <v-card-text class="product-price">{{ precio }}€</v-card-text>
        </v-img>
        <v-card-title class="product-title">{{ name }}</v-card-title>
        <v-card-subtitle class="product-from">{{ from }}</v-card-subtitle>
        <v-card-actions class="product-actions">
            <div id="quantity-wrapper">
                <v-btn class="product-control" text small v-on:click="decrement()">-</v-btn>
                <v-text-field class="product-quantity" v-model="foo" value="0" type="text" min="0" disabled></v-text-field>
                <v-btn class="product-control" text small  v-on:click="increment()">+</v-btn>
            </div>
            <v-btn text small class="product-add-to-cart bg-primary" v-on:click="submit">Añadir</v-btn>
        </v-card-actions>
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
        'codigo'
    ],
    components: {
    // ProductsTab
    },
    data () {
        return {
            precio: null,
            foo: 0,
            imagen: "/ecosecha/default.jpg"
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
        imageLoadError(){
            this.imagen = "/ecosecha/default.jpg";
        }
    },
    mounted (){
        this.precio = toSpanishNumber(this.price);
        
        let foto = this.image;
        foto = foto.replace('c:/products/', '/ecosecha/img/');
        foto = foto.replace('/products/', '/ecosecha/img/');
        let imageExists = require('image-exists');
        imageExists(foto, function(exists) {
            // console.log(foto + ' -> ' + exists);
            if (!exists) {
                foto = "/ecosecha/default.jpg";
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
        margin: 10px;
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
                color: #FFF;
            }
        }
        
      .v-image{

      }
  }
</style>
