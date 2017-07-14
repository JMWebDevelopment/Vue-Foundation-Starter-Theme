<style>
</style>

<template>

    <transition name="slide-fade">

        <div class="row main" v-if="loaded ==='true'">

            <div class="large-12 medium-12 small-12 column" >

                <h2 class="title">{{month}} {{year}}</h2>

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
            const monthNames = [ "January", "February", "March",
                "April", "May", "June", "July",
                "August", "September", "October",
                "November", "December" ];

            return {
                page: {},
                month: monthNames[ this.$route.params.month - 1 ],
                year: this.$route.params.year,
                loaded: 'false',
                pageTitle: ''
            };
        },
        methods: {
            getPage: function() {
                const vm = this;
                vm.loaded = 'false';

                var startDate = new Date(vm.$route.params.year, vm.$route.params.month - 1, 1);

                var endDate = new Date(vm.$route.params.year, vm.$route.params.month + 1, 1);
                console.log( vuefoundationstarter.root + 'wp/v2/posts?after=' + startDate.toISOString() + '&before=' + endDate.toISOString() );

                axios.get( vuefoundationstarter.root + 'wp/v2/posts?after=' + startDate.toISOString() + '&before=' + endDate.toISOString() )
                    .then( ( res ) => {
                        vm.posts = res.data;
                        vm.loaded = 'true';
                        const monthNames = [ "January", "February", "March",
                            "April", "May", "June", "July",
                            "August", "September", "October",
                            "November", "December" ];

                        vm.pageTitle = monthNames[ vm.$route.params.month - 1 ] + ' ' + vm.$route.params.year;
                        vm.$store.commit( 'themeSlugChangeTitle', vm.pageTitle );

                        /*if (vm.page === undefined) {
                         vm.$router.push({name: 'NotFound'})
                         }*/

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