fetch(`http://localhost:3000/api/cameras`)
	.then(resp => {
		console.log(resp)
		return resp.json()
	})
	.then(respJson => {
		let output = ''
		const elementParent = document.querySelector('#wrapper')
		respJson.forEach(camera => {
			output += `<td class="card col-8 col-md-5 col-lg-3 m-3"> 
						<a href="details.html?id=${camera._id}"> <img src="${camera.imageUrl}" alt="#" class="card-img-top rounded-pill p-1"></a>
						<div class="card-body">
							<h5 class="card-title">Nom : ${camera.name}</h5>
							<h6 class="card-title">Prix : ${camera.price/100} €</h6>
							<h6 class="card-title">Lentille(s) disponible(s) : ${camera.lenses.length}</h6>
							<p class="card-text pIndex">${camera.description}</p>
						</div>
						</td>`
			elementParent.innerHTML = output
		})
	})
	.catch(err => console.log('Request Failed', err))