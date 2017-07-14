<template>
    <div id="404-page" class="row">
        <h1 class="title is-1">Page not found</h1>
        <p>Whoops! You aren't supposed to be here. The post or page you're looking for either no longer exists or has been moved. You can use the search form below or <router-link :to="{ name: 'Homepage'}">go back to the home page</router-link> to find what you're looking for.</p>
        <input class="input not-found-search" type="text" placeholder="Search for keywords" v-model="term" v-on:keyup="searchPosts">
        <div class="large-12 medium-12 small-12 column" v-for="post in posts" :key="post.slug">
            <div class="rt-post">
                <h2 class="rt-post-title"><router-link :to="{ name: 'post', params: { postSlug:post.slug }}"> {{ post.title.rendered }} </router-link> </h2>
                <div class="rt-meta">
                    <span class="posted-on">
                        Posted On <span class="date" v-text="formatDate( post )"></span>
                    </span>
                </div>
                <div class="progressive full" v-if="post.featured_image_src['full'][0]">
                    <img class="lazy" v-progressive="post.featured_image_src['full'][0]" :data-srcset="post.featured_image_src['srcset']" :src="post.featured_image_src['full'][0]" />
                </div>
                <div class="rt-post-excerpt rt-content" v-html="post.excerpt.rendered" > </div>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios'

    export default{
        data () {
            return {
                posts: {},
                loaded: false
            }
        },
        methods: {
            searchPosts () {
                if (this.term !== '') {
                    const vm = this;
                    vm.loaded = false;
                    console.log('pressed');
                    axios.get( vuefoundationstarter.root + 'wp/v2/posts/?search=' + vm.term )
                        .then( ( res ) => {
                            this.posts = res.data;
                            this.loaded = true;
                            console.log(vm.posts);
                            /*if (vm.page === undefined) {
                             vm.$router.push({name: 'NotFound'})
                             }*/

                        } )
                        .catch( ( res ) => {
                            //console.log( `Something went wrong : ${ res }` );
                        } );
                }
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
        }
    }
</script>