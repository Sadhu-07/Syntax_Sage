# test_app.py
import pytest
from app import app
import json
from unittest.mock import patch, MagicMock

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_health_check(client):
    response = client.get('/health')
    assert response.status_code == 200
    assert json.loads(response.data) == {'status': 'healthy'}

@patch('app.model.generate')
@patch('app.tokenizer')
def test_generate_code(mock_tokenizer, mock_generate, client):
    mock_tokenizer.return_value = MagicMock()
    mock_generate.return_value = [MagicMock()]
    mock_tokenizer.decode.return_value = "Generated Python code"

    response = client.post('/generate', json={
        'prompt': 'Create a function to calculate factorial',
        'language': 'python',
        'max_length': 200
    })

    assert response.status_code == 200
    assert 'generated_code' in json.loads(response.data)

def test_generate_code_error(client):
    response = client.post('/generate', json={})
    assert response.status_code == 500
    assert 'error' in json.loads(response.data)

@pytest.mark.parametrize("language", ["python", "javascript", "java", "c++"])
def test_generate_code_different_languages(language, client):
    with patch('app.model.generate') as mock_generate:
        mock_generate.return_value = [MagicMock()]
        with patch('app.tokenizer') as mock_tokenizer:
            mock_tokenizer.return_value = MagicMock()
            mock_tokenizer.decode.return_value = f"Generated {language} code"

            response = client.post('/generate', json={
                'prompt': f'Create a hello world program in {language}',
                'language': language,
                'max_length': 200
            })

            assert response.status_code == 200
            assert f'Generated {language} code' in json.loads(response.data)['generated_code']

def test_generate_code_long_input(client):
    long_prompt = "Create a function to " + "do something " * 100
    with patch('app.model.generate') as mock_generate:
        mock_generate.return_value = [MagicMock()]
        with patch('app.tokenizer') as mock_tokenizer:
            mock_tokenizer.return_value = MagicMock()
            mock_tokenizer.decode.return_value = "Generated code for long input"

            response = client.post('/generate', json={
                'prompt': long_prompt,
                'language': 'python',
                'max_length': 500
            })

            assert response.status_code == 200
            assert 'generated_code' in json.loads(response.data)

# Add more tests as needed