import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const port = 8000;
const app = new Application();
const router = new Router();

router.get('/', ({ response }) => {
    response.body = 'Hello Deno';
});

app.use(router.routes());

await app.listen({ port });

