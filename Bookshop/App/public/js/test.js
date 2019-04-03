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