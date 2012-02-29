/* use strict */
XML.ignoreWhitespace = false;
XML.prettyPrinting   = false;
var INFO =
<plugin name="jscompletion" version="1.0.2"
        href="http://dactyl.sf.net/pentadactyl/plugins#jscompletion-plugin"
        summary="JavaScript completion enhancements"
        xmlns={NS}>
    <author email="maglione.k@gmail.com">Kris Maglione</author>
    <author email="chris@etcet.net">Chris James</author>
    <license href="http://people.freebsd.org/~phk/">BEER-WARE</license>
    <project name="Pentadactyl" min-version="1.0"/>
    <p>
        This plugin provides advanced completion functions for
        DOM functions, eval, and some other special functions.
        For instance,
        <ex>:js content.document.getElementById("<k name="Tab" link="c_&lt;Tab>"/></ex>
        should provide you with a list of all element IDs
        present on the current web page. Many other DOM
        methods are provided, along with their namespaced variants.
    </p>
</plugin>;

function evalXPath(xpath, doc, namespace) {
    let res = doc.evaluate(xpath, doc,
        function getNamespace(prefix) ({
            html:       "http://www.w3.org/1999/xhtml",
            dactyl:     NS.uri,
            ns:         namespace
        }[prefix]),
        XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
        null
    );
    return (function () { for (let i = 0; i < res.snapshotLength; i++) yield res.snapshotItem(i); })();
}

let NAMESPACES = [
    ["http://purl.org/atom/ns#", "Atom 0.3"],
    ["http://www.w3.org/2005/Atom", "Atom 1.0"],
    [NS.uri, "Dactyl"],
    ["http://www.w3.org/2005/Atom", "RSS"],
    ["http://www.w3.org/2000/svg", "SVG"],
    ["http://www.mozilla.org/xbl", "XBL"],
    ["http://www.w3.org/1999/xhtml", "XHTML 1.0"],
    ["http://www.w3.org/2002/06/xhtml2", "XHTML 2.0"],
    ["http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul", "XUL"]
];

function addCompleter(names, fn) {
    for (let [, name] in Iterator(util.debrace(names)))
        javascript.completers[name] = fn;
}
function uniq(iter) {
    let seen = {};
    for (let val in iter)
        if (!Set.add(seen, val))
            yield val;
}

addCompleter("__lookup{Getter,Setter}__", function (context, func, obj, args) {
    if (args.length == 1)
        context.completions =
            [[k, obj[func](k)] for (k in properties(obj))].concat(
            [[k, obj[func](k)] for (k in properties(obj, true))]).filter(
                function ([k, v]) v);
});

addCompleter("eval", function (context, func, obj, args) {
    if (args.length > 1)
        return [];
    if (!context.cache.js) {
        context.cache.js = JavaScript();
        context.cache.context = CompletionContext("");
    }
    let ctxt = context.cache.context;
    context.keys = { text: "text", description: "description" };
    ctxt.filter = context.filter;
    context.cache.js.complete(ctxt);
    context.advance(ctxt.offset);
    context.completions = ctxt.allItems.items;
});

addCompleter("getOwnPropertyDescriptor", function (context, func, obj, args) {
    context.anchored = false;
    context.keys = { text: util.identity, description: function () "" };
    if (args.length == 2)
        return properties(args[0]);
});

addCompleter("getElementById", function (context, func, doc, args) {
    context.anchored = false;
    if (args.length == 1) {
        context.keys = { text: function (e) e.getAttribute("id"), description: util.objectToString };
        context.generate = function () evalXPath("//*[@id]", doc);
    }
});

addCompleter("{$, jQuery}", function (context, func, doc, args) {

    function printElements(elems) {
        if (elems.length == 1) {
            elems = elems.item(0);
            return util.objectToString(elems, true); 
        }
        else {
            let str = new String();
            for (let [, elem] in Iterator(elems)) {
                str += util.objectToString(elem) + " ";
            }
            return str;
        }
    }

    let jQselectors =   [  
                            [':checked', 'Matches all elements that are checked.'],
                            [':contains()', 'Select all elements that contain the specified text.'],
                            [':disabled', 'Selects all elements that are disabled.'],
                            [':empty', 'Select all elements that have no children (including text nodes).'],
                            [':enabled', 'Selects all elements that are enabled.'],
                            [':eq()', 'Select the element at index n within the matched set.'],
                            [':even', 'Selects even elements, zero-indexed. See also odd.'],
                            [':file', 'Selects all elements of type file.'],
                            [':first-child', 'Selects all elements that are the first child of their parent.'],
                            [':first', 'Selects the first matched element.'],
                            [':focus', 'Selects element if it is currently focused.'],
                            [':gt()', 'Select all elements at an index greater than index within the matched set.'],
                            [':has()', 'Selects elements which contain at least one element that matches the specified selector.'],
                            [':header', 'Selects all elements that are headers, like h1, h2, h3 and so on.'],
                            [':hidden', 'Selects all elements that are hidden.'],
                            [':image', 'Selects all elements of type image.'],
                            [':input', 'Selects all input, textarea, select and button elements.'],
                            [':last-child', 'Selects all elements that are the last child of their parent.'],
                            [':last', 'Selects the last matched element.'],
                            [':lt()', 'Select all elements at an index less than index within the matched set.'],
                            [':not()', 'Selects all elements that do not match the given selector.'],
                            [':nth-child()', 'Selects all elements that are the nth-child of their parent.'],
                            [':odd', 'Selects odd elements, zero-indexed. See also even.'],
                            [':only-child', 'Selects all elements that are the only child of their parent.'],
                            [':parent', 'Select all elements that are the parent of another element, including text nodes.'],
                            [':password', 'Selects all elements of type password.'],
                            [':radio', 'Selects all elements of type radio.'],
                            [':reset', 'Selects all elements of type reset.'],
                            [':selected', 'Selects all elements that are selected.'],
                            [':submit', 'Selects all elements of type submit.'],
                            [':text', 'Selects all elements of type text.'],
                            [':visible', 'Selects all elements that are visible.'],
                        ];

    doc = window.content.document;
    context.anchored = false;
    if (args.length == 1) {


        let selectors = context.fork("selectors", 0, this, function(context) {
            context.title = ["JQuery Selectors"];
            context.keys = { text: function (e) e[0], description: function(e) e[1] };
            context.generate = function () jQselectors;
        });

        let ids_ctxt = context.fork("ids", 0, this, function(context) {
            context.title = ["IDs"];
            context.keys = { text: function (e) "#" + e.getAttribute("id"), description: util.objectToString };
            context.generate = function () DOM.XPath("//*[@id]", doc);
        });

        let tags_ctxt = context.fork("tags", 0, this, function(content) {
            context.title = ["Tags"];
            let iter = DOM.XPath("//*", doc);
            let tags = array(e.localName.toLowerCase() for (e in iter)).flatten().uniq().array;
            context.keys = {text: function (e) e,
                            description: function(e) { 
                                let elems = window.content.document.getElementsByTagName(e);
                                return printElements(elems);
                           }
                           };
            context.generate = function() tags;
        });

        let class_ctxt = context.fork("classes", 0, this, function(context) {
            context.title = ["Classes"];
            let iter = DOM.XPath("//@class", doc);
            let classes = array(i.value.split(" ") for (i in iter)).flatten().uniq().array;
            context.keys = {text: function (e) "." + e,
                            description: function(e) { 
                                let elems = window.content.document.getElementsByClassName(e);
                                return printElements(elems);
                            }
                           };
            context.generate = function () classes;
        });

    }
});

function addCompleterNS(names, fn) {
    addCompleter(names + "{,NS}", function checkNS(context, func, obj, args) {
        context.anchored = false;
        context.keys = { text: util.identity, description: function () "" };
        let isNS = /NS$/.test(func);
        if (isNS && args.length == 1)
            return NAMESPACES;
        let prefix = isNS ? "ns:" : "";
        return fn(context, func, obj, args, prefix, isNS && args.shift());
    });
}

addCompleterNS("getElementsByClassName", function (context, func, doc, args, prefix, namespace) {
    if (args.length == 1) {
        let iter = evalXPath("//@" + prefix + "class", doc, namespace);
        return array(e.value.split(" ") for (e in iter)).flatten().uniq().array;
    }
});

addCompleterNS("{getElementsByTagName,createElement}", function (context, func, doc, args, prefix, namespace) {
    if (args.length == 1) {
        let iter = evalXPath("//" + prefix + "*", doc, namespace);
        return uniq(e.localName.toLowerCase() for (e in iter));
    }
});

addCompleterNS("getElementsByAttribute", function (context, func, doc, args, prefix, namespace) {
    switch (args.length) {
    case 1:
        let iter = evalXPath("//@" + prefix + "*", doc, namespace);
        return uniq(e.name for (e in iter));
    case 2:
        iter = evalXPath("//@" + prefix + args[0], doc, namespace);
        return uniq(e.value for (e in iter));
    }
});

addCompleterNS("{get,set,remove}Attribute", function (context, func, node, args, prefix, namespace) {
    context.keys = { text: 0, description: 1 };
    if (args.length == 1)
        return [[a.localName, a.value]
                for (a in array.iterValues(node.attributes))
                if (!namespace || a.namespaceURI == namespace)];
});

/* vim:se sts=4 sw=4 et: */
