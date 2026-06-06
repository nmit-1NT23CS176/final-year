from fmf.exception.exception import FMFException
from fmf.logging.logger import logging
import sys

if __name__ == "__main__":
    try:
        logging.info("Start")
        a = 1/0
    except Exception as e:
        raise FMFException(e, sys)