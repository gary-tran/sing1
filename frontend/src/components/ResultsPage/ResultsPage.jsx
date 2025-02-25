import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar.jsx";
import Footer from "../Footer/Footer.jsx";
import ResultsItem from "./ResultsItem/ResultsItem.jsx";
import Fuse from "fuse.js";
import tracks from "../../data/tracks.json";
import styles from "./ResultsPage.module.css";

export default function ResultsPage() {
	const location = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const searchQuery = searchParams.get("q");
	const [trackResults, setTrackResults] = useState([]);
	const [isSearching, setIsSearching] = useState(true);

	// useEffect(() => {
	// 	setTrackResults([]);
	// 	fetch(
	// 		`http://localhost:8080/api/tracks/search?query=${encodeURIComponent(
	// 			searchQuery
	// 		)}`
	// 	)
	// 		.then((response) => response.json())
	// 		.then((data) => setTrackResults(data))
	// 		.catch((error) => console.error("Error fetching tracks:", error));
	// 	setIsSearching(false);
	// }, [searchQuery]);

	const fuseOptions = useMemo(
		() => ({
			isCaseSensitive: false,
			includeScore: true,
			shouldSort: true,
			includeMatches: false,
			findAllMatches: true,
			minMatchCharLength: 1,
			location: 0,
			threshold: 0.25,
			distance: 50,
			useExtendedSearch: true,
			ignoreLocation: true,
			ignoreFieldNorm: false,
			fieldNormWeight: 1.5,
			keys: [
				{ name: "title", weight: 0.6 },
				{ name: "artist", weight: 0.3 },
				{ name: "album", weight: 0.1 },
			],
		}),
		[]
	);

	const fuse = useMemo(() => {
		return new Fuse(tracks, fuseOptions);
	}, [fuseOptions]);

	useEffect(() => {
		setTrackResults([]);
		const fuseResults = fuse.search(searchQuery).map((track) => track.item);
		setTrackResults(fuseResults);
		setIsSearching(false);
	}, [searchQuery, fuse]);

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
