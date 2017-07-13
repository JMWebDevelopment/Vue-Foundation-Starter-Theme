<style>
</style>

<template>

    <transition name="slide-fade">

        <div class="row main" v-if="loaded ==='true'">

            <div class="large-12 medium-12 small-12 column" >

                <div class="post">

                    <h2 class="post-title"> {{ page.title.rendered }}</h2>

                    <div class="post-content content" v-html="page.content.rendered"></div>


                </div>

            </div>

        </div>

    </transition>


</template>

<script>
    import axios from 'axios'

    export default {
        mounted: function() {
            this.getPage();
        },
        data() {
            return {
                page: {},
                loaded: 'false',
                pageTitle: ''
            };
        },
        methods: {
            getPage: function() {
                const vm = this;
                vm.loaded = 'false';
                axios.get( vuefoundationstarter.root + 'wp/v2/pages/?slug=' + vm.$route.params.pageSlug )
                    .then( ( res ) => {
                        vm.page = res.data[ 0 ];
                        vm.loaded = 'true';
                        vm.pageTitle = vm.page.title.rendered;
                        vm.$store.commit( 'themeSlugChangeTitle', vm.pageTitle );
                    } )
                    .catch( ( res ) => {
                        //console.log( `Something went wrong : ${ res }` );
                    } );
            }
        },
        watch: {
            '$route'( to, from ) {
                // react to route changes...
                this.getPage();
            }
        }
    };
</script>