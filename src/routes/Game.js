import {ColorModeSwitcher} from "../ColorModeSwitcher";
import {
    Box, Button, Container,
    Flex,
    Grid,
    Heading,
    HStack,
    IconButton,
    Input,
    Progress,
    Text,
    VStack,
    Wrap,
    WrapItem
} from "@chakra-ui/react";
import React, {useContext, useEffect, useRef, useState} from "react";
import Quote from "../components/Quote";
import {FaPaperPlane} from "react-icons/all";
import {SocketContext} from "../context/socket";
import {useHistory} from "react-router-dom";

const Game = (props) => {
    const socket = useContext(SocketContext);
    const history = useHistory();

    const [gameState, setGameState] = useState("playing");
    const [stories, setStories] = useState([]);
    const [disabledInput, setDisabledInput] = useState(true);
    const [roomRound, setRoomRound] = useState(0);
    const [storyContent, setStoryContent] = useState("");
    const [secondsPassed, setSecondsPassed] = useState(0);
    const [progressValue, setProgressValue] = useState(100);
    const [timePerRound, setTimePerRound] = useState(20);
    const [message, setMessage] = useState("");
    const [messageFrom, setMessageFrom] = useState("");
    const [game, setGame] = useState(0);

    const msgRef = useRef(message);
    const msgFromRef = useRef(messageFrom);
    const roundRef = useRef(roomRound);
    const disabledRef = useRef(disabledInput);
    const gameRef = useRef(game);

    useEffect(() => {
        msgRef.current = message;
        msgFromRef.current = messageFrom;
        roundRef.current = roomRound;
        disabledRef.current = disabledInput;
        gameRef.current = game;
    }, [message, messageFrom, roomRound, disabledInput, game]);

    useEffect(() => {
        fetchRoom();

        socket.on('shuffledMessage', (msg) => {
            setRoomRound(roundRef.current + 1);
            setStoryContent(msg['msg']);
            setMessage("");
            setDisabledInput(false);
            setProgressValue(100);
            setSecondsPassed(0);
            setMessageFrom(msg['from']);
        });

        socket.on('forceNextRound', ({round, game}) => {
            // check if user ran out of time
            // console.log("gameRef same values?");
            // console.log(gameRef.current);
            // console.log(game);
            // console.log("roundRef same values?");
            // console.log(roundRef.current);
            // console.log(round);
            if (round === roundRef.current && (gameRef.current === 0 || gameRef.current === game) && !(disabledRef.current)) {
                socket.emit('newMessage', {'from': msgFromRef.current, 'message': msgRef.current});
                setDisabledInput(true);
            }
        });

        socket.on('cancelGame', () => {
            setGameState("playing");
            setStories([]);
            setDisabledInput(true);
            setRoomRound(0);
            setStoryContent("");
            setSecondsPassed(0);
            setProgressValue(100);
            setMessage("");
            setMessageFrom("");
            history.push("/room");
        });

        socket.on('gameOver', (stories) => {
            setGameState("result");
            setStories(stories);
            setDisabledInput(true);
        });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        // turn this chunk of code into a useRef fest
        const interval = setInterval(() => {
            setSecondsPassed(secondsPassed + 0.1);
            setProgressValue(100 - secondsPassed / timePerRound * 100);
        }, 100);
        return () => clearInterval(interval);
    }, [secondsPassed, timePerRound]);

    const fetchRoom = async () => {
        return fetch("http://192.168.100.8:3001/room/getRoom?roomID=" + props.roomID)
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
                setGame(data['room']['game']);
                setTimePerRound(data['room']['timePerRound'] / 1000 - 2);
                setDisabledInput(false);
            });
    };

    if (gameState === "playing")
        return (
            <Box textAlign="center" fontSize="xl">
                <Grid minH="100vh" p={2}>
                    <ColorModeSwitcher justifySelf="flex-end"/>
                    <Flex justifyContent={"center"}>
                        <VStack spacing={14}>
                            <VStack spacing={6}>
                                <Heading>Stor.io | Game</Heading>}
                                <div>
                                    <Text fontFamily={"Montserrat"} fontSize="md"
                                          width={"100%"}>{disabledInput === true ? "Waiting for others" : ""}</Text>
                                    <Flex justifyContent={"center"} pb={8}>
                                        <Progress width={"350px"} value={progressValue} size={"xs"}
                                                  colorScheme={"blue"} isIndeterminate={disabledInput}/>
                                    </Flex>
                                </div>
                                {roomRound === 0 ? null : <Quote content={storyContent}
                                                                 subtitle={"and the story continues..."}/>}
                            </VStack>
                            <VStack>
                                <HStack>
                                    <Input boxShadow={"lg"} width={"500px"} type="tel" value={message}
                                           placeholder={roomRound === 0 ? "Start your story with a sentence..." : "Continue the story..."}
                                           isDisabled={disabledInput}
                                           onChange={(event) => {
                                               setMessage(event.target.value);
                                           }}/>
                                    <IconButton icon={<FaPaperPlane/>} colorScheme={"gray"} aria-label="Send story"
                                                isLoading={disabledInput} onClick={() => {
                                        socket.emit('newMessage', {'from': messageFrom, 'message': message});
                                        setDisabledInput(true);
                                    }}/>
                                </HStack>
                            </VStack>
                        </VStack>
                    </Flex>
                </Grid>
            </Box>
        )
    else
        return (
            <Box textAlign="center" fontSize="xl">
                <Grid minH="100vh" p={2}>
                    <ColorModeSwitcher justifySelf="flex-end"/>
                    <Flex justifyContent={"center"}>
                        <VStack spacing={14}>
                            <Heading>The story so far...</Heading>}
                            <Container>
                                <Wrap spacing="100px">
                                    {stories.map((story, index) => (<WrapItem>
                                        <Quote key={index} content={story['story']}
                                               subtitle={"- " + story['playerName']}/>
                                    </WrapItem>))}
                                </Wrap>
                            </Container>
                            <Button onClick={() => {
                                history.push("/room");
                            }}>Back to lobby</Button>
                        </VStack>
                    </Flex>
                </Grid>
            </Box>
        )
}

export default Game;