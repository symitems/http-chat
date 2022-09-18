export UI_ORIGIN=$1
uvicorn main:app --reload --host 0.0.0.0
