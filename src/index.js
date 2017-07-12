import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import { HTTP as axios } from './assets/axios/axios';
import VueProgressiveImage from 'progressive-image/dist/vue';

Vue.prototype.$http = axios;

Vue.use( Vuex );
Vue.use( VueRouter );
Vue.use( VueProgressiveImage, {
    removePreview: true
} );

Vue.config.debug = true;
Vue.config.devTools = true;