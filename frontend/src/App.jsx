import { Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage.jsx";
import ResultsPage from "./components/ResultsPage/ResultsPage.jsx";
import PrivacyPage from "./components/PrivacyPage/PrivacyPage.jsx";
import TermsPage from "./components/TermsPage/TermsPage.jsx";
import ContactPage from "./components/ContactPage/ContactPage.jsx";
import SongPage from "./components/SongPage/SongPage.jsx";
// import ArtistPage from "./components/ArtistPage/ArtistPage.jsx";
// import AlbumPage from "./components/AlbumPage/AlbumPage.jsx";
import "./App.css";

export default function App() {
	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<HomePage />} />
				<Route
					path="/search"
					element={
						<>
							<ResultsPage />
						</>
					}
				/>
				<Route path="/privacy" element={<PrivacyPage />} />
				<Route path="/terms" element={<TermsPage />} />
				<Route path="/contact" element={<ContactPage />} />
				<Route path="/song/:artist/:title" element={<SongPage />} />
				{/* <Route path="/artist/:name" element={<ArtistPage />} />
				<Route path="/album/:artist/:title" element={<AlbumPage />} /> */}
			</Routes>
		</div>
	);
}
