import Vue from 'vue'
import Router from 'vue-router'

import Homepage from '../components/Homepage.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Homepage',
            component: Homepage
        },

        /*{
            name: 'Category',
            path: '/c/:categorySlug',
            component: CategoryPage
        },

        {
            name: 'Page',
            path: '/page/:page-slug',
            component: Page
        },

        {
            name: 'Author',
            path: '/author/:authorId',
            component: Author
        },

        {
            name: 'Tag',
            path: '/tag/:authorId',
            component: Tag
        },

        {
            name: 'Year',
            path: '/:year/',
            component: Year
        },

        {
            name: 'Month',
            path: '/:year/:month/',
            component: Month
        },

        {
            name: 'Month',
            path: '/:year/:month/:day',
            component: Day
        },

        {
            name: 'Search',
            path: '/search/:searchTerm',
            component: Search
        },

        {
            name: 'post',
            path: '/blog/:postSlug',
            component: Single
        },

        {
            name: 'NotFound',
            path: '*',
            component: NotFoundPage
        }*/
    ]
})