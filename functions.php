<?php
/**
 * functions.php
 *
 * @package **Theme Name**
 * @author Jacob Martella
 * @version 1.0
 */
/**
 * Table of Contents
 * I. General Functions
 * II. Header Functions
 * III. Home Functions
 * IV. Footer Functions
 * V. Single Post Functions
 * VI. Archive Functions
 * VII. Author Functions
 * VIII. Comments Functions
 * IX. Other Functions
 */
/**
 ******************** I. General Functions *********************************
 */
/**
 * Enqueue the necessary scripts
 */
function theme_slug_scripts() {
	global $wp_styles; // Call global $wp_styles variable to add conditional wrapper around ie stylesheet the WordPress way

    $base_url  = esc_url_raw( home_url() );
    $base_path = rtrim( parse_url( $base_url, PHP_URL_PATH ), '/' );

	// Load What-Input files in footer
	wp_enqueue_script( 'what-input', get_template_directory_uri() . '/vendor/what-input/what-input.min.js', array(), '', true );

	// Adding Foundation scripts file in the footer
	wp_enqueue_script( 'foundation-js', get_template_directory_uri() . '/src/assets/js/foundation.min.js', array( 'jquery' ), '6.0', true );

	// Adding scripts file in the footer
	wp_enqueue_script( 'site-js', get_template_directory_uri() . '/dist/build.js', array( 'jquery' ), '', true );

	// Localize the build script
    wp_localize_script( 'site-js', 'vuefoundationstarter', array(
        'root'      => esc_url_raw( rest_url() ),
        'base_url'  => $base_url,
        'base_path' => $base_path ? $base_path . '/' : '/',
        'nonce'     => wp_create_nonce( 'wp_rest' ),
        'site_name' => get_bloginfo( 'name' ),
    ) );

	// Register main stylesheet
	wp_enqueue_style( 'site-css', get_template_directory_uri() . '/style.css', array(), '', 'all' );

	// Comment reply script for threaded comments
	if ( is_singular() AND comments_open() AND (get_option('thread_comments') == 1)) {
		wp_enqueue_script( 'comment-reply' );
	}
}
add_action('wp_enqueue_scripts', 'theme_slug_scripts', 999);
/**
 * Add in theme supports
 */
function theme_slug_theme_support() {

	//* Add WP Thumbnail Support
	add_theme_support( 'post-thumbnails' );

	//* Default thumbnail size
	set_post_thumbnail_size(125, 125, true);

	//* Add RSS Support
	add_theme_support( 'automatic-feed-links' );

	//* Add Support for WP Controlled Title Tag
	add_theme_support( 'title-tag' );

	//* Add HTML5 Support
	add_theme_support( 'html5',
		array(
			'comment-list',
			'comment-form',
			'search-form',
		)
	);

	//* Add the Editor Stylesheet
	add_editor_style('assets/css/editor-styles.css');

	//* Add Support for Translation
	load_theme_textdomain( 'theme-slug', get_template_directory() .'/assets/translation' );

	//* Adding post format support
	/* add_theme_support( 'post-formats',
		array(
			'aside',             // title less blurb
			'gallery',           // gallery of images
			'link',              // quick link to other site
			'image',             // an image
			'quote',             // a quick quote
			'status',            // a Facebook like status update
			'video',             // video
			'audio',             // audio
			'chat'               // chat transcript
		)
	); */
}
add_action('after_setup_theme','theme_slug_theme_support', 16);
/**
 * Include theme options
 */
require('theme-options.php');
/**
 * Include custom functions
 */
require('menu-walkers.php');
/**
 * Register Sidebar
 */
function theme_slug_register_sidebars() {
	register_sidebar(array(
			'id' => 'sidebar1',
			'name' => __('Sidebar', 'theme-slug'),
			'description' => __('The first (primary) sidebar.', 'theme-slug'),
			'before_widget' => '<div id="%1$s" class="widget %2$s">',
			'after_widget' => '</div>',
			'before_title' => '<h4 class="widgettitle">',
			'after_title' => '</h4>',
	));
}
add_action( 'widgets_init', 'theme_slug_register_sidebars' );
/**
 ******************** II. Header Functions *********************************
 */
/**
 * Register Menus
 */
register_nav_menus(
		array(
				'top-nav' => __( 'Top Menu', 'theme-slug' ),   // Main nav in header
				'main-nav' => __( 'Main Menu', 'theme-slug' ),   // Main nav in header
				'footer-links' => __( 'Footer Links', 'theme-slug' ) // Secondary nav in footer
		)
);

