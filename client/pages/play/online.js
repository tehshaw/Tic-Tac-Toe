import React, { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/router";
import io from "socket.io-client";
const Game = React.lazy(() => import("../../comp/Game"));
import { Box, Button, Center, Flex, Spacer } from "@chakra-ui/react";
import styles from "../../styles/Lobby.module.css";

export default function online() {
  const router = useRouter();
  const [socket, setSocket] = useState(null);
  const [rooms, setRooms] = useState(null);
  const [inLobby, setInLobby] = useState(true);

  useEffect(() => {
    setSocket(io("http://localhost:3001"));
    console.log("Connecting to server...");

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      console.log("Connected as userID: ", socket.id);
    });

    socket.on("connect_error", () => {
      console.log("Unable to reach server. Online mode not avialable.");
      socket.disconnect();
      setSocket(null);
      alert("Disconnected from server. Redirecting to home page.");
      router.push("/");
    });
    socket.on("disconnect", () => {
      console.log("Disconnected from server");
      //   setSocket(null)
      //   alert("Disconnected from server. Redirecting to home page.")
      //   router.push('/')
    });

    socket.on("rooms", (args) => {
      if (inLobby) setRooms(args);
    });

    socket.on("message", (args) => {
      console.log(args);
    });
  }, [socket]);

  function joinRoom(room) {
    socket.emit("join", { room: room });
    setInLobby(false);
  }
  return (
    <div>
      <Flex
        className={styles.menu}
        justifyContent={{ base: "center", md: "space-between" }}
        flexWrap="warp"
        padding="1rem"
      >
        <Box>Connection Status:{socket ? " Connected" : " Not Connected"}</Box>
        <Box>
          {/* <Button
            onClick={() => {
              socket.emit("report");
              console.log(socket._callbacks);
            }}
          >
            Debug
          </Button> */}
          {/* <Button onClick={() => socket.connect()}>Connect</Button> */}
        </Box>
      </Flex>

      {socket ? (
        <>
          {rooms ? (
            <>
              <Flex flexWrap="warp" padding="10px" justifyContent="center">
                {inLobby ? (
                  <>
                    <Button
                      className={styles.button}
                      border="2px"
                      onClick={() => {
                        setInLobby(false);
                        socket.emit("create");
                      }}
                    >
                      Create Room
                    </Button>

                    <Button
                      className={styles.button}
                      border="2px"
                      onClick={() => {
                        socket.disconnect();
                        router.push("/");
                      }}
                    >
                      Disconnect
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      className={styles.button}
                      border="2px"
                      onClick={() => {
                        socket.emit("leave");
                        setInLobby(true);
                      }}
                    >
                      Leave Game
                    </Button>
                  </>
                )}
              </Flex>

              {inLobby ? (
                <Flex flexWrap="wrap" maxW="1000px" margin="2rem">
                  {rooms.map((room) => {
                    return (
                      <>
                        <Box
                          as="button"
                          border="2px"
                          borderRadius="md"
                          m={4}
                          boxSize="10rem"
                          onClick={() => joinRoom(room)}
                        >
                          {room}
                        </Box>
                      </>
                    );
                  })}
                </Flex>
              ) : (
                <div className={styles.main}>
                  <Suspense fallback={<h1>Loading room...</h1>}>
                    {!inLobby && <Game gameMode={"online"} socket={socket} inLobby={setInLobby}/>}
                  </Suspense>
                </div>
              )}
            </>
          ) : (
            <h1 className={styles.main}>Loading Rooms...</h1>
          )}
        </>
      ) : (
        <>
          <h1 className={styles.main}>No server connection!</h1>
        </>
      )}
    </div>
  );
}
