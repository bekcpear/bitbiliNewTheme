#!/usr/bin/env python
# -*- coding: utf-8 -*- #
from __future__ import unicode_literals

"""
this file should be imported from pelican config file
e.g.:

THEME = './bitbiliTheme1/dist'
import os
import sys
sys.path.append(os.path.join(os.curdir, 'bitbiliTheme1/config'))
from bitbiliTheme1Config import *
"""

_theme_dir="/home/ryan/Git/bitbiliTheme1/dist"

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
        "common": "assets/js/common.js"
        }


############
############
############
# theme specific settings, should not be modified normally
THEME_STATIC_DIR          = 'assets'
THEME_STATIC_PATHS        = ['assets']
JINJA_ENVIRONMENT         = {
        'trim_blocks': True,
        'lstrip_blocks': True
        }

ARTICLE_LANG_URL          = '{lang}/{slug}.html'
ARTICLE_LANG_SAVE_AS      = ARTICLE_LANG_URL
DRAFT_LANG_URL            = '{lang}/drafts/{slug}.html'
DRAFT_LANG_SAVE_AS        = DRAFT_LANG_URL
PAGE_LANG_URL             = '{lang}/pages/{slug}.html'
PAGE_LANG_SAVE_AS         = PAGE_LANG_URL
DRAFT_PAGE_LANG_URL       = '{lang}/drafts/pages/{slug}.html'
DRAFT_PAGE_LANG_SAVE_AS   = DRAFT_PAGE_LANG_URL

FEED_ATOM                 = None
FEED_ATOM_URL             = None
FEED_RSS                  = 'feeds/rss.xml'
FEED_RSS_URL              = FEED_RSS
FEED_ALL_ATOM             = None
FEED_ALL_ATOM_URL         = None
FEED_ALL_RSS              = 'feeds/all.rss.xml'
FEED_ALL_RSS_URL          = FEED_ALL_RSS
CATEGORY_FEED_ATOM        = None
CATEGORY_FEED_ATOM_URL    = None
CATEGORY_FEED_RSS         = 'feeds/category/{slug}.rss.xml'
CATEGORY_FEED_RSS_URL     = CATEGORY_FEED_RSS
AUTHOR_FEED_ATOM          = None
AUTHOR_FEED_ATOM_URL      = None
AUTHOR_FEED_RSS           = 'feeds/author/{slug}.rss.xml'
AUTHOR_FEED_RSS_URL       = AUTHOR_FEED_RSS
TAG_FEED_ATOM             = None
TAG_FEED_ATOM_URL         = None
TAG_FEED_RSS              = 'feeds/tag/{slug}.rss.xml'
TAG_FEED_RSS_URL          = TAG_FEED_RSS
RSS_FEED_SUMMARY_ONLY     = True
TRANSLATION_FEED_ATOM     = None
TRANSLATION_FEED_ATOM_URL = None
TRANSLATION_FEED_RSS      = '{lang}/feeds/all.rss.xml'
TRANSLATION_FEED_RSS_URL  = TRANSLATION_FEED_RSS

AUTHOR_URL                = 'author/{slug}/'
AUTHOR_SAVE_AS            = 'author/{slug}/index.html'
CATEGORY_URL              = 'category/{slug}/'
CATEGORY_SAVE_AS          = 'category/{slug}/index.html'
TAG_URL                   = 'tag/{slug}/'
TAG_SAVE_AS               = 'tag/{slug}/index.html'

PAGINATION_PATTERNS       = (
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
