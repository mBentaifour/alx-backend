#!/usr/bin/env python3
"""A babel and flask app"""

from flask import Flask, render_template, request
from flask_babel import Babel


class Config:
    """
    Setting the languages and the locale and timezone
    """
    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app = Flask(__name__)
app.config.from_object(Config)
app.config['BABEL_SUPPORTED_LOCALES'] = ['en', 'fr', 'es']
babel = Babel(app)


@app.route('/')
def hello_world():
    """to run on the website"""
    return render_template('3-index.html')

def get_locale():
    """
    Determine the bestmatch with our supported languages
    """
    return request.accept_languages.best_match(app.config['LANGUAGES'])


if __name__ == '__main__':
    app.run(host='0.0.0.0', port='3000', debug=True)
