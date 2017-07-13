import Vue from 'vue'
import Router from 'vue-router'

import Homepage from '../components/Homepage.vue'
import Single from '../components/SinglePost.vue'
import Page from '../components/Page.vue'
import NotFound from '../components/404.vue'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'Homepage',
            component: Homepage
        },

        {
            name: 'post',
            path: '/blog/:postSlug',
            component: Single
        },

        {
            name: 'Page',
            path: '/page/:pageSlug',
            component: Page
        },

        /*{
            name: 'Category',
            path: '/c/:categorySlug',
            component: CategoryPage
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
        },*/

        {
            name: 'NotFound',
            path: '*',
            component: NotFound
        }
    ]
})