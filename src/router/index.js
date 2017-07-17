import Vue from 'vue'
import Router from 'vue-router'

import Homepage from '../components/Homepage.vue'
import Single from '../components/SinglePost.vue'
import Page from '../components/Page.vue'
import CategoryPage from '../components/Category.vue'
import Tag from '../components/Tag.vue'
import Author from '../components/Author.vue'
import Year from '../components/Year.vue'
import Month from '../components/Month.vue'
import Day from '../components/Day.vue'
import Search from '../components/Search.vue'
import NotFoundPage from '../components/404.vue'

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
            name: 'Category',
            path: '/category/:categorySlug',
            component: CategoryPage
        },

        {
            name: 'Page',
            path: '/page/:pageSlug',
            component: Page
        },

        {
            name: 'Author',
            path: '/author/:authorId',
            component: Author
        },

        {
            name: 'Search',
            path: '/search/:searchTerm',
            component: Search
        },

        {
            name: 'Tag',
            path: '/tag/:tagSlug',
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
            name: 'Day',
            path: '/:year/:month/:day',
            component: Day
        },

        {
            name: 'NotFound',
            path: '*',
            component: NotFoundPage
        }
    ]
})