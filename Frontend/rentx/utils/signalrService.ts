import { HubConnectionBuilder } from '@microsoft/signalr';

let connection = new HubConnectionBuilder()
    .withUrl("https://localhost:44375/chat", { withCredentials: true })
    .build();

const startConnection = async () => connection.start()
    .then(() => {
        console.log("connected");
        return connection.connectionId;
    })
    .catch(err => console.error(err.toString()));

const getConnectionId = async () => {
        if (connection.state !== "Connected") {
            await startConnection();
        }
        return connection.connectionId;
    };

const stopConnection =  () => connection.stop().catch(err => console.error(err.toString()));


export { startConnection,stopConnection,connection,getConnectionId };