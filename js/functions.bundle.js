var $;
"undefined" != typeof jQuery && ($ = jQuery.noConflict()),
    function(e, t) {
        "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).SEMICOLON = t()
    }(this, function() {
        "use strict";
        var l = {
                pageTransition: !1,
                cursor: !1,
                tips: !1,
                headerSticky: !0,
                headerMobileSticky: !1,
                menuBreakpoint: 992,
                pageMenuBreakpoint: 992,
                gmapAPI: "AIzaSyAO2BYvn4xyrdisvP8feA4AS_PGZFxJDp4",
                scrollOffset: 60,
                scrollExternalLinks: !0,
                smoothScroll: !1,
                jsFolder: "js/",
                cssFolder: "css/"
            },
            c = ("undefined" != typeof cnvsOptions && (l = Object.assign({}, l, cnvsOptions)), {
                baseEl: document,
                elRoot: document.documentElement,
                elHead: document.head,
                elBody: document.body,
                viewport: {
                    width: 0,
                    height: 0
                },
                hash: window.location.hash,
                topScrollOffset: 0,
                elWrapper: document.getElementById("wrapper"),
                elHeader: document.getElementById("header"),
                headerClasses: "",
                elHeaderWrap: document.getElementById("header-wrap"),
                headerWrapClasses: "",
                headerHeight: 0,
                headerOffset: 0,
                headerWrapHeight: 0,
                headerWrapOffset: 0,
                elPrimaryMenus: document.querySelectorAll(".primary-menu"),
                elPrimaryMenuTriggers: document.querySelectorAll(".primary-menu-trigger"),
                elPageMenu: document.getElementById("page-menu"),
                pageMenuOffset: 0,
                elSlider: document.getElementById("slider"),
                elFooter: document.getElementById("footer"),
                elAppMenu: document.querySelector(".app-menu"),
                portfolioAjax: {},
                sliderParallax: {
                    el: document.querySelector(".slider-parallax"),
                    caption: document.querySelector(".slider-parallax .slider-caption"),
                    inner: document.querySelector(".slider-inner"),
                    offset: 0
                },
                get menuBreakpoint() {
                    return this.elBody.getAttribute("data-menu-breakpoint") || l.menuBreakpoint
                },
                get pageMenuBreakpoint() {
                    return this.elBody.getAttribute("data-pagemenu-breakpoint") || l.pageMenuBreakpoint
                },
                get customCursor() {
                    var e = this.elBody.getAttribute("data-custom-cursor") || l.cursor;
                    return "true" == e || !0 === e
                },
                get pageTransition() {
                    var e = this.elBody.classList.contains("page-transition") || l.pageTransition;
                    return "true" == e || !0 === e
                },
                get tips() {
                    var e = this.elBody.getAttribute("data-tips") || l.tips;
                    return "true" == e || !0 === e
                },
                get smoothScroll() {
                    var e = this.elBody.getAttribute("data-smooth-scroll") || l.smoothScroll;
                    return "true" == e || !0 === e
                },
                get isRTL() {
                    return "rtl" == this.elRoot.getAttribute("dir")
                },
                scrollPos: {
                    x: 0,
                    y: 0
                },
                $jq: "undefined" != typeof jQuery ? jQuery.noConflict() : "",
                resizers: {},
                recalls: {},
                debounced: !1,
                events: {},
                modules: {},
                fn: {},
                required: {
                    jQuery: {
                        plugin: "jquery",
                        fn: function() {
                            return "undefined" != typeof jQuery
                        },
                        file: l.jsFolder + "jquery.js",
                        id: "canvas-jquery"
                    }
                },
                fnInit: function() {
                    r.init(), s.init(), n.init()
                }
            }),
            o = {
                getOptions: l,
                getVars: c,
                run: function(e) {
                    Object.values(e).map(function(e) {
                        return "function" == typeof e && e.call()
                    })
                },
                runBase: function() {
                    o.run(e)
                },
                runModules: function() {
                    o.run(t)
                },
                runContainerModules: function(e) {
                    if (void 0 === e) return !1;
                    o.getVars.baseEl = e, o.runModules(), o.getVars.baseEl = document
                },
                breakpoints: function() {
                    var t = o.viewport().width,
                        a = {
                            xxl: {
                                enter: 1400,
                                exit: 99999
                            },
                            xl: {
                                enter: 1200,
                                exit: 1399
                            },
                            lg: {
                                enter: 992,
                                exit: 1199.98
                            },
                            md: {
                                enter: 768,
                                exit: 991.98
                            },
                            sm: {
                                enter: 576,
                                exit: 767.98
                            },
                            xs: {
                                enter: 0,
                                exit: 575.98
                            }
                        },
                        i = "";
                    Object.keys(a).forEach(function(e) {
                        t > a[e].enter && t <= a[e].exit ? c.elBody.classList.add("device-" + e) : (c.elBody.classList.remove("device-" + e), "" != i && c.elBody.classList.remove("device-down-" + i)), t <= a[e].exit && "" != i && c.elBody.classList.add("device-down-" + i), t > a[i = e].enter ? c.elBody.classList.add("device-up-" + e) : c.elBody.classList.remove("device-up-" + e)
                    })
                },
                colorScheme: function() {
                    c.elBody.classList.contains("adaptive-color-scheme") && (window.matchMedia("(prefers-color-scheme: dark)").matches ? c.elBody.classList.add("dark") : c.elBody.classList.remove("dark"));
                    var e = o.cookie.get("__cnvs_body_color_scheme");
                    e && "" != e && (e.split(" ").includes("dark") ? c.elBody.classList.add("dark") : c.elBody.classList.remove("dark"))
                },
                throttle: function(e, t, a) {
                    e = e || setTimeout(function() {
                        t(), e = void 0
                    }, a)
                },
                debounce: function(e, t) {
                    clearTimeout(c.debounced), c.debounced = setTimeout(e, t)
                },
                debouncedResize: function(a, i) {
                    var n;
                    return function() {
                        var e = this,
                            t = arguments;
                        clearTimeout(n), n = setTimeout(function() {
                            a.apply(e, t)
                        }, i)
                    }
                },
                addEvent: function(e, t, a = {}) {
                    void 0 !== e && void 0 !== t && (a = new CustomEvent(t, {
                        detail: a
                    }), e.dispatchEvent(a), c.events[t] = !0)
                },
                scrollEnd: function(e, t = 199) {
                    e && "function" == typeof e && window.addEventListener("scroll", function() {
                        o.debounce(e, t)
                    }, {
                        passive: !0
                    })
                },
                viewport: function() {
                    var e = {
                        width: window.innerWidth || c.elRoot.clientWidth,
                        height: window.innerHeight || c.elRoot.clientHeight
                    };
                    return c.viewport = e, document.documentElement.style.setProperty("--cnvs-viewport-width", e.width), document.documentElement.style.setProperty("--cnvs-viewport-height", e.height), document.documentElement.style.setProperty("--cnvs-body-height", c.elBody.clientHeight), e
                },
                isElement: function(e) {
                    return "object" == typeof e && null !== e || e instanceof Element || e instanceof HTMLElement || void 0 !== (e = void 0 !== e.jquery ? e[0] : e).nodeType
                },
                getSelector: function(e, t = !0, a = !0) {
                    return t ? (e = o.getVars.baseEl !== document ? jQuery(o.getVars.baseEl).find(e) : jQuery(e), a && (e = "string" == typeof a ? e.filter(":not(" + a + ")") : e.filter(":not(.customjs)"))) : o.isElement(e) || (e = a ? "string" == typeof a ? o.getVars.baseEl.querySelectorAll(e + ":not(" + a + ")") : o.getVars.baseEl.querySelectorAll(e + ":not(.customjs)") : o.getVars.baseEl.querySelectorAll(e)), e
                },
                onResize: function(e, t = 333) {
                    e && "function" == typeof e && window.addEventListener("resize", function() {
                        o.debounce(e, t)
                    })
                },
                imagesLoaded: function(e) {
                    async function t() {
                        ++n === i && o.addEvent(e, "CanvasImagesLoaded")
                    }
                    var a = e.getElementsByTagName("img") || document.images,
                        i = a.length,
                        n = 0;
                    i < 1 && o.addEvent(e, "CanvasImagesLoaded");
                    [].forEach.call(a, function(e) {
                        e.complete ? t() : e.addEventListener("load", t, !1)
                    })
                },
                contains: function(e, t) {
                    var e = e.split(" "),
                        a = !1;
                    return e.forEach(function(e) {
                        c.elBody.classList.contains(e) && (a = !0)
                    }), a
                },
                has: function(e, t) {
                    return [].slice.call(e) ? .filter(function(e) {
                        return e.querySelector(t)
                    })
                },
                filtered: function(e, t) {
                    return [].slice.call(e) ? .filter(function(e) {
                        return e.matches(t)
                    })
                },
                parents: function(e, t) {
                    Element.prototype.matches || (Element.prototype.matches = Element.prototype.matchesSelector || Element.prototype.mozMatchesSelector || Element.prototype.msMatchesSelector || Element.prototype.oMatchesSelector || Element.prototype.webkitMatchesSelector || function(e) {
                        for (var t = (this.document || this.ownerDocument).querySelectorAll(e), a = t.length; 0 <= --a && t.item(a) !== this;);
                        return -1 < a
                    });
                    for (var a = []; e && e !== document; e = e.parentNode)(!t || e.matches(t)) && a.push(e);
                    return a
                },
                siblings: function(t, e = !1) {
                    return e ? [].slice.call(e).filter(function(e) {
                        return e !== t
                    }) : [].slice.call(t.parentNode.children).filter(function(e) {
                        return e !== t
                    })
                },
                getNext: function(e, t) {
                    e = e.nextElementSibling;
                    return !t || e && e.matches(t) ? e : null
                },
                offset: function(e) {
                    var e = e.getBoundingClientRect(),
                        t = window.scrollX || document.documentElement.scrollLeft,
                        a = window.scrollY || document.documentElement.scrollTop;
                    return {
                        top: e.top + a,
                        left: e.left + t
                    }
                },
                isHidden: function(e) {
                    return null === e.offsetParent
                },
                classesFn: function(t, e, a) {
                    e.split(" ").forEach(function(e) {
                        "add" == t ? a.classList.add(e) : "toggle" == t ? a.classList.toggle(e) : a.classList.remove(e)
                    })
                },
                cookie: {
                    set: function(e, t, a) {
                        var i = new Date,
                            a = (i.setTime(i.getTime() + 24 * a * 60 * 60 * 1e3), "expires=" + i.toUTCString());
                        document.cookie = e + "=" + t + ";" + a + ";path=/"
                    },
                    get: function(t) {
                        var a = decodeURIComponent(document.cookie).split(";");
                        for (let e = 0; e < a.length; e++) {
                            var i = a[e].trim();
                            if (i.startsWith(t + "=")) return i.substring(t.length + 1)
                        }
                        return null
                    },
                    remove: function(e) {
                        document.cookie = e + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
                    }
                },
                scrollTo: function(e = 0, t = 1250, a, i = "smooth") {
                    var n, r, s;
                    a && "undefined" != typeof jQuery && void 0 !== jQuery.easing.easeOutQuad ? jQuery("body,html").stop(!0).animate({
                        scrollTop: Number(e)
                    }, Number(t), a) : (t = "scrollBehavior" in document.documentElement.style, "function" == typeof window.scroll && t ? window.scroll({
                        top: Number(e),
                        behavior: i
                    }) : (n = o.getVars.elBody, r = o.getVars.elRoot, n.scrollIntoView(), r.scrollIntoView(), (s = function() {
                        (n.scrollTop > Number(e) || r.scrollTop > Number(e)) && (n.scrollTop -= 20, r.scrollTop -= 20, setTimeout(s, 10))
                    })()))
                },
                smoothScroll: function() {
                    function e(e) {
                        e.preventDefault();
                        e = (e = e).detail ? e.wheelDelta ? e.wheelDelta / e.detail / 40 * (0 < e.detail ? 1 : -1) : -e.detail / 3 : e.wheelDelta / 120;
                        s += -e * i, s = Math.max(0, Math.min(s, a.scrollHeight - o.clientHeight)), r || t()
                    }

                    function t() {
                        r = !0;
                        var e = (s - a.scrollTop) / n;
                        a.scrollTop += e, .5 < Math.abs(e) ? l(t) : r = !1
                    }
                    var a, i, n, r, s, o, l;
                    a = document, i = 90, n = 5, a === document && (a = document.scrollingElement || document.documentElement || document.body.parentNode || document.body), r = !1, s = a.scrollTop, o = a === document.body && document.documentElement ? document.documentElement : a, a.addEventListener("mousewheel", e, {
                        passive: !1
                    }), a.addEventListener("DOMMouseScroll", e, {
                        passive: !1
                    }), l = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function(e) {
                        window.setTimeout(e, 20)
                    }
                },
                loadCSS: function(e) {
                    var t, a = e.file,
                        i = e.id || !1,
                        e = e.cssFolder || !1;
                    return !!a && !(i && document.getElementById(i) || ((t = document.createElement("link")).id = i, t.href = e ? l.cssFolder + a : a, t.rel = "stylesheet", t.type = "text/css", c.elHead.appendChild(t), 0))
                },
                loadJS: function(e) {
                    var t = e.file,
                        a = e.id || !1,
                        i = e.type || !1,
                        n = e.callback,
                        r = e.async || !0,
                        s = e.defer || !0,
                        e = e.jsFolder || !1;
                    if (!t) return !1;
                    if (a && document.getElementById(a)) return !1;
                    var o = document.createElement("script");
                    if (void 0 !== n) {
                        if ("function" != typeof n) throw new Error("Not a valid callback!");
                        o.onload = n
                    }
                    return o.id = a, o.src = e ? l.jsFolder + t : t, i && (o.type = i), o.async = !!r, o.defer = !!s, c.elBody.appendChild(o), !0
                },
                isFuncTrue: async function(i) {
                    var n;
                    return "function" == typeof i && (n = 0, new Promise(function(e, t) {
                        var a;
                        i() ? e(!0) : a = setInterval(function() {
                            i() ? (clearInterval(a), e(!0)) : 30 < n && (clearInterval(a), t(!0)), n++
                        }, 333)
                    }).catch(function(e) {
                        console.log("Function does not exist: " + i)
                    }))
                },
                initFunction: function(e) {
                    c.elBody.classList.add(e.class), o.addEvent(window, e.event), c.events[e.event] = !0
                },
                topScrollOffset: function() {
                    var e = 0,
                        t = c.elPageMenu ? .querySelector("#page-menu-wrap") ? .offsetHeight || 0;
                    c.elBody.classList.contains("is-expanded-menu") && (c.elHeader ? .classList.contains("sticky-header") && (e = c.elHeaderWrap.offsetHeight), !c.elPageMenu ? .classList.contains("dots-menu") && c.elPageMenu ? .classList.contains("sticky-page-menu") || (t = 0)), o.getVars.topScrollOffset = e + t + l.scrollOffset
                }
            },
            e = {
                init: function() {
                    a.any() && c.elBody.classList.add("device-touch")
                },
                menuBreakpoint: function() {
                    o.getVars.menuBreakpoint <= o.viewport().width ? c.elBody.classList.add("is-expanded-menu") : c.elBody.classList.remove("is-expanded-menu"), c.elPageMenu && (void 0 === o.getVars.pageMenuBreakpoint && (o.getVars.pageMenuBreakpoint = o.getVars.menuBreakpoint), o.getVars.pageMenuBreakpoint <= o.viewport().width ? c.elBody.classList.add("is-expanded-pagemenu") : c.elBody.classList.remove("is-expanded-pagemenu"))
                },
                goToTop: function() {
                    CNVS.GoToTop.init("#gotoTop")
                },
                stickFooterOnSmall: function() {
                    CNVS.StickFooterOnSmall && CNVS.StickFooterOnSmall.init("#footer")
                },
                logo: function() {
                    CNVS.Logo.init("#logo")
                },
                headers: function() {
                    o.getVars.headerClasses = c.elHeader ? .className || "", o.getVars.headerWrapClasses = c.elHeaderWrap ? .className || "", CNVS.Headers.init("#header")
                },
                menus: function() {
                    CNVS.Menus.init("#header")
                },
                pageMenu: function() {
                    CNVS.PageMenu && CNVS.PageMenu.init("#page-menu")
                },
                sliderDimensions: function() {
                    CNVS.SliderDimensions && CNVS.SliderDimensions.init(".slider-element")
                },
                sliderMenuClass: function() {
                    CNVS.SliderMenuClass && CNVS.SliderMenuClass.init(".transparent-header + .swiper_wrapper,.swiper_wrapper + .transparent-header,.transparent-header + .revslider-wrap,.revslider-wrap + .transparent-header")
                },
                topSearch: function() {
                    CNVS.TopSearch.init("#top-search-trigger")
                },
                topCart: function() {
                    CNVS.TopCart.init("#top-cart")
                },
                sidePanel: function() {
                    CNVS.SidePanel && CNVS.SidePanel.init("#side-panel")
                },
                adaptiveColorScheme: function() {
                    CNVS.AdaptiveColorScheme && CNVS.AdaptiveColorScheme.init(".adaptive-color-scheme")
                },
                portfolioAjax: function() {
                    CNVS.PortfolioAjax && CNVS.PortfolioAjax.init(".portfolio-ajax")
                },
                cursor: function() {
                    c.customCursor && CNVS.Cursor && CNVS.Cursor.init("body")
                },
                setBSTheme: function() {
                    c.elBody.classList.contains("dark") ? document.querySelector("html").setAttribute("data-bs-theme", "dark") : (document.querySelector("html").removeAttribute("data-bs-theme"), document.querySelectorAll(".dark") ? .forEach(function(e) {
                        e.setAttribute("data-bs-theme", "dark")
                    })), c.elBody.querySelectorAll(".not-dark") ? .forEach(function(e) {
                        e.setAttribute("data-bs-theme", "light")
                    })
                }
            },
            t = {
                bootstrap: function() {
                    var t = !0;
                    document.querySelectorAll("*").forEach(function(e) {
                        t && e.getAttributeNames().some(function(e) {
                            if (e.includes("data-bs")) return t = !1, CNVS.Bootstrap && CNVS.Bootstrap.init("body"), !0
                        })
                    })
                },
                resizeVideos: function(e) {
                    CNVS.ResizeVideos && CNVS.ResizeVideos.init(e || 'iframe[src*="youtube"],iframe[src*="vimeo"],iframe[src*="dailymotion"],iframe[src*="maps.google.com"],iframe[src*="google.com/maps"]')
                },
                pageTransition: function() {
                    c.pageTransition && CNVS.PageTransition && CNVS.PageTransition.init("body")
                },
                lazyLoad: function(e) {
                    CNVS.LazyLoad && CNVS.LazyLoad.init(e || ".lazy:not(.lazy-loaded)")
                },
                dataClasses: function() {
                    CNVS.DataClasses && CNVS.DataClasses.init("[data-class]")
                },
                dataHeights: function() {
                    CNVS.DataHeights && CNVS.DataHeights.init("[data-height-xxl],[data-height-xl],[data-height-lg],[data-height-md],[data-height-sm],[data-height-xs]")
                },
                lightbox: function(e) {
                    CNVS.Lightbox && CNVS.Lightbox.init(e || "[data-lightbox]")
                },
                modal: function(e) {
                    CNVS.Modal && CNVS.Modal.init(e || ".modal-on-load")
                },
                animations: function(e) {
                    CNVS.Animations && CNVS.Animations.init(e || "[data-animate]")
                },
                hoverAnimations: function(e) {
                    CNVS.HoverAnimations && CNVS.HoverAnimations.init(e || "[data-hover-animate]")
                },
                gridInit: function(e) {
                    CNVS.Grid && CNVS.Grid.init(e || ".grid-container")
                },
                filterInit: function(e) {
                    CNVS.Filter && CNVS.Filter.init(e || ".grid-filter,.custom-filter")
                },
                canvasSlider: function(e) {
                    CNVS.CanvasSlider && CNVS.CanvasSlider.init(e || ".swiper_wrapper")
                },
                sliderParallax: function() {
                    CNVS.SliderParallax && CNVS.SliderParallax.init(".slider-parallax")
                },
                flexSlider: function(e) {
                    CNVS.FlexSlider && CNVS.FlexSlider.init(e || ".fslider")
                },
                html5Video: function(e) {
                    CNVS.FullVideo && CNVS.FullVideo.init(e || ".video-wrap")
                },
                youtubeBgVideo: function(e) {
                    CNVS.YoutubeBG && CNVS.YoutubeBG.init(e || ".yt-bg-player")
                },
                toggle: function(e) {
                    CNVS.Toggle && CNVS.Toggle.init(e || ".toggle")
                },
                accordion: function(e) {
                    CNVS.Accordion && CNVS.Accordion.init(e || ".accordion")
                },
                counter: function(e) {
                    CNVS.Counter && CNVS.Counter.init(e || ".counter")
                },
                countdown: function(e) {
                    CNVS.Countdown && CNVS.Countdown.init(e || ".countdown")
                },
                gmap: function(e) {
                    CNVS.GoogleMaps && CNVS.GoogleMaps.init(e || ".gmap")
                },
                roundedSkills: function(e) {
                    CNVS.RoundedSkills && CNVS.RoundedSkills.init(e || ".rounded-skill")
                },
                progress: function(e) {
                    CNVS.Progress && CNVS.Progress.init(e || ".skill-progress")
                },
                twitterFeed: function(e) {
                    CNVS.Twitter && CNVS.Twitter.init(e || ".twitter-feed")
                },
                flickrFeed: function(e) {
                    CNVS.Flickr && CNVS.Flickr.init(e || ".flickr-feed")
                },
                instagram: function(e) {
                    CNVS.Instagram && CNVS.Instagram.init(e || ".instagram-photos")
                },
                navTree: function(e) {
                    CNVS.NavTree && CNVS.NavTree.init(e || ".nav-tree")
                },
                carousel: function(e) {
                    CNVS.Carousel && CNVS.Carousel.init(e || ".carousel-widget")
                },
                masonryThumbs: function(e) {
                    CNVS.MasonryThumbs && CNVS.MasonryThumbs.init(e || ".masonry-thumbs")
                },
                notifications: function(e) {
                    CNVS.Notifications && CNVS.Notifications.init(e || !1)
                },
                textRotator: function(e) {
                    CNVS.TextRotator && CNVS.TextRotator.init(e || ".text-rotater")
                },
                onePage: function(e) {
                    CNVS.OnePage && CNVS.OnePage.init(e || "[data-scrollto],.one-page-menu")
                },
                ajaxForm: function(e) {
                    CNVS.AjaxForm && CNVS.AjaxForm.init(e || ".form-widget")
                },
                subscribe: function(e) {
                    CNVS.Subscribe && CNVS.Subscribe.init(e || ".subscribe-widget")
                },
                conditional: function(e) {
                    CNVS.Conditional && CNVS.Conditional.init(e || ".form-group[data-condition],.form-group[data-conditions]")
                },
                shapeDivider: function(e) {
                    CNVS.ShapeDivider && CNVS.ShapeDivider.init(e || ".shape-divider")
                },
                stickySidebar: function(e) {
                    CNVS.StickySidebar && CNVS.StickySidebar.init(e || ".sticky-sidebar-wrap")
                },
                cookies: function(e) {
                    CNVS.Cookies && CNVS.Cookies.init(e || ".gdpr-settings,[data-cookies]")
                },
                quantity: function(e) {
                    CNVS.Quantity && CNVS.Quantity.init(e || ".quantity")
                },
                readmore: function(e) {
                    CNVS.ReadMore && CNVS.ReadMore.init(e || "[data-readmore]")
                },
                pricingSwitcher: function(e) {
                    CNVS.PricingSwitcher && CNVS.PricingSwitcher.init(e || ".pricing-tenure-switcher")
                },
                ajaxButton: function(e) {
                    CNVS.AjaxButton && CNVS.AjaxButton.init(e || "[data-ajax-loader]")
                },
                videoFacade: function(e) {
                    CNVS.VideoFacade && CNVS.VideoFacade.init(e || ".video-facade")
                },
                schemeToggle: function(e) {
                    CNVS.SchemeToggle && CNVS.SchemeToggle.init(e || ".body-scheme-toggle")
                },
                clipboardCopy: function(e) {
                    CNVS.Clipboard && CNVS.Clipboard.init(e || ".clipboard-copy")
                },
                codeHighlight: function(e) {
                    CNVS.CodeHighlight && CNVS.CodeHighlight.init(e || ".code-highlight")
                },
                tips: function() {
                    c.tips && CNVS.Tips && CNVS.Tips.init("body")
                },
                textSplitter: function(e) {
                    CNVS.TextSplitter && CNVS.TextSplitter.init(e || ".text-splitter")
                },
                mediaActions: function(e) {
                    CNVS.MediaActions && CNVS.MediaActions.init(e || ".media-wrap")
                },
                viewportDetect: function(e) {
                    CNVS.ViewportDetect && CNVS.ViewportDetect.init(e || ".viewport-detect")
                },
                scrollDetect: function(e) {
                    CNVS.ScrollDetect && CNVS.ScrollDetect.init(e || ".scroll-detect")
                },
                fontSizer: function(e) {
                    CNVS.FontSizer && CNVS.FontSizer.init(e || ".font-sizer")
                },
                hover3D: function(e) {
                    CNVS.Hover3D && CNVS.Hover3D.init(e || ".hover-3d")
                },
                buttons: function(e) {
                    CNVS.Buttons && CNVS.Buttons.init(e || ".button-text-effect")
                },
                bsComponents: function(e) {
                    CNVS.BSComponents && CNVS.BSComponents.init(e || '[data-bs-toggle="tooltip"],[data-bs-toggle="popover"],[data-bs-toggle="tab"],[data-bs-toggle="pill"],.style-msg')
                }
            },
            a = {
                Android: function() {
                    return navigator.userAgent.match(/Android/i)
                },
                BlackBerry: function() {
                    return navigator.userAgent.match(/BlackBerry/i)
                },
                iOS: function() {
                    return navigator.userAgent.match(/iPhone|iPad|iPod/i)
                },
                Opera: function() {
                    return navigator.userAgent.match(/Opera Mini/i)
                },
                Windows: function() {
                    return navigator.userAgent.match(/IEMobile/i)
                },
                any: function() {
                    return a.Android() || a.BlackBerry() || a.iOS() || a.Opera() || a.Windows()
                }
            },
            i = {
                onReady: function() {
                    function e() {
                        dataLayer.push(arguments)
                    }
                    fetch("switcher-html.html").then(e => e.text()).then(e => {
                        var t = document.createElement("div");
                        t.classList.add("cnvs-switcher-container"), t.innerHTML = e, c.elBody.appendChild(t), o.runContainerModules(t), o.loadJS({
                            file: "js/cnvsswitcher.js",
                            id: "cnvs-switcher-js"
                        })
                    }).catch(e => {
                        console.log(e), console.log("Switcher Error!")
                    }), o.loadJS({
                        file: "https://www.googletagmanager.com/gtag/js?id=G-HH0J5CE3B7",
                        id: "canvas-gtag-js"
                    }), window.dataLayer = window.dataLayer || [], e("js", new Date), e("config", "G-HH0J5CE3B7")
                },
                onLoad: function() {},
                onResize: function() {}
            },
            n = {
                init: function() {
                    o.viewport(), o.breakpoints(), e.menuBreakpoint(), o.run(c.resizers), i.onResize(), o.addEvent(window, "cnvsResize")
                }
            },
            r = {
                init: function() {
                    o.breakpoints(), o.colorScheme(), o.runBase(), o.runModules(), o.topScrollOffset(), c.smoothScroll && new o.smoothScroll, r.windowscroll(), i.onReady()
                },
                windowscroll: function() {
                    o.scrollEnd(function() {
                        e.pageMenu()
                    })
                }
            },
            s = {
                init: function() {
                    i.onLoad()
                }
            },
            d = (document.addEventListener("DOMContentLoaded", function() {
                r.init()
            }), window.addEventListener("load", function() {
                s.init()
            }), o.debouncedResize(function() {
                n.init()
            }, 250));
        return window.addEventListener("resize", function() {
            d()
        }), {
            Core: o,
            Base: e,
            Modules: t,
            Mobile: a,
            Custom: i
        }
    }),
    function(e, t) {
        "object" == typeof exports && "undefined" != typeof module ? module.exports = t() : "function" == typeof define && define.amd ? define(t) : (e = "undefined" != typeof globalThis ? globalThis : e || self).CNVS = t()
    }(this, function() {
        "use strict";
        var N, T, S, t, g, s, o, a, i, l, r, c, d, n, u, p, f, h, m, v, y, b, w, L;
        return "undefined" !== SEMICOLON && "undefined" !== SEMICOLON.Core && "undefined" !== SEMICOLON.Base && "undefined" !== SEMICOLON.Modules && "undefined" !== SEMICOLON.Mobile && (N = SEMICOLON.Core, T = SEMICOLON.Base, S = SEMICOLON.Modules, t = SEMICOLON.Mobile, {
            Logo: {
                init: function(e) {
                    if ((e = N.getSelector(e, !1)).length < 1) return !0;
                    var t, a, i = N.getVars.elHead;
                    e[0].querySelector(".logo-dark") && (t = document.createElement("style"), i.appendChild(t), a = '.dark #header-wrap:not(.not-dark) #logo [class^="logo-"], .dark .header-row:not(.not-dark) #logo [class^="logo-"] { display: none; } .dark #header-wrap:not(.not-dark) #logo .logo-dark, .dark .header-row:not(.not-dark) #logo .logo-dark { display: flex; }', t.appendChild(document.createTextNode(a))), e[0].querySelector(".logo-sticky") && (t = document.createElement("style"), i.appendChild(t), a = '.sticky-header #logo [class^="logo-"] { display: none !important; } .sticky-header #logo .logo-sticky { display: flex !important; }', t.appendChild(document.createTextNode(a))), e[0].querySelector(".logo-sticky-shrink") && (t = document.createElement("style"), i.appendChild(t), a = '.sticky-header-shrink #logo [class^="logo-"] { display: none; } .sticky-header-shrink #logo .logo-sticky-shrink { display: flex; }', t.appendChild(document.createTextNode(a))), e[0].querySelector(".logo-mobile") && (t = document.createElement("style"), i.appendChild(t), a = 'body:not(.is-expanded-menu) #logo [class^="logo-"] { display: none; } body:not(.is-expanded-menu) #logo .logo-mobile { display: flex; }', t.appendChild(document.createTextNode(a)))
                }
            },
            GoToTop: {
                init: function(e) {
                    if ((e = N.getSelector(e, !1)).length < 1) return !0;
                    var t, a, i;
                    t = e[0], a = t.getAttribute("data-speed") || 700, i = t.getAttribute("data-easing"), t.onclick = function(e) {
                        N.scrollTo(0, Number(a), i), e.preventDefault()
                    }, re(e[0]), window.addEventListener("scroll", function() {
                        re(e[0])
                    }, {
                        passive: !0
                    })
                }
            },
            StickFooterOnSmall: {
                init: function(e) {
                    if ((e = N.getSelector(e, !1)).length < 1) return !0;
                    N.getVars.elFooter.style.marginTop = "";
                    var e = N.viewport().height,
                        t = N.getVars.elWrapper.offsetHeight;
                    !N.getVars.elBody.classList.contains("sticky-footer") && "undefined" !== N.getVars.elFooter && N.getVars.elWrapper.contains(N.getVars.elFooter) && t < e && (N.getVars.elFooter.style.marginTop = e - t + "px"), N.getVars.elAppMenu && N.viewport().height - (N.getVars.elAppMenu.getBoundingClientRect().top + N.getVars.elAppMenu.getBoundingClientRect().height) == 0 && (N.getVars.elFooter.style.marginBottom = N.getVars.elAppMenu.offsetHeight + "px"), N.getVars.resizers.stickfooter = function() {
                        T.stickFooterOnSmall()
                    }
                }
            },
            Headers: {
                init: function(e) {
                    if ((e = N.getSelector(e, !1)).length < 1) return !0;
                    var e = N.getVars.elHeader,
                        t = !e.classList.contains("no-sticky"),
                        a = e.querySelector(".header-wrap-clone");
                    N.getVars.stickyHeaderClasses = e.getAttribute("data-sticky-class"), N.getVars.mobileHeaderClasses = e.getAttribute("data-responsive-class"), N.getVars.stickyShrink = e.getAttribute("data-sticky-shrink") || "true", N.getVars.stickyShrinkOffset = e.getAttribute("data-sticky-shrink-offset") || 300, N.getVars.mobileSticky = e.getAttribute("data-mobile-sticky") || "false", N.getVars.headerHeight = e.offsetHeight, a || ((a = document.createElement("div")).classList = "header-wrap-clone", N.getVars.elHeaderWrap ? .parentNode.insertBefore(a, N.getVars.elHeaderWrap ? .nextSibling), a = e.querySelector(".header-wrap-clone")), t && (setTimeout(function() {
                        ae(), B(N.getVars.headerWrapOffset), P("sticky")
                    }, 500), window.addEventListener("scroll", function() {
                        B(N.getVars.headerWrapOffset)
                    }, {
                        passive: !0
                    })), P("responsive"), ne(), (e = document.getElementById("header-trigger")) && (e.onclick = function(e) {
                        e.preventDefault(), N.getVars.elBody.classList.contains("open-header") && N.getVars.elBody.classList.toggle("side-header-open")
                    }), N.getVars.resizers.headers = function() {
                        setTimeout(function() {
                            ie(), t && (ae(), B(N.getVars.headerWrapOffset), P("sticky")), P("responsive"), ne()
                        }, 250)
                    }
                }
            },
            Menus: (w = function(e) {
                var i, e = e || document.querySelectorAll(".mega-menu-content, .sub-menu-container, .top-links-section");
                if (e.length < 1) return !1;
                e.forEach(function(e) {
                    i = e.closest(".header-row") ? .querySelectorAll(".primary-menu"), e.classList.remove("menu-pos-invert");
                    e.querySelectorAll(":scope > *").forEach(function(e) {
                        e.style.display = "block"
                    }), e.style.display = "block";
                    var t, a = e.getBoundingClientRect();
                    e.closest(".mega-menu-small") && (t = N.viewport().width - (a.left + a.width)) < 0 && (e.style.left = t + "px"), N.getVars.elBody.classList.contains("rtl") && a.left < 0 && e.classList.add("menu-pos-invert"), N.viewport().width - (a.left + a.width) < 0 && e.classList.add("menu-pos-invert")
                }), e.forEach(function(e) {
                    e.querySelectorAll(":scope > *").forEach(function(e) {
                        e.style.display = ""
                    }), e.style.display = ""
                }), i ? .forEach(function(e) {
                    e.classList.add("primary-menu-init")
                })
            }, L = function(e, t, a, i, n) {
                e.closest(".menu-container").querySelectorAll(i).forEach(function(e) {
                    e.classList.remove("icon-rotate-90")
                });
                var r, s, o, l, c = e.closest(t).querySelector(":scope > " + a),
                    d = e.closest(t).querySelectorAll(a);
                "d-none" == n ? c.classList.contains("d-none") ? c.classList.remove("d-none") : d.forEach(function(e) {
                    e.classList.add("d-none")
                }) : c.classList.contains("d-block") ? d.forEach(function(e) {
                    e.classList.remove("d-block")
                }) : c.classList.add("d-block"), n = e, r = t, s = a, o = i, [].slice.call(n.closest(".menu-container").querySelectorAll(r)).forEach(function(e) {
                    e.classList.remove("current")
                }), (l = function(e, t, a) {
                    N.isHidden(e.closest(t).querySelector(":scope > " + a)) ? (e.closest(t).classList.remove("current"), e.closest(t).querySelector(":scope > " + o) ? .classList.remove("icon-rotate-90")) : (e.closest(t).classList.add("current"), e.closest(t).querySelector(":scope > " + o) ? .classList.add("icon-rotate-90"))
                })(n, r, s), N.parents(n, r).forEach(function(e) {
                    l(e, r, s)
                })
            }, {
                init: function(e) {
                    if ((e = N.getSelector(e, !1)).length < 1) return !0;
                    N.getVars.headerWrapHeight = N.getVars.elHeaderWrap ? .offsetHeight, t = [].slice.call(N.getVars.elPrimaryMenus).filter(function(e) {
                            return e.matches(".on-click")
                        }), a = document.querySelectorAll(".top-links.on-click"), i = [], t.forEach(function(e) {
                            i.push(e.querySelector(".current"))
                        }), n = [], a.forEach(function(e) {
                            n.push(e.querySelector(".current"))
                        }), document.addEventListener("click", function(e) {
                            e.target.closest(".primary-menu-trigger") || e.target.closest(".primary-menu") || (j(), z()), e.target.closest(".primary-menu.on-click") || (t.forEach(function(e) {
                                e.querySelectorAll(".menu-item").forEach(function(e) {
                                    e.classList.remove("current")
                                })
                            }), i ? .forEach(function(e) {
                                e ? .classList.add("current")
                            })), e.target.closest(".top-links.on-click") || (a.forEach(function(e) {
                                e.querySelectorAll(".top-links-sub-menu,.top-links-section").forEach(function(e) {
                                    e.classList.remove("d-block")
                                })
                            }), a.forEach(function(e) {
                                e.querySelectorAll(".top-links-item").forEach(function(e) {
                                    e.classList.remove("current")
                                })
                            }), n ? .forEach(function(e) {
                                e ? .classList.add("current")
                            }))
                        }, !1), document.querySelectorAll(".menu-item").forEach(function(e) {
                            var t;
                            0 < e.querySelectorAll(".sub-menu-container").length && e.classList.add("sub-menu"), !e.classList.contains("mega-menu-title") && 0 < e.querySelectorAll(".sub-menu-container").length && e.querySelectorAll(".sub-menu-trigger").length < 1 && ((t = document.createElement("button")).classList = "sub-menu-trigger fa-solid fa-chevron-right", t.innerHTML = '<span class="visually-hidden">Open Sub-Menu</span>', e.append(t))
                        }), j(), document.querySelectorAll(".mega-menu-content, .sub-menu-container").forEach(function(e) {
                            e.querySelectorAll(".menu-item").forEach(function(e) {
                                e = e.querySelector(".menu-link");
                                e ? .querySelector("i") && e.querySelector("span") ? .classList.add("menu-subtitle-icon-offset")
                            })
                        }), te(), w(),
                        function() {
                            if (!N.getVars.elBody.classList.contains("is-expanded-menu")) return;
                            var a = getComputedStyle(N.getVars.elHeader).getPropertyValue("--cnvs-primary-menu-submenu-display-speed") || 666;
                            isNaN(a.split("ms")[0]) ? isNaN(a.split("s")[0]) || (a = 1e3 * a.split("s")[0]) : a = a.split("ms")[0], [].slice.call(N.getVars.elPrimaryMenus).filter(function(e) {
                                return !e.matches(".on-click")
                            }).forEach(function(e) {
                                e.querySelectorAll(".sub-menu").forEach(function(e) {
                                    var t;
                                    e.addEventListener("mouseenter", function() {
                                        clearTimeout(t), e.classList.add("menu-item-hover"), w(e.querySelectorAll(".mega-menu-content, .sub-menu-container"))
                                    }), e.addEventListener("mouseleave", function() {
                                        t = setTimeout(function() {
                                            e.classList.remove("menu-item-hover")
                                        }, Number(a))
                                    })
                                })
                            })
                        }(), z(), r = N.getVars.elBody.classList, document.querySelectorAll(".primary-menu-trigger").forEach(function(a) {
                            a.onclick = function(e) {
                                e.preventDefault();
                                var t = a.getAttribute("data-target") || "*";
                                N.filtered(N.getVars.elPrimaryMenus, t).length < 1 || (r.contains("is-expanded-menu") || N.getVars.elPrimaryMenus.forEach(function(e) {
                                    0 < e.querySelectorAll(".mobile-primary-menu").length ? e.matches(t) && e.querySelectorAll(".mobile-primary-menu").forEach(function(e) {
                                        e.classList.toggle("d-block")
                                    }) : e.matches(t) && e.querySelectorAll(".menu-container").forEach(function(e) {
                                        e.classList.toggle("d-block")
                                    })
                                }), a.classList.toggle("primary-menu-trigger-active"), N.getVars.elPrimaryMenus.forEach(function(e) {
                                    e.matches(t) && e.classList.toggle("primary-menu-active")
                                }), r.toggle("primary-menu-open"), "*" != t ? r.toggle("primary-menu-open-" + t.replace(/[^a-zA-Z0-9-]/g, "")) : r.toggle("primary-menu-open-all"))
                            }
                        }),
                        function() {
                            if (!N.getVars.elBody.classList.contains("is-expanded-menu")) return document.querySelectorAll(".mega-menu-content, .top-search-form").forEach(function(e) {
                                e.style.width = ""
                            });
                            var t, a = document.querySelector(".mega-menu:not(.mega-menu-full):not(.mega-menu-small) .mega-menu-content") ? .closest(".header-row").offsetWidth;
                            0 < N.getVars.elHeader.querySelectorAll(".container-fullwidth").length && document.querySelectorAll(".mega-menu:not(.mega-menu-full):not(.mega-menu-small) .mega-menu-content").forEach(function(e) {
                                e.style.width = a + "px"
                            }), document.querySelectorAll(".mega-menu:not(.mega-menu-full):not(.mega-menu-small) .mega-menu-content, .top-search-form").forEach(function(e) {
                                e.style.width = a + "px"
                            }), N.getVars.elHeader.classList.contains("full-header") && document.querySelectorAll(".mega-menu:not(.mega-menu-full):not(.mega-menu-small) .mega-menu-content").forEach(function(e) {
                                e.style.width = a + "px"
                            }), N.getVars.elHeader.classList.contains("floating-header") && (t = getComputedStyle(document.querySelector("#header")).getPropertyValue("--cnvs-header-floating-padding"), document.querySelectorAll(".mega-menu:not(.mega-menu-full):not(.mega-menu-small) .mega-menu-content").forEach(function(e) {
                                e.style.width = a + 2 * Number(t.split("px")[0]) + "px"
                            }))
                        }();
                    var t, a, i, n, r, s = N.viewport().width;
                    N.getVars.resizers.menus = function() {
                        s != N.viewport().width && T.menus()
                    }, N.getVars.recalls.menureset = function() {
                        j(), z()
                    }
                }
            }),
            PageMenu: {
                init: function(e) {
                    var t, a, i;
                    return (e = N.getSelector(e, !1)).length < 1 || (e = (t = N.getVars.elPageMenu).querySelector("#page-menu-wrap"), (a = t.querySelector(".page-menu-wrap-clone")) || ((a = document.createElement("div")).classList = "page-menu-wrap-clone", e.parentNode.insertBefore(a, e.nextSibling), a = t.querySelector(".page-menu-wrap-clone")), a.style.height = t.querySelector("#page-menu-wrap").offsetHeight + "px", t.querySelector("#page-menu-trigger").onclick = function(e) {
                        e.preventDefault(), N.getVars.elBody.classList.remove("top-search-open"), t.classList.toggle("page-menu-open")
                    }, t.querySelector("nav").onclick = function(e) {
                        N.getVars.elBody.classList.remove("top-search-open"), document.getElementById("top-cart").classList.remove("top-cart-open")
                    }, document.addEventListener("click", function(e) {
                        e.target.closest("#page-menu") || t.classList.remove("page-menu-open")
                    }, !1), !(!t.classList.contains("no-sticky") && !t.classList.contains("dots-menu"))) || (i = (N.getVars.elHeader.classList.contains("no-sticky") || "false" == N.getVars.elHeader.getAttribute("data-sticky-shrink") ? getComputedStyle(N.getVars.elHeader).getPropertyValue("--cnvs-header-height") : getComputedStyle(N.getVars.elHeader).getPropertyValue("--cnvs-header-height-shrink")).split("px")[0], "false" == N.getVars.elHeader.getAttribute("data-sticky-shrink") && t.style.setProperty("--cnvs-page-submenu-sticky-offset", i + "px"), setTimeout(function() {
                        N.getVars.pageMenuOffset = N.offset(t).top - i, q(N.getVars.pageMenuOffset)
                    }, 500), window.addEventListener("scroll", function() {
                        q(N.getVars.pageMenuOffset)
                    }, {
                        passive: !0
                    }), void(N.getVars.resizers.pagemenu = function() {
                        setTimeout(function() {
                            N.getVars.pageMenuOffset = N.offset(t).top - i, q(N.getVars.pageMenuOffset)
                        }, 250)
                    }))
                }
            },
            SliderDimensions: {
                init: function(e) {
                    if ((e = N.getSelector(e, !1)).length < 1) return !0;
                    var t = document.querySelector(".slider-element"),
                        e = document.querySelector(".slider-parallax"),
                        a = N.getVars.elBody,
                        i = e ? .offsetHeight,
                        n = e ? .offsetWidth,
                        r = e ? .querySelector(".slider-inner"),
                        s = t.querySelector(".swiper-wrapper"),
                        o = t.querySelector(".swiper-slide"),
                        l = t.classList.contains("h-auto") || t.classList.contains("min-vh-0");
                    a.classList.contains("device-up-lg") ? (setTimeout(function() {
                        r && (r.style.height = i + "px"), l && (i = t.querySelector(".slider-inner") ? .querySelector("*").offsetHeight, t.style.height = i + "px", r) && (r.style.height = i + "px")
                    }, 500), l && o && (o = (o = o.querySelector("*")).classList.contains("container") || o.classList.contains("container-fluid") ? o.querySelector("*") : o).offsetHeight > s.offsetHeight && (s.style.height = "auto"), a.classList.contains("side-header") && r && (r.style.width = n + "px"), a.classList.contains("stretched") || (n = N.getVars.elWrapper.offsetWidth, r && (r.style.width = n + "px"))) : (s && (s.style.height = ""), e && (e.style.height = ""), r && (r.style.width = "", r.style.height = "")), N.getVars.resizers.sliderdimensions = function() {
                        T.sliderDimensions()
                    }
                }
            },
            SliderMenuClass: {
                init: function(e) {
                    return (e = N.getSelector(e, !1)).length < 1 || !N.getVars.elBody.classList.contains("is-expanded-menu") || (!N.getVars.elHeader.classList.contains("ignore-slider") && (N.getVars.elBody.classList.contains("is-expanded-menu") || N.getVars.elHeader.classList.contains("transparent-header-responsive") && !N.getVars.elBody.classList.contains("primary-menu-open")) && (e = N.getVars.elSlider.querySelector(".swiper-slide-active"), ee(e)), !N.getVars.elHeader.classList.contains("ignore-slider") && (N.getVars.elBody.classList.contains("is-expanded-menu") || N.getVars.elHeader.classList.contains("transparent-header-responsive") && !N.getVars.elBody.classList.contains("primary-menu-open")) && (e = N.getVars.elSlider.querySelector(".active-revslide"), ee(e)), T.setBSTheme(), void(N.getVars.resizers.slidermenuclass = function() {
                        T.sliderMenuClass()
                    }))
                }
            },
            TopSearch: {
                init: function(e) {
                    if ((e = N.getSelector(e, !1)).length < 1) return !0;
                    var t = document.querySelector(".top-search-form");
                    if (!t) return !0;
                    t.closest(".header-row") ? .classList.add("top-search-parent");
                    var a, i = document.querySelector(".top-search-parent");
                    e[0].onclick = function(e) {
                        e.stopPropagation(), e.preventDefault(), clearTimeout(a), N.getVars.elBody.classList.toggle("top-search-open"), document.getElementById("top-cart") ? .classList.remove("top-cart-open"), N.getVars.recalls.menureset(), N.getVars.elBody.classList.contains("top-search-open") ? i ? .classList.add("position-relative") : a = setTimeout(function() {
                            i ? .classList.remove("position-relative")
                        }, 500), N.getVars.elBody.classList.remove("primary-menu-open"), N.getVars.elPageMenu && N.getVars.elPageMenu.classList.remove("page-menu-open"), N.getVars.elBody.classList.contains("top-search-open") && t.querySelector("input").focus()
                    }, document.addEventListener("click", function(e) {
                        e.target.closest(".top-search-form") || (N.getVars.elBody.classList.remove("top-search-open"), a = setTimeout(function() {
                            i ? .classList.remove("position-relative")
                        }, 500))
                    }, !1)
                }
            },
            TopCart: {
                init: function(t) {
                    return (t = N.getSelector(t, !1)).length < 1 || !!document.getElementById("top-cart-trigger") && (document.getElementById("top-cart-trigger").onclick = function(e) {
                        e.stopPropagation(), e.preventDefault(), t[0].classList.toggle("top-cart-open")
                    }, void document.addEventListener("click", function(e) {
                        e.target.closest("#top-cart") || t[0].classList.remove("top-cart-open")
                    }, !1))
                }
            },
            SidePanel: {
                init: function(e) {
                    if ((e = N.getSelector(e, !1)).length < 1) return !0;
                    var t = N.getVars.elBody.classList;
                    document.addEventListener("click", function(e) {
                        e.target.closest("#side-panel") || e.target.closest(".side-panel-trigger") || t.remove("side-panel-open")
                    }, !1), document.querySelectorAll(".side-panel-trigger").forEach(function(e) {
                        e.onclick = function(e) {
                            e.preventDefault(), t.toggle("side-panel-open"), t.contains("device-touch") && t.contains("side-push-panel") && t.toggle("ohidden")
                        }
                    })
                }
            },
            AdaptiveColorScheme: {
                init: function(e) {
                    var t, a, i, n;
                    return N.getSelector(e, !1, !1).length < 1 || (N.initFunction({
                        class: "has-plugin-adaptivecolorscheme",
                        event: "pluginAdaptiveColorSchemeReady"
                    }), (e = N.getSelector(e, !1)).length < 1) || (t = document.querySelector("[data-adaptive-light-class],[data-adaptive-dark-class]"), N.getVars.elBody.contains(t) && (a = t.getAttribute("data-adaptive-light-class"), i = t.getAttribute("data-adaptive-dark-class")), n = function(e) {
                        e ? N.getVars.elBody.classList.add("dark") : N.getVars.elBody.classList.remove("dark"), N.getVars.elBody.contains(t) && (e ? (t.classList.remove(a), t.classList.add(i)) : (t.classList.remove(i), t.classList.add(a))), T.setBSTheme()
                    }, void(window.matchMedia && (n(window.matchMedia("(prefers-color-scheme: dark)").matches), window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function(e) {
                        n(e.matches)
                    }))))
                }
            },
            PortfolioAjax: (m = function(e) {
                var t, a = Z(e),
                    e = K(e),
                    i = document.getElementById("portfolio-navigation");
                !document.getElementById("prev-portfolio") && e && ((t = document.createElement("a")).setAttribute("href", "#"), t.setAttribute("id", "prev-portfolio"), t.setAttribute("data-id", e), t.innerHTML = '<i class="bi-arrow-left"></i>', t) && i ? .insertBefore(t, document.getElementById("close-portfolio")), !document.getElementById("next-portfolio") && a && ((e = document.createElement("a")).setAttribute("href", "#"), e.setAttribute("id", "next-portfolio"), e.setAttribute("data-id", a), e.innerHTML = '<i class="bi-arrow-right"></i>', e) && i ? .insertBefore(e, document.getElementById("close-portfolio"))
            }, v = function(a, e, t) {
                t = t || !1;
                var i = Z(a),
                    n = K(a);
                0 == t && (y(), N.getVars.elBody.classList.add("portfolio-ajax-loading"), t = document.getElementById(a).getAttribute("data-loader"), fetch(t).then(function(e) {
                    return e.text()
                }).then(function(e) {
                    N.getVars.portfolioAjax.container.innerHTML = e;
                    var e = document.getElementById("next-portfolio"),
                        t = document.getElementById("prev-portfolio");
                    (e ? .classList.add("d-none"), t ? .classList.add("d-none"), i && (e ? .setAttribute("data-id", i), e ? .classList.remove("d-none")), n && (t ? .setAttribute("data-id", n), t ? .classList.remove("d-none")), e = a, N.getVars.portfolioAjax.prevItem = document.getElementById(e), m(e), document.querySelectorAll("#next-portfolio, #prev-portfolio").forEach(function(t) {
                        t.onclick = function(e) {
                            e.preventDefault(), y();
                            e = t.getAttribute("data-id");
                            document.getElementById(e).classList.add("portfolio-active"), v(e, N.getVars.portfolioAjax.prevItem)
                        }
                    }), document.getElementById("close-portfolio").onclick = function(e) {
                        e.preventDefault(), y()
                    }, N.getVars.portfolioAjax.container.querySelectorAll("img").length < 1) ? b(): (N.imagesLoaded(N.getVars.portfolioAjax.container), N.getVars.portfolioAjax.container.addEventListener("CanvasImagesLoaded", function() {
                        b()
                    }));
                    N.getVars.portfolioAjax.items.forEach(function(e) {
                        e.classList.remove("portfolio-active")
                    }), document.getElementById(a).classList.add("portfolio-active")
                }).catch(function(e) {
                    console.warn("Something went wrong.", e)
                }))
            }, y = function() {
                N.getVars.portfolioAjax.wrapper && 32 < N.getVars.portfolioAjax.wrapper.offsetHeight && (N.getVars.elBody.classList.remove("portfolio-ajax-loading"), N.getVars.portfolioAjax.wrapper.classList.remove("portfolio-ajax-opened"), N.getVars.portfolioAjax.wrapper.querySelector("#portfolio-ajax-single").addEventListener("transitionend", function() {
                    N.getVars.portfolioAjax.wrapper.querySelector("#portfolio-ajax-single").remove()
                }), N.getVars.portfolioAjax.items.forEach(function(e) {
                    e.classList.remove("portfolio-active")
                }))
            }, b = function() {
                N.getVars.portfolioAjax.container.style.display = "block", N.getVars.portfolioAjax.wrapper.classList.add("portfolio-ajax-opened"), N.getVars.elBody.classList.remove("portfolio-ajax-loading"), setTimeout(function() {
                    N.runContainerModules(N.getVars.portfolioAjax.wrapper), N.scrollTo(N.getVars.portfolioAjax.wrapperOffset - N.getVars.topScrollOffset - 60, !1, !1)
                }, 500)
            }, {
                init: function(e) {
                    return N.getSelector(e, !1, !1).length < 1 || (N.initFunction({
                        class: "has-plugin-ajaxportfolio",
                        event: "pluginAjaxPortfolioReady"
                    }), (e = N.getSelector(e, !1)).length < 1) || (N.getVars.portfolioAjax.items = e[0].querySelectorAll(".portfolio-item"), N.getVars.portfolioAjax.wrapper = document.getElementById("portfolio-ajax-wrap"), N.getVars.portfolioAjax.wrapperOffset = N.offset(N.getVars.portfolioAjax.wrapper).top, N.getVars.portfolioAjax.container = document.getElementById("portfolio-ajax-container"), N.getVars.portfolioAjax.loader = document.getElementById("portfolio-ajax-loader"), N.getVars.portfolioAjax.prevItem = "", void e[0].querySelectorAll(".portfolio-ajax-trigger").forEach(function(e) {
                        e.querySelector("i:nth-child(2)") || (e.innerHTML += '<i class="bi-arrow-repeat icon-spin"></i>'), e.onclick = function(e) {
                            e.preventDefault();
                            var t = e.target.closest(".portfolio-item").getAttribute("id");
                            e.target.closest(".portfolio-item").classList.contains("portfolio-active") || v(t, N.getVars.portfolioAjax.prevItem)
                        }
                    }))
                }
            }),
            Cursor: {
                init: function(e) {
                    N.initFunction({
                        class: "has-plugin-cursor",
                        event: "pluginCursorReady"
                    });

                    function t(e, t) {
                        var a = document.createElement("div");
                        return a.classList.add(e.split(".")[1]), t.prepend(a), document.querySelector(e)
                    }
                    var a = document.querySelector(".cnvs-cursor"),
                        i = document.querySelector(".cnvs-cursor-follower"),
                        n = document.querySelector(".cnvs-cursor-dot"),
                        a = a || t(".cnvs-cursor", N.getVars.elWrapper);
                    i || t(".cnvs-cursor-follower", a), n || t(".cnvs-cursor-dot", a);
                    document.addEventListener("mousemove", function(e) {
                        a.style.transform = "translate3d(" + e.clientX + "px," + e.clientY + "px,0px)"
                    }), document.querySelectorAll("a,button").forEach(function(e) {
                        e.addEventListener("mouseenter", function() {
                            a.classList.add("cnvs-cursor-action")
                        }), e.addEventListener("mouseleave", function() {
                            a.classList.remove("cnvs-cursor-action")
                        })
                    })
                }
            },
            Bootstrap: {
                init: function(e) {
                    N.isFuncTrue(function() {
                        return "undefined" != typeof bootstrap
                    }).then(function(e) {
                        if (!e) return !1;
                        N.initFunction({
                            class: "has-plugin-bootstrap",
                            event: "pluginBootstrapReady"
                        })
                    })
                }
            },
            ResizeVideos: {
                init: function(t) {
                    if (N.getSelector(t, !1, !1).length < 1) return !0;
                    N.isFuncTrue(function() {
                        return "undefined" != typeof jQuery && jQuery().fitVids
                    }).then(function(e) {
                        return !!e && (N.initFunction({
                            class: "has-plugin-fitvids",
                            event: "pluginFitVidsReady"
                        }), (t = N.getSelector(t)).length < 1 || void t.parent().fitVids({
                            customSelector: 'iframe[src*="youtube"],iframe[src*="vimeo"],iframe[src*="dailymotion"],iframe[src*="maps.google.com"],iframe[src*="google.com/maps"]',
                            ignore: ".no-fv"
                        }))
                    })
                }
            },
            PageTransition: {
                init: function(e) {
                    var a = N.getVars.elBody;
                    if (N.initFunction({
                            class: "has-plugin-pagetransition",
                            event: "pluginPageTransitionReady"
                        }), a.classList.contains("no-transition")) return !0;
                    a.classList.contains("page-transition") || a.classList.add("page-transition"), window.onpageshow = function(e) {
                        e.persisted && window.location.reload()
                    };

                    function t() {
                        function e() {
                            i.remove(), "fadeIn" != n && (N.getVars.elWrapper.classList.remove("not-animated"), (n + " animated").split(" ").forEach(function(e) {
                                N.getVars.elWrapper.classList.add(e)
                            }))
                        }

                        function t() {
                            a.classList.remove("page-transition"), setTimeout(function() {
                                (n + " animated").split(" ").forEach(function(e) {
                                    N.getVars.elWrapper.classList.remove(e)
                                })
                            }, 333), setTimeout(function() {
                                N.getVars.elWrapper.style.removeProperty("--cnvs-animate-duration")
                            }, 666)
                        }
                        return n.split(" ").forEach(function(e) {
                            i.classList.remove(e)
                        }), i.classList.add("fadeOut", "animated"), i.addEventListener("transitionend", e), i.addEventListener("animationend", e), N.getVars.elWrapper.addEventListener("transitionend", t), N.getVars.elWrapper.addEventListener("animationend", t), !0
                    }
                    var i = document.querySelector(".page-transition-wrap"),
                        n = a.getAttribute("data-animation-in") || "fadeIn",
                        r = a.getAttribute("data-speed-in") || 1e3,
                        s = !1,
                        o = a.getAttribute("data-loader-timeout"),
                        l = a.getAttribute("data-loader"),
                        c = a.getAttribute("data-loader-color"),
                        d = a.getAttribute("data-loader-html"),
                        u = "",
                        p = "",
                        o = o ? (s = !0, Number(o)) : s = !1,
                        u = "2" == l ? '<div class="css3-spinner-flipper"></div>' : "3" == l ? '<div class="css3-spinner-double-bounce1"></div><div class="css3-spinner-double-bounce2"></div>' : "4" == l ? '<div class="css3-spinner-rect1"></div><div class="css3-spinner-rect2"></div><div class="css3-spinner-rect3"></div><div class="css3-spinner-rect4"></div><div class="css3-spinner-rect5"></div>' : "5" == l ? '<div class="css3-spinner-cube1"></div><div class="css3-spinner-cube2"></div>' : "6" == l ? '<div class="css3-spinner-scaler"></div>' : "7" == l ? '<div class="css3-spinner-grid-pulse"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>' : "8" == l ? '<div class="css3-spinner-clip-rotate"><div></div></div>' : "9" == l ? '<div class="css3-spinner-ball-rotate"><div></div><div></div><div></div></div>' : "10" == l ? '<div class="css3-spinner-zig-zag"><div></div><div></div></div>' : "11" == l ? '<div class="css3-spinner-triangle-path"><div></div><div></div><div></div></div>' : "12" == l ? '<div class="css3-spinner-ball-scale-multiple"><div></div><div></div><div></div></div>' : "13" == l ? '<div class="css3-spinner-ball-pulse-sync"><div></div><div></div><div></div></div>' : "14" == l ? '<div class="css3-spinner-scale-ripple"><div></div><div></div><div></div></div>' : '<div class="css3-spinner-bounce1"></div><div class="css3-spinner-bounce2"></div><div class="css3-spinner-bounce3"></div>';
                    d = '<div class="css3-spinner"' + (p = c ? "theme" == c ? ' style="--cnvs-loader-color:var(--cnvs-themecolor);"' : ' style="--cnvs-loader-color:' + c + ';"' : p) + ">" + (d = d || u) + "</div>", "fadeIn" == n ? N.getVars.elWrapper.classList.add("op-1") : N.getVars.elWrapper.classList.add("not-animated"), i || ((l = document.createElement("div")).classList.add("page-transition-wrap"), l.innerHTML = d, a.prepend(l), i = document.querySelector(".page-transition-wrap")), r && (N.getVars.elWrapper.style.setProperty("--cnvs-animate-duration", Number(r) + "ms"), "fadeIn" == n) && i.style.setProperty("--cnvs-animate-duration", Number(r) + "ms");
                    "complete" === document.readyState && t(), s && setTimeout(t, o), window.addEventListener("load", function() {
                        t()
                    })
                }
            },
            LazyLoad: {
                init: function(e) {
                    if (N.getSelector(e, !1, !1).length < 1) return !0;
                    N.isFuncTrue(function() {
                        return "undefined" != typeof LazyLoad
                    }).then(function(e) {
                        if (!e) return !1;
                        N.initFunction({
                            class: "has-plugin-lazyload",
                            event: "pluginlazyLoadReady"
                        }), window.lazyLoadInstance = new LazyLoad({
                            threshold: 0,
                            elements_selector: ".lazy:not(.lazy-loaded)",
                            class_loading: "lazy-loading",
                            class_loaded: "lazy-loaded",
                            class_error: "lazy-error",
                            callback_loaded: function(e) {
                                N.addEvent(window, "lazyLoadLoaded"), "true" == e.parentNode.getAttribute("data-lazy-container") && N.runContainerModules(e.parentNode)
                            }
                        })
                    })
                }
            },
            DataClasses: {
                init: function(e) {
                    return N.getSelector(e, !1, !1).length < 1 || (N.initFunction({
                        class: "has-plugin-dataclasses",
                        event: "pluginDataClassesReady"
                    }), (e = N.getSelector(e, !1, !1)).length < 1) || (e.forEach(function(t) {
                        var e = t.getAttribute("data-class");
                        0 < (e = e.split(/ +/)).length && e.forEach(function(e) {
                            e = e.split(":");
                            N.getVars.elBody.classList.contains("dark" == e[0] ? e[0] : "device-" + e[0]) ? t.classList.add(e[1]) : t.classList.remove(e[1])
                        })
                    }), void(N.getVars.resizers.dataClasses = function() {
                        setTimeout(function() {
                            S.dataClasses()
                        }, 333)
                    }))
                }
            },
            DataHeights: {
                init: function(e) {
                    return N.getSelector(e, !1, !1).length < 1 || (N.initFunction({
                        class: "has-plugin-dataheights",
                        event: "pluginDataHeightsReady"
                    }), (e = N.getSelector(e, !1, !1)).length < 1) || (e.forEach(function(e) {
                        var t, a = e.getAttribute("data-height-xs") || "auto",
                            i = e.getAttribute("data-height-sm") || a,
                            n = e.getAttribute("data-height-md") || i,
                            r = e.getAttribute("data-height-lg") || n,
                            s = e.getAttribute("data-height-xl") || r,
                            o = e.getAttribute("data-height-xxl") || s,
                            l = N.getVars.elBody.classList;
                        l.contains("device-xs") ? t = a : l.contains("device-sm") ? t = i : l.contains("device-md") ? t = n : l.contains("device-lg") ? t = r : l.contains("device-xl") ? t = s : l.contains("device-xxl") && (t = o), t && (e.style.height = isNaN(t) ? t : t + "px")
                    }), void(N.getVars.resizers.dataHeights = function() {
                        S.dataHeights()
                    }))
                }
            },
            Lightbox: {
                init: function(t) {
                    if (N.getSelector(t, !1, !1).length < 1) return !0;
                    N.isFuncTrue(function() {
                        return "undefined" != typeof jQuery && jQuery().magnificPopup
                    }).then(function(e) {
                        var l;
                        return !!e && (N.initFunction({
                            class: "has-plugin-lightbox",
                            event: "pluginLightboxReady"
                        }), (t = N.getSelector(t)).length < 1 || (l = '<i class="bi-x-lg"></i>', void t.each(function() {
                            var e, t = jQuery(this),
                                a = t.attr("data-lightbox"),
                                i = t.attr("data-close-button") || "outside",
                                n = t.attr("data-disable-under") || 600,
                                r = t.attr("data-content-position") || "auto",
                                s = t.attr("data-zoom"),
                                o = jQuery("body"),
                                i = "inside" == i,
                                r = "fixed" == r;
                            "image" == a && (e = {
                                type: "image",
                                tLoading: "",
                                closeOnContentClick: !0,
                                closeBtnInside: i,
                                fixedContentPos: !0,
                                mainClass: "mfp-no-margins mfp-fade",
                                image: {
                                    verticalFit: !0
                                },
                                closeIcon: l
                            }, "true" == s && (e.zoom = {
                                enabled: !0,
                                duration: 300,
                                easing: "ease-in-out",
                                opener: function(e) {
                                    return e.is("img") ? e : e.find("img")
                                }
                            }), t.magnificPopup(e)), "gallery" == a && (t.find('a[data-lightbox="gallery-item"]').parent(".clone").hasClass("clone") && t.find('a[data-lightbox="gallery-item"]').parent(".clone").find('a[data-lightbox="gallery-item"]').attr("data-lightbox", ""), t.find('a[data-lightbox="gallery-item"]').parents(".cloned").hasClass("cloned") && t.find('a[data-lightbox="gallery-item"]').parents(".cloned").find('a[data-lightbox="gallery-item"]').attr("data-lightbox", ""), t.magnificPopup({
                                delegate: t.hasClass("grid-container-filterable") ? 'a.grid-lightbox-filtered[data-lightbox="gallery-item"]' : 'a[data-lightbox="gallery-item"]',
                                type: "image",
                                tLoading: "",
                                closeOnContentClick: !0,
                                closeBtnInside: i,
                                fixedContentPos: !0,
                                mainClass: "mfp-no-margins mfp-fade",
                                image: {
                                    verticalFit: !0
                                },
                                gallery: {
                                    enabled: !0,
                                    navigateByImgClick: !0,
                                    preload: [0, 1]
                                },
                                closeIcon: l
                            })), "iframe" == a && t.magnificPopup({
                                disableOn: Number(n),
                                type: "iframe",
                                tLoading: "",
                                removalDelay: 160,
                                preloader: !1,
                                closeBtnInside: i,
                                fixedContentPos: r,
                                closeIcon: l
                            }), "inline" == a && t.magnificPopup({
                                type: "inline",
                                tLoading: "",
                                mainClass: "mfp-no-margins mfp-fade",
                                closeBtnInside: i,
                                fixedContentPos: !0,
                                overflowY: "scroll",
                                closeIcon: l
                            }), "ajax" == a && t.magnificPopup({
                                type: "ajax",
                                tLoading: "",
                                closeBtnInside: i,
                                autoFocusLast: !1,
                                closeIcon: l,
                                callbacks: {
                                    ajaxContentAdded: function(e) {
                                        N.runContainerModules(document.querySelector(".mfp-content"))
                                    },
                                    open: function() {
                                        o.addClass("ohidden")
                                    },
                                    close: function() {
                                        o.removeClass("ohidden")
                                    }
                                }
                            }), "ajax-gallery" == a && t.magnificPopup({
                                delegate: 'a[data-lightbox="ajax-gallery-item"]',
                                type: "ajax",
                                tLoading: "",
                                closeBtnInside: i,
                                closeIcon: l,
                                autoFocusLast: !1,
                                gallery: {
                                    enabled: !0,
                                    preload: 0,
                                    navigateByImgClick: !1
                                },
                                callbacks: {
                                    ajaxContentAdded: function(e) {
                                        N.runContainerModules(document.querySelector(".mfp-content"))
                                    },
                                    open: function() {
                                        o.addClass("ohidden")
                                    },
                                    close: function() {
                                        o.removeClass("ohidden")
                                    }
                                }
                            }), t.on("mfpOpen", function() {
                                var e = jQuery.magnificPopup.instance.currItem.el,
                                    t = jQuery(e).attr("data-lightbox-class"),
                                    e = jQuery(e).attr("data-lightbox-bg-class");
                                "" != t && jQuery(jQuery.magnificPopup.instance.container).addClass(t), "" != e && jQuery(jQuery.magnificPopup.instance.bgOverlay).addClass(e)
                            })
                        })))
                    })
                }
            },
            Modal: {
                init: function(t) {
                    if (N.getSelector(t, !1, !1).length < 1) return !0;
                    N.isFuncTrue(function() {
                        return "undefined" != typeof jQuery && jQuery().magnificPopup
                    }).then(function(e) {
                        return !!e && (N.initFunction({
                            class: "has-plugin-modal",
                            event: "pluginModalReady"
                        }), (t = N.getSelector(t)).length < 1 || void t.each(function() {
                            var e = jQuery(this),
                                t = e.attr("data-target"),
                                a = "__cnvs_" + t.split("#")[1],
                                i = e.attr("data-delay") || 500,
                                n = e.attr("data-timeout"),
                                r = e.attr("data-animate-in"),
                                s = e.attr("data-animate-out"),
                                o = e.attr("data-bg-click"),
                                l = e.attr("data-close-btn"),
                                c = e.attr("data-cookies"),
                                d = e.attr("data-cookie-path"),
                                u = e.attr("data-cookie-expire");
                            if ("false" == c && N.cookie.remove(a), "true" == c) {
                                e = N.cookie.get(a);
                                if (void 0 !== e && "0" == e) return !0
                            }
                            o = "false" != o, l = "false" != l, i = Number(i) + 500, setTimeout(function() {
                                jQuery.magnificPopup.open({
                                    items: {
                                        src: t
                                    },
                                    type: "inline",
                                    mainClass: "mfp-no-margins mfp-fade",
                                    closeBtnInside: !1,
                                    fixedContentPos: !0,
                                    closeOnBgClick: o,
                                    showCloseBtn: l,
                                    removalDelay: 500,
                                    closeIcon: '<i class="bi-x-lg"></i>',
                                    callbacks: {
                                        open: function() {
                                            "" != r && jQuery(t).addClass(r + " animated")
                                        },
                                        beforeClose: function() {
                                            "" != s && jQuery(t).removeClass(r).addClass(s)
                                        },
                                        afterClose: function() {
                                            "" == r && "" == s || jQuery(t).removeClass(r + " " + s + " animated")
                                        }
                                    }
                                }, 0)
                            }, i), document.querySelector(".modal-cookies-close") && (document.querySelector(".modal-cookies-close").onclick = function() {
                                var e;
                                jQuery.magnificPopup.close(), "true" == c && (e = {}, u && (e.expires = Number(u)), d && (e.path = d), N.cookie.set(a, "0", e))
                            }), "" != n && setTimeout(function() {
                                jQuery.magnificPopup.close()
                            }, i + Number(n))
                        }))
                    })
                }
            },
            Animations: {
                init: function(e) {
                    var t, a;
                    return N.getSelector(e, !1, !1).length < 1 || (N.initFunction({
                        class: "has-plugin-animations",
                        event: "pluginAnimationsReady"
                    }), (e = N.getSelector(e, !1)).length < 1) || (t = "animated", a = new IntersectionObserver(function(e, c) {
                        e.forEach(function(e) {
                            var t = e.target,
                                a = t.getAttribute("data-animate"),
                                i = t.getAttribute("data-animate-out"),
                                n = t.getAttribute("data-delay"),
                                r = t.getAttribute("data-delay-out"),
                                s = 0,
                                o = 3e3,
                                l = a.split(" ");
                            return !!t.closest(".fslider.no-thumbs-animate") || !!t.closest(".swiper-slide") || (s = n ? Number(n) + 500 : 500, i && r && (o = Number(r) + s), t.classList.contains("animated") || (t.classList.add("not-animated"), 0 < e.intersectionRatio && (setTimeout(function() {
                                t.classList.remove("not-animated"), l.forEach(function(e) {
                                    t.classList.add(e)
                                }), t.classList.add("animated")
                            }, s), i) && setTimeout(function() {
                                l.forEach(function(e) {
                                    t.classList.remove(e)
                                }), i.split(" ").forEach(function(e) {
                                    t.classList.add(e)
                                })
                            }, o)), void(t.classList.contains("not-animated") || c.unobserve(t)))
                        })
                    }), void[].filter.call(document.querySelectorAll("[data-animate]"), function(e) {
                        return !void e.classList.contains(t)
                    }).forEach(function(e) {
                        return a.observe(e)
                    }))
                }
            },
            HoverAnimations: {
                init: function(e) {
                    return N.getSelector(e, !1, !1).length < 1 || (N.initFunction({
                        class: "has-plugin-hoveranimation",
                        event: "pluginHoverAnimationReady"
                    }), (e = N.getSelector(e, !1)).length < 1) || void e.forEach(function(e) {
                        var t = e.getAttribute("data-hover-animate"),
                            a = e.getAttribute("data-hover-animate-out") || "fadeOut",
                            i = e.getAttribute("data-hover-speed") || 600,
                            n = e.getAttribute("data-hover-delay"),
                            r = e.getAttribute("data-hover-parent"),
                            s = e.getAttribute("data-hover-reset") || "false",
                            o = e.getAttribute("data-hover-mobile") || "true";
                        if ("true" != o)
                            if ("false" == o) {
                                if (!N.getVars.elBody.classList.contains("device-up-lg")) return !0
                            } else if (!N.getVars.elBody.classList.contains("device-up-" + o)) return !0;
                        e.classList.add("not-animated");
                        var r = r ? "self" == r ? e : e.closest(r) : e.closest(".bg-overlay") ? e.closest(".bg-overlay") : e,
                            o = 0,
                            l = (n && (o = Number(n)), i && (e.style.animationDuration = Number(i) + "ms"), {
                                element: e,
                                elAnimate: t,
                                elAnimateOut: a,
                                elSpeed: i,
                                elDelayT: o,
                                elParent: r,
                                elReset: s
                            });
                        r.addEventListener("mouseenter", function() {
                            var t;
                            t = l, clearTimeout(h), f = setTimeout(function() {
                                t.element.classList.add("not-animated"), (t.elAnimateOut + " not-animated").split(" ").forEach(function(e) {
                                    t.element.classList.remove(e)
                                }), (t.elAnimate + " animated").split(" ").forEach(function(e) {
                                    t.element.classList.add(e)
                                })
                            }, t.elDelayT)
                        }, !1), r.addEventListener("mouseleave", function() {
                            var t;
                            (t = l).element.classList.add("not-animated"), (t.elAnimate + " not-animated").split(" ").forEach(function(e) {
                                t.element.classList.remove(e)
                            }), (t.elAnimateOut + " animated").split(" ").forEach(function(e) {
                                t.element.classList.add(e)
                            }), "true" == t.elReset && (h = setTimeout(function() {
                                (t.elAnimateOut + " animated").split(" ").forEach(function(e) {
                                    t.element.classList.remove(e)
                                }), t.element.classList.add("not-animated")
                            }, Number(t.elSpeed))), clearTimeout(f)
                        }, !1)
                    })
                }
            },
            Grid: {
                init: function(t) {
                    if (N.getSelector(t, !1, !1).length < 1) return !0;
                    N.isFuncTrue(function() {
                        return "undefined" != typeof jQuery && "undefined" != typeof Isotope
                    }).then(function(e) {
                        return !!e && (N.initFunction({
                            class: "has-plugin-isotope",
                            event: "pluginIsotopeReady"
                        }), (t = N.getSelector(t)).length < 1 || void t.each(function() {
                            var e = jQuery(this),
                                t = e.attr("data-transition") || "0.65s",
                                a = e.attr("data-layout") || "masonry",
                                i = e.attr("data-stagger") || 0,
                                n = e.attr("data-basewidth") || ".portfolio-item:not(.wide):eq(0)",
                                r = !0,
                                s = (M(e), N.getVars.isRTL && (r = !1), e.hasClass("portfolio") || e.hasClass("post-timeline") ? e.filter(":not(.has-init-isotope)").isotope({
                                    layoutMode: a,
                                    isOriginLeft: r,
                                    transitionDuration: t,
                                    stagger: Number(i),
                                    percentPosition: !0,
                                    masonry: {
                                        columnWidth: e.find(n)[0]
                                    }
                                }) : e.filter(":not(.has-init-isotope)").isotope({
                                    layoutMode: a,
                                    isOriginLeft: r,
                                    transitionDuration: t,
                                    stagger: Number(i),
                                    percentPosition: !0
                                }), e.data("isotope") && e.addClass("has-init-isotope"), setInterval(function() {
                                    e.find(".lazy.lazy-loaded").length == e.find(".lazy").length && (setTimeout(function() {
                                        M(e)
                                    }, 666), clearInterval(s))
                                }, 1e3));
                            window.addEventListener("lazyLoadLoaded", function() {
                                M(e)
                            }), window.addEventListener("load", function() {
                                M(e)
                            }), N.getVars.resizers.isotope = function() {
                                M(e)
                            }
                        }))
                    })
                }
            },
            Filter: {
                init: function(t) {
                    if (N.getSelector(t, !1, !1).length < 1) return !0;
                    N.isFuncTrue(function() {
                        return "undefined" != typeof jQuery && "undefined" != typeof Isotope
                    }).then(function(e) {
                        return !!e && (N.initFunction({
                            class: "has-plugin-isotope-filter",
                            event: "pluginGridFilterReady"
                        }), (t = N.getSelector(t)).length < 1 || (t.each(function() {
                            var t = jQuery(this),
                                a = t.attr("data-container"),
                                i = t.attr("data-active-class"),
                                e = t.attr("data-default"),
                                i = i || "activeFilter";
                            if (!jQuery(a).hasClass("grid-container")) return !1;
                            t.find("a").off("click").on("click", function() {
                                t.find("li").removeClass(i), jQuery(this).parent("li").addClass(i);
                                var e = jQuery(this).attr("data-filter");
                                return jQuery(a).isotope({
                                    filter: e
                                }), !1
                            }), e && (t.find("li").removeClass(i), t.find('[data-filter="' + e + '"]').parent("li").addClass(i), jQuery(a).isotope({
                                filter: e
                            })), jQuery(a).on("arrangeComplete layoutComplete", function(e, t) {
                                jQuery(a).addClass("grid-container-filterable"), "gallery" == jQuery(a).attr("data-lightbox") && (jQuery(a).find("[data-lightbox]").removeClass("grid-lightbox-filtered"), t.forEach(function(e) {
                                    jQuery(e.element).find("[data-lightbox]").addClass("grid-lightbox-filtered")
                                })), S.lightbox()
                            })
                        }), void jQuery(".grid-shuffle").off("click").on("click", function() {
                            var e = jQuery(this).attr("data-container");
                            if (!jQuery(e).hasClass("grid-container")) return !1;
                            jQuery(e).isotope("shuffle")
                        })))
                    })
                }
            },
            CanvasSlider: {
                init: function(t) {
                    if (N.getSelector(t, !1, !1).length < 1) return !0;
                    N.isFuncTrue(function() {
                        return "undefined" != typeof Swiper
                    }).then(function(e) {
                        return !!e && (N.initFunction({
                            class: "has-plugin-swiper",
                            event: "pluginSwiperReady"
                        }), (t = N.getSelector(t, !1)).length < 1 || void t.forEach(function(a) {
                            var e, t, i, n, r, s, o, l, c, d, u, p, g, f, h, m, v, y, b;
                            return !a.classList.contains("swiper_wrapper") || a.querySelectorAll(".swiper-slide").length < 1 || (b = a.getAttribute("data-direction") || "horizontal", e = a.getAttribute("data-speed") || 300, s = a.getAttribute("data-autoplay"), l = a.getAttribute("data-autoplay-disable-on-interaction") || !0, o = a.getAttribute("data-hover"), c = a.getAttribute("data-loop"), f = a.getAttribute("data-start") || 1, t = a.getAttribute("data-effect") || "slide", u = a.getAttribute("data-grab"), d = a.getAttribute("data-parallax"), p = a.getAttribute("data-autoheight"), i = a.querySelector(".slide-number-total"), n = a.querySelector(".slide-number-current"), g = a.getAttribute("data-video-autoplay"), a.getAttribute("data-settings"), s = s ? Number(s) : 999999999, o = "true" == o, l = "false" != l, c = "true" == c, d = "true" == d, u = "false" != u, p = "true" == p, g = "false" != g, f = "random" == f ? Math.floor(Math.random() * a.querySelectorAll(".swiper-slide:not(.swiper-slide-duplicate)").length) : Number(f) - 1, h = a.querySelector(".swiper-pagination") ? (r = a.querySelector(".swiper-pagination"), !0) : (r = "", !1), m = a.querySelector(".slider-arrow-right"), v = a.querySelector(".slider-arrow-left"), y = a.querySelector(".swiper-scrollbar"), b = new Swiper(a.querySelector(".swiper-parent"), {
                                direction: b,
                                speed: Number(e),
                                autoplay: {
                                    delay: s,
                                    pauseOnMouseEnter: o,
                                    disableOnInteraction: l
                                },
                                loop: c,
                                initialSlide: f,
                                effect: t,
                                parallax: d,
                                slidesPerView: 1,
                                grabCursor: u,
                                autoHeight: p,
                                pagination: {
                                    el: r,
                                    clickable: h
                                },
                                navigation: {
                                    prevEl: v,
                                    nextEl: m
                                },
                                scrollbar: {
                                    el: y
                                },
                                on: {
                                    afterInit: function(e) {
                                        var t;
                                        T.sliderDimensions(), 0 < a.querySelectorAll(".yt-bg-player").length && (a.querySelectorAll(".yt-bg-player").forEach(function(e) {
                                            e.setAttribute("data-autoplay", "false"), e.classList.remove("customjs")
                                        }), S.youtubeBgVideo(), (t = jQuery(".swiper-slide-active").find(".yt-bg-player:not(.customjs)")).on("YTPReady", function() {
                                            setTimeout(function() {
                                                t.filter(".mb_YTPlayer").YTPPlay()
                                            }, 1200)
                                        })), document.querySelectorAll(".swiper-slide-active [data-animate]").forEach(function(t) {
                                            var e, a = t.getAttribute("data-delay"),
                                                i = 0,
                                                i = a ? Number(a) + 750 : 750;
                                            t.classList.contains("animated") || (t.classList.add("not-animated"), e = t.getAttribute("data-animate"), setTimeout(function() {
                                                t.classList.remove("not-animated"), (e + " animated").split(" ").forEach(function(e) {
                                                    t.classList.add(e)
                                                })
                                            }, i))
                                        }), a.querySelectorAll("[data-animate]").forEach(function(t) {
                                            var e = t.getAttribute("data-animate");
                                            if (t.closest(".swiper-slide").classList.contains("swiper-slide-active")) return !0;
                                            (e + " animated").split(" ").forEach(function(e) {
                                                t.classList.remove(e)
                                            }), t.classList.add("not-animated")
                                        }), p && setTimeout(function() {
                                            e.updateAutoHeight(300)
                                        }, 1e3)
                                    },
                                    transitionStart: function(e) {
                                        a.querySelectorAll("[data-animate]").forEach(function(t) {
                                            var e = t.getAttribute("data-animate");
                                            if (t.closest(".swiper-slide").classList.contains("swiper-slide-active")) return !0;
                                            (e + " animated").split(" ").forEach(function(e) {
                                                t.classList.remove(e)
                                            }), t.classList.add("not-animated")
                                        }), SEMICOLON.Base.sliderMenuClass()
                                    },
                                    transitionEnd: function(e) {
                                        n && (n.innerHTML = 1 == c ? Number(a.querySelector(".swiper-slide.swiper-slide-active").getAttribute("data-swiper-slide-index")) + 1 : e.activeIndex + 1), a.querySelectorAll(".swiper-slide").forEach(function(e) {
                                            e.querySelector("video") && 1 == g && e.querySelector("video").pause(), e.querySelector(".yt-bg-player.mb_YTPlayer:not(.customjs)") && jQuery(e).find(".yt-bg-player.mb_YTPlayer:not(.customjs)").YTPPause()
                                        }), a.querySelectorAll(".swiper-slide:not(.swiper-slide-active)").forEach(function(e) {
                                            e.querySelector("video") && 0 != e.querySelector("video").currentTime && (e.querySelector("video").currentTime = 0);
                                            e = e.querySelector(".yt-bg-player.mb_YTPlayer:not(.customjs)");
                                            e && jQuery(e).YTPSeekTo(e.getAttribute("data-start"))
                                        }), a.querySelector(".swiper-slide.swiper-slide-active").querySelector("video") && 1 == g && a.querySelector(".swiper-slide.swiper-slide-active").querySelector("video").play(), a.querySelector(".swiper-slide.swiper-slide-active").querySelector(".yt-bg-player.mb_YTPlayer:not(.customjs)") && 1 == g && jQuery(a).find(".swiper-slide.swiper-slide-active").find(".yt-bg-player.mb_YTPlayer:not(.customjs)").YTPPlay(), a.querySelectorAll(".swiper-slide.swiper-slide-active [data-animate]").forEach(function(t) {
                                            var e, a = t.getAttribute("data-delay"),
                                                i = 0,
                                                i = a ? Number(a) + 300 : 300;
                                            t.classList.contains("animated") || (t.classList.add("not-animated"), e = t.getAttribute("data-animate"), setTimeout(function() {
                                                t.classList.remove("not-animated"), (e + " animated").split(" ").forEach(function(e) {
                                                    t.classList.add(e)
                                                })
                                            }, i))
                                        })
                                    }
                                }
                            }), n && (n.innerHTML = 1 == c ? b.realIndex + 1 : b.activeIndex + 1), void(i && (i.innerHTML = a.querySelectorAll(".swiper-slide:not(.swiper-slide-duplicate)").length)))
                        }))
                    })
                }
            },
            SliderParallax: {
                init: function(e) {
                    if (N.getSelector(e, !1, !1).length < 1) return !0;
                    N.isFuncTrue(function() {
                        return "undefined" != typeof fastdom
                    }).then(function(e) {
                        if (!e) return !1;
                        (n = {
                            sliderPx: N.getVars.sliderParallax,
                            body: N.getVars.elBody,
                            header: N.getVars.elHeader,
                            scrollPos: N.getVars.scrollPos,
                            isMobile: t.any(),
                            get height() {
                                return this.sliderPx.el.offsetHeight
                            },
                            get classes() {
                                return this.sliderPx.el.classList
                            }
                        }).sliderPx.el.querySelector(".slider-inner") ? E(0, 0, n.sliderPx.inner) : E(0, 0, n.sliderPx.el), E(0, 0, n.sliderPx.caption), window.addEventListener("scroll", function() {
                            X(n), $(n)
                        }, {
                            passive: !0
                        }), N.getVars.resizers.sliderparallax = function() {
                            X(n), $(n)
                        }
                    })
                }
            },
            FlexSlider: {
                init: function(t) {
                    if (N.getSelector(t, !1, !1).length < 1) return !0;
                    N.isFuncTrue(function() {
                        return "undefined" != typeof jQuery && jQuery().flexslider
                    }).then(function(e) {
                        return !!e && (N.initFunction({
                            class: "has-plugin-flexslider",
                            event: "pluginFlexSliderReady"
                        }), (t = N.getSelector(t)).length < 1 || void t.each(function() {
                            var e = jQuery(this),
                                t = (e.find(".lazy"), e.attr("data-animation") || "slide"),
                                a = e.attr("data-easing") || "swing",
                                i = e.attr("data-direction") || "horizontal",
                                n = e.attr("data-reverse"),
                                r = e.attr("data-slideshow"),
                                s = e.attr("data-pause") || 5e3,
                                o = e.attr("data-speed") || 600,
                                l = e.attr("data-video"),
                                c = e.attr("data-pagi"),
                                d = e.attr("data-arrows"),
                                u = e.attr("data-arrow-left") || "uil uil-angle-left-b",
                                p = e.attr("data-arrow-right") || "uil uil-angle-right-b",
                                g = e.attr("data-thumbs"),
                                f = e.attr("data-hover"),
                                h = e.attr("data-smooth-height"),
                                m = e.attr("data-touch"),
                                v = !1;
                            "swing" == a && (a = "swing", v = !0), n = "true" == n, r = "false" != r, l = l || !1, h = "vertical" == i ? !1 : "false" != h, c = "true" == g ? "thumbnails" : "false" != c, d = "false" != d, f = "false" != f, m = "false" != m, e.find(".flexslider").flexslider({
                                selector: ".slider-wrap > .slide",
                                animation: t,
                                easing: a,
                                direction: i,
                                reverse: n,
                                slideshow: r,
                                slideshowSpeed: Number(s),
                                animationSpeed: Number(o),
                                pauseOnHover: f,
                                video: l,
                                controlNav: c,
                                directionNav: d,
                                smoothHeight: h,
                                useCSS: v,
                                touch: m,
                                start: function(e) {
                                    S.animations(), S.lightbox(), jQuery(".flex-prev").html('<i class="' + u + '"></i>'), jQuery(".flex-next").html('<i class="' + p + '"></i>'), setTimeout(function() {
                                        0 < e.parents(".grid-container.has-init-isotope").length && e.parents(".grid-container.has-init-isotope").isotope("layout")
                                    }, 1200), "undefined" != typeof skrollrInstance && skrollrInstance.refresh()
                                },
                                after: function(e) {
                                    0 < e.parents(".grid-container.has-init-isotope").length && !e.hasClass("flexslider-grid-relayout") && (e.parents(".grid-container.has-init-isotope").isotope("layout"), e.addClass("flexslider-grid-relayout")), jQuery(".menu-item:visible").find(".flexslider .slide").resize()
                                }
                            })
                        }))
                    })
                }
            },
            FullVideo: {
                init: function(e) {
                    return N.getSelector(e, !1, !1).length < 1 || (N.initFunction({
                        class: "has-plugin-html5video",
                        event: "pluginHtml5VideoReady"
                    }), (e = N.getSelector(e, !1, !1)).length < 1) || (e.forEach(function(e) {
                        var t = e.querySelector("video"),
                            a = e.getAttribute("data-ratio") || "16/9";
                        if (!t) return !0;
                        a = a.split("/"), t.style.left = "", t.style.top = "";
                        var i = e.offsetWidth,
                            n = e.offsetHeight,
                            r = Number(a[0]) * n / Number(a[1]),
                            s = n;
                        r < i && (r = i, s = Number(a[1]) * i / Number(a[0])), t.style.width = r + "px", t.style.height = s + "px", n < s && (t.style.left = "", t.style.top = -(s - n) / 2 + "px"), i < r && (t.style.left = -(r - i) / 2 + "px", t.style.top = ""), SEMICOLON.Mobile.any() && !e.classList.contains("no-placeholder") && ("" != (a = t.getAttribute("poster")) && (e.innerHTML += '<div class="video-placeholder" style="background-image: url(' + a + ');"></div>'), t.classList.add("d-none"))
                    }), void(N.getVars.resizers.html5video = function() {
                        S.html5Video()
                    }))
                }
            },
            YoutubeBG: {
                init: function(t) {
                    if (N.getSelector(t, !1, !1).length < 1) return !0;
                    N.isFuncTrue(function() {
                        return "undefined" != typeof jQuery && jQuery().YTPlayer
                    }).then(function(e) {
                        return !!e && (N.initFunction({
                            class: "has-plugin-youtubebg",
                            event: "pluginYoutubeBgVideoReady"
                        }), (t = N.getSelector(t, !0, ".mb_YTPlayer,.customjs")).length < 1 || void t.each(function() {
                            var e, t, a = jQuery(this),
                                i = a.attr("data-video"),
                                n = a.attr("data-mute") || !0,
                                r = a.attr("data-ratio") || "16/9",
                                s = a.attr("data-quality") || "hd720",
                                o = a.attr("data-opacity") || 1,
                                l = a.attr("data-container") || "parent",
                                c = a.attr("data-optimize") || !0,
                                d = a.attr("data-loop") || !0,
                                u = (a.attr("data-controls"), a.attr("data-volume") || 50),
                                p = a.attr("data-start") || 0,
                                g = a.attr("data-stop") || 0,
                                f = a.attr("data-autoplay") || !0,
                                h = a.attr("data-fullscreen") || !1,
                                m = a.attr("data-coverimage") || "",
                                v = a.attr("data-pauseonblur") || !0,
                                y = a.attr("data-playifvisible") || !1;
                            "false" == n && (n = !1), "parent" == l && (l = (e = a.parent()).attr("id") ? "#" + e.attr("id") : (t = "yt-bg-player-parent-" + Math.floor(1e4 * Math.random()), e.attr("id", t), "#" + t)), "false" == c && (c = !1), "false" == d && (d = !1), "false" == f && (f = !1), "true" == h && (h = !0), "true" == v && (v = !0), "true" == y && (y = !0), a.YTPlayer({
                                videoURL: i,
                                mute: n,
                                ratio: r,
                                quality: s,
                                opacity: Number(o),
                                containment: l,
                                optimizeDisplay: c,
                                loop: d,
                                vol: Number(u),
                                startAt: Number(p),
                                stopAt: Number(g),
                                autoPlay: f,
                                realfullscreen: h,
                                showYTLogo: !1,
                                showControls: !1,
                                coverImage: m,
                                stopMovieOnBlur: v,
                                playOnlyIfVisible: y
                            })
                        }))
                    })
                }
            },
            Toggle: {
                init: function(t) {
                    if (N.getSelector(t, !1, !1).length < 1) return !0;
                    N.isFuncTrue(function() {
                        return "undefined" != typeof jQuery
                    }).then(function(e) {
                        return !!e && (N.initFunction({
                            class: "has-plugin-toggles",
                            event: "pluginTogglesReady"
                        }), (t = N.getSelector(t)).length < 1 || void t.each(function() {
                            var e = jQuery(this),
                                t = e.attr("data-speed") || 300;
                            "open" != e.attr("data-state") ? e.children(".toggle-content").hide() : e.addClass("toggle-active").children(".toggle-content").slideDown(Number(t)), e.children(".toggle-header").off("click").on("click", function() {
                                return e.toggleClass("toggle-active").children(".toggle-content").slideToggle(Number(t)), !0
                            })
                        }))
                    })
                }
            },
            Accordion: {
                init: function(t) {
                    if (N.getSelector(t, !1, !1).length < 1) return !0;
                    N.isFuncTrue(function() {
                        return "undefined" != typeof jQuery
                    }).then(function(e) {
                        return !!e && (N.initFunction({
                            class: "has-plugin-accordions",
                            event: "pluginAccordionsReady"
                        }), (t = N.getSelector(t)).length < 1 || void t.each(function() {
                            var t = jQuery(this),
                                e = t.attr("data-state"),
                                a = t.attr("data-active") || 1,
                                i = t.attr("data-active-class") || "",
                                n = t.attr("data-collapsible") || "false",
                                r = location.hash,
                                a = Number(a) - 1;
                            void 0 !== r && "" != r && 0 < (r = t.find(".accordion-header" + r)).length && (a = r.index() / 2), t.find(".accordion-content").hide(), "closed" != e && t.find(".accordion-header:eq(" + Number(a) + ")").addClass("accordion-active " + i).next().show(), t.find(".accordion-header").off("click").on("click", function() {
                                var e = jQuery(this);
                                return e.next().is(":hidden") ? (t.find(".accordion-header").removeClass("accordion-active " + i).next().slideUp("normal"), e.toggleClass("accordion-active " + i, !0).next().stop(!0, !0).slideDown("normal", function() {
                                    (jQuery("body").hasClass("device-sm") || jQuery("body").hasClass("device-xs")) && t.hasClass("scroll-on-open") && N.scrollTo(N.offset(e).top - N.getVars.topScrollOffset - 40, 800, "easeOutQuad"), N.runContainerModules(e.next()[0])
                                })) : "true" == n && e.toggleClass("accordion-active " + i, !1).next().stop(!0, !0).slideUp("normal"), !1
                            })
                        }))
                    })
                }
            },
            Counter: {
                init: function(t) {
                    if (N.getSelector(t, !1, !1).length < 1) return !0;
                    N.isFuncTrue(function() {
                        return "undefined" != typeof jQuery && jQuery().countTo
                    }).then(function(e) {
                        return !!e && (N.initFunction({
                            class: "has-plugin-counter",
                            event: "pluginCounterReady"
                        }), (t = N.getSelector(t)).length < 1 || void t.each(function() {
                            var a = jQuery(this),
                                e = a.find("span").attr("data-comma"),
                                t = a.find("span").attr("data-sep") || ",",
                                i = a.find("span").attr("data-places") || 3,
                                n = {
                                    comma: e,
                                    sep: t,
                                    places: Number(i)
                                };
                            a.hasClass("counter-instant") ? U(a, n) : new IntersectionObserver(function(e, t) {
                                e.forEach(function(e) {
                                    e.isIntersecting && (U(a, n), t.unobserve(e.target))
                                })
                            }, {
                                rootMargin: "0px 0px 50px"
                            }).observe(a[0])
                        }))
                    })
                }
            },
            Countdown: {
                init: function(t) {
                    if (N.getSelector(t, !1, !1).length < 1) return !0;
                    N.isFuncTrue(function() {
                        return "undefined" != typeof jQuery && "undefined" != typeof moment && jQuery().countdown
                    }).then(function(e) {
                        return !!e && (N.initFunction({
                            class: "has-plugin-countdown",
                            event: "pluginCountdownReady"
                        }), (t = N.getSelector(t)).length < 1 || void t.each(function() {
                            var e, t = jQuery(this),
                                a = t.attr("data-format") || "dHMS",
                                i = t.attr("data-since"),
                                n = t.attr("data-year"),
                                r = t.attr("data-month"),
                                s = t.attr("data-day"),
                                o = t.attr("data-hour"),
                                l = t.attr("data-minute"),
                                c = t.attr("data-second"),
                                d = t.attr("data-redirect");
                            n && (e = n), r && r < 13 ? e = e + "-" + (r < 10 ? "0" + r : r) : n && (e += "-01"), s && s < 32 ? e = e + "-" + (s < 10 ? "0" + s : s) : n && (e += "-01"), r = "" != e ? new Date(moment(e)) : new Date, o && o < 25 && r.setHours(r.getHours() + Number(o)), l && l < 60 && r.setMinutes(r.getMinutes() + Number(l)), c && c < 60 && r.setSeconds(r.getSeconds() + Number(c)), d = d || !1, "true" == i ? t.countdown({
                                since: r,
                                format: a,
                                expiryUrl: d
                            }) : t.countdown({
                                until: r,
                                format: a,
                                expiryUrl: d
                            })
                        }))
                    })
                }
            },
            GoogleMaps: {
                init: function(t) {
                    return N.getSelector(t, !1, !1).length < 1 || (N.getOptions.gmapAPI ? (N.loadJS({
                        file: "https://maps.google.com/maps/api/js?key=" + N.getOptions.gmapAPI + "&callback=SEMICOLON.Modules.gmap",
                        id: "canvas-gmapapi-js"
                    }), void N.isFuncTrue(function() {
                        return "undefined" != typeof jQuery && "undefined" != typeof google && jQuery().gMap
                    }).then(function(e) {
                        return !!e && (N.initFunction({
                            class: "has-plugin-gmap",
                            event: "pluginGmapReady"
                        }), (t = N.getSelector(t)).length < 1 || void t.each(function() {
                            var e = jQuery(this),
                                t = e.attr("data-latitude"),
                                a = e.attr("data-longitude"),
                                i = e.attr("data-address"),
                                n = e.attr("data-content"),
                                r = e.attr("data-scrollwheel") || !0,
                                s = e.attr("data-maptype") || "ROADMAP",
                                o = e.attr("data-zoom") || 12,
                                l = e.attr("data-styles"),
                                c = e.attr("data-markers"),
                                d = e.attr("data-icon"),
                                u = e.attr("data-control-pan") || !1,
                                p = e.attr("data-control-zoom") || !1,
                                g = e.attr("data-control-maptype") || !1,
                                f = e.attr("data-control-scale") || !1,
                                h = e.attr("data-control-streetview") || !1,
                                m = e.attr("data-control-overview") || !1;
                            if (i) t = a = !1;
                            else if (!t && !a) return console.log("Google Map co-ordinates not entered."), !0;
                            l = l && JSON.parse(l), "false" == r && (r = !1), "true" == u && (u = !0), "true" == p && (p = !0), "true" == g && (g = !0), "true" == f && (f = !0), "true" == h && (h = !0), "true" == m && (m = !0), c = c ? Function("return " + c)() : i ? [{
                                address: i,
                                html: n || i
                            }] : [{
                                latitude: t,
                                longitude: a,
                                html: n || !1
                            }], d = d ? Function("return " + d)() : {
                                image: "https://www.google.com/mapfiles/marker.png",
                                shadow: "https://www.google.com/mapfiles/shadow50.png",
                                iconsize: [20, 34],
                                shadowsize: [37, 34],
                                iconanchor: [9, 34],
                                shadowanchor: [19, 34]
                            }, e.gMap({
                                controls: {
                                    panControl: u,
                                    zoomControl: p,
                                    mapTypeControl: g,
                                    scaleControl: f,
                                    streetViewControl: h,
                                    overviewMapControl: m
                                },
                                scrollwheel: r,
                                maptype: s,
                                markers: c,
                                icon: d,
                                latitude: t,
                                longitude: a,
                                address: i,
                                zoom: Number(o),
                                styles: l
                            })
                        }))
                    })) : (console.warn("No API Key defined for Google Maps! Please set an API Key in js/functions.js File!"), !0))
                }
            },
            RoundedSkills: {
                init: function(t) {
                    if (N.getSelector(t, !1, !1).length < 1) return !0;
                    N.isFuncTrue(function() {
                        return "undefined" != typeof jQuery && jQuery().easyPieChart
                    }).then(function(e) {
                        return !!e && (N.initFunction({
                            class: "has-plugin-piechart",
                            event: "pluginRoundedSkillReady"
                        }), (t = N.getSelector(t)).length < 1 || void t.each(function() {
                            var a = jQuery(this),
                                e = a.attr("data-size") || 140,
                                t = a.attr("data-speed") || 2e3,
                                i = a.attr("data-width") || 4,
                                n = a.attr("data-color") || "#0093BF",
                                r = a.attr("data-trackcolor") || "rgba(0,0,0,0.04)",
                                s = {
                                    size: Number(e),
                                    speed: Number(t),
                                    width: Number(i),
                                    color: n,
                                    trackcolor: r
                                };
                            a.css({
                                width: e + "px",
                                height: e + "px",
                                "line-height": e + "px"
                            }), jQuery("body").hasClass("device-up-lg") ? (a.animate({
                                opacity: 0
                            }, 10), new IntersectionObserver(function(e, t) {
                                e.forEach(function(e) {
                                    e.isIntersecting && (a.hasClass("skills-animated") || (setTimeout(function() {
                                        a.css({
                                            opacity: 1
                                        })
                                    }, 100), J(a, s), a.addClass("skills-animated")), t.unobserve(e.target))
                                })
                            }, {
                                rootMargin: "0px 0px 50px"
                            }).observe(a[0])) : J(a, s)
                        }))
                    })
                }
            },
            Progress: {
                init: function(t) {
                    if (N.getSelector(t, !1, !1).length < 1) return !0;
                    N.isFuncTrue(function() {
                        return "undefined" != typeof jQuery && jQuery().countTo
                    }).then(function(e) {
                        if (N.initFunction({
                                class: "has-plugin-progress",
                                event: "pluginProgressReady"
                            }), (t = N.getSelector(t, !1)).length < 1) return !0;
                        t.forEach(function(a) {
                            var i = a.getAttribute("data-percent") || 90,
                                e = a.getAttribute("data-speed") || 1200,
                                n = a.querySelector(".skill-progress-percent"),
                                e = Number(e) + "ms";
                            n.style.setProperty("--cnvs-progress-speed", e), new IntersectionObserver(function(e, t) {
                                e.forEach(function(e) {
                                    e.isIntersecting && (n.classList.contains("skill-animated") || (S.counter(a.querySelector(".counter")), a.classList.contains("skill-progress-vertical") ? n.style.height = i + "%" : n.style.width = i + "%", n.classList.add("skill-animated")), t.unobserve(e.target))
                                })
                            }, {
                                rootMargin: "0px 0px 50px"
                            }).observe(n)
                        })
                    })
                }
            },
            Twitter: {
                init: function(e) {
                    return N.getSelector(e, !1, !1).length < 1 || (N.initFunction({
                        class: "has-plugin-twitter",
                        event: "pluginTwitterFeedReady"
                    }), (e = N.getSelector(e, !1, !1)).length < 1) || void e.forEach(function(o) {
                        var l = o.getAttribute("data-username") || "twitter",
                            c = o.getAttribute("data-count") || 3,
                            e = o.getAttribute("data-loader") || "include/twitter/tweets.php",
                            t = o.getAttribute("data-fetch-message") || "Fetching Tweets from Twitter...",
                            a = o.querySelector(".twitter-widget-alert");
                        a || ((a = document.createElement("div")).classList.add("alert", "alert-warning", "twitter-widget-alert", "text-center"), o.prepend(a), a.innerHTML = '<div class="spinner-grow spinner-grow-sm me-2" role="status"><span class="visually-hidden">Loading...</span></div> ' + t), fetch(e + "?username=" + l).then(function(e) {
                            return e.json()
                        }).then(function(e) {
                            if ("object" == typeof e && !e.isArray()) return !1;
                            a.remove();
                            var t, s = 0;
                            e ? .some(function(e) {
                                var t, a, i, n, r;
                                s != Number(c) && (e = e, a = l, n = (t = o).getAttribute("data-font-class") || "font-body", r = e.text.replace(/((https?|s?ftp|ssh)\:\/\/[^"\s\<\>]*[^.,;'">\:\s\<\>\)\]\!])/g, function(e) {
                                    return '<a href="' + e + '" target="_blank">' + e + "</a>"
                                }).replace(/\B@([_a-z0-9]+)/gi, function(e) {
                                    return e.charAt(0) + '<a href="https://twitter.com/' + e.substring(1) + '" target="_blank">' + e.substring(1) + "</a>"
                                }), t.classList.contains("fslider") ? ((i = document.createElement("div")).classList.add("slide"), i.innerHTML += '<p class="mb-3 ' + n + '">' + r + '</p><small class="d-block"><a href="https://twitter.com/' + a + "/statuses/" + e.id_str + '" target="_blank">' + G(e.created_at) + "</a></small>", t.querySelector(".slider-wrap").append(i)) : t.innerHTML += '<li><i class="fa-brands fa-twitter"></i><div><span>' + r + '</span><small><a href="https://twitter.com/' + a + "/statuses/" + e.id_str + '" target="_blank">' + G(e.created_at) + "</a></small></div></li>", s++)
                            }), o.classList.contains("fslider") && (t = setInterval(function() {
                                1 < o.querySelectorAll(".slide").length && (o.classList.remove("customjs"), setTimeout(function() {
                                    S.flexSlider(), jQuery(o).find(".flexslider .slide").resize()
                                }, 500), clearInterval(t))
                            }, 1e3))
                        }).catch(function(e) {
                            console.log(e), a.classList.remove("alert-warning"), a.classList.add("alert-danger"), a.innerHTML = "Could not fetch Tweets from Twitter API. Please try again later."
                        })
                    })
                }
            },
            Flickr: {
                init: function(t) {
                    if (N.getSelector(t, !1, !1).length < 1) return !0;
                    N.isFuncTrue(function() {
                        return "undefined" != typeof jQuery && jQuery().jflickrfeed
                    }).then(function(e) {
                        return !!e && (N.initFunction({
                            class: "has-plugin-flickr",
                            event: "pluginFlickrFeedReady"
                        }), (t = N.getSelector(t, !0, !1)).length < 1 || void t.each(function() {
                            var t = jQuery(this),
                                e = t.attr("data-id"),
                                a = t.attr("data-count") || 9,
                                i = "group" == t.attr("data-type") ? "groups_pool.gne" : "photos_public.gne";
                            t.jflickrfeed({
                                feedapi: i,
                                limit: Number(a),
                                qstrings: {
                                    id: e
                                },
                                itemTemplate: '<a class="grid-item" href="{{image_b}}" title="{{title}}" data-lightbox="gallery-item"><img src="{{image_s}}" alt="{{title}}" /></a>'
                            }, function(e) {
                                t.removeClass("customjs"), N.imagesLoaded(t[0]), S.lightbox(), t[0].addEventListener("CanvasImagesLoaded", function() {
                                    S.gridInit(), S.masonryThumbs()
                                })
                            })
                        }))
                    })
                }
            },
            Instagram: {
                init: function(e) {
                    return N.getSelector(e, !1, !1).length < 1 || (N.initFunction({
                        class: "has-plugin-instagram",
                        event: "pluginInstagramReady"
                    }), (e = N.getSelector(e, !1, !1)).length < 1) || void e.forEach(function(e) {
                        var n, r, s, t = e.getAttribute("data-count") || 12,
                            a = e.getAttribute("data-loader") || "include/instagram/instagram.php",
                            i = e.getAttribute("data-fetch-message") || "Fetching Photos from Instagram...";
                        12 < Number(t) && (t = 12), a = a, r = t, t = i, (s = (n = e).closest(".instagram-widget-alert")) || ((s = document.createElement("div")).classList.add("alert", "alert-warning", "instagram-widget-alert", "text-center"), n.insertAdjacentElement("beforebegin", s), s.innerHTML = '<div class="spinner-grow spinner-grow-sm me-2" role="status"><span class="visually-hidden">Loading...</span></div> ' + t), fetch(a).then(function(e) {
                            return e.json()
                        }).then(function(e) {
                            if (0 < e.length) {
                                s.remove();
                                for (var t, a, i = 0; i < r; i++) i !== r && (a = (t = e[i]).media_url, "VIDEO" === t.media_type && (a = t.thumbnail_url), n.innerHTML += '<a class="grid-item" href="' + t.permalink + '" target="_blank"><img src="' + a + '" alt="Image"></a>')
                            }
                            n.classList.remove("customjs"), N.imagesLoaded(n), n.addEventListener("CanvasImagesLoaded", function() {
                                S.masonryThumbs(), S.lightbox()
                            })
                        }).catch(function(e) {
                            console.log(e), s.classList.remove("alert-warning"), s.classList.add("alert-danger"), s.innerHTML = "Could not fetch Photos from Instagram API. Please try again later."
                        })
                    })
                }
            },
            NavTree: {
                init: function(t) {
                    if (N.getSelector(t, !1, !1).length < 1) return !0;
                    N.isFuncTrue(function() {
                        return "undefined" != typeof jQuery
                    }).then(function(e) {
                        return !!e && (N.initFunction({
                            class: "has-plugin-navtree",
                            event: "pluginNavTreeReady"
                        }), (t = N.getSelector(t)).length < 1 || void t.each(function() {
                            var t = jQuery(this),
                                a = t.attr("data-speed") || 250,
                                i = t.attr("data-easing") || "swing",
                                e = t.attr("data-arrow-class") || "fa-solid fa-angle-right";
                            t.find("ul li:has(ul)").addClass("sub-menu"), t.find("ul li:has(ul) > a").filter(":not(:has(.sub-menu-indicator))").append('<i class="sub-menu-indicator ' + e + '"></i>'), t.hasClass("on-hover") ? t.find("ul li:has(ul):not(.active)").hover(function(e) {
                                jQuery(this).children("ul").stop(!0, !0).slideDown(Number(a), i)
                            }, function() {
                                jQuery(this).children("ul").delay(250).slideUp(Number(a), i)
                            }) : t.find("ul li:has(ul) > a").off("click").on("click", function() {
                                var e = jQuery(this);
                                return t.find("ul li").not(e.parents()).removeClass("active"), e.parent().children("ul").slideToggle(Number(a), i, function() {
                                    jQuery(this).find("ul").hide(), jQuery(this).find("li.active").removeClass("active")
                                }), t.find("ul li > ul").not(e.parent().children("ul")).not(e.parents("ul")).slideUp(Number(a), i), e.parent("li:has(ul)").toggleClass("active"), !0
                            })
                        }))
                    })
                }
            },
            Carousel: {
                init: function(t) {
                    if (N.getSelector(t, !1, !1).length < 1) return !0;
                    N.isFuncTrue(function() {
                        return "undefined" != typeof jQuery && jQuery().owlCarousel
                    }).then(function(e) {
                        return !!e && (N.initFunction({
                            class: "has-plugin-carousel",
                            event: "pluginCarouselReady"
                        }), (t = N.getSelector(t)).length < 1 || void t.each(function() {
                            var e = jQuery(this),
                                t = e.attr("data-items") || 4,
                                t = e.attr("data-items-xs") || Number(t),
                                a = e.attr("data-items-sm") || Number(t),
                                i = e.attr("data-items-md") || Number(a),
                                n = e.attr("data-items-lg") || Number(i),
                                r = e.attr("data-items-xl") || Number(n),
                                s = e.attr("data-items-xxl") || Number(r),
                                o = e.attr("data-loop"),
                                l = e.attr("data-autoplay"),
                                c = e.attr("data-speed") || 250,
                                d = e.attr("data-animate-in"),
                                u = e.attr("data-animate-out"),
                                p = e.attr("data-auto-width"),
                                g = e.attr("data-nav"),
                                f = e.attr("data-nav-prev") || '<i class="uil uil-angle-left-b"></i>',
                                h = e.attr("data-nav-next") || '<i class="uil uil-angle-right-b"></i>',
                                m = e.attr("data-pagi"),
                                v = e.attr("data-margin") || 20,
                                y = e.attr("data-stage-padding") || 0,
                                b = e.attr("data-merge"),
                                S = e.attr("data-start") || 0,
                                w = e.attr("data-rewind"),
                                L = e.attr("data-slideby") || 1,
                                x = e.attr("data-center"),
                                k = e.attr("data-lazyload"),
                                V = e.attr("data-video"),
                                A = e.attr("data-rtl"),
                                C = 5e3,
                                E = !0,
                                L = "page" == L ? "page" : Number(L),
                                o = "true" == o,
                                d = (l ? (C = Number(l), l = !0) : E = l = !1, d || !1),
                                u = u || !1,
                                p = "true" == p,
                                g = "false" != g,
                                m = "false" != m,
                                w = "true" == w,
                                b = "true" == b,
                                x = "true" == x,
                                k = "true" == k,
                                V = "true" == V,
                                A = !("true" != A && !jQuery("body").hasClass("rtl")),
                                M = e.owlCarousel({
                                    margin: Number(v),
                                    loop: o,
                                    stagePadding: Number(y),
                                    merge: b,
                                    startPosition: Number(S),
                                    rewind: w,
                                    slideBy: L,
                                    center: x,
                                    lazyLoad: k,
                                    autoWidth: p,
                                    nav: g,
                                    navText: [f, h],
                                    autoplay: l,
                                    autoplayTimeout: C,
                                    autoplayHoverPause: E,
                                    dots: m,
                                    smartSpeed: Number(c),
                                    fluidSpeed: Number(c),
                                    video: V,
                                    animateIn: d,
                                    animateOut: u,
                                    rtl: A,
                                    responsive: {
                                        0: {
                                            items: t
                                        },
                                        576: {
                                            items: a
                                        },
                                        768: {
                                            items: i
                                        },
                                        992: {
                                            items: n
                                        },
                                        1200: {
                                            items: r
                                        },
                                        1400: {
                                            items: s
                                        }
                                    },
                                    onInitialized: function() {
                                        T.sliderDimensions(e.parents(".slider-element")[0]), N.runContainerModules(e[0]), 0 < e.find(".owl-dot").length && e.addClass("with-carousel-dots")
                                    }
                                });
                            jQuery(window).on("lazyLoadLoaded", function() {
                                e.find(".lazy").length == e.find(".lazy.lazy-loaded").length && (lazyLoadInstance.update(), setTimeout(function() {
                                    M.trigger("refresh.owl.carousel")
                                }, 500))
                            })
                        }))
                    })
                }
            },
            MasonryThumbs: {
                init: function(t) {
                    if (N.getSelector(t, !1, !1).length < 1) return !0;
                    N.isFuncTrue(function() {
                        return "undefined" != typeof jQuery && "undefined" != typeof Isotope
                    }).then(function(e) {
                        return !!e && (N.initFunction({
                            class: "has-plugin-masonrythumbs",
                            event: "pluginMasonryThumbsReady"
                        }), (t = N.getSelector(t)).length < 1 || (t.each(function() {
                            var e = jQuery(this),
                                t = e.children(),
                                a = e.attr("data-big");
                            if (t.length < 1) return !1;
                            t.removeClass("grid-item-big").css({
                                width: ""
                            });
                            var i = window.getComputedStyle(t.eq(0)[0]),
                                n = Number(i.getPropertyValue("width").split("px")[0]);
                            if (0 < e.filter(".has-init-isotope").length && e.isotope({
                                    masonry: {
                                        columnWidth: n
                                    }
                                }), a)
                                for (var r, a = a.split(","), s = "", s = 0; s < a.length; s++) r = Number(a[s]) - 1, t.eq(r).addClass("grid-item-big");
                            setTimeout(function() {
                                e.find(".grid-item-big").css({
                                    width: 2 * n + "px"
                                })
                            }, 500), setTimeout(function() {
                                e.filter(".has-init-isotope").isotope("layout")
                            }, 1e3), e[0].addEventListener("transitionend", function() {
                                S.readmore()
                            })
                        }), void(N.getVars.resizers.masonryThumbs = function() {
                            S.masonryThumbs()
                        })))
                    })
                }
            },
            Notifications: {
                init: function(f) {
                    if (N.getSelector(f, !1, !1).length < 1) return !0;
                    N.isFuncTrue(function() {
                        return "undefined" != typeof jQuery && "undefined" != typeof bootstrap
                    }).then(function(e) {
                        if (e) {
                            if (N.initFunction({
                                    class: "has-plugin-notify",
                                    event: "pluginNotifyReady"
                                }), (f = N.getSelector(f)).length < 1) return !0;
                            var t, a, i = f,
                                e = i.attr("data-notify-position") || "top-right",
                                n = i.attr("data-notify-type"),
                                r = i.attr("data-notify-msg") || "Please set a message!",
                                s = i.attr("data-notify-timeout") || 5e3,
                                o = i.attr("data-notify-close") || "true",
                                l = i.attr("data-notify-autohide") || "true",
                                c = "toast-" + Math.floor(1e4 * Math.random()),
                                d = i.attr("data-notify-trigger") || "self",
                                u = i.attr("data-notify-target"),
                                p = "";
                            switch (0 < jQuery(u).length && "self" == d && (bootstrap.Toast.getOrCreateInstance(jQuery(u).get(0)).hide(), jQuery(u).get(0).addEventListener("hidden.bs.toast", function() {
                                CNVS.Notifications.init(f)
                            })), n) {
                                case "primary":
                                    a = "text-white bg-primary border-0";
                                    break;
                                case "warning":
                                    a = "text-dark bg-warning border-0";
                                    break;
                                case "error":
                                    a = "text-white bg-danger border-0";
                                    break;
                                case "success":
                                    a = "text-white bg-success border-0";
                                    break;
                                case "info":
                                    a = "bg-info text-dark border-0";
                                    break;
                                case "dark":
                                    a = "text-white bg-dark border-0";
                                    break;
                                default:
                                    a = ""
                            }
                            switch (e) {
                                case "top-left":
                                    t = "top-0 start-0";
                                    break;
                                case "top-center":
                                    t = "top-0 start-50 translate-middle-x";
                                    break;
                                case "middle-left":
                                    t = "top-50 start-0 translate-middle-y";
                                    break;
                                case "middle-center":
                                    t = "top-50 start-50 translate-middle";
                                    break;
                                case "middle-right":
                                    t = "top-50 end-0 translate-middle-y";
                                    break;
                                case "bottom-left":
                                    t = "bottom-0 start-0";
                                    break;
                                case "bottom-center":
                                    t = "bottom-0 start-50 translate-middle-x";
                                    break;
                                case "bottom-right":
                                    t = "bottom-0 end-0";
                                    break;
                                default:
                                    t = "top-0 end-0"
                            }
                            e = "info" != n && "warning" != n && n ? "btn-close-white" : "", l = "true" == l, n = '<div class="position-fixed ' + t + ' p-3" style="z-index: 999999;"><div id="' + c + '" class="toast p-2 hide ' + a + '" role="alert" aria-live="assertive" aria-atomic="true"><div class="d-flex"><div class="toast-body">' + r + "</div>" + (p = "true" == o ? '<button type="button" class="btn-close ' + e + ' btn-sm me-2 mt-2 ms-auto" data-bs-dismiss="toast" aria-label="Close"></button>' : p) + "</div></div>";
                            "self" != d || u || (i.attr("data-notify-target", "#" + c), jQuery("body").append(n));
                            [].slice.call(document.querySelectorAll(".toast")).map(function(e) {
                                return new bootstrap.Toast(e)
                            }).forEach(function(e) {
                                e.hide()
                            });
                            var r = i.attr("data-notify-target"),
                                g = jQuery(r);
                            g.find(".toast-body");
                            0 < jQuery(r).length && (new bootstrap.Toast(g.get(0), {
                                delay: Number(s),
                                autohide: l
                            }).show(), "self" == d) && g.get(0).addEventListener("hidden.bs.toast", function() {
                                g.parent().remove(), i.get(0).removeAttribute("data-notify-target")
                            })
                        }
                        return !1
                    })
                }
            },
            TextRotator: {
                init: function(t) {
                    if (N.getSelector(t, !1, !1).length < 1) return !0;
                    N.isFuncTrue(function() {
                        return "undefined" != typeof jQuery && jQuery().Morphext && "undefined" != typeof Typed
                    }).then(function(e) {
                        return !!e && (N.initFunction({
                            class: "has-plugin-textrotator",
                            event: "pluginTextRotatorReady"
                        }), (t = N.getSelector(t)).length < 1 || void t.each(function() {
                            var e, t, a, i, n = jQuery(this),
                                r = n.attr("data-typed") || "false",
                                s = n.find(".t-rotate"),
                                o = n.attr("data-rotate") || "fade",
                                l = n.attr("data-speed") || 1200,
                                c = n.attr("data-separator") || ",";
                            "true" == r ? (r = s.html().split(c), t = n.attr("data-loop") || "true", a = n.attr("data-shuffle"), i = n.attr("data-cursor") || "true", l = n.attr("data-speed") || 50, e = n.attr("data-backspeed") || 30, n = n.attr("data-backdelay"), t = "true" == t, a = "true" == a, i = "true" == i, s.html("").addClass("plugin-typed-init"), new Typed(s[0], {
                                strings: r,
                                typeSpeed: Number(l),
                                loop: t,
                                shuffle: a,
                                showCursor: i,
                                backSpeed: Number(e),
                                backDelay: Number(n)
                            })) : s.Morphext({
                                animation: o,
                                separator: c,
                                speed: Number(l)
                            })
                        }))
                    })
                }
            },
            OnePage: (r = function(e, t) {
                t = "scrollTo" == t ? e.getAttribute("data-scrollto") : e.getAttribute("data-href");
                return document.querySelector(t)
            }, c = function(t, a, e) {
                setTimeout(function() {
                    var e = N.offset(t).top;
                    if (!a) return !1;
                    N.scrollTo(e - Number(a.offset), a.speed, a.easing)
                }, Number(e))
            }, d = function(e, t, a = !0) {
                var i, n, r, s, o, l = N.getVars.elBody.classList;
                return void 0 === e || t.length < 1 || !(!e.hasAttribute("data-onepage-settings") || !a) || (e = {
                    offset: N.getVars.topScrollOffset,
                    speed: 1250,
                    easing: !1
                }, a = {}, o = {}, i = t.closest(".one-page-menu"), o.offset = i ? .getAttribute("data-offset") || e.offset, o.speed = i ? .getAttribute("data-speed") || e.speed, o.easing = i ? .getAttribute("data-easing") || e.easing, i = {
                    offset: t.getAttribute("data-offset") || o.offset,
                    speed: t.getAttribute("data-speed") || o.speed,
                    easing: t.getAttribute("data-easing") || o.easing
                }, e = t.getAttribute("data-offset-xxl"), o = t.getAttribute("data-offset-xl"), s = t.getAttribute("data-offset-lg"), r = t.getAttribute("data-offset-md"), n = t.getAttribute("data-offset-sm"), t = (t = t.getAttribute("data-offset-xs")) || Number(i.offset), n = n || Number(t), r = r || Number(n), s = s || Number(r), o = o || Number(s), e = e || Number(o), l.contains("device-xs") ? i.offset = t : l.contains("device-sm") ? i.offset = n : l.contains("device-md") ? i.offset = r : l.contains("device-lg") ? i.offset = s : l.contains("device-xl") ? i.offset = o : l.contains("device-xxl") && (i.offset = e), a.offset = Number(i.offset), a.speed = Number(i.speed), a.easing = i.easing, a)
            }, {
                init: function(e) {
                    var t;
                    return N.getSelector(e, !1, !1).length < 1 || (N.initFunction({
                        class: "has-plugin-onepage",
                        event: "pluginOnePageReady"
                    }), (e = N.getSelector(e, !1)).length < 1) || (t = N.filtered(e, "[data-scrollto]"), e = N.filtered(e, ".one-page-menu"), 0 < t.length && (N.getVars.elLinkScrolls = t), 0 < e.length && (N.getVars.elOnePageMenus = e), D(), C(), window.addEventListener("scroll", function() {
                        C()
                    }, {
                        passive: !0
                    }), void(N.getVars.resizers.onepage = function() {
                        D(), C()
                    }))
                }
            }),
            AjaxForm: {
                init: function(t) {
                    if (N.getSelector(t, !1, !1).length < 1) return !0;
                    N.isFuncTrue(function() {
                        return "undefined" != typeof jQuery && jQuery().validate && jQuery().ajaxSubmit
                    }).then(function(e) {
                        return !!e && (N.initFunction({
                            class: "has-plugin-form",
                            event: "pluginFormReady"
                        }), (t = N.getSelector(t)).length < 1 || void t.each(function() {
                            var i, n, e = jQuery(this),
                                r = jQuery("body"),
                                s = e.find("form").attr("id"),
                                o = e.attr("data-alert-type"),
                                l = e.attr("data-loader"),
                                c = e.find(".form-result"),
                                d = e.attr("data-redirect"),
                                o = o || "notify";
                            s && r.addClass(s + "-ready"), e.find("form").validate({
                                errorPlacement: function(e, t) {
                                    0 < t.parents(".form-group").length ? e.appendTo(t.parents(".form-group")) : e.insertAfter(t)
                                },
                                focusCleanup: !0,
                                submitHandler: function(a) {
                                    if (e.hasClass("custom-submit")) return jQuery(a).submit(), !0;
                                    c.hide(), "button" == l ? (i = jQuery(a).find("button"), defaultBtnText = i.html(), i.html('<i class="bi-arrow-repeat icon-spin m-0"></i>')) : jQuery(a).find(".form-process").fadeIn(), s && r.removeClass(s + "-ready " + s + "-complete " + s + "-success " + s + "-error").addClass(s + "-processing"), jQuery(a).ajaxSubmit({
                                        target: c,
                                        dataType: "json",
                                        success: function(e) {
                                            if ("button" == l ? i.html(defaultBtnText) : jQuery(a).find(".form-process").fadeOut(), "error" != e.alert && d) return window.location.replace(d), !0;
                                            var t;
                                            "inline" == o ? (n = "error" == e.alert ? "alert-danger" : "alert-success", c.removeClass("alert-danger alert-success").addClass("alert " + n).html(e.message).slideDown(400)) : "notify" == o && (c.attr("data-notify-type", e.alert).attr("data-notify-msg", e.message).html(""), S.notifications(c)), "error" != e.alert ? (jQuery(a).resetForm(), jQuery(a).find(".btn-group > .btn").removeClass("active"), "undefined" != typeof tinyMCE && tinyMCE.activeEditor && !tinyMCE.activeEditor.isHidden() && tinymce.activeEditor.setContent(""), 0 < (t = jQuery(a).find(".input-range-slider")).length && t.each(function() {
                                                jQuery(this).data("ionRangeSlider").reset()
                                            }), 0 < (t = jQuery(a).find(".input-rating")).length && t.each(function() {
                                                jQuery(this).rating("reset")
                                            }), 0 < (t = jQuery(a).find(".selectpicker")).length && t.each(function() {
                                                jQuery(this).selectpicker("val", ""), jQuery(this).selectpicker("deselectAll")
                                            }), jQuery(a).find(".input-select2,select[data-selectsplitter-firstselect-selector]").change(), jQuery(a).trigger("formSubmitSuccess", e), r.removeClass(s + "-error").addClass(s + "-success")) : (jQuery(a).trigger("formSubmitError", e), r.removeClass(s + "-success").addClass(s + "-error")), s && r.removeClass(s + "-processing").addClass(s + "-complete"), 0 < jQuery(a).find(".g-recaptcha").children("div").length && grecaptcha.reset()
                                        }
                                    })
                                }
                            })
                        }))
                    })
                }
            },
            Subscribe: {
                init: function(t) {
                    if (N.getSelector(t, !1, !1).length < 1) return !0;
                    N.isFuncTrue(function() {
                        return "undefined" != typeof jQuery && jQuery().validate && jQuery().ajaxSubmit
                    }).then(function(e) {
                        return !!e && (N.initFunction({
                            class: "has-plugin-form",
                            event: "pluginFormReady"
                        }), (t = N.getSelector(t)).length < 1 || void t.each(function() {
                            var a, i, n, e = jQuery(this),
                                r = e.attr("data-alert-type"),
                                s = e.attr("data-loader"),
                                o = e.find(".widget-subscribe-form-result"),
                                l = e.attr("data-redirect");
                            e.find("form").validate({
                                submitHandler: function(t) {
                                    o.hide(), "button" == s ? (a = jQuery(t).find("button"), i = a.html(), a.html('<i class="bi-arrow-repeat icon-spin nomargin"></i>')) : jQuery(t).find(".bi-envelope-plus").removeClass("bi-envelope-plus").addClass("bi-arrow-repeat icon-spin"), jQuery(t).ajaxSubmit({
                                        target: o,
                                        dataType: "json",
                                        resetForm: !0,
                                        success: function(e) {
                                            if ("button" == s ? a.html(i) : jQuery(t).find(".bi-arrow-repeat").removeClass("bi-arrow-repeat icon-spin").addClass("bi-envelope-plus"), "error" != e.alert && l) return window.location.replace(l), !0;
                                            "inline" == r ? (n = "error" == e.alert ? "alert-danger" : "alert-success", o.addClass("alert " + n).html(e.message).slideDown(400)) : (o.attr("data-notify-type", e.alert).attr("data-notify-msg", e.message).html(""), S.notifications(o))
                                        }
                                    })
                                }
                            })
                        }))
                    })
                }
            },
            Conditional: {
                init: function(e) {
                    return N.getSelector(e, !1, !1).length < 1 || (N.initFunction({
                        class: "has-plugin-conditional",
                        event: "pluginConditionalReady"
                    }), (e = N.getSelector(e, !1)).length < 1) || void e.forEach(function(e) {
                        var t = e,
                            e = t.getAttribute("data-condition") || "==",
                            a = t.getAttribute("data-condition-target"),
                            i = t.getAttribute("data-condition-value"),
                            n = t.getAttribute("data-condition-check") || "value",
                            r = document.querySelector('[id*="' + a + '"]'),
                            s = r.value,
                            o = r.type,
                            l = {
                                operator: e,
                                field: a,
                                value: i
                            },
                            e = r.tagName.toLowerCase(),
                            a = "checkbox" == o || "select" == e || "radio" == o ? "change" : "input";
                        "checkbox" == o && (s = r.checked ? r.value : 0), "radio" == o && (s = r.checked ? r.value : ""), A(t, s, l, n, r), r.addEventListener(a, function() {
                            s = "checkbox" == o ? r.checked ? r.value : 0 : "radio" != o || r.checked ? r.value : "", A(t, s, l, n, r)
                        }), "validate" == n && new MutationObserver(function(e) {
                            e.forEach(function(e) {
                                A(t, s, l, n, r)
                            })
                        }).observe(r, {
                            attributes: !0,
                            characterData: !0,
                            childList: !0,
                            subtree: !0,
                            attributeOldValue: !0,
                            characterDataOldValue: !0
                        })
                    })
                }
            },
            ShapeDivider: {
                init: function(e) {
                    return N.getSelector(e, !1, !1).length < 1 || (N.initFunction({
                        class: "has-plugin-shapedivider",
                        event: "pluginShapeDividerReady"
                    }), (e = N.getSelector(e, !1)).length < 1) || void e.forEach(function(e) {
                        var t = e.getAttribute("data-shape") || "valley",
                            a = e.getAttribute("data-width") || 100,
                            i = e.getAttribute("data-height") || 100,
                            n = e.getAttribute("data-fill"),
                            r = e.getAttribute("data-outside") || "false",
                            s = e.getAttribute("data-position") || "top",
                            o = "shape-divider-" + Math.floor(1e4 * Math.random()),
                            l = "",
                            c = "";
                        if (e.classList.contains("shape-divider-complete")) return !0;
                        a < 100 && (a = 100);
                        var a = "width: calc( " + Number(a) + "% + 1.5px );",
                            d = "height: " + Number(i) + "px;",
                            n = "fill: " + n + ";",
                            r = (c = "true" == r ? "bottom" == s ? "#" + o + ".shape-divider { bottom: -" + (Number(i) - 1) + "px; } " : "#" + o + ".shape-divider { top: -" + (Number(i) - 1) + "px; } " : c) + "#" + o + ".shape-divider svg { " + a + d + " } #" + o + ".shape-divider .shape-divider-fill { " + n + " }",
                            s = document.createElement("style");
                        switch (N.getVars.elHead.appendChild(s), s.appendChild(document.createTextNode(r)), e.setAttribute("id", o), t) {
                            case "valley":
                                l = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 355" preserveAspectRatio="none"><defs><style>.b{opacity:.5}.c{opacity:.3}</style></defs><path fill="none" d="M999.45 0H0v165.72l379.95 132.46L999.45 0z"></path><path class="b shape-divider-fill" d="M379.95 298.18l28.47 9.92L1000 118.75V0h-.55l-619.5 298.18zM492.04 337.25L1000 252.63V118.75L408.42 308.1l83.62 29.15z"></path><path class="b shape-divider-fill" d="M492.04 337.25L1000 252.63V118.75L408.42 308.1l83.62 29.15z"></path><path class="shape-divider-fill" d="M530.01 350.49l20.22 4.51H1000V252.63l-507.96 84.62 37.97 13.24z"></path><path class="b shape-divider-fill" d="M530.01 350.49l20.22 4.51H1000V252.63l-507.96 84.62 37.97 13.24z"></path><path class="b shape-divider-fill" d="M530.01 350.49l20.22 4.51H1000V252.63l-507.96 84.62 37.97 13.24z"></path><path class="shape-divider-fill" d="M542.94 355h7.29l-20.22-4.51 12.93 4.51z"></path><path class="b shape-divider-fill" d="M542.94 355h7.29l-20.22-4.51 12.93 4.51z"></path><path class="c shape-divider-fill" d="M542.94 355h7.29l-20.22-4.51 12.93 4.51z"></path><path class="b shape-divider-fill" d="M542.94 355h7.29l-20.22-4.51 12.93 4.51z"></path><path class="c shape-divider-fill" d="M379.95 298.18L0 165.72v66.59l353.18 78.75 26.77-12.88z"></path><path class="c shape-divider-fill" d="M353.18 311.06L0 232.31v71.86l288.42 38.06 64.76-31.17z"></path><path class="c shape-divider-fill" d="M353.18 311.06L0 232.31v71.86l288.42 38.06 64.76-31.17z"></path><path class="b shape-divider-fill" d="M380.28 317.11l28.14-9.01-28.47-9.92-26.77 12.88 27.1 6.05z"></path><path class="c shape-divider-fill" d="M380.28 317.11l28.14-9.01-28.47-9.92-26.77 12.88 27.1 6.05z"></path><path class="b shape-divider-fill" d="M479.79 339.29l12.25-2.04-83.62-29.15-28.14 9.01 99.51 22.18z"></path><path class="b shape-divider-fill" d="M479.79 339.29l12.25-2.04-83.62-29.15-28.14 9.01 99.51 22.18z"></path><path class="c shape-divider-fill" d="M479.79 339.29l12.25-2.04-83.62-29.15-28.14 9.01 99.51 22.18z"></path><path class="shape-divider-fill" d="M530.01 350.49l-37.97-13.24-12.25 2.04 50.22 11.2z"></path><path class="b shape-divider-fill" d="M530.01 350.49l-37.97-13.24-12.25 2.04 50.22 11.2z"></path><path class="b shape-divider-fill" d="M530.01 350.49l-37.97-13.24-12.25 2.04 50.22 11.2z"></path><path class="c shape-divider-fill" d="M530.01 350.49l-37.97-13.24-12.25 2.04 50.22 11.2zM288.42 342.23l9.46 1.25 82.4-26.37-27.1-6.05-64.76 31.17z"></path><path class="b shape-divider-fill" d="M288.42 342.23l9.46 1.25 82.4-26.37-27.1-6.05-64.76 31.17z"></path><path class="c shape-divider-fill" d="M288.42 342.23l9.46 1.25 82.4-26.37-27.1-6.05-64.76 31.17z"></path><path class="b shape-divider-fill" d="M380.28 317.11l-82.4 26.37 87.3 11.52h.34l94.27-15.71-99.51-22.18z"></path><path class="c shape-divider-fill" d="M380.28 317.11l-82.4 26.37 87.3 11.52h.34l94.27-15.71-99.51-22.18z"></path><path class="b shape-divider-fill" d="M380.28 317.11l-82.4 26.37 87.3 11.52h.34l94.27-15.71-99.51-22.18z"></path><path class="c shape-divider-fill" d="M380.28 317.11l-82.4 26.37 87.3 11.52h.34l94.27-15.71-99.51-22.18z"></path><path class="shape-divider-fill" d="M479.79 339.29L385.52 355h157.42l-12.93-4.51-50.22-11.2z"></path><path class="b shape-divider-fill" d="M479.79 339.29L385.52 355h157.42l-12.93-4.51-50.22-11.2z"></path><path class="c shape-divider-fill" d="M479.79 339.29L385.52 355h157.42l-12.93-4.51-50.22-11.2z"></path><path class="b shape-divider-fill" d="M479.79 339.29L385.52 355h157.42l-12.93-4.51-50.22-11.2z"></path><path class="c shape-divider-fill" d="M479.79 339.29L385.52 355h157.42l-12.93-4.51-50.22-11.2z"></path><path class="shape-divider-fill" d="M288.42 342.23L0 304.17V355h385.18l-87.3-11.52-9.46-1.25z"></path></svg>';
                                break;
                            case "valley-2":
                                l = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none"><path class="shape-divider-fill" d="M194,99c186.7,0.7,305-78.3,306-97.2c1,18.9,119.3,97.9,306,97.2c114.3-0.3,194,0.3,194,0.3s0-91.7,0-100c0,0,0,0,0-0 L0,0v99.3C0,99.3,79.7,98.7,194,99z"></path></svg>';
                                break;
                            case "valley-3":
                                l = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 140" preserveAspectRatio="none"><path class="shape-divider-fill" d="M1280 0L640 70 0 0v140l640-70 640 70V0z" opacity="0.5"></path><path class="shape-divider-fill" d="M1280 0H0l640 70 640-70z"></path></svg>';
                                break;
                            case "mountain":
                                l = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none"><path class="shape-divider-fill" d="M500,98.9L0,6.1V0h1000v6.1L500,98.9z"></path></svg>';
                                break;
                            case "mountain-2":
                                l = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 140" preserveAspectRatio="none"><path class="shape-divider-fill" d="M640 140L1280 0H0z" opacity="0.5"/><path class="shape-divider-fill" d="M640 98l640-98H0z"/></svg>';
                                break;
                            case "mountain-3":
                                l = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 491.58" preserveAspectRatio="none"><g style="isolation:isolate"><path class="shape-divider-fill" d="M1000 479.4v-87.96L500 0 0 391.46v87.96l500-335.94 500 335.92z" opacity="0.12" mix-blend-mode="overlay"/><path class="shape-divider-fill" d="M1000 487.31v-7.91L500 143.48 0 479.42v7.91l500-297.96 500 297.94z" opacity="0.25" mix-blend-mode="overlay"/><path class="shape-divider-fill" d="M1000 487.31L500 189.37 0 487.33v4.25h1000v-4.27z"/></g></svg>';
                                break;
                            case "mountain-4":
                                l = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none"><path class="shape-divider-fill" d="M738,99l262-93V0H0v5.6L738,99z"></path></svg>';
                                break;
                            case "mountain-5":
                                l = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 140" preserveAspectRatio="none"><path class="shape-divider-fill" d="M978.81 122.25L0 0h1280l-262.1 116.26a73.29 73.29 0 0 1-39.09 5.99z" opacity="0.5"></path><path class="shape-divider-fill" d="M983.19 95.23L0 0h1280l-266 91.52a72.58 72.58 0 0 1-30.81 3.71z"></path></svg>';
                                break;
                            case "mountains":
                                l = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none"><path class="shape-divider-fill" opacity="0.33" d="M473,67.3c-203.9,88.3-263.1-34-320.3,0C66,119.1,0,59.7,0,59.7V0h1000v59.7 c0,0-62.1,26.1-94.9,29.3c-32.8,3.3-62.8-12.3-75.8-22.1C806,49.6,745.3,8.7,694.9,4.7S492.4,59,473,67.3z"></path><path class="shape-divider-fill" opacity="0.66" d="M734,67.3c-45.5,0-77.2-23.2-129.1-39.1c-28.6-8.7-150.3-10.1-254,39.1 s-91.7-34.4-149.2,0C115.7,118.3,0,39.8,0,39.8V0h1000v36.5c0,0-28.2-18.5-92.1-18.5C810.2,18.1,775.7,67.3,734,67.3z"></path><path class="shape-divider-fill" d="M766.1,28.9c-200-57.5-266,65.5-395.1,19.5C242,1.8,242,5.4,184.8,20.6C128,35.8,132.3,44.9,89.9,52.5C28.6,63.7,0,0,0,0 h1000c0,0-9.9,40.9-83.6,48.1S829.6,47,766.1,28.9z"></path></svg>';
                                break;
                            case "mountains-2":
                                l = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 247" preserveAspectRatio="none"><path class="shape-divider-fill" d="M0 200.92v.26l.75-.77-.75.51z"></path><path class="shape-divider-fill" d="M279.29 208.39c0-4.49 74.71-29.88 74.71-29.88l61.71 61.26L550 153.1l134.14 88.17L874.28 50 1000 178.51v-.33L874.28 0 684.14 191.27 550 103.1l-134.29 86.67L354 128.51s-74.71 25.39-74.71 29.88S144.23 52.08 144.23 52.08L.75 200.41l143.48-98.33s135.06 110.8 135.06 106.31z" opacity="0.25" isolation="isolate"></path><path class="shape-divider-fill" d="M1000 178.51L874.28 50 684.14 241.27 550 153.1l-134.29 86.67L354 178.51s-74.71 25.39-74.71 29.88-135.06-106.31-135.06-106.31L.75 200.41l-.75.77V247h1000z"></path><path class="shape-divider-fill" d="M1000 178.51L874.28 50 684.14 241.27 550 153.1l-134.29 86.67L354 178.51s-74.71 25.39-74.71 29.88-135.06-106.31-135.06-106.31L.75 200.41l-.75.77V247h1000z" opacity="0.25" isolation="isolate"></path></svg>';
                                break;
                            case "mountains-3":
                                l = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none"><path class="shape-divider-fill" d="M761.9,44.1L643.1,27.2L333.8,98L0,3.8V0l1000,0v3.9"></path></svg>';
                                break;
                            case "mountains-4":
                                l = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 140" preserveAspectRatio="none"><path class="shape-divider-fill" d="M0 90.72l140-28.28 315.52 24.14L796.48 65.8 1140 104.89l140-14.17V0H0v90.72z" opacity="0.5"></path><path class="shape-divider-fill" d="M0 0v47.44L170 0l626.48 94.89L1110 87.11l170-39.67V0H0z"></path></svg>';
                                break;
                            case "plataeu":
                                l = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 140" preserveAspectRatio="none"><path class="shape-divider-fill" d="M1280 0l-131.81 111.68c-16.47 14-35.47 21-54.71 20.17L173 94a76.85 76.85 0 0 1-36.79-11.46L0 0z"></path></svg>';
                                break;
                            case "plataeu-2":
                                l = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 140" preserveAspectRatio="none"><path class="shape-divider-fill" d="M1093.48 131.85L173 94a76.85 76.85 0 0 1-36.79-11.46L0 0h1280l-131.81 111.68c-16.47 13.96-35.47 20.96-54.71 20.17z" opacity="0.5"></path><path class="shape-divider-fill" d="M1094.44 119L172.7 68.72a74.54 74.54 0 0 1-25.19-5.95L0 0h1280l-133.85 102c-15.84 12.09-33.7 17.95-51.71 17z"></path></svg>';
                                break;
                            case "hills":
                                l = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 140" preserveAspectRatio="none"><path class="shape-divider-fill" d="M156.258 127.903l86.363-18.654 78.684 13.079L411.441 99.4l94.454 10.303L582.82 93.8l82.664 18.728 76.961-11.39L816.109 71.4l97.602 9.849L997.383 50.4l66.285 14.694 70.793-24.494h79.863L1280 0H0v122.138l60.613 9.965z"/></svg>';
                                break;
                            case "hills-2":
                                l = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 140" preserveAspectRatio="none"><path class="shape-divider-fill" d="M1214.323 66.051h-79.863l-70.793 18.224-66.285-10.933-83.672 22.953-97.601-7.328-73.664 22.125-76.961 8.475-82.664-13.934-76.926 11.832-94.453-7.666-90.137 17.059-78.684-9.731-86.363 13.879-95.644 3.125L0 126.717V0h1280l-.001 35.844z" opacity="0.5"></path><path class="shape-divider-fill" d="M0 0h1280v.006l-70.676 36.578-74.863 4.641-70.793 23.334-66.285-11.678-83.672 29.618-97.602-7.07-63.664 21.421-76.961 12.649-91.664-20.798-77.926 17.66-94.453-7.574-90.137 21.595-78.683-9.884-86.363 16.074-95.645 6.211L0 127.905z"></path></svg>';
                                break;
                            case "hills-3":
                                l = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 140" preserveAspectRatio="none"><path class="shape-divider-fill" d="M156 35.51l95.46 34.84 120.04.24 71.5 33.35 90.09-3.91L640 137.65l102.39-37.17 85.55 10.65 88.11-7.19L992 65.28l73.21 5.31 66.79-22.1 77-.42L1280 0H0l64.8 38.69 91.2-3.18z"/></svg>';
                                break;
                            case "hills-4":
                                l = '<svg viewBox="0 0 1280 140" preserveAspectRatio="none"><path class="shape-divider-fill" d="M156 35.41l95.46 34.73 120.04.25 71.5 33.24 90.09-3.89L640 137.25l102.39-37.06 85.55 10.61 88.11-7.17L992 65.08l73.21 5.31L1132 48.35l77-.42L1280 0H0l64.8 38.57 91.2-3.16z" opacity="0.5"/><path class="shape-divider-fill" d="M156 28.32l95.46 27.79 120.04.2L443 82.9l90.09-3.11L640 109.8l102.39-29.65 85.55 8.49 88.11-5.74L992 52.07l73.21 4.24L1132 38.68l77-.34L1280 0H0l64.8 30.86 91.2-2.54z"/></svg>';
                                break;
                            case "cloud":
                                l = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 283.5 27.8" preserveAspectRatio="xMidYMax slice"><path class="shape-divider-fill" d="M0 0v6.7c1.9-.8 4.7-1.4 8.5-1 9.5 1.1 11.1 6 11.1 6s2.1-.7 4.3-.2c2.1.5 2.8 2.6 2.8 2.6s.2-.5 1.4-.7c1.2-.2 1.7.2 1.7.2s0-2.1 1.9-2.8c1.9-.7 3.6.7 3.6.7s.7-2.9 3.1-4.1 4.7 0 4.7 0 1.2-.5 2.4 0 1.7 1.4 1.7 1.4h1.4c.7 0 1.2.7 1.2.7s.8-1.8 4-2.2c3.5-.4 5.3 2.4 6.2 4.4.4-.4 1-.7 1.8-.9 2.8-.7 4 .7 4 .7s1.7-5 11.1-6c9.5-1.1 12.3 3.9 12.3 3.9s1.2-4.8 5.7-5.7c4.5-.9 6.8 1.8 6.8 1.8s.6-.6 1.5-.9c.9-.2 1.9-.2 1.9-.2s5.2-6.4 12.6-3.3c7.3 3.1 4.7 9 4.7 9s1.9-.9 4 0 2.8 2.4 2.8 2.4 1.9-1.2 4.5-1.2 4.3 1.2 4.3 1.2.2-1 1.4-1.7 2.1-.7 2.1-.7-.5-3.1 2.1-5.5 5.7-1.4 5.7-1.4 1.5-2.3 4.2-1.1c2.7 1.2 1.7 5.2 1.7 5.2s.3-.1 1.3.5c.5.4.8.8.9 1.1.5-1.4 2.4-5.8 8.4-4 7.1 2.1 3.5 8.9 3.5 8.9s.8-.4 2 0 1.1 1.1 1.1 1.1 1.1-1.1 2.3-1.1 2.1.5 2.1.5 1.9-3.6 6.2-1.2 1.9 6.4 1.9 6.4 2.6-2.4 7.4 0c3.4 1.7 3.9 4.9 3.9 4.9s3.3-6.9 10.4-7.9 11.5 2.6 11.5 2.6.8 0 1.2.2c.4.2.9.9.9.9s4.4-3.1 8.3.2c1.9 1.7 1.5 5 1.5 5s.3-1.1 1.6-1.4c1.3-.3 2.3.2 2.3.2s-.1-1.2.5-1.9 1.9-.9 1.9-.9-4.7-9.3 4.4-13.4c5.6-2.5 9.2.9 9.2.9s5-6.2 15.9-6.2 16.1 8.1 16.1 8.1.7-.2 1.6-.4V0H0z"></path></svg>';
                                break;
                            case "cloud-2":
                                l = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 86" preserveAspectRatio="xMidYMid slice"><path class="shape-divider-fill" d="M1280 0H0v65.2c6.8 0 13.5.9 20.1 2.6 14-21.8 43.1-28 64.8-14 5.6 3.6 10.3 8.3 14 13.9 7.3-1.2 14.8-.6 21.8 1.6 2.1-37.3 34.1-65.8 71.4-63.7 24.3 1.4 46 15.7 56.8 37.6 19-17.6 48.6-16.5 66.3 2.4C323 54 327.4 65 327.7 76.5c.4.2.8.4 1.2.7 3.3 1.9 6.3 4.2 8.9 6.9 15.9-23.8 46.1-33.4 72.8-23.3 11.6-31.9 46.9-48.3 78.8-36.6 9.1 3.3 17.2 8.7 23.8 15.7 6.7-6.6 16.7-8.4 25.4-4.8 29.3-37.4 83.3-44 120.7-14.8 14 11 24.3 26.1 29.4 43.1 4.7.6 9.3 1.8 13.6 3.8 7.8-24.7 34.2-38.3 58.9-30.5 14.4 4.6 25.6 15.7 30.3 30 14.2 1.2 27.7 6.9 38.5 16.2 11.1-35.7 49-55.7 84.7-44.7 14.1 4.4 26.4 13.3 35 25.3 12-5.7 26.1-5.5 37.9.6 3.9-11.6 15.5-18.9 27.7-17.5.2-.3.3-.6.5-.9 23.3-41.4 75.8-56 117.2-32.6 14.1 7.9 25.6 19.7 33.3 33.8 28.8-23.8 71.5-19.8 95.3 9 2.6 3.1 4.9 6.5 6.9 10 3.8-.5 7.6-.8 11.4-.8L1280 0z"/></svg>';
                                break;
                            case "cloud-3":
                                l = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 86" preserveAspectRatio="xMidYMid slice"><path class="shape-divider-fill" d="M833.9 27.5c-5.8 3.2-11 7.3-15.5 12.2-7.1-6.9-17.5-8.8-26.6-5-30.6-39.2-87.3-46.1-126.5-15.5-1.4 1.1-2.8 2.2-4.1 3.4C674.4 33.4 684 48 688.8 64.3c4.7.6 9.3 1.8 13.6 3.8 7.8-24.7 34.2-38.3 58.9-30.5 14.4 4.6 25.6 15.7 30.3 30 14.2 1.2 27.7 6.9 38.5 16.2C840.6 49.6 876 29.5 910.8 38c-20.4-20.3-51.8-24.6-76.9-10.5zM384 43.9c-9 5-16.7 11.9-22.7 20.3 15.4-7.8 33.3-8.7 49.4-2.6 3.7-10.1 9.9-19.1 18.1-26-15.4-2.3-31.2.6-44.8 8.3zm560.2 13.6c2 2.2 3.9 4.5 5.7 6.9 5.6-2.6 11.6-4 17.8-4.1-7.6-2.4-15.6-3.3-23.5-2.8zM178.7 7c29-4.2 57.3 10.8 70.3 37 8.9-8.3 20.7-12.8 32.9-12.5C256.4 1.8 214.7-8.1 178.7 7zm146.5 56.3c1.5 4.5 2.4 9.2 2.5 14 .4.2.8.4 1.2.7 3.3 1.9 6.3 4.2 8.9 6.9 5.8-8.7 13.7-15.7 22.9-20.5-11.1-5.2-23.9-5.6-35.5-1.1zM33.5 54.9c21.6-14.4 50.7-8.5 65 13 .1.2.2.3.3.5 7.3-1.2 14.8-.6 21.8 1.6.6-10.3 3.5-20.4 8.6-29.4.3-.6.7-1.2 1.1-1.8-32.1-17.2-71.9-10.6-96.8 16.1zm1228.9 2.7c2.3 2.9 4.4 5.9 6.2 9.1 3.8-.5 7.6-.8 11.4-.8V48.3c-6.4 1.8-12.4 5-17.6 9.3zM1127.3 11c1.9.9 3.7 1.8 5.6 2.8 14.2 7.9 25.8 19.7 33.5 34 13.9-11.4 31.7-16.9 49.6-15.3-20.5-27.7-57.8-36.8-88.7-21.5z" opacity="0.5"/><path class="shape-divider-fill" d="M0 0v66c6.8 0 13.5.9 20.1 2.6 3.5-5.4 8.1-10.1 13.4-13.6 24.9-26.8 64.7-33.4 96.8-16 10.5-17.4 28.2-29.1 48.3-32 36.1-15.1 77.7-5.2 103.2 24.5 19.7.4 37.1 13.1 43.4 31.8 11.5-4.5 24.4-4.2 35.6 1.1l.4-.2c15.4-21.4 41.5-32.4 67.6-28.6 25-21 62.1-18.8 84.4 5.1 6.7-6.6 16.7-8.4 25.4-4.8 29.2-37.4 83.3-44.1 120.7-14.8l1.8 1.5c37.3-32.9 94.3-29.3 127.2 8 1.2 1.3 2.3 2.7 3.4 4.1 9.1-3.8 19.5-1.9 26.6 5 24.3-26 65-27.3 91-3.1.5.5 1 .9 1.5 1.4 12.8 3.1 24.4 9.9 33.4 19.5 7.9-.5 15.9.4 23.5 2.8 7-.1 13.9 1.5 20.1 4.7 3.9-11.6 15.5-18.9 27.7-17.5.2-.3.3-.6.5-.9 22.1-39.2 70.7-54.7 111.4-35.6 30.8-15.3 68.2-6.2 88.6 21.5 18.3 1.7 35 10.8 46.5 25.1 5.2-4.3 11.1-7.4 17.6-9.3V0H0z"/></svg>';
                                break;
                            case "wave":
                                l = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none"><path class="shape-divider-fill" d="M421.9,6.5c22.6-2.5,51.5,0.4,75.5,5.3c23.6,4.9,70.9,23.5,100.5,35.7c75.8,32.2,133.7,44.5,192.6,49.7c23.6,2.1,48.7,3.5,103.4-2.5c54.7-6,106.2-25.6,106.2-25.6V0H0v30.3c0,0,72,32.6,158.4,30.5c39.2-0.7,92.8-6.7,134-22.4c21.2-8.1,52.2-18.2,79.7-24.2C399.3,7.9,411.6,7.5,421.9,6.5z"></path></svg>';
                                break;
                            case "wave-2":
                                l = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 283.5 27.8" preserveAspectRatio="none"><path class="shape-divider-fill" d="M283.5,9.7c0,0-7.3,4.3-14,4.6c-6.8,0.3-12.6,0-20.9-1.5c-11.3-2-33.1-10.1-44.7-5.7\ts-12.1,4.6-18,7.4c-6.6,3.2-20,9.6-36.6,9.3C131.6,23.5,99.5,7.2,86.3,8c-1.4,0.1-6.6,0.8-10.5,2c-3.8,1.2-9.4,3.8-17,4.7 c-3.2,0.4-8.3,1.1-14.2,0.9c-1.5-0.1-6.3-0.4-12-1.6c-5.7-1.2-11-3.1-15.8-3.7C6.5,9.2,0,10.8,0,10.8V0h283.5V9.7z M260.8,11.3 c-0.7-1-2-0.4-4.3-0.4c-2.3,0-6.1-1.2-5.8-1.1c0.3,0.1,3.1,1.5,6,1.9C259.7,12.2,261.4,12.3,260.8,11.3z M242.4,8.6 c0,0-2.4-0.2-5.6-0.9c-3.2-0.8-10.3-2.8-15.1-3.5c-8.2-1.1-15.8,0-15.1,0.1c0.8,0.1,9.6-0.6,17.6,1.1c3.3,0.7,9.3,2.2,12.4,2.7\tC239.9,8.7,242.4,8.6,242.4,8.6z M185.2,8.5c1.7-0.7-13.3,4.7-18.5,6.1c-2.1,0.6-6.2,1.6-10,2c-3.9,0.4-8.9,0.4-8.8,0.5\tc0,0.2,5.8,0.8,11.2,0c5.4-0.8,5.2-1.1,7.6-1.6C170.5,14.7,183.5,9.2,185.2,8.5z M199.1,6.9c0.2,0-0.8-0.4-4.8,1.1 c-4,1.5-6.7,3.5-6.9,3.7c-0.2,0.1,3.5-1.8,6.6-3C197,7.5,199,6.9,199.1,6.9z M283,6c-0.1,0.1-1.9,1.1-4.8,2.5s-6.9,2.8-6.7,2.7\tc0.2,0,3.5-0.6,7.4-2.5C282.8,6.8,283.1,5.9,283,6z M31.3,11.6c0.1-0.2-1.9-0.2-4.5-1.2s-5.4-1.6-7.8-2C15,7.6,7.3,8.5,7.7,8.6\tC8,8.7,15.9,8.3,20.2,9.3c2.2,0.5,2.4,0.5,5.7,1.6S31.2,11.9,31.3,11.6z M73,9.2c0.4-0.1,3.5-1.6,8.4-2.6c4.9-1.1,8.9-0.5,8.9-0.8 c0-0.3-1-0.9-6.2-0.3S72.6,9.3,73,9.2z M71.6,6.7C71.8,6.8,75,5.4,77.3,5c2.3-0.3,1.9-0.5,1.9-0.6c0-0.1-1.1-0.2-2.7,0.2\tC74.8,5.1,71.4,6.6,71.6,6.7z M93.6,4.4c0.1,0.2,3.5,0.8,5.6,1.8c2.1,1,1.8,0.6,1.9,0.5c0.1-0.1-0.8-0.8-2.4-1.3\tC97.1,4.8,93.5,4.2,93.6,4.4z M65.4,11.1c-0.1,0.3,0.3,0.5,1.9-0.2s2.6-1.3,2.2-1.2s-0.9,0.4-2.5,0.8C65.3,10.9,65.5,10.8,65.4,11.1 z M34.5,12.4c-0.2,0,2.1,0.8,3.3,0.9c1.2,0.1,2,0.1,2-0.2c0-0.3-0.1-0.5-1.6-0.4C36.6,12.8,34.7,12.4,34.5,12.4z M152.2,21.1 c-0.1,0.1-2.4-0.3-7.5-0.3c-5,0-13.6-2.4-17.2-3.5c-3.6-1.1,10,3.9,16.5,4.1C150.5,21.6,152.3,21,152.2,21.1z"></path><path class="shape-divider-fill" d="M269.6,18c-0.1-0.1-4.6,0.3-7.2,0c-7.3-0.7-17-3.2-16.6-2.9c0.4,0.3,13.7,3.1,17,3.3\tC267.7,18.8,269.7,18,269.6,18z"></path><path class="shape-divider-fill" d="M227.4,9.8c-0.2-0.1-4.5-1-9.5-1.2c-5-0.2-12.7,0.6-12.3,0.5c0.3-0.1,5.9-1.8,13.3-1.2\tS227.6,9.9,227.4,9.8z"></path><path class="shape-divider-fill" d="M204.5,13.4c-0.1-0.1,2-1,3.2-1.1c1.2-0.1,2,0,2,0.3c0,0.3-0.1,0.5-1.6,0.4\tC206.4,12.9,204.6,13.5,204.5,13.4z"></path><path class="shape-divider-fill" d="M201,10.6c0-0.1-4.4,1.2-6.3,2.2c-1.9,0.9-6.2,3.1-6.1,3.1c0.1,0.1,4.2-1.6,6.3-2.6\tS201,10.7,201,10.6z"></path><path class="shape-divider-fill" d="M154.5,26.7c-0.1-0.1-4.6,0.3-7.2,0c-7.3-0.7-17-3.2-16.6-2.9c0.4,0.3,13.7,3.1,17,3.3\tC152.6,27.5,154.6,26.8,154.5,26.7z"></path><path class="shape-divider-fill" d="M41.9,19.3c0,0,1.2-0.3,2.9-0.1c1.7,0.2,5.8,0.9,8.2,0.7c4.2-0.4,7.4-2.7,7-2.6\tc-0.4,0-4.3,2.2-8.6,1.9c-1.8-0.1-5.1-0.5-6.7-0.4S41.9,19.3,41.9,19.3z"></path><path class="shape-divider-fill" d="M75.5,12.6c0.2,0.1,2-0.8,4.3-1.1c2.3-0.2,2.1-0.3,2.1-0.5c0-0.1-1.8-0.4-3.4,0\tC76.9,11.5,75.3,12.5,75.5,12.6z"></path><path class="shape-divider-fill" d="M15.6,13.2c0-0.1,4.3,0,6.7,0.5c2.4,0.5,5,1.9,5,2c0,0.1-2.7-0.8-5.1-1.4\tC19.9,13.7,15.7,13.3,15.6,13.2z"></path></svg>';
                                break;
                            case "wave-3":
                                l = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1047.1 3.7" preserveAspectRatio="xMidYMin slice"><path class="shape-divider-fill" d="M1047.1,0C557,0,8.9,0,0,0v1.6c0,0,0.6-1.5,2.7-0.3C3.9,2,6.1,4.1,8.3,3.5c0.9-0.2,1.5-1.9,1.5-1.9\ts0.6-1.5,2.7-0.3C13.8,2,16,4.1,18.2,3.5c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3C23.6,2,25.9,4.1,28,3.5c0.9-0.2,1.5-1.9,1.5-1.9\tc0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2\tc0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3C63,2,65.3,4.1,67.4,3.5\tC68.3,3.3,69,1.6,69,1.6s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3\tC82.7,2,85,4.1,87.1,3.5c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3C92.6,2,94.8,4.1,97,3.5c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3\tc1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9\tc0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2\tc0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3\tc1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9\tc0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2\tc0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3\tc1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9\tc0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2\tc0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3\tc1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9\ts0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2\tc0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3\tc1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9\ts0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2\tc0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3\tc1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9\ts0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2\tc0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3\tc1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9\ts0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2\tc0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3\tc1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9\ts0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2\tc0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3\tc1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9\ts0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2\tc0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3\tc1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9\tc0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2\tc0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3\tc1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9\tc0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2\tc0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3\tc1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9\tc0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2\tc0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3\tc1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9\ts0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2\tc0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3\tc1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9\ts0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2\tc0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3\tc1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9\ts0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2\tc0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3\tc1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9\ts0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2\tc0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3\tc1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9\ts0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2\tc0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3\tc1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9\ts0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2\tc0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3\tc1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9\tc0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9c0,0,0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2\tc0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3c1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.7-0.3\tc1.2,0.7,3.5,2.8,5.6,2.2c0.9-0.2,1.5-1.9,1.5-1.9s0.6-1.5,2.6-0.4V0z M2.5,1.2C2.5,1.2,2.5,1.2,2.5,1.2C2.5,1.2,2.5,1.2,2.5,1.2z M2.7,1.4c0.1,0,0.1,0.1,0.1,0.1C2.8,1.4,2.8,1.4,2.7,1.4z"></path></svg>';
                                break;
                            case "wave-4":
                                l = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 140" preserveAspectRatio="none"><path class="shape-divider-fill" d="M0 51.76c36.21-2.25 77.57-3.58 126.42-3.58 320 0 320 57 640 57 271.15 0 312.58-40.91 513.58-53.4V0H0z" opacity="0.3"></path><path class="shape-divider-fill" d="M0 24.31c43.46-5.69 94.56-9.25 158.42-9.25 320 0 320 89.24 640 89.24 256.13 0 307.28-57.16 481.58-80V0H0z" opacity="0.5"></path><path class="shape-divider-fill" d="M0 0v3.4C28.2 1.6 59.4.59 94.42.59c320 0 320 84.3 640 84.3 285 0 316.17-66.85 545.58-81.49V0z"></path></svg>';
                                break;
                            case "wave-5":
                                l = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 140" preserveAspectRatio="none"><path class="shape-divider-fill" d="M0 0v100c20 17.3 40 29.51 80 29.51 51.79 0 74.69-48.57 151.75-48.57 73.72 0 91 54.88 191.56 54.88C543.95 135.8 554 14 665.69 14c109.46 0 98.85 87 188.2 87 70.37 0 69.81-33.73 115.6-33.73 55.85 0 62 39.62 115.6 39.62 58.08 0 57.52-46.59 115-46.59 39.8 0 60 22.48 79.89 39.69V0z"></path></svg>';
                                break;
                            case "wave-6":
                                l = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 140" preserveAspectRatio="none"><path class="shape-divider-fill" d="M504.854,80.066c7.812,0,14.893,0.318,21.41,0.879 c-25.925,22.475-56.093,40.852-102.946,40.852c-20.779,0-37.996-2.349-52.898-6.07C413.517,107.295,434.056,80.066,504.854,80.066z M775.938,51.947c19.145,18.596,39.097,35.051,77.956,35.051c46.907,0,62.299-14.986,80.912-24.98 c-21.357-15.783-46.804-28.348-85.489-28.348C816.829,33.671,794.233,41.411,775.938,51.947z" opacity="0.3"></path><path class="shape-divider-fill" d="M1200.112,46.292c39.804,0,59.986,22.479,79.888,39.69v16.805 c-19.903-10.835-40.084-21.777-79.888-21.777c-72.014,0-78.715,43.559-147.964,43.559c-56.84,0-81.247-35.876-117.342-62.552 c9.309-4.998,19.423-8.749,34.69-8.749c55.846,0,61.99,39.617,115.602,39.617C1143.177,92.887,1142.618,46.292,1200.112,46.292z M80.011,115.488c-40.006,0-60.008-12.206-80.011-29.506v16.806c20.003,10.891,40.005,21.782,80.011,21.782 c80.004,0,78.597-30.407,137.669-30.407c55.971,0,62.526,24.026,126.337,24.026c9.858,0,18.509-0.916,26.404-2.461 c-57.186-14.278-80.177-48.808-138.66-48.808C154.698,66.919,131.801,115.488,80.011,115.488z M526.265,80.945 c56.848,4.902,70.056,28.726,137.193,28.726c54.001,0,73.43-35.237,112.48-57.724C751.06,27.782,727.548,0,665.691,0 C597.381,0,567.086,45.555,526.265,80.945z" opacity="0.5"></path><path class="shape-divider-fill" d="M0,0v85.982c20.003,17.3,40.005,29.506,80.011,29.506c51.791,0,74.688-48.569,151.751-48.569 c58.482,0,81.473,34.531,138.66,48.808c43.096-8.432,63.634-35.662,134.433-35.662c7.812,0,14.893,0.318,21.41,0.879 C567.086,45.555,597.381,0,665.691,0c61.856,0,85.369,27.782,110.246,51.947c18.295-10.536,40.891-18.276,73.378-18.276 c38.685,0,64.132,12.564,85.489,28.348c9.309-4.998,19.423-8.749,34.69-8.749c55.846,0,61.99,39.617,115.602,39.617 c58.08,0,57.521-46.595,115.015-46.595c39.804,0,59.986,22.479,79.888,39.69V0H0z"></path></svg>';
                                break;
                            case "slant":
                                l = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none"><path class="shape-divider-fill" d="M0,6V0h1000v100L0,6z"></path></svg>';
                                break;
                            case "slant-2":
                                l = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2600 131.1" preserveAspectRatio="none"><path class="shape-divider-fill" d="M0 0L2600 0 2600 69.1 0 0z"></path><path class="shape-divider-fill" opacity="0.5" d="M0 0L2600 0 2600 69.1 0 69.1z"></path><path class="shape-divider-fill" opacity="0.25" d="M2600 0L0 0 0 130.1 2600 69.1z"></path></svg>';
                                break;
                            case "slant-3":
                                l = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 140" preserveAspectRatio="none"><path class="shape-divider-fill" d="M1280 140V0H0l1280 140z" opacity="0.5"></path><path class="shape-divider-fill" d="M1280 98V0H0l1280 98z"></path></svg>';
                                break;
                            case "rounded":
                                l = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none"><path class="shape-divider-fill" d="M1000,4.3V0H0v4.3C0.9,23.1,126.7,99.2,500,100S1000,22.7,1000,4.3z"></path></svg>';
                                break;
                            case "rounded-2":
                                l = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 100" preserveAspectRatio="none"><path class="shape-divider-fill" d="M0,0c0,0,0,6,0,6.7c0,18,240.2,93.6,615.2,92.6C989.8,98.5,1000,25,1000,6.7c0-0.7,0-6.7,0-6.7H0z"></path></svg>';
                                break;
                            case "rounded-3":
                                l = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 140" preserveAspectRatio="none"><path class="shape-divider-fill" d="M0 0s573.08 140 1280 140V0z"></path></svg>';
                                break;
                            case "rounded-4":
                                l = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 140" preserveAspectRatio="none"><path class="shape-divider-fill" d="M0 0v60s573.09 80 1280 80V0z" opacity="0.3"></path><path class="shape-divider-fill" d="M0 0v30s573.09 110 1280 110V0z" opacity="0.5"></path><path class="shape-divider-fill" d="M0 0s573.09 140 1280 140V0z"></path></svg>';
                                break;
                            case "rounded-5":
                                l = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1280 140" preserveAspectRatio="none"><path class="shape-divider-fill" d="M0 0v.48C18.62 9.38 297.81 140 639.5 140 993.24 140 1280 0 1280 0z" opacity="0.3"></path><path class="shape-divider-fill" d="M0 .6c14 8.28 176.54 99.8 555.45 119.14C952.41 140 1280 0 1280 0H0z" opacity="0.5"></path><path class="shape-divider-fill" d="M726.29 101.2C1126.36 79.92 1281 0 1281 0H1c.05 0 325.25 122.48 725.29 101.2z"></path></svg>';
                                break;
                            case "triangle":
                                l = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 700 10" preserveAspectRatio="none"><path class="shape-divider-fill" d="M350,10L340,0h20L350,10z"></path></svg>';
                                break;
                            case "drops":
                                l = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 283.5 27.8" preserveAspectRatio="xMidYMax slice"><path class="shape-divider-fill" d="M0 0v1.4c.6.7 1.1 1.4 1.4 2 2 3.8 2.2 6.6 1.8 10.8-.3 3.3-2.4 9.4 0 12.3 1.7 2 3.7 1.4 4.6-.9 1.4-3.8-.7-8.2-.6-12 .1-3.7 3.2-5.5 6.9-4.9 4 .6 4.8 4 4.9 7.4.1 1.8-1.1 7 0 8.5.6.8 1.6 1.2 2.4.5 1.4-1.1.1-5.4.1-6.9.1-3.7.3-8.6 4.1-10.5 5-2.5 6.2 1.6 5.4 5.6-.4 1.7-1 9.2 2.9 6.3 1.5-1.1.7-3.5.5-4.9-.4-2.4-.4-4.3 1-6.5.9-1.4 2.4-3.1 4.2-3 2.4.1 2.7 2.2 4 3.7 1.5 1.8 1.8 2.2 3 .1 1.1-1.9 1.2-2.8 3.6-3.3 1.3-.3 4.8-1.4 5.9-.5 1.5 1.1.6 2.8.4 4.3-.2 1.1-.6 4 1.8 3.4 1.7-.4-.3-4.1.6-5.6 1.3-2.2 5.8-1.4 7 .5 1.3 2.1.5 5.8.1 8.1s-1.2 5-.6 7.4c1.3 5.1 4.4.9 4.3-2.4-.1-4.4-2-8.8-.5-13 .9-2.4 4.6-6.6 7.7-4.5 2.7 1.8.5 7.8.2 10.3-.2 1.7-.8 4.6.2 6.2.9 1.4 2 1.5 2.6-.3.5-1.5-.9-4.5-1-6.1-.2-1.7-.4-3.7.2-5.4 1.8-5.6 3.5 2.4 6.3.6 1.4-.9 4.3-9.4 6.1-3.1.6 2.2-1.3 7.8.7 8.9 4.2 2.3 1.5-7.1 2.2-8 3.1-4 4.7 3.8 6.1 4.1 3.1.7 2.8-7.9 8.1-4.5 1.7 1.1 2.9 3.3 3.2 5.2.4 2.2-1 4.5-.6 6.6 1 4.3 4.4 1.5 4.4-1.7 0-2.7-3-8.3 1.4-9.1 4.4-.9 7.3 3.5 7.8 6.9.3 2-1.5 10.9 1.3 11.3 4.1.6-3.2-15.7 4.8-15.8 4.7-.1 2.8 4.1 3.9 6.6 1 2.4 2.1 1 2.3-.8.3-1.9-.9-3.2 1.3-4.3 5.9-2.9 5.9 5.4 5.5 8.5-.3 2-1.7 8.4 2 8.1 6.9-.5-2.8-16.9 4.8-18.7 4.7-1.2 6.1 3.6 6.3 7.1.1 1.7-1.2 8.1.6 9.1 3.5 2 1.9-7 2-8.4.2-4 1.2-9.6 6.4-9.8 4.7-.2 3.2 4.6 2.7 7.5-.4 2.2 1.3 8.6 3.8 4.4 1.1-1.9-.3-4.1-.3-6 0-1.7.4-3.2 1.3-4.6 1-1.6 2.9-3.5 5.1-2.9 2.5.6 2.3 4.1 4.1 4.9 1.9.8 1.6-.9 2.3-2.1 1.2-2.1 2.1-2.1 4.4-2.4 1.4-.2 3.6-1.5 4.9-.5 2.3 1.7-.7 4.4.1 6.5.6 1.5 2.1 1.7 2.8.3.7-1.4-1.1-3.4-.3-4.8 1.4-2.5 6.2-1.2 7.2 1 2.3 4.8-3.3 12-.2 16.3 3 4.1 3.9-2.8 3.8-4.8-.4-4.3-2.1-8.9 0-13.1 1.3-2.5 5.9-5.7 7.9-2.4 2 3.2-1.3 9.8-.8 13.4.5 4.4 3.5 3.3 2.7-.8-.4-1.9-2.4-10 .6-11.1 3.7-1.4 2.8 7.2 6.5.4 2.2-4.1 4.9-3.1 5.2 1.2.1 1.5-.6 3.1-.4 4.6.2 1.9 1.8 3.7 3.3 1.3 1-1.6-2.6-10.4 2.9-7.3 2.6 1.5 1.6 6.5 4.8 2.7 1.3-1.5 1.7-3.6 4-3.7 2.2-.1 4 2.3 4.8 4.1 1.3 2.9-1.5 8.4.9 10.3 4.2 3.3 3-5.5 2.7-6.9-.6-3.9 1-7.2 5.5-5 4.1 2.1 4.3 7.7 4.1 11.6 0 .8-.6 9.5 2.5 5.2 1.2-1.7-.1-7.7.1-9.6.3-2.9 1.2-5.5 4.3-6.2 4.5-1 7.7 1.5 7.4 5.8-.2 3.5-1.8 7.7-.5 11.1 1 2.7 3.6 2.8 5 .2 1.6-3.1 0-8.3-.4-11.6-.4-4.2-.2-7 1.8-10.8 0 0-.1.1-.1.2-.2.4-.3.7-.4.8v.1c-.1.2-.1.2 0 0v-.1l.4-.8c0-.1.1-.1.1-.2.2-.4.5-.8.8-1.2V0H0zM282.7 3.4z"></path></svg>';
                                break;
                            case "cliff":
                                l = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 279.24" preserveAspectRatio="none"><path class="shape-divider-fill" d="M1000 0S331.54-4.18 0 279.24h1000z" opacity="0.25"></path><path class="shape-divider-fill" d="M1000 279.24s-339.56-44.3-522.95-109.6S132.86 23.76 0 25.15v254.09z"></path></svg>';
                                break;
                            case "zigzag":
                                l = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1800 5.8" preserveAspectRatio="none"><path class="shape-divider-fill" d="M5.4.4l5.4 5.3L16.5.4l5.4 5.3L27.5.4 33 5.7 38.6.4l5.5 5.4h.1L49.9.4l5.4 5.3L60.9.4l5.5 5.3L72 .4l5.5 5.3L83.1.4l5.4 5.3L94.1.4l5.5 5.4h.2l5.6-5.4 5.5 5.3 5.6-5.3 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.4h.2l5.6-5.4 5.4 5.3L161 .4l5.4 5.3L172 .4l5.5 5.3 5.6-5.3 5.4 5.3 5.7-5.3 5.4 5.4h.2l5.6-5.4 5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.4 5.3 5.6-5.3 5.5 5.4h.2l5.6-5.4 5.5 5.3L261 .4l5.4 5.3L272 .4l5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.4h.1l5.7-5.4 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.4 5.3 5.7-5.3 5.4 5.4h.2l5.6-5.4 5.5 5.3L361 .4l5.5 5.3 5.6-5.3 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.4h.1l5.7-5.4 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.4h.1l5.6-5.4 5.5 5.3L461 .4l5.5 5.3 5.6-5.3 5.4 5.3 5.7-5.3 5.4 5.3 5.6-5.3 5.5 5.4h.2l5.6-5.4 5.5 5.3 5.6-5.3 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.4h.1L550 .4l5.4 5.3L561 .4l5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.4 5.3 5.6-5.3 5.5 5.4h.2l5.6-5.4 5.5 5.3 5.6-5.3 5.4 5.3 5.7-5.3 5.4 5.3 5.6-5.3 5.5 5.4h.2L650 .4l5.5 5.3 5.6-5.3 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.4 5.4h.2l5.6-5.4 5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.4 5.3 5.6-5.3 5.5 5.4h.2L750 .4l5.5 5.3 5.6-5.3 5.4 5.3 5.7-5.3 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.4h.1l5.7-5.4 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.4 5.4h.2L850 .4l5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.4h.2l5.6-5.4 5.4 5.3 5.7-5.3 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.4h.1l5.7-5.4 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.4 5.3 5.6-5.3 5.5 5.4h.2l5.6-5.4 5.5 5.3 5.6-5.3 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.4h.2l5.6-5.4 5.4 5.3 5.7-5.3 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.4 5.4h.2l5.6-5.4 5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.4 5.3 5.6-5.3 5.5 5.4h.2l5.6-5.4 5.5 5.3 5.6-5.3 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.4h.1l5.7-5.4 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.4 5.4h.2l5.6-5.4 5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.4h.2l5.6-5.4 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.4h.1l5.7-5.4 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.4 5.3 5.6-5.3 5.5 5.4h.2l5.6-5.4 5.5 5.3 5.6-5.3 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.4h.2l5.6-5.4 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.4 5.3 5.7-5.3 5.4 5.4h.2l5.6-5.4 5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.4 5.3 5.6-5.3 5.5 5.4h.2l5.6-5.4 5.5 5.3 5.6-5.3 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.4h.1l5.6-5.4 5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.4 5.3 5.7-5.3 5.4 5.4h.2l5.6-5.4 5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.4h.1l5.7-5.4 5.4 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.5 5.4h.1l5.6-5.4 5.5 5.3 5.6-5.3 5.5 5.3 5.6-5.3 5.4 5.3 5.7-5.3 5.4 5.3 5.6-5.3 5.5 5.4V0H-.2v5.8z"></path></svg>';
                                break;
                            case "illusion":
                                l = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 283.5 19.6" preserveAspectRatio="none"><path class="shape-divider-fill" opacity="0.33" d="M0 0L0 18.8 141.8 4.1 283.5 18.8 283.5 0z"></path><path class="shape-divider-fill" opacity="0.33" d="M0 0L0 12.6 141.8 4 283.5 12.6 283.5 0z"></path><path class="shape-divider-fill" opacity="0.33" d="M0 0L0 6.4 141.8 4 283.5 6.4 283.5 0z"></path><path class="shape-divider-fill" d="M0 0L0 1.2 141.8 4 283.5 1.2 283.5 0z"></path></svg>';
                                break;
                            default:
                                l = ""
                        }
                        e.innerHTML = l, e.querySelector("svg").classList.add("op-ts"), setTimeout(function() {
                            e.querySelector("svg").classList.add("op-1")
                        }, 500), e.classList.add("shape-divider-complete")
                    })
                }
            },
            StickySidebar: {
                init: function(t) {
                    if (N.getSelector(t, !1, !1).length < 1) return !0;
                    N.isFuncTrue(function() {
                        return "undefined" != typeof jQuery && jQuery().scwStickySidebar
                    }).then(function(e) {
                        return !(!e || (N.initFunction({
                            class: "has-plugin-stickysidebar",
                            event: "pluginStickySidebarReady"
                        }), (t = N.getSelector(t)).length < 1)) && void t.each(function() {
                            var e = jQuery(this),
                                t = e.attr("data-offset-top") || 110,
                                a = e.attr("data-offset-bottom") || 50;
                            e.scwStickySidebar({
                                additionalMarginTop: Number(t),
                                additionalMarginBottom: Number(a)
                            })
                        })
                    })
                }
            },
            Cookies: {
                init: function(e) {
                    if (N.getSelector(e, !1, !1).length < 1) return !0;
                    if (N.initFunction({
                            class: "has-plugin-cookie",
                            event: "pluginCookieReady"
                        }), (e = N.getSelector(e, !1)).length < 1) return !0;
                    var a, i = document.querySelector(".gdpr-settings"),
                        n = (i ? .getAttribute("data-speed"), i ? .getAttribute("data-expire") || 30),
                        e = i ? .getAttribute("data-delay") || 1500,
                        t = i ? .getAttribute("data-persistent"),
                        r = "bottom",
                        s = i ? .offsetHeight + 100,
                        o = i ? .offsetWidth + 100,
                        l = document.querySelector(".gdpr-cookie-settings"),
                        c = l ? .querySelectorAll("[data-cookie-name]");
                    if (!i && !l) return !0;
                    "true" == t && (N.cookie.set("__cnvs_cookies_accept", ""), N.cookie.remove("__cnvs_cookies_decline")), i && (i ? .classList.contains("gdpr-settings-sm") && i ? .classList.contains("gdpr-settings-right") ? r = "right" : i ? .classList.contains("gdpr-settings-sm") && (r = "left"), "left" == r ? (a = -o, i.style.right = "auto", i.style.marginLeft = "1rem") : "right" == r ? (a = -o, i.style.left = "auto", i.style.marginRight = "1rem") : a = -s, i.style[r] = a + "px", "1" != N.cookie.get("__cnvs_cookies_accept")) && setTimeout(function() {
                        i.style.display = "block", i.style.pointerEvents = "auto", i.style[r] = 0, i.style.opacity = 1
                    }, Number(e));
                    var t = document.querySelectorAll(".gdpr-accept"),
                        o = document.querySelectorAll(".gdpr-decline"),
                        s = document.querySelectorAll(".gdpr-save-cookies"),
                        e = (0 < t.length && t.forEach(function(t) {
                            t.onclick = function(e) {
                                e.preventDefault(), i && (i.style[r] = a + "px", i.style.opacity = 0, i.ontransitionend = function() {
                                    i.style.display = "none", i.style.pointerEvents = "none"
                                }), N.cookie.set("__cnvs_cookies_accept", "1", n), N.cookie.set("__cnvs_cookies_decline", "0", n), V(t)
                            }
                        }), 0 < o.length && o.forEach(function(t) {
                            t.onclick = function(e) {
                                e.preventDefault(), i && (i.style[r] = a + "px", i.style.opacity = 0, i.ontransitionend = function() {
                                    i.style.display = "none", i.style.pointerEvents = "none"
                                }), N.cookie.set("__cnvs_cookies_accept", "0", n), N.cookie.set("__cnvs_cookies_decline", "1", n), V(t)
                            }
                        }), N.cookie.get("__cnvs_cookies_accept")),
                        t = N.cookie.get("__cnvs_cookies_decline"),
                        d = (e || "0" != e) && (!t || "1" != t);
                    c ? .forEach(function(e) {
                        var t = "__cnvs_gdpr_" + e.getAttribute("data-cookie-name"),
                            t = N.cookie.get(t);
                        e.checked = !(void 0 === t || "1" != t || !d)
                    }), 0 < s.length && s.forEach(function(t) {
                        t.onclick = function(e) {
                            e.preventDefault(), N.cookie.set("__cnvs_cookies_accept", "1", n), N.cookie.set("__cnvs_cookies_decline", "0", n), c.forEach(function(e) {
                                var t = "__cnvs_gdpr_" + e.getAttribute("data-cookie-name");
                                1 == e.checked ? N.cookie.set(t, "1", n) : N.cookie.remove(t, "")
                            }), 0 < l.closest(".mfp-content").length && jQuery$.magnificPopup.close(), V(t)
                        }
                    }), document.querySelectorAll(".gdpr-container") ? .forEach(function(t) {
                        var e = "__cnvs_gdpr_" + t.getAttribute("data-cookie-name"),
                            a = t.getAttribute("data-cookie-content"),
                            i = t.getAttribute("data-cookie-content-ajax"),
                            e = N.cookie.get(e);
                        void 0 !== e && "1" == e && d ? (t.classList.add("gdpr-content-active"), i ? fetch(i).then(function(e) {
                            return e.text()
                        }).then(function(e) {
                            e = (new DOMParser).parseFromString(e, "text/html");
                            t ? .insertAdjacentHTML("beforeend", e.body.innerHTML)
                        }).catch(function(e) {
                            console.log(e)
                        }) : a && (t.innerHTML += a), N.runContainerModules(t)) : t.classList.add("gdpr-content-blocked")
                    })
                }
            },
            Quantity: {
                init: function(e) {
                    return N.getSelector(e, !1, !1).length < 1 || (N.initFunction({
                        class: "has-plugin-quantity",
                        event: "pluginQuantityReady"
                    }), (e = N.getSelector(e, !1)).length < 1) || void e.forEach(function(e) {
                        var t = e.querySelector(".plus"),
                            a = e.querySelector(".minus"),
                            i = e.querySelector(".qty"),
                            n = new Event("change");
                        t.onclick = function(e) {
                            e.preventDefault();
                            var e = i.value,
                                t = i.getAttribute("step") || 1,
                                a = i.getAttribute("max");
                            if (a && Number(e) >= Number(a)) return !1;
                            /^\d+$/.test(e) ? (a = Number(e) + Number(t), i.value = a) : i.value = Number(t), i.dispatchEvent(n)
                        }, a.onclick = function(e) {
                            e.preventDefault();
                            var e = i.value,
                                t = i.getAttribute("step") || 1,
                                a = i.getAttribute("min");
                            (!a || a < 0) && (a = 1), /^\d+$/.test(e) ? Number(e) > Number(a) && (a = Number(e) - Number(t), i.value = a) : i.value = Number(t), i.dispatchEvent(n)
                        }
                    })
                }
            },
            ReadMore: {
                init: function(e) {
                    return N.getSelector(e, !1, !1).length < 1 || (N.initFunction({
                        class: "has-plugin-readmore",
                        event: "pluginReadMoreReady"
                    }), (e = N.getSelector(e, !1)).length < 1) || (e.forEach(function(e) {
                        var t, a = e,
                            i = a.getAttribute("data-readmore-size") || "10rem",
                            n = a.getAttribute("data-readmore-speed") || 500,
                            r = a.getAttribute("data-readmore-scrollup") || "false",
                            s = a.getAttribute("data-readmore-trigger") || ".read-more-trigger",
                            o = a.getAttribute("data-readmore-trigger-open") || "Read More",
                            l = a.getAttribute("data-readmore-trigger-close") || "Read Less",
                            e = (a.style.height = "", a.classList.remove("read-more-wrap-open"), a.offsetHeight),
                            c = a.querySelector(s),
                            d = (c.classList.remove("d-none"), e + c.offsetHeight),
                            u = (c.innerHTML = o, n = Number(n), a.classList.add("read-more-wrap"), a.style.height = i, a.style.transitionDuration = n + "ms", a.querySelector(".read-more-mask") || (a.innerHTML += '<div class="read-more-mask"></div>'), t = a.querySelector(".read-more-mask"), a.getAttribute("data-readmore-mask") || "true"),
                            e = a.getAttribute("data-readmore-maskcolor") || "#FFF",
                            c = a.getAttribute("data-readmore-masksize") || "100%",
                            p = ("true" == u ? (t.style.height = c, t.style.backgroundImage = "linear-gradient( " + _(e, 0) + ", " + _(e, 1) + " )", t.classList.add("op-ts", "op-1")) : t.classList.add("d-none"), a.querySelector(s));
                        p.onclick = function(e) {
                            e.preventDefault(), a.classList.contains("read-more-wrap-open") ? (a.style.height = i, a.classList.remove("read-more-wrap-open"), p.innerHTML = o, setTimeout(function() {
                                "true" == r && N.scrollTo(a.offsetTop - N.getVars.topScrollOffset, !1, !1)
                            }, n), "true" == u && t.classList.add("op-ts", "op-1")) : ("false" == l && p.classList.add("d-none"), a.style.height = d + "px", a.style.overflow = "", a.classList.add("read-more-wrap-open"), p && (p.innerHTML = l), "true" == u && (t.classList.remove("op-1"), t.classList.add("op-0"))), p = a.querySelector(s)
                        }
                    }), void(N.getVars.resizers.readmore = function() {
                        S.readmore()
                    }))
                }
            },
            PricingSwitcher: {
                init: function(e) {
                    return N.getSelector(e, !1, !1).length < 1 || (N.initFunction({
                        class: "has-plugin-pricing-switcher",
                        event: "pluginPricingSwitcherReady"
                    }), (e = N.getSelector(e, !1)).length < 1) || void e.forEach(function(t) {
                        var e = t.querySelectorAll('[type="checkbox"], [type="radio"], select'),
                            a = t.getAttribute("data-default-class") || "text-muted op-05",
                            i = t.getAttribute("data-active-class") || "fw-bold",
                            n = document.querySelector(t.getAttribute("data-container"));
                        e.forEach(function(e) {
                            R(e, t, n, a, i), e.addEventListener("change", function() {
                                R(e, t, n, a, i)
                            })
                        })
                    })
                }
            },
            AjaxButton: {
                init: function(e) {
                    return N.getSelector(e, !1, !1).length < 1 || (N.initFunction({
                        class: "has-plugin-ajaxbutton",
                        event: "pluginAjaxButtonReady"
                    }), (e = N.getSelector(e, !1)).length < 1) || void e.forEach(function(s) {
                        s.onclick = function(e) {
                            e.preventDefault();
                            var t = s,
                                e = s.getAttribute("data-ajax-loader"),
                                a = document.querySelector(s.getAttribute("data-ajax-container")),
                                i = s.getAttribute("data-ajax-insertion") || "append",
                                n = s.getAttribute("data-ajax-trigger-hide") || "true",
                                r = s.getAttribute("data-ajax-trigger-disable") || "true";
                            fetch(e).then(function(e) {
                                return e.text()
                            }).then(function(e) {
                                e = (new DOMParser).parseFromString(e, "text/html");
                                "append" == i ? a ? .insertAdjacentHTML("beforeend", e.body.innerHTML) : a ? .insertAdjacentHTML("afterbegin", e.body.innerHTML), "true" == n && s.classList.add("d-none"), N.runContainerModules(a), "true" == r && setTimeout(function() {
                                    t.onclick = function(e) {
                                        return e.stopPropagation(), e.preventDefault(), !1
                                    }
                                }, 1e3)
                            }).catch(function(e) {
                                var t = document.createElement("div");
                                t.classList.add("d-inline-block", "text-danger", "me-3"), t.innerText = "Content Cannot be Loaded!", a ? .prepend(t, ": " + e)
                            })
                        }
                    })
                }
            },
            VideoFacade: {
                init: function(e) {
                    if (N.getSelector(e, !1, !1).length < 1) return !0;
                    N.initFunction({
                        class: "has-plugin-videofacade",
                        event: "pluginVideoFacadeReady"
                    }), (e = N.getSelector(e, !1)).forEach(function(n) {
                        n.onclick = function(e) {
                            e.preventDefault();
                            var e = n.getAttribute("data-video-html"),
                                t = n.getAttribute("data-video-ratio") || "ratio ratio-16x9",
                                a = n.querySelector(".video-facade-preview"),
                                i = n.querySelector(".video-facade-content");
                            a.classList.add("d-none"), i.innerHTML += e, t.split(" ").forEach(function(e) {
                                i.classList.add(e)
                            })
                        }
                    })
                }
            },
            SchemeToggle: {
                init: function(i) {
                    return N.getSelector(i, !1, !1).length < 1 || (N.initFunction({
                        class: "has-plugin-schemetoggler",
                        event: "pluginSchemeTogglerReady"
                    }), !((i = N.getSelector(i, !1)).length < 1) && void i.forEach(function(t) {
                        var a = t.getAttribute("data-bodyclass-toggle") || "dark",
                            e = t.getAttribute("data-type") || "trigger";
                        k(t), "checkbox" == e ? t.querySelector("input[type=checkbox]").addEventListener("change", function() {
                            N.classesFn("toggle", a, N.getVars.elBody), k(t, !1, !0), N.siblings(t, i).forEach(function(e) {
                                k(e, !0)
                            })
                        }) : t.onclick = function(e) {
                            e.preventDefault(), N.classesFn("toggle", a, N.getVars.elBody), k(t, !1, !0), N.siblings(t, i).forEach(function(e) {
                                k(e, !0)
                            })
                        }
                    }))
                }
            },
            Clipboard: {
                init: function(t) {
                    if (N.getSelector(t, !1, !1).length < 1) return !0;
                    N.isFuncTrue(function() {
                        return "undefined" != typeof ClipboardJS
                    }).then(function(e) {
                        var r, s;
                        return !!e && (N.initFunction({
                            class: "has-plugin-clipboard",
                            event: "pluginClipboardReady"
                        }), (t = N.getSelector(t, !1)).length < 1 || (r = [], s = 0, void t.forEach(function(e) {
                            var t = e.querySelector("button"),
                                a = t.innerHTML,
                                i = t.getAttribute("data-copied") || "Copied",
                                n = t.getAttribute("data-copied-timeout") || 5e3;
                            r[s] = new ClipboardJS(t, {
                                target: function(e) {
                                    return e.closest(".clipboard-copy").querySelector("code")
                                }
                            }), r[s].on("success", function(e) {
                                t.innerHTML = i, t.disabled = !0, setTimeout(function() {
                                    t.innerHTML = a, t.disabled = !1
                                }, Number(n))
                            }), s++
                        })))
                    })
                }
            },
            CodeHighlight: {
                init: function(t) {
                    if (N.getSelector(t, !1, !1).length < 1) return !0;
                    N.loadCSS({
                        file: "components/prism.css",
                        id: "canvas-prism-css",
                        cssFolder: !0
                    }), N.isFuncTrue(function() {
                        return "undefined" != typeof Prism
                    }).then(function(e) {
                        return !!e && (N.initFunction({
                            class: "has-plugin-codehighlight",
                            event: "pluginCodeHighlightReady"
                        }), (t = N.getSelector(t, !1)).length < 1 || void t.forEach(function(e) {
                            Prism.highlightElement(e.querySelector("code"))
                        }))
                    })
                }
            },
            Tips: {
                init: function(e) {
                    N.isFuncTrue(function() {
                        return "undefined" != typeof bootstrap
                    }).then(function(e) {
                        if (!e) return !1;
                        if ("undefined" == typeof cnvsTips || cnvsTips.length < 1) return !1;
                        N.initFunction({
                            class: "has-plugin-tips",
                            event: "pluginTipsReady"
                        });
                        var e = Math.floor(Math.random() * cnvsTips.length),
                            e = cnvsTips[e],
                            t = document.getElementById("cnvs-tips-element"),
                            a = (t || (N.getVars.elWrapper.insertAdjacentHTML("beforeend", '<div class="position-fixed bottom-0 end-0 p-3 text-start" style="z-index: 699;"><div id="cnvs-tips-element" data-notify-trigger="custom" data-notify-target="#cnvs-tips-element" data-notify-timeout="7777" class="toast hide p-3 bg-white" role="alert" aria-live="assertive" aria-atomic="true" style="--bs-toast-max-width:400px;--bs-toast-bg: rgba(var(--bs-body-bg-rgb),.925);"><div class="toast-header bg-transparent border-0 mb-0 align-items-center pb-1"><h5 id="cnvs-tips-element-title" class="me-auto fs-6 fw-semibold mb-0"></h5><button type="button" class="btn-close me-1" data-bs-dismiss="toast" aria-label="Close"></button></div><div id="cnvs-tips-element-content" class="toast-body small pt-1"></div><a href="#" id="cnvs-tips-element-disable" class="text-muted text-decoration-underline op-06 h-op-08 px-2 pb-2 ms-1 mt-1 d-inline-block" data-cookies="true" style="font-size:.75rem;text-underline-offset:3px;">Disable Random Tips</a></div></div>'), t = document.getElementById("cnvs-tips-element")), document.getElementById("cnvs-tips-element-title")),
                            i = document.getElementById("cnvs-tips-element-content"),
                            n = document.getElementById("cnvs-tips-element-disable"),
                            r = document.getElementById("cnvs-tips-element-enable");
                        a.innerHTML = e.title, i.innerHTML = e.content, n && (n.onclick = function(e) {
                            e.preventDefault(), bootstrap.Toast.getOrCreateInstance(document.getElementById("cnvs-tips-element")).hide(), N.cookie.set("__cnvs_tips_cookies", "hide", 1)
                        }), r && (r.onclick = function(e) {
                            e.preventDefault(), N.cookie.remove("__cnvs_tips_cookies"), window.location.reload()
                        }), a = !0, (a = "hide" == N.cookie.get("__cnvs_tips_cookies") ? !1 : a) && setTimeout(function() {
                            S.notifications(t)
                        }, Math.floor(5e3 * Math.random()))
                    })
                }
            },
            TextSplitter: (a = function(e) {
                return e.textContent || e.innerText
            }, i = function(e, t = "span", a = " ") {
                return e.map(function(e) {
                    return "<" + t + ">" + e + "</" + t + ">"
                }).join(a)
            }, {
                init: function(e) {
                    return N.getSelector(e, !1, !1).length < 1 || (e = N.getSelector(e, !1)).length < 1 || void e.forEach(function(e) {
                        var t = e.getAttribute("data-split-type") || "word";
                        I(e, t)
                    })
                }
            }),
            MediaActions: (s = ["ended", "error", "pause", "seeking", "waiting"], o = ["play", "playing", "timeupdate"], {
                init: function(e) {
                    return N.getSelector(e, !1, !1).length < 1 || (N.initFunction({
                        class: "has-plugin-mediaactions",
                        event: "pluginMediaActionsReady"
                    }), (e = N.getSelector(e, !1)).length < 1) || void e.forEach(function(t) {
                        var a = t.querySelector("video,audio"),
                            e = t.querySelector(".media-trigger-playback"),
                            i = t.querySelector(".media-trigger-volume"),
                            n = t.querySelector(".media-duration");
                        if (!a) return !0;
                        s.forEach(function(e) {
                            a.addEventListener(e, function() {
                                t.classList.remove("media-is-playing"), x(a)
                            })
                        }), o.forEach(function(e) {
                            a.addEventListener(e, function() {
                                t.classList.add("media-is-playing"), x(a), n && (n.innerHTML = O(a.currentTime))
                            })
                        }), a.addEventListener("volumechange", function() {
                            x(a)
                        });
                        var r = setInterval(function() {
                            4 === a.readyState && (n && (n.innerHTML = O(a.duration)), clearInterval(r))
                        }, 1e3);
                        e && (e.onclick = function(e) {
                            e.preventDefault(), a.paused ? a.play() : a.pause()
                        }), i && (i.onclick = function(e) {
                            e.preventDefault(), a.muted ? a.muted = !1 : a.muted = !0
                        })
                    })
                }
            }),
            ViewportDetect: {
                init: function(e) {
                    return N.getSelector(e, !1, !1).length < 1 || (N.initFunction({
                        class: "has-plugin-viewportdetect",
                        event: "pluginViewportDetectReady"
                    }), (e = N.getSelector(e, !1)).length < 1) || void e.forEach(function(e) {
                        var a = e.getAttribute("data-delay") || 0,
                            i = e.getAttribute("data-viewport-class") || "",
                            n = e.getAttribute("data-viewport-class-out") || "",
                            r = e.getAttribute("data-viewport-class-target"),
                            t = e.getAttribute("data-viewport-threshold") || "0",
                            s = e.getAttribute("data-viewport-rootmargin") || "0px",
                            i = i.split(" "),
                            n = n.split(" "),
                            o = !1;
                        (i.includes("dark") || n.includes("dark")) && (o = !0), r = !!r && document.querySelector(r), new IntersectionObserver(function(e) {
                            e.forEach(function(e) {
                                var t = e.target;
                                r = r || t, e.isIntersecting ? setTimeout(function() {
                                    t.classList.add("is-in-viewport"), i.forEach(function(e) {
                                        e && r.classList.add(e)
                                    }), n.forEach(function(e) {
                                        e && r.classList.remove(e)
                                    }), o && Q(r)
                                }, Number(a)) : (t.classList.remove("is-in-viewport"), i.forEach(function(e) {
                                    e && r.classList.remove(e)
                                }), n.forEach(function(e) {
                                    e && r.classList.add(e)
                                }), o && Q(r))
                            })
                        }, {
                            threshold: parseFloat(t),
                            rootMargin: s
                        }).observe(e)
                    })
                }
            },
            ScrollDetect: (g = [], {
                init: function(i) {
                    if (N.getSelector(i, !1, !1).length < 1) return !0;
                    N.isFuncTrue(function() {
                        return "undefined" != typeof fastdom
                    }).then(function(e) {
                        var p, a;
                        return !!e && (N.initFunction({
                            class: "has-plugin-scrolldetect",
                            event: "pluginScrollDetectReady"
                        }), (i = N.getSelector(i, !1)).length < 1 || (p = new ResizeObserver(function(e) {
                            e.forEach(function(e) {
                                var t = t || setTimeout(function() {
                                    a(i), t = !1
                                }, 333)
                            })
                        }), (a = function(e) {
                            g = [], e.forEach(function(e) {
                                var t = e.offsetWidth,
                                    a = e.offsetHeight,
                                    i = N.offset(e).top,
                                    n = N.getVars.viewport.height,
                                    r = e.getAttribute("data-include-width"),
                                    s = e.getAttribute("data-include-height"),
                                    o = e.getAttribute("data-include-offset"),
                                    l = e.getAttribute("data-scroll-offset"),
                                    c = e.getAttribute("data-parallax-ratio"),
                                    d = {},
                                    l = (l && (1 < (l = l.split("%")).length ? i += n * Number(l[0]) * .01 : 1 == l.length && l[0] && (i += Number(l[0]))), i - n),
                                    n = i + a,
                                    u = n - l;
                                d.elem = e, d.start = l, d.end = n, d.range = {
                                    start: a,
                                    end: a,
                                    full: u
                                }, d.width = t, d.height = a, d.offset = i, ("true" == r || e.classList.contains("parallax") && "horizontal" == e.getAttribute("data-parallax-direction")) && e.style.setProperty("--cnvs-scroll-width", d.width), ("true" == s || e.classList.contains("parallax") && "horizontal" != e.getAttribute("data-parallax-direction")) && e.style.setProperty("--cnvs-scroll-height", d.height), "true" == o && e.style.setProperty("--cnvs-scroll-offset", d.offset), isNaN(c) || e.style.setProperty("--cnvs-parallax-ratio", c), H(d), g.push(d), p.observe(e)
                            })
                        })(i), F(), window.addEventListener("scroll", function() {
                            fastdom.mutate(function() {
                                F()
                            })
                        }, {
                            passive: !0
                        }), void p.observe(document.documentElement)))
                    })
                }
            }),
            FontSizer: {
                init: function(e) {
                    return N.getSelector(e, !1, !1).length < 1 || (N.initFunction({
                        class: "has-plugin-fontsizer",
                        event: "pluginFontSizerReady"
                    }), (e = N.getSelector(e, !1)).length < 1) || void e.forEach(function(e) {
                        var t = e.getAttribute("data-target"),
                            a = document.querySelector(t),
                            t = e.getAttribute("data-step") || 10,
                            i = e.getAttribute("data-min") || 12,
                            n = e.getAttribute("data-max") || 24,
                            r = Number(document.defaultView.getComputedStyle(a).getPropertyValue("font-size").split("px")[0]),
                            s = r * Number(t) * .01,
                            t = e.querySelector(".font-size-default"),
                            o = e.querySelector(".font-size-minus"),
                            l = e.querySelector(".font-size-plus");
                        t && (t.onclick = function(e) {
                            e.preventDefault(), a.style.fontSize = r + "px"
                        }), o && (e.querySelector(".font-size-minus").onclick = function(e) {
                            e.preventDefault();
                            e = Number(document.defaultView.getComputedStyle(a).getPropertyValue("font-size").split("px")[0]) - s;
                            i <= e && (a.style.fontSize = e + "px")
                        }), l && (e.querySelector(".font-size-plus").onclick = function(e) {
                            e.preventDefault();
                            e = Number(document.defaultView.getComputedStyle(a).getPropertyValue("font-size").split("px")[0]) + s;
                            e <= n && (a.style.fontSize = e + "px")
                        })
                    })
                }
            },
            Hover3D: {
                init: function(e) {
                    return N.getSelector(e, !1, !1).length < 1 || (N.initFunction({
                        class: "has-plugin-hover3d",
                        event: "pluginHover3DReady"
                    }), (e = N.getSelector(e, !1)).length < 1) || void e.forEach(function(a) {
                        var i = a.clientHeight,
                            n = a.clientWidth;
                        a.addEventListener("mousemove", function(e) {
                            var t = e.layerX,
                                e = e.layerY;
                            a.style.transform = "perspective(500px) scale(1.1) rotateX(" + (e - i / 2) / i * -20 + "deg) rotateY(" + (t - n / 2) / n * 20 + "deg) rotateZ(0)"
                        }), a.addEventListener("mouseout", function() {
                            a.style.transform = "perspective(500px) scale(1) rotateX(0) rotateY(0) rotateZ(0)"
                        }), a.addEventListener("mousedown", function() {
                            a.style.transform = "perspective(500px) scale(0.9) rotateX(0) rotateY(0) rotateZ(0)"
                        }), a.addEventListener("mouseup", function() {
                            a.style.transform = "perspective(500px) scale(1.1) rotateX(0) rotateY(0) rotateZ(0)"
                        })
                    })
                }
            },
            Buttons: {
                init: function(e) {
                    return N.getSelector(e, !1, !1).length < 1 || (N.initFunction({
                        class: "has-plugin-buttons",
                        event: "pluginButtonsReady"
                    }), (e = N.getSelector(e, !1)).length < 1) || void e.forEach(function(e) {
                        var t = e.innerHTML,
                            a = (e.innerHTML = "", document.createElement("div")),
                            i = (a.classList.add("button-inner"), document.createElement("span")),
                            t = (i.innerHTML = t, a.append(i), i.cloneNode(!0));
                        i.after(t), e.append(a)
                    })
                }
            },
            BSComponents: {
                init: function(t) {
                    if (N.getSelector(t, !1, !1).length < 1) return !0;
                    N.isFuncTrue(function() {
                        return "undefined" != typeof bootstrap
                    }).then(function(e) {
                        var a;
                        return !!e && (N.initFunction({
                            class: "has-plugin-bscomponents",
                            event: "pluginBsComponentsReady"
                        }), (t = N.getSelector(t, !1)).length < 1 || ([].slice.call(N.getVars.baseEl.querySelectorAll('[data-bs-toggle="tooltip"]')).map(function(e) {
                            return new bootstrap.Tooltip(e, {
                                container: "body"
                            })
                        }), [].slice.call(N.getVars.baseEl.querySelectorAll('[data-bs-toggle="popover"]')).map(function(e) {
                            return new bootstrap.Popover(e, {
                                container: "body"
                            })
                        }), e = document.querySelectorAll('[data-bs-toggle="tab"],[data-bs-toggle="pill"]'), a = function(e) {
                            new bootstrap.Tab(e).show(), N.getVars.hash && document.querySelector('[data-bs-target="' + N.getVars.hash + '"]') && setTimeout(function() {
                                N.scrollTo(N.offset(e).top - N.getVars.topScrollOffset - 20, 0, !1, "smooth")
                            }, 1e3)
                        }, document.querySelectorAll(".canvas-tabs").forEach(function(e) {
                            var t = e.getAttribute("data-active");
                            t && (t = Number(t) - 1, a(e.querySelectorAll("[data-bs-target]")[t]))
                        }), document.querySelectorAll(".tab-hover").forEach(function(e) {
                            e.querySelectorAll("[data-bs-target]").forEach(function(e) {
                                e.addEventListener("mouseenter", function() {
                                    a(e)
                                })
                            })
                        }), N.getVars.hash && document.querySelector('[data-bs-target="' + N.getVars.hash + '"]') && a(document.querySelector('[data-bs-target="' + N.getVars.hash + '"]')), e.forEach(function(a) {
                            a.addEventListener("shown.bs.tab", function(e) {
                                var t;
                                a.classList.contains("container-modules-loaded") || (t = a.getAttribute("data-bs-target") ? a.getAttribute("data-bs-target") : a.getAttribute("href"), N.runContainerModules(document.querySelector(t)), document.querySelector(t).querySelectorAll(".flexslider").forEach(function(e) {
                                    setTimeout(function() {
                                        jQuery(e).find(".slide").resize()
                                    }, 500)
                                }), a.classList.add("container-modules-loaded"))
                            })
                        }), void document.querySelectorAll(".style-msg .btn-close").forEach(function(t) {
                            t.onclick = function(e) {
                                e.preventDefault(), t.closest(".style-msg").classList.add("d-none")
                            }
                        })))
                    })
                }
            }
        });

        function H(e) {
            var i, n = 0,
                r = 0,
                s = 0,
                o = 0;
            i = e, fastdom.measure(function() {
                var e, t, a = window.scrollY;
                a >= i.start && a <= i.end ? (e = a - i.start, t = a - i.offset, n = e / i.range.full * 100, s = e / i.range.start, o = a > i.start + i.height && a < i.offset ? (s = 1, 0) : a >= i.offset ? (s = 1, t / i.range.end) : 0, r = s - o) : a > i.end ? (n = 100, r = 0, s = o = 1) : n = r = s = o = 0, 0 < r ? i.elem.classList.add("scroll-detect-inview") : i.elem.classList.remove("scroll-detect-inview"), 0 < s && s < 1 ? i.elem.classList.add("scroll-detect-inview-start") : i.elem.classList.remove("scroll-detect-inview-start"), 0 < o && o < 1 ? i.elem.classList.add("scroll-detect-inview-end") : i.elem.classList.remove("scroll-detect-inview-end"), i.elem.style.setProperty("--cnvs-scroll-percent", n), i.elem.style.setProperty("--cnvs-scroll-ratio", r), i.elem.style.setProperty("--cnvs-scroll-start", s), i.elem.style.setProperty("--cnvs-scroll-end", o)
            })
        }

        function F() {
            g.forEach(function(e) {
                H(e)
            })
        }

        function Q(e) {
            e.classList.contains("dark") ? e.setAttribute("data-bs-theme", "dark") : e.removeAttribute("data-bs-theme")
        }

        function x(e) {
            var t = e.closest(".media-wrap");
            e.volume < .1 || 1 == e.muted ? t.classList.add("media-is-muted") : t.classList.remove("media-is-muted")
        }

        function O(e) {
            var t = (e / 60).toFixed(0),
                e = (e % 60).toFixed(0);
            return t + ":" + (e < 10 ? "0" + e : e)
        }

        function I(e, t = "word") {
            e.innerHTML = "letter" == t ? (t = "span", i(a(e).split(""), t, "")) : (t = "span", i(a(e).split(" "), t, " ")), e.querySelectorAll("span") ? .forEach(function(e, t) {
                e.style.setProperty("--cnvs-split-index", t + 1)
            })
        }

        function k(e, t = !1, a = !1) {
            var i = e.getAttribute("data-bodyclass-toggle") || "dark",
                n = e.getAttribute("data-add-class") || "scheme-toggler-active",
                r = e.getAttribute("data-remove-class") || "scheme-toggler-active",
                s = e.getAttribute("data-add-html"),
                o = e.getAttribute("data-remove-html"),
                l = e.getAttribute("data-type") || "trigger",
                c = e.getAttribute("data-remember") || "false";
            N.contains(i, N.getVars.elBody) ? (N.classesFn("add", n, e), N.classesFn("remove", r, e), e.classList.add("body-state-toggled"), "true" == c && a && localStorage.setItem("cnvsBodyColorScheme", "dark"), "checkbox" == l && t ? e.querySelector("input[type=checkbox]").checked = !0 : s && (e.innerHTML = s)) : (N.classesFn("add", r, e), N.classesFn("remove", n, e), e.classList.remove("body-state-toggled"), "true" == c && a && localStorage.removeItem("cnvsBodyColorScheme"), "checkbox" == l && t ? e.querySelector("input[type=checkbox]").checked = !1 : o && (e.innerHTML = o)), T.setBSTheme(), S.dataClasses()
        }

        function R(e, t, a, i, n) {
            var r;
            "checkbox" == e.type ? l = e.checked : "radio" == e.type && !e.checked || (l = e.value), r = l, t.querySelectorAll(".pts-switch") ? .forEach(function(t) {
                n.split(" ").forEach(function(e) {
                    t.classList.remove(e)
                }), i.split(" ").forEach(function(e) {
                    t.classList.add(e)
                })
            }), a.querySelectorAll(".pts-content") ? .forEach(function(e) {
                e.classList.add("d-none")
            }), "checkbox" == e.type && (r = r ? "true" : "false"), i.split(" ").forEach(function(e) {
                t.querySelector(".pts-" + r) ? .classList.remove(e)
            }), n.split(" ").forEach(function(e) {
                t.querySelector(".pts-" + r) ? .classList.add(e)
            }), a.querySelectorAll(".pts-content-" + r).forEach(function(e) {
                e.classList.remove("d-none")
            })
        }

        function _(e, t) {
            if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(e)) return "rgba(" + [(e = "0x" + (e = 3 == (e = e.substring(1).split("")).length ? [e[0], e[0], e[1], e[1], e[2], e[2]] : e).join("")) >> 16 & 255, e >> 8 & 255, 255 & e].join(",") + "," + t + ")";
            console.log("Bad Hex")
        }

        function V(e) {
            e.closest("#gdpr-preferences") && setTimeout(function() {
                window.location.reload()
            }, 500)
        }

        function A(e, t, a, i, n) {
            if (e && a) {
                var r = !1;
                if ("validate" == i) t && (r = "false" == n.getAttribute("aria-invalid"));
                else switch (a.operator) {
                    case "==":
                        t == a.value && (r = !0);
                        break;
                    case "!=":
                        t != a.value && (r = !0);
                        break;
                    case ">":
                        t > a.value && (r = !0);
                        break;
                    case "<":
                        t < a.value && (r = !0);
                        break;
                    case "<=":
                        t <= a.value && (r = !0);
                        break;
                    case ">=":
                        t >= a.value && (r = !0);
                        break;
                    case "in":
                        a.value.includes(t) && (r = !0);
                        break;
                    default:
                        r = !1
                }
                r ? (e.classList.add("condition-fulfilled"), e.querySelectorAll("input,select,textarea,button").forEach(function(e) {
                    e.disabled = !1
                })) : (e.classList.remove("condition-fulfilled"), e.querySelectorAll("input,select,textarea,button").forEach(function(e) {
                    e.disabled = !0
                }))
            }
        }

        function D(e) {
            ! function() {
                if (N.getOptions.scrollExternalLinks != true) return;
                if (document.querySelector('a[data-href="' + N.getVars.hash + '"]') || document.querySelector('a[data-scrollto="' + N.getVars.hash + '"]')) {
                    window.onbeforeunload = function() {
                        N.scrollTo(0, 0, false, "auto")
                    };
                    N.scrollTo(0, 0, false, "auto");
                    var t = document.querySelector(N.getVars.hash);
                    if (t) var a = setInterval(function() {
                        var e = t.getAttribute("data-onepage-settings") && JSON.parse(t.getAttribute("data-onepage-settings"));
                        if (e) {
                            c(t, e, 0);
                            clearInterval(a)
                        }
                    }, 250)
                }
            }(), N.getVars.elLinkScrolls && N.getVars.elLinkScrolls.forEach(function(t) {
                W(t, "scrollTo"), t.onclick = function(e) {
                    e.preventDefault(), Y(t, "scrollTo", !0)
                }
            }), N.getVars.elOnePageMenus && N.getVars.elOnePageMenus.forEach(function(e) {
                N.getVars.elOnePageActiveClass = e.getAttribute("data-active-class") || "current", N.getVars.elOnePageParentSelector = e.getAttribute("data-parent") || "li", N.getVars.elOnePageActiveOnClick = e.getAttribute("data-onclick-active") || "false", e.querySelectorAll("[data-href]").forEach(function(t) {
                    W(t, "onePage"), t.onclick = function(e) {
                        e.preventDefault(), Y(t, "onePage", !0)
                    }
                })
            })
        }

        function W(e, t) {
            var a, i = r(e, t);
            i && (i.removeAttribute("data-onepage-settings"), a = d(i, e), setTimeout(function() {
                i.hasAttribute("data-onepage-settings") || i.setAttribute("data-onepage-settings", JSON.stringify(a)), N.getVars.pageSectionEls = document.querySelectorAll("[data-onepage-settings]")
            }, 1e3))
        }

        function Y(e, t, a = !1) {
            var i = r(e, t),
                n = i.getAttribute("id");
            i && (a = 1 == a ? d(i, e, !1) : JSON.parse(i.getAttribute("data-onepage-settings")), "scrollTo" != t && "true" == N.getVars.elOnePageActiveOnClick && ((parent = e.closest(".one-page-menu")).querySelectorAll(N.getVars.elOnePageParentSelector).forEach(function(e) {
                e.classList.remove(N.getVars.elOnePageActiveClass)
            }), parent.querySelector('a[data-href="#' + n + '"]').closest(N.getVars.elOnePageParentSelector).classList.add(N.getVars.elOnePageActiveClass)), N.getVars.elBody.classList.contains("is-expanded-menu") && !N.getVars.elBody.classList.contains("overlay-menu") || N.getVars.recalls.menureset(), c(i, a, 250))
        }

        function C() {
            N.getVars.elOnePageMenus && N.getVars.elOnePageMenus.forEach(function(e) {
                e.querySelectorAll("[data-href]").forEach(function(e) {
                    e.closest(N.getVars.elOnePageParentSelector).classList.remove(N.getVars.elOnePageActiveClass)
                })
            }), N.getVars.elOnePageMenus && N.getVars.elOnePageMenus.forEach(function(e) {
                var i;
                e.querySelector('[data-href="#' + (void 0 === N.getVars.pageSectionEls || (N.getVars.pageSectionEls.forEach(function(e) {
                    var t, a = e.getAttribute("data-onepage-settings") && JSON.parse(e.getAttribute("data-onepage-settings"));
                    a && (a = N.offset(e).top - a.offset - 5) <= (t = window.scrollY) && t < a + e.offsetHeight && e.getAttribute("id") != i && e.getAttribute("id") && (i = e.getAttribute("id"))
                }), i)) + '"]') ? .closest(N.getVars.elOnePageParentSelector).classList.add(N.getVars.elOnePageActiveClass)
            })
        }

        function G(e) {
            var e = new Date(e),
                t = new Date,
                e = parseInt((t.getTime() - e) / 1e3);
            return (e += 60 * t.getTimezoneOffset()) < 60 ? "less than a minute ago" : e < 120 ? "about a minute ago" : e < 3600 ? parseInt(e / 60).toString() + " minutes ago" : e < 7200 ? "about an hour ago" : e < 86400 ? "about " + parseInt(e / 3600).toString() + " hours ago" : e < 172800 ? "1 day ago" : parseInt(e / 86400).toString() + " days ago"
        }

        function J(e, t) {
            e.easyPieChart({
                size: t.size,
                animate: t.speed,
                scaleColor: !1,
                trackColor: t.trackcolor,
                lineWidth: t.width,
                lineCap: "square",
                barColor: t.color
            })
        }

        function U(e, a) {
            var t, i;
            "true" == a.comma ? (t = "\\B(?=(\\d{" + a.places + "})+(?!\\d))", i = new RegExp(t, "g"), e.find("span").countTo({
                formatter: function(e, t) {
                    return e = (e = e.toFixed(t.decimals)).replace(i, a.sep)
                }
            })) : e.find("span").countTo()
        }

        function X(e) {
            e.sliderPx.el && fastdom.measure(function() {
                e.scrollPos.y = window.scrollY, e.body.classList.contains("is-expanded-menu") && !e.isMobile ? e.height + e.sliderPx.offset + 50 > e.scrollPos.y ? (e.classes.add("slider-parallax-visible"), e.classes.remove("slider-parallax-invisible"), e.scrollPos.y > e.sliderPx.offset ? ("object" == typeof e.sliderPx.el.querySelector(".slider-inner") ? (u = -.4 * (e.scrollPos.y - e.sliderPx.offset), p = -.15 * (e.scrollPos.y - e.sliderPx.offset), E(0, u, e.sliderPx.inner)) : (u = (e.scrollPos.y - e.sliderPx.offset) / 1.5, p = (e.scrollPos.y - e.sliderPx.offset) / 7, E(0, u, e.sliderPx.el)), E(0, p, e.sliderPx.caption)) : (e.sliderPx.el.querySelector(".slider-inner") ? E(0, 0, e.sliderPx.inner) : E(0, 0, e.sliderPx.el), E(0, 0, e.sliderPx.caption))) : (e.classes.add("slider-parallax-invisible"), e.classes.remove("slider-parallax-visible")) : (e.sliderPx.el.querySelector(".slider-inner") ? E(0, 0, e.sliderPx.inner) : E(0, 0, e.sliderPx.el), E(0, 0, e.sliderPx.caption), e.classes.add("slider-parallax-visible"), e.classes.remove("slider-parallax-invisible"))
            })
        }

        function E(e, t, a) {
            a && fastdom.mutate(function() {
                a.style.transform = "translate3d(" + e + ", " + t + "px, 0)"
            })
        }

        function $(a) {
            a.sliderPx.el.length < 1 || fastdom.mutate(function() {
                var t;
                a.body.classList.contains("is-expanded-menu") && !a.isMobile ? (t = a.header && a.header.classList.contains("transparent-header") || a.body.classList.contains("side-header") ? 100 : 0, a.sliderPx.el.classList.contains("slider-parallax-visible") && a.sliderPx.el.querySelectorAll(".slider-arrow-left,.slider-arrow-right,.slider-caption,.slider-element-fade").forEach(function(e) {
                    e.style.opacity = 1 - 1.85 * (a.scrollPos.y - t) / a.height
                })) : a.sliderPx.el.querySelectorAll(".slider-arrow-left,.slider-arrow-right,.slider-caption,.slider-element-fade").forEach(function(e) {
                    e.style.opacity = 1
                })
            })
        }

        function M(e) {
            e.filter(".has-init-isotope").isotope("layout")
        }

        function Z(e) {
            var t = !1,
                e = document.getElementById(e).nextElementSibling;
            return t = e ? e.getAttribute("id") : t
        }

        function K(e) {
            var t = !1,
                e = document.getElementById(e).previousElementSibling;
            return t = e ? e.getAttribute("id") : t
        }

        function ee(e) {
            if (e) {
                var t, a, i = !1;
                if (e.classList.contains("dark")) {
                    if (0 < (a = (t = N.getVars.headerClasses || "").length))
                        for (var n = 0; n < a; n++)
                            if ("dark" == t[n]) {
                                i = !0;
                                break
                            }
                    var r = document.querySelector("#header.transparent-header:not(.sticky-header,.semi-transparent,.floating-header)");
                    r && r.classList.add("dark"), i || (r = document.querySelector("#header.transparent-header.sticky-header,#header.transparent-header.semi-transparent.sticky-header,#header.transparent-header.floating-header.sticky-header")) && r.classList.remove("dark"), N.getVars.elHeaderWrap.classList.remove("not-dark")
                } else N.getVars.elBody.classList.contains("dark") ? (e.classList.add("not-dark"), document.querySelector("#header.transparent-header:not(.semi-transparent,.floating-header)").classList.remove("dark"), document.querySelector("#header.transparent-header:not(.sticky-header,.semi-transparent,.floating-header)") ? .querySelector("#header-wrap").classList.add("not-dark")) : (document.querySelector("#header.transparent-header:not(.semi-transparent,.floating-header)").classList.remove("dark"), N.getVars.elHeaderWrap.classList.remove("not-dark"));
                N.getVars.elHeader.classList.contains("sticky-header") && T.headers()
            }
        }

        function q(e) {
            var t = N.getVars.elPageMenu;
            window.scrollY > e ? !N.getVars.elBody.classList.contains("device-up-lg") && "true" != t.getAttribute("data-mobile-sticky") || t.classList.add("sticky-page-menu") : t.classList.remove("sticky-page-menu")
        }

        function j() {
            var t = N.getVars.elBody,
                a = ".mega-menu-content, .sub-menu-container";
            document.querySelectorAll(".primary-menu-trigger").forEach(function(e) {
                e.classList.remove("primary-menu-trigger-active")
            }), N.getVars.elPrimaryMenus.forEach(function(e) {
                t.classList.contains("is-expanded-menu") ? (e.querySelector(".menu-container") ? .classList.remove("d-block", "d-none"), e.querySelectorAll(a) ? .forEach(function(e) {
                    e.classList.remove("d-none")
                }), document.querySelectorAll(".menu-container:not(.mobile-primary-menu)").forEach(function(e) {
                    e.style.display = ""
                }), N.getVars.elPrimaryMenus.forEach(function(e) {
                    e.querySelectorAll(".mobile-primary-menu") ? .forEach(function(e) {
                        e.classList.remove("d-block")
                    })
                })) : e.querySelector(".menu-container") ? .classList.remove("d-block"), e.querySelectorAll(a) ? .forEach(function(e) {
                    e.classList.remove("d-block")
                }), e.classList.remove("primary-menu-active");
                e = t.className.split(" ").filter(function(e) {
                    return !e.startsWith("primary-menu-open")
                });
                t.className = e.join(" ").trim()
            })
        }

        function te() {
            function a(e) {
                var t, a;
                e && !e.querySelector(".sub-menu-indicator") && ((t = document.createElement("i")).classList.add("sub-menu-indicator"), (a = e.closest(".primary-menu") ? .getAttribute("data-arrow-class") || "fa-solid fa-caret-down") && a.split(" ").forEach(function(e) {
                    t.classList.add(e)
                }), e.append(t))
            }
            document.querySelectorAll(".top-links-item").forEach(function(e) {
                var t = e.querySelector(":scope > a");
                e.querySelector(":scope > .top-links-sub-menu, :scope > .top-links-section") && a(t)
            }), document.querySelectorAll(".menu-item").forEach(function(e) {
                var t = e.querySelector(":scope > .menu-link > div");
                !e.classList.contains("mega-menu-title") && e.querySelector(":scope > .sub-menu-container, :scope > .mega-menu-content") && a(t)
            }), document.querySelectorAll(".page-menu-item").forEach(function(e) {
                var t = e.querySelector(":scope > a > div");
                e.querySelector(":scope > .page-menu-sub-menu") && a(t)
            })
        }

        function z() {
            var i = ".mega-menu-content, .sub-menu-container",
                n = ".menu-item",
                r = ".sub-menu-trigger",
                t = N.getVars.elBody.classList,
                e = document.querySelectorAll(r),
                a = new Array,
                e = (e.forEach(function(e) {
                    e = e.closest(".menu-item").querySelector('.menu-link[href^="#"]');
                    e && a.push(e)
                }), [].slice.call(e).concat([].slice.call(a)));
            document.querySelectorAll(r).forEach(function(e) {
                e.classList.remove("icon-rotate-90")
            }), t.contains("is-expanded-menu") || (N.getVars.elPrimaryMenus.forEach(function(e) {
                e.querySelectorAll(i).forEach(function(e) {
                    e.classList.add("d-none"), t.remove("primary-menu-open")
                })
            }), e.forEach(function(a) {
                a.onclick = function(e) {
                    e.preventDefault();
                    var t, e = a;
                    a.classList.contains("sub-menu-trigger") || (e = a.closest(n).querySelector(":scope > " + r)), N.siblings(e.closest(n)).forEach(function(e) {
                        e.querySelectorAll(i).forEach(function(e) {
                            e.classList.add("d-none")
                        })
                    }), e.closest(".mega-menu-content") && (t = [], N.parents(e, n).forEach(function(e) {
                        t.push(e.querySelector(":scope > " + i))
                    }), [].slice.call(e.closest(".mega-menu-content").querySelectorAll(i)).filter(function(e) {
                        return !t.includes(e)
                    }).forEach(function(e) {
                        e.classList.add("d-none")
                    })), L(e, n, i, r, "d-none")
                }
            })), t.contains("is-expanded-menu") && ((t.contains("side-header") || t.contains("overlay-menu")) && N.getVars.elPrimaryMenus.forEach(function(e) {
                e.classList.add("on-click"), e.querySelectorAll(r).forEach(function(e) {
                    e.style.zIndex = "-1"
                })
            }), [].slice.call(N.getVars.elPrimaryMenus).filter(function(e) {
                return e.matches(".on-click")
            }).forEach(function(e) {
                N.has(e.querySelectorAll(n), r).forEach(function(e) {
                    var a = e.querySelector(":scope > .menu-link");
                    a.onclick = function(e) {
                        var t;
                        e.preventDefault(), N.siblings(a.closest(n)).forEach(function(e) {
                            e.querySelectorAll(i).forEach(function(e) {
                                e.classList.remove("d-block")
                            })
                        }), a.closest(".mega-menu-content") && (t = [], N.parents(a, n).forEach(function(e) {
                            t.push(e.querySelector(":scope > " + i))
                        }), [].slice.call(a.closest(".mega-menu-content").querySelectorAll(i)).filter(function(e) {
                            return !t.includes(e)
                        }).forEach(function(e) {
                            e.classList.remove("d-block")
                        })), L(a, n, i, r, "d-block")
                    }
                })
            })), document.querySelectorAll(".top-links").forEach(function(e) {
                !e.classList.contains("on-click") && t.contains("device-up-lg") || e.querySelectorAll(".top-links-item").forEach(function(t) {
                    0 < t.querySelectorAll(".top-links-sub-menu,.top-links-section").length && (t.querySelector(":scope > a").onclick = function(e) {
                        e.preventDefault(), N.siblings(t).forEach(function(e) {
                            e.querySelectorAll(".top-links-sub-menu, .top-links-section").forEach(function(e) {
                                e.classList.remove("d-block")
                            })
                        }), t.querySelector(":scope > .top-links-sub-menu, :scope > .top-links-section").classList.toggle("d-block"), N.siblings(t).forEach(function(e) {
                            e.classList.remove("current")
                        }), t.classList.toggle("current")
                    })
                })
            }), w(document.querySelectorAll(".top-links-section"))
        }

        function ae() {
            var e, t = N.getVars.elHeader,
                a = document.querySelector(".include-header");
            N.getVars.headerOffset = t.offsetTop, (N.getVars.elHeader ? .classList.contains("floating-header") || a ? .classList.contains("include-topbar")) && (N.getVars.headerOffset = N.offset(t).top), N.getVars.elHeaderWrap ? .classList.add("position-absolute"), N.getVars.headerWrapOffset = N.getVars.headerOffset + N.getVars.elHeaderWrap ? .offsetTop, N.getVars.elHeaderWrap ? .classList.remove("position-absolute"), t.hasAttribute("data-sticky-offset") && ("full" == (a = t.getAttribute("data-sticky-offset")) ? (N.getVars.headerWrapOffset = N.viewport().height, void 0 !== (e = t.getAttribute("data-sticky-offset-negative")) && (N.getVars.headerWrapOffset = "auto" == e ? N.getVars.headerWrapOffset - t.offsetHeight - 1 : N.getVars.headerWrapOffset - Number(e) - 1)) : N.getVars.headerWrapOffset = Number(a))
        }

        function B(e) {
            !N.getVars.elBody.classList.contains("is-expanded-menu") && "true" != N.getVars.mobileSticky || (window.scrollY > e ? N.getVars.elBody.classList.contains("side-header") || (N.getVars.elHeader.classList.add("sticky-header"), P("sticky"), N.getVars.elBody.classList.contains("is-expanded-menu") && "true" == N.getVars.stickyShrink && !N.getVars.elHeader.classList.contains("no-sticky") && (window.scrollY - e > Number(N.getVars.stickyShrinkOffset) ? N.getVars.elHeader.classList.add("sticky-header-shrink") : N.getVars.elHeader.classList.remove("sticky-header-shrink"))) : (ie(), "true" == N.getVars.mobileSticky && P("responsive")))
        }

        function ie() {
            N.getVars.elHeader.className = N.getVars.headerClasses, N.getVars.elHeader.classList.remove("sticky-header", "sticky-header-shrink"), N.getVars.elHeaderWrap && (N.getVars.elHeaderWrap.className = N.getVars.headerWrapClasses), N.getVars.elHeaderWrap ? .classList.contains("force-not-dark") || N.getVars.elHeaderWrap ? .classList.remove("not-dark"), T.sliderMenuClass()
        }

        function P(e) {
            var t = "";
            if ("responsive" == e) {
                if (N.getVars.elBody.classList.contains("is-expanded-menu")) return;
                N.getVars.mobileHeaderClasses && (t = N.getVars.mobileHeaderClasses.split(/ +/))
            } else {
                if (!N.getVars.elHeader.classList.contains("sticky-header")) return;
                N.getVars.stickyHeaderClasses && (t = N.getVars.stickyHeaderClasses.split(/ +/))
            }
            var a = t.length;
            if (0 < a)
                for (var i = 0, i = 0; i < a; i++) "not-dark" == t[i] ? (N.getVars.elHeader.classList.remove("dark"), N.getVars.elHeaderWrap ? .classList.contains(".not-dark") || N.getVars.elHeaderWrap ? .classList.add("not-dark")) : ("dark" == t[i] && N.getVars.elHeaderWrap ? .classList.remove("not-dark force-not-dark"), N.getVars.elHeader.classList.contains(t[i]) || N.getVars.elHeader.classList.add(t[i]));
            T.setBSTheme()
        }

        function ne() {
            var e = document.querySelector(".include-header"),
                t = N.getVars.elHeader;
            N.getVars.headerHeight = t.offsetHeight, e && (e.style.marginTop = "", N.getVars.elBody.classList.contains("is-expanded-menu")) && ((t.classList.contains("floating-header") || e.classList.contains("include-topbar")) && (N.getVars.headerHeight = t.offsetHeight + N.offset(t).top), e.style.marginTop = -1 * N.getVars.headerHeight + "px", S.sliderParallax())
        }

        function re(e) {
            var t = N.getVars.elBody.classList,
                a = e.getAttribute("data-mobile") || "false",
                e = e.getAttribute("data-offset") || 450;
            "false" == a && (t.contains("device-xs") || t.contains("device-sm") || t.contains("device-md")) || (window.scrollY > Number(e) ? t.add("gototop-active") : t.remove("gototop-active"))
        }
    });