var Email = { 
  send: function (a) {
    return new Promise(function (n, e) { 
      a.nocache = Math.floor(1e6 * Math.random() + 1), a.Action = "Send"; var t = JSON.stringify(a); 
      Email.ajaxPost("https://smtpjs.com/v3/smtpjs.aspx?", t, function (e) {n(e)});
    });
  }, 
  ajaxPost: function (e, n, t) { 
      var a = Email.createCORSRequest("POST", e);
      a.setRequestHeader("Content-type", "application/x-www-form-urlencoded"), 
      a.onload = function () { var e = a.responseText; null != t && t(e) }, a.send(n)
  }, 
  ajax: function (e, n) { 
    var t = Email.createCORSRequest("GET", e);
    t.onload = function () { var e = t.responseText; null != n && n(e) }, t.send()
  }, 
  createCORSRequest: function (e, n) {
    var t = new XMLHttpRequest; 
    return "withCredentials" in t ? t.open(e, n, !0) : "undefined" != typeof XDomainRequest ? (t = new XDomainRequest).open(e, n) : t = null, t 
  } 
};

const name = document.getElementById("name").value;
function sendEmail() {
  Email.send({
    Host : "smtp.elasticemail.com",
    Username : "tankersttank@gmail.com",
    Password : "B14F2F5129A43266186DDEEA570CCF9AD700",
    To : 'tankersttank@gmail.com',
    From : 'arkananta.arslan@gmail.com',
    Subject : "Feedback recieved on Volidesus",
    Body : "Name: " + document.getElementById("name").value +
      "<br> Email: " + document.getElementById("email").value +
      "<br> Message: " + document.getElementById("message").value
  }).then(
    alert("Thank you for entering a feedback!")
  );

  Email.send({
    Host : "smtp.elasticemail.com",
    Username : "tankersttank@gmail.com",
    Password : "B14F2F5129A43266186DDEEA570CCF9AD700",
    To : document.getElementById("email").value,
    From : 'tankersttank@gmail.com',
    Subject : `Thank you!`,
    Body : `<img src="https://img1.niftyimages.com/teah/rj-i/o7u5?name=${name}"/>`
  });
};