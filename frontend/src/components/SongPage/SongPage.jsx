import styles from "./SongPage.module.css";
import { useLocation } from "react-router-dom";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useEffect, useState } from "react";
import LyricsDisplay from "../LyricsDisplay/LyricsDisplay";

export default function SongLyricsPage() {
	const location = useLocation();
	const song = location.state?.song;
	const [songLyrics, setSongLyrics] = useState(null);
	const [error, setError] = useState(null);
	// const [hoveredLine, setHoveredLine] = useState(null);
	const [selectedRomSys, setSelectedRomSys] = useState("jyutping");
	const [chineseOption, setChineseOption] = useState("traditional");
	const [viewMode, setViewMode] = useState("split");

	useEffect(() => {
		const fetchLyrics = async () => {
			if (!song || !song.id) return;

			try {
				const response = await fetch(
					`http://localhost:8080/api/lyrics/${
						song.id
					}?trackName=${encodeURIComponent(
						song.name
					)}&artistName=${encodeURIComponent(
						song.artists[0].name
					)}&albumName=${encodeURIComponent(
						song.album.name
					)}&duration=${Math.floor(song.duration_ms / 1000)}`
				);

				if (!response.ok) {
					throw new Error("Failed to fetch lyrics");
				}

				const data = await response.json();
				setSongLyrics(data);
			} catch (error) {
				setError(error);
			}
		};
		if (song && song.id) {
			fetchLyrics();
		}
	}, [song]);

	if (error) {
		return <h3 className={styles.errorMessage}>Error...</h3>;
	} else if (songLyrics === null) {
		return (
			<div className={styles.songPage}>
				<Navbar />
				<h3 className={styles.loadingMessage}>Loading...</h3>;
				<Footer />
			</div>
		);
	} else {
		let romanizationMap = {};
		if (Array.isArray(songLyrics?.romanizationsList)) {
			romanizationMap = songLyrics.romanizationsList.reduce(
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
				? songLyrics.plainLyricsTraditional.split("\\n")
				: songLyrics.plainLyricsSimplified.split("\\n");
		for (let i = 0; i < plainLines.length; i++) {
			const line = { id: i };
			line["plain"] = plainLines[i];
			Object.entries(romanizationMap).forEach(([key, value]) => {
				line[key] = value[i];
			});
			lines.push(line);
		}

		return (
			<div className={styles.songPage}>
				<Navbar />
				<div className={styles.songInfo}>
					<img
						className={styles.songImage}
						src={song.album.images[0]?.url || ""}
						alt="React Image"
					/>
					<div className={styles.songDetails}>
						<p className={styles.songAlbumYear}>
							{song.album.name} •{" "}
							{song.album.release_date.substring(0, 4)}
						</p>
						<h1 className={styles.songName}>{song.name}</h1>
						<p className={styles.songArtist}>
							{song.artists[0]?.name}
						</p>
					</div>
				</div>
				{songLyrics === null || !songLyrics.plainLyricsTraditional ? (
					<h1 className={styles.noLyricsMessage}>
						There aren&apos;t lyrics for this song... yet!
					</h1>
				) : (
					<>
						<div className={styles.controls}>
							<div className={styles.viewModeControls}>
								<h3 className={styles.viewModeHeading}>
									View Mode: Split
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
						<br />
						<LyricsDisplay
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
