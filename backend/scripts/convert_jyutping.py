#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import requests
import sys
import re
import pycantonese


romanization_dict = {}


def ensure_db(file_path, url):
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    try:
        new_db = requests.get(url, timeout=10).text
    except requests.RequestException as e:
        print(f"Failed to download {url}: {e}")
        return

    if os.path.exists(file_path):
        with open(file_path, "r", encoding="utf-8") as f:
            old_db = f.read()
        if old_db == new_db:
            return

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_db)


def read_dict(file_name):
    global romanization_dict

    dict_path = os.path.join(os.path.dirname(__file__), "pingyam", file_name)
    with open(dict_path, "r", encoding="utf-8") as file:
        lines = file.readlines()

    romanization_dict = {}
    for line in lines:
        parts = line.strip().split("\t")
        if len(parts) > 2:
            romanization_dict[parts[0]] = parts[2].split('/')[0]


def convert_lyrics(lyrics):
    lyrics = lyrics.replace("\\n", "\n")
    lines = lyrics.split('\n')
    results = []

    for line in lines:
        if line.strip() == "":
            results.append("")
            continue

        processed_split_line = []
        split_line = line.split(' ')

        for sl in split_line:
            if re.search(r'[\u4e00-\u9fff\u3400-\u4dbf\U00020000-\U0002a6df\U0002a700-\U0002ebef\U00030000-\U000323af\ufa0e\ufa0f\ufa11\ufa13\ufa14\ufa1f\ufa21\ufa23\ufa24\ufa27\ufa28\ufa29\u3006\u3007][\ufe00-\ufe0f\U000e0100-\U000e01ef]?', sl):
                jyutping = pycantonese.characters_to_jyutping(sl)
                for og, jp in jyutping:
                    if jp is None:
                        processed_split_line.append(og)
                    else:
                        words = list(og)
                        romWords = []
                        for word in words:
                            romWords.append(romanization_dict.get(
                                word, pycantonese.characters_to_jyutping(word)[0][1]))
                        processed_split_line.extend(
                            ' '.join(romWords))
                    processed_split_line.append(' ')
                processed_split_line.append('  ')
            else:
                processed_split_line.append(sl)
                processed_split_line.append(' ')
        results.append(''.join(processed_split_line).strip())

    return "\\n".join(results)


def main():
    if len(sys.argv) < 2:
        sys.exit(1)

    chinese_lyrics = sys.argv[1]

    base_url = "https://raw.githubusercontent.com/kfcd/yyzd/master/dist/tsv/繁體/"
    save_dir = os.path.join(os.path.dirname(__file__), "pingyam")
    os.makedirs(save_dir, exist_ok=True)

    file_path = os.path.join(save_dir, '粵語字典_(粵拼).txt')
    url = base_url + '粵語字典_(粵拼).txt'
    ensure_db(file_path, url)
    read_dict('粵語字典_(粵拼).txt')

    converted_lyrics = convert_lyrics(chinese_lyrics)
    print(converted_lyrics)


if __name__ == "__main__":
    main()
