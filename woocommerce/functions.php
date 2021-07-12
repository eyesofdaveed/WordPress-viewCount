<?php
/* Include custom script file into head of the website */
function custom_script() {
    wp_register_script('view_count_script', get_stylesheet_directory_uri() . '/js/viewCount.js', array('jquery'),'1.1', true);
    wp_enqueue_script('view_count_script');
} 
add_action( 'wp_enqueue_scripts', 'custom_script', 999 ); 

/* Include custom css */
add_action( 'wp_enqueue_scripts', 'enqueue_custom_style' );
function enqueue_custom_style() {
   wp_enqueue_style( 'parent-style', get_stylesheet_directory_uri().'/style.css' );
}