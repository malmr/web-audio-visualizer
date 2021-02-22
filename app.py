"""app.py Flask backend
Listen to '/upload' and returns on successful upload a JSON object.

    The JSON object contains:
    ----------
    rms : list
        Rms values for given framesize in dBFS.
    t_rms : list
        Time values in s corresponding to dbfs.
    fs : int
        Sample rate of audio file in Hz.
    framesize : int
        Size of a frame in samples.

"""

from flask import Flask, request, render_template, jsonify
from scipy.io import wavfile
import numpy as np

# constants
ALLOWED_EXTENSIONS = {'wav'}
DEFAULT_FRAMESIZE = 128

# init flask
app = Flask(__name__)


# functions
def check_ext(filename):
    """Checks if extension of filename is allowed.

    Parameters
    ----------
    filename : str
        filname with extension.

    Returns
    -------
    bool
        True if allowed, False otherwise.

    """
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def calc_rms(y, fs, bitdepth, framesize = DEFAULT_FRAMESIZE):
    """Calculate rms blocks from a vector of audio samples,
    where y is split into frames of size framesize.

    Parameters
    ----------
    y : array
        Vector of audio samples.
    fs : int
        Sample rate of audio file.
    bitdepth: int
        Bit depth of audio file.
    framesize : int
        Optional: Size of a frame in samples (default value assumed otherwise)

    Returns
    -------
    dbfs : list
        Rms values in dBFS.
    t_rms : list
        Time values in s corresponding to dBFS.

    """
    # number of frames for given framesize
    n_frames = np.floor(len(y) / framesize)
    # calc fullscale in bits
    fullscale = 2 ** bitdepth / 2
    # type conversion from int to float to prevent overflow (squaring)
    y = y.astype(float)
    frames = np.array_split(y, n_frames)
    rms = [np.sqrt(np.mean(frame ** 2)) for frame in frames]
    t_rms = (np.arange(0, len(rms)) * framesize/fs).tolist()
    # calc fullscale ratio
    fsratio = np.array(rms) / fullscale ** 2
    # calc dBFS
    dbfs = (10 * np.log10(fsratio)).tolist()
    return dbfs, t_rms


def analyze_wav(fn):
    """Open WAV file and analyze

    Parameters
    ----------
    fn : fileobj
        Uploaded file.

    Returns
    -------
    dbfs : list
        Rms values in dBFS.
    t_rms : list
        Time values in s corresponding to dBFS.

    """
    fs, y = wavfile.read(fn)
    # calc bitdepth from input byte size
    bitdepth = y.itemsize * 8
    dbfs, t_rms = calc_rms(y, fs, bitdepth)
    return dbfs, t_rms, fs


# url route registrations
@app.route("/")
def start():
    return render_template('start.html')


@app.route('/upload', methods=['POST'])
def upload_file():
    # check if post request has the file part
    if 'file' not in request.files:
        err_msg = 'No file part!'
        return err_msg, 400
    file = request.files['file']

    # check if filename is empty (no file selected)
    if file.filename == '':
        err_msg = 'No file selected!'
        return err_msg, 400

    # if file extension is correct, analyze audio
    if check_ext(file.filename):
        f = request.files['file']
        dbfs, t_rms, fs = analyze_wav(f)
        return jsonify(rms=dbfs, t_rms=t_rms, fs=fs, framesize=DEFAULT_FRAMESIZE)
    else:
        err_msg = ('Wrong file extension! Allowed: ' +
                   ', '.join(ALLOWED_EXTENSIONS))
        return err_msg, 415
