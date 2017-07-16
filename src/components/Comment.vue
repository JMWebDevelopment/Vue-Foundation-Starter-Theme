<template>
    <li :id="'comment-' + comment.comment_ID" :class="'comment ' + comment-comment.comment_ID + ' ' + comment.comment_parent ? 'child-comment post-parent-' + comment.comment_parent : ''">
        <header class="comment-header">
            <h4 class="comment-name">{{comment.comment_author}}</h4>
            <h5 class="comment-date">Posted at {{ comment.comment_date }} on {{ comment.comment_date }}</h5>
        </header>
        <div class="comment-content" v-html="comment.comment_content"></div>
        <footer class="reply">
            <button :id="'reply-' + comment.comment_ID" class="respond-to-comment button" v-on:click="addReply">Reply</button>
        </footer>
        <ul>
            <comment v-for="comment in comment.comment_children" :key="comment.id" v-bind:comment="comment"></comment>
        </ul>
    </li>
</template>
<script>
export default {
    name: 'comment',
	props: ['comment'],
    methods: {
        addReply: function() {
            console.log(this.comment.comment_ID);
            jQuery( '#parent' ).val( this.comment.comment_ID );
            jQuery('.add-comment').html( 'Replying to ' + this.comment.comment_author + '  <span class="remove-reply">' + 'Remove reply' + '</span>' );
            jQuery('html, body').animate({
                scrollTop: jQuery(".post-comments").offset().top
            }, 500);
        }
    }
};
</script>