import {SettingsCookie} from "data";
import DataStore from "./datastore";
import Utilities from "./utilities";

function QuickEmoteMenu() {

}

QuickEmoteMenu.prototype.init = function() {
    this.initialized = true;
    $(document).on("mousedown", function(e) {
        if (e.target.id != "rmenu") $("#rmenu").remove();
    });
    this.favoriteEmotes = {};
    const fe = DataStore.getBDData("bdfavemotes");
    if (fe !== "" && fe !== null) {
        this.favoriteEmotes = JSON.parse(atob(fe));
    }

    let qmeHeader = "";
    qmeHeader += "<div id=\"bda-qem\">";
    qmeHeader += "    <button class=\"active\" id=\"bda-qem-twitch\" onclick='quickEmoteMenu.switchHandler(this); return false;'>Twitch</button>";
    qmeHeader += "    <button id=\"bda-qem-favourite\" onclick='quickEmoteMenu.switchHandler(this); return false;'>Favourite</button>";
    qmeHeader += "    <button id=\"bda-qem-emojis\" onclick='quickEmoteMenu.switchHandler(this); return false;'>Emojis</buttond>";
    qmeHeader += "</div>";
    this.qmeHeader = qmeHeader;

    let teContainer = "";
    teContainer += "<div id=\"bda-qem-twitch-container\">";
    teContainer += "    <div class=\"scroller-wrap scrollerWrap-2lJEkd fade\">";
    teContainer += "        <div class=\"scroller scroller-2FKFPG\">";
    teContainer += "            <div class=\"emote-menu-inner\">";
    let url = "";
    for (const emote in window.bdEmotes.TwitchGlobal) {
        if (window.bdEmotes.TwitchGlobal.hasOwnProperty(emote)) {
            url = window.bdEmotes.TwitchGlobal[emote];
            teContainer += "<div class=\"emote-container\">";
            teContainer += "    <img class=\"emote-icon\" alt=\"\" src=\"" + url + "\" title=\"" + emote + "\">";
            teContainer += "    </img>";
            teContainer += "</div>";
        }
    }
    teContainer += "            </div>";
    teContainer += "        </div>";
    teContainer += "    </div>";
    teContainer += "</div>";
    this.teContainer = teContainer;

    let faContainer = "";
    faContainer += "<div id=\"bda-qem-favourite-container\">";
    faContainer += "    <div class=\"scroller-wrap scrollerWrap-2lJEkd fade\">";
    faContainer += "        <div class=\"scroller scroller-2FKFPG\">";
    faContainer += "            <div class=\"emote-menu-inner\">";
    for (const emote in this.favoriteEmotes) {
        url = this.favoriteEmotes[emote];
        faContainer += "<div class=\"emote-container\">";
        faContainer += "    <img class=\"emote-icon\" alt=\"\" src=\"" + url + "\" title=\"" + emote + "\" oncontextmenu='quickEmoteMenu.favContext(event, this);'>";
        faContainer += "    </img>";
        faContainer += "</div>";
    }
    faContainer += "            </div>";
    faContainer += "        </div>";
    faContainer += "    </div>";
    faContainer += "</div>";
    this.faContainer = faContainer;
};

QuickEmoteMenu.prototype.favContext = function(e, em) {
    e.stopPropagation();
    const menu = $("<div>", {"id": "removemenu", "data-emoteid": $(em).prop("title"), "text": "Remove", "class": "bd-context-menu context-menu theme-dark"});
    menu.css({
        top: e.pageY - $("#bda-qem-favourite-container").offset().top,
        left: e.pageX - $("#bda-qem-favourite-container").offset().left
    });
    $(em).parent().append(menu);
    menu.on("click", function(e) {
        e.preventDefault();
        e.stopPropagation();
        $(this).remove();

        delete this.favoriteEmotes[$(this).data("emoteid")];
        this.updateFavorites();
        return false;
    });
    return false;
};

QuickEmoteMenu.prototype.switchHandler = function(e) {
    this.switchQem($(e).attr("id"));
};

QuickEmoteMenu.prototype.switchQem = function(id) {
    const twitch = $("#bda-qem-twitch");
    const fav = $("#bda-qem-favourite");
    const emojis = $("#bda-qem-emojis");
    twitch.removeClass("active");
    fav.removeClass("active");
    emojis.removeClass("active");

    $(".emojiPicker-3m1S-j").hide();
    $("#bda-qem-favourite-container").hide();
    $("#bda-qem-twitch-container").hide();

    switch (id) {
        case "bda-qem-twitch":
            twitch.addClass("active");
            $("#bda-qem-twitch-container").show();
        break;
        case "bda-qem-favourite":
            fav.addClass("active");
            $("#bda-qem-favourite-container").show();
        break;
        case "bda-qem-emojis":
            emojis.addClass("active");
            $(".emojiPicker-3m1S-j").show();
            $(".emojiPicker-3m1S-j .search-bar-inner input, .emojiPicker-3m1S-j .search-bar-inner input").focus();
        break;
    }
    this.lastTab = id;

    const emoteIcon = $(".emote-icon");
    emoteIcon.off();
    emoteIcon.on("click", function () {
        const emote = $(this).attr("title");
        const ta = Utilities.getTextArea();
        Utilities.insertText(ta[0], ta.val().slice(-1) == " " ? ta.val() + emote : ta.val() + " " + emote);
    });
};

QuickEmoteMenu.prototype.obsCallback = function (elem) {
    if (!this.initialized) return;
    const e = $(elem);
    if (!SettingsCookie["bda-es-9"]) {
        e.addClass("bda-qme-hidden");
    }
    else {
        e.removeClass("bda-qme-hidden");
    }

    if (!SettingsCookie["bda-es-0"]) return;

    e.prepend(this.qmeHeader);
    e.append(this.teContainer);
    e.append(this.faContainer);

    if (this.lastTab == undefined) {
        this.lastTab = "bda-qem-emojis";
    }
    this.switchQem(this.lastTab);
};

QuickEmoteMenu.prototype.favorite = function (name, url) {

    if (!this.favoriteEmotes.hasOwnProperty(name)) {
        this.favoriteEmotes[name] = url;
    }

    this.updateFavorites();
};

QuickEmoteMenu.prototype.updateFavorites = function () {

    let faContainer = "";
    faContainer += "<div id=\"bda-qem-favourite-container\">";
    faContainer += "    <div class=\"scroller-wrap scrollerWrap-2lJEkd fade\">";
    faContainer += "        <div class=\"scroller scroller-2FKFPG\">";
    faContainer += "            <div class=\"emote-menu-inner\">";
    for (const emote in this.favoriteEmotes) {
        const url = this.favoriteEmotes[emote];
        faContainer += "<div class=\"emote-container\">";
        faContainer += "    <img class=\"emote-icon\" alt=\"\" src=\"" + url + "\" title=\"" + emote + "\" oncontextmenu=\"quickEmoteMenu.favContext(event, this);\">";
        faContainer += "    </img>";
        faContainer += "</div>";
    }
    faContainer += "            </div>";
    faContainer += "        </div>";
    faContainer += "    </div>";
    faContainer += "</div>";
    this.faContainer = faContainer;

    $("#bda-qem-favourite-container").replaceWith(faContainer);
    DataStore.setBDData("bdfavemotes", btoa(JSON.stringify(this.favoriteEmotes)));
};

export default new QuickEmoteMenu();