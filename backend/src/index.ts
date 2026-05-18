import app from "./app";
import { connectDB } from "./Database/ConnectDB";
import dotenv from "dotenv";
dotenv.config({});

const PORT = process.env.PORT || 4000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("App is listening to the port number : ", PORT);
    });
  })
  .catch((error) => {
    console.log("An error occured : ", error);
  });
