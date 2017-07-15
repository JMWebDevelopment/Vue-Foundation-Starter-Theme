import Vue from 'vue';
import router from './router';
import App from './app.vue';
import Vuex from 'vuex';
import VueProgressiveImage from 'progressive-image/dist/vue';

Vue.config.productionTip = false;
Vue.use( Vuex );
Vue.use( VueProgressiveImage, {
    removePreview: true
} );

//Define vuex store
const store = new Vuex.Store( {
    state: {
        title: ''
    },
    mutations: {
        themeSlugChangeTitle( state, value ) {
            // mutate state
            state.title = value;
            document.title = ( state.title ? state.title + ' - ' : '' ) + vuefoundationstarter.site_name;
        }
    }
} );

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: { App }
})