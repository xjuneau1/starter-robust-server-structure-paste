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
app.get("/pastes/:pasteId", (req, res, next) => {
  const { pasteId } = req.params;
  const foundPaste = pastes.find((paste) => paste.id === Number(pasteId));
  if (foundPaste) {
    res.json({ data: foundPaste });
  } else {
    next({
      status: 404,
      message: `Paste id not found: ${pasteId}`
    });
  }
});

app.get("/pastes", (req, res, next) => {
  res.json({ data: pastes });
});

function bodyHasTextProperty(req, res, next) {
  const {data: {text} = {}} = req.body
  if(text){ 
    return next()
  }
  next({
    status: 400,
    message: "A 'text' property is required."
  })
}

let lastPasteId = pastes.reduce((maxId, paste) => Math.max(maxId, paste.id), 0);

app.post("/pastes", bodyHasTextProperty, (req, res, next) => {
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
});
//**         **\\

//** Not found handler **\\
app.use((req, res, next) => {
  next(`Not found: ${request.originalUrl}`);
});
//**                    **\\

//** Error handler **\\
app.use((err, req, res, next) => {
  console.error(err);
  const { status = 500, message = "Something went wrong!"} = err
  res.status(status).json({error: message})
});
//**                 **\\
module.exports = app;
