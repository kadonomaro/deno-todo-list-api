import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { IItem } from "./interfaces/item.interface.ts";

const port = 8000;
const app = new Application();
const router = new Router();

const todos: Array<IItem> = [
    {id: '1', title: 'First', isComplete: false},
    {id: '2', title: 'Second', isComplete: false},
    {id: '3', title: 'Third', isComplete: true}
]

router
    .get('/api/todos', ({ response }) => {
        response.status = 200;
        response.body = {
            todos
        };
    })
    .get('/api/todos/:id', ({ response, params }) => {
        const item: IItem | undefined = todos.find(item => item.id === params.id);
        if (item) {
            response.status = 200;
            response.body = {
                item
            }
        } else {
            response.status = 404;
            response.body = {
                message: 'Item not found'
            }
        }
    })

app.use(router.routes());

console.log('Server has been started on port: ', port);
await app.listen({ port });

