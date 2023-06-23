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
    component: () => import('../views/home/HomeView.vue')
    },
    {
        path: '/register',
        name: 'register',
        component: () => import('../views/RegisterView.vue')
    },
    {
        path: '/relation',
        name: 'relation',
        component: () => import('../views/home/NewRelationView.vue')
    },
    {
        path: '/userinfo',
        name: 'userinfo',
        component: () => import('../views/home/UserInfoView.vue')
    },
    {
        path: '/settings',
        name: 'settings',
        component: () => import('../views/home/SettingsView.vue')
    }
]

export default createRouter({
    history: createWebHistory(),
    routes
})

