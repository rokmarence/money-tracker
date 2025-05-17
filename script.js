let gumbZaPolog = document.getElementById("polog");
let vnesenZnesekDenarja = document.getElementById("budget");
let prikazBudgeta = document.getElementById("x");

let vsotaDenarja = 0;
let vsotaOdtokaDenarja = 0;

function posodobiKoncniBudget() {
    let koncniBudget = vsotaDenarja - vsotaOdtokaDenarja;
    let prikaz = document.getElementById("y");

    if (koncniBudget < 0) {
        prikaz.style.color = "red";
        alert("Nimaš dovolj denarja");
    } else {
        prikaz.style.color = "green";
    }

    prikaz.innerHTML = "End of month: " + koncniBudget.toFixed(2) + " €";
}

function pologDenarja() {
    let denar = parseFloat(vnesenZnesekDenarja.value);

    if (isNaN(denar) || denar < 0) {
        alert("Vnesi veljavno pozitivno številko!");
        return;
    }

    vsotaDenarja += denar;
    prikazBudgeta.innerHTML = "Budget: " + vsotaDenarja.toFixed(2) + " €";

    vnesenZnesekDenarja.value = "";
    posodobiKoncniBudget();
    shraniPodatke();
}

gumbZaPolog.onclick = pologDenarja;

// ---------------- TRANSAKCIJE ----------------

let transakcije = document.getElementById("transakcije");
let dodajTransakcijo = document.getElementById("dodajTransakcijo");
let visinaTransakcije = document.getElementById("strosek");

function vodenje() {
    let odtokDenarja = parseFloat(visinaTransakcije.value);

    if (isNaN(odtokDenarja) || odtokDenarja < 0) {
        alert("Vnesi veljaven znesek stroška!");
        return;
    }

    let vrstica = document.createElement("tr");

    let celicaDatum = document.createElement("td");
    let celicaZnesek = document.createElement("td");

    // Samodejni datum
    let zdaj = new Date();
    let datum = zdaj.toLocaleDateString('sl-SI');
    celicaDatum.innerText = datum;

    celicaZnesek.innerText = "- " + odtokDenarja.toFixed(2) + " €";

    vrstica.appendChild(celicaDatum);
    vrstica.appendChild(celicaZnesek);
    transakcije.appendChild(vrstica);

    vsotaOdtokaDenarja += odtokDenarja;
    visinaTransakcije.value = "";

    posodobiKoncniBudget();
    shraniPodatke();
}

dodajTransakcijo.onclick = vodenje;

// ---------------- SHRANJEVANJE PODATKOV ----------------

function shraniPodatke() {
    const podatki = {
        vsotaDenarja,
        vsotaOdtokaDenarja,
        transakcije: Array.from(document.querySelectorAll('#transakcije tr'))
            .slice(1) // preskoči glavo
            .map(row => {
                const td = row.querySelectorAll('td');
                return {
                    datum: td[0].innerText,
                    znesek: td[1].innerText
                };
            })
    };

    localStorage.setItem("podatkiBudgeta", JSON.stringify(podatki));
}

function naloziPodatke() {
    const podatki = JSON.parse(localStorage.getItem("podatkiBudgeta"));
    if (!podatki) return;

    vsotaDenarja = podatki.vsotaDenarja || 0;
    vsotaOdtokaDenarja = podatki.vsotaOdtokaDenarja || 0;

    prikazBudgeta.innerHTML = "Budget: " + vsotaDenarja.toFixed(2) + " €";

    podatki.transakcije.forEach(tx => {
        let vrstica = document.createElement("tr");

        let celicaDatum = document.createElement("td");
        celicaDatum.innerText = tx.datum;

        let celicaZnesek = document.createElement("td");
        celicaZnesek.innerText = tx.znesek;

        vrstica.appendChild(celicaDatum);
        vrstica.appendChild(celicaZnesek);
        transakcije.appendChild(vrstica);
    });

    posodobiKoncniBudget();
}


let gumbReset = document.getElementById("resetiraj");

function resetirajPodatke() {
    localStorage.removeItem("podatkiBudgeta");

    // Ponastavi spremenljivke
    vsotaDenarja = 0;
    vsotaOdtokaDenarja = 0;

    // Ponastavi prikaz budgeta
    prikazBudgeta.innerHTML = "Budget: 0.00 €";
    document.getElementById("y").innerHTML = "End of month: 0.00 €";
    document.getElementById("y").style.color = "black";

    // Izprazni tabelo transakcij (razen glave)
    while (transakcije.rows.length > 1) {
        transakcije.deleteRow(1);
    }
}

gumbReset.onclick = resetirajPodatke;

// ---------------- ZAGON ----------------

naloziPodatke();
