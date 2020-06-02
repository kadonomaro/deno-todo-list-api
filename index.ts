import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { Client } from "https://deno.land/x/mysql/mod.ts";
import { settings } from "./db.settings.js";
import { getItems, getItem, createItem, updateItem, deleteItem } from "./controllers/item.controller.ts";


const port = 8000;
const app = new Application();
const router = new Router();
// const client = await new Client().connect(settings);

// await client.execute(`DROP TABLE IF EXISTS items`);
// await client.execute(`
//     CREATE TABLE items (
//         id int(30) NOT NULL,
//         title varchar(100) NOT NULL,
//         completed varchar(10) NOT NULL,
//         PRIMARY KEY (id)
//     ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
// `);



// items.forEach(async (todo) => {
//     await client.execute(`INSERT INTO items(id, title, completed) values(?, ?, ?)`, [
//         todo.id,
//         todo.title,
//         todo.isComplete
//     ]);
// });


router
    .get('/api/items', getItems)
    .get('/api/items/:id', getItem)
    .post('/api/items', createItem)
    .put('/api/items/:id', updateItem)
    .delete('/api/items/:id', deleteItem);

app.use(router.routes());

console.log('Server has been started on port: ', port);
await app.listen({ port });

