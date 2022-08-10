import fastify, { FastifyInstance } from "fastify";
import axios from "axios";
import fastifyMultipart from "@fastify/multipart";

const server: FastifyInstance = fastify({});

if (!process.env.FORWARD_TO) {
  console.error('Couldn\'t find config parameter "process.env.FORWARD_TO".');
  process.exit(0);
}
// process.env.FORWARD_TO = process.env.FORWARD_TO || "";

server
  .register(fastifyMultipart, { addToBody: true })
  .all("/", async (_, reply) => {
    reply.send(
      `I'm a generic web service that proxies all requests to ${process.env.FORWARD_TO}.\n In transit, I convert the "Content-Type: multipart/form-data" to "Content-Type: application/json".`
    );
  })
  .all("/:route", async (request, reply) => {
    const verb = request.method.toLowerCase();
    // @ts-ignore save route from wildcard
    const route = `/${request.params.route}`;

    console.log(`Incoming ${verb}-request to ${route} ...`);
    // @ts-ignore axios supports all possible HTTP verbs
    axios[verb](`${process.env.FORWARD_TO}${route}`, request.body)
      .then(function (proxyResponse: any) {
        console.log(`... Outgoing ${proxyResponse.data}`);
        reply.code(proxyResponse.status);
        reply.headers(proxyResponse.headers);
        reply.send(`${proxyResponse.data}`);
      })
      .catch(function (error: any) {
        console.error("... error", error.response.status, error.response.data);
        reply.code(error.response.status);
        reply.headers(error.response.headers);
        reply.send(`${error.response.data}`);
      });
  });

// Run the server!
(async () => {
  try {
    const address = await server.listen({
      port: 8080,
      host: "0.0.0.0", // this line is needed for docker https://github.com/fastify/fastify/issues/935
    });
    console.log(
      `Restarted at: ${address} and will forward requests to ${process.env.FORWARD_TO}`
    );
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
