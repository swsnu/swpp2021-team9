import mysql.connector
from collections import defaultdict
import pickle
import boto3

bucket_name = "bandreco"
key_to_pickle = "outputs.pickle"


def get_max_view_combi():
    mydb = mysql.connector.connect(
        host="metaband.space", user="band", passwd="dlrjsqlalf", database="bandcruit"
    )
    cur = mydb.cursor()

    query = """
    SELECT covers.audio, covers.song_id, filterd_comb.comb_id
    FROM Cover covers
    INNER JOIN Cover_Combination cc 
    ON covers.id = cc.cover_id
    INNER JOIN 
    (SELECT comb.song_id, comb.id AS comb_id FROM(
        SELECT ANY_VALUE(comb.id) AS id, max(comb.view) AS view
        FROM Combination comb
        GROUP BY song_id) c_max
        INNER JOIN Combination comb ON c_max.id = comb.id) filterd_comb 
    ON filterd_comb.comb_id = cc.combination_id
    """
    cur.execute(query)
    covers = defaultdict(list)
    song_comb = dict()
    for audio, song_id, comb_id in cur:
        song_comb[song_id] = comb_id
        covers[song_id].append(audio)
    cur.close()
    mydb.close()

    outputs = {
        song_id: {"combination_id": song_comb[song_id], "audios": audios}
        for song_id, audios in covers.items()
    }
    return outputs


def load_output_from_s3():
    try:
        s3 = boto3.resource("s3")
        return pickle.loads(
            s3.Bucket(bucket_name).Object(key_to_pickle).get()["Body"].read()
        )
    except Exception as e:
        print(e)
        return {}


def save_output_to_s3(outputs):
    save_to_s3(outputs, key_to_pickle)


def save_to_s3(output, key):
    try:
        s3 = boto3.resource("s3")
        s3.Bucket(bucket_name).Object(key).put(Body=pickle.dumps(output))
    except Exception as e:
        print(e)
