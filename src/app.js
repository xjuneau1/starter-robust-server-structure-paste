const morgan = require("morgan");
const express = require("express");
const app = express();
const pastes = require("./data/pastes-data");
// TODO: Follow instructions in the checkpoint to implement ths API.

//** App-level **\\
app.use(express.json());
app.use(morgan("dev"));
//**            **\\

//** Routes **\\
app.use("/pastes/:pasteId", (req, res, next) => {
  const { pasteId } = req.params;
  const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));
  if (foundPaste) {
    res.json({ data: foundPaste });
  } else {
    next(`Paste id not found: ${pasteId}`);
  }
});

app.get("/pastes", (req, res, next) => {
  res.json({ data: pastes });
});

let lastPasteId = pastes.reduce((maxId, paste) => Math.max(maxId, paste.id), 0);

app.post("/pastes", (req, res, next) => {
  const { data: { name, syntax, exposure, expiration, text, user_id } = {} } =
    req.body;
  if (text) {
    const newPaste = {
      id: ++lastPasteId,
      name,
      syntax,
      exposure,
      expiration,
      text,
      user_id,
    };
    pastes.push(newPaste);
    return res.status(201).json({ data: newPaste });
  }
  res.sendStatus(400);
});
//**         **\\

//** Not found handler **\\
app.use((request, response, next) => {
  next(`Not found: ${request.originalUrl}`);
});
//**                    **\\

//** Error handler **\\
app.use((error, request, response, next) => {
  console.error(error);
  response.send(error);
});
//**                 **\\
module.exports = app;