function theme_slug_custom_rewrite_rule() {
    global $wp_rewrite;
    $wp_rewrite->front               = $wp_rewrite->root;
    $wp_rewrite->set_permalink_structure( 'blog/%postname%/' );
    $wp_rewrite->page_structure      = $wp_rewrite->root . 'page/%pagename%/';
    $wp_rewrite->author_base         = 'author';
    $wp_rewrite->author_structure    = '/' . $wp_rewrite->author_base . '/%author%';
    $wp_rewrite->set_category_base( 'category' );
    $wp_rewrite->set_tag_base( 'tag' );
    $wp_rewrite->add_rule( '^blog$', 'index.php', 'top' );
}
add_action( 'init', 'theme_slug_custom_rewrite_rule' );

//Forcing permalink structure
add_action( 'permalink_structure_changed', 'theme_slug_forcee_perma_struct', 10, 2 );
function theme_slug_forcee_perma_struct( $old, $new ) {
    update_option( 'permalink_structure', 'blog/%postname%' );
}

// Polyfill for wp_title()
add_filter( 'wp_title','theme_slug_vue_title', 10, 3 );
function theme_slug_vue_title( $title, $sep, $seplocation ) {
    if ( false !== strpos( $title, __( 'Page not found' ) ) ) {
        $replacement = ucwords( str_replace( '/', ' ', $_SERVER['REQUEST_URI'] ) );
        $title       = str_replace( __( 'Page not found' ), $replacement, $title );
    }
    return $title;
}

// Extend rest response
add_action( 'rest_api_init', 'theme_slug_extend_rest_post_response' );
function theme_slug_extend_rest_post_response() {
    // Add featured image
    register_rest_field( 'post',
        'featured_image_src', //NAME OF THE NEW FIELD TO BE ADDED - you can call this anything
        array(
            'get_callback'    => 'theme_slug_get_image_src',
            'update_callback' => null,
            'schema'          => null,
        )
    );

    register_rest_field( 'post',
        'cat_name', //NAME OF THE NEW FIELD TO BE ADDED - you can call this anything
        array(
            'get_callback'    => 'theme_slug_get_cat_name',
            'update_callback' => null,
            'schema'          => null,
        )
    );

    register_rest_field( 'post',
        'tag_name',
        array(
            'get_callback'    => 'theme_slug_get_tag_name',
            'update_callback' => null,
            'schema'          => null,
        )
    );

    register_rest_field( 'post',
        'comments',
        array(
            'get_callback' 	  => 'theme_slug_get_comments',
            'update_callback' => null,
            'schema' 		  => null,
        ) );
}

// Get featured image
function theme_slug_get_image_src( $object, $field_name, $request ) {
    $feat_img_array['full'] = wp_get_attachment_image_src( $object['featured_media'], 'full', false );
    $feat_img_array['thumbnail'] = wp_get_attachment_image_src( $object['featured_media'], 'thumbnail', false );
    $feat_img_array['srcset'] = wp_get_attachment_image_srcset( $object['featured_media'] );
    $image = is_array( $feat_img_array ) ? $feat_img_array : 'false';
    return $image;
}

function theme_slug_get_cat_name( $object, $field_name, $request ) {
    $cats = $object['categories'];
    $res = [];
    $ob = [];
    foreach ( $cats as $x ) {
        $cat_id = (int) $x;
        $cat = get_category( $cat_id );
        if ( is_wp_error( $cat ) ) {
            $res[] = '';
        } else {
            $ob['name'] = isset( $cat->name ) ? $cat->name : '';
            $ob['id']   = isset( $cat->term_id ) ? $cat->term_id : '';
            $ob['slug'] = isset( $cat->slug ) ? $cat->slug : '';
            $res[] = $ob;
        }
    }
    return $res;
}

function theme_slug_get_tag_name( $object, $field_name, $request ) {
    $tags = $object['tags'];
    $res = [];
    $ob = [];
    foreach ( $tags as $x ) {
        $tag_id = (int) $x;
        $tag = get_tag( $tag_id );
        if ( is_wp_error( $tag ) ) {
            $res[] = '';
        } else {
            $ob['name'] = isset( $tag->name ) ? $tag->name : '';
            $ob['id'] = isset( $tag->term_id ) ? $tag->term_id : '';
            $ob['slug'] = isset( $tag->slug ) ? $tag->slug : '';
            $res[] = $ob;
        }
    }
    return $res;
}

function theme_slug_get_comments( $object, $field_name, $request ) {

    return get_comments( array( 'post_id' => $object[ 'id' ] ) );

}