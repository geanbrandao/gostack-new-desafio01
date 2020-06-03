const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function logRequests(request, response, next) {
  const { method, url } = request;
  
  const logLabel = `[${method.toUpperCase()}] ${url}`

  console.log(logLabel);

  return next();
}

app.use(logRequests);

const repositories = [];

app.get("/repositories", (request, response) => {
  // TODO
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  // TODO
  const { title, url, techs } = request.body;
  
  if (!title || !url  || !techs) {
    return response.status(400).json({ error: 'Missing arguments' });
  }

  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  }

  console.log("UUID CRIADO FOI", repository.id);
  console.log("IGUAL ESSA MERDA ?", isUuid(repository.id));
  
  repositories.push(repository)

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  // TODO
  const { id } = request.params
  const { title, url, techs } = request.body;
  

  /**if (!title || !url  || !techs) {
    return response.status(400).json({ error: 'Missing arguments' });
  }*/

  const repositoryIndex = repositories.findIndex(repository => repository.id === id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error: 'Repository dosen\'t exist' });
  }

  const { likes } = repositories[repositoryIndex];

  const repository = {
    id,
    title,
    url,
    techs,
    likes,
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const projectIndex = repositories.findIndex(repo => repo.id === id);
  if (projectIndex < 0) {
    return response.status(400).json({ error : 'Repository dosen\'t exist' });
  }

  repositories.splice(projectIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  // TODO
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repo => repo.id === id);

  console.log("ID PASSADO - ", id);

  if (repositoryIndex < 0) {
    return response.status(400).json({ error : 'Repository dosen\'t exist' });
  }
  
  const { title, url, techs, likes } = repositories[repositoryIndex];

  const repository = {
    id,
    title,
    url,
    techs,
    likes: likes + 1,
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository); 

});

module.exports = app;
