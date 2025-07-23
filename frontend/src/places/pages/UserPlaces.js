import React from "react";
import PlaceList from "../components/PlaceList";
import { useParams } from "react-router-dom";

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Empire State Building",
    description: "One of the most famous skyscrapers in the world.",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/c/c7/Empire_State_Building_from_the_Top_of_the_Rock.jpg",
    address: "20 W 34th St, New York, NY 10001, USA",
    creator: "u1",
    location: {
      lat: 40.748817,
      lng: -73.985428,
    },
  },
  {
    id: "p2",
    title: "Statue of Liberty",
    description: "A colossal neoclassical sculpture on Liberty Island.",
    imageUrl:
      "https://upload.wikimedia.org/wikipedia/commons/3/3d/Front_view_of_Statue_of_Liberty_with_pedestal_and_base_2024.jpg",
    address: "Liberty Island, New York, NY 10004, USA",
    creator: "u2",
    location: {
      lat: 40.689247,
      lng: -74.044502,
    },
  },
];

const UserPlaces = () => {
  const userId = useParams().userId;
  const loadedPlaces = DUMMY_PLACES.filter((place) => place.creator === userId);
  return (
    <div>
      <PlaceList items={loadedPlaces} />
    </div>
  );
};

export default UserPlaces;
