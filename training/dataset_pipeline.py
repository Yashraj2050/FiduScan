
import os

class DatasetPipeline:
    def __init__(self, dataset_name="DFDC"):
        self.dataset_name = dataset_name
        self.data_dir = f"./data/{dataset_name.lower()}"
        
    def download_dataset(self):
        print(f"Downloading {self.dataset_name}...")
        
    def preprocess(self):
        print("Extracting frames and detecting faces...")
        
    def get_splits(self):
        return {"train": [], "val": [], "test": []}
