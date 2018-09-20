// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener('resume', onResume.bind(this), false);
        setupVue();
        
    };

    function getArticles() {
            var articles = []
            $.get("http://www.lequotidien-oran.com/", function (data) {
                var el = $('<div></div>');
                el.html(data);
                $(".article", el).each(function (art) {
                    var art;
                    var article = $(this);
                    var title = article.find(".captionTxt").text();
                    var link = article.find(".captionTxt").find("a").attr("href");
                    var body = article.find("#article_body").text();
                    body = body.replace("[Suite...]", "");
                    var content = getArticleBody(link);
                    art = { tit: title, bod: body, li: link, cont:content };
                    articles.push(art);
                });

            });

            return articles;
    };

     function getArticleBody(link) {
         var body = "";
         $.ajax({
             async: false,
             type: 'GET',
             url: link,
             success: function (data) {
                 var el = $('<div></div>');
                 el.html(data);
                 var element = $("div[align='justify']", el)
                 var content = element.text();
                 body = content

             }
         });
       
        return body;

    }

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function setupVue() {
        const article_page = {
            key: 'article',
            template: '#article',

            data() {
                return {
                    title: "no test",
                }
            },
           
            methods: {
                back() {
                    this.$emit('push-page', home_page);
                }
            }
        };

        const home_page = {
            key: 'home',
            template: '#home',
            methods: {
                push(art) {
                    this.$emit('push-page', {
                        extends: article_page,
                        data() {
                            return { title: art.tit, link: art.li, content: art.cont}
                        }
                    });
                },

                share(link) {
                    navigator.share(link, "Partager cet article", "plain/text");

                }
            },

            data() {
                return {
                    articles: getArticles(),
                }
            },

            computed: {
                modalVisible: function () {
                    if (this.articles === undefined || this.articles.length == 0) {
                        return true
                    }
                    else
                        return false

                }

            }
        }

        new Vue({
            el: '#app',
            template: '#main',
            data() {
                return {
                    pageStack: [home_page]
                };
            }
        });
    }

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
} )();