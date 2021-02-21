# Web Audio Visualizer
Web server with flask backend and frontend to visualize WAV waveform.

Drag & Drop or upload WAV file into frontend start page, then the waveform is plotted in the same canvas. The values represents the rms (root mean square) of small blocks of samples ins dBFS (fullscale).

[![](https://i.ibb.co/wp89cTQ/1.png)](#)
## Requirements

Python 3.6+ and pip

Install scipy (Anaconda recommended)

Install virtualenv, Flask and numpy:

`pip install -U virtualenv Flask numpy`

## Installation & Usage

``git clone git@github.com:malmr/web-audio-visualizer.git``

Or using downloaded zip file 

`` unzip audio-visualizer.zip``

change the directory

``cd audio-visualizer``

### Start backend server

Activate virtual environment with `python3 -m venv venv`.

Run the application `app.py` to start the flask server:

```python
export FLASK_APP=app.py
flask run
```



### Usage

Visit http://127.0.0.1:5000/. Drag & Drop or upload a WAV file. The waveform is plotted.
