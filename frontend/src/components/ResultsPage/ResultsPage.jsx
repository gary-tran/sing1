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
	const [isSearching, setIsSearching] = useState(true);

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
		setIsSearching(false);
	}, [searchQuery]);

	return (
		<div className={styles.resultsPage}>
			<Navbar />
			<div className={styles.resultsSection}>
				{isSearching == true ? (
					<div className={styles.searchingSection}>
						<h2 className={styles.searchingMessage}>
							Searching for results...
						</h2>
					</div>
				) : trackResults.length == 0 ? (
					<div className={styles.noResultsMessage}>
						<h2 className={styles.resultsHeading}>
							There are no results for:
						</h2>
						<h2 className={styles.searchQuery}>
							&quot;{searchQuery}&quot;
						</h2>
					</div>
				) : (
					<div>
						<div className={styles.resultsMessage}>
							<h2 className={styles.resultsHeading}>
								Showing results for:
							</h2>
							<h2 className={styles.searchQuery}>
								&quot;{searchQuery}&quot;
							</h2>
						</div>
						<ul className={styles.trackResultsList}>
							{trackResults.map((trackResult) => (
								<ResultsItem
									key={trackResult.id}
									track={trackResult}
								/>
							))}
						</ul>
					</div>
				)}
			</div>
			<Footer />
		</div>
	);
}
