import React, { useState, useEffect } from "react";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import gql from "graphql-tag";

// GraphQL sorguları ve subscription'ları
const GET_DOORS = gql`
  query GetAllDoors {
    getAllDoors {
      id
      name
      isOpen
    }
  }
`;

const ADD_DOOR = gql`
  mutation AddDoor($name: String!) {
    addDoor(name: $name) {
      id
      name
      isOpen
    }
  }
`;

const OPEN_DOOR = gql`
  mutation OpenDoor($id: String!) {
    openDoor(id: $id) {
      id
      name
      isOpen
    }
  }
`;

const DOOR_ADDED = gql`
  subscription {
    doorAdded {
      id
      name
      isOpen
    }
  }
`;

const DOOR_OPENED = gql`
  subscription {
    doorOpened {
      id
      name
      isOpen
    }
  }
`;

const DOOR_CLOSED = gql`
  subscription {
    doorClosed {
      id
      name
      isOpen
    }
  }
`;

export default function DoorManager() {
  const [doorName, setDoorName] = useState("");
  const [doors, setDoors] = useState([]);
  console.log(doors);
  const { loading, error, data } = useQuery(GET_DOORS, {
    onCompleted: (data) => {
      setDoors(data.getAllDoors);
    },
  });

  const [addDoor] = useMutation(ADD_DOOR);
  const [openDoor] = useMutation(OPEN_DOOR);

  const { data: doorAddedData } = useSubscription(DOOR_ADDED);
  const { data: doorOpenedData } = useSubscription(DOOR_OPENED);
  const { data: doorClosedData } = useSubscription(DOOR_CLOSED);

  useEffect(() => {
    if (doorAddedData) {
      setDoors((prevDoors) => [...prevDoors, doorAddedData.doorAdded]);
    }
  }, [doorAddedData]);

  useEffect(() => {
    if (doorOpenedData) {
      setDoors((prevDoors) =>
        prevDoors.map((door) =>
          door.id === doorOpenedData.doorOpened.id
            ? doorOpenedData.doorOpened
            : door
        )
      );
    }
  }, [doorOpenedData]);

  useEffect(() => {
    if (doorClosedData) {
      setDoors((prevDoors) =>
        prevDoors.map((door) =>
          door.id === doorClosedData.doorClosed.id
            ? doorClosedData.doorClosed
            : door
        )
      );
    }
  }, [doorClosedData]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleAddDoor = () => {
    addDoor({ variables: { name: doorName } });
    setDoorName("");
  };

  const handleOpenDoor = (id) => {
    openDoor({ variables: { id } });
  };

  return (
    <div>
      <h1>Door Manager</h1>
      <div>
        <input
          type="text"
          value={doorName}
          onChange={(e) => setDoorName(e.target.value)}
          placeholder="Enter door name"
        />
        <button onClick={handleAddDoor}>Add Door</button>
      </div>

      <h2>Doors</h2>
      <ul>
        {doors.map((door) => (
          <li key={door.id}>
            {door.name} - {door.isOpen ? "Open" : "Closed"}
            <button
              onClick={() => handleOpenDoor(door.id)}
              disabled={door.isOpen}
            >
              Open Door
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
