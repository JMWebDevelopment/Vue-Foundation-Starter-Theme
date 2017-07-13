<template>
    <div class="post">
        <section class="hero">
            <div class="hero-body row">
                <div class="container large-12 columns">
                    <h1 class="title is-1" v-html="post.title.rendered"></h1>
                    <h2 class="subtitle" v-if="author">Written by <router-link :to="{ name:'Author', params: {authorId: author.id} }">{{ author.name }}</router-link></h2>
                </div>
            </div>
        </section>

        <div class="content-area row">
            <section class="content-container large-12 columns" v-html="post.content.rendered"></section>
        </div>
    </div>
</template>

<script>
import axios from 'axios'

export default{
  name: 'Single',
  data () {
    return {
      title: '',
      post: [],
      author: []
    }
  },
  created () {
    this.getPost()
  },
  methods: {
    getPost () {
      const vm = this;
      var path = this.$route.path
      axios.get(vuefoundationstarter.root + 'wp/v2/posts/?slug=' + this.$route.params.postSlug, '')
      .then(response => {
        this.post = response.data[0]
        if (this.post === undefined) {
          //this.$router.push({name: 'NotFound'})
        }
        // Get author
        this.getAuthor()
        // Set document title
        //document.title = this.post.title.rendered
        //vm.$store.commit( 'themeSlugChangeTitle', document.title );
      })
      .catch(e => {
        console.log(e)
      })
    },
    getAuthor () {
      axios.get(vuefoundationstarter.root + 'wp/v2/users/' + this.post.author)
      .then(response => {
        this.author = response.data
      })
    }
  }
}
</script>