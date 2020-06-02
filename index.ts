import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { IItem } from "./interfaces/item.interface.ts";
import { IContext } from "./interfaces/context.interface.ts";

const port = 8000;
const app = new Application();
const router = new Router();

const todos: Array<IItem> = [
    {id: '1', title: 'First', isComplete: false},
    {id: '2', title: 'Second', isComplete: false},
    {id: '3', title: 'Third', isComplete: true}
]

router
    .get('/api/todos', ({ response }: IContext) => {
        response.status = 200;
        response.body = {
            todos
        };
    })
    .get('/api/todos/:id', ({ response, params }: IContext) => {
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
    .post('/api/todos', async ({ response, request }: IContext) => {
        const body = await request.body();

        if (!request.hasBody) {
            response.status = 400;
            response.body = {
                message: 'Invalid input data'
            }
        } else {
            response.status = 201;
            const item: IItem = body.value;
            item.id = Date.now().toString();
            todos.push(item);
            response.body = {
                item
            }
        }
    })
    .put('/api/todos/:id', async ({ response, request, params }: IContext) => {
        const index: number | undefined = todos.findIndex(item => item.id === params.id);

        if (index) {
            const body = await request.body();
            todos[index] = { ...todos[index], ...body.value };
            response.status = 200;
            response.body = todos[index]


        } else {
            response.status = 404;
            response.body = {
                message: 'Item not found'
            }
        }
    })
    .delete('/api/todos/:id', async ({ response, params }: IContext) => {
        const index: number | undefined = todos.findIndex(item => item.id === params.id);

        if (index) {
            todos.splice(index, 1);
            response.status = 200;
            response.body = todos;
        } else {
            response.status = 404;
            response.body = {
                message: 'Item not found'
            }
        }
    });

app.use(router.routes());

console.log('Server has been started on port: ', port);
await app.listen({ port });

