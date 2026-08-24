from app.config import settings
import uvicorn

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="localhost", port=5000, reload=settings.debug, log_level="info")