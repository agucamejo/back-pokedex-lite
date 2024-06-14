const express = require("express");
const morgan = require("morgan");
const database = require("./database");
const cors = require("cors")

//Configuración inicial
const app = express();
app.set("port", 4000);
app.listen(app.get("port"));

console.log("Escuchando comunicaciones al puerto " + app.get("port"));

//Middlewares
app.use(morgan("dev"));
app.use(cors({
    origin: ["http://localhost:5173"]
}))
app.use(express.json())

//CREATE POKEMONS
app.post('/pokemon', async (req, res) => {
    const { name, lvl, evolutionId, userId, type, urlImagen, abilities } = req.body;
    
    console.log(req.body)

    const connection = await database.getConnection();
  
    try {
      const insertPokemonQuery = 'INSERT INTO pokemons (name, lvl, evolutionId, userId, types, urlImagen) VALUES (?, ?, ?, ?, ?, ?)';
      const pokemonInsertResult = await connection.query(insertPokemonQuery, [name, lvl, evolutionId, userId, type, urlImagen]);
      const pokemonId = pokemonInsertResult.insertId;
  
      if (abilities && abilities.length > 0) {
        const insertAbilityQuery = 'INSERT INTO pokemon_abilities (pokemonId, name, description) VALUES (?, ?, ?)';
  
        await Promise.all(abilities.map(async (ability) => {
          await connection.query(insertAbilityQuery, [pokemonId, ability.name, ability.description]);
        }));
      }
  
      res.status(201).json({ message: 'Pokemon created successfully' });
    } catch (error) {
      res.status(500).json({ error: 'An error ocurred' });
    }
});
  

//READ POKEMONS
app.get('/pokemon/:userId', async (req, res) => {
  const userId = req.params.userId;

  const connection = await database.getConnection();
  try {
    const results = await connection.query("SELECT p.id, p.name, p.lvl, p.evolutionId, p.userId, p.types, p.urlImagen, pa.id AS abilityId, pa.name AS abilityName, pa.description AS abilityDescription FROM pokemons AS p LEFT JOIN pokemon_abilities AS pa ON p.id = pa.pokemonId WHERE p.userId = ? ", [userId]);

    if (!results || results.length === 0) {
        return res.status(404).json({ error: 'This user has not got Pokemons' });
    }

    const pokemons = results.reduce((acc, row) => {
        const { id, name, lvl, evolutionId, userId, types, urlImagen, abilityId, abilityName, abilityDescription } = row;
        let pokemon = acc.find(p => p.id === id);
        if (!pokemon) {
          pokemon = { id, name, lvl, evolutionId, userId, types, urlImagen, abilities: [] };
          acc.push(pokemon);
        }
        if (abilityId) {
          pokemon.abilities.push({ id: abilityId, name: abilityName, description: abilityDescription });
        }
        return acc;
      }, []);
  
      res.json(pokemons);
    
  } catch (error) {
    res.status(500).json({ error: 'An error ocurred' });
  }
});


//EDIT POKEMONS 
app.put("/pokemon/:id", async (req, res) => {
    const pokemonId = req.params.id;
    const { name, lvl, evolutionId, types, urlImagen, abilities } = req.body;

    console.log(req.body)
    const connection = await database.getConnection();
    
    try {
        await connection.query(
            "UPDATE pokemons SET name = ?, lvl = ?, evolutionId = ?, types = ?, urlImagen = ? WHERE id = ?",
            [name, lvl, evolutionId, types, urlImagen, pokemonId]
        );

        for (const ability of abilities) {
            if (ability.id) {
                
                await connection.query(
                    "UPDATE pokemon_abilities SET name = ?, description = ? WHERE id = ? AND pokemonId = ?",
                    [ability.name, ability.description, ability.id, pokemonId]
                );
            } else {
                
                await connection.query(
                    "INSERT INTO pokemon_abilities (pokemonId, name, description) VALUES (?, ?, ?)",
                    [pokemonId, ability.name, ability.description]
                );
            }
        }
    
        res.json({ message: 'Pokémon updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error ocurred' });
    }
});


//LOGIN USERS
app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const connection = await database.getConnection();

  try {
    const [results] = await connection.query("SELECT * FROM users WHERE username = ? AND password = ?", [username, password]); 
        
    if (results.username == username && results.password == password) {
      res.status(200).json({ message: 'User was found on the system with valid credentials', userId: results.id });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (err) {
    res.status(500).json({ error: 'An error ocurred' });
  }
});