"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Consumer,
  Device,
  RtpCapabilities,
  Transport,
} from "mediasoup-client/lib/types";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";

interface VideoCallProps {
  roomId: string;
  isAdmin: boolean;
  serverUrl: string;
  aliasName: string;
  videoContainerRef: React.MutableRefObject<HTMLDivElement | null>;
  localVideoRef: React.MutableRefObject<HTMLVideoElement | null>;
  audioContainerRef: React.MutableRefObject<HTMLDivElement | null>;
}

export const useVideoCall = ({
  roomId,
  isAdmin,
  serverUrl,
  videoContainerRef,
  localVideoRef,
  audioContainerRef,
  aliasName,
}: VideoCallProps) => {
  const { data } = useSession();
  const [socket, setSocket] = useState<Socket | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const localAudioTrackRef = useRef<MediaStreamTrack | null>(null);
  const localVideoTrackRef = useRef<MediaStreamTrack | null>(null);
  const consumingTransportRef = useRef<string[]>([]);
  const consumerTransportRef = useRef<Transport | null>(null);
  const deviceRef = useRef<Device | null>();
  const [videoNode, setVideoNode] = useState<string[]>([]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(true);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [roomUserId, setRoomUserId] = useState<string | null>(null);

  const getLocalStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        height: 720,
        width: 1280,
      },
      audio: true,
    });

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = new MediaStream(
        stream.getVideoTracks()
      );
      stream.getTracks().forEach((track) => {
        if (track.kind === "audio") {
          localAudioTrackRef.current = track;
        } else {
          localVideoTrackRef.current = track;
        }
      });
      return true;
    }
    return false;
  };

  const createPeer = async (socket: Socket) => {
    socket.emit("create-peer", { roomId }, () => {
      console.log("Peer created");
    });
    console.log(data?.user);
    socket.emit(
      "create-chat-peer",
      {
        id: data?.user?.id,
        avatarUrl: data?.user?.image,
      },
      (data: any) => {
        if (data.error) {
          console.error(data.error);
        } else {
          console.log("Chat peer created", data);
          joinChatRoom(socket, data.id);
        }
      }
    );
  };

  const joinRoom = async (socket: Socket) => {
    socket.emit("join-room", { roomId }, async (data: any) => {
      try {
        await createDevice(data.rtpCapabilities, socket);
      } catch (error) {
        console.error(error);
      }
    });
  };

  const createDevice = async (
    rtpCapabilities: RtpCapabilities,
    socket: Socket
  ) => {
    try {
      const device = new Device();
      await device.load({ routerRtpCapabilities: rtpCapabilities });
      deviceRef.current = device;
      await createProducerTransport(socket, device);
    } catch (error: any) {
      if (error.name === "UnsupportedError") {
        console.error("browser not supported");
      }
      throw error;
    }
  };

  const createProducerTransport = async (socket: Socket, device: Device) => {
    socket.emit(
      "create-transport",
      { roomId, consumer: false },
      async ({ params }: any) => {
        if (params.error) {
          console.error(params.error);
          return;
        }

        const producerTransport = device.createSendTransport(params);

        producerTransport.on(
          "connect",
          async ({ dtlsParameters }, callback, errback) => {
            try {
              socket.emit("connect-transport", {
                dtlsParameters,
                roomId,
                consumer: false,
              });
              callback();
            } catch (error: any) {
              errback(error);
            }
          }
        );

        producerTransport.on("produce", async (params, callback, errback) => {
          try {
            socket.emit(
              "produce-transport",
              {
                roomId,
                consumer: false,
                kind: params.kind,
                rtpParameters: params.rtpParameters,
                appData: params.appData,
              },
              ({ id, producersExist }: any) => {
                callback({ id });
                if (producersExist) {
                  getProducers(socket);
                }
              }
            );
          } catch (error: any) {
            errback(error);
          }
        });

        connectProducerTransport(producerTransport);
      }
    );
  };

  const connectProducerTransport = async (producerTransport: Transport) => {
    if (!localAudioTrackRef.current || !localVideoTrackRef.current) return;

    const audioProducer = await producerTransport.produce({
      track: localAudioTrackRef.current,
    });

    const videoProducer = await producerTransport.produce({
      track: localVideoTrackRef.current,
      encodings: [
        {
          rid: "r0",
          maxBitrate: 100000,
          scalabilityMode: "S1T3",
        },
        {
          rid: "r1",
          maxBitrate: 300000,
          scalabilityMode: "S1T3",
        },
        {
          rid: "r2",
          maxBitrate: 900000,
          scalabilityMode: "S1T3",
        },
      ],
      codecOptions: {
        videoGoogleStartBitrate: 1000,
      },
    });

    audioProducer.on("transportclose", () => {
      console.log("audio transport close");
    });

    videoProducer.on("transportclose", () => {
      console.log("video transport close");
    });

    audioProducer.on("trackended", () => {
      console.log("audio track ended");
    });

    videoProducer.on("trackended", () => {
      console.log("video track ended");
    });
  };

  const getProducers = (socket: Socket) => {
    socket.emit("get-producers", { roomId }, (producerIds: string[]) => {
      producerIds.forEach(async (producerId) => {
        await handleNewConsumerTransport(producerId, socket);
      });
    });
  };

  const handleNewConsumerTransport = async (
    remoteProducerId: string,
    socket: Socket
  ) => {
    if (!deviceRef.current) return;
    if (consumingTransportRef.current.includes(remoteProducerId)) return;

    consumingTransportRef.current.push(remoteProducerId);
    socket.emit(
      "create-transport",
      { roomId, consumer: true },
      async ({ params }: any) => {
        if (params.error) {
          console.error(params.error);
          return;
        }

        if (!consumerTransportRef.current) {
          const consumerTransport =
            deviceRef.current!.createRecvTransport(params);

          consumerTransport.on(
            "connect",
            async ({ dtlsParameters }, callback, errback) => {
              try {
                socket.emit("connect-transport", {
                  dtlsParameters,
                  roomId,
                  consumer: true,
                });
                callback();
              } catch (error: any) {
                errback(error);
              }
            }
          );
          consumerTransportRef.current = consumerTransport;
        }

        await consumeReceiverTransport(
          consumerTransportRef.current,
          remoteProducerId,
          socket
        );
      }
    );
  };

  const consumeReceiverTransport = async (
    consumerTransport: Transport,
    remoteProducerId: string,
    socket: Socket
  ) => {
    if (!deviceRef.current) return;

    socket.emit(
      "consume-transport",
      {
        roomId,
        remoteProducerId,
        rtpCapabilities: deviceRef.current.rtpCapabilities,
      },
      async ({ params }: any) => {
        if (params.error) {
          console.error(params.error);
          return;
        }

        const consumer = await consumerTransport.consume(params);

        attachMediaToDOM(consumer, params.kind, remoteProducerId);

        socket.emit("resume-consumer", {
          roomId,
          serverConsumerId: params.id,
        });
      }
    );
  };

  const attachMediaToDOM = (
    consumer: Consumer,
    kind: "video" | "audio",
    remoteProducerId: string
  ) => {
    if (!videoContainerRef.current) return;
    if (!audioContainerRef.current) return;

    const newContainer = document.createElement("div");
    newContainer.setAttribute("id", `container_${remoteProducerId}`);

    if (kind === "video") {
      newContainer.setAttribute(
        "class",
        "relative flex-1 min-h-0 shadow-lg rounded-lg shrink min-w-[400px]"
      );
      newContainer.innerHTML = `<video id="remoteVideo_${remoteProducerId}" autoplay playsinline class="w-full h-full object-cover rounded-md"></video>`;
      videoContainerRef.current.appendChild(newContainer);

      const remoteVideo = document.getElementById(
        `remoteVideo_${remoteProducerId}`
      ) as HTMLVideoElement;
      remoteVideo.srcObject = new MediaStream([consumer.track]);
      setVideoNode((prev) => [...prev, remoteProducerId]);
    } else {
      newContainer.innerHTML = `<audio id="remoteAudio_${remoteProducerId}" autoplay playsinline></audio>`;
      audioContainerRef.current.appendChild(newContainer);

      const remoteAudio = document.getElementById(
        `remoteAudio_${remoteProducerId}`
      ) as HTMLAudioElement;
      remoteAudio.srcObject = new MediaStream([consumer.track]);
      remoteAudio.play();
    }
  };

  const handleProducerClosed = (producerId: string) => {
    consumingTransportRef.current = consumingTransportRef.current.filter(
      (id) => id !== producerId
    );
    setVideoNode((prev) => prev.filter((id) => id !== producerId));
    const container = document.getElementById(`container_${producerId}`);
    container?.remove();
  };

  const joinChatRoom = async (socket: Socket, userId: string) => {
    console.log("Joining chat room", userId);
    socket.emit(
      "join-chat-room",
      { roomId, userId, role: isAdmin, aliasName },
      (data: any) => {
        if (data.error) {
          console.error(data.error);
        } else {
          console.log(data.message);
          setRoomUserId(data.roomUserId);
        }
      }
    );
  };

  const handleSendMessage = (message: string) => {
    console.log(roomUserId, socket);
    if (!socketRef.current) return;
    socketRef.current?.emit(
      "send-message",
      { roomId, message, userId: roomUserId },
      (message: any) => {
        console.log(message);
      }
    );
  };
  useEffect(() => {
    const newSocket = io(serverUrl);

    socketRef.current = newSocket;
    setSocket(newSocket);
    const setUpSocketListeners = async (socket: Socket) => {
      socket.on("connection-success", async ({ socketId }) => {
        console.log(`Connected with socketId: ${socketId}`);
        const streamReady = await getLocalStream();
        if (streamReady) {
          await createPeer(socket);
          try {
            await joinRoom(socket);
          } catch (error) {
            console.error(error);
          }
        }
      });

      socket.on("new-producer", async ({ producerId }) => {
        await handleNewConsumerTransport(producerId, socket);
      });

      socket.on("producer-closed", ({ producerId }) => {
        handleProducerClosed(producerId);
      });

      socket.on("chat-history", (messages: any) => {
        setChatMessages((prev) => [...prev, ...messages.messages]);
        setIsChatLoading(false);
      });
    };

    setUpSocketListeners(newSocket);

    return () => {
      newSocket.disconnect();
      if (socketRef.current) {
        socketRef.current = null;
      }
      //Close camera and mic
      if (localAudioTrackRef.current) {
        localAudioTrackRef.current.stop();
      }
      if (localVideoTrackRef.current) {
        localVideoTrackRef.current.stop();
      }
    };
  }, [roomId, serverUrl, isAdmin, videoContainerRef, localVideoRef]);

  return {
    socket,
    isConnected: !!socket?.connected,
    videoNodeLength: videoNode.length,
    isChatLoading,
    chatMessages,
    handleSendMessage,
  };
};
