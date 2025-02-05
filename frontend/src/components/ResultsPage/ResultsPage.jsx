import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar.jsx";
import Footer from "../Footer/Footer.jsx";
import ResultsItem from "./ResultsItem/ResultsItem.jsx";
import styles from "./ResultsPage.module.css";

export default function ResultsPage() {
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const searchQuery = searchParams.get("q");
	const [trackResults, setTrackResults] = useState([]);

	useEffect(() => {
		setTrackResults([]);
		fetch(
			`http://localhost:8080/api/tracks/search?query=${encodeURIComponent(
				searchQuery
			)}`
		)
			.then((response) => response.json())
			.then((data) => setTrackResults(data))
			.catch((error) => console.error("Error fetching tracks:", error));
	}, [searchQuery]);

	return (
		<div className={styles.resultsPage}>
			<Navbar />
			<div className={styles.resultsSection}>
				{trackResults.length == 0 ? (
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
				<ul className={styles.trackResultsList}>
					{trackResults.map((trackResult) => (
						<ResultsItem key={trackResult.id} track={trackResult} />
					))}
				</ul>
			</div>
			<Footer />
		</div>
	);
}
