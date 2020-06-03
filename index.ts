import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { oakCors } from "https://deno.land/x/cors/mod.ts";
import { getItems, getItem, createItem, updateItem, deleteItem } from "./controllers/item.controller.ts";


const port = 8000;
const app = new Application();
const router = new Router();


router
    .get('/api/items', getItems)
    .get('/api/items/:id', getItem)
    .post('/api/items', createItem)
    .put('/api/items/:id', updateItem)
    .delete('/api/items/:id', deleteItem);

app.use(oakCors());
app.use(router.routes());

console.log('Server has been started on port: ', port);
await app.listen({ port });

