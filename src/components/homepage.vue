<template>
    <div id="homepage">
        <h2 class="title is-2">Latest Posts</h2>

        <search></search>

        <list-posts v-bind:posts="posts"></list-posts>
    </div>
</template>

<script>
import axios from 'axios'
import ListPosts from '../global/ListPosts.vue'
import Search from '../forms/Search.vue'
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
      let postsUrl = process.env.API_URL + '/wp-json/wp/v2/posts'
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
  },
  components: {
    'list-posts': ListPosts,
    Search
  }
}
</script>