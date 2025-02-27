import styles from "./Footer.module.css";

export default function Footer() {
	return (
		<footer className={styles.footer}>
			<ul className={styles.footerList}>
				<li className={styles.copyright}>
					<p>© 2025 聲(sing1). All rights reserved.</p>
				</li>
			</ul>
		</footer>
	);
}
