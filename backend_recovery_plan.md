# FiduScan Backend Recovery Plan

## Priority 1: Must fix before deployment
1. **Passlib Error**: The `ModuleNotFoundError: No module named 'passlib'` occurs because `pip install passlib[bcrypt]==1.7.4` is failing or skipping installation due to incompatibilities with modern Python 3.11/3.12 and `bcrypt` 4.0+. 
   **Fix**: Update `requirements.txt` and `backend/requirements.txt`. Specify `bcrypt==3.2.2` (which is compatible with `passlib`) or migrate away from `passlib` to `pwdlib`.

## Priority 2: Likely next runtime failures
1. **SQLAlchemy Postgres Dialect Error**: When deployed to Railway, the `DATABASE_URL` is automatically injected with the prefix `postgres://`. SQLAlchemy 2.0.32 no longer supports this prefix and will crash at startup with `NoSuchModuleError: Can't load plugin: sqlalchemy.dialects:postgres`.
   **Fix**: In `backend/database.py`, string-replace `postgres://` with `postgresql://` before passing it to `create_engine()`.

2. **Torchaudio Missing**: `torchaudio` is imported in `audio_pipeline/preprocess.py`, but it is completely missing from `requirements.txt`. While it won't crash on startup due to a `try...except ImportError` block, any audio inference request will fail or return mocked/random noise results in production.
   **Fix**: Add `torchaudio==2.4.0` (matching the torch version) to `requirements.txt` and `backend/requirements.txt`.

## Priority 3: Warnings
1. **Model Files Missing in Ephemeral Filesystems**: The app falls back to random weights if models aren't present. On Railway, unless a volume is mounted or models are checked into Git (or downloaded at startup), inference will use random weights.
2. **Duplicate Procfile/requirements**: There are `requirements.txt` and `Procfile` in both the root directory and the `backend/` directory. This can cause deployment confusion in Nixpacks/Docker. Ensure they are synced or consolidate them.
