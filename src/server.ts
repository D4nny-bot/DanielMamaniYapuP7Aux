import App from "./app";
const port = 8000;
App.app.listen(port, () => {
    console.log("SERVER RUNNING IN PORT " + port)
});
export default App;