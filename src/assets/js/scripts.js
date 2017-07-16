jQuery(document).foundation();
/* 
These functions make sure WordPress 
and Foundation play nice together.
*/

jQuery(document).ready(function() {
    
    // Remove empty P tags created by WP inside of Accordion and Orbit
    jQuery('.accordion p:empty, .orbit p:empty').remove();
    
	 // Makes sure last grid item floats left
	jQuery('.archive-grid .columns').last().addClass( 'end' );
	
	// Adds Flex Video to YouTube and Vimeo Embeds
	jQuery('iframe[src*="youtube.com"], iframe[src*="vimeo.com"]').wrap("<div class='flex-video'/>");

	jQuery(document).on('click', '.remove-reply', function() {
        console.log('reply removed');
        jQuery( '#parent' ).val('0');
        jQuery('.add-comment').html( 'Add Comment' );
    })

});

function removeReply() {
    console.log('reply removed');
    jQuery( '#parent' ).val('0');
    jQuery('.add-comment').html( 'Add Comment' );
}