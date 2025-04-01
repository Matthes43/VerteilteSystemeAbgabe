// Grundfunktionen
// * Abrufen von Daten (Read)
// * schreiben von Daten (Write)
// * Aktualisieren von Daten (Update)
// * Löschen von Daten (Delete)

// REST API Charakteristika:
// * zustandslos: keine Abhängigkeit von Client-Zustand
// * Client-Server-Architektur
//   - Client: Frontend & Nutzerinteraktion
//   - Server: Background & Datenverwaltung
// * Ressourcen mit eindeutigen Adressen
//   - Ressource: Entität, die gespeichert wird
//   Beispiel: Einkaufsliste, Nutzer
//   - Adresse: URI (Unique Resource Identifier)
//     ( URL: www.xyz.com/listen )
//     ( URI: www.xyz.com/einkaufsliste/1 )

import express from "express";

//import der "Datenbank"
import { Low } from "lowdb";

//import des JSON-Adapters, um Dateien zu laden
import { JSONFile } from "lowdb/node";

// Referenzieren der Datei, die die Daten specihern soll
const adapter = new JSONFile("db.json");

// Erzeugen der Datenbank mit der Referenz der Persistenzschicht und Default-Daten
const db = new Low(adapter, { todos: [] });

// Initialisierung der Datenbank, um existierende Daten zu lesen:
// Asynchrone Funktion: Dauer der Fnktion unbekannt!
// während die Async-Funtkion auf Ergebnisse wartet, kann Programm fortgesetzt werden
async function initDB() {
    // lesen, um existierende Daten aus der JSON-Datei (db.json) einzulesen
    // Problem: Datenzugriff u.U. sehr langsam --> Dauer ist nicht bekannt
    // --> Nicht den Programmfluss unterbrechen!

    // unbekannte Dauer der Leseoperation: await-Schlüsselwort!
    await db.read();

    // keine Daten in der Datei gelesen:
    if(!db.data) {
        db.data = { todos: [] };
    }
    await db.write();
}

initDB();

// HTTP-Server initialisieren
const server = express();
server.use(express.json());

// Todos abrufen (HTTP GET)
// req: Anfrage an den Server
// res: Antwort des Servers
server.get("/todos", async (req, res) => {
    await db.read();
    res.json(db.data.todos);
})

// neues Item hinzufügen (HTTP POST)
server.post("/todos",async (req, res) => {
    await db.read();
    const senData = req.body;
    const newTodo = {
        id: db.data.todos.length + 1,
        task: senData.task,
        completed: false
    };
    // Zugriff auf den Schlüssel "todos"
    db.data.todos.push(newTodo);
    // Auch wieder speichern
    await db.write();
    res.json(newTodo);
})

// Update von Daten (HTTP PUT)
server.put("/todos/:id",async (req, res) => {
    await db.read();
    const todoId = parseInt(req.params.id);
    const itemToUpdate = db.data.todos.findIndex((todo) => todo.id === todoId);
    const updatedTodo = req.body;
    
    if(itemToUpdate !== -1) {
        // ... --> Spread-Operator: zieht die Properties aus dem Objekt: { key: value}
        // ...{key: value } --> key: value 
        // keine Validierung
        db.data.todos[itemToUpdate] = { ...updatedTodo, ...db.data.todos[itemToUpdate]};
        await db.write();
        res.json(db.data.todos[itemToUpdate]);
    } else {
        res.status(404).json({ message : "item not found"})
    }
})

// Item löschen (HTTP DELETE)
server.delete("/todos/:id", async (req, res) => {
    await db.read();
    const todoId = parseInt(req.params.id);
    db.data.todos = db.data.todos.filter((todo) => todo.id !== todoId);
    await db.write();
    res.status(204).send();
})

server.listen(3000, () => {
    console.log("Server listening...");
})