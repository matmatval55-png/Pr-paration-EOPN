#!/usr/bin/env python3
"""Nouvelle version : met à jour la liste des fichiers du service worker, son numéro de version
et js/version.js (numéro affiché en petit dans la barre du haut, avec une forme qui change)."""
import os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
os.chdir(ROOT)
sw = open('sw.js').read()
v = int(re.search(r"const VERSION = 'v(\d+)';", sw).group(1)) + 1
open('js/version.js', 'w').write(f"// Généré par scripts/bump-version.py : ne pas modifier à la main.\nexport const VERSION = {v};\n")
files = ['./', './index.html', './manifest.webmanifest']
for root in ['css', 'icons', 'js', 'images']:
    for d, _, fs in sorted(os.walk(root)):
        for f in sorted(fs):
            files.append('./' + os.path.join(d, f))
sw = re.sub(r"const FILES = \[.*?\];", "const FILES = [\n" + "".join(f"  '{f}',\n" for f in files) + "];", sw, flags=re.S)
sw = re.sub(r"const VERSION = 'v\d+';", f"const VERSION = 'v{v}';", sw)
open('sw.js', 'w').write(sw)
print('version', v)
