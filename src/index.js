import { app } from "./app.js"
import dotenv from "dotenv"
import { connectDB } from "./db/index.js"

dotenv.config(
    {
        path: './.env'
    }
)

connectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log("Server is listning on port: ", process.env.PORT)
    })
}).catch((error) => console.log(error))

app.get("/", (req, res) => {
    res.send("Hello im working")
})


