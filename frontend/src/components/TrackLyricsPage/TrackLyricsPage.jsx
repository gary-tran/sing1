import styles from "./TrackLyricsPage.module.css";
import { useParams } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useEffect, useState, useMemo } from "react";
import lyrics from "../../data/lyrics.json";
import Fuse from "fuse.js";
import TrackLyricsDisplay from "./TrackLyricsDisplay/TrackLyricsDisplay";

export default function TrackLyricsPage() {
	const { spotifyId } = useParams();
	const [trackLyrics, setTrackLyrics] = useState(null);
	const [error, setError] = useState(null);
	const [selectedRomSys, setSelectedRomSys] = useState("jyutping");
	const [chineseOption, setChineseOption] = useState("traditional");
	const [viewMode, setViewMode] = useState("split");

	// useEffect(() => {
	// 	const fetchLyrics = async () => {
	// 		if (!spotifyId) return;
	// 		try {
	// 			const response = await fetch(
	// 				`http://localhost:8080/api/lyrics/${spotifyId}`
	// 			);

	// 			if (!response.ok) {
	// 				throw new Error("Failed to fetch lyrics");
	// 			}

	// 			const data = await response.json();
	// 			setTrackLyrics(data);
	// 		} catch (error) {
	// 			setError(error);
	// 		}
	// 	};
	// 	if (spotifyId) {
	// 		fetchLyrics();
	// 	}
	// }, [spotifyId]);

	const fuseOptions = useMemo(
		() => ({
			threshold: 0,
			minMatchCharLength: 22,
			keys: ["spotifyId"],
		}),
		[]
	);

	const fuse = useMemo(() => {
		return new Fuse(lyrics, fuseOptions);
	}, [fuseOptions]);

	useEffect(() => {
		const fetchLyrics = async () => {
			if (!spotifyId) return;

			try {
				const response = fuse
					.search(spotifyId, { limit: 1 })
					.map((track) => track.item);

				setTrackLyrics(response[0]);
			} catch (error) {
				setError(error);
			}
		};
		if (spotifyId) {
			fetchLyrics();
		}
	}, [spotifyId, fuse]);

	if (error) {
		return (
			<div className={styles.trackPage}>
				<Navbar />
				<div className={styles.errorSection}>
					<h2 className={styles.errorMessage}>Error...</h2>
				</div>
				<Footer />
			</div>
		);
	} else if (trackLyrics === null) {
		return (
			<div className={styles.trackPage}>
				<Navbar />
				<div className={styles.loadingSection}>
					<h2 className={styles.loadingMessage}>Loading...</h2>
				</div>
				<Footer />
			</div>
		);
	} else {
		let romanizationMap = {};
		if (Array.isArray(trackLyrics?.romanizationsList)) {
			romanizationMap = trackLyrics.romanizationsList.reduce(
				(acc, romanization) => {
					acc[romanization.systemName] =
						romanization.romanizedLyrics.split("\\n");
					return acc;
				},
				{}
			);
		}

		const lines = [];
		const plainLines =
			chineseOption === "traditional"
				? trackLyrics.plainLyricsTraditional.split("\\n")
				: trackLyrics.plainLyricsSimplified.split("\\n");
		for (let i = 0; i < plainLines.length; i++) {
			const line = { id: i };
			line["plain"] = plainLines[i];
			Object.entries(romanizationMap).forEach(([key, value]) => {
				line[key] = value[i];
			});
			lines.push(line);
		}

		return (
			<div className={styles.trackPage}>
				<Navbar />
				<div className={styles.trackInfo}>
					<img
						className={styles.trackImage}
						src={trackLyrics.track.imageUrl}
						alt={trackLyrics.track.album}
					/>
					<div className={styles.trackDetails}>
						<p className={styles.trackAlbumYear}>
							{trackLyrics.track.album} •{" "}
							{trackLyrics.track.releaseDate.substring(0, 4)}
						</p>
						<h1 className={styles.trackTitle}>
							{trackLyrics.track.title}
						</h1>
						<p className={styles.trackArtist}>
							{trackLyrics.track.artist}
						</p>
					</div>
				</div>
				{trackLyrics === null || !trackLyrics.plainLyricsTraditional ? (
					<div className={styles.noLyricsSection}>
						<h2 className={styles.noLyricsMessage}>
							There aren&apos;t lyrics for this song... yet.
						</h2>
					</div>
				) : (
					<div className={styles.lyrics}>
						<div className={styles.controls}>
							<div className={styles.viewModeControls}>
								<div className={styles.viewModeTopLine}>
									<h3 className={styles.viewModeHeading}>
										View Mode
									</h3>
									<select
										className={styles.viewModeDropdown}
										value={viewMode}
										onChange={(e) =>
											setViewMode(e.target.value)
										}
									>
										<option value="split">Split</option>
										<option value="inline">Inline</option>
									</select>
								</div>
								<p className={styles.viewModeSubHeading}>
									Choose between a side-by-side display or
									romanizations integrated directly above the
									lyrics.
								</p>
							</div>
							<div className={styles.chineseControls}>
								<div className={styles.chineseTopLine}>
									<h3 className={styles.chineseHeading}>
										Chinese
									</h3>
									<select
										className={styles.chineseDropdown}
										value={chineseOption}
										onChange={(e) =>
											setChineseOption(e.target.value)
										}
									>
										<option value="traditional">
											Traditional
										</option>
										<option value="simplified">
											Simplified
										</option>
									</select>
								</div>
								<p className={styles.chineseSubHeading}>
									Choose whether to view the lyrics in
									Traditional or Simplified Chinese
									characters.
								</p>
							</div>
							<div className={styles.romanizationControls}>
								<div className={styles.romanizationTopLine}>
									<h3 className={styles.romanizationHeading}>
										Romanization
									</h3>
									<select
										className={styles.romanizationDropdown}
										value={selectedRomSys}
										onChange={(e) =>
											setSelectedRomSys(e.target.value)
										}
									>
										<option value="jyutping">
											Jyutping
										</option>
										<option value="yale_tone_numbers">
											Yale (Numbers)
										</option>
										<option value="yale_tone_diacritics">
											Yale (Diacritics)
										</option>
										<option value="ipa">IPA</option>
										<option value="cantonese_pinyin">
											Cantonese Pinyin
										</option>
										<option value="canton_pinyin">
											Canton Pinyin
										</option>
										<option value="sidney_lau">
											Sidney Lau
										</option>
										<option value="sl_wong_tone_numbers">
											SL Wong (Numbers)
										</option>
										<option value="sl_wong_tone_diacritics">
											SL Wong (Diacritics)
										</option>
										<option value="penkyamp_tone_numbers">
											Penkyamp (Numbers)
										</option>
										<option value="penkyamp_tone_diacritics">
											Penkyamp (Diacritics)
										</option>
										{/* <option value="english_translation">
											English Translation
										</option> */}
									</select>
								</div>
								<p className={styles.romanizationSubHeading}>
									Choose the romanization system for the
									pronunciation of the lyrics.
								</p>
							</div>
						</div>
						<TrackLyricsDisplay
							lines={lines}
							viewMode={viewMode}
							selectedRomSys={selectedRomSys}
						/>
					</div>
				)}
				<Footer />
			</div>
		);
	}
}
