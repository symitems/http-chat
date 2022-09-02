pip install -U pip
pip install --no-cache-dir -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0
