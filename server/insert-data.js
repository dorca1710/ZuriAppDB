const { MongoClient } = require("mongodb");

// Replace the following with your Atlas connection string                                                                                                                                        
const url = "<mongodb://tabitha:61095628Dca@ac-irtkefy-shard-00-00.jzqhudk.mongodb.net:27017,ac-irtkefy-shard-00-01.jzqhudk.mongodb.net:27017,ac-irtkefy-shard-00-02.jzqhudk.mongodb.net:27017/?replicaSet=atlas-dc5n0o-shard-0&ssl=true&authSource=admin>"
const client = new MongoClient(url);

 // Reference the database to use
const dbName = "ZuriAppDB";
                    
async function run() {
    try {
        // Connect to the Atlas cluster
        await client.connect();
        const db = client.db(dbName);

         // Reference the "people" collection in the specified database
        const col = db.collection("Login_Autenticacion");

         // Create a new document                                                                                                                                           
        let personDocument = {
            "rut": "15276026-4",
            "password": "123456"
            
         }

         // Insert the document into the specified collection        
         const p = await col.insertOne(personDocument);

         // Find and return the document
         const filter = { "name.last": "Turing" };
         const document = await col.findOne(filter);
         console.log("Document found:\n" + JSON.stringify(document));

        } catch (err) {
         console.log(err.stack);
     }
 
     finally {
        await client.close();
    }
}

run().catch(console.dir);
