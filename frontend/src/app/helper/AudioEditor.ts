import * as lamejs from 'lamejs';
import { Segment } from 'peaks.js';
import { audioBufferToWav } from './WavToMp3';
// Reference : https://github.com/Vinit-Dantkale/AudioFy : mp3 형식
// https://stackoverflow.com/questions/61264581/how-to-convert-audio-buffer-to-mp3-in-javascript : wav to mp3
// this audio editor only handle .wav, .mp3 file

export default class AudioEditor {
  private arrayBuffer;
  private audioBuffer;
  private static _instance: AudioEditor | null = null;
  static getInstance(): AudioEditor {
    if (!AudioEditor._instance) {
      AudioEditor._instance = new AudioEditor();
    }
    return this._instance!;
  }

  async readAndDecode(audioFile, isReturn = false) {
    let file = audioFile;
    let blobUrl;
    if (audioFile.type === 'audio/wav') {
      try {
        this.arrayBuffer = await this.readAudio(audioFile);
        console.log(this.arrayBuffer);
      } catch (e) {
        console.error(e);
      }
      try {
        const tmpBuf = await new AudioContext().decodeAudioData(
          this.arrayBuffer.result,
        );
        console.log(tmpBuf);
        const { fileFromBlob, bUrl } = audioBufferToWav(tmpBuf);
        file = fileFromBlob;
        blobUrl = bUrl;
      } catch (e) {
        console.error(e);
      }
    }
    try {
      this.arrayBuffer = await this.readAudio(file);
    } catch {
      window.alert('파일을 읽을 수 없습니다.');
      return;
    }
    try {
      this.audioBuffer = await new AudioContext().decodeAudioData(
        this.arrayBuffer.result,
      );
      if (isReturn) return blobUrl;
    } catch {
      window.alert('디코딩 오류 발생');
      return;
    }
  }

  readAudio(file) {
    return new Promise((resolve, reject) => {
      let reader = new FileReader();
      reader.readAsArrayBuffer(file);

      //Resolve if audio gets loaded
      reader.onload = function () {
        console.log('Audio Loaded');
        resolve(reader);
      };

      reader.onerror = function (error) {
        console.log('Error while reading audio');
        reject(error);
      };

      reader.onabort = function (abort) {
        console.log('Aborted');
        console.log(abort);
        reject(abort);
      };
    });
  }

  async mergeAudio(segmentList: Segment[]) {
    console.log('Audio Segments');
    const segmentDetails: SegmentDetail[] = [];
    let maxLength = 0;

    for (let seg of segmentList) {
      const segmentDuration = seg.endTime - seg.startTime;

      const startTime = Math.floor(
        (seg.startTime * this.audioBuffer.length) / this.audioBuffer.duration,
      );
      const endTime = Math.ceil(
        (seg.endTime * this.audioBuffer.length) / this.audioBuffer.duration,
      );
      const segmentLength = endTime - startTime;
      maxLength = maxLength + segmentLength;

      const segmentDetail: SegmentDetail = {
        segmentDuration: segmentDuration,
        startTime: startTime,
        endTime: endTime,
        segmentLength: segmentLength,
      };
      segmentDetails.push(segmentDetail);
    }

    let mergedAudio = new AudioContext().createBuffer(
      this.audioBuffer.numberOfChannels,
      maxLength,
      this.audioBuffer.sampleRate,
    );

    let channelData =
      this.audioBuffer.numberOfChannels === 1
        ? [new Float32Array(maxLength)]
        : [new Float32Array(maxLength), new Float32Array(maxLength)];

    for (let i = 0; i < this.audioBuffer.numberOfChannels; i++) {
      let startPosition = 0;
      for (let segDetail of segmentDetails) {
        channelData[i].set(
          this.audioBuffer
            .getChannelData(i)
            .slice(segDetail.startTime, segDetail.endTime),
          startPosition,
        );

        startPosition += segDetail.segmentLength;
      }
    }
    for (let i = 0; i < this.audioBuffer.numberOfChannels; i++) {
      mergedAudio.copyToChannel(channelData[i], i);
    }

    let audioData = {
      channels: Array.apply(null, Array(mergedAudio.numberOfChannels)).map(
        (el, index) => {
          return mergedAudio.getChannelData(index);
        },
      ),
      sampleRate: mergedAudio.sampleRate,
      length: mergedAudio.length,
    };

    try {
      const mp3Blob = await this.encoding(audioData);
      return mp3Blob;
    } catch (e) {
      console.error(e);
    }
  }

  encoding(audioData: AudioData) {
    let buffer: Int8Array[] = [];
    let sampleBlockSize = 1152;

    let mp3Encoder = new lamejs.Mp3Encoder(
      audioData.channels.length,
      audioData.sampleRate,
      320,
    );

    if (audioData.channels.length === 1) {
      return new Promise((resolve, reject) => {
        let arrayBuffer = audioData.channels[0];

        let samples = new Int16Array(arrayBuffer.length);
        this.floatTo16BitPCM(arrayBuffer, samples);

        for (let i = 0; i < samples.length; i += sampleBlockSize) {
          let mono = samples.subarray(i, i + sampleBlockSize);
          let mp3buf = mp3Encoder?.encodeBuffer(mono);
          if (mp3buf.length > 0) {
            buffer.push(mp3buf);
          }
        }
        const d = mp3Encoder?.flush();

        if (d.length > 0) {
          buffer.push(new Int8Array(d));
        }
        const blob = new Blob(buffer, { type: 'audio/mpeg' });
        resolve(blob);
      });
    }

    if (audioData.channels.length === 2) {
      return new Promise((resolve, reject) => {
        let right = new Int16Array(audioData.channels[0].length);
        this.floatTo16BitPCM(audioData.channels[0], right);

        let left = new Int16Array(audioData.channels[1].length);
        this.floatTo16BitPCM(audioData.channels[1], left);

        for (
          let i = 0;
          i < audioData.channels[0].length;
          i += sampleBlockSize
        ) {
          let leftData = left.subarray(i, i + sampleBlockSize);
          let rightData = right.subarray(i, i + sampleBlockSize);
          let mp3buf = mp3Encoder?.encodeBuffer(leftData, rightData);
          if (mp3buf.length > 0) {
            buffer.push(mp3buf);
          }
        }
        const d = mp3Encoder?.flush();

        if (d.length > 0) {
          buffer.push(new Int8Array(d));
        }
        const mp3 = new Blob(buffer, { type: 'audio/mpeg' });
        resolve(mp3);
      });
    }
  }

  floatTo16BitPCM(input, output) {
    for (let i = 0; i < input.length; i++) {
      const s = Math.max(-1, Math.min(1, input[i]));
      output[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
  }
}
