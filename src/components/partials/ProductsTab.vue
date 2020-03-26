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
          <v-card flat>
            <v-card-text class="d-flex flex-wrap justify-center">
              <Product v-for="product in item.content" :key="product.id" :name="product.descripcion" :price="product.precio" :image="product.rutaImagen" :id="product.id" :from="product.origen" :type="item.nombre"  @addedProduct="updateBasket"/>
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
    },
    data () {
      return {
        tab: null,
        items: null,
        // items: [
        //   { 
        //     tab: 'Cestas', 
        //     content: [
        //       {
        //         id: 1,
        //         nombre: 'Cesta de verdura variada 4kg',
        //         origen: 'Chinchón',
        //         precio: '10,50',
        //         imagen: 'https://c7.staticflickr.com/9/8052/29758005422_e41269d829_o.jpg'
        //       },
        //       {
        //         id: 2,
        //         nombre: 'Cesta de verdura variada 4kg',
        //         origen: 'Morata de Tajuña',
        //         precio: '10,50',
        //         imagen: 'https://c7.staticflickr.com/9/8052/29758005422_e41269d829_o.jpg'
        //       },
        //       {
        //         id: 3,
        //         nombre: 'Cesta de verdura variada 4kg',
        //         origen: 'Málaga',
        //         precio: '10,50',
        //         imagen: 'https://c7.staticflickr.com/9/8052/29758005422_e41269d829_o.jpg'
        //       },
        //       {
        //         id: 4,
        //         nombre: 'Cesta de verdura variada 4kg',
        //         origen: 'Málaga',
        //         precio: '10,50',
        //         imagen: 'https://c7.staticflickr.com/9/8052/29758005422_e41269d829_o.jpg'
        //       },
        //       {
        //         id: 5,
        //         nombre: 'Cesta de verdura variada 4kg',
        //         precio: '10,50',
        //         imagen: 'https://c7.staticflickr.com/9/8052/29758005422_e41269d829_o.jpg'
        //       },
        //       {
        //         id: 6,
        //         nombre: 'Cesta de verdura variada 4kg',
        //         precio: '10,50',
        //         imagen: 'https://c7.staticflickr.com/9/8052/29758005422_e41269d829_o.jpg'
        //       },
        //       {
        //         id: 7,
        //         nombre: 'Cesta de verdura variada 4kg',
        //         precio: '10,50',
        //         imagen: 'https://c7.staticflickr.com/9/8052/29758005422_e41269d829_o.jpg'
        //       },
        //       {
        //         id: 8,
        //         nombre: 'Cesta de verdura variada 4kg',
        //         precio: '10,50',
        //         imagen: 'https://c7.staticflickr.com/9/8052/29758005422_e41269d829_o.jpg'
        //       },
        //     ]
        //   },
        //   { 
        //     tab: 'Verduras', 
        //     content: [
        //       {
        //         id: 11,
        //         nombre: 'Acelgas maravillosas (500grs)',
        //         origen: 'Málaga',
        //         precio: '2,65',
        //         imagen: 'https://okdiario.com/img/2018/10/27/receta-de-acelgas-esparragadas-1-620x349.jpg'
        //       },
        //       {
        //         id: 12,
        //         nombre: 'Acelgas maravillosas (500grs)',
        //         origen: 'Málaga',
        //         precio: '2,65',
        //         imagen: 'https://okdiario.com/img/2018/10/27/receta-de-acelgas-esparragadas-1-620x349.jpg'
        //       },
        //       {
        //         id: 13,
        //         nombre: 'Acelgas maravillosas (500grs)',
        //         origen: 'Málaga',
        //         precio: '2,65',
        //         imagen: 'https://okdiario.com/img/2018/10/27/receta-de-acelgas-esparragadas-1-620x349.jpg'
        //       },
        //       {
        //         id: 14,
        //         nombre: 'Acelgas maravillosas (500grs)',
        //         origen: 'Málaga',
        //         precio: '2,65',
        //         imagen: 'https://okdiario.com/img/2018/10/27/receta-de-acelgas-esparragadas-1-620x349.jpg'
        //       },
        //       {
        //         id: 15,
        //         nombre: 'Acelgas maravillosas (500grs)',
        //         precio: '2,65',
        //         imagen: 'https://okdiario.com/img/2018/10/27/receta-de-acelgas-esparragadas-1-620x349.jpg'
        //       },
        //       {
        //         id: 16,
        //         nombre: 'Acelgas maravillosas (500grs)',
        //         precio: '2,65',
        //         imagen: 'https://okdiario.com/img/2018/10/27/receta-de-acelgas-esparragadas-1-620x349.jpg'
        //       },
        //       {
        //         id: 17,
        //         nombre: 'Acelgas maravillosas (500grs)',
        //         origen: 'Málaga',
        //         precio: '2,65',
        //         imagen: 'https://okdiario.com/img/2018/10/27/receta-de-acelgas-esparragadas-1-620x349.jpg'
        //       },
        //       {
        //         id: 18,
        //         nombre: 'Acelgas maravillosas (500grs)',
        //         precio: '2,65',
        //         imagen: 'https://okdiario.com/img/2018/10/27/receta-de-acelgas-esparragadas-1-620x349.jpg'
        //       },
        //       {
        //         id: 19,
        //         nombre: 'Acelgas maravillosas (500grs)',
        //         origen: 'Málaga',
        //         precio: '2,65',
        //         imagen: 'https://okdiario.com/img/2018/10/27/receta-de-acelgas-esparragadas-1-620x349.jpg'
        //       },
        //       {
        //         id: 110,
        //         nombre: 'Acelgas maravillosas (500grs)',
        //         precio: '2,65',
        //         imagen: 'https://okdiario.com/img/2018/10/27/receta-de-acelgas-esparragadas-1-620x349.jpg'
        //       },
        //       {
        //         id: 1101,
        //         nombre: 'Acelgas maravillosas (500grs)',
        //         precio: '2,65',
        //         imagen: 'https://okdiario.com/img/2018/10/27/receta-de-acelgas-esparragadas-1-620x349.jpg'
        //       },
        //       {
        //         id: 111,
        //         nombre: 'Acelgas maravillosas (500grs)',
        //         precio: '2,65',
        //         imagen: 'https://okdiario.com/img/2018/10/27/receta-de-acelgas-esparragadas-1-620x349.jpg'
        //       },
        //       {
        //         id: 112,
        //         nombre: 'Acelgas maravillosas (500grs)',
        //         precio: '2,65',
        //         imagen: 'https://okdiario.com/img/2018/10/27/receta-de-acelgas-esparragadas-1-620x349.jpg'
        //       },
        //       {
        //         id: 113,
        //         nombre: 'Acelgas maravillosas (500grs)',
        //         precio: '2,65',
        //         imagen: 'https://okdiario.com/img/2018/10/27/receta-de-acelgas-esparragadas-1-620x349.jpg'
        //       },
        //       {
        //         id: 114,
        //         nombre: 'Acelgas maravillosas (500grs)',
        //         precio: '2,65',
        //         imagen: 'https://okdiario.com/img/2018/10/27/receta-de-acelgas-esparragadas-1-620x349.jpg'
        //       },
        //       {
        //         id: 115,
        //         nombre: 'Acelgas maravillosas (500grs)',
        //         precio: '2,65',
        //         imagen: 'https://okdiario.com/img/2018/10/27/receta-de-acelgas-esparragadas-1-620x349.jpg'
        //       },
        //       {
        //         id: 116,
        //         nombre: 'Acelgas maravillosas (500grs)',
        //         precio: '2,65',
        //         imagen: 'https://okdiario.com/img/2018/10/27/receta-de-acelgas-esparragadas-1-620x349.jpg'
        //       },
        //       {
        //         id: 1116,
        //         nombre: 'Acelgas maravillosas (500grs)',
        //         precio: '2,65',
        //         imagen: 'https://okdiario.com/img/2018/10/27/receta-de-acelgas-esparragadas-1-620x349.jpg'
        //       },
        //       {
        //         id: 117,
        //         nombre: 'Acelgas maravillosas (500grs)',
        //         precio: '2,65',
        //         imagen: 'https://okdiario.com/img/2018/10/27/receta-de-acelgas-esparragadas-1-620x349.jpg'
        //       },
        //       {
        //         id: 118,
        //         nombre: 'Acelgas maravillosas (500grs)',
        //         precio: '2,65',
        //         imagen: 'https://okdiario.com/img/2018/10/27/receta-de-acelgas-esparragadas-1-620x349.jpg'
        //       },
        //       {
        //         id: 119,
        //         nombre: 'Acelgas maravillosas (500grs)',
        //         precio: '2,65',
        //         imagen: 'https://okdiario.com/img/2018/10/27/receta-de-acelgas-esparragadas-1-620x349.jpg'
        //       },
        //     ]
        //   },
        //   { 
        //     tab: 'Frutas', 
        //     content: [
        //       {
        //         id: 20,
        //         nombre: 'Plátanos ecológicos (1kg)',
        //         origen: 'Málaga',
        //         precio: '2,65',
        //         imagen: 'https://www.quimicaysociedad.org/wp-content/uploads/2015/06/platano-590x295.jpg'
        //       },
        //       {
        //         id: 21,
        //         nombre: 'Plátanos ecológicos (1kg)',
        //         origen: 'Málaga',
        //         precio: '2,65',
        //         imagen: 'https://www.quimicaysociedad.org/wp-content/uploads/2015/06/platano-590x295.jpg'
        //       },
        //       {
        //         id: 22,
        //         nombre: 'Plátanos ecológicos (1kg)',
        //         origen: 'Málaga',
        //         precio: '2,65',
        //         imagen: 'https://www.quimicaysociedad.org/wp-content/uploads/2015/06/platano-590x295.jpg'
        //       },
        //       {
        //         id: 23,
        //         nombre: 'Plátanos ecológicos (1kg)',
        //         origen: 'Málaga',
        //         precio: '2,65',
        //         imagen: 'https://www.quimicaysociedad.org/wp-content/uploads/2015/06/platano-590x295.jpg'
        //       },
        //       {
        //         id: 24,
        //         nombre: 'Plátanos ecológicos (1kg)',
        //         origen: 'Málaga',
        //         precio: '2,65',
        //         imagen: 'https://www.quimicaysociedad.org/wp-content/uploads/2015/06/platano-590x295.jpg'
        //       },
        //       {
        //         id: 25,
        //         nombre: 'Plátanos ecológicos (1kg)',
        //         origen: 'Málaga',
        //         precio: '2,65',
        //         imagen: 'https://www.quimicaysociedad.org/wp-content/uploads/2015/06/platano-590x295.jpg'
        //       },
        //       {
        //         id: 26,
        //         nombre: 'Plátanos ecológicos (1kg)',
        //         origen: 'Málaga',
        //         precio: '2,65',
        //         imagen: 'https://www.quimicaysociedad.org/wp-content/uploads/2015/06/platano-590x295.jpg'
        //       },
        //       {
        //         id: 27,
        //         nombre: 'Plátanos ecológicos (1kg)',
        //         origen: 'Málaga',
        //         precio: '2,65',
        //         imagen: 'https://www.quimicaysociedad.org/wp-content/uploads/2015/06/platano-590x295.jpg'
        //       },
        //       {
        //         id: 28,
        //         nombre: 'Plátanos ecológicos (1kg)',
        //         origen: 'Málaga',
        //         precio: '2,65',
        //         imagen: 'https://www.quimicaysociedad.org/wp-content/uploads/2015/06/platano-590x295.jpg'
        //       },
        //       {
        //         id: 29,
        //         nombre: 'Plátanos ecológicos (1kg)',
        //         origen: 'Málaga',
        //         precio: '2,65',
        //         imagen: 'https://www.quimicaysociedad.org/wp-content/uploads/2015/06/platano-590x295.jpg'
        //       },
        //     ]
        //   },
        //   { 
        //     tab: 'Despensa', 
        //     content: [
        //       {
        //         id: 30,
        //         nombre: 'Garbanzos cocidos eco',
        //         origen: 'Almería',
        //         precio: '1,99',
        //         imagen: 'https://okdiario.com/img/2017/04/21/receta-de-tortilla-de-garbanzos-1-620x349.jpg',
        //       },
        //       {
        //         id: 311,
        //         nombre: 'Garbanzos cocidos eco',
        //         origen: 'Almería',
        //         precio: '1,99',
        //         imagen: 'https://okdiario.com/img/2017/04/21/receta-de-tortilla-de-garbanzos-1-620x349.jpg',
        //       },
        //       {
        //         id: 32,
        //         nombre: 'Garbanzos cocidos eco',
        //         origen: 'Almería',
        //         precio: '1,99',
        //         imagen: 'https://okdiario.com/img/2017/04/21/receta-de-tortilla-de-garbanzos-1-620x349.jpg',
        //       },
        //       {
        //         id: 33,
        //         nombre: 'Garbanzos cocidos eco',
        //         origen: 'Almería',
        //         precio: '1,99',
        //         imagen: 'https://okdiario.com/img/2017/04/21/receta-de-tortilla-de-garbanzos-1-620x349.jpg',
        //       },
        //       {
        //         id: 34,
        //         nombre: 'Garbanzos cocidos eco',
        //         origen: 'Almería',
        //         precio: '1,99',
        //         imagen: 'https://okdiario.com/img/2017/04/21/receta-de-tortilla-de-garbanzos-1-620x349.jpg',
        //       },
        //       {
        //         id: 35,
        //         nombre: 'Garbanzos cocidos eco',
        //         origen: 'Almería',
        //         precio: '1,99',
        //         imagen: 'https://okdiario.com/img/2017/04/21/receta-de-tortilla-de-garbanzos-1-620x349.jpg',
        //       },
        //       {
        //         id: 36,
        //         nombre: 'Garbanzos cocidos eco',
        //         origen: 'Almería',
        //         precio: '1,99',
        //         imagen: 'https://okdiario.com/img/2017/04/21/receta-de-tortilla-de-garbanzos-1-620x349.jpg',
        //       },
        //       {
        //         id: 37,
        //         nombre: 'Garbanzos cocidos eco',
        //         origen: 'Almería',
        //         precio: '1,99',
        //         imagen: 'https://okdiario.com/img/2017/04/21/receta-de-tortilla-de-garbanzos-1-620x349.jpg',
        //       },
        //       {
        //         id: 38,
        //         nombre: 'Garbanzos cocidos eco',
        //         origen: 'Almería',
        //         precio: '1,99',
        //         imagen: 'https://okdiario.com/img/2017/04/21/receta-de-tortilla-de-garbanzos-1-620x349.jpg',
        //       },
        //       {
        //         id: 39,
        //         nombre: 'Garbanzos cocidos eco',
        //         origen: 'Almería',
        //         precio: '1,99',
        //         imagen: 'https://okdiario.com/img/2017/04/21/receta-de-tortilla-de-garbanzos-1-620x349.jpg',
        //       },
        //       {
        //         id: 301,
        //         nombre: 'Garbanzos cocidos eco',
        //         origen: 'Almería',
        //         precio: '1,99',
        //         imagen: 'https://okdiario.com/img/2017/04/21/receta-de-tortilla-de-garbanzos-1-620x349.jpg',
        //       },
        //     ]
        //   },
        // ],
      }
    },      
    methods: {
        updateBasket ( product ){
          this.$emit('updateBasket', product);
        }
    }, 
    mounted () {
      let items = [];   
      var positions = [];   
      this.familias.forEach(function(familia){
        if(!positions.includes('fam' + familia.codigo)){
          positions.push('fam' + familia.codigo);
        }
        let pos = positions.indexOf('fam' + familia.codigo);
        items[pos] = familia;
        items[pos]['content'] = [];
      });
      this.products.forEach(function(product){
        let pos = positions.indexOf('fam' + product.familia);
        if(pos >= 0)
          items[pos]['content'].push(product);
      });
      this.items = items;
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
