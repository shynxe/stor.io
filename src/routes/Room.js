import {Badge, Box, Button, Flex, Grid, Heading, Table, Tbody, Td, Text, Th, Thead, Tr, VStack} from "@chakra-ui/react";
import {ColorModeSwitcher} from "../ColorModeSwitcher";
import {SocketContext} from "../context/socket";
import React, {useContext, useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {FaCheckCircle} from "react-icons/all";

const Room = (props) => {
    const socket = useContext(SocketContext);
    const history = useHistory();

    const [players, setPlayers] = useState([]);
    const [readyText, setReadyText] = useState("Ready");

    socket.on('playersChange', (roomPlayers) => {
        setPlayers(roomPlayers);
    });

    socket.on('gameStart', () => {
        history.push('/game');
    });

    const fetchRoom = async () => {
        return fetch("http://192.168.100.8:3001/room/getPlayers?roomID=" + props.roomID)
            .then((response) => {
                if (response.status === 400)
                    return null
                return response.json();
            })
            .then((data) => {
                if (data == null) {
                    history.push("/");
                    return;
                }
                setPlayers(data['roomPlayers']);
            });
    };

    useEffect(() => {
        fetchRoom();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Box textAlign="center" fontSize="xl">
            <Grid minH="100vh" p={3}>
                <ColorModeSwitcher justifySelf="flex-end"/>

                <Flex flex={"100%"} justifyContent={"center"}>
                    <VStack spacing={6}>
                        <Heading>Stor.io | Room</Heading>
                        <Text fontSize="lg" fontFamily={"Montserrat"} pb={6} width={"100%"}>
                            Room Code: <Badge variant={"subtle"} fontSize={"0.8em"}
                                              fontFamily={"Verdana"}>{props.roomID}</Badge>
                        </Text>
                        <Table variant="simple">
                            <Thead>
                                <Tr>
                                    <Th>player name</Th>
                                    <Th>ready</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {players.map(player => (
                                    <Tr key={player['playerName']}><Td width="150px" maxWidth="200px"
                                                                       overflow={"hidden"} whiteSpace={"nowrap"}
                                                                       isTruncated><Text>{player['playerName']}</Text></Td><Td
                                        textAlign={"center"}>
                                        <Flex w={"100%"}
                                              justifyContent={"center"}>{player['ready'] ? <FaCheckCircle/> : ""}</Flex>
                                    </Td></Tr>))}
                            </Tbody>
                        </Table>
                        <Button variant={"ghost"} onClick={() => {
                            let player = players.find(player => {
                                return player['id'] === socket.id
                            });
                            if (player['ready']) {
                                socket.emit("cancelReady", "");
                                setReadyText("Ready");
                            } else {
                                socket.emit("playerReady", "");
                                setReadyText("Cancel");
                            }
                        }}>{readyText}</Button>
                    </VStack>
                </Flex>
            </Grid>
        </Box>
    );
}

export default Room;