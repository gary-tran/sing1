import { NavLink } from "react-router-dom";
import styles from "./Footer.module.css";

export default function Footer() {
	return (
		<footer className={styles.footer}>
			<ul className={styles.footerList}>
				<li className={styles.footerItem}>
					<NavLink to="/privacy" className={styles.footerLink}>
						Privacy Policy
					</NavLink>
				</li>
				<li className={styles.footerItem}>
					<NavLink to="/terms" className={styles.footerLink}>
						Terms of Service
					</NavLink>
				</li>
				<li className={styles.footerItem}>
					<NavLink to="/contact" className={styles.footerLink}>
						Contact Us
					</NavLink>
				</li>
				<li className={styles.copyright}>
					<p>© 2024 Lorem</p>
				</li>
			</ul>
		</footer>
	);
}
