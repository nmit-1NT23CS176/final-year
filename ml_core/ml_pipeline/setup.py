from pathlib import Path
from setuptools import find_packages, setup
from typing import List


def get_requirements() -> List[str]:
    """
    Return a list of requirements from requirements.txt.
    Ignores comments and editable install line (-e .).
    """
    requirements: List[str] = []
    requirements_path = Path(__file__).parent / "requirements.txt"

    try:
        with requirements_path.open("r", encoding="utf-8") as file:
            for line in file:
                requirement = line.strip()
                if requirement and not requirement.startswith("#") and requirement != "-e .":
                    requirements.append(requirement)
    except FileNotFoundError:
        print("requirements.txt file not found")

    return requirements


setup(
    name="financial-marketing-forecasting",
    version="0.0.1",
    author="Priyanshu Kumar",
    author_email="priyanshu.kumar7500@gmail.com",
    description="Financial Market Trend Forecasting using ensemble learning and deep sequence models",
    long_description=(
        "A final year project for predicting Indian stock market trend direction "
        "using NSE data, global market data, and news sentiment."
    ),
    long_description_content_type="text/plain",
    packages=find_packages(),
    install_requires=get_requirements(),
    include_package_data=True,
    python_requires=">=3.11",
)