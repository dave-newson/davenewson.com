/*!
 * Clean blog theme for Spress v1.0.0 (http://yosymfony.com/)
 * Copyright 2015 Victor Puertas
 * Licensed under Apache 2.0 (http://www.apache.org/licenses/LICENSE-2.0)
 */

// Tooltip Init
$(function() {
    $("[data-toggle='tooltip']").tooltip();
});

//make all images responsive
$(function() {
    $("img").addClass("img-responsive")
});

// Floating label headings for the contact form
$(function() {
    $("body").on("input propertychange", ".floating-label-form-group", function(e) {
        $(this).toggleClass("floating-label-form-group-with-value", !!$(e.target).val());
    }).on("focus", ".floating-label-form-group", function() {
        $(this).addClass("floating-label-form-group-with-focus");
    }).on("blur", ".floating-label-form-group", function() {
        $(this).removeClass("floating-label-form-group-with-focus");
    });
});

// Navigation Scripts to Show Header on Scroll-Up
jQuery(document).ready(function($) {
    var MQL = 1170;

    //primary navigation slide-in effect
    if ($(window).width() > MQL) {
        var headerHeight = $('.navbar-custom').height();
        $(window).on('scroll', {
                previousTop: 0
            },
            function() {
                var currentTop = $(window).scrollTop();
                //check if user is scrolling up
                if (currentTop < this.previousTop) {
                    //if scrolling up...
                    if (currentTop > 0 && $('.navbar-custom').hasClass('is-fixed')) {
                        $('.navbar-custom').addClass('is-visible');
                    } else {
                        $('.navbar-custom').removeClass('is-visible is-fixed');
                    }
                } else {
                    //if scrolling down...
                    $('.navbar-custom').removeClass('is-visible');
                    if (currentTop > headerHeight && !$('.navbar-custom').hasClass('is-fixed')) $('.navbar-custom').addClass('is-fixed');
                }
                this.previousTop = currentTop;
            });
    }
});

/**
 * I see you.
 */
try {
    var msg = [
        '  __| | __ ___   _____ _ __   _____      _____  ___  _ __    ___ ___  _ __ ___',
        ' / _` |/ _` \\ \\ / / _ \\ \'_ \\ / _ \\ \\ /\\ / / __|/ _ \\| \'_ \\  / __/ _ \\| \'_ ` _ \\',
        '| (_| | (_| |\\ V /  __/ | | |  __/\\ V  V /\\__ \\ (_) | | | || (_| (_) | | | | | |',
        ' \\__,_|\\__,_| \\_/ \\___|_| |_|\\___| \\_/\\_/ |___/\\___/|_| |_(_)___\\___/|_| |_| |_|',
        'Y helo thar :D?',
        ''
    ];
    console.log(msg.join("\n"));
} catch (e) {}