import { useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import styles from "./Navbar.module.css";

export default function Navbar() {
	const navigate = useNavigate();
	const location = useLocation();
	const [searchInput, setSearchInput] = useState("");
	const showSearchBar = location.pathname !== "/";
	const isInputEmpty = searchInput.trim() === "";

	const handleSearch = (e) => {
		e.preventDefault();
		if (searchInput.trim()) {
			navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
		}
		setSearchInput("");
	};

	return (
		<nav>
			<div className={styles.navbarList}>
				<NavLink to="/" className={styles.homeButton}>
					Lorem
				</NavLink>
				{showSearchBar && (
					<div className={styles.searchContainer}>
						<form
							className={styles.searchBar}
							onSubmit={handleSearch}
						>
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
										? "#f2f0ef"
										: "black",
									cursor: isInputEmpty
										? "not-allowed"
										: "pointer",
								}}
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="20"
									height="20"
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
				)}
			</div>
		</nav>
	);
}
