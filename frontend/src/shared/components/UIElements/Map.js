import { useRef, useEffect } from "react";
import "./Map.css";

const Map = props => {
	const mapRef = useRef();
	const { center, zoom, title } = props;

	useEffect(() => {
		const map = new window.google.maps.Map(mapRef.current, {
			center: center,
			zoom: zoom || 8,
		});

		new window.google.maps.Marker({
			position: center,
			map: map,
			title: title,
		});
	}, [center, zoom, title]);

	return (
		<div
			ref={mapRef}
			className={`map ${props.className}`}
			style={props.style}></div>
	);
};

export default Map;
