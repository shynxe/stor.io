import React, {useState} from 'react';
import {ChakraProvider, theme} from '@chakra-ui/react';
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {socket, SocketContext} from "./context/socket";
import Menu from "./routes/Menu";
import Home from "./routes/Home";
import Room from "./routes/Room";
import Game from "./routes/Game";

function App() {
    const [playerName, setPlayerName] = useState("");
    const [roomID, setRoomID] = useState("");

    return (
        <SocketContext.Provider value={socket}>
            <ChakraProvider theme={theme}>
                <Router>
                    <Switch>
                        <Route path="/room">
                            <Room roomID={roomID}/>
                        </Route>
                        <Route path="/menu">
                            <Menu playerName={playerName} roomID={roomID} setRoomID={setRoomID}/>
                        </Route>
                        <Route path="/game">
                            <Game roomID={roomID}/>
                        </Route>
                        <Route path="/">
                            <Home playerName={playerName} setPlayerName={setPlayerName}/>
                        </Route>
                    </Switch>
                </Router>
            </ChakraProvider>
        </SocketContext.Provider>
    )

}

export default App;
