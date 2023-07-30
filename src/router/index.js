import {createRouter, createWebHistory} from 'vue-router'
import LoginView from '../views/LoginView.vue'

const routes = [
    {
    path: '/login',
    name: 'login',
    component: LoginView
    },
    {
    path: '/home',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */'../views/home/HomeView.vue')
    },
    {
        path: '/register',
        name: 'register',
        component: () => import(/* webpackChunkName: "register" */'../views/RegisterView.vue')
    },
    {
        path: '/relation',
        name: 'relation',
        component: () => import(/* webpackChunkName: "relation" */'../views/home/NewRelationView.vue')
    },
    {
        path: '/userinfo',
        name: 'userinfo',
        component: () => import(/* webpackChunkName: "userinfo" */'../views/home/UserInfoView.vue')
    },
    {
        path: '/change_password',
        name: 'change_password',
        component: () => import(/* webpackChunkName: "change_password" */'../views/home/ChangePasswordView.vue')
    }
]

const router =  createRouter({
    history: createWebHistory(),
    routes
})
export default router

