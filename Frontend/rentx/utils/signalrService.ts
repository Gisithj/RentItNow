import { HubConnectionBuilder } from '@microsoft/signalr';

let connection = new HubConnectionBuilder()
    .withUrl("https://localhost:44375/chat", { withCredentials: true })
    .build();

const startConnection = () => connection.start()
    .then(() => console.log("connected"))
    .catch(err => console.error(err.toString()));

const stopConnection =  () => connection.stop().catch(err => console.error(err.toString()));

const sendRentalRequestToRenter = (itemId: any, customerId: any) => {
    if(connection.state === "Connected") {
        connection.invoke("SendRentalRequestToRenter", itemId,customerId)
            .catch(err => console.error("Error sending request:", err));
    } else {
        console.error("Cannot send data if the connection is not in the 'Connected' State.");
    }
}

const subscribeToOffers = (callback: (...args: any[]) => any) => {
    connection.on("SendOffersToUser", callback);
}

export { startConnection,stopConnection, sendRentalRequestToRenter, subscribeToOffers, connection };