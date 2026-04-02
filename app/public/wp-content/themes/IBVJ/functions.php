<?php
function mesmerize_child_enqueue_styles() {
    wp_enqueue_style('mesmerize-parent-style', get_template_directory_uri() . '/style.css');
}
add_action('wp_enqueue_scripts', 'mesmerize_child_enqueue_styles');