import { Application, Router } from "./dependencies.ts";
import { oakCors } from "./dependencies.ts";
import { getItems, getItem, createItem, updateItem, deleteItem } from "./controllers/item.controller.ts";
import { parse } from 'https://deno.land/std/flags/mod.ts';

const DEFAULT_PORT = 8000;
const { args } = Deno;

const port = parse(args).port;
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

console.log('Server has been started on port: ', DEFAULT_PORT);
await app.listen({ port: port ? Number(port) : DEFAULT_PORT });

