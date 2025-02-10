import { useState, useEffect, useRef } from "react";
import styles from "./TrackLyricsDisplay.module.css";

export default function TrackLyricsDisplay({
	lines,
	viewMode,
	selectedRomSys,
}) {
	const [hoveredLine, setHoveredLine] = useState(null);

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
											{/* {line[selectedRomSys].replace(
												/\b0+/g,
												""
											)} */}
											{line[selectedRomSys]
												.split(" ")
												.map((word, index) => {
													console.log(word);
													if (word.includes("/")) {
														return (
															<span key={index}>
																<CharacterRomanizationDropdown
																	romanizedChar={word.replace(
																		/\b0+/g,
																		""
																	)}
																	viewMode={
																		"split"
																	}
																/>
																<span> </span>
															</span>
														);
													} else {
														return (
															<span key={index}>
																{word.replace(
																	/\b0+/g,
																	""
																)}
																<span> </span>
															</span>
														);
													}
												})}
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
								<InlineLine
									key={line.id}
									line={line}
									selectedRomSys={selectedRomSys}
								/>
							)
						)}
					</div>
				</div>
			)}
		</>
	);
}

export function InlineLine({ line, selectedRomSys }) {
	const regexChineseChars =
		/([\u4e00-\u9fff\u3400-\u4dbf\ufa0e\ufa0f\ufa11\ufa13\ufa14\ufa1f\ufa21\ufa23\ufa24\ufa27\ufa28\ufa29\u3006\u3007]|[\ud840-\ud868\ud86a-\ud879\ud880-\ud887][\udc00-\udfff]|\ud869[\udc00-\udedf\udf00-\udfff]|\ud87a[\udc00-\udfef]|\ud888[\udc00-\udfaf])([\ufe00-\ufe0f]|\udb40[\udd00-\uddef])?/u;

	const chars = line.plain.split(regexChineseChars).filter(Boolean);
	let romanizedChars = line[selectedRomSys]
		.split(/(\s+|\S+)/g)
		.filter((value) => value !== "" && value !== " ");

	chars.forEach((char, index) => {
		if (char === " " && romanizedChars[index] !== "   ") {
			romanizedChars.splice(index, 0, "   ");
		}
	});

	romanizedChars = romanizedChars.filter((romanizedChar) =>
		/^0.+/.test(romanizedChar)
	);

	const charRomanizationPairs = chars.map((char) => {
		if (regexChineseChars.test(char) === true) {
			return [char, romanizedChars.shift()];
		} else {
			return [char, ""];
		}
	});

	return (
		<div key={line.id} className={styles.line}>
			{charRomanizationPairs.map(([char, romanizedChar], index) => (
				<ruby key={index} className={styles.inlineBox}>
					{char}
					{romanizedChar !== "" ? (
						romanizedChar.includes("/") ? (
							<rt className={styles.inlineRom}>
								<CharacterRomanizationDropdown
									romanizedChar={romanizedChar.replace(
										/\b0+/g,
										""
									)}
									viewMode={"inline"}
								/>
							</rt>
						) : (
							<rt className={styles.inlineRom}>
								{romanizedChar.replace(/\b0+/g, "")}
							</rt>
						)
					) : (
						""
					)}
				</ruby>
			))}
		</div>
	);
}

export function CharacterRomanizationDropdown({ romanizedChar, viewMode }) {
	const [selectedCharJyutping, setSelectedCharJyutping] = useState(
		romanizedChar.split("/")[0]
	);

	const romCharSelectRef = useRef(null);
	const adjustSelectWidth = (e) => {
		const displayedText = e.options[e.selectedIndex].innerText;
		const dummy = document.createElement("p");
		dummy.innerText = displayedText;
		dummy.style.position = "absolute";
		dummy.style.visibility = "hidden";
		dummy.style.whiteSpace = "nowrap";
		dummy.style.fontSize = "22px";
		document.body.appendChild(dummy);
		const measuredWidth = dummy.clientWidth;
		document.body.removeChild(dummy);
		e.style.width = `${measuredWidth + 20}px`;
	};

	useEffect(() => {
		if (romCharSelectRef.current) {
			adjustSelectWidth(romCharSelectRef.current);
		}
	}, [selectedCharJyutping]);

	useEffect(() => {
		if (romCharSelectRef.current) {
			adjustSelectWidth(romCharSelectRef.current);
		}
	}, [romanizedChar]);

	return (
		<select
			ref={romCharSelectRef}
			onChange={(e) => {
				setSelectedCharJyutping(e.target.value);
				adjustSelectWidth(e.target);
			}}
			value={selectedCharJyutping}
			className={
				viewMode === "inline"
					? styles.inlineRomDropdown
					: styles.splitRomDropdown
			}
		>
			{romanizedChar.split("/").map((option, index) => (
				<option key={index} value={option}>
					{option}
				</option>
			))}
		</select>
	);
}
