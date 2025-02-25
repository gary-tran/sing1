import { NavLink } from "react-router-dom";
import styles from "./Footer.module.css";

export default function Footer() {
	return (
		<footer className={styles.footer}>
			<ul className={styles.footerList}>
				<li className={styles.copyright}>
					<p>© 2025 聲(sing1). All rights reserved.</p>
				</li>
				{/* <div className={styles.footerLinks}>
					<li className={styles.footerItem}>
						<NavLink to="/terms" className={styles.footerLink}>
							Terms
						</NavLink>
					</li>
					<li className={styles.footerItem}>
						<NavLink to="/privacy" className={styles.footerLink}>
							Privacy
						</NavLink>
					</li>

					<li className={styles.footerItem}>
						<NavLink to="/contact" className={styles.footerLink}>
							Contact
						</NavLink>
					</li>
				</div> */}
			</ul>
		</footer>
	);
}
