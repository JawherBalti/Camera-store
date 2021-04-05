/* dans la page "details.html", il faut obtenir l'identifiant de la camera à partir de l'url */
const url = new URL(window.location.href)
/* window.location.href permet d'obtenir l'url de la page actuelle */
const id = url.searchParams.get("id")

/* construction d'un objet cameraAdded contenat l'id et la lentille de la caméra */
let cameraAddedTable = [] /* pas const cameraAddedTable*/

/* on passe l'identifiant de la camera obtenu à l'api */
fetch(`http://localhost:3000/api/cameras/${id}`)
    .then(resp => {
        return resp.json()
    })
    .then(respJson => {
        /* l'objet respJson contient toutes les informations de la camera. */
        let output = ''
        const elementParent = document.querySelector('#wrapper')
        output += `<img src="${respJson.imageUrl}" alt="#" class="card-img-top rounded-pill p-3">
        <div class="card-body text-center">
            <h5 class="card-title">Nom : ${respJson.name}</h5>
            <h6 class="card-title">Prix : ${respJson.price / 100} €</h6>
            <p class="card-text">${respJson.description}</p>
    
            <select required id="liste" class="form-select mb-3" aria-label="Default select example">
                ${respJson.lenses.map(lentille => `<option value="${lentille}">${lentille}</option>`)}
            </select>
            <input onclick=add('${respJson._id}') type="submit" value="Ajouter au panier" class="btn btn-primary"/>
        </div>`
        elementParent.innerHTML = output
    })

function getBasket() {
    if (localStorage.getItem("basket") != null) {
        return JSON.parse(localStorage.getItem("basket"))
    }
    else {
        return []
    }
}

function add(id) {
    const lenses = document.querySelector("#liste").value
    const lensesList = []
    let cameraAddedTable = getBasket()
    let camera = cameraAddedTable.find(cam => cam.id == id)
    if(camera != null){
        camera.lenses.push(lenses)
        camera.quantity++
    }else{
        lensesList.push(lenses)
        cameraAddedTable.push({"id": id, "lenses": lensesList, "quantity": 1})
    }
    saveBasket(cameraAddedTable)
}

function saveBasket(basket){
    localStorage.setItem("basket", JSON.stringify(basket))
}

