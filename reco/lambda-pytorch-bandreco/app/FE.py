import torchvision.models as models
import torch
from torch import Tensor, nn
from sklearn.neighbors import NearestNeighbors
import numpy as np


def prepare_model(n_features: int, model_path: str):
    model = models.resnet34(pretrained=False)
    num_ftrs = model.fc.in_features
    model.fc = nn.Linear(num_ftrs, n_features)
    model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
    return model


def inference_img(model: nn.Module, t_img: Tensor):
    return model(torch.unsqueeze(t_img, 0))


def find_nearest(vecs: np.ndarray, k: int = 5):
    nbrs = NearestNeighbors(n_neighbors=k + 1, algorithm="ball_tree")
    nbrs.fit(vecs)
    _, indices = nbrs.kneighbors(vecs)
    return indices[:, 1:]
