<style>
</style>

<template>

    <transition name="slide-fade">

        <div class="row main" v-if="loaded ==='true'">

            <div class="large-12 medium-12 small-12 column" >

                <h2 class="title">{{month}} {{day}}, {{year}}</h2>

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

                            <img class="lazy" :src="post.featured_image_src['full'][0]" />

                        </div>

                        <div class="rt-post-excerpt rt-content" v-html="post.excerpt.rendered" > </div>

                    </div>

                </div>

                <div class="pagination row">
                    <div v-if="page > 1" class="newer-posts large-6 medium-6 small-6 columns">
                        <router-link :to="{ name: 'Day', query: { page: this.page - 1 }} " class="pagination-previous button" v-on:click.native="previousClick">Previous</router-link>
                    </div>
                    <div v-if="page < totalPages" class="newer-posts large-6 medium-6 small-6 columns">
                        <router-link :to="{ name: 'Day', query: { page: this.page + 1 }}" class="pagination-next button" v-on:click.native="nextClick">Next</router-link>
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
            const monthNames = [ "January", "February", "March",
                "April", "May", "June", "July",
                "August", "September", "October",
                "November", "December" ];

            if ( this.$route.query.page ) {
            } else {
                this.$route.query.page = 1;
            }
            return {
                posts: {},
                day: this.$route.params.day,
                month: monthNames[ this.$route.params.month - 1 ],
                year: this.$route.params.year,
                loaded: 'false',
                pageTitle: '',
                page: this.$route.query.page,
                totalPages: ''
            };
        },
        methods: {
            isInteger: function ( input ) {
                return /^\d+$/.test( input );
            },
            getPage: function() {
                const vm = this;
                vm.loaded = 'false';

                if ( ( vm.$route.params.year.length !== 4 || vm.isInteger( vm.$route.params.year ) === false ) || ( vm.$route.params.month.length !== 2 || vm.isInteger( vm.$route.params.month ) === false ) || ( vm.$route.params.day.length !== 2 || vm.isInteger( vm.$route.params.day ) === false ) ) {
                    vm.$router.push({name: 'NotFound'})
                } else {

                    var startDate = new Date(vm.$route.params.year, vm.$route.params.month - 1, this.$route.params.day, 0, 0, 0, 0);

                    var endDate = new Date(vm.$route.params.year, vm.$route.params.month + 1, this.$route.params.day + 1, 0, 0, 0, 0);

                    if (this.$route.query.page !== undefined) {
                        vm.postsUrl = '&page=' + vm.$route.query.page;
                    } else {
                        vm.postsUrl = '';
                    }
                    axios.get( vuefoundationstarter.root + 'wp/v2/posts?after=' + startDate.toISOString() + '&before=' + endDate.toISOString() + this.postsUrl )
                        .then( ( res ) => {
                            vm.posts = res.data;
                            vm.totalPages = res.headers['x-wp-totalpages'];
                            vm.loaded = 'true';
                            const monthNames = [ "January", "February", "March",
                                "April", "May", "June", "July",
                                "August", "September", "October",
                                "November", "December" ];

                            vm.pageTitle = monthNames[ vm.$route.params.month - 1 ] + ' ' + vm.$route.params.year + ', ' + vm.$route.params.year;
                            vm.$store.commit( 'themeSlugChangeTitle', vm.pageTitle );

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
            },
            previousClick () {
                this.page = this.page - 1;
                this.getCatId(this.$route.params.categorySlug);
                window.scrollTo(0, 0);
            },
            nextClick () {
                this.page = this.page + 1;
                this.getCatId(this.$route.params.categorySlug);
                window.scrollTo(0, 0);
            },
        },
        watch: {
            '$route'( to, from ) {
                // react to route changes...
                this.getPage();
            }
        }
    };
</script>