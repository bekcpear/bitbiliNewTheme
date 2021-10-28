#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

"""
this file should be imported from pelican config file
e.g.:

THEME = './starrySky/dist'
import os
import sys
sys.path.append(os.path.join(os.curdir, 'starrySky/config'))
from starrySkyConfig import *
"""

_theme_dir="/home/ryan/Git/starrySky/dist"

# Custom settings:
# all paths are relative to SITE.url
SITE = {
        "name": "bitbili",
        "long_name": "bitbili.net",
        "desc": "一个格物致知的技术博客。",
        "url": "https://bitbili.net/",
        "color": "#eb1847",
        "manifest": "/assets/manifest.json",
        "author": {
            "username": "cwittlut",
            "name": "Ryan Qian",
            "email": [
                "i@bitbili.net",
                "cwittlut@vermilion.ink"
                ],
            "profile": {
                "avatar": "",
                "bio": "",
                "url": "https://github.com/bekcpear"
                }
            },
        "og": {
            "image": {
                "path": ""
                }
            }
        }

LOGO = {
        "square" : {
            "png": {
                "path": "assets/logo/logo.png",
                "size": "",
                "width": 600,
                "height": 600
                },
            "svg": {
                "path": "assets/logo/logo.svg"
                },
            },
        "rectangle": {
            "png": {
                "path": "",
                "size": ""
                },
            "svg": {
                "path": ""
                },
            }
        }

ICON = {
        "normal": {
            "path": "assets/logo/fav.png",
            "size": "480x480"
            },
        "touch": {
            "path": "assets/logo/touch.png",
            "size": "300x300"
            },
        "mask": {
            "path": "assets/logo/mask.svg"
            }
        }

CSS = {
        "common": "",
        "index": "",
        "article": "",
        "page": ""
        }

JS = {
        "common": ""
        }


############
############
############
# theme specific settings, should not be modified normally
THEME_STATIC_DIR   = 'assets'
THEME_STATIC_PATHS = ['assets']
JINJA_ENVIRONMENT  = {
        'trim_blocks': True,
        'lstrip_blocks': True
        }
PAGINATION_PATTERNS = (
        (1, '{url}', '{save_as}'),
        (2, '{base_name}/page/{number}/', '{base_name}/page/{number}/index.html'),
)

import os
import hashlib

def hash(path):
    BUF_SIZE = 65536
    md5      = hashlib.md5()
    _path    = os.path.join(_theme_dir, path)
    if not os.path.isfile(_path):
        return ""
    with open(_path, 'rb') as f:
        while True:
            data = f.read(BUF_SIZE)
            if not data:
                break
            md5.update(data)
    return md5.hexdigest()

JINJA_GLOBALS = {
        "_md5_hash": hash
        }
