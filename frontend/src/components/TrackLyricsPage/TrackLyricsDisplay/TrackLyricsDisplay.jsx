import { useState } from "react";
import styles from "./TrackLyricsDisplay.module.css";

export default function TrackLyricsDisplay({
	lines,
	viewMode,
	selectedRomSys,
}) {
	const [hoveredLine, setHoveredLine] = useState(null);

	const regexChineseChars =
		/([\u4e00-\u9fff\u3400-\u4dbf\ufa0e\ufa0f\ufa11\ufa13\ufa14\ufa1f\ufa21\ufa23\ufa24\ufa27\ufa28\ufa29\u3006\u3007]|[\ud840-\ud868\ud86a-\ud879\ud880-\ud887][\udc00-\udfff]|\ud869[\udc00-\udedf\udf00-\udfff]|\ud87a[\udc00-\udfef]|\ud888[\udc00-\udfaf])(?:[\ufe00-\ufe0f]|\udb40[\udd00-\uddef])?|(\s+)/gu;

	const paragraphs = lines.reduce((acc, line) => {
		if (line.plain === "") {
			acc.push([line]);
		} else {
			if (!acc.length || acc[acc.length - 1][0].plain === "") {
				acc.push([]);
			}
			acc[acc.length - 1].push(line);
		}
		return acc;
	}, []);

	return (
		<>
			{viewMode === "split" ? (
				<div className={styles.trackLyricsSplit}>
					<div className={styles.plainLyricsSection}>
						{paragraphs.map((paragraph, paragraphIndex) => (
							<div
								key={paragraphIndex}
								className={styles.paragraph}
							>
								{paragraph.map((line) =>
									line.plain === "" ? (
										<div
											key={line.id}
											className={styles.lineBreak}
										>
											<br />
										</div>
									) : (
										<div
											key={line.id}
											className={`${
												hoveredLine === line.id
													? styles.lineHighlighted
													: styles.line
											}`}
											onMouseEnter={() =>
												setHoveredLine(line.id)
											}
											onMouseLeave={() =>
												setHoveredLine(null)
											}
										>
											{line.plain}
										</div>
									)
								)}
							</div>
						))}
					</div>
					<div className={styles.romanizationSection}>
						{paragraphs.map((paragraph, paragraphIndex) => (
							<div
								key={paragraphIndex}
								className={styles.paragraph}
							>
								{paragraph.map((line) =>
									line[selectedRomSys] === "" ? (
										<div
											key={line.id}
											className={styles.lineBreak}
										>
											<br />
										</div>
									) : (
										<div
											key={line.id}
											className={`${
												hoveredLine === line.id
													? styles.lineHighlighted
													: styles.line
											}`}
											onMouseEnter={() =>
												setHoveredLine(line.id)
											}
											onMouseLeave={() =>
												setHoveredLine(null)
											}
										>
											{line[selectedRomSys]}
										</div>
									)
								)}
							</div>
						))}
					</div>
				</div>
			) : (
				<div className={styles.trackLyricsInline}>
					<div className={styles.trackLyricsInlineSection}>
						{lines.map((line) =>
							line.plain === "" ? (
								<div key={line.id} className={styles.lineBreak}>
									<br />
								</div>
							) : (
								<div key={line.id} className={styles.line}>
									{line.plain
										.split(regexChineseChars)
										.filter(Boolean)
										.map((char, index) => {
											const chars = line.plain
												.split(regexChineseChars)
												.filter(Boolean);

											let romanizedChars = line[
												selectedRomSys
											]
												.split(/(\s+|\S+)/g)
												.filter(
													(value) =>
														value !== "" &&
														value !== " "
												);

											chars.forEach((char, index) => {
												if (
													char === " " &&
													romanizedChars[index] !==
														"   "
												) {
													romanizedChars.splice(
														index,
														0,
														"   "
													);
												}
											});

											console.log(chars);
											console.log(romanizedChars);

											return (
												<ruby
													key={index}
													className={styles.inlineBox}
												>
													{char}
													{/\d$/.test(
														romanizedChars[index]
													) ? (
														<rt
															className={
																styles.inlineRom
															}
														>
															{
																romanizedChars[
																	index
																]
															}
														</rt>
													) : (
														""
													)}
												</ruby>
											);
										})}
								</div>
							)
						)}
					</div>
				</div>
			)}
		</>
	);
}
