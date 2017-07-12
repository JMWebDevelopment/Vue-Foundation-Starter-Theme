<template>
    <div id="homepage" class="row">
        <div class="list-posts large-12 columns">
            <div v-for="post in posts" :key="post.id" v-bind:post="post">
                <div class="preview-post">
                    <router-link :to="{ name:'post', params: {postSlug: post.slug} }">
                        <h2 class="post-title title is-3" v-html="post.title.rendered"></h2>
                        <p class="post-excerpt" v-html="post.excerpt.rendered"></p>
                        <p><router-link :to="{ name:'post', params: {postSlug: post.slug} }" class="read-more">Read More</router-link></p>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'Homepage',
  data () {
    return {
      title: 'VueJS WordPress Theme',
      posts: []
    }
  },
  created () {
    this.getPosts()
    document.title = this.title
  },
  methods: {
    getPosts () {
      let postsUrl = vuefoundationstarter.root + 'wp/v2/posts'
      if (this.$route.query.page !== undefined) {
        postsUrl += '?page=' + this.$route.query.page
      }
      axios.get(postsUrl)
      .then(response => {
        this.posts = response.data
      })
      .catch(e => {
        console.log(e)
      })
    }
  }
}
</script>