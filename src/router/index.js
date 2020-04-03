import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Remember from '../views/remember.vue'
import Reset from '../views/reset.vue'
import PrevOrders from '../views/PrevOrders.vue'

Vue.use(VueRouter)

const routes = [
    // {
    //   path: '/',
    //   name: 'Login',
    //   component: Login
    // },
    {
        path: '/',
        name: 'Login',
        component: Login
    },
    {
        path: '/remember',
        name: 'Remember',
        component: Remember
    },
    {
        path: '/resetpassword',
        name: 'Reset',
        component: Reset
    },
    {
        path: '/pedido',
        name: 'Pedido',
        component: Home
    },
    {
        path: '/pedidos-anteriores',
        name: 'PrevOrders',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: PrevOrders
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
})

export default router