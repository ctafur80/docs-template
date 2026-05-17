#!/usr/bin/env python3

# csv-filter.py: Un filtro de Pandoc en Python para convertir bloques CSV en tablas.

import sys
import json
import csv
from io import StringIO

def to_pandoc_table(text):
    """Convierte un string de texto CSV en una estructura de Tabla JSON de Pandoc."""
    try:
        f = StringIO(text)
        reader = csv.reader(f)
        lines = list(reader)
    except Exception:
        return None

    if not lines:
        return None

    header_line = lines[0]
    body_lines = lines[1:]

    def make_cell_content(content_str):
        # CORRECCIÓN FINAL: La celda también es un Array de su contenido.
        # El contenido de una celda es: [Attr, Align, RowSpan, ColSpan, [Blocks]]
        return [
            ["", [], []],  # Attr
            {'t': 'AlignDefault'},
            1,  # RowSpan
            1,  # ColSpan
            [{'t': 'Plain', 'c': [{'t': 'Str', 'c': content_str}]}] # Content
        ]

    header_cell_contents = [make_cell_content(s) for s in header_line]
    body_rows_of_cell_contents = [[make_cell_content(s) for s in row] for row in body_lines]

    # --- Construcción de la estructura JSON correcta para una Tabla de Pandoc ---

    attr = ["", [], []]
    caption = [None, []]

    num_columns = len(header_cell_contents)
    colspecs = []
    for _ in range(num_columns):
        colspecs.append([{'t': 'AlignDefault'}, {'t': 'ColWidthDefault'}])

    header_row_content = [["", [], []], header_cell_contents]
    table_head = [["", [], []], [header_row_content]]

    body_row_contents = []
    for row_of_cell_contents in body_rows_of_cell_contents:
        body_row_contents.append([["", [], []], row_of_cell_contents])
    table_body_content = [["", [], []], 0, [], body_row_contents]
    table_bodies = [table_body_content]

    table_foot = [["", [], []], []]

    return {
        't': 'Table',
        'c': [
            attr,
            caption,
            colspecs,
            table_head,
            table_bodies,
            table_foot
        ]
    }

def walk(x):
    if isinstance(x, list):
        return [walk(item) for item in x]

    if not isinstance(x, dict):
        return x

    if x.get('t') == 'RawBlock' and x.get('format') == 'csv':
        return to_pandoc_table(x['text'])

    if x.get('t') == 'RawBlock' and isinstance(x.get('c'), list) and len(x['c']) == 2 and x['c'][0] == 'csv':
        return to_pandoc_table(x['c'][1])

    new_dict = {}
    for key, value in x.items():
        new_dict[key] = walk(value)
    return new_dict




if __name__ == "__main__":
    doc = json.load(sys.stdin)

    if isinstance(doc, dict) and 'blocks' in doc:
        doc['blocks'] = walk(doc['blocks'])
    else:
        doc = walk(doc)

    json.dump(doc, sys.stdout)




