$(function () {
    let baseURL = "https://pokeapi.co/api/v2";

    //1. make a single request to the Pokemon API to get names and URLs for every pokemon in the database
    async function part1() {
        let data = await $.getJSON(`${baseURL}/pokemon/?limit=1000`);
        console.log(data);
    }

    //2.  pick three at random and make requests to their URLs. Once those requests are complete, console.log the data for each pokemon
    async function part2() {
        let allData = await $.getJSON(`${baseURL}/pokemon/?limit=1000`);
        let randomPokemonUrls = [];
        for (let i = 0; i < 3; i++) {
            let randomIdx = Math.floor(Math.random() * allData.results.length);
            let url = allData.results.splice(randomIdx, 1)[0].url;
            randomPokemonUrls.push(url);
        }
        let pokemonData = await Promise.all(
            randomPokemonUrls.map(url => $.getJSON(url))
        );
        pokemonData.forEach(p => console.log(p));
    }

    // 3. Once that request comes back, look in the flavor_text_entries key of the response data for a description of the species written in English. If you find one, console.log the name of the pokemon along with the description you found.
    async function part3() {
        let allData = await $.getJSON(`${baseURL}/pokemon/?limit=1000`);
        let randomPokemonUrls = [];
        for (let i = 0; i < 3; i++) {
            let randomIdx = Math.floor(Math.random() * allData.results.length);
            let url = allData.results.splice(randomIdx, 1)[0].url;
            randomPokemonUrls.push(url);
        }
        let pokemonData = await Promise.all(
            randomPokemonUrls.map(url => $.getJSON(url))
        );
        let speciesData = await Promise.all(
            pokemonData.map(p => $.getJSON(p.species.url))
        );
        descriptions = speciesData.map(d => {
            let descriptionObj = d.flavor_text_entries.find(
                entry => entry.language.name === "en"
            );
            return descriptionObj
                ? descriptionObj.flavor_text
                : "No description available."
        });
        descriptions.forEach((desc, i) => {
            console.log(`${pokemonData[i].name}: ${desc}`);
        });
    }

    //4. create a UI for these random pokemon. Build an HTML page that lets you click on a button to generate data from three randomly chosen pokemon. Include the name of the pokemon, an image of the pokemon, and the description of its species which you found in 3
    let $btn = $("button");
    let $pokeArea = $("#pokemon-area");

    $btn.on('click', async function () {
        $pokeArea.empty();
        let allData = await $.getJSON(`${baseURL}/pokemon/?limit=1000`);
        let randomPokemonUrls = [];
        for (let i = 0; i < 3; i++) {
            let randomIdx = Math.floor(Math.random() * allData.results.length);
            let url = allData.results.splice(randomIdx, 1)[0].url;
            randomPokemonUrls.push(url);
        }
        let pokemonData = await Promise.all(
            randomPokemonUrls.map(url => $.getJSON(url))
        );
        let speciesData = await Promise.all(
            pokemonData.map(p => $.getJSON(p.species.url))
        );
        speciesData.forEach((d, i) => {
            let descriptionObj = d.flavor_text_entries.find(function (entry) {
                return entry.language.name === "en";
            });
            let description = descriptionObj ? descriptionObj.flavor_text : '';
            let name = pokemonData[i].name;
            let imgSrc = pokemonData[i].sprites.front_default;
            $pokeArea.append(makePokeCard(name, imgSrc, description));
        });
    });

    function makePokeCard(name, imgSrc, description) {
        return `
    <div class="card">
      <h1>${name}</h1>
      <img src=${imgSrc} />
      <p>${description}</p>
      </div>
    `;
    }
});