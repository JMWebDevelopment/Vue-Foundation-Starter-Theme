<style>
</style>

<template>

    <transition name="slide-fade">

        <div class="row main" v-if="loaded ==='true'">

            <div class="large-12 medium-12 small-12 column" >

                <h2 class="title">{{searchTerm}}</h2>

                <div class="large-12 medium-12 small-12 column" v-for="post in posts" :key="post.slug">

                    <div class="rt-post">

                        <h2 class="rt-post-title"><router-link :to="{ name: 'post', params: { postSlug:post.slug }}"> {{ post.title.rendered }} </router-link> </h2>

                        <div class="rt-meta">
						<span class="posted-on">
							Posted On
							<span class="date" v-text="formatDate( post )">
							</span>
						</span>
                        </div>

                        <div class="progressive full" v-if="post.featured_image_src['full'][0]">

                            <img class="lazy" v-progressive="post.featured_image_src['full'][0]" :data-srcset="post.featured_image_src['srcset']" :src="post.featured_image_src['full'][0]" />

                        </div>

                        <div class="rt-post-excerpt rt-content" v-html="post.excerpt.rendered" > </div>

                    </div>

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
                searchTerm: this.$route.params.searchTerm,
                loaded: 'false',
                pageTitle: ''
            };
        },
        methods: {
            getPage: function() {
                const vm = this;
                vm.loaded = 'false';
                axios.get( vuefoundationstarter.root + 'wp/v2/posts/?search=' + vm.$route.params.searchTerm )
                    .then( ( res ) => {
                        vm.posts = res.data;
                        if (vm.page === undefined) {
                            vm.$router.push({name: 'NotFound'})
                        } else {
                            vm.loaded = 'true';
                            vm.pageTitle = vm.$route.params.searchTerm;
                            vm.$store.commit('themeSlugChangeTitle', vm.pageTitle);
                        }


                    } )
                    .catch( ( res ) => {
                        //console.log( `Something went wrong : ${ res }` );
                    } );
            },
            formatDate: function( value ) {
                value = value.date;
                if ( value ) {
                    const date = new Date( value );
                    const monthNames = [ "January", "February", "March",
                        "April", "May", "June", "July",
                        "August", "September", "October",
                        "November", "December" ];
                    const day = date.getDate();
                    const monthIndex = date.getMonth();
                    const year = date.getFullYear();
                    return monthNames[ monthIndex ] + ',' + day + ' ' + year;
                }
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