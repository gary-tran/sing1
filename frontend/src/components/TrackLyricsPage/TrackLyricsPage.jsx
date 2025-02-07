import styles from "./TrackLyricsPage.module.css";
import { useParams } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useEffect, useState } from "react";
import TrackLyricsDisplay from "./TrackLyricsDisplay/TrackLyricsDisplay";

export default function TrackLyricsPage() {
	const { spotifyId } = useParams();
	const [trackLyrics, setTrackLyrics] = useState(null);
	const [error, setError] = useState(null);
	const [selectedRomSys, setSelectedRomSys] = useState("jyutping");
	const [chineseOption, setChineseOption] = useState("traditional");
	const [viewMode, setViewMode] = useState("split");

	useEffect(() => {
		const fetchLyrics = async () => {
			if (!spotifyId) return;
			try {
				const response = await fetch(
					`http://localhost:8080/api/lyrics/${spotifyId}`
				);

				if (!response.ok) {
					throw new Error("Failed to fetch lyrics");
				}

				const data = await response.json();
				setTrackLyrics(data);
			} catch (error) {
				setError(error);
			}
		};
		if (spotifyId) {
			fetchLyrics();
		}
	}, [spotifyId]);

	if (error) {
		return <h2 className={styles.errorMessage}>Error...</h2>;
	} else if (trackLyrics === null) {
		return (
			<div className={styles.trackPage}>
				<Navbar />
				<h2 className={styles.loadingMessage}>Loading...</h2>;
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
					<h2 className={styles.noLyricsMessage}>
						There aren&apos;t lyrics for this song... yet.
					</h2>
				) : (
					<>
						<div className={styles.controls}>
							<div className={styles.viewModeControls}>
								<h3 className={styles.viewModeHeading}>
									Split
								</h3>
								<input
									type="checkbox"
									id="toggle"
									checked={viewMode === "inline"}
									className={styles.viewCheckbox}
									onChange={(e) =>
										setViewMode(
											e.target.checked
												? "inline"
												: "split"
										)
									}
								/>
								<label
									htmlFor="toggle"
									className={styles.viewSwitch}
								>
									<span className={styles.viewSlider} />
								</label>
								<h3 className={styles.viewModeHeading}>
									Inline
								</h3>
							</div>
							<div className={styles.lyricsControls}>
								<div className={styles.plainLyricsControls}>
									<h3 className={styles.plainLyricsHeading}>
										Chinese:
									</h3>
									<select
										className={styles.plainLyricsDropdown}
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
								<div className={styles.romanizationControls}>
									<h3 className={styles.romanizationHeading}>
										Romanization:
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
											Yale Tone Numbers
										</option>
										<option value="yale_tone_diacritics">
											Yale Tone Marks
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
											SL Wong Tone Numbers
										</option>
										<option value="sl_wong_tone_diacritics">
											SL Wong Tone Marks
										</option>
										<option value="penkyamp_tone_numbers">
											Penkyamp Tone Numbers
										</option>
										<option value="penkyamp_tone_diacritics">
											Penkyamp Tone Marks
										</option>
										<option value="english_translation">
											English Translation
										</option>
									</select>
								</div>
							</div>
						</div>
						{/* <br /> */}
						<TrackLyricsDisplay
							lines={lines}
							viewMode={viewMode}
							selectedRomSys={selectedRomSys}
						/>
					</>
				)}
				<Footer />
			</div>
		);
	}
}
