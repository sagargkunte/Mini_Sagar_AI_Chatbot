# tts_server.py
from fastapi import FastAPI
from fastapi.responses import FileResponse
from transformers import pipeline
import soundfile as sf
import uuid

app = FastAPI()

# Load the voice cloning model once
tts = pipeline(
    "text-to-speech",
    model="kenpath/svara-tts-voiceclone-beta"
)

@app.get("/")
def home():
    return {"message": "TTS Server is running"}

@app.post("/generate-voice")
async def generate_voice(text: str):
    print("User input text:", text)
    reference_audio_path = "my_voice.wav"  # your voice sample
    speech = tts(text, voice=reference_audio_path)

    # Save to unique file
    filename = f"output_{uuid.uuid4().hex}.wav"
    sf.write(filename, speech["wav"], samplerate=tts.feature_extractor.sampling_rate)

    # Return audio
    return FileResponse(filename, media_type="audio/wav", filename="voice.wav")