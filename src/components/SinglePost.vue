<template>
		<transition name="slide-fade">

			<div class="row main" v-if="loaded === 'true'">

				<div class="large-12 medium-12 small-12 column" >

					<div class="post">

						<h2 class="post-title"> {{ post.title.rendered }}</h2>

						<h3 class="subtitle" v-if="author">
                                                Written by <router-link :to="{ name:'Author', params: {authorId: author.id} }">{{ author.name }}</router-link>
                                            </h3>

						<div class="progressive full">

							<img class="lazy"
								v-progressive="post.featured_image_src['full'][0]"
								:data-srcset="post.featured_image_src['srcset']"
								:src="post.featured_image_src['full'][0]"
							/>
						</div>

						<div class="post-content rt-content" v-html="post.content.rendered" ></div>

						<div class="cat-list">
							<router-link v-for="x in post.cat_name" :to="{ name: 'Category', params: { categorySlug:x.slug } }" :key="x.id"> {{ x.name }} </router-link>
						</div>

						<div class="tag-list">
							<router-link v-for="x in post.tag_name" :to="{ name: 'Tag', params: { tagSlug:x.slug } }" :key="x.id"> {{ x.name }} </router-link>
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
		this.getPost();
	},
	data() {
		return {
			base_path: vuefoundationstarter.base_path,
			post: {},
			author: {},
			loaded: 'false',
			pageTitle: ''
		};
	},
	methods: {
		getPost: function() {
			const vm = this;
			axios.get( vuefoundationstarter.root + 'wp/v2/posts/?slug=' + vm.$route.params.postSlug )
			.then( ( res ) => {
				vm.post = res.data[ 0 ];

                if (vm.post === undefined) {
                    vm.$router.push({name: 'NotFound'})
                }

				vm.loaded = 'true';

                if (vm.post === undefined) {
                    vm.$router.push({name: 'NotFound'})
                }

				vm.pageTitle = vm.post.title.rendered;

				vm.$store.commit( 'themeSlugChangeTitle', vm.pageTitle );

				axios.get(vuefoundationstarter.root + 'wp/v2/users/' + vm.post.author)
                      .then(response => {
                        this.author = response.data
                      })
			} )
			.catch( ( res ) => {
				//console.log( `Something went wrong : ${res}` );
			} );
		}
	}
};
</script>