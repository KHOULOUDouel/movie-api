const { MongoClient } = require('mongodb');

async function populateMovies() {
    const uri = 'mongodb://localhost:27017'; // Connection URI

    // Create a new MongoClient
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect(); // Connect to the MongoDB server

        const database = client.db('movieDB'); // Access the target database
        const collection = database.collection('Movies'); // Access the Movies collection

        // Sample movie data
        const movies = [
            {
                title: "The Shawshank Redemption",
                genre: { name: "Drama", description: "Emotionally engaging movies" },
                director: { name: "Frank Darabont", nationality: "American" },
                releaseYear: 1994,
                rating: 9.3,
                additionalAttributes: { runtime: 142, budget: 25000000 }
              },
              {
                title: "The Godfather",
                genre: { name: "Crime", description: "Movies about crime and the Mafia" },
                director: { name: "Francis Ford Coppola", nationality: "American" },
                releaseYear: 1972,
                rating: 9.2,
                additionalAttributes: { runtime: 175, budget: 6000000 }
              },
              {
                title: "The Dark Knight",
                genre: { name: "Action", description: "Movies with thrilling action sequences" },
                director: { name: "Christopher Nolan", nationality: "British" },
                releaseYear: 2008,
                rating: 9.0,
                additionalAttributes: { runtime: 152, budget: 185000000 }
              },
              {
                title: "Pulp Fiction",
                genre: { name: "Crime", description: "Movies about crime and the Mafia" },
                director: { name: "Quentin Tarantino", nationality: "American" },
                releaseYear: 1994,
                rating: 8.9,
                additionalAttributes: { runtime: 154, budget: 8000000 }
              },
              {
                title: "The Lord of the Rings: The Return of the King",
                genre: { name: "Adventure", description: "Movies featuring epic adventures" },
                director: { name: "Peter Jackson", nationality: "New Zealander" },
                releaseYear: 2003,
                rating: 8.9,
                additionalAttributes: { runtime: 201, budget: 94000000 }
              },
              {
                title: "Forrest Gump",
                genre: { name: "Drama", description: "Emotionally engaging movies" },
                director: { name: "Robert Zemeckis", nationality: "American" },
                releaseYear: 1994,
                rating: 8.8,
                additionalAttributes: { runtime: 142, budget: 55000000 }
              },
              {
                title: "Inception",
                genre: { name: "Sci-Fi", description: "Movies with futuristic and science fiction themes" },
                director: { name: "Christopher Nolan", nationality: "British" },
                releaseYear: 2010,
                rating: 8.8,
                additionalAttributes: { runtime: 148, budget: 160000000 }
              },
              {
                title: "The Matrix",
                genre: { name: "Sci-Fi", description: "Movies with futuristic and science fiction themes" },
                director: { name: "Lana Wachowski, Lilly Wachowski", nationality: "American" },
                releaseYear: 1999,
                rating: 8.7,
                additionalAttributes: { runtime: 136, budget: 63000000 }
              },
              {
                title: "Goodfellas",
                genre: { name: "Crime", description: "Movies about crime and the Mafia" },
                director: { name: "Martin Scorsese", nationality: "American" },
                releaseYear: 1990,
                rating: 8.7,
                additionalAttributes: { runtime: 146, budget: 25000000 }
              },
              {
                title: "Jurassic Park",
                genre: { name: "Action", description: "Movies with thrilling action sequences" },
                director: { name: "Steven Spielberg", nationality: "American" },
                releaseYear: 1993,
                rating: 8.1,
                additionalAttributes: { runtime: 127, budget: 63000000 }
              }
        ];

        // Insert the movie data into the collection
        const result = await collection.insertMany(movies);

        // Output the number of documents inserted
        console.log(`${result.insertedCount} movies inserted successfully.`);
    } catch (error) {
        console.error('Error inserting movies:', error);
    } finally {
        await client.close(); // Close the connection
    }
}

// Call the function to populate movies
populateMovies();
