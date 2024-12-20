import { type Route, route } from "@std/http/unstable-route";

const routes: Route[] = [
  {
    pattern: new URLPattern({ pathname: "/snake" }),
    handler: () => {
      const html = Deno.readFileSync("./src/snake/index.html");
      return new Response(html, {
        headers: {
          "Content-Type": "text/html",
        },
      });
    },
  },
  {
    pattern: new URLPattern({ pathname: "/snake/main.js" }),
    handler: () => {
      const script = Deno.readFileSync("./src/snake/main.js");
      return new Response(script, {
        headers: {
          "Content-Type": "application/javascript",
        },
      });
    },
  },
];

function defaultHandler(_req: Request) {
  return new Response("Not found", { status: 404 });
}

Deno.serve(route(routes, defaultHandler));
