"""
File upload response tests

- Check for valid HTTP POST response on WAV upload (200)
- Check for error HTTP POST response on non WAV upload (415)

"""

from app import app
from io import BytesIO

# constants
FILES_AUDIO = {'static/files/audio.wav'}
FILES_WRONG_EXT = {'static/js/ajaxform.js'}

client = app.test_client()


# test functions
def test_successful_response():
    """ WAV file extension
    SCENARIO: Running Flask application
    WHEN HTTP POST request is send to '/upload' with file .WAV
    THEN check for valid response code 200 (OK)

    """

    for file in FILES_AUDIO:
        print('testing file: ', file)
        data = {
            'field': 'value',
            'file': open(file, 'rb')
        }
        resp = client.post('/upload', buffered=True,
                           content_type='multipart/form-data',
                           data=data)
        assert resp.status_code == 200


def test_error_response():
    """ Non WAV file extension
    SCENARIO: Running Flask application
    WHEN HTTP POST request is send to '/upload' with file of arbitrary
    file extension excluding WAV
    THEN check for error response code 415 (Unsupported Media Type)

    """
    data = {
        'field': 'value',
        'file': (BytesIO(b'FILE CONTENT'), 'static/js/ajaxform.js')
    }

    for file in FILES_WRONG_EXT:
        print('testing file: ', file)
        data = {
            'field': 'value',
            'file': open(file, 'rb')
        }
        resp = client.post('/upload', buffered=True,
                           content_type='multipart/form-data',
                           data=data)
        assert resp.status_code == 415
