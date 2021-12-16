import os
import shutil
import json
import requests

import numpy as np

from preprocessor import make_specgram, transform_img, mixing_audios
from FE import prepare_model, inference_img, find_nearest
from collecter import get_max_view_combi, load_output_from_s3, save_output_to_s3, save_to_s3
from utils import ensure_dir, make_result_dict, outputs_to_vecs

MEDIA_URL = "https://metaband.space/media/"
AUDIO_DIR = "/tmp/audio/"
MIXIN_DIR = "/tmp/mixin/"
n_features = 30
model_path = "/opt/ml/model.pth"
vecs_output_path = "/tmp/vecs_output.pickle"

# Preprocessing steps for the image
print("prepare model")
model = prepare_model(n_features, model_path)
model.eval()


def main():
    mixings: dict = dict()
    outputs: dict = dict()

    ensure_dir(MIXIN_DIR)
    ensure_dir(AUDIO_DIR)

    print("get prev resul")
    pre_outputs = load_output_from_s3()

    print("get max view combination")
    covers = get_max_view_combi()

    def check_has_vec(song_id, comb_id):
        if song_id in pre_outputs and pre_outputs[song_id]["combination_id"] == comb_id:
            return True
        else:
            return False

    print("mixing songs")
    print(f"songs: {len(covers)}")
    for song_id, batch in covers.items():
        comb_id = batch["combination_id"]
        audios = batch["audios"]

        # User pre_output when has it
        if check_has_vec(song_id, comb_id):
            outputs[song_id] = pre_outputs[song_id]
            continue

        song_dir = os.path.join(AUDIO_DIR, f"{song_id}_audio")
        ensure_dir(song_dir)

        # get cover audio files
        audio_files = []
        for aud in audios:
            r = requests.get(MEDIA_URL + aud)
            audio_file = os.path.join(song_dir, os.path.split(aud)[1])
            with open(audio_file, "wb") as f:
                f.write(r.content)
            audio_files.append(audio_file)

        # mixing files
        mixing_file = os.path.join(MIXIN_DIR, f"{song_id}_mixing.wav")
        mixing_audios(audio_files, mixing_file)
        mixings[song_id] = mixing_file

        # remove cover files
        shutil.rmtree(song_dir)
    print(f"mixing files: {len(mixings)}")

    print("get outputs")
    for song, mixing_file in mixings.items():
        img = make_specgram(mixing_file)
        t_img = transform_img(img)
        output = inference_img(model, t_img)
        vec = np.squeeze(output.detach().numpy())
        outputs[song] = {
            "combination_id": covers[song]["combination_id"],
            "vec": vec,
        }

    print("save outputs")
    save_output_to_s3(outputs)

    idx_to_songid, idx_to_cid, vecs = outputs_to_vecs(outputs)
    k = 5 if len(idx_to_songid) > 5 else (len(idx_to_songid) - 1)
    k_nbrs = find_nearest(vecs, k)

    result_dict = make_result_dict(idx_to_songid, idx_to_cid, k_nbrs)

    save_to_s3(result_dict, "result.pickle")

    return result_dict


def lambda_handler(event, context):
    result = main()

    return {
        "statusCode": 200,
        "body": json.dumps(
            {
                "predicted_label": json.dumps(result),
            }
        ),
    }
