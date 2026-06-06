
from setuptools import setup, find_packages

setup(
    name="fiduscan",
    version="1.0.0",
    description="Official Python SDK for FiduScan API",
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",
    author="FiduScan",
    packages=find_packages(),
    install_requires=["requests"],
    python_requires=">=3.8",
)
