
import unittest
from dataset_pipeline import DatasetPipeline
from train_pipeline import Trainer

class TestPipeline(unittest.TestCase):
    def test_dataset(self):
        dp = DatasetPipeline()
        self.assertIsNotNone(dp)
        
    def test_trainer(self):
        trainer = Trainer()
        self.assertIsNotNone(trainer)
