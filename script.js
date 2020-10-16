//Global Variables

var displaySupport = false;
var displayChat = false;

(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";

hljs.initHighlightingOnLoad();

var HC_SETTINGS = {
  css: {
    activeClass: "is-active",
    hiddenClass: "is-hidden"
  }
};

var Utils = {
  isHomepage: function isHomepage() {
    return $("[data-home-page]").length > 0;
  }
};

$(function () {
  var $topbar = $("[data-topbar]");
  var $heroUnit = $("[data-hero-unit]");
  var $topSearchBar = $(".topbar__search-bar");
  var $topSearchBarQuery = $topSearchBar.find("#query");
  var $topSearchBarBtn = $(".topbar__btn-search");
  var $footerSubmitTicket = $("[data-footer-submit-ticket]");

  if (Utils.isHomepage()) {
    $topbar.addClass("topbar--large");
    $heroUnit.removeClass(HC_SETTINGS.css.hiddenClass);
    $("[data-wave-large]").removeClass(HC_SETTINGS.css.hiddenClass);
    $footerSubmitTicket.removeClass(HC_SETTINGS.css.hiddenClass);
  } else {
    $topbar.addClass("topbar--small");
    $("[data-wave-small]").removeClass(HC_SETTINGS.css.hiddenClass);
  } 

  $topbar.removeClass(HC_SETTINGS.css.hiddenClass);
  
  $("[data-toggle-menu]").click(function () {
    $(this).toggleClass(HC_SETTINGS.css.activeClass);
    $("[data-menu]").toggle();
  });

  // Display support/chat based on tags
  function isSupport (element, index, array) { return (element === 'mini-support' || element === 'basic-support' || element === 'internal');　}
  function isChat (element, index, array) { return (element === 'chat-support'); }
  
  // Check login
  if (HelpCenter.user.role !== 'anonymous') {
    // Check support personal tag
    displaySupport = (HelpCenter.user.tags.some(isSupport) === true);
    
    // Check support organization tag if personal tag not found
    if (displaySupport !== true) {
        HelpCenter.user.organizations.forEach(function(x) {
        displaySupport = displaySupport || x.tags.some(isSupport);
        return (displaySupport === true);
      });
    }
    
    //Check chat personal tag
    displayChat = (HelpCenter.user.tags.some(isChat) === true);

    //Check chat organizaiton tag
    if (displayChat !== true) {
        HelpCenter.user.organizations.forEach(function(x) {
        displayChat = displayChat || x.tags.some(isChat);
        return (displayChat === true);
      });
    }
  }
　
  // Hide support button if display is false
  if (displaySupport === false) {
    $('a[href$="requests/new"]').hide();
    //$('.my-activities').hide();  20191008 display activities for all
  }
  
  // Enable chat widget if chat display is true
  if (displayChat === false) {
    zE('webWidget', 'setLocale', 'ja');
    zE('webWidget', 'hide');
  } else {
    zE('webWidget', 'setLocale', 'ja');
  }

  //Rename Community
  $(".breadcrumbs li a:contains('コミュニティ')").text('製品の改善要望');
  $(".search-results-subheading__title:contains('コミュニティ')").text('製品の改善要望');
  $(".breadcrumbs li a:contains('Community')").text('Feature Requests');
  $(".search-results-subheading__title:contains('Community')").text('Feature Requests');
  
  //Hide Chinese
  $('a:contains("简体中文")').hide();

  // Social share popups
  $(".share a").click(function (e) {
    e.preventDefault();
    window.open(this.href, "", "height = 500, width = 500");
  });

  // Toggle the share dropdown in communities
  $(".share-label").on("click", function (e) {
    e.stopPropagation();
    var isSelected = this.getAttribute("aria-selected") === "true";
    this.setAttribute("aria-selected", !isSelected);
    $(".share-label").not(this).attr("aria-selected", "false");
  });

  $(document).on("click", function () {
    $(".share-label").attr("aria-selected", "false");
  });

  // Submit search on select change
  $("#request-status-select, #request-organization-select").on("change", function () {
    search();
  });

  // Submit search on input enter
  $("#quick-search").on("keypress", function (e) {
    if (e.which === 13) {
      search();
    }
  });

  function search() {
    window.location.search = $.param({
      query: $("#quick-search").val(),
      status: $("#request-status-select").val(),
      organization_id: $("#request-organization-select").val()
    });
  }

  $(".image-with-lightbox").magnificPopup({
    type: "image",
    closeOnContentClick: true,
    closeBtnInside: false,
    fixedContentPos: true,
    mainClass: "mfp-with-zoom", // class to remove default margin from left and right side
    image: {
      verticalFit: true
    },
    zoom: {
      enabled: true,
      duration: 300 // don't foget to change the duration also in CSS
    }
  });

  $(".image-with-video-icon").magnificPopup({
    disableOn: 700,
    type: "iframe",
    mainClass: "mfp-fade",
    removalDelay: 160,
    preloader: false,
    fixedContentPos: false
  });

  $(".accordion__item-title").on("click", function () {
    var $title = $(this);
    $title.toggleClass("accordion__item-title--active");
    $title.parents(".accordion__item").find(".accordion__item-content").slideToggle();
  });

  $(".tabs-link").click(function (e) {
    e.preventDefault();
    var $link = $(this);
    var tabIndex = $link.index();
    var $tab = $link.parents(".tabs").find(".tab").eq(tabIndex);
    $link.addClass(HC_SETTINGS.css.activeClass).siblings().removeClass(HC_SETTINGS.css.activeClass);
    $tab.removeClass(HC_SETTINGS.css.hiddenClass).siblings(".tab").addClass(HC_SETTINGS.css.hiddenClass);
  });

  $topSearchBarBtn.click(function () {
    $(this).addClass(HC_SETTINGS.css.hiddenClass);
    $topSearchBar.removeClass(HC_SETTINGS.css.hiddenClass);
    $topSearchBarQuery.focus();
  });

  $(document).mouseup(function (e) {
    if (!$topSearchBarQuery.is(e.target)) {
      $topSearchBar.addClass(HC_SETTINGS.css.hiddenClass);
      $topSearchBarBtn.removeClass(HC_SETTINGS.css.hiddenClass);
    }
  });

  // Fix animated icons
  $(".fa-spin").empty();

  $("img.custom-block__image").each(function () {
    var $img = $(this);
    var imgID = $img.attr("id");
    var imgClass = $img.attr("class");
    var imgURL = $img.attr("src") + "?reset";

    $.get(imgURL, function (data) {
      // Get the SVG tag, ignore the rest
      var $svg = $(data).find("svg");

      // Add replaced image's ID to the new SVG
      if (typeof imgID !== "undefined") {
        $svg = $svg.attr("id", imgID);
      }
      // Add replaced image's classes to the new SVG
      if (typeof imgClass !== "undefined") {
        $svg = $svg.attr("class", imgClass + " replaced-svg");
      }

      // Remove any invalid XML tags as per http://validator.w3.org
      $svg = $svg.removeAttr("xmlns:a");

      // Replace image with new SVG
      $img.replaceWith($svg);
    }, "xml");
  });
});

},{}]},{},[1]);