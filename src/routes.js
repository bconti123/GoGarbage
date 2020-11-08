import Vue from 'vue'
import VueRouter from 'vue-router'
import Garbage from './components/Garbage'
import Trash from './components/Trash-site'
import AppCreate from './components/AppCreate'

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'Home',
        component: Garbage
    },
    {
        path: '/trash',
        name: 'Trash',
        component: Trash
    },
    {
        path: '/create',
        name: 'Create',
        component: AppCreate
    }
]

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router;