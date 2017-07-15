<template>
    <li :id="'comment-' + comment.comment_ID" :class="'comment ' + comment-comment.comment_ID + ' ' + comment.comment_parent ? 'child-comment post-parent-' + comment.comment_parent : ''">
        <header class="comment-header">
            <h4 class="comment-name">{{comment.comment_author}}</h4>
            <h5 class="comment-date">Posted at {{ comment.comment_date }} on {{ comment.comment_date }}</h5>
        </header>
        <div class="comment-content" v-html="comment.comment_content"></div>
        <footer class="reply">
            <button :id="'reply-' + comment.comment_ID" class="respond-to-comment button" onclick="">Reply</button>
        </footer>
        <ul>
            <comment v-for="comment in comment.comment_children" :key="comment.id" v-bind:comment="comment"></comment>
        </ul>
    </li>
</template>
<script>
export default {
	props: ['comment']
};
</script>