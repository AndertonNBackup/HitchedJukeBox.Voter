(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
Handlebars.partials['components/album'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression;

  return "<div class=\"item\">\n    <img class=\"albumArt\" src=\""
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.images : depth0)) != null ? stack1["2"] : stack1)) != null ? stack1.url : stack1), depth0))
    + "\"/>\n    <h4 class=\"header\"><span class=\"artistName\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.artists : depth0)) != null ? stack1["0"] : stack1)) != null ? stack1.name : stack1), depth0))
    + "</span> - <span class=\"trackName\">"
    + alias2(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"name","hash":{},"data":data}) : helper)))
    + "</span></h4>\n</div>";
},"useData":true});
Handlebars.partials['components/artist'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.escapeExpression;

  return "<div class=\"item artist\">\n    <img class=\"albumArt\" src=\""
    + alias1(container.lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.images : depth0)) != null ? stack1["2"] : stack1)) != null ? stack1.url : stack1), depth0))
    + "\"/>\n    <h4 class=\"header\"><span class=\"artistName\">"
    + alias1(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"name","hash":{},"data":data}) : helper)))
    + "</span></h4>\n</div>";
},"useData":true});
Handlebars.partials['components/track'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression;

  return "<div class=\"item\">\n    <img class=\"albumArt\" src=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.album : depth0)) != null ? stack1.images : stack1)) != null ? stack1["2"] : stack1)) != null ? stack1.url : stack1), depth0))
    + "\"/>\n    <h4 class=\"header\"><span class=\"artistName\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.artists : depth0)) != null ? stack1["0"] : stack1)) != null ? stack1.name : stack1), depth0))
    + "</span> - <span class=\"trackName\">"
    + alias2(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"name","hash":{},"data":data}) : helper)))
    + "</span></h4>\n    <span class=\"albumTitle\">"
    + alias2(alias1(((stack1 = (depth0 != null ? depth0.album : depth0)) != null ? stack1.name : stack1), depth0))
    + "</span>\n</div>";
},"useData":true});
Handlebars.partials['page/results-window'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"2":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials["components/artist"],depth0,{"name":"components/artist","data":data,"indent":"            ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"4":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.booleans : depth0)) != null ? stack1.isAlbumSearch : stack1),{"name":"if","hash":{},"fn":container.program(5, data, 0),"inverse":container.program(8, data, 0),"data":data})) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
},"6":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials["components/album"],depth0,{"name":"components/album","data":data,"indent":"            ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"8":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":container.program(9, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    ";
},"9":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.invokePartial(partials["components/track"],depth0,{"name":"components/track","data":data,"indent":"            ","helpers":helpers,"partials":partials,"decorators":container.decorators})) != null ? stack1 : "");
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<ul id=\"messages\">\n"
    + ((stack1 = helpers["if"].call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = (depth0 != null ? depth0.booleans : depth0)) != null ? stack1.isArtistSearch : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.program(4, data, 0),"data":data})) != null ? stack1 : "")
    + "</ul>";
},"usePartial":true,"useData":true});
Handlebars.partials['page/search-bar'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<form action=\"\">\n    <select id=\"type\">\n    <option name=\"track\">Track</option>\n    <option name=\"album\">Album</option>\n    <option name=\"artist\">Artist</option> \n    </select>\n    <input id=\"m\" autocomplete=\"off\" /><button>Send</button>\n</form>";
},"useData":true});
})();