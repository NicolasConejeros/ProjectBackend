#!/usr/bin/env python3

import wave
import sys
import json
import os

from vosk import Model, KaldiRecognizer, SetLogLevel

# You can set log level to -1 to disable debug messages
SetLogLevel(0)

wf          = wave.open(sys.argv[1], "rb")
output_name = sys.argv[2]

if wf.getnchannels() != 1 or wf.getsampwidth() != 2 or wf.getcomptype() != "NONE":
    print("Audio file must be WAV format mono PCM.")
    sys.exit(1)

model = Model(r"/app/python/es-model")

rec = KaldiRecognizer(model, wf.getframerate())
rec.SetWords(True)
rec.SetPartialWords(True)
f = open(output_name, "a")
while True:
    data = wf.readframes(4000)
    if len(data) == 0:
            break
    if rec.AcceptWaveform(data):
        res = json.loads(rec.Result())
        print(res["text"])
        f.write(res["text"] + "\n")

res = json.loads(rec.FinalResult())
f.write(res["text"] + "\n")
f.close()

