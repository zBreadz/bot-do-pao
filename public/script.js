//stop and login
$(function () {

  $.ajax({
    url: "/isconnected",
    method: "get",
    success: function final(res) {
      console.log("site received connection state - " + res);
      if (res == "close") {
        $("#stop").addClass("hidden");
        $("#login").removeClass("hidden");
      } else if (res == "open") {
        $("#login").prop('disabled', true);
        $("#stop").removeClass("hidden");
        $("#login").text("Conectado");
      } else if (res == "connecting") {
        $("#login").removeClass("hidden");
        $("#stop").removeClass("hidden");
      }
    },
  });
  $.ajax({
    url: "/isauthenticationfilepresent",
    method: "get",
    success: function final(res) {
      console.log("site received isauthenticationfilepresent - " + res);
      if (res == "present") {
        $("#logout").removeClass("hidden");
        $("#qrcode").removeAttr("src");

      } else {
        $("#logout").addClass("hidden");
      }
    },
  });

});










//sql query

$("#submit").click(function (e) {
  e.preventDefault();
  if ($("#query").val() == "") return $("#submit").text("Enter query");
  $("#submit").text("Carregando");
  $("#submit").prop('disabled', true);

  $.ajax({
    url: "/sql",
    method: "post",
    success: function final(res) {
      console.log(res);
      $("#submit").prop('disabled', false);
      $("#submit").text("Run Query");
      $("#output").text(JSON.stringify(res, null, "\t"));

    },
    data: {
      query: $("#query").val(),
    },
  });
});

//restart
$("#restart").click(function (e) {
  $("#restart").text("Religando...");
  $("#logout").prop('disabled', true);
  $("#login").prop('disabled', true);
  $("#stop").prop('disabled', true);
  $("#database").prop('disabled', true);
  $("#restart").prop('disabled', true);
  e.preventDefault();
  $.ajax({
    url: "/restart",
    method: "get",
    success: function () {

    }
  });
  setTimeout(location.reload(), 8000)

});




///////database
$("#database").click(function (e) {
  e.preventDefault();
  $(".container1").removeClass("hidden");
  $("#container2").addClass("hidden");
  $("#postgres").removeClass("hidden");

});


//ddatabase back/////
$("#back").click(function (e) {
  e.preventDefault();
  $(".container1").addClass("hidden");
  $("#container2").removeClass("hidden");
  $("#postgres").addClass("hidden");

});


///////login////////
let myVar
$("#login").click(function (e) {
  $("#login").text("Conectando...");
  $("#stop").text("stop bot");
  $("#stop").removeClass("hidden");
  $("#logout").prop('disabled', true);
  $("#login").prop('disabled', true);
  $("#database").prop('disabled', true);
  $("#restart").prop('disabled', true);
  e.preventDefault();
  $.ajax({
    url: "/login",
    method: "get",
    success: function final(res) {
      console.log(res);
      if (res == "present") {
        $("#login").text("Conectado");
        $("#logout").prop('disabled', false);
        $("#login").prop('disabled', true);
        $("#logout").removeClass("hidden");
        $("#stop").removeClass("hidden");
        $("#database").prop('disabled', false);
        $("#restart").prop('disabled', false);
        $("#qrcode").removeAttr("src");
      } else if (res == "absent") {
        $("#login").text("Gerando QR Code");
        myVar = setInterval(function () {
          $.ajax({
            url: "/qr",
            method: "get",
            success: function qr(qr) {
              $("#login").text("Escaneie o QR Code");
              $.ajax({
                url: "/isconnected",
                method: "get",
                success: function (ima) {
                  console.log('ima ' + ima);
                  if (ima == 'open') {
                    $("#login").text("Conectado");
                    $("#logout").prop('disabled', false);
                    $("#login").prop('disabled', false);
                    $("#logout").removeClass("hidden");
                    $("#stop").removeClass("hidden");
                    $("#database").prop('disabled', false);
                    $("#restart").prop('disabled', false);
                    clearInterval(myVar);
                    $("#qrcode").removeAttr("src");
                  }
                },
              });
              $("#qrcode").attr("src", qr + "?" + new Date().getTime());
            },
          });
        }, 2000);
      }
      // $("#login").text("connecting...");
    },
  });
});




//stop////////////
$("#stop").click(function (e) {
  $("#stop").text("Parando bot");
  $("#logout").prop('disabled', true);
  $("#login").prop('disabled', true);
  $("#stop").prop('disabled', true);
  $("#database").prop('disabled', true);
  $("#restart").prop('disabled', true);
  e.preventDefault();

  $.ajax({
    url: "/stop",
    method: "get",
    success: function final(res) {
      console.log(res);
      clearInterval(myVar);
      $("#qrcode").removeAttr("src");
      $("#logout").prop('disabled', false);
      $("#login").prop('disabled', false);
      $("#stop").prop('disabled', false);
      $("#database").prop('disabled', false);
      $("#restart").prop('disabled', false);
      $("#login").text("Iniciar");
      $("#stop").addClass("hidden");
    },
  });
});


////logout
$("#logout").click(function (e) {
  e.preventDefault();
  $("#logout").text("Recarregue a página em 1 minuto..");
  $("#logout").prop('disabled', true);
  $("#login").prop('disabled', true);
  $("#stop").prop('disabled', true);
  $("#database").prop('disabled', true);
  $("#restart").prop('disabled', true);
  $.ajax({
    url: "/logout",
    method: "get",
    success: function final(res) {
      console.log(res);
      $("#logout").prop('disabled', false);
      $("#login").prop('disabled', false);
      $("#stop").prop('disabled', false);
      $("#database").prop('disabled', false);
      $("#restart").prop('disabled', false);
      $("#stop").addClass("hidden");
      $("#login").text("Iniciar");
      $("#logout").text("Sair");
      $("#logout").addClass("hidden");
    },
  });
});


////sitelogin//////


$("#submitauth").click(function (e) {


  e.preventDefault();
  if ($("#session").val() == "") return $("#session").attr("placeholder", "Enter password");
  $("#submitauth").text("Carregando");

  $("#submitauth").prop('disabled', true);
  $.ajax({
    url: "/auth",
    method: "post",
    success: function final(res) {
      console.log(res);
      if (res == "true") {

        $(".container1").addClass("hidden");
        $(".container2").removeClass("hidden");
      } else if (res == "false") {
        $("#session").val('')
        $("#session").attr("placeholder", "Senha incorreta");
        $("#submitauth").prop('disabled', false);
        $("#submitauth").text("login");
      }
    },
    data: {
      pass: $("#session").val(),
      siteurl: window.location.origin
    },
  });
});