import {Box, Button, Flex, Grid, Heading, HStack, Input, InputGroup, InputLeftElement, VStack} from "@chakra-ui/react";
import {ColorModeSwitcher} from "../ColorModeSwitcher";
import {FaAngleRight, FaPen} from "react-icons/all";
import {Link} from "react-router-dom";
import {socket} from "../context/socket";
import React from "react";

const Home = ({playerName, setPlayerName}) => {
    return (
        <Box textAlign="center" fontSize="xl">
            <Grid minH="100vh" p={3}>
                <ColorModeSwitcher justifySelf="flex-end"/>

                <Flex flex={"100%"} justifyContent={"center"}>
                    <VStack spacing={8}>
                        <Heading>Stor.io</Heading>
                        <HStack spacing={2}>
                            <InputGroup marginLeft={"15px"}>
                                <InputLeftElement
                                    pointerEvents="none"
                                    children={<FaPen color="gray.300"/>}
                                />
                                <Input placeholder="Name" value={playerName} onChange={(event) => {
                                    setPlayerName(event.target.value);
                                }}/>
                            </InputGroup>
                            <Link to="/menu">
                                <Button onClick={() => {
                                    socket.emit("setName", playerName);
                                }}><FaAngleRight/></Button>
                            </Link>
                        </HStack>
                    </VStack>
                </Flex>
            </Grid>
        </Box>
    );
}

export default Home;