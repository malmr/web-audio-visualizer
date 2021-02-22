"""
Calc_rms function testing

- Check for correct return type
- Check for correct array length of returns (dbfs, t_rms)
- Check for only non positive dBFS returns (test 10 random signals)
- Check for only zero returns (0 dBFS) when input is fullscale array

"""

from app import app, calc_rms
import numpy as np


# constants
LEN = 1000                      # test signal length
NUM_ITERATIONS = 10             # number of random tests
BITDEPTH = 16                   # simulated audio
FS = 16000


# init client
client = app.test_client()


# test functions
def test_return_type():
    """
    SCENARIO: Arbitrary input vector (fs = 16kHz, 16 bit)
    WHEN calling calc_rms function
    THEN types of return (dbfs and t_rms) must be lists

    """

    y = np.random.randn(LEN, 1)
    dbfs, t_rms = calc_rms(y, FS, BITDEPTH)

    # test for type
    assert type(dbfs) == list
    assert type(t_rms) == list


def test_return_filelen():
    """
    SCENARIO: Arbitrary input vector (fs = 16kHz, 16 bit)
    WHEN calling calc_rms function
    THEN lengths of both returns (dbfs and t_rms) must be equal

    """
    y = np.random.randn(LEN, 1)
    dbfs, t_rms = calc_rms(y, FS, BITDEPTH)

    assert len(dbfs) == len(t_rms)


def test_for_non_positive_returns():
    """
    SCENARIO: Arbitrary input vector (fs = 16kHz, 16 bit)
    WHEN calling calc_rms function
    THEN return dbfs must be an array of non-positive values

    """

    for i in range(NUM_ITERATIONS):
        y = np.random.randn(LEN, 1)
        dbfs, t_rms = calc_rms(y, FS, BITDEPTH)

        # test if all values are not positive
        assert all(np.array(dbfs) <= 0)


def test_for_zeros_on_fullscale_input():
    """
    SCENARIO: Input vector with maximum values (16 bit)
    WHEN calling calc_rms function
    THEN return dbfs must contain only zeros (0 dBFS)

    """

    # maximum positive value
    max_val = 2 ** BITDEPTH / 2

    # array of fullscale values
    y = np.ones(LEN) * max_val ** 2

    dbfs, t_rms = calc_rms(y, FS, BITDEPTH)

    # test if all values are 0 dBFS
    assert all(np.array(dbfs) == 0)
