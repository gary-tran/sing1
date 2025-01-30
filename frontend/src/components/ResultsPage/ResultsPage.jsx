import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar.jsx";
import Footer from "../Footer/Footer.jsx";
import SongResultsItem from "../SongResultsItem/SongResultsItem.jsx";
import styles from "./ResultsPage.module.css";

export default function ResultsPage() {
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const searchQuery = searchParams.get("q");
	const [songs, setSongs] = useState([]);

	useEffect(() => {
		setSongs([]);
		fetch(
			`http://localhost:8080/api/spotify/search?query=${encodeURIComponent(
				searchQuery
			)}&limit=50`
		)
			.then((response) => response.json())
			.then((data) => setSongs(data))
			.catch((error) => console.error("Error fetching songs:", error));
	}, [searchQuery]);

	return (
		<div className={styles.resultsPage}>
			<Navbar />
			<div className={styles.resultsSection}>
				{songs.length == 0 ? (
					<p className={styles.resultsHeading}>
						Searching for results...
					</p>
				) : (
					<div>
						<p className={styles.resultsHeading}>
							Showing all results for
						</p>
						<h2 className={styles.searchQuery}>
							&quot;{searchQuery}&quot;
						</h2>
					</div>
				)}
				<ul className={styles.songResultsList}>
					{songs.map((song) => (
						<SongResultsItem key={song.id} song={song} />
					))}
				</ul>
			</div>
			<Footer />
		</div>
	);
}
