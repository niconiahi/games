import { type Route, route } from "@std/http/unstable-route";

const routes: Route[] = [
  {
    pattern: new URLPattern({ pathname: "/snake" }),
    handler: () => {
      const html = Deno.readFileSync("./src/snake.html");
      return new Response(html, {
        headers: {
          "Content-Type": "text/html",
        },
      });
    },
  },
  {
    pattern: new URLPattern({ pathname: "/snake.js" }),
    handler: () => {
      const script = Deno.readFileSync("./src/snake.js");
      return new Response(script, {
        headers: {
          "Content-Type": "application/javascript",
        },
      });
    },
  },
  {
    pattern: new URLPattern({ pathname: "/asteroids" }),
    handler: () => {
      const html = Deno.readFileSync("./src/asteroids.html");
      return new Response(html, {
        headers: {
          "Content-Type": "text/html",
        },
      });
    },
  },
  {
    pattern: new URLPattern({ pathname: "/asteroids.js" }),
    handler: () => {
      const script = Deno.readFileSync("./src/asteroids.js");
      return new Response(script, {
        headers: {
          "Content-Type": "application/javascript",
        },
      });
    },
  },
  {
    pattern: new URLPattern({ pathname: "/assert.js" }),
    handler: () => {
      const script = Deno.readFileSync("./src/assert.js");
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
