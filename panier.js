let jsonData = [] //contient les infos correspondant à l'id de la camera ajoutée au cart (même si on n'a choisi qu'une seule lentille, ca récupère toutes les infos de la camera qui a cet id pas uniquement la lentille selectionnée !!)
let products = [] //contient les couples id/lentille (défini par cameraAdded) des cameras selelctionnées.
let sousTotal = []
let total = 0

const cart = getBasket()

for (let i = 0; i < cart.length; i++) {
    let id = cart[i].id /* Récupère les id car le key de notre localStorage est id */
    console.log(id);
    fetch(`http://localhost:3000/api/cameras/${id}`) // car besoin des infos de l'api pour, UIQUEMENT, l'image, le descriptif et le prix !!!
        .then(resp => {
            return resp.json()
        })
        .then(respJson => {
            console.log(cart[i]);
            jsonData.push(respJson) //stocker les réponses dans la liste "jsonData"
            products.push(id)
            let output = ''
            const elementParent = document.querySelector('#wrapper')
            var elementTotal = document.getElementById('total')

            output += jsonData.map((camera, x) => { // je mape sur les differents id donc les differentes cameras. si j'ai 3 id donc 3 modeles de cameras differents, alors x =0,1,2. Question : map s'applique sur des array mais içi cart n'est pas un tableau ?!!
                return (`
                    <tr id=${camera._id}>
                    <td id="photoUnitaire"><a href="details.html?id=${camera._id}"><img src="${camera.imageUrl}" alt="#" class="card-img-top">
                    </a></td>
                    <td id="modele">${camera.name}</td>
                    <td id="lentilleUnitaire">
                        <select required id="listeLentille" class="form-select mb-3" aria-label="Default select example">
                            ${cart[x].lenses.map(lentille => `<option value="${lentille}">${lentille}</option>`)}
                        </select>
                    </td>
                    <td id="prixUnitaire">${camera.price / 100}</td>
                    <td id="quantite">${cart[x].quantity}</td>
                    <td id="sousTotal">${cart[x].quantity * camera.price / 100}</td>
                    <td class="text-center">
                    <button class="btn-del btn btn-danger" onclick="supprimerArticle('${camera._id}')">
                    <i class="fas fa-trash-alt"></i>
                    </button>  
                    </td>
                    </tr>
                    `)
            })

            sousTotal = jsonData.map((camera, x) => camera.price * cart[x].quantity)
            total = sousTotal.reduce((acc, curr) => acc + curr)
            elementParent.innerHTML = output
            elementTotal.innerHTML = total / 100 + " €"
        })
}

//Envoyer le formulaire de confirmation
const myFormElement = document.getElementById("myForm")
myFormElement.addEventListener("submit", Confirmer) //ajouter un event listener pour le formulaire

// cette fonction permet d'envoyer le formulaire vers le serveur
function Confirmer(e) {
    e.preventDefault() //utiliser toujours cette fonction avec les formulaires pour empecher le navigateur de recharger la page lors de l'envoi du formulaire
    //obtenir les données du formulaire
    let firstName = "" // on initialise les champs à "" pour vaoir des champs vide à chaque nouvelle soumission du formulaire
    firstName = document.getElementById("prenom").value

    let lastName = ""
    lastName = document.getElementById("nom").value

    let city = ""
    city = document.getElementById("ville").value

    let address = ""
    address = document.getElementById("adresse").value

    let email = ""
    email = document.getElementById("email").value

    //let prenomElement = document.getElementById("prenom")
    let prenom_m = document.getElementById("prenom_manquant")

    //let nomElement = document.getElementById("nom")
    let nom_m = document.getElementById("nom_manquant")

    //let adressElement = document.getElementById("adresse")
    let adress_m = document.getElementById("adresse_manquant")

    //let cityElement = document.getElementById("ville")
    let city_m = document.getElementById("ville_manquant")

    //let emailElement = document.getElementById("nom")
    let email_m = document.getElementById("email_manquant")
    let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (firstName === "") {
        prenom_m.innerHTML = "Veuillez renseigner le Prénom !"
        prenom_m.style.color = "red"
    }
    else if (lastName === "") {
        nom_m.innerHTML = "Veuillez renseigner le Nom !"
        nom_m.style.color = "red"
    }
    else if (address === "") {
        adress_m.innerHTML = "Veuillez renseigner l'adresse !"
        adress_m.style.color = "red"
    }
    else if (city === "") {
        city_m.innerHTML = "Veuillez renseigner la ville !"
        city_m.style.color = "red"
    }
    else if (email === "" || email.match(regex) === null) {
        email_m.innerHTML = "Veuillez renseigner une adresse mail valide !"
        email_m.style.color = "red"
    }
    else {
        firstName.trim()
        lastName.trim()
        //créer l'objet "contact" contenant les données du formulaire
        let contact = {
            firstName,
            lastName,
            address,
            city,
            email
        }

        //l'api doit envoyer l'objet "contact" et la liste "products" vers le serveur
        fetch('http://localhost:3000/api/cameras/order', {
            method: "POST",
            headers: {
                "Accept": 'application/json, text/plain, "/"',
                "Content-type": "application/json"
            },
            body: JSON.stringify({ contact, products })
        })
            .then(response => response.json())
            .then(json => {

                //stocker les variables "orderId" et "total" pour les utiliser dans la page "confirmation.html" 
                localStorage.setItem("orderId", json.orderId)
                localStorage.setItem("total", total)

                //redériger l'utilisateur vers la page "confirmation.html" après la confirmation de la commande
                window.location = "confirmation.html"
                // var adresseActuelle = window.location; // window.location = nouvelleAdresse;
            })
            .catch(err => console.log(err))
    }
}

function supprimerArticle(id) {
    let myArticle = document.getElementById(id);
    let elementTotal = document.querySelector('#total')
    for (let i = 0; i < cart.length; i++) {
        if (jsonData[i]._id === id) {
            jsonData.splice(i, 1)
            if (jsonData.length > 0) {
                cart.splice(i, 1)
                sousTotal = jsonData.map((camera, x) => camera.price * cart[x].quantity)
                total = sousTotal.reduce((acc, curr) => acc + curr)
                saveBasket(cart)
                myArticle.remove()
                elementTotal.innerHTML = total / 100 + " €"
            }
            else if (jsonData.length == 0) {
                //cart.splice(i, 1)
                localStorage.clear()
                myArticle.remove()
                elementTotal.innerHTML = 0 + " €"
            }
        }
    }
}

function getBasket() {
    if (localStorage.getItem("basket") != null) {
        return JSON.parse(localStorage.getItem("basket"))
    }
    else {
        return []
    }
}

function saveBasket(basket) {
    localStorage.setItem("basket", JSON.stringify(basket))
}