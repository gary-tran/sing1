import { useNavigate } from "react-router-dom";
import styles from "./ResultsItem.module.css";

function generateSlug(text) {
	const slugified = text.replace(/ /g, "-").toLowerCase();
	return encodeURIComponent(slugified);
}

export default function ResultsItem({ track }) {
	const navigate = useNavigate();

	const handleClick = (e) => {
		e.preventDefault();
		navigate(
			`/track/${generateSlug(track.artist)}/${generateSlug(
				track.title
			)}/${track.spotifyId}`,
			{
				state: { track },
			}
		);
	};

	return (
		<li className={styles.resultRow} onClick={handleClick}>
			<a className={styles.resultLink}>
				<img
					className={styles.imgURL}
					src={track.imageUrl}
					alt={track.album}
				/>
				<div className={styles.trackInfo}>
					<h3 className={styles.trackTitle}>{track.title}</h3>
					<p className={styles.trackArtist}>{track.artist}</p>
					<p className={styles.trackYear}>
						{track.releaseDate.substring(0, 4)}
					</p>
				</div>
			</a>
		</li>
	);
}
