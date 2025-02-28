#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import os
import requests
import sys


class Converter:
    def __init__(self, source_rom=0):
        self.dict = self.read_dict(source_rom)

    def read_dict(self, source_sys=0):
        dict_path = os.path.join(os.path.dirname(
            __file__), "pingyam", "pingyambiu")
        with open(dict_path, "r") as file:
            lines = file.readlines()

        return {line.split("\t")[source_sys]: line.strip().split("\t") for line in lines}

    def convert_line(self, line, method):
        return " ".join(
            self.convert_syllable(word, method) for word in line.split(" ")
        )

    def convert_syllable(self, word, method):
        if '/' not in word:
            w = self.dict.get(word.lower())
            if w:
                syllable = w[method]
                if method == 0:
                    syllable = self.normalize_yale(syllable)
                syllable = '0' + syllable
                return syllable
            return word
        else:
            word_list = word.split('/')
            converted_word_list = []
            for jp in word_list:
                w = self.dict.get(jp.lower())
                if w:
                    syllable = w[method]
                    if method == 0:
                        syllable = self.normalize_yale(syllable)
                    converted_word_list.append(syllable)
            return '0' + '/'.join(converted_word_list)

    def normalize_yale(self, syllable):
        num_hash = {
            "7": "1", "8": "3", "9": "6"
        }
        for d, norm in num_hash.items():
            syllable = syllable.replace(d, norm)
        return syllable


def convert_lyrics(lyrics, target, source):
    conv = Converter(source_rom=source)
    lyrics = lyrics.replace("\\n", "\n")
    lines = lyrics.split("\n")
    converted_lines = [
        conv.convert_line(line.strip(), target) for line in lines
    ]
    return "\\n".join(converted_lines)


def ensure_db(file_path, url):
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    new_db = requests.get(url, timeout=10).text

    if os.path.exists(file_path):
        with open(file_path, "r") as f:
            old_db = f.read()
        if old_db == new_db:
            return
    with open(file_path, "w") as f:
        f.write(new_db)


def main():
    url = "https://raw.githubusercontent.com/kfcd/pingyam/master/pingyambiu"
    save_dir = os.path.join(os.path.dirname(__file__), "pingyam")
    os.makedirs(save_dir, exist_ok=True)
    file_path = os.path.join(save_dir, 'pingyambiu')
    ensure_db(file_path, url)

    # "yaleToneNumbers",       // 0
    # "yaleToneDiacritics",    // 1
    # "cantonesePinyin",       // 2
    # "slWongToneNumbers",     // 3
    # "slWongToneDiacritics",  // 4
    # "ipa",                   // 5
    # "jyutping",              // 6
    # "cantonPinyin",          // 7
    # "sidneyLau",             // 8
    # "penkyampToneNumbers",   // 9
    # "penkyampToneDiacritics" // 10

    if len(sys.argv) < 3:
        sys.exit(1)

    jyutping_lyrics = sys.argv[1]
    target = int(sys.argv[2])
    source = 6

    converted_lyrics = convert_lyrics(jyutping_lyrics, target, source)
    print(converted_lyrics)


if __name__ == "__main__":
    main()
