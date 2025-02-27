import { Route, Routes } from "react-router-dom";
import HomePage from "./components/HomePage/HomePage.jsx";
import ResultsPage from "./components/ResultsPage/ResultsPage.jsx";
import TrackLyricsPage from "./components/TrackLyricsPage/TrackLyricsPage.jsx";
import ErrorPage from "./components/ErrorPage/ErrorPage.jsx";

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
				<Route
					path="/track/:artist/:title/:spotifyId"
					element={<TrackLyricsPage />}
				/>
				<Route path="*" element={<ErrorPage />} />
			</Routes>
		</div>
	);
}
