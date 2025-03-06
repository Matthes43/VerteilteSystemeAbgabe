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

const express = require('express');
const { todo } = require('node:test');

// HTTP-Server initialisieren
const server = express();
server.use(express.json());

// Testdaten anlegen
let todos = [
    {id: 1, task: "Einkaufen", completed: false},
    {id: 2, task: "Essen kochen", completed: false}
]

// Todos abrufen (HTTP GET)
// req: Anfrage an den Server
// res: Antwort des Servers
server.get("/todos", (req, res) => {
    res.json(todos);
})

// neues Item hinzufügen (HTTP POST)
server.post("/todos", (req, res) => {
    const senData = req.body;
    const newTodo = {
        id: todos.length + 1,
        task: senData.task,
        completed: false
    }
    todos.push(newTodo);
    res.json(newTodo);
})

// Update von Daten (HTTP PUT)
server.put("/todos/:id", (req, res) => {
    const todoId = parseInt(req.params.id);
    const itemToUpdate = todos.find(todo => todo.id === todoId);
    
    // Item nicht gefunden --> Anfrage abbrechen
    if(!itemToUpdate) {
        return res.status(404).send("Item not found");
    }

    itemToUpdate.completed = true;
    // immer das geänderte Objekt zurückgeben
    res.json(itemToUpdate);
})

// Item löschen (HTTP DELETE)
server.delete("/todos/:id", (req, res) => {
    const todoId = parseInt(req.params.id);
    const indexOfItemToDelete = todos.findIndex(todo => todo.id === todoId);

    // Index nicht gefunden --> Anfrage abbrechen
    if(indexOfItemToDelete === -1) {
        return res.status(404).send("Item not found");
    }

    // löschen des Elements mit index, löscht alle Elemente ab diesem Index
    // angegeben durch zweiten Parameter (1)
    todos.splice(indexOfItemToDelete, 1);

    res.status(204).send("Deleted");
})

server.listen(3000, () => {
    console.log("Server listening...");
})