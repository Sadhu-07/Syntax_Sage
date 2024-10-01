# app.py
from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS
from transformers import AutoTokenizer, AutoModelForCausalLM, TextIteratorStreamer
from threading import Thread
import torch
import os
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Load Yi-Coder-3B model and tokenizer
model_name = os.getenv("MODEL_NAME", "huggingface/yi-coder-3b")
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Set a permanent cache directory
cache_dir = os.path.join(os.getcwd(), "model_cache")

# Ensure the directory exists
os.makedirs(cache_dir, exist_ok=True)

try:
    tokenizer = AutoTokenizer.from_pretrained(model_name)
    model = AutoModelForCausalLM.from_pretrained(
        model_name,
        device_map="auto",
        offload_folder=cache_dir,  # Use the permanent cache directory
        torch_dtype=torch.float16
    )
    model.eval()  # Set the model to evaluation mode
    logger.info(f"Successfully loaded model: {model_name}")
except Exception as e:
    logger.error(f"Error loading model: {str(e)}")
    raise

# Caching
from functools import lru_cache

@lru_cache(maxsize=100)
def generate_cached(prompt, language, max_length):
    full_prompt = f"Generate {language} code for: {prompt}\n\n"
    inputs = tokenizer(full_prompt, return_tensors="pt").to(device)
    
    with torch.no_grad():
        outputs = model.generate(
            **inputs,
            max_length=max_length,
            num_return_sequences=1,
            temperature=0.7,
            top_p=0.95,
            do_sample=True
        )
    
    generated_code = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return generated_code.replace(full_prompt, "").strip()

@app.route('/generate', methods=['POST'])
def generate_code():
    try:
        data = request.json
        prompt = data['prompt']
        language = data.get('language', 'python')
        max_length = data.get('max_length', 200)

        generated_code = generate_cached(prompt, language, max_length)
        
        logger.info(f"Successfully generated code for prompt: {prompt[:50]}...")
        return jsonify({'generated_code': generated_code})

    except Exception as e:
        logger.error(f"Error generating code: {str(e)}")
        return jsonify({'error': 'An error occurred while generating code'}), 500

@app.route('/generate_stream', methods=['POST'])
def generate_code_stream():
    try:
        data = request.json
        prompt = data['prompt']
        language = data.get('language', 'python')
        max_length = data.get('max_length', 200)

        full_prompt = f"Generate {language} code for: {prompt}\n\n"
        inputs = tokenizer(full_prompt, return_tensors="pt").to(device)

        streamer = TextIteratorStreamer(tokenizer, skip_prompt=True, skip_special_tokens=True)
        
        generation_kwargs = dict(
            **inputs,
            max_length=max_length,
            num_return_sequences=1,
            temperature=0.7,
            top_p=0.95,
            do_sample=True,
            streamer=streamer
        )

        thread = Thread(target=model.generate, kwargs=generation_kwargs)
        thread.start()

        def generate():
            for text in streamer:
                yield text + "\n"

        return Response(stream_with_context(generate()), content_type='text/plain')

    except Exception as e:
        logger.error(f"Error generating code stream: {str(e)}")
        return jsonify({'error': 'An error occurred while generating code stream'}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    port = int(os.getenv("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=False, threaded=True)
