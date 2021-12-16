import librosa
import matplotlib.pyplot as plt
from PIL import Image
from torchvision.transforms import transforms as T
from pydub import AudioSegment

cmap = plt.get_cmap("inferno")
plt.figure(figsize=(8, 8))
mean = [0.8915528, 0.61322933, 0.5463382]
std = [0.1420371, 0.33962226, 0.38705954]

transforms = T.Compose([T.Resize((299, 299)), T.ToTensor(), T.Normalize(mean, std)])


def make_specgram(songname):
    import io

    buf = io.BytesIO()
    y, sr = librosa.load(songname, mono=True, duration=5)
    plt.specgram(
        y,
        NFFT=2048,
        Fs=2,
        Fc=0,
        noverlap=128,
        cmap=cmap,
        sides="default",
        mode="default",
        scale="dB",
    )
    plt.axis("off")
    plt.savefig(buf)
    plt.clf()
    return Image.open(buf).convert("RGB")


def transform_img(img):
    return transforms(img)


def mixing_audios(files, output_file, f="wav"):
    sounds = list(map(lambda x: AudioSegment.from_file(x), files))
    max_sound = [-1, None]
    other_sounds = []
    for sound in sounds:
        if len(sound) > max_sound[0]:
            max_sound[0] = len(sound)
            max_sound[1] = sound
        else:
            other_sounds.append(sound)

    combined = max_sound[1]
    for sound in other_sounds:
        combined = combined.overlay(sound)

    combined.export(output_file, format=f)
