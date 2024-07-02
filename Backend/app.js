const express = require('express');
const cors = require('cors');
const app = express();
const user = require('./Routes/userRoute');
const session = require('express-session');
const passport = require('passport');
// const passportConfig = require("./Controller/googleLogin");

app.use(express.json());
app.use(cors());
app.use('/api', user);
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: 'sdrfhgsuerkhgeriohgsrgtoserugoidl',
    resave: false,
    saveUninitialized: true,
  })
);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Internal Server Error');
});

app.use(passport.initialize());
app.use(passport.session());
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
