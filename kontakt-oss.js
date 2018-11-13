function validering() {
  let fnavn = document.getElementById("label1").value;
  let enavn = document.getElementById("label2").value;
  let kommentar = document.getElementById("label5").value;
  let email = document.getElementById("label3").value;

  let for_1 = fnavn.length;
  let etter_1 = enavn.length;
  let komm_1 = kommentar.length;
  let email_1 = email.length;

  // Dette er ''if'' setninger som validerer om du har fylt kriteret. Om du har det bytter bilde fornavn
  // rødt kryss til grønt kryss!
  if (for_1 >= 2) {
    document.getElementById("for_sjekk").src = "check-bilde.jpg";
  } else {
    document.getElementById("for_sjekk").src = "false-bilde.png";
  }

  if (etter_1 >= 2) {
    document.getElementById("etter_sjekk").src = "check-bilde.jpg";
  } else {
    document.getElementById("etter_sjekk").src = "false-bilde.png";
  }

  if (komm_1 >= 5) {
    document.getElementById("kommentar_sjekk").src = "check-bilde.jpg";
  } else {
    document.getElementById("kommentar_sjekk").src = "false-bilde.png";
  }

  if (email_1 >= 6 && email.includes("@")) {
    document.getElementById("email_sjekk").src = "check-bilde.jpg";
  } else {
    document.getElementById("email_sjekk").src = "false-bilde.png";
  }
}

// Dette er en funksjon som sjekker om alle feltene er fylt ut før du kan ''sende inn''
function knappTrykk() {
  let fnavn = document.getElementById("label1").value;
  let enavn = document.getElementById("label2").value;
  let kommentar = document.getElementById("label5").value;
  let email = document.getElementById("label3").value;
  let for_1 = fnavn.length;
  let etter_1 = enavn.length;
  let komm_1 = kommentar.length;
  let email_1 = email.length;

  if (
    for_1 >= 2 &&
    etter_1 >= 2 &&
    komm_1 >= 5 &&
    email_1 >= 6 &&
    email.includes("@")
  ) {
    alert("Takk for din hendvendelse");
  } else {
    alert(
      'Har du husket å fylle ut alle feltene?  "Fornavn", "Etternavn", "E-mail" og "Kommentar"'
    );
  }
}
