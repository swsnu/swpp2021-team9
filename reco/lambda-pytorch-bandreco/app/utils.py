import os

import numpy as np


def ensure_dir(path):
    if not os.path.exists(path):
        os.makedirs(path)
        return True
    return False


def outputs_to_vecs(outputs):
    idx_to_sid = []
    idx_to_cid = []
    vecs = []
    for song_id, output in outputs.items():
        idx_to_sid.append(song_id)
        idx_to_cid.append(output["combination_id"])
        vecs.append(output["vec"])
    vecs = np.array(vecs)
    return idx_to_sid, idx_to_cid, vecs


def make_result_dict(idx_to_songid, idx_to_cid, nbrs):
    result = dict()
    for idx, song_id in enumerate(idx_to_songid):
        song_nbrs = list(map(lambda x: idx_to_cid[x], nbrs[idx]))
        result[song_id] = song_nbrs
    return result
