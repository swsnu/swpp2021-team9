import * as lamejs from 'lamejs';

export const audioBufferToWav = aBuffer => {
  function setUint16(data) {
    btwView.setUint16(btwPos, data, true);
    btwPos += 2;
  }

  function setUint32(data) {
    btwView.setUint32(btwPos, data, true);
    btwPos += 4;
  }

  let numOfChan = aBuffer.numberOfChannels,
    btwLength = aBuffer.length * numOfChan * 2 + 44,
    btwArrBuff = new ArrayBuffer(btwLength),
    btwView = new DataView(btwArrBuff),
    btwChnls: Float32Array[] = [],
    btwIndex,
    btwSample,
    btwOffset = 0,
    btwPos = 0;
  setUint32(0x46464952); // "RIFF"
  setUint32(btwLength - 8); // file length - 8
  setUint32(0x45564157); // "WAVE"
  setUint32(0x20746d66); // "fmt " chunk
  setUint32(16); // length = 16
  setUint16(1); // PCM (uncompressed)
  setUint16(numOfChan);
  setUint32(aBuffer.sampleRate);
  setUint32(aBuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
  setUint16(numOfChan * 2); // block-align
  setUint16(16); // 16-bit
  setUint32(0x61746164); // "data" - chunk
  setUint32(btwLength - btwPos - 4); // chunk length
  for (btwIndex = 0; btwIndex < aBuffer.numberOfChannels; btwIndex++) {
    btwChnls.push(aBuffer.getChannelData(btwIndex));
  }

  while (btwPos < btwLength) {
    for (btwIndex = 0; btwIndex < numOfChan; btwIndex++) {
      // interleave btwChnls
      btwSample = Math.max(-1, Math.min(1, btwChnls[btwIndex][btwOffset])); // clamp
      btwSample =
        (0.5 + btwSample < 0 ? btwSample * 32768 : btwSample * 32767) | 0; // scale to 16-bit signed int
      btwView.setInt16(btwPos, btwSample, true); // write 16-bit sample
      btwPos += 2;
    }
    btwOffset++; // next source sample
  }

  let wavHdr = lamejs.WavHeader.readHeader(new DataView(btwArrBuff));
  let wavSamples = new Int16Array(
    btwArrBuff,
    wavHdr.dataOffset,
    wavHdr.dataLen / 2,
  );
  const mp3File = wavToMp3(wavHdr.channels, wavHdr.sampleRate, wavSamples);

  return mp3File;
};

export function wavToMp3(channels, sampleRate, samples) {
  let buffer: Int8Array[] = [];
  let mp3enc = new lamejs.Mp3Encoder(channels, sampleRate, 320);
  let remaining = samples.length;
  let samplesPerFrame = 1152;
  for (let i = 0; remaining >= samplesPerFrame; i += samplesPerFrame) {
    let mono = samples.subarray(i, i + samplesPerFrame);
    let mp3buf = mp3enc.encodeBuffer(mono);
    if (mp3buf.length > 0) {
      buffer.push(new Int8Array(mp3buf));
    }
    remaining -= samplesPerFrame;
  }
  let d = mp3enc.flush();
  if (d.length > 0) {
    buffer.push(new Int8Array(d));
  }

  let mp3Blob = new Blob(buffer, { type: 'audio/mp3' });
  let bUrl = window.URL.createObjectURL(mp3Blob);

  let fileFromBlob = new File(
    [mp3Blob],
    new Date().toISOString() + '_recording.mp3',
    {
      type: 'audio/mpeg',
    },
  );
  // send the download link to the console

  return { fileFromBlob, bUrl };
}
