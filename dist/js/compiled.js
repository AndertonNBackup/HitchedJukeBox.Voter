(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['results-window'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression;

  return "        <div id=\"track\">\n            <span><h4 class=\"artistName\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.artists : depth0)) != null ? stack1["0"] : stack1)) != null ? stack1.name : stack1), depth0))
    + "</h4> - <h4 class=\"trackName\">"
    + alias2(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"name","hash":{},"data":data}) : helper)))
    + "</h4></span>\n            <img class=\"albumArt\" src=\""
    + alias2(alias1(((stack1 = ((stack1 = ((stack1 = (depth0 != null ? depth0.album : depth0)) != null ? stack1.images : stack1)) != null ? stack1["2"] : stack1)) != null ? stack1.url : stack1), depth0))
    + "\"/>\n            <span class=\"albumTitle\">"
    + alias2(alias1(((stack1 = ((stack1 = (depth0 != null ? depth0.album : depth0)) != null ? stack1["0"] : stack1)) != null ? stack1.name : stack1), depth0))
    + "</span>\n        </div>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "<ul id=\"messages\">\n"
    + ((stack1 = helpers.each.call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? depth0.items : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "</ul>";
},"useData":true});
templates['track'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper;

  return "<p>\n    "
    + container.escapeExpression(((helper = (helper = helpers.href || (depth0 != null ? depth0.href : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"href","hash":{},"data":data}) : helper)))
    + "\n</p>";
},"useData":true});
})();