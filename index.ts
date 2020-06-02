import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { Client } from "https://deno.land/x/mysql/mod.ts";
import { IItem } from "./interfaces/item.interface.ts";
import { IContext } from "./interfaces/context.interface.ts";
import { settings } from "./db.settings.js";


const port = 8000;
const app = new Application();
const router = new Router();
const client = await new Client().connect(settings);

await client.execute(`DROP TABLE IF EXISTS todos`);
await client.execute(`
    CREATE TABLE todos (
        id int(30) NOT NULL,
        title varchar(100) NOT NULL,
        completed varchar(10) NOT NULL,
        PRIMARY KEY (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8;
`);

let todos: Array<IItem> = [
    { id: '1', title: 'First', isComplete: true },
    { id: '2', title: 'Second', isComplete: false },
    { id: '3', title: 'Third', isComplete: true }
];

todos.forEach(async (todo) => {
    await client.execute(`INSERT INTO todos(id, title, completed) values(?, ?, ?)`, [
        todo.id,
        todo.title,
        todo.isComplete
    ]);
});


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
        todos = todos.filter(item => item.id !== params.id);
        response.status = 200;
        response.body = { todos };
    });

app.use(router.routes());

console.log('Server has been started on port: ', port);
await app.listen({ port });

