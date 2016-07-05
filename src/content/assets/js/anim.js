/**
 * Silly animation stuff that's nice but totally unnecessary.
 */
$(function () {

    var leaveController = new ScrollMagic.Controller({
        globalSceneOptions: {
            triggerHook: 'onLeave'
        }
    });

    var enterController = new ScrollMagic.Controller({
        globalSceneOptions: {
            triggerHook: 'onEnter'
        }
    });

    // Animate for 200px on header scroll
    var headerScene = new ScrollMagic.Scene({triggerElement: "header", duration: 200})
        // Enlarge the divider bar in the header
        .setTween(".site-heading hr", {minWidth: "75%"})
        .addTo(leaveController);

    // Animate footer icons into position (bottom-up pop)
    var footerSocialScene = new ScrollMagic.Scene({triggerElement: "footer li", reverse: false})
        .setTween(TweenMax.staggerFromTo("footer .social li", 0.5, {position:'relative', opacity:0, top:'80'}, { ease: Back.easeOut, 'top':0, 'opacity': 1}, 0.15))
        .addTo(enterController);

    // Animate copyright fade-in
    var footerPoweredByScene = new ScrollMagic.Scene({triggerElement:"footer .copyright", reverse: false})
        .setTween(TweenMax.fromTo("footer .copyright", 8, {'opacity': 0}, {'opacity': 1}))
        .addTo(enterController);

});