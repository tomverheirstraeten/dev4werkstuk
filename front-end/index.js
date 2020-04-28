"use strict"



$(() => {
	getAllData();
	$("#removeallfilters").hide()
	let alldata;
	let activeGenre = [];

	$(".doelgroepbutton").click(function () {
		$(this).attr('data-isclicked', $(this).attr('data-isclicked') == 'true' ? 'false' : 'true');
		$(this).toggleClass("btn-success btn-danger");
		if (activeGenre.length == 0) {
			makeCards(randomCard(alldata))
		} else {
			MakeCardsByGenre(activeGenre)
		}

	})


	//Filteren van duplicates uit array//Gets rid of all duplicates
	let filterDublicate = (array) => {
		return _.uniq(array);
	}

	//Capitalize word// Capitalizes the first word of a word
	let CapitalizeWord = (word) => {
		return _.capitalize(word);
	}

	//
	let removeFromArray = (array, element) => {
		return _.without(array, element)
	}

	///REMOVESPACES/// Gets rid of spaces in front and at the end of a word
	let trimWord = (word) => {
		return word.trim();
	}
	///make alfabethic///
	let sortArray = (arr) => {
		return _.sortBy(arr)
	}
	//sort array by parameter
	let sortArraybyParam = (arr, sorton) => {
		return _.sortBy(arr, [sorton])
	}

	//replace element in string 
	let replace = (str, wordToReplace, word) => {
		return _.replace(str, wordToReplace, word);
	}

	let stringToInt = (str) => {
		return _.toInteger(str);
	}

	let filterarrayByAge = (arr, lowerBound, higherBound) => {
		return _.filter(arr, ({
			age
		}) => age <= higherBound && age >= lowerBound)

	}




	//! GET DATA
	function getAllData() {
		$.ajax({
			url: 'http://localhost:3000/',
			method: 'get',
			type: "json",

			success: function (data) {
				alldata = data;
				let ageArray = GetNeededInfo("age");
				// replaces age of alldata with int
				for (const age in ageArray) {
					alldata[age].age = stringToInt(replace(ageArray[age], "+", ""));
				}
				makeGenreButtons(GetNeededInfo("genre"));
				makeCards(randomCard(alldata))
			},
			error: function (request, error) {
				console.log("Request: " + JSON.stringify(request));
			}
		});
	}
	// get info out of alldata
	function GetNeededInfo(needed) {
		let infoToGet = [];
		for (let items of alldata) {
			if (items[needed] !== "undefined" || items[needed] !== "") {
				let genreCapitalize = CapitalizeWord(items[needed])
				let trimmed = trimWord(genreCapitalize);
				infoToGet.push(trimmed)
			}
		}

		return infoToGet
	}

	//make array of all genres selected
	function getAllActiveGenres(button) {
		button.attr('data-isclicked', button.attr('data-isclicked') == 'true' ? 'false' : 'true');
		let checkIfActive = button.attr('data-isclicked');
		if (checkIfActive === "true") {
			activeGenre.push(button.data("name"));
		} else {
			let index = activeGenre.indexOf(button.data("name"));
			activeGenre.splice(index, 1);
		}
		return activeGenre

	}
	//! print in web
	//make buttons out of info
	function makeGenreButtons(allgenres) {
		allgenres = sortArray(allgenres);
		allgenres = removeFromArray(allgenres, "");
		allgenres = filterDublicate(allgenres)
		for (let genre in allgenres) {
			let button = `<a class="btn btn-success genre-btn m-2 genrebutton clickable" data-name="${allgenres[genre]}" data-isclicked="false"> ${allgenres[genre]}`
			$("#genrebuttoncontainer").append(button);
		}
		$(".genrebutton").click(function () {
			$(this).toggleClass("btn-success btn-danger");
			MakeCardsByGenre(getAllActiveGenres($(this)));

		})
	}
	//GET ALL THE SPECIFIC GENRES//
	function MakeCardsByGenre(arr) {

		let PlaysByGenre = [];
		for (let genre of arr) {
			for (const plays of alldata) {
				let genreCapitalize = CapitalizeWord(plays.genre)
				if (genreCapitalize == genre) {
					PlaysByGenre.push(plays);

				}
			}
		}
		if (arr.length == 0) {
			makeCards(randomCard(alldata));
			$("#removeallfilters").hide()
		} else {
			$("#removeallfilters").show()
		}
		///append cards	
		makeCards(PlaysByGenre)

	}

	function randomCard(arr) {
		let startArray = [];
		for (let index = 0; index < 10; index++) {
			startArray.push(arr[Math.floor(Math.random() * arr.length)])
		}
		startArray = filterDublicate(startArray);

		return startArray

	}

	function makeCards(arr) {
		$("#cardContainer").empty();
		let arraytosort = sortArraybyParam(arr, "name");
		if (document.getElementById("volwassenButton").getAttribute("data-isclicked") === "true" && document.getElementById("kinderenButton").getAttribute("data-isclicked") === "false") {
			arraytosort = filterarrayByAge(arraytosort, 16, 99)

		} else if (document.getElementById("kinderenButton").getAttribute("data-isclicked") === "true" && document.getElementById("volwassenButton").getAttribute("data-isclicked") === "false") {
			arraytosort = filterarrayByAge(arraytosort, 0, 15)
		}
		console.log(arraytosort)
		for (const carddata of arraytosort) {
			let card = `<div class="card" style="width: 18rem;"><img src="${carddata.thumbnail.url}" class="card-img-top" alt="...">
							<div class="card-body">
								<h5 class="card-title">${carddata.name}</h5>
								<p class="card-text">${carddata["social-share-description"]}</p>
								<a href="${carddata["link-to-video"].url}" class="btn btn-primary" target="blank">Link to Video</a>
							</div>
							</div>`


			$("#cardContainer").append(card);
		}



	}

	//! remove filters
	function removeAllFilters() {
		activeGenre = [];
		let allbuttons = $(".clickable");
		for (let button of allbuttons) {
			if (button.getAttribute("data-isclicked") === "true") {
				button.setAttribute("data-isclicked", false)
				button.classList.toggle("btn-success");
				button.classList.toggle("btn-danger");
			}
		}
		MakeCardsByGenre(activeGenre);
		makeCards(randomCard(alldata))
	}
	$("#removeallfilters").click(function () {
		removeAllFilters();
	})
})