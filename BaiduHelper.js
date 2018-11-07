// ==UserScript==
// @name            BaiduHelper
// @author          Alexwoo
// @description     Optimize user search experience
// @namespace       YWxleHdvb19ncmVhc3ltb25rZXlfYmFpZHVoZWxwZXI
// @version         0.0.1
// @match           *://www.baidu.com/*
// @run-at          document-start
// @license         MIT License
// @compatible      Chrome
// @grant           GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    console.log("Dear friend, you just have loaded plugin 'Baidu Helper'!");

    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

    var observer = new MutationObserver(function(records){
        addGoogleSearch();
    });

    document.onreadystatechange = function(){
        if(document.readyState == "interactive"){
            var searchResultArea = document.getElementById("wrapper_wrapper");
            var option = {
                "childList" : true,
                "subtree": true
            }
            observer.observe(searchResultArea, option);
        }
    };

    function addGoogleSearch() {
        /**
         * b is used as a prefix to represent Baidu elements
         */
        var bInput = document.getElementById('kw');
        var bForm = document.getElementById('form');
        var bWrapper = document.getElementsByClassName("s_btn_wr")[0];

        if (bInput.value == "") {
            return;
        }

        GM_addStyle(`
        .gs_btn_wr{width:auto;height:auto;border-bottom:1px solid transparent;*border-bottom:0}
        .gs_btn_wr{width:97px;height:34px;display:inline-block;background-position:-120px -48px;*position:relative;z-index:0;vertical-align:top}
        .gs_btn{width:95px;height:32px;padding-top:2px\9;font-size:14px;padding:0;background-color:#ddd;background-position:0 -48px;border:0;cursor:pointer}
        .gs_btn{width:100px;height:34px;color:#fff;letter-spacing:1px;background:#2ecc71;border-bottom:1px solid #27ae60;outline:medium;*border-bottom:0;-webkit-appearance:none;-webkit-border-radius:0}
        .gs_btn.btnhover{background:#1abc9c;border-bottom:1px solid #16a085;*border-bottom:0;box-shadow:1px 1px 1px #ccc}
        `);


        var oldWrapperGap = document.getElementById("wrgap");
        var oldGWrapper = document.getElementById("gwr");

        if (oldWrapperGap) {
            oldWrapperGap.remove();
        }

        if (oldGWrapper) {
            oldGWrapper.remove();
            bInput.name = "kw";
            bForm.action = "/s";
        }

        var wrapperGap = document.createElement("span");
        wrapperGap.id = "wrgap";
        wrapperGap.innerHTML = '&nbsp;';
        bWrapper.parentNode.insertBefore(wrapperGap, bWrapper.nextsibling);

        /**
         * g is used as a prefix to represent Google elements
         */
        var gWrapper = document.createElement("span");
        gWrapper.id = "gwr";
        gWrapper.className = "gs_btn_wr";
        gWrapper.innerHTML = '<input type="button" id="gsu" value="不，我要谷歌" class="bg gs_btn">';
        wrapperGap.parentNode.insertBefore(gWrapper, wrapperGap.nextsibling);

        var gBtn = document.getElementById("gsu");
        if (gBtn) {
            gBtn.onclick = function () {
                bInput.name = 'q';
                bForm.method = "get";
                bForm.action = "http://www.google.com/search";
                bForm.submit();
            }

            gBtn.onmouseover = function () {
                gBtn.classList.add("btnhover");
            }

            gBtn.onmouseout = function () {
                gBtn.classList.remove("btnhover");
            }
        }
    }
    setTimeout(()=>{
        var searchResultArea = document.getElementById("wrapper_wrapper");
        if (searchResultArea.innerHTML != "") {
            addGoogleSearch();
        }
    },2000);
})();