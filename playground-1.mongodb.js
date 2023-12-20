// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use('ZuriDb');

// Create a new document in the collection.

db.getCollection('usuarios').insertOne({
    username: 'Tabitha',
    password: 'contrasena123',
    email: 'usuario@example.com',
    // Otros campos y valores que desees agregar
  });