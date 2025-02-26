import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar.jsx";
import Footer from "../Footer/Footer.jsx";
import styles from "./HomePage.module.css";

export default function HomePage() {
	const navigate = useNavigate();
	const [searchInput, setSearchInput] = useState("");
	const isInputEmpty = searchInput.trim() === "";

	useEffect(() => {
		document.title = "聲(sing1)";
	});

	const handleSearch = (e) => {
		e.preventDefault();
		if (searchInput.trim()) {
			navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
		}
		setSearchInput("");
	};

	return (
		<div className={styles.homePage}>
			<Navbar />
			<div className={styles.mainContent}>
				<h1 className={styles.mainHeading}>
					Sing along to your favorite Cantonese songs.
				</h1>
				<h3 className={styles.subHeading}>
					Explore thousands of Cantonese song lyrics, featuring 11
					romanization systems designed to help you pronounce each
					word accurately and sing along with ease.
				</h3>
				<div className={styles.searchContainer}>
					<form className={styles.searchBar} onSubmit={handleSearch}>
						<input
							type="text"
							className={styles.searchText}
							placeholder="Search for a song..."
							value={searchInput}
							onChange={(e) => setSearchInput(e.target.value)}
						/>
						<button
							className={styles.searchButton}
							type="submit"
							disabled={isInputEmpty}
							style={{
								backgroundColor: isInputEmpty
									? "#eeeeee"
									: "black",
								cursor: isInputEmpty
									? "not-allowed"
									: "pointer",
							}}
						>
							<svg
								xmlns="http://www.w3.org/2000/svg"
								// width="25"
								// height="25"
								viewBox="0 0 32 32"
							>
								<path
									fill={isInputEmpty ? "black" : "white"}
									d="m18 6l-1.43 1.393L24.15 15H4v2h20.15l-7.58 7.573L18 26l10-10z"
								/>
							</svg>
						</button>
					</form>
				</div>
			</div>
			<Footer />
		</div>
	);
}
