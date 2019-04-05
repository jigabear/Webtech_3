function mylogin() {
    var fname = document.getElementById("fname").value;
    var lname = document.getElementById("lname").value;
    var url = "getdata.js?fname="+fname+"&lname="+lname;
    get(url, function (req) {
    alert("Welcome to the site, "+ req.responseText);
    });
    return false;
    }

function get(url,fn) {
    var req;
    if (window.XMLHttpRequest) {
    req = new XMLHttpRequest();
    }
    else if (window.ActiveXObject) {
    req = new ActiveXObject("Microsoft.XMLHTPP");
    }
    else {
    alert("your browser doe not support XMLHTTP!");
    }
    req.open("GET", url, true);
    req.onreadystatechange = function () {
    if (req.readyState === 4 && req.status === 200) {
    fn(req);
      }
    }
    req.send(null);
    }

function getXml() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
          renderXml(this);
      }
  };
  xmlhttp.open("GET", "books.xml", true);
  xmlhttp.send();
}

function renderXml(xml) {
  var xmlDoc = xml.responseXML; 
  var bookNode = xmlDoc.getElementsByTagName("book");
  var titleElement = getElementFromNode("title", bookNode);
  var authorElement = getElementFromNode("author", bookNode);
  var genreElement = getElementFromNode("genre", bookNode);
  var priceElement = getElementFromNode("price", bookNode);
  var publisherElement = getElementFromNode("publisher", bookNode);

  var brElement = "<br />";
  document.getElementById("showBooks").innerHTML = titleElement + 
    brElement + authorElement + brElement + genreElement + brElement + 
    priceElement + brElement + publisherElement;
}

function getElementFromNode(name, node) {
  var val = node[0].getElementsByTagName(name)[0].childNodes[0].nodeValue;
  var valElement = "<p>" + name + ": " + val + "</p>";
  return valElement;
}