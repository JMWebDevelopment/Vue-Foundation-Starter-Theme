<template>
    <div id="404-page" class="row">
        <h1 class="title is-1">Page not found</h1>
        <p>Whoops! You weren't supposed to land here. The post or page you're looking for isn't at this URL. Please use the search form below to look for the post or <router-link :to="{ name: 'Homepage'}">go back to the homepage</router-link>.</p>
    </div>
</template>

<script>
    export default{
    }
</script>