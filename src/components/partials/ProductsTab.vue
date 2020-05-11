<template>
  <div class="products-tab" v-if="items">
    <v-tabs
    v-model="tab">
      <v-tab
          v-for="item in items"
          :key="item.nombre"
      >
          {{ item.nombre }}
      </v-tab>
    </v-tabs>

    <v-tabs-items v-model="tab">
        <v-tab-item
            v-for="item in items"
            :key="item.nombre"
        >
        <template v-if="item.nombre == 'DESPENSA'">
          <v-select
            :items="catsDespensa"
            item-text="nombre"
            item-value="codigo"
            label="Selecciona una categoría"
            solo
            v-on:change="filterDespensa"
            :id="catsSelector"
          ></v-select>
        </template>
          <v-card flat>
            <v-card-text class="d-flex flex-wrap justify-center">
              <Product v-for="product in item.content" :key="product.id" :name="product.descripcion" :price="product.precio" :image="product.rutaImagen" :id="product.id" :from="product.procedencia" :type="item.nombre" :familia="product.familia" :codigo="product.codigo" :subProductos="product.productos" :validation="validation" @addedProduct="updateBasket"/>
            </v-card-text>
          </v-card>
        </v-tab-item>
    </v-tabs-items>
  </div>
</template>

<script>
// @ is an alias to /src
// import ProductsTab from '@/components/partials/ProductsTab.vue'
import Product from '@/components/partials/Product.vue'

export default {
    name: 'ProductsTab',
    components: {
      Product
    },
    props: {
      products: Array,
      familias: Array,
      despensa: Number,
      validation: Boolean
    },
    data () {
      return {
        tab: null,
        items: null,
        catsDespensa: null,
        posDespensa: null,
        fullDespensa: [],
      }
    },      
    methods: {
        updateBasket ( product ){
          this.$emit('updateBasket', product);
        },
        filterDespensa(category){
          console.log(this.fullDespensa);
          let despensaFiltrada = [];
          this.fullDespensa.forEach(function(item){
            if( item.categoria == category){
              despensaFiltrada.push(item);
            }
          });
          this.items[this.posDespensa].content = despensaFiltrada;
          this.$forceUpdate();

        }
    }, 
    mounted () {
      let items = [];   
      var positions = [];   
      // let posDespensa = 0;

      //Configuramos las familias. Son elementos de items[]
      for(let i = 0; i < this.familias.length; i++){
        if(this.familias[i].nombre == "DESPENSA"){ 
          // posDespensa = i;
          if(this.despensa == 0){
            continue;
          }
        }
        if(!positions.includes('fam' + this.familias[i].codigo)){
          positions.push('fam' + this.familias[i].codigo);
        }
        let pos = positions.indexOf('fam' + this.familias[i].codigo);

        items[pos] = this.familias[i];
        items[pos]['content'] = [];
      }

      //Ordenamos los productos por categoría
      this.products = this.products.sort((t1,t2) => t1.categoria < t2.categoria ? -1 : 1);


      // rellenamos las familias con los productos
      this.products.forEach(function(product){
        if(! ('productos' in product)){
          product['productos'] = false;
        }
        let pos = positions.indexOf('fam' + product.familia);
        if(pos >= 0 && (product.precio > 0)){
          items[pos]['content'].push(product);
        }
      });
      
      //Guardamos la despensa entera para poder filtrar más adelante
      // this.fullDespensa = items[posDespensa];

      //Ordenamos alfabeticamente las familias
      this.items = items.sort(function(a, b){
        let nameA=a.codigo, nameB=b.codigo
        if (nameA > nameB)
            return 1 
        if (nameA < nameB)
            return -1
        return 0
      }); 
      
      // console.log(items);

      for( let i = 0; i < this.items.length; i++ ){
        if(this.items[i].nombre == 'DESPENSA'){
          this.catsDespensa = this.items[i].mdoCategorias;
          this.posDespensa = i;
          this.fullDespensa = this.items[i].content;
        }
      }

      // this.posDespensa = pos;
      // console.log(pos);
      // //Ordenamos los productos por categoría
      // this.items[pos]['content'] = this.items[pos]['content'].sort((t1,t2) => t1.categoria < t2.categoria ? -1 : 1);

      // console.log(items);
    }
}


</script>

<style lang="scss">
  @import '@/styles/_variables.scss';
  .v-slide-group__prev {
    display: none !important;
  }
  #logout-wrapper{
    width: 100%; 
    text-align: right;
  }
  .v-input.v-select{    
    max-width: 350px;
    margin: 40px auto 0px;
  }
  .products-tab{
    margin-top: 50px;
    margin-left: -20px;
    margin-right: -20px;
    .v-tabs{
      position: sticky;
      top: 55px;
      bottom: 0px;
      z-index: 1;
      box-shadow: 0px 10px 14px -4px white;
        >.v-tabs-bar{
                border-bottom: 2px solid $primary-color;
            .v-tabs-slider-wrapper{
                color: transparent;
            }
            .v-tab{
                  text-transform: none;
                  font-weight: 400;
                  background-color: $soft-grey;
                  font-size: 16px;
                  border-right: 1px solid #FFF;
                  &.v-tab--active{
                      background-color: $primary-color;
                      color: #FFF;
                  }
            }
        }
    }
    .empty-product{
      width: 100%;
      max-width: 180px;
      margin: 10px 20px;
    }
  }
  @media screen and (min-width: $tablet){
    .products-tab{
      margin: auto;
      margin-top: 50px;
      .v-tabs{
        top: 64px;
      }
    }
  }
</style>
