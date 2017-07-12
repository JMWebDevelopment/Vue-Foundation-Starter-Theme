<?php
/**
 * Index.php
 *
 * @package ***Theme Name***
 * @author  Jacob Martella
 * @version  1.0
 */
?>
<?php get_header(); ?>

    <div id="content" class="site-content" style="display:none">

        <?php
        if ( have_posts() ) {
            if ( is_home() && ! is_front_page() ) {
                echo '<h1>' . single_post_title( '', false ) . '</h1>';
            }
            while ( have_posts() ) {
                the_post();
                if ( is_singular() ) {
                    the_title( '<h1>', '</h1>' );
                } else {
                    the_title( '<h2><a href="' . esc_url( get_permalink() ) . '">', '</a></h2>' );
                }
                the_content();
            }
        }
        ?>

    </div>

    <div id="app"></div>

<?php get_footer(); ?>