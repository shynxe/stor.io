import {
    Box,
    Button,
    Flex,
    Grid,
    Heading,
    HStack,
    PinInput,
    PinInputField,
    Popover,
    PopoverArrow,
    PopoverBody,
    PopoverCloseButton,
    PopoverContent,
    PopoverHeader,
    PopoverTrigger,
    Text,
    VStack
} from "@chakra-ui/react";
import {ColorModeSwitcher} from "../ColorModeSwitcher";
import React, {useContext, useEffect} from "react";
import {SocketContext} from "../context/socket";
import {useHistory} from "react-router-dom";


const Menu = (props) => {
    const socket = useContext(SocketContext);
    const initRef = React.useRef();
    const history = useHistory();

    useEffect(() => {
        socket.on("joinedRoom", (roomID) => {
            props.setRoomID(roomID);
            history.push('/room');
        })
    }, []);

    return (<Box textAlign="center" fontSize="xl">
            <Grid minH="100vh" p={3}>
                <ColorModeSwitcher justifySelf="flex-end"/>

                <Flex flex={"100%"} justifyContent={"center"}>
                    <VStack fontSize={20}>
                        <Heading>Stor.io</Heading>
                        <Text fontSize="xl" pb={6} width={"100%"}>
                            Create funny stories with your friends!
                        </Text>
                        <Popover
                            placement="right"
                            returnFocusOnClose={false}
                            initialFocusRef={initRef}
                        >
                            <PopoverTrigger>
                                <Button width={"100%"}>Join</Button>
                            </PopoverTrigger>
                            <PopoverContent>
                                <PopoverArrow/>
                                <PopoverCloseButton/>
                                <PopoverHeader>Room ID</PopoverHeader>
                                <PopoverBody>
                                    <HStack justifyContent={"center"} mt={4}>
                                        <PinInput placeholder="⍟" type="alphanumeric"
                                                  onChange={(value) => {
                                                      props.setRoomID(value);
                                                  }}>
                                            <PinInputField ref={initRef}/>
                                            <PinInputField/>
                                            <PinInputField/>
                                            <PinInputField/>
                                        </PinInput>
                                        <Button onClick={() => {
                                            socket.emit("joinRoom", props.roomID);
                                        }}>Go</Button>
                                    </HStack>
                                    <br/>
                                </PopoverBody>
                            </PopoverContent>
                        </Popover>
                        <Button width={"100%"} onClick={() => {
                            socket.emit("createRoom", "")
                        }}>Create </Button>
                    </VStack>
                </Flex>
            </Grid>
        </Box>
    )
        ;
}

export default Menu;