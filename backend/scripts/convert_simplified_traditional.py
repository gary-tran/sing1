#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import opencc
import sys

def convert_chinese(lyrics, conversion_type):
    if conversion_type == 's2t':
        converter = opencc.OpenCC('s2t')
    elif conversion_type == 't2s':
        converter = opencc.OpenCC('t2s')
    else:
        raise ValueError("Invalid conversion type. Choose either 's2t' or 't2s'.")

    lyrics = lyrics.replace('\\n', '\n')
    lines = lyrics.split('\n')

    converted_lines = []
    for line in lines:
        converted = converter.convert(line)
        converted_lines.append(converted)

    return "\\n".join(converted_lines)

def main():
    if len(sys.argv) < 3:
        sys.exit(1)

    lyrics = sys.argv[1]
    conversion_type = sys.argv[2]
    results = convert_chinese(lyrics, conversion_type)
    print(results)

if __name__ == "__main__":
    main()