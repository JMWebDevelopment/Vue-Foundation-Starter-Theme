<template>
		<transition name="slide-fade">

			<div class="row main" v-if="loaded === 'true'">

				<div class="large-12 medium-12 small-12 column" >

					<div class="post" :id="post.ID">

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

						<section class="post-comments" v-if="post.comment_status == 'open'">

							<div class="reply">
								<h3 class="add-comment">Add Comment</h3>
								<div class="comment-success" v-if="commentSubmitted === true">Thank you for submitting your comment.</div>
								<form v-on:submit.prevent="saveComment" v-if="commentSubmitted === false">
									<div class="form-group" v-if="loggedIn != '1'">
										<input type="text" id="name" name="name" v-model="author_name" placeholder="Name*" required/>
									</div>
									<div class="form-group" v-if="loggedIn != '1'">
										<input type="email" name="email" id="email" v-model="author_email" placeholder="Email Address*" required />
									</div>
									<div class="form-group"  v-if="loggedIn == '1'">
										<p>Logged in as {{user.display_name}}.</p>
										<input type="hidden" id="name" name="name" v-model="author_name" placeholder="Name*" required />
										<input type="hidden" name="email" id="email" v-model="author_email" placeholder="Email Address*" required />
									</div>
									<div class="form-group">
										<textarea required id="comment-content" name="comment" v-model="content" placeholder="Your Comment..."></textarea><br/>
										<input type="hidden" name="parent" id="parent" value="0" v-model="parent" />
									</div>
									<input class="button" type="submit" value="Add Comment" />
								</form>
							</div>

							<div class="comments">
								<ul>
									<comment v-for="comment in comments" :key="comment.id" v-bind:comment="comment"></comment>
								</ul>
							</div>

						</section>
					</div>

				</div>

			</div>

		</transition>

</template>

<script>
import axios from 'axios'
import Comment from './Comment.vue'

export default {
	mounted: function() {
		this.getPost();
	},
	data() {
	    if ( vuefoundationstarter.logged_in === true ) {
	        let user_name = vuefoundationstarter.logged_in_user.data.display_name;
	        let user_email = vuefoundationstarter.logged_in_user.data.user_email;
		} else {
	        let user_name = '';
	        let user_email = '';
		}
		return {
			base_path: vuefoundationstarter.base_path,
			post: {},
			author: {},
			comments: {},
			openComment: {
                author_name: this.user_name,
                author_email: this.user_email,
                parent: 0,
                content: ''
			},
			loggedIn: vuefoundationstarter.logged_in,
			user: vuefoundationstarter.logged_in_user.data,
			commentSubmitted: false,
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
                console.log(vm.loggedIn);

                vm.comments = vm.arrangeComments( vm.post.comments );

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
		},
        getCommentById: function ( commentID, comments_list ) {
            for ( var j = 0; j < comments_list.length; j++ ) {
                if ( comments_list[j].comment_ID == commentID ) {
                    return comments_list[j];
                }
            }
        },
        getCommentDepth: function ( theComment, comments_list ) {
            var depthLevel = 0;
            while ( theComment.comment_parent > 0 ) {
                theComment = this.getCommentById( theComment.comment_parent, comments_list );
                depthLevel++;
            }
            return depthLevel;
        },
        arrangeComments: function ( commentsList ) {
            var maxDepth = 0;
			for ( var i = commentsList.length - 1; i >= 0; i-- ) {
                if ( commentsList[i].comment_approved != 1 ) {
                    commentsList.splice( i, 1 );
                }
            }
			for ( i = 0; i < commentsList.length; i += 1 ) {
                commentsList[i].comment_children = [];
                var date = commentsList[i].comment_date.split(" ").join("T").concat("Z");
                commentsList[i].comment_date = new Date(date);
                commentsList[i].comment_depth = this.getCommentDepth( commentsList[i], commentsList );
				if ( this.getCommentDepth( commentsList[i], commentsList ) > maxDepth ) {
                    maxDepth = this.getCommentDepth( commentsList[i], commentsList );
                }
            }
			for ( i = maxDepth; i > 0; i-- ) {
                for ( var j = 0; j < commentsList.length; j++ ) {
                    if ( commentsList[j].comment_depth == i ) {
                        for ( var k = 0; k < commentsList.length; k++ ) {
                            if ( commentsList[j].comment_parent == commentsList[k].comment_ID ) {
                                commentsList[k].comment_children.push( commentsList[j] )
                            }
                        }
                    }
                }
            }
			for ( i = commentsList.length - 1; i >= 0; i-- ) {
                if ( commentsList[i].comment_parent > 0 ) {
                    commentsList.splice( i, 1 );
                }
            }

            return commentsList;
        },
		saveComment: function () {
			const vm = this;
			vm.openComment = {
			    author_name: vm.author_name,
                author_email: vm.author_email,
                parent: vm.parent,
                content: vm.content,
                post: vm.post.id
			}
			const config = {
                headers: { 'Content-Type': 'application/json', 'X-WP-Nonce': vuefoundationstarter.nonce }
			};
            axios.defaults.baseURL = vuefoundationstarter.base_url;
            //axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
            console.log(axios.defaults.headers.common['Authorization']);
			axios.post( '/wp-json/wp/v2/comments', vm.openComment, config )
				.then(function () {
			    vm.openComment = {};
                vm.author_name = '';
                vm.author_email = '';
                vm.parent = '';
                vm.content = '';
                vm.commentSubmitted = true;
                jQuery('#name').val('');
                jQuery('#email').val('');
                jQuery('#comment-content').val('');
                jQuery('#parent').val(0);
			})
                .catch(function (error) {
                    console.log('not working');
                    console.log(error);
                });
		}
	},
	components: {
	    'comment': Comment
	}
};
</script>