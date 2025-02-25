import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ErrorPage.module.css";

export default function ErrorPage() {
	const navigate = useNavigate();

	const handleClick = (e) => {
		e.preventDefault();
		navigate("/");
	};

	useEffect(() => {
		document.title = "Error - 聲(sing1)";
	});

	return (
		<div className={styles.errorPage}>
			<Navbar />
			<div className={styles.mainContent}>
				<h1 className={styles.mainHeading}>404</h1>
				<h3 className={styles.subHeading}>Page not found...</h3>
				<button className={styles.homeButton} onClick={handleClick}>
					Go home
				</button>
			</div>
			<Footer />
		</div>
	);
}
