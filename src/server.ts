import fastify, { FastifyInstance } from "fastify";
import axios from "axios";
import fastifyMultipart from "fastify-multipart";

const server: FastifyInstance = fastify({});

if (!process.env.FORWARD_TO) {
  console.error('Couldn\'t find config parameter "process.env.FORWARD_TO".');
  process.exit(0);
}
process.env.FORWARD_TO = process.env.FORWARD_TO || "";

server
  .register(fastifyMultipart, { addToBody: true })
  .all("/form-to-json", async (request, reply) => {
    console.log("Incoming ...");

    axios
      .post(process.env.FORWARD_TO || "", request.body)
      .then(function (proxyResponse) {
        console.log("... Outgoing");
        reply.code(proxyResponse.status);
        reply.headers(proxyResponse.headers);
        reply.send(`${proxyResponse.data}`);
      })
      .catch(function (error) {
        console.log("... error");
        reply.code(error.response.status);
        reply.headers(error.response.headers);
        reply.send(`${error.response.data}`);
      });
  });

server.listen(3000, function (err, address) {
  if (err) {
    server.log.error(err);
    process.exit(1);
  }
  console.log(
    `Restarted at: ${address} and will forward requests to ${process.env.FORWARD_TO}`
  );
});
